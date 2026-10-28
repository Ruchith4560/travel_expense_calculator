package com.travelexpense.calculator.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;

/**
 * Entity representing a planned or completed trip and its itemized expense records.
 */
@Entity
@Table(
    name = "trips",
    indexes = {
        @Index(name = "idx_trips_created_at_desc", columnList = "created_at DESC")
    }
)
public class Trip {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "destination", nullable = false, length = 255)
    private String destination;

    @Column(name = "days", nullable = false)
    private Integer days;

    @Column(name = "travellers", nullable = false)
    private Integer travellers;

    @Column(name = "travel_expense", nullable = false, precision = 12, scale = 2)
    private BigDecimal travelExpense;

    @Column(name = "accommodation_expense", nullable = false, precision = 12, scale = 2)
    private BigDecimal accommodationExpense;

    @Column(name = "food_expense", nullable = false, precision = 12, scale = 2)
    private BigDecimal foodExpense;

    @Column(name = "total_cost", nullable = false, precision = 12, scale = 2)
    private BigDecimal totalCost;

    @Column(name = "cost_per_traveller", nullable = false, precision = 12, scale = 2)
    private BigDecimal costPerTraveller;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    public Trip() {
    }

    public Trip(String destination, Integer days, Integer travellers,
                BigDecimal travelExpense, BigDecimal accommodationExpense, BigDecimal foodExpense,
                BigDecimal totalCost, BigDecimal costPerTraveller) {
        this.destination = destination;
        this.days = days;
        this.travellers = travellers;
        this.travelExpense = travelExpense;
        this.accommodationExpense = accommodationExpense;
        this.foodExpense = foodExpense;
        this.totalCost = totalCost;
        this.costPerTraveller = costPerTraveller;
    }

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = Instant.now();
        }
    }

    // Getters and Setters
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
