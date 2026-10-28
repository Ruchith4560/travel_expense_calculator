package com.travelexpense.calculator.repository;

import com.travelexpense.calculator.entity.Trip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data JPA repository for Trip persistence operations.
 */
@Repository
public interface TripRepository extends JpaRepository<Trip, Long> {

    /**
     * Retrieve all trips ordered by creation timestamp descending (newest first).
     *
     * @return List of Trip entities sorted newest first
     */
    List<Trip> findAllByOrderByCreatedAtDesc();
}
