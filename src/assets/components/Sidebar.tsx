interface SidebarProps {
  currentView: 'editor' | 'dashboard' | 'history';
  onViewChange: (view: 'editor' | 'dashboard' | 'history') => void;
}

export default function Sidebar({
  currentView,
  onViewChange
}: SidebarProps) {
  
  return (
    <aside className="w-64 bg-slate-800 border-r border-slate-700 p-4 flex flex-col gap-6 select-none shrink-0 h-full">
      
      {/* 🧭 Panel Navigasyonu */}
      <div className="flex flex-col gap-2">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 px-1">
          Görünüm Modu
        </h3>
        <button
          onClick={() => onViewChange('dashboard')}
          className={`w-full py-2.5 px-3 rounded-lg text-xs font-bold text-left transition-all ${
            currentView === 'dashboard' ? 'bg-blue-600 text-white' : 'bg-slate-900/40 text-slate-400 hover:bg-slate-700/50'
          }`}
        >
          🎛️ Ana Giriş Paneli
        </button>
        <button
          onClick={() => onViewChange('editor')}
          className={`w-full py-2.5 px-3 rounded-lg text-xs font-bold text-left transition-all ${
            currentView === 'editor' ? 'bg-blue-600 text-white' : 'bg-slate-900/40 text-slate-400 hover:bg-slate-700/50'
          }`}
        >
          📐 Boyutlandırma Editörü
        </button>
      </div>

      {/* 📂 SOL ALTAKİ SABİT GEÇMİŞ BUTONU */}
      <div className="mt-auto pt-4 border-t border-slate-700/60">
        <button
          onClick={() => onViewChange('history')}
          className={`w-full py-3 px-3 rounded-xl text-xs font-bold text-left transition-all flex items-center justify-between border ${
            currentView === 'history' 
              ? 'bg-blue-600/20 text-blue-400 border-blue-500/50 shadow-lg' 
              : 'bg-slate-900/60 text-slate-300 border-slate-700 hover:border-slate-600 hover:bg-slate-700/30'
          }`}
        >
          <span className="flex items-center gap-2">📂 Geçmiş Çalışmalar</span>
          <span className="bg-slate-800 text-[10px] px-1.5 py-0.5 rounded-md text-slate-400 font-mono">
            v2.0
          </span>
        </button>
      </div>

    </aside>
  );
}