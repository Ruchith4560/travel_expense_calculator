import { useState, useEffect, useMemo, useRef } from 'react';
import { Header } from './components/Header';
import { TripForm } from './components/TripForm';
import { SavedTripsList } from './components/SavedTripsList';
import { StatsCards } from './components/StatsCards';
import { ToastContainer, ToastMessage } from './components/Toast';
import { Trip, TripFormData } from './types/trip';
import { tripApi } from './services/tripApi';
import {
  Sparkles,
  AlertCircle,
  RefreshCw,
  Search,
} from 'lucide-react';

export default function App() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoadingTrips, setIsLoadingTrips] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [apiStatus, setApiStatus] = useState<'connected' | 'connecting' | 'error'>('connecting');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [serverValidationErrors, setServerValidationErrors] = useState<Record<string, string>>({});

  const formRef = useRef<HTMLDivElement>(null);

  const addToast = (type: 'success' | 'error' | 'info', message: string) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Load trips from backend on component mount
  const loadTrips = async () => {
    setIsLoadingTrips(true);
    setErrorMessage(null);
    try {
      const data = await tripApi.getAllTrips();
      setTrips(data);
      setApiStatus('connected');
    } catch (err) {
      setApiStatus('error');
      const { message } = tripApi.extractApiError(err);
      setErrorMessage(message);
      addToast('error', `Failed to load trips: ${message}`);
    } finally {
      setIsLoadingTrips(false);
    }
  };

  useEffect(() => {
    loadTrips();
  }, []);

  // Handle form submission to backend REST API
  const handleCreateTrip = async (formData: TripFormData) => {
    setIsSubmitting(true);
    setServerValidationErrors({});
    setErrorMessage(null);

    try {
      const createdTrip = await tripApi.createTrip(formData);
      setTrips((prev) => [createdTrip, ...prev]);
      addToast(
        'success',
        `Trip to "${createdTrip.destination}" saved with authoritative total: ${createdTrip.totalCost}`
      );
    } catch (err) {
      const { message, validationErrors } = tripApi.extractApiError(err);
      if (validationErrors) {
        setServerValidationErrors(validationErrors);
      }
      setErrorMessage(message);
      addToast('error', message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle trip deletion
  const handleDeleteTrip = async (id: number) => {
    setDeletingId(id);
    try {
      await tripApi.deleteTrip(id);
      setTrips((prev) => prev.filter((t) => t.id !== id));
      addToast('info', 'Trip record deleted from database.');
    } catch (err) {
      const { message } = tripApi.extractApiError(err);
      setErrorMessage(`Failed to delete trip: ${message}`);
      addToast('error', `Delete failed: ${message}`);
    } finally {
      setDeletingId(null);
    }
  };

  // Filter trips by search query
  const filteredTrips = useMemo(() => {
    if (!searchQuery.trim()) return trips;
    const q = searchQuery.toLowerCase().trim();
    return trips.filter((t) => t.destination.toLowerCase().includes(q));
  }, [trips, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Header apiStatus={apiStatus} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Hero Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-200 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Full-Stack Spring Boot 3 + PostgreSQL Engine</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Travel Expense Calculator &{' '}
              <span className="bg-gradient-to-r from-brand-600 to-indigo-600 bg-clip-text text-transparent">
                Budget Planner
              </span>
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Estimate and record multi-category travel expenses with verified two-decimal currency precision and persistent database history.
            </p>
          </div>

          <button
            type="button"
            onClick={loadTrips}
            disabled={isLoadingTrips}
            className="self-start md:self-auto flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition cursor-pointer"
            title="Reload from backend"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingTrips ? 'animate-spin' : ''}`} />
            <span>Reload Trips</span>
          </button>
        </div>

        {/* Global Error Banner if backend is unavailable */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center justify-between shadow-xs animate-fade-in">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span className="text-sm font-medium">{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-xs text-rose-600 hover:text-rose-900 font-semibold cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Top KPI Metric Ribbon */}
        <StatsCards trips={trips} />

        {/* Search & Filter Bar */}
        {trips.length > 0 && (
          <div className="bg-white rounded-xl p-3 border border-slate-200/80 shadow-xs flex items-center gap-3">
            <Search className="w-4 h-4 text-slate-400 ml-2 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search saved trips by destination (e.g. 'Goa', 'Paris')..."
              className="w-full text-sm bg-transparent outline-none placeholder:text-slate-400 text-slate-800"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-xs text-slate-400 hover:text-slate-600 px-2 py-1 cursor-pointer font-medium"
              >
                Clear
              </button>
            )}
            <span className="text-xs text-slate-400 shrink-0 pr-2">
              Showing {filteredTrips.length} of {trips.length}
            </span>
          </div>
        )}

        {/* Main Application Layout: Form (Left) & Saved Trips (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div ref={formRef} className="lg:col-span-5">
            <TripForm
              onSubmit={handleCreateTrip}
              isLoading={isSubmitting}
              serverErrors={serverValidationErrors}
              onClearErrors={() => setServerValidationErrors({})}
            />
          </div>

          <div className="lg:col-span-7">
            <SavedTripsList
              trips={filteredTrips}
              isLoading={isLoadingTrips}
              onDeleteTrip={handleDeleteTrip}
              onRefresh={loadTrips}
              deletingId={deletingId}
              onSelectSample={() => {
                formRef.current?.scrollIntoView({ behavior: 'smooth' });
              }}
            />
          </div>
        </div>
      </main>

      {/* Floating Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
