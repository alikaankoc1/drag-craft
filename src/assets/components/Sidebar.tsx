interface SidebarProps {
  onImageUpload: (src: string) => void;
  onSelectPreset: (width: number, height: number) => void;
  canvasWidth: number;
  canvasHeight: number;
  currentView: 'editor' | 'dashboard';
  onViewChange: (view: 'editor' | 'dashboard') => void;
}

export default function Sidebar({
  onImageUpload,
  onSelectPreset,
  canvasWidth,
  canvasHeight,
  currentView,
  onViewChange
}: SidebarProps) {
  
  // Sadece saf çözünürlük pikselleri ve oranlar
  const quickSizes = [
    { name: 'Kare (1:1)', w: 1080, h: 1080, desc: 'Instagram Gönderisi' },
    { name: 'Dikey (9:16)', w: 1080, h: 1920, desc: 'Story / Reels / Shorts' },
    { name: 'Yatay Standart (16:9)', w: 1920, h: 1080, desc: 'Full HD Monitör / Video' },
    { name: 'Geniş Ekran (21:9)', w: 2560, h: 1080, desc: 'UltraWide Monitör Düzeni' },
  ];

  return (
    <aside className="w-64 bg-slate-800 border-r border-slate-700 p-4 flex flex-col gap-6 select-none shrink-0 h-full">
      
      {/* Ekranlar Arası Hızlı Geçiş */}
      <div className="flex flex-col gap-2">
        <button
          onClick={() => onViewChange('dashboard')}
          className={`w-full py-2 px-3 rounded-lg text-xs font-bold text-left transition-all ${
            currentView === 'dashboard' ? 'bg-blue-600 text-white' : 'bg-slate-900/40 text-slate-400 hover:bg-slate-700/50'
          }`}
        >
          🎛️ Ana Panel / Yeni Görsel
        </button>
        <button
          onClick={() => onViewChange('editor')}
          className={`w-full py-2 px-3 rounded-lg text-xs font-bold text-left transition-all ${
            currentView === 'editor' ? 'bg-blue-600 text-white' : 'bg-slate-900/40 text-slate-400 hover:bg-slate-700/50'
          }`}
        >
          📐 Boyutlandırma Editörü
        </button>
      </div>

      <hr className="border-slate-700" />

      {/* SAF PİKSEL BOYUT ŞABLONLARI */}
      <div className="flex flex-col gap-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          📐 Hazır Boyut Şablonları
        </h3>
        <div className="flex flex-col gap-2">
          {quickSizes.map((size, index) => (
            <button
              key={index}
              onClick={() => onSelectPreset(size.w, size.h)}
              className={`w-full text-left bg-slate-900/50 border p-3 rounded-xl transition-all group ${
                canvasWidth === size.w && canvasHeight === size.h 
                  ? 'border-blue-500 bg-blue-500/5' 
                  : 'border-slate-700 hover:border-slate-600'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-200 group-hover:text-blue-400 transition-colors">
                  {size.name}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">{size.desc}</p>
              <div className="text-[11px] text-slate-500 font-mono mt-1.5 font-semibold">
                {size.w} × {size.h} px
              </div>
            </button>
          ))}
        </div>
      </div>

      <hr className="border-slate-700" />

      {/* GÖRSEL DEĞİŞTİRME */}
      <div className="flex flex-col gap-2 mt-auto">
        <label className="border border-dashed border-slate-600 hover:border-blue-500/50 transition-colors rounded-xl p-4 bg-slate-900/30 cursor-pointer flex flex-col items-center justify-center gap-2 text-center group">
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
          <span className="text-lg group-hover:scale-110 transition-transform">🔄</span>
          <span className="text-[11px] font-semibold text-slate-400">Görseli Değiştir / Yükle</span>
        </label>
      </div>

    </aside>
  );
}