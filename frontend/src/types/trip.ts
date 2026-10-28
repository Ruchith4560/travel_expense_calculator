export interface Trip {
  id: number;
  destination: string;
  days: number;
  travellers: number;
  travelExpense: number;
  accommodationExpense: number;
  foodExpense: number;
  totalCost: number;
  costPerTraveller: number;
  createdAt: string;
}

export interface TripFormData {
  destination: string;
  days: string | number;
  travellers: string | number;
  travelExpense: string | number;
  accommodationExpense: string | number;
  foodExpense: string | number;
}

export interface CostPreview {
  totalCost: number;
  costPerTraveller: number;
  travelPercent: number;
  accommodationPercent: number;
  foodPercent: number;
  isValid: boolean;
}

export interface FormErrors {
  destination?: string;
  days?: string;
  travellers?: string;
  travelExpense?: string;
  accommodationExpense?: string;
  foodExpense?: string;
}

export interface ApiErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path?: string;
  validationErrors?: Record<string, string>;
}
