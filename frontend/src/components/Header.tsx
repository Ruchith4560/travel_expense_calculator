import { Compass, ExternalLink, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  apiStatus?: 'connected' | 'connecting' | 'error';
}

export const Header = ({ apiStatus = 'connected' }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-slate-900 tracking-tight">VoyageLedger</span>
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-brand-50 text-brand-700 border border-brand-200">
                PRO
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              Precision Full-Stack Travel Budgeting Engine
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-slate-50 border border-slate-200 text-slate-600">
            <span
              className={`w-2 h-2 rounded-full ${
                apiStatus === 'connected'
                  ? 'bg-emerald-500 animate-pulse'
                  : apiStatus === 'connecting'
                  ? 'bg-amber-500'
                  : 'bg-rose-500'
              }`}
            />
            <span>{apiStatus === 'connected' ? 'Spring Boot API Ready' : 'Connecting to API'}</span>
          </div>

          <a
            href="https://github.com/Ruchith4560"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 transition"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>GitHub</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
        </div>
      </div>
    </header>
  );
};
