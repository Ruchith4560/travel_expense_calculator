import { CostPreview, FormErrors, TripFormData } from '../types/trip';

/**
 * Perform exact 2-decimal half-up rounding matching backend BigDecimal.setScale(2, RoundingMode.HALF_UP).
 */
export function roundToTwoDecimals(value: number): number {
  if (isNaN(value) || !isFinite(value)) return 0;
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

/**
 * Format numbers as localized currency strings with standard 2 decimal places.
 */
export function formatCurrency(amount: number, currencySymbol: string = '₹'): string {
  const rounded = roundToTwoDecimals(amount);
  const formattedNumber = new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(rounded);
  return `${currencySymbol}${formattedNumber}`;
}

/**
 * Real-time calculation of total cost, per-traveller share, and category percentage breakdown.
 */
export function calculateTripSummary(
  travel: number,
  accommodation: number,
  food: number,
  travellers: number
): CostPreview {
  const safeTravel = isNaN(travel) || travel < 0 ? 0 : travel;
  const safeAccommodation = isNaN(accommodation) || accommodation < 0 ? 0 : accommodation;
  const safeFood = isNaN(food) || food < 0 ? 0 : food;
  const safeTravellers = isNaN(travellers) || travellers <= 0 ? 0 : Math.floor(travellers);

  const totalCost = roundToTwoDecimals(safeTravel + safeAccommodation + safeFood);
  const costPerTraveller =
    safeTravellers > 0 ? roundToTwoDecimals(totalCost / safeTravellers) : 0;

  const travelPercent = totalCost > 0 ? Math.round((safeTravel / totalCost) * 100) : 0;
  const accommodationPercent =
    totalCost > 0 ? Math.round((safeAccommodation / totalCost) * 100) : 0;
  const foodPercent =
    totalCost > 0 ? Math.max(0, 100 - travelPercent - accommodationPercent) : 0;

  return {
    totalCost,
    costPerTraveller,
    travelPercent,
    accommodationPercent,
    foodPercent,
    isValid: safeTravellers > 0,
  };
}

/**
 * Validate form input values on the client before submission.
 */
export function validateTripForm(data: TripFormData): FormErrors {
  const errors: FormErrors = {};

  // Destination validation
  const trimmedDestination = data.destination.trim();
  if (!trimmedDestination) {
    errors.destination = 'Destination is required and cannot be blank.';
  } else if (trimmedDestination.length > 255) {
    errors.destination = 'Destination must be under 255 characters.';
  }

  // Days validation
  const daysNum = Number(data.days);
  if (data.days === '' || isNaN(daysNum)) {
    errors.days = 'Number of days is required.';
  } else if (!Number.isInteger(daysNum) || daysNum <= 0) {
    errors.days = 'Days must be an integer greater than zero.';
  }

  // Travellers validation
  const travellersNum = Number(data.travellers);
  if (data.travellers === '' || isNaN(travellersNum)) {
    errors.travellers = 'Number of travellers is required.';
  } else if (!Number.isInteger(travellersNum) || travellersNum <= 0) {
    errors.travellers = 'Travellers must be an integer greater than zero.';
  }

  // Travel expense validation
  const travelNum = Number(data.travelExpense);
  if (data.travelExpense === '' || isNaN(travelNum)) {
    errors.travelExpense = 'Travel expense is required.';
  } else if (travelNum < 0) {
    errors.travelExpense = 'Travel expense cannot be negative.';
  }

  // Accommodation expense validation
  const accommodationNum = Number(data.accommodationExpense);
  if (data.accommodationExpense === '' || isNaN(accommodationNum)) {
    errors.accommodationExpense = 'Accommodation expense is required.';
  } else if (accommodationNum < 0) {
    errors.accommodationExpense = 'Accommodation expense cannot be negative.';
  }

  // Food expense validation
  const foodNum = Number(data.foodExpense);
  if (data.foodExpense === '' || isNaN(foodNum)) {
    errors.foodExpense = 'Food expense is required.';
  } else if (foodNum < 0) {
    errors.foodExpense = 'Food expense cannot be negative.';
  }

  return errors;
}
