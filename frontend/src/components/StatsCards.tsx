import React, { useMemo } from 'react';
import { Compass, TrendingUp, Users, Clock } from 'lucide-react';
import { Trip } from '../types/trip';
import { formatCurrency } from '../utils/calculator';

interface StatsCardsProps {
  trips: Trip[];
}

export const StatsCards: React.FC<StatsCardsProps> = ({ trips }) => {
  const stats = useMemo(() => {
    if (trips.length === 0) {
      return {
        totalTrips: 0,
        totalExpenditure: 0,
        avgCostPerTraveller: 0,
        avgDays: 0,
      };
    }

    const totalExpenditure = trips.reduce((sum, t) => sum + Number(t.totalCost || 0), 0);
    const totalDays = trips.reduce((sum, t) => sum + Number(t.days || 0), 0);
    const sumCostPerTraveller = trips.reduce((sum, t) => sum + Number(t.costPerTraveller || 0), 0);

    return {
      totalTrips: trips.length,
      totalExpenditure,
      avgCostPerTraveller: Math.round((sumCostPerTraveller / trips.length) * 100) / 100,
      avgDays: Math.round((totalDays / trips.length) * 10) / 10,
    };
  }, [trips]);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {/* Total Trips */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs hover:border-brand-200 hover:shadow-sm transition-all">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Trips Logged
          </span>
          <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center text-brand-600 border border-brand-100">
            <Compass className="w-4 h-4" />
          </div>
        </div>
        <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          {stats.totalTrips}
        </div>
        <p className="text-[11px] text-slate-400 mt-1">
          {stats.totalTrips === 1 ? '1 active record' : `${stats.totalTrips} active records`}
        </p>
      </div>

      {/* Cumulative Expenditure */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs hover:border-emerald-200 hover:shadow-sm transition-all">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Budget
          </span>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          {formatCurrency(stats.totalExpenditure)}
        </div>
        <p className="text-[11px] text-slate-400 mt-1">Across all logged journeys</p>
      </div>

      {/* Avg Cost Per Traveller */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs hover:border-indigo-200 hover:shadow-sm transition-all">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Avg / Traveller
          </span>
          <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div className="text-xl sm:text-2xl font-black text-indigo-600 tracking-tight">
          {formatCurrency(stats.avgCostPerTraveller)}
        </div>
        <p className="text-[11px] text-slate-400 mt-1">Average fair split</p>
      </div>

      {/* Avg Duration */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs hover:border-amber-200 hover:shadow-sm transition-all">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Avg Duration
          </span>
          <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 border border-amber-100">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          {stats.avgDays} <span className="text-sm font-semibold text-slate-500">days</span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1">Typical trip length</p>
      </div>
    </div>
  );
};
