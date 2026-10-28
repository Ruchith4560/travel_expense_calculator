import { Compass, Sparkles } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-6 text-center">
      <div className="w-16 h-16 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-600 shadow-sm border border-brand-100 mb-4">
        <Compass className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">
        VoyageLedger
      </h1>
      <p className="text-slate-600 max-w-md mb-6">
        Full-Stack Travel Expense Calculator with Spring Boot REST API & React TypeScript.
      </p>
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium border border-emerald-200">
        <Sparkles className="w-4 h-4" />
        Phase 1 Scaffolding Ready
      </div>
    </div>
  );
}
