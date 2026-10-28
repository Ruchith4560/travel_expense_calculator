package com.travelexpense.calculator.service;

import com.travelexpense.calculator.dto.TripRequestDto;
import com.travelexpense.calculator.dto.TripResponseDto;

import java.util.List;

/**
 * Service interface defining trip management and calculation business logic.
 */
public interface TripService {

    /**
     * Create, validate, calculate authoritative totals, and persist a new trip.
     *
     * @param request Validated trip request payload
     * @return Saved trip response with calculated financial totals
     */
    TripResponseDto createTrip(TripRequestDto request);

    /**
     * Retrieve all saved trips ordered newest first.
     *
     * @return List of saved trip response DTOs
     */
    List<TripResponseDto> getAllTrips();

    /**
     * Retrieve a single trip by ID.
     *
     * @param id Trip identifier
     * @return Trip response DTO
     */
    TripResponseDto getTripById(Long id);

    /**
     * Delete a trip by ID.
     *
     * @param id Trip identifier
     */
    void deleteTrip(Long id);
}
