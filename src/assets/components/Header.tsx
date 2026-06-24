interface HeaderProps {
  onClear: () => void;
  onSave: () => void;
  currentView: 'editor' | 'dashboard';
  onViewChange: (view: 'editor' | 'dashboard') => void;
}

export default function Header({
  onClear,
  onSave,
  currentView,
  onViewChange
}: HeaderProps) {
  return (
    <header className="h-16 bg-slate-800 border-b border-slate-700 px-6 flex items-center justify-between select-none shrink-0 z-20">
      
      {/* Sol Kısım: Logo / Başlık */}
      <div className="flex items-center gap-3">
        <span className="text-xl">📐</span>
        <h1 className="font-extrabold text-sm tracking-wider uppercase text-slate-100">
          Resizer <span className="text-blue-500 text-xs font-mono lowercase">v2.0</span>
        </h1>
      </div>

      {/* Sağ Kısım: Sadece Editör Ekranındayken Görünecek İşlem Butonları */}
      {currentView === 'editor' && (
        <div className="flex items-center gap-3">
          <button
            onClick={onClear}
            className="px-4 py-2 bg-slate-900/60 hover:bg-red-950/40 text-slate-400 hover:text-red-400 border border-slate-700 hover:border-red-900/50 rounded-xl text-xs font-bold transition-all"
          >
            ❌ Tuvali Temizle
          </button>
          
          <button
            onClick={onSave}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/10 hover:shadow-blue-500/20 hover:-translate-y-0.5 active:translate-y-0 transition-all"
          >
            💾 Ayarları Kaydet
          </button>
        </div>
      )}

    </header>
  );
}