import { Calculator, Users, TrendingUp, AlertCircle } from 'lucide-react';
import { CostPreview } from '../types/trip';
import { formatCurrency } from '../utils/calculator';

interface CostPreviewCardProps {
  preview: CostPreview;
  travellers: number;
}

export const CostPreviewCard = ({ preview, travellers }: CostPreviewCardProps) => {
  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 rounded-2xl p-6 text-white shadow-xl border border-slate-700/50 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute -top-12 -right-12 w-44 h-44 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-44 h-44 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center justify-between pb-4 border-b border-slate-700/60 mb-5">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-white/10 text-brand-300">
            <Calculator className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-white">Live Cost Preview</h3>
            <p className="text-xs text-slate-400">Dynamic client estimation</p>
          </div>
        </div>
        <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30">
          HALF_UP (2 dec)
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        {/* Total Cost Card */}
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-medium">Total Trip Cost</span>
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold tracking-tight text-white">
            {formatCurrency(preview.totalCost)}
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-mono">
            Travel + Stay + Food
          </p>
        </div>

        {/* Cost Per Traveller Card */}
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-medium">Per Traveller Share</span>
            <Users className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold tracking-tight text-indigo-300">
            {preview.isValid ? formatCurrency(preview.costPerTraveller) : '—'}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {travellers > 0 ? `Split evenly among ${travellers} person(s)` : 'Awaiting traveller count'}
          </p>
        </div>
      </div>

      {/* Visual Category Split Bar */}
      {preview.totalCost > 0 && (
        <div className="pt-2">
          <div className="flex items-center justify-between text-xs mb-1.5 text-slate-300">
            <span>Expense Distribution</span>
            <span className="text-[11px] text-slate-400">
              Travel {preview.travelPercent}% • Stay {preview.accommodationPercent}% • Food {preview.foodPercent}%
            </span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-white/10 flex overflow-hidden">
            <div
              style={{ width: `${preview.travelPercent}%` }}
              className="bg-sky-400 transition-all duration-300"
              title={`Travel: ${preview.travelPercent}%`}
            />
            <div
              style={{ width: `${preview.accommodationPercent}%` }}
              className="bg-indigo-400 transition-all duration-300"
              title={`Accommodation: ${preview.accommodationPercent}%`}
            />
            <div
              style={{ width: `${preview.foodPercent}%` }}
              className="bg-amber-400 transition-all duration-300"
              title={`Food: ${preview.foodPercent}%`}
            />
          </div>
        </div>
      )}

      {/* Invalid travellers warning */}
      {!preview.isValid && (
        <div className="mt-3 flex items-center gap-2 p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>Please set at least 1 traveller to calculate the cost per person.</span>
        </div>
      )}
    </div>
  );
};
