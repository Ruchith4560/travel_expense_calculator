package com.travelexpense.calculator.service.impl;

import com.travelexpense.calculator.dto.TripRequestDto;
import com.travelexpense.calculator.dto.TripResponseDto;
import com.travelexpense.calculator.entity.Trip;
import com.travelexpense.calculator.exception.InvalidTripException;
import com.travelexpense.calculator.exception.ResourceNotFoundException;
import com.travelexpense.calculator.repository.TripRepository;
import com.travelexpense.calculator.service.TripService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementation of TripService executing authoritative business calculations and persistence.
 */
@Service
public class TripServiceImpl implements TripService {

    private final TripRepository tripRepository;

    public TripServiceImpl(TripRepository tripRepository) {
        this.tripRepository = tripRepository;
    }

    @Override
    @Transactional
    public TripResponseDto createTrip(TripRequestDto request) {
        // Defense-in-depth sanitization and validation
        if (request.getDestination() == null || request.getDestination().trim().isEmpty()) {
            throw new InvalidTripException("Destination is required and cannot be blank");
        }
        String trimmedDestination = request.getDestination().trim();

        if (request.getDays() == null || request.getDays() <= 0) {
            throw new InvalidTripException("Days must be an integer greater than zero");
        }

        if (request.getTravellers() == null || request.getTravellers() <= 0) {
            throw new InvalidTripException("Travellers must be an integer greater than zero");
        }

        if (request.getTravelExpense() == null || request.getTravelExpense().compareTo(BigDecimal.ZERO) < 0) {
            throw new InvalidTripException("Travel expense cannot be negative");
        }

        if (request.getAccommodationExpense() == null || request.getAccommodationExpense().compareTo(BigDecimal.ZERO) < 0) {
            throw new InvalidTripException("Accommodation expense cannot be negative");
        }

        if (request.getFoodExpense() == null || request.getFoodExpense().compareTo(BigDecimal.ZERO) < 0) {
            throw new InvalidTripException("Food expense cannot be negative");
        }

        // Apply strict 2-decimal scaling with HALF_UP rounding
        BigDecimal travel = request.getTravelExpense().setScale(2, RoundingMode.HALF_UP);
        BigDecimal accommodation = request.getAccommodationExpense().setScale(2, RoundingMode.HALF_UP);
        BigDecimal food = request.getFoodExpense().setScale(2, RoundingMode.HALF_UP);

        // Business Rule: Total Trip Cost = travelExpense + accommodationExpense + foodExpense
        // (Days is stored as trip metadata and is not multiplied by expenses)
        BigDecimal totalCost = travel.add(accommodation).add(food).setScale(2, RoundingMode.HALF_UP);

        // Business Rule: Cost Per Traveller = totalTripCost / numberOfTravellers
        BigDecimal costPerTraveller = totalCost.divide(
                BigDecimal.valueOf(request.getTravellers()),
                2,
                RoundingMode.HALF_UP
        );

        Trip trip = new Trip(
                trimmedDestination,
                request.getDays(),
                request.getTravellers(),
                travel,
                accommodation,
                food,
                totalCost,
                costPerTraveller
        );

        Trip savedTrip = tripRepository.save(trip);
        return mapToDto(savedTrip);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TripResponseDto> getAllTrips() {
        return tripRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public TripResponseDto getTripById(Long id) {
        Trip trip = tripRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Trip with ID " + id + " not found"));
        return mapToDto(trip);
    }

    @Override
    @Transactional
    public void deleteTrip(Long id) {
        if (!tripRepository.existsById(id)) {
            throw new ResourceNotFoundException("Trip with ID " + id + " not found");
        }
        tripRepository.deleteById(id);
    }

    /**
     * Map Trip JPA entity to TripResponseDto.
     */
    private TripResponseDto mapToDto(Trip trip) {
        return new TripResponseDto(
                trip.getId(),
                trip.getDestination(),
                trip.getDays(),
                trip.getTravellers(),
                trip.getTravelExpense(),
                trip.getAccommodationExpense(),
                trip.getFoodExpense(),
                trip.getTotalCost(),
                trip.getCostPerTraveller(),
                trip.getCreatedAt()
        );
    }
}
