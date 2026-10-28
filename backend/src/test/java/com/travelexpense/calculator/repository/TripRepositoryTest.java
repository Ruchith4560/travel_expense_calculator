package com.travelexpense.calculator.repository;

import com.travelexpense.calculator.entity.Trip;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@ActiveProfiles("test")
class TripRepositoryTest {

    @Autowired
    private TripRepository tripRepository;

    @Test
    @DisplayName("Should persist trip entity and auto-generate ID and createdAt timestamp")
    void shouldPersistTripAndGenerateIdAndTimestamp() {
        Trip trip = new Trip(
                "Goa",
                4,
                2,
                new BigDecimal("6000.00"),
                new BigDecimal("8000.00"),
                new BigDecimal("3000.00"),
                new BigDecimal("17000.00"),
                new BigDecimal("8500.00")
        );

        Trip saved = tripRepository.save(trip);

        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getCreatedAt()).isNotNull();
        assertThat(saved.getDestination()).isEqualTo("Goa");
        assertThat(saved.getTotalCost()).isEqualByComparingTo("17000.00");
    }

    @Test
    @DisplayName("Should return all trips ordered by createdAt descending (newest first)")
    void shouldReturnTripsOrderedByCreatedAtDesc() throws InterruptedException {
        Trip trip1 = new Trip("Trip 1", 3, 1, BigDecimal.TEN, BigDecimal.TEN, BigDecimal.TEN, new BigDecimal("30.00"), new BigDecimal("30.00"));
        trip1.setCreatedAt(Instant.now().minusSeconds(100));
        tripRepository.save(trip1);

        Trip trip2 = new Trip("Trip 2", 5, 2, BigDecimal.TEN, BigDecimal.TEN, BigDecimal.TEN, new BigDecimal("30.00"), new BigDecimal("15.00"));
        trip2.setCreatedAt(Instant.now());
        tripRepository.save(trip2);

        List<Trip> orderedTrips = tripRepository.findAllByOrderByCreatedAtDesc();

        assertThat(orderedTrips).hasSize(2);
        assertThat(orderedTrips.get(0).getDestination()).isEqualTo("Trip 2");
        assertThat(orderedTrips.get(1).getDestination()).isEqualTo("Trip 1");
    }

    @Test
    @DisplayName("Should find trip by ID or return empty optional")
    void shouldFindTripById() {
        Trip trip = new Trip("Paris", 5, 2, new BigDecimal("1000.00"), new BigDecimal("2000.00"), new BigDecimal("500.00"), new BigDecimal("3500.00"), new BigDecimal("1750.00"));
        Trip saved = tripRepository.save(trip);

        Optional<Trip> found = tripRepository.findById(saved.getId());
        assertThat(found).isPresent();
        assertThat(found.get().getDestination()).isEqualTo("Paris");

        Optional<Trip> notFound = tripRepository.findById(99999L);
        assertThat(notFound).isEmpty();
    }

    @Test
    @DisplayName("Should delete trip by ID")
    void shouldDeleteTripById() {
        Trip trip = new Trip("Tokyo", 7, 1, new BigDecimal("1500.00"), new BigDecimal("2500.00"), new BigDecimal("800.00"), new BigDecimal("4800.00"), new BigDecimal("4800.00"));
        Trip saved = tripRepository.save(trip);
        Long id = saved.getId();

        tripRepository.deleteById(id);

        assertThat(tripRepository.findById(id)).isEmpty();
    }
}
