package com.travelexpense.calculator;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.travelexpense.calculator.dto.TripRequestDto;
import com.travelexpense.calculator.repository.TripRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Full-stack integration test verifying the complete lifecycle of Trip operations:
 * Create -> Persist in Relational DB -> Retrieve History -> Retrieve by ID -> Delete -> Verify Absence.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class TripIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private TripRepository tripRepository;

    @BeforeEach
    void setUp() {
        tripRepository.deleteAll();
    }

    @Test
    @DisplayName("E2E Full Stack Lifecycle: Create -> Persist -> Fetch List -> Fetch Single -> Delete -> 404 Not Found")
    void shouldExecuteCompleteTripLifecycle() throws Exception {
        // 1. Create a valid trip (Report Example)
        TripRequestDto request = new TripRequestDto(
                "Goa",
                4,
                2,
                new BigDecimal("6000.00"),
                new BigDecimal("8000.00"),
                new BigDecimal("3000.00")
        );

        MvcResult createResult = mockMvc.perform(post("/api/trips")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(header().string("Location", containsString("/api/trips/")))
                .andExpect(jsonPath("$.id").isNumber())
                .andExpect(jsonPath("$.destination").value("Goa"))
                .andExpect(jsonPath("$.days").value(4))
                .andExpect(jsonPath("$.travellers").value(2))
                .andExpect(jsonPath("$.totalCost").value(17000.00))
                .andExpect(jsonPath("$.costPerTraveller").value(8500.00))
                .andReturn();

        // Extract generated ID from JSON response
        String responseContent = createResult.getResponse().getContentAsString();
        Long tripId = objectMapper.readTree(responseContent).get("id").asLong();

        // Verify entity actually exists in repository
        assertThat(tripRepository.findById(tripId)).isPresent();
        assertThat(tripRepository.findById(tripId).get().getTotalCost()).isEqualByComparingTo("17000.00");

        // 2. Fetch all trips - verify list contains our newly created trip
        mockMvc.perform(get("/api/trips"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].id").value(tripId))
                .andExpect(jsonPath("$[0].destination").value("Goa"))
                .andExpect(jsonPath("$[0].totalCost").value(17000.00));

        // 3. Fetch specific trip by ID
        mockMvc.perform(get("/api/trips/" + tripId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(tripId))
                .andExpect(jsonPath("$.destination").value("Goa"))
                .andExpect(jsonPath("$.costPerTraveller").value(8500.00));

        // 4. Delete the trip
        mockMvc.perform(delete("/api/trips/" + tripId))
                .andExpect(status().isNoContent());

        // 5. Verify absence in database repository
        assertThat(tripRepository.findById(tripId)).isEmpty();

        // 6. Verify subsequent GET returns 404 Not Found
        mockMvc.perform(get("/api/trips/" + tripId))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.error").value("Not Found"))
                .andExpect(jsonPath("$.message").value("Trip with ID " + tripId + " not found"));
    }

    @Test
    @DisplayName("Should accept valid zero expenses on full stack")
    void shouldAcceptZeroExpensesE2E() throws Exception {
        TripRequestDto zeroExpenseRequest = new TripRequestDto(
                "Camping",
                2,
                3,
                BigDecimal.ZERO,
                BigDecimal.ZERO,
                BigDecimal.ZERO
        );

        mockMvc.perform(post("/api/trips")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(zeroExpenseRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.totalCost").value(0.00))
                .andExpect(jsonPath("$.costPerTraveller").value(0.00));
    }

    @Test
    @DisplayName("Should reject invalid request with negative expense and return 400 Bad Request")
    void shouldRejectNegativeExpenseE2E() throws Exception {
        TripRequestDto invalidRequest = new TripRequestDto(
                "Paris",
                5,
                2,
                new BigDecimal("-100.00"),
                BigDecimal.ZERO,
                BigDecimal.ZERO
        );

        mockMvc.perform(post("/api/trips")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.validationErrors.travelExpense").exists());
    }

    @Test
    @DisplayName("Actuator health check endpoint should return 200 OK and status UP")
    void shouldReturnActuatorHealthStatusUp() throws Exception {
        mockMvc.perform(get("/actuator/health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("UP"));
    }
}
