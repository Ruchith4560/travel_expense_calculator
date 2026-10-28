package com.travelexpense.calculator.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

/**
 * Data Transfer Object for creating and validating a trip expense request.
 */
public class TripRequestDto {

    @NotBlank(message = "Destination is required and cannot be blank")
    @Size(max = 255, message = "Destination must not exceed 255 characters")
    private String destination;

    @NotNull(message = "Number of days is required")
    @Min(value = 1, message = "Days must be an integer greater than zero")
    private Integer days;

    @NotNull(message = "Number of travellers is required")
    @Min(value = 1, message = "Travellers must be an integer greater than zero")
    private Integer travellers;

    @NotNull(message = "Travel expense is required")
    @DecimalMin(value = "0.00", inclusive = true, message = "Travel expense cannot be negative")
    @Digits(integer = 10, fraction = 2, message = "Travel expense must have at most 2 decimal places")
    private BigDecimal travelExpense;

    @NotNull(message = "Accommodation expense is required")
    @DecimalMin(value = "0.00", inclusive = true, message = "Accommodation expense cannot be negative")
    @Digits(integer = 10, fraction = 2, message = "Accommodation expense must have at most 2 decimal places")
    private BigDecimal accommodationExpense;

    @NotNull(message = "Food expense is required")
    @DecimalMin(value = "0.00", inclusive = true, message = "Food expense cannot be negative")
    @Digits(integer = 10, fraction = 2, message = "Food expense must have at most 2 decimal places")
    private BigDecimal foodExpense;

    public TripRequestDto() {
    }

    public TripRequestDto(String destination, Integer days, Integer travellers,
                          BigDecimal travelExpense, BigDecimal accommodationExpense, BigDecimal foodExpense) {
        this.destination = destination;
        this.days = days;
        this.travellers = travellers;
        this.travelExpense = travelExpense;
        this.accommodationExpense = accommodationExpense;
        this.foodExpense = foodExpense;
    }

    public String getDestination() {
        return destination;
    }

    public void setDestination(String destination) {
        this.destination = destination;
    }

    public Integer getDays() {
        return days;
    }

    public void setDays(Integer days) {
        this.days = days;
    }

    public Integer getTravellers() {
        return travellers;
    }

    public void setTravellers(Integer travellers) {
        this.travellers = travellers;
    }

    public BigDecimal getTravelExpense() {
        return travelExpense;
    }

    public void setTravelExpense(BigDecimal travelExpense) {
        this.travelExpense = travelExpense;
    }

    public BigDecimal getAccommodationExpense() {
        return accommodationExpense;
    }

    public void setAccommodationExpense(BigDecimal accommodationExpense) {
        this.accommodationExpense = accommodationExpense;
    }

    public BigDecimal getFoodExpense() {
        return foodExpense;
    }

    public void setFoodExpense(BigDecimal foodExpense) {
        this.foodExpense = foodExpense;
    }
}
