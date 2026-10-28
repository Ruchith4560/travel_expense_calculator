import test from 'node:test';
import assert from 'node:assert/strict';

// Import compiled functions or replicate exact logic to test independently
function roundToTwoDecimals(value) {
  if (isNaN(value) || !isFinite(value)) return 0;
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function calculateTripSummary(travel, accommodation, food, travellers) {
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

function validateTripForm(data) {
  const errors = {};

  const trimmedDestination = (data.destination || '').trim();
  if (!trimmedDestination) {
    errors.destination = 'Destination is required and cannot be blank.';
  } else if (trimmedDestination.length > 255) {
    errors.destination = 'Destination must be under 255 characters.';
  }

  const daysNum = Number(data.days);
  if (data.days === '' || isNaN(daysNum)) {
    errors.days = 'Number of days is required.';
  } else if (!Number.isInteger(daysNum) || daysNum <= 0) {
    errors.days = 'Days must be an integer greater than zero.';
  }

  const travellersNum = Number(data.travellers);
  if (data.travellers === '' || isNaN(travellersNum)) {
    errors.travellers = 'Number of travellers is required.';
  } else if (!Number.isInteger(travellersNum) || travellersNum <= 0) {
    errors.travellers = 'Travellers must be an integer greater than zero.';
  }

  const travelNum = Number(data.travelExpense);
  if (data.travelExpense === '' || isNaN(travelNum)) {
    errors.travelExpense = 'Travel expense is required.';
  } else if (travelNum < 0) {
    errors.travelExpense = 'Travel expense cannot be negative.';
  }

  const accommodationNum = Number(data.accommodationExpense);
  if (data.accommodationExpense === '' || isNaN(accommodationNum)) {
    errors.accommodationExpense = 'Accommodation expense is required.';
  } else if (accommodationNum < 0) {
    errors.accommodationExpense = 'Accommodation expense cannot be negative.';
  }

  const foodNum = Number(data.foodExpense);
  if (data.foodExpense === '' || isNaN(foodNum)) {
    errors.foodExpense = 'Food expense is required.';
  } else if (foodNum < 0) {
    errors.foodExpense = 'Food expense cannot be negative.';
  }

  return errors;
}

test('Report Example: Goa with 6000 travel, 8000 stay, 3000 food, 2 travellers', () => {
  const result = calculateTripSummary(6000, 8000, 3000, 2);
  assert.equal(result.totalCost, 17000);
  assert.equal(result.costPerTraveller, 8500);
  assert.equal(result.isValid, true);
  assert.equal(result.travelPercent, 35);
  assert.equal(result.accommodationPercent, 47);
  assert.equal(result.foodPercent, 18);
});

test('Exact half-up rounding on recurring fractions: 100 / 3 = 33.33', () => {
  const result = calculateTripSummary(100, 0, 0, 3);
  assert.equal(result.totalCost, 100);
  assert.equal(result.costPerTraveller, 33.33);
});

test('Zero expenses handling: free trip should result in 0.00', () => {
  const result = calculateTripSummary(0, 0, 0, 4);
  assert.equal(result.totalCost, 0);
  assert.equal(result.costPerTraveller, 0);
  assert.equal(result.isValid, true);
});

test('Zero travellers should flag invalid and prevent division by zero', () => {
  const result = calculateTripSummary(1000, 1000, 1000, 0);
  assert.equal(result.totalCost, 3000);
  assert.equal(result.costPerTraveller, 0);
  assert.equal(result.isValid, false);
});

test('Validation: Rejects blank destination', () => {
  const errors = validateTripForm({
    destination: '   ',
    days: 4,
    travellers: 2,
    travelExpense: 100,
    accommodationExpense: 100,
    foodExpense: 100,
  });
  assert.ok(errors.destination);
});

test('Validation: Rejects zero or negative days and travellers', () => {
  const errorsDays = validateTripForm({
    destination: 'Goa',
    days: 0,
    travellers: 2,
    travelExpense: 100,
    accommodationExpense: 100,
    foodExpense: 100,
  });
  assert.ok(errorsDays.days);

  const errorsTravellers = validateTripForm({
    destination: 'Goa',
    days: 3,
    travellers: -1,
    travelExpense: 100,
    accommodationExpense: 100,
    foodExpense: 100,
  });
  assert.ok(errorsTravellers.travellers);
});

test('Validation: Rejects negative expense values', () => {
  const errors = validateTripForm({
    destination: 'Goa',
    days: 4,
    travellers: 2,
    travelExpense: -50,
    accommodationExpense: 100,
    foodExpense: 100,
  });
  assert.ok(errors.travelExpense);
});

test('Validation: Passes for fully valid data', () => {
  const errors = validateTripForm({
    destination: 'Goa',
    days: 4,
    travellers: 2,
    travelExpense: 6000,
    accommodationExpense: 8000,
    foodExpense: 3000,
  });
  assert.equal(Object.keys(errors).length, 0);
});
