package com.travelexpense.calculator.controller;

import com.travelexpense.calculator.dto.TripRequestDto;
import com.travelexpense.calculator.dto.TripResponseDto;
import com.travelexpense.calculator.service.TripService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

/**
 * REST controller exposing endpoints for trip expense calculation and management.
 */
@RestController
@RequestMapping("/api/trips")
public class TripController {

    private final TripService tripService;

    public TripController(TripService tripService) {
        this.tripService = tripService;
    }

    /**
     * Create and persist a new trip with calculated total and per-traveller costs.
     *
     * @param request Validated trip request payload
     * @return 201 Created with Location header and TripResponseDto
     */
    @PostMapping
    public ResponseEntity<TripResponseDto> createTrip(@Valid @RequestBody TripRequestDto request) {
        TripResponseDto created = tripService.createTrip(request);

        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(created.getId())
                .toUri();

        return ResponseEntity.created(location).body(created);
    }

    /**
     * Retrieve all saved trips ordered newest first.
     *
     * @return 200 OK with list of saved trips
     */
    @GetMapping
    public ResponseEntity<List<TripResponseDto>> getAllTrips() {
        List<TripResponseDto> trips = tripService.getAllTrips();
        return ResponseEntity.ok(trips);
    }

    /**
     * Retrieve a specific trip by its ID.
     *
     * @param id Trip ID
     * @return 200 OK with the trip data or 404 Not Found
     */
    @GetMapping("/{id}")
    public ResponseEntity<TripResponseDto> getTripById(@PathVariable Long id) {
        TripResponseDto trip = tripService.getTripById(id);
        return ResponseEntity.ok(trip);
    }

    /**
     * Delete a saved trip by its ID.
     *
     * @param id Trip ID
     * @return 204 No Content
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTrip(@PathVariable Long id) {
        tripService.deleteTrip(id);
        return ResponseEntity.noContent().build();
    }
}
