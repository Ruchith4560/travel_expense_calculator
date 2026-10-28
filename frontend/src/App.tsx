import { useState } from 'react';
import { Header } from './components/Header';
import { TripForm } from './components/TripForm';
import { Trip, TripFormData } from './types/trip';
import { calculateTripSummary, formatCurrency } from './utils/calculator';
import { CheckCircle2, Sparkles, MapPin, Calendar, Users, DollarSign } from 'lucide-react';

export default function App() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleFormSubmit = (formData: TripFormData) => {
    const summary = calculateTripSummary(
      Number(formData.travelExpense),
      Number(formData.accommodationExpense),
      Number(formData.foodExpense),
      Number(formData.travellers)
    );

    const newTrip: Trip = {
      id: Date.now(),
      destination: formData.destination.trim(),
      days: Number(formData.days),
      travellers: Number(formData.travellers),
      travelExpense: Number(formData.travelExpense),
      accommodationExpense: Number(formData.accommodationExpense),
      foodExpense: Number(formData.foodExpense),
      totalCost: summary.totalCost,
      costPerTraveller: summary.costPerTraveller,
      createdAt: new Date().toISOString(),
    };

    setTrips((prev) => [newTrip, ...prev]);
    setSuccessMessage(`Trip to "${newTrip.destination}" calculated and logged successfully!`);
    setTimeout(() => setSuccessMessage(null), 5000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="mb-8 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-200 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Trip Budgeting Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Plan Expenses. Split Fairly. <br />
            <span className="bg-gradient-to-r from-brand-600 to-indigo-600 bg-clip-text text-transparent">
              Travel Without Surprises.
            </span>
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Real-time multi-category expense aggregation with exact two-decimal financial rounding and per-person cost allocation.
          </p>
        </div>

        {/* Success Alert */}
        {successMessage && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-between shadow-sm animate-fade-in">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span className="text-sm font-medium">{successMessage}</span>
            </div>
            <button
              onClick={() => setSuccessMessage(null)}
              className="text-xs text-emerald-600 hover:text-emerald-900 font-semibold cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form */}
          <div className="lg:col-span-7">
            <TripForm onSubmit={handleFormSubmit} />
          </div>

          {/* Right Column: Preview / Recently Calculated Trips */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <h3 className="font-bold text-sm text-slate-900">Recently Estimated Trips</h3>
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  {trips.length} {trips.length === 1 ? 'Trip' : 'Trips'}
                </span>
              </div>

              {trips.length === 0 ? (
                <div className="py-12 text-center">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-3">
                    <DollarSign className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-semibold text-slate-700">No trips calculated yet</h4>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">
                    Fill out the form on the left to calculate total costs and view real-time estimates.
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                  {trips.map((trip) => (
                    <div
                      key={trip.id}
                      className="p-4 rounded-xl border border-slate-200 hover:border-brand-200 hover:bg-brand-50/20 transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-1.5 font-bold text-sm text-slate-900">
                            <MapPin className="w-3.5 h-3.5 text-brand-600" />
                            <span>{trip.destination}</span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" /> {trip.days} {trip.days === 1 ? 'day' : 'days'}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="w-3 h-3" /> {trip.travellers} {trip.travellers === 1 ? 'traveller' : 'travellers'}
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-base font-extrabold text-slate-900">
                            {formatCurrency(trip.totalCost)}
                          </div>
                          <div className="text-xs font-semibold text-brand-600">
                            {formatCurrency(trip.costPerTraveller)} / person
                          </div>
                        </div>
                      </div>

                      {/* Itemized tags */}
                      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                        <span>Travel: {formatCurrency(trip.travelExpense)}</span>
                        <span>Stay: {formatCurrency(trip.accommodationExpense)}</span>
                        <span>Food: {formatCurrency(trip.foodExpense)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Math Card */}
            <div className="bg-slate-100 rounded-2xl p-5 border border-slate-200 text-xs text-slate-600 space-y-2">
              <span className="font-semibold text-slate-800 block">Verified Business Formulas:</span>
              <p className="font-mono bg-white p-2 rounded-lg border border-slate-200 text-slate-700">
                Total = Travel + Accommodation + Food
              </p>
              <p className="font-mono bg-white p-2 rounded-lg border border-slate-200 text-slate-700">
                Per Traveller = Total / Travellers (HALF_UP)
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
