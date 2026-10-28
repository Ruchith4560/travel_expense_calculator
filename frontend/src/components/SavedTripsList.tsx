import React, { useState, useMemo } from 'react';
import {
  MapPin,
  Calendar,
  Users,
  Trash2,
  Table as TableIcon,
  LayoutGrid,
  Plane,
  Hotel,
  Utensils,
  AlertTriangle,
  FolderOpen,
  Loader2,
  ArrowUpDown,
  Sparkles,
} from 'lucide-react';
import { Trip } from '../types/trip';
import { formatCurrency } from '../utils/calculator';

interface SavedTripsListProps {
  trips: Trip[];
  isLoading: boolean;
  onDeleteTrip: (id: number) => Promise<void>;
  onRefresh: () => void;
  deletingId?: number | null;
  onSelectSample?: () => void;
}

type SortOption = 'newest' | 'cost-desc' | 'cost-asc' | 'days-desc';

export const SavedTripsList: React.FC<SavedTripsListProps> = ({
  trips,
  isLoading,
  onDeleteTrip,
  deletingId,
  onSelectSample,
}) => {
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }).format(date);
    } catch {
      return dateString;
    }
  };

  // Sort trips
  const sortedTrips = useMemo(() => {
    const list = [...trips];
    switch (sortBy) {
      case 'cost-desc':
        return list.sort((a, b) => Number(b.totalCost) - Number(a.totalCost));
      case 'cost-asc':
        return list.sort((a, b) => Number(a.totalCost) - Number(b.totalCost));
      case 'days-desc':
        return list.sort((a, b) => Number(b.days) - Number(a.days));
      case 'newest':
      default:
        return list.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }
  }, [trips, sortBy]);

  return (
    <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden">
      {/* List Header */}
      <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">Saved Trips & Summaries</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-200">
              {trips.length} {trips.length === 1 ? 'Trip' : 'Trips'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Persisted in PostgreSQL database • Calculated on Spring Boot backend
          </p>
        </div>

        {/* View Controls & Sort */}
        <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
          {/* Sort Selector */}
          {trips.length > 1 && (
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-600">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="bg-transparent font-medium text-slate-700 outline-none cursor-pointer text-xs"
              >
                <option value="newest">Newest First</option>
                <option value="cost-desc">Total: High to Low</option>
                <option value="cost-asc">Total: Low to High</option>
                <option value="days-desc">Longest Duration</option>
              </select>
            </div>
          )}

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                viewMode === 'cards'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cards</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Table</span>
            </button>
          </div>
        </div>
      </div>

      {/* Loading Skeletons */}
      {isLoading ? (
        <div className="p-6 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse bg-slate-50 rounded-xl p-5 border border-slate-100">
              <div className="h-4 bg-slate-200 rounded w-1/3 mb-3"></div>
              <div className="h-3 bg-slate-200 rounded w-1/4 mb-4"></div>
              <div className="grid grid-cols-3 gap-4">
                <div className="h-8 bg-slate-200 rounded"></div>
                <div className="h-8 bg-slate-200 rounded"></div>
                <div className="h-8 bg-slate-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : trips.length === 0 ? (
        /* Empty State */
        <div className="p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-brand-50 flex items-center justify-center text-brand-600 mx-auto mb-4 border border-brand-100">
            <FolderOpen className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No saved trips found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-6">
            You haven't logged any trips yet. Enter your trip parameters and expenses on the left to save your first calculation!
          </p>
          {onSelectSample && (
            <button
              type="button"
              onClick={onSelectSample}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-700 text-xs font-semibold border border-brand-200 transition cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Load Goa Sample Data</span>
            </button>
          )}
        </div>
      ) : viewMode === 'cards' ? (
        /* Cards View */
        <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {sortedTrips.map((trip) => (
            <div
              key={trip.id}
              className="group relative rounded-xl border border-slate-200 hover:border-brand-300 hover:shadow-md transition-all p-5 bg-white flex flex-col justify-between"
            >
              <div>
                {/* Trip Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h3 className="font-bold text-base text-slate-900 group-hover:text-brand-600 transition flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-brand-500 shrink-0" />
                      <span>{trip.destination}</span>
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {trip.days} {trip.days === 1 ? 'day' : 'days'}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Users className="w-3 h-3" /> {trip.travellers} {trip.travellers === 1 ? 'person' : 'people'}
                      </span>
                    </div>
                  </div>

                  <span className="text-[11px] font-medium text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100 whitespace-nowrap">
                    {formatDate(trip.createdAt)}
                  </span>
                </div>

                {/* Primary Cost Highlights */}
                <div className="grid grid-cols-2 gap-3 my-4 p-3 rounded-xl bg-slate-50/80 border border-slate-100">
                  <div>
                    <span className="text-[11px] font-medium text-slate-500 block">Total Trip Cost</span>
                    <span className="text-lg font-bold text-slate-900">
                      {formatCurrency(trip.totalCost)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] font-medium text-brand-600 block">Cost Per Person</span>
                    <span className="text-lg font-bold text-brand-600">
                      {formatCurrency(trip.costPerTraveller)}
                    </span>
                  </div>
                </div>

                {/* Itemized Categories */}
                <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-slate-500">
                      <Plane className="w-3.5 h-3.5 text-sky-500" /> Travel
                    </span>
                    <span className="font-medium text-slate-800">{formatCurrency(trip.travelExpense)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-slate-500">
                      <Hotel className="w-3.5 h-3.5 text-indigo-500" /> Stay
                    </span>
                    <span className="font-medium text-slate-800">{formatCurrency(trip.accommodationExpense)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-slate-500">
                      <Utensils className="w-3.5 h-3.5 text-amber-500" /> Food
                    </span>
                    <span className="font-medium text-slate-800">{formatCurrency(trip.foodExpense)}</span>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end">
                {confirmDeleteId === trip.id ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-rose-600 font-medium flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" /> Confirm delete?
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        onDeleteTrip(trip.id);
                        setConfirmDeleteId(null);
                      }}
                      disabled={deletingId === trip.id}
                      className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition cursor-pointer"
                    >
                      {deletingId === trip.id ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Yes'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(null)}
                      className="px-2 py-1 rounded-lg border border-slate-200 text-xs text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                    >
                      No
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmDeleteId(trip.id)}
                    className="flex items-center gap-1 text-xs text-slate-400 hover:text-rose-600 transition px-2 py-1 rounded-md hover:bg-rose-50 cursor-pointer"
                    title="Delete trip"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Destination</th>
                <th className="py-3.5 px-4 font-semibold text-center">Duration</th>
                <th className="py-3.5 px-4 font-semibold text-center">Travellers</th>
                <th className="py-3.5 px-4 font-semibold text-right">Travel</th>
                <th className="py-3.5 px-4 font-semibold text-right">Stay</th>
                <th className="py-3.5 px-4 font-semibold text-right">Food</th>
                <th className="py-3.5 px-4 font-semibold text-right">Total Cost</th>
                <th className="py-3.5 px-4 font-semibold text-right">Per Person</th>
                <th className="py-3.5 px-4 font-semibold text-center">Date</th>
                <th className="py-3.5 px-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {sortedTrips.map((trip) => (
                <tr key={trip.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3.5 px-4 font-semibold text-slate-900 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                    <span>{trip.destination}</span>
                  </td>
                  <td className="py-3.5 px-4 text-center text-xs">
                    {trip.days} {trip.days === 1 ? 'day' : 'days'}
                  </td>
                  <td className="py-3.5 px-4 text-center text-xs">
                    {trip.travellers} {trip.travellers === 1 ? 'person' : 'people'}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-xs">{formatCurrency(trip.travelExpense)}</td>
                  <td className="py-3.5 px-4 text-right font-mono text-xs">{formatCurrency(trip.accommodationExpense)}</td>
                  <td className="py-3.5 px-4 text-right font-mono text-xs">{formatCurrency(trip.foodExpense)}</td>
                  <td className="py-3.5 px-4 text-right font-bold text-slate-900 font-mono">
                    {formatCurrency(trip.totalCost)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-brand-600 font-mono">
                    {formatCurrency(trip.costPerTraveller)}
                  </td>
                  <td className="py-3.5 px-4 text-center text-xs text-slate-500 whitespace-nowrap">
                    {formatDate(trip.createdAt)}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {confirmDeleteId === trip.id ? (
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            onDeleteTrip(trip.id);
                            setConfirmDeleteId(null);
                          }}
                          className="px-2 py-0.5 rounded bg-rose-600 text-white text-xs font-semibold cursor-pointer"
                        >
                          Confirm
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(null)}
                          className="px-1.5 py-0.5 rounded border border-slate-200 text-xs text-slate-600 cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(trip.id)}
                        className="text-slate-400 hover:text-rose-600 transition p-1 rounded hover:bg-rose-50 cursor-pointer inline-flex items-center justify-center"
                        title="Delete trip"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
