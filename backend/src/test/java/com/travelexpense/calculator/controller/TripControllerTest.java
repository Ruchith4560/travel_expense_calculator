package com.travelexpense.calculator.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.travelexpense.calculator.dto.TripRequestDto;
import com.travelexpense.calculator.dto.TripResponseDto;
import com.travelexpense.calculator.exception.ResourceNotFoundException;
import com.travelexpense.calculator.service.TripService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(TripController.class)
class TripControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private TripService tripService;

    @Test
    @DisplayName("POST /api/trips should return 201 Created with Location header and calculated summary")
    void shouldCreateTripSuccessfully() throws Exception {
        TripRequestDto request = new TripRequestDto(
                "Goa",
                4,
                2,
                new BigDecimal("6000.00"),
                new BigDecimal("8000.00"),
                new BigDecimal("3000.00")
        );

        TripResponseDto response = new TripResponseDto(
                1L,
                "Goa",
                4,
                2,
                new BigDecimal("6000.00"),
                new BigDecimal("8000.00"),
                new BigDecimal("3000.00"),
                new BigDecimal("17000.00"),
                new BigDecimal("8500.00"),
                Instant.now()
        );

        when(tripService.createTrip(any(TripRequestDto.class))).thenReturn(response);

        mockMvc.perform(post("/api/trips")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(header().string("Location", containsString("/api/trips/1")))
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.destination").value("Goa"))
                .andExpect(jsonPath("$.days").value(4))
                .andExpect(jsonPath("$.travellers").value(2))
                .andExpect(jsonPath("$.totalCost").value(17000.00))
                .andExpect(jsonPath("$.costPerTraveller").value(8500.00));
    }

    @Test
    @DisplayName("POST /api/trips should return 400 Bad Request when validation fails")
    void shouldReturn400OnInvalidRequest() throws Exception {
        TripRequestDto invalidRequest = new TripRequestDto(
                "", // Blank destination
                0,  // Invalid days (must be > 0)
                -1, // Invalid travellers (must be > 0)
                new BigDecimal("-50.00"), // Negative expense
                new BigDecimal("8000.00"),
                new BigDecimal("3000.00")
        );

        mockMvc.perform(post("/api/trips")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.error").value("Bad Request"))
                .andExpect(jsonPath("$.validationErrors.destination").exists())
                .andExpect(jsonPath("$.validationErrors.days").exists())
                .andExpect(jsonPath("$.validationErrors.travellers").exists())
                .andExpect(jsonPath("$.validationErrors.travelExpense").exists());

        verify(tripService, never()).createTrip(any());
    }

    @Test
    @DisplayName("GET /api/trips should return 200 OK with list of saved trips")
    void shouldReturnAllTrips() throws Exception {
        TripResponseDto trip = new TripResponseDto(
                1L, "Goa", 4, 2,
                new BigDecimal("6000.00"), new BigDecimal("8000.00"), new BigDecimal("3000.00"),
                new BigDecimal("17000.00"), new BigDecimal("8500.00"),
                Instant.now()
        );

        when(tripService.getAllTrips()).thenReturn(List.of(trip));

        mockMvc.perform(get("/api/trips"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].destination").value("Goa"));
    }

    @Test
    @DisplayName("GET /api/trips/{id} should return 200 OK when trip exists")
    void shouldReturnTripByIdWhenFound() throws Exception {
        TripResponseDto trip = new TripResponseDto(
                1L, "Goa", 4, 2,
                new BigDecimal("6000.00"), new BigDecimal("8000.00"), new BigDecimal("3000.00"),
                new BigDecimal("17000.00"), new BigDecimal("8500.00"),
                Instant.now()
        );

        when(tripService.getTripById(1L)).thenReturn(trip);

        mockMvc.perform(get("/api/trips/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.destination").value("Goa"));
    }

    @Test
    @DisplayName("GET /api/trips/{id} should return 404 Not Found when trip is missing")
    void shouldReturn404WhenTripNotFound() throws Exception {
        when(tripService.getTripById(99L)).thenThrow(new ResourceNotFoundException("Trip with ID 99 not found"));

        mockMvc.perform(get("/api/trips/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.error").value("Not Found"))
                .andExpect(jsonPath("$.message").value("Trip with ID 99 not found"));
    }

    @Test
    @DisplayName("DELETE /api/trips/{id} should return 204 No Content")
    void shouldDeleteTripSuccessfully() throws Exception {
        doNothing().when(tripService).deleteTrip(1L);

        mockMvc.perform(delete("/api/trips/1"))
                .andExpect(status().isNoContent());

        verify(tripService).deleteTrip(1L);
    }
}
