import React, { useMemo } from 'react';
import { PieChart, Plane, Hotel, Utensils, Zap } from 'lucide-react';
import { Trip } from '../types/trip';
import { formatCurrency, roundToTwoDecimals } from '../utils/calculator';

interface ExpenseAnalyticsCardProps {
  trips: Trip[];
}

export const ExpenseAnalyticsCard: React.FC<ExpenseAnalyticsCardProps> = ({ trips }) => {
  const analytics = useMemo(() => {
    if (trips.length === 0) {
      return {
        totalTravel: 0,
        totalStay: 0,
        totalFood: 0,
        grandTotal: 0,
        travelPct: 0,
        stayPct: 0,
        foodPct: 0,
        avgDailyBurn: 0,
      };
    }

    const totalTravel = trips.reduce((sum, t) => sum + Number(t.travelExpense || 0), 0);
    const totalStay = trips.reduce((sum, t) => sum + Number(t.accommodationExpense || 0), 0);
    const totalFood = trips.reduce((sum, t) => sum + Number(t.foodExpense || 0), 0);
    const grandTotal = totalTravel + totalStay + totalFood;
    const totalDays = trips.reduce((sum, t) => sum + Number(t.days || 0), 0);

    const travelPct = grandTotal > 0 ? Math.round((totalTravel / grandTotal) * 100) : 0;
    const stayPct = grandTotal > 0 ? Math.round((totalStay / grandTotal) * 100) : 0;
    const foodPct = grandTotal > 0 ? Math.max(0, 100 - travelPct - stayPct) : 0;
    const avgDailyBurn = totalDays > 0 ? roundToTwoDecimals(grandTotal / totalDays) : 0;

    return {
      totalTravel,
      totalStay,
      totalFood,
      grandTotal,
      travelPct,
      stayPct,
      foodPct,
      avgDailyBurn,
    };
  }, [trips]);

  if (trips.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100">
            <PieChart className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 tracking-tight">Portfolio Expense Allocation</h3>
            <p className="text-xs text-slate-500">Aggregate categorical distribution</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600">
          <Zap className="w-3.5 h-3.5 text-amber-500" />
          <span className="font-semibold">{formatCurrency(analytics.avgDailyBurn)}</span>
          <span className="text-slate-400">/ day burn</span>
        </div>
      </div>

      {/* Segmented Bar */}
      <div className="space-y-1.5 mb-4">
        <div className="w-full h-3.5 rounded-full bg-slate-100 flex overflow-hidden p-0.5 border border-slate-200/70">
          <div
            style={{ width: `${analytics.travelPct}%` }}
            className="h-full rounded-l-full bg-sky-500 transition-all duration-500"
            title={`Travel: ${analytics.travelPct}%`}
          />
          <div
            style={{ width: `${analytics.stayPct}%` }}
            className="h-full bg-indigo-500 transition-all duration-500"
            title={`Accommodation: ${analytics.stayPct}%`}
          />
          <div
            style={{ width: `${analytics.foodPct}%` }}
            className="h-full rounded-r-full bg-amber-500 transition-all duration-500"
            title={`Food: ${analytics.foodPct}%`}
          />
        </div>
      </div>

      {/* Category Breakdown Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Travel */}
        <div className="p-3 rounded-xl bg-sky-50/60 border border-sky-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Plane className="w-4 h-4 text-sky-600 shrink-0" />
            <div>
              <span className="text-[11px] font-semibold text-slate-500 block">Travel / Transit</span>
              <span className="text-xs font-bold text-slate-900">{formatCurrency(analytics.totalTravel)}</span>
            </div>
          </div>
          <span className="text-xs font-extrabold text-sky-700 bg-white px-2 py-0.5 rounded-md border border-sky-200/60">
            {analytics.travelPct}%
          </span>
        </div>

        {/* Accommodation */}
        <div className="p-3 rounded-xl bg-indigo-50/60 border border-indigo-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Hotel className="w-4 h-4 text-indigo-600 shrink-0" />
            <div>
              <span className="text-[11px] font-semibold text-slate-500 block">Accommodation</span>
              <span className="text-xs font-bold text-slate-900">{formatCurrency(analytics.totalStay)}</span>
            </div>
          </div>
          <span className="text-xs font-extrabold text-indigo-700 bg-white px-2 py-0.5 rounded-md border border-indigo-200/60">
            {analytics.stayPct}%
          </span>
        </div>

        {/* Food */}
        <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Utensils className="w-4 h-4 text-amber-600 shrink-0" />
            <div>
              <span className="text-[11px] font-semibold text-slate-500 block">Food & Dining</span>
              <span className="text-xs font-bold text-slate-900">{formatCurrency(analytics.totalFood)}</span>
            </div>
          </div>
          <span className="text-xs font-extrabold text-amber-700 bg-white px-2 py-0.5 rounded-md border border-amber-200/60">
            {analytics.foodPct}%
          </span>
        </div>
      </div>
    </div>
  );
};
