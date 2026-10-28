import React, { useState, useMemo } from 'react';
import {
  MapPin,
  Calendar,
  Users,
  Plane,
  Hotel,
  Utensils,
  PlusCircle,
  RotateCcw,
  AlertCircle,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { FormErrors, TripFormData } from '../types/trip';
import { calculateTripSummary, validateTripForm } from '../utils/calculator';
import { CostPreviewCard } from './CostPreviewCard';

interface TripFormProps {
  onSubmit: (data: TripFormData) => Promise<void> | void;
  isLoading?: boolean;
  serverErrors?: Record<string, string>;
  onClearErrors?: () => void;
}

const initialFormState: TripFormData = {
  destination: '',
  days: 4,
  travellers: 2,
  travelExpense: 6000,
  accommodationExpense: 8000,
  foodExpense: 3000,
};

const presets: { label: string; data: TripFormData }[] = [
  {
    label: 'Goa Getaway (Report Example)',
    data: {
      destination: 'Goa',
      days: 4,
      travellers: 2,
      travelExpense: 6000,
      accommodationExpense: 8000,
      foodExpense: 3000,
    },
  },
  {
    label: 'Solo Trek',
    data: {
      destination: 'Manali',
      days: 5,
      travellers: 1,
      travelExpense: 3500,
      accommodationExpense: 5000,
      foodExpense: 2500,
    },
  },
  {
    label: 'Friends Trip',
    data: {
      destination: 'Jaipur',
      days: 3,
      travellers: 4,
      travelExpense: 8000,
      accommodationExpense: 12000,
      foodExpense: 6000,
    },
  },
];

export const TripForm: React.FC<TripFormProps> = ({
  onSubmit,
  isLoading = false,
  serverErrors = {},
  onClearErrors,
}) => {
  const [formData, setFormData] = useState<TripFormData>(initialFormState);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Real-time calculation preview
  const preview = useMemo(() => {
    return calculateTripSummary(
      Number(formData.travelExpense),
      Number(formData.accommodationExpense),
      Number(formData.foodExpense),
      Number(formData.travellers)
    );
  }, [formData.travelExpense, formData.accommodationExpense, formData.foodExpense, formData.travellers]);

  // Client-side validation errors
  const clientErrors = useMemo(() => {
    return validateTripForm(formData);
  }, [formData]);

  // Merge client and server errors
  const errors: FormErrors = useMemo(() => {
    const combined: FormErrors = { ...clientErrors };
    if (serverErrors) {
      Object.entries(serverErrors).forEach(([field, msg]) => {
        (combined as Record<string, string>)[field] = msg;
      });
    }
    return combined;
  }, [clientErrors, serverErrors]);

  const hasErrors = Object.keys(errors).length > 0;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (onClearErrors && serverErrors[name]) {
      onClearErrors();
    }
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleApplyPreset = (presetData: TripFormData) => {
    setFormData(presetData);
    setTouched({});
    if (onClearErrors) onClearErrors();
  };

  const handleReset = () => {
    setFormData({
      destination: '',
      days: 1,
      travellers: 1,
      travelExpense: 0,
      accommodationExpense: 0,
      foodExpense: 0,
    });
    setTouched({});
    if (onClearErrors) onClearErrors();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setTouched({
      destination: true,
      days: true,
      travellers: true,
      travelExpense: true,
      accommodationExpense: true,
      foodExpense: true,
    });

    if (hasErrors) {
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-2xl p-5 sm:p-7 shadow-xs border border-slate-200/80">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">Create Trip & Estimate</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Enter trip parameters to calculate authoritative totals
            </p>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>

        {/* Quick Presets for Demo Reviewers */}
        <div className="mb-5 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            <span>Quick Demo Presets:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {presets.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => handleApplyPreset(p.data)}
                className="text-xs font-medium px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-brand-50 hover:text-brand-700 hover:border-brand-200 border border-transparent transition cursor-pointer text-slate-700"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Section 1: Trip Parameters */}
        <div className="space-y-4 mb-6">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            1. Trip Parameters
          </h3>

          <div>
            <label htmlFor="destination" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Destination City / Country <span className="text-rose-500">*</span>
            </label>
            <div className="relative rounded-xl shadow-xs">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <MapPin className="w-4 h-4" />
              </div>
              <input
                type="text"
                id="destination"
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                onBlur={() => handleBlur('destination')}
                placeholder="e.g. Goa, India or Paris, France"
                className={`block w-full rounded-xl pl-9 pr-4 py-2.5 text-sm bg-slate-50/70 border transition focus:bg-white focus:outline-none focus:ring-2 ${
                  touched.destination && errors.destination
                    ? 'border-rose-300 text-rose-900 focus:ring-rose-500 focus:border-rose-500'
                    : 'border-slate-200 text-slate-900 focus:ring-brand-500 focus:border-brand-500'
                }`}
              />
            </div>
            {touched.destination && errors.destination && (
              <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> {errors.destination}
              </p>
            )}
            {formData.destination.trim() !== formData.destination && formData.destination.length > 0 && (
              <p className="mt-1 text-[11px] text-slate-400">
                Extra whitespace will be automatically trimmed on save.
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="days" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Trip Duration (Days) <span className="text-rose-500">*</span>
              </label>
              <div className="relative rounded-xl shadow-xs">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Calendar className="w-4 h-4" />
                </div>
                <input
                  type="number"
                  id="days"
                  name="days"
                  min="1"
                  step="1"
                  value={formData.days}
                  onChange={handleChange}
                  onBlur={() => handleBlur('days')}
                  className={`block w-full rounded-xl pl-9 pr-4 py-2.5 text-sm bg-slate-50/70 border transition focus:bg-white focus:outline-none focus:ring-2 ${
                    touched.days && errors.days
                      ? 'border-rose-300 text-rose-900 focus:ring-rose-500 focus:border-rose-500'
                      : 'border-slate-200 text-slate-900 focus:ring-brand-500 focus:border-brand-500'
                  }`}
                />
              </div>
              {touched.days && errors.days && (
                <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.days}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="travellers" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Number of Travellers <span className="text-rose-500">*</span>
              </label>
              <div className="relative rounded-xl shadow-xs">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Users className="w-4 h-4" />
                </div>
                <input
                  type="number"
                  id="travellers"
                  name="travellers"
                  min="1"
                  step="1"
                  value={formData.travellers}
                  onChange={handleChange}
                  onBlur={() => handleBlur('travellers')}
                  className={`block w-full rounded-xl pl-9 pr-4 py-2.5 text-sm bg-slate-50/70 border transition focus:bg-white focus:outline-none focus:ring-2 ${
                    touched.travellers && errors.travellers
                      ? 'border-rose-300 text-rose-900 focus:ring-rose-500 focus:border-rose-500'
                      : 'border-slate-200 text-slate-900 focus:ring-brand-500 focus:border-brand-500'
                  }`}
                />
              </div>
              {touched.travellers && errors.travellers && (
                <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.travellers}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Section 2: Expense Breakdown */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              2. Total Trip Expenses
            </h3>
            <span className="text-[11px] text-slate-400">
              Total combined expense for the journey
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Travel Expense */}
            <div>
              <label htmlFor="travelExpense" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Travel / Transit <span className="text-rose-500">*</span>
              </label>
              <div className="relative rounded-xl shadow-xs">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Plane className="w-4 h-4" />
                </div>
                <input
                  type="number"
                  id="travelExpense"
                  name="travelExpense"
                  min="0"
                  step="0.01"
                  value={formData.travelExpense}
                  onChange={handleChange}
                  onBlur={() => handleBlur('travelExpense')}
                  className={`block w-full rounded-xl pl-9 pr-4 py-2.5 text-sm bg-slate-50/70 border transition focus:bg-white focus:outline-none focus:ring-2 ${
                    touched.travelExpense && errors.travelExpense
                      ? 'border-rose-300 text-rose-900 focus:ring-rose-500 focus:border-rose-500'
                      : 'border-slate-200 text-slate-900 focus:ring-brand-500 focus:border-brand-500'
                  }`}
                />
              </div>
              {touched.travelExpense && errors.travelExpense && (
                <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.travelExpense}
                </p>
              )}
            </div>

            {/* Accommodation Expense */}
            <div>
              <label htmlFor="accommodationExpense" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Accommodation <span className="text-rose-500">*</span>
              </label>
              <div className="relative rounded-xl shadow-xs">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Hotel className="w-4 h-4" />
                </div>
                <input
                  type="number"
                  id="accommodationExpense"
                  name="accommodationExpense"
                  min="0"
                  step="0.01"
                  value={formData.accommodationExpense}
                  onChange={handleChange}
                  onBlur={() => handleBlur('accommodationExpense')}
                  className={`block w-full rounded-xl pl-9 pr-4 py-2.5 text-sm bg-slate-50/70 border transition focus:bg-white focus:outline-none focus:ring-2 ${
                    touched.accommodationExpense && errors.accommodationExpense
                      ? 'border-rose-300 text-rose-900 focus:ring-rose-500 focus:border-rose-500'
                      : 'border-slate-200 text-slate-900 focus:ring-brand-500 focus:border-brand-500'
                  }`}
                />
              </div>
              {touched.accommodationExpense && errors.accommodationExpense && (
                <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.accommodationExpense}
                </p>
              )}
            </div>

            {/* Food Expense */}
            <div>
              <label htmlFor="foodExpense" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Food & Dining <span className="text-rose-500">*</span>
              </label>
              <div className="relative rounded-xl shadow-xs">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Utensils className="w-4 h-4" />
                </div>
                <input
                  type="number"
                  id="foodExpense"
                  name="foodExpense"
                  min="0"
                  step="0.01"
                  value={formData.foodExpense}
                  onChange={handleChange}
                  onBlur={() => handleBlur('foodExpense')}
                  className={`block w-full rounded-xl pl-9 pr-4 py-2.5 text-sm bg-slate-50/70 border transition focus:bg-white focus:outline-none focus:ring-2 ${
                    touched.foodExpense && errors.foodExpense
                      ? 'border-rose-300 text-rose-900 focus:ring-rose-500 focus:border-rose-500'
                      : 'border-slate-200 text-slate-900 focus:ring-brand-500 focus:border-brand-500'
                  }`}
                />
              </div>
              {touched.foodExpense && errors.foodExpense && (
                <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.foodExpense}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Live Cost Preview Component */}
        <div className="mt-8">
          <CostPreviewCard preview={preview} travellers={Number(formData.travellers)} />
        </div>

        {/* Form Actions */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="submit"
            disabled={isLoading || (touched.destination && hasErrors)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white font-semibold text-sm shadow-md shadow-brand-500/20 hover:shadow-lg hover:shadow-brand-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Persisting to Database...</span>
              </>
            ) : (
              <>
                <PlusCircle className="w-4 h-4" />
                <span>Save Trip & Confirm Totals</span>
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};
