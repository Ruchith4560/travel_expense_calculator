package com.travelexpense.calculator.exception;

/**
 * Exception thrown when trip data fails business validation checks.
 */
public class InvalidTripException extends RuntimeException {

    public InvalidTripException(String message) {
        super(message);
    }
}
