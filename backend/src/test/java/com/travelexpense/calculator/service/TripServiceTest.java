package com.travelexpense.calculator.service;

import com.travelexpense.calculator.dto.TripRequestDto;
import com.travelexpense.calculator.dto.TripResponseDto;
import com.travelexpense.calculator.entity.Trip;
import com.travelexpense.calculator.exception.InvalidTripException;
import com.travelexpense.calculator.exception.ResourceNotFoundException;
import com.travelexpense.calculator.repository.TripRepository;
import com.travelexpense.calculator.service.impl.TripServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TripServiceTest {

    @Mock
    private TripRepository tripRepository;

    private TripService tripService;

    @BeforeEach
    void setUp() {
        tripService = new TripServiceImpl(tripRepository);
    }

    @Test
    @DisplayName("Should create trip and calculate correct total and per-traveller costs (Report Example)")
    void shouldCreateTripWithCorrectCalculations() {
        // Given: travel = 6000, accommodation = 8000, food = 3000, travellers = 2
        TripRequestDto request = new TripRequestDto(
                "Goa",
                4,
                2,
                new BigDecimal("6000.00"),
                new BigDecimal("8000.00"),
                new BigDecimal("3000.00")
        );

        Trip savedEntity = new Trip(
                "Goa",
                4,
                2,
                new BigDecimal("6000.00"),
                new BigDecimal("8000.00"),
                new BigDecimal("3000.00"),
                new BigDecimal("17000.00"),
                new BigDecimal("8500.00")
        );
        savedEntity.setId(1L);
        savedEntity.setCreatedAt(Instant.now());

        when(tripRepository.save(any(Trip.class))).thenReturn(savedEntity);

        // When
        TripResponseDto response = tripService.createTrip(request);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo(1L);
        assertThat(response.getDestination()).isEqualTo("Goa");
        assertThat(response.getDays()).isEqualTo(4);
        assertThat(response.getTravellers()).isEqualTo(2);
        assertThat(response.getTotalCost()).isEqualByComparingTo("17000.00");
        assertThat(response.getCostPerTraveller()).isEqualByComparingTo("8500.00");

        ArgumentCaptor<Trip> captor = ArgumentCaptor.forClass(Trip.class);
        verify(tripRepository).save(captor.capture());
        Trip captured = captor.getValue();
        assertThat(captured.getTotalCost()).isEqualByComparingTo("17000.00");
        assertThat(captured.getCostPerTraveller()).isEqualByComparingTo("8500.00");
    }

    @Test
    @DisplayName("Should trim extra spaces from destination")
    void shouldTrimDestinationSpaces() {
        TripRequestDto request = new TripRequestDto(
                "   Paris, France   ",
                5,
                1,
                new BigDecimal("500.00"),
                new BigDecimal("800.00"),
                new BigDecimal("300.00")
        );

        when(tripRepository.save(any(Trip.class))).thenAnswer(invocation -> {
            Trip arg = invocation.getArgument(0);
            arg.setId(10L);
            return arg;
        });

        TripResponseDto response = tripService.createTrip(request);

        assertThat(response.getDestination()).isEqualTo("Paris, France");
    }

    @Test
    @DisplayName("Should correctly round per-traveller cost using HALF_UP policy on repeating fractions")
    void shouldRoundPerTravellerCostHalfUp() {
        // 100.00 / 3 = 33.3333... -> 33.33
        TripRequestDto request = new TripRequestDto(
                "Tokyo",
                3,
                3,
                new BigDecimal("100.00"),
                BigDecimal.ZERO,
                BigDecimal.ZERO
        );

        when(tripRepository.save(any(Trip.class))).thenAnswer(invocation -> invocation.getArgument(0));

        TripResponseDto response = tripService.createTrip(request);

        assertThat(response.getTotalCost()).isEqualByComparingTo("100.00");
        assertThat(response.getCostPerTraveller()).isEqualByComparingTo("33.33");
    }

    @Test
    @DisplayName("Should accept valid zero expenses")
    void shouldAcceptZeroExpenses() {
        TripRequestDto request = new TripRequestDto(
                "Camping Site",
                2,
                4,
                BigDecimal.ZERO,
                BigDecimal.ZERO,
                BigDecimal.ZERO
        );

        when(tripRepository.save(any(Trip.class))).thenAnswer(invocation -> invocation.getArgument(0));

        TripResponseDto response = tripService.createTrip(request);

        assertThat(response.getTotalCost()).isEqualByComparingTo("0.00");
        assertThat(response.getCostPerTraveller()).isEqualByComparingTo("0.00");
    }

    @Test
    @DisplayName("Should reject blank destination")
    void shouldRejectBlankDestination() {
        TripRequestDto request = new TripRequestDto(
                "   ",
                2,
                1,
                BigDecimal.TEN,
                BigDecimal.TEN,
                BigDecimal.TEN
        );

        assertThatThrownBy(() -> tripService.createTrip(request))
                .isInstanceOf(InvalidTripException.class)
                .hasMessageContaining("Destination is required");
    }

    @Test
    @DisplayName("Should reject zero or negative days")
    void shouldRejectZeroOrNegativeDays() {
        TripRequestDto zeroDays = new TripRequestDto("Rome", 0, 1, BigDecimal.TEN, BigDecimal.TEN, BigDecimal.TEN);
        assertThatThrownBy(() -> tripService.createTrip(zeroDays))
                .isInstanceOf(InvalidTripException.class)
                .hasMessageContaining("Days must be an integer greater than zero");

        TripRequestDto negativeDays = new TripRequestDto("Rome", -2, 1, BigDecimal.TEN, BigDecimal.TEN, BigDecimal.TEN);
        assertThatThrownBy(() -> tripService.createTrip(negativeDays))
                .isInstanceOf(InvalidTripException.class)
                .hasMessageContaining("Days must be an integer greater than zero");
    }

    @Test
    @DisplayName("Should reject zero or negative travellers to prevent division by zero")
    void shouldRejectZeroOrNegativeTravellers() {
        TripRequestDto zeroTravellers = new TripRequestDto("Rome", 3, 0, BigDecimal.TEN, BigDecimal.TEN, BigDecimal.TEN);
        assertThatThrownBy(() -> tripService.createTrip(zeroTravellers))
                .isInstanceOf(InvalidTripException.class)
                .hasMessageContaining("Travellers must be an integer greater than zero");

        TripRequestDto negativeTravellers = new TripRequestDto("Rome", 3, -1, BigDecimal.TEN, BigDecimal.TEN, BigDecimal.TEN);
        assertThatThrownBy(() -> tripService.createTrip(negativeTravellers))
                .isInstanceOf(InvalidTripException.class)
                .hasMessageContaining("Travellers must be an integer greater than zero");
    }

    @Test
    @DisplayName("Should reject negative expense amounts")
    void shouldRejectNegativeExpenses() {
        TripRequestDto negTravel = new TripRequestDto("Rome", 3, 2, new BigDecimal("-1.00"), BigDecimal.ZERO, BigDecimal.ZERO);
        assertThatThrownBy(() -> tripService.createTrip(negTravel))
                .isInstanceOf(InvalidTripException.class)
                .hasMessageContaining("Travel expense cannot be negative");

        TripRequestDto negStay = new TripRequestDto("Rome", 3, 2, BigDecimal.ZERO, new BigDecimal("-10.00"), BigDecimal.ZERO);
        assertThatThrownBy(() -> tripService.createTrip(negStay))
                .isInstanceOf(InvalidTripException.class)
                .hasMessageContaining("Accommodation expense cannot be negative");

        TripRequestDto negFood = new TripRequestDto("Rome", 3, 2, BigDecimal.ZERO, BigDecimal.ZERO, new BigDecimal("-5.00"));
        assertThatThrownBy(() -> tripService.createTrip(negFood))
                .isInstanceOf(InvalidTripException.class)
                .hasMessageContaining("Food expense cannot be negative");
    }

    @Test
    @DisplayName("Should retrieve saved trip by ID")
    void shouldGetTripById() {
        Trip trip = new Trip("Berlin", 3, 1, new BigDecimal("100.00"), new BigDecimal("200.00"), new BigDecimal("50.00"), new BigDecimal("350.00"), new BigDecimal("350.00"));
        trip.setId(5L);
        when(tripRepository.findById(5L)).thenReturn(Optional.of(trip));

        TripResponseDto result = tripService.getTripById(5L);

        assertThat(result.getId()).isEqualTo(5L);
        assertThat(result.getDestination()).isEqualTo("Berlin");
    }

    @Test
    @DisplayName("Should throw ResourceNotFoundException when trip ID does not exist")
    void shouldThrowWhenTripNotFound() {
        when(tripRepository.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> tripService.getTripById(999L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Trip with ID 999 not found");
    }

    @Test
    @DisplayName("Should delete existing trip by ID")
    void shouldDeleteTripById() {
        when(tripRepository.existsById(3L)).thenReturn(true);
        doNothing().when(tripRepository).deleteById(3L);

        tripService.deleteTrip(3L);

        verify(tripRepository).deleteById(3L);
    }
}
