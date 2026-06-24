interface SidebarProps {
  onImageUpload: (src: string) => void;
  currentView: 'editor' | 'dashboard' | 'history';
  onViewChange: (view: 'editor' | 'dashboard' | 'history') => void;
}

export default function Sidebar({
  onImageUpload,
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

      <hr className="border-slate-700" />

      {/* 🔄 HIZLI GÖRSEL DEĞİŞTİRME / YÜKLEME ALANI */}
      <div className="flex flex-col gap-2">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 px-1">
          Görsel Yönetimi
        </h3>
        <label className="border border-dashed border-slate-600 hover:border-blue-500/50 transition-colors rounded-xl p-5 bg-slate-900/30 cursor-pointer flex flex-col items-center justify-center gap-2 text-center group">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                  if (event.target?.result) onImageUpload(event.target.result as string);
                };
                reader.readAsDataURL(file);
              }
            }}
            className="hidden"
          />
          <span className="text-xl group-hover:scale-110 transition-transform">🔄</span>
          <span className="text-[11px] font-bold text-slate-300">Yeni Görsel Yükle</span>
        </label>
      </div>

      {/* 📂 SOL ALTTALİ SABİT GEÇMİŞ BUTONU */}
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
            Sürüm 2.0
          </span>
        </button>
      </div>

    </aside>
  );
}