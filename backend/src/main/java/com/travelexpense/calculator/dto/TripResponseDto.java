package com.travelexpense.calculator.dto;

import java.math.BigDecimal;
import java.time.Instant;

/**
 * Data Transfer Object representing a saved trip with calculated financial summaries.
 */
public class TripResponseDto {

    private Long id;
    private String destination;
    private Integer days;
    private Integer travellers;
    private BigDecimal travelExpense;
    private BigDecimal accommodationExpense;
    private BigDecimal foodExpense;
    private BigDecimal totalCost;
    private BigDecimal costPerTraveller;
    private Instant createdAt;

    public TripResponseDto() {
    }

    public TripResponseDto(Long id, String destination, Integer days, Integer travellers,
                           BigDecimal travelExpense, BigDecimal accommodationExpense, BigDecimal foodExpense,
                           BigDecimal totalCost, BigDecimal costPerTraveller, Instant createdAt) {
        this.id = id;
        this.destination = destination;
        this.days = days;
        this.travellers = travellers;
        this.travelExpense = travelExpense;
        this.accommodationExpense = accommodationExpense;
        this.foodExpense = foodExpense;
        this.totalCost = totalCost;
        this.costPerTraveller = costPerTraveller;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public BigDecimal getTotalCost() {
        return totalCost;
    }

    public void setTotalCost(BigDecimal totalCost) {
        this.totalCost = totalCost;
    }

    public BigDecimal getCostPerTraveller() {
        return costPerTraveller;
    }

    public void setCostPerTraveller(BigDecimal costPerTraveller) {
        this.costPerTraveller = costPerTraveller;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
