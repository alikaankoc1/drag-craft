import type { CanvasElement } from '../../App';

interface PropertiesPanelProps {
  element: CanvasElement | null;
  onUpdate: (updates: Partial<CanvasElement>) => void;
  onDelete: () => void;
}

const FONT_FAMILIES = [
  { id: 'sans-serif', label: 'Sans Serif (Standart)' },
  { id: 'serif', label: 'Serif (Klasik)' },
  { id: 'monospace', label: 'Monospace (Kod)' },
  { id: 'cursive', label: 'Cursive (El Yazısı)' },
  { id: 'Georgia', label: 'Georgia' },
  { id: 'Impact', label: 'Impact (Kalın)' },
];

export default function PropertiesPanel({ element, onUpdate, onDelete }: PropertiesPanelProps) {
  if (!element) {
    return (
      <aside className="w-64 bg-slate-800 border-l border-slate-700 p-4 text-slate-400 flex items-center justify-center text-sm italic select-none" role="complementary" aria-label="Eleman özellikleri paneli">
        Özellikleri görmek için bir eleman seçin
      </aside>
    );
  }

  return (
    <aside className="w-64 bg-slate-800 border-l border-slate-700 p-4 text-white flex flex-col gap-5 z-10 overflow-auto" role="complementary" aria-label="Seçili eleman özellikleri">
      <div>
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Eleman Özellikleri</h3>
        <p className="text-xs bg-slate-700/50 px-2 py-1 rounded text-slate-300 inline-block capitalize font-mono">
          Tip: {element.type}
        </p>
      </div>

      <hr className="border-slate-700" />

      {/* METİN AYARLARI (Sadece yazı seçildiğinde gelir) */}
      {element.type === 'text' && (
        <div className="flex flex-col gap-4">
          {/* Font Family */}
          <div className="flex flex-col gap-1">
            <label htmlFor="font-family" className="text-xs font-medium text-slate-400">Yazı Tipi</label>
            <select
              id="font-family"
              value={element.fontFamily || 'sans-serif'}
              onChange={(e) => onUpdate({ fontFamily: e.target.value })}
              className="bg-slate-700 border border-slate-600 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 w-full text-slate-200 cursor-pointer"
              aria-label="Yazı tipini seç"
            >
              {FONT_FAMILIES.map((font) => (
                <option key={font.id} value={font.id} style={{ fontFamily: font.id }}>
                  {font.label}
                </option>
              ))}
            </select>
          </div>

          {/* Font Size */}
          <div className="flex flex-col gap-1">
            <label htmlFor="font-size" className="text-xs font-medium text-slate-400">Yazı Boyutu (px)</label>
            <div className="flex items-center bg-slate-700 rounded-lg border border-slate-600 px-2 focus-within:ring-2 focus-within:ring-blue-500/50">
              <input
                id="font-size"
                type="number"
                min="8"
                max="120"
                value={element.fontSize || 18}
                onChange={(e) => onUpdate({ fontSize: Number(e.target.value) })}
                className="bg-transparent border-none py-2 text-sm focus:outline-none w-full font-mono text-center text-slate-200"
                aria-label="Yazı boyutunu piksel cinsinden gir"
              />
              <span className="text-xs text-slate-400 font-mono pr-1" aria-hidden="true">px</span>
            </div>
          </div>
        </div>
      )}

      {/* RENK AYARI (Görsel elementi hariç her şeyde ortak) */}
      {element.type !== 'image' && (
        <div className="flex flex-col gap-2">
          <label htmlFor="color-picker" className="text-xs font-medium text-slate-400">Renk</label>
          <div className="flex items-center gap-3 bg-slate-700 p-2 rounded-lg border border-slate-600 focus-within:ring-2 focus-within:ring-blue-500/50">
            <input
              id="color-picker"
              type="color"
              value={element.color}
              onChange={(e) => onUpdate({ color: e.target.value })}
              className="w-8 h-8 rounded cursor-pointer bg-transparent border-none"
              aria-label="Renk seç"
            />
            <span className="text-sm font-mono uppercase text-slate-300" aria-live="polite">{element.color}</span>
          </div>
        </div>
      )}

      {/* BOYUT AYARLARI (Metin hariç) */}
      {element.type !== 'text' && (
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label htmlFor="width" className="text-xs font-medium text-slate-400">Genişlik (px)</label>
            <input
              id="width"
              type="number"
              value={element.width}
              onChange={(e) => onUpdate({ width: Number(e.target.value) })}
              className="bg-slate-700 border border-slate-600 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 w-full font-mono text-center"
              aria-label="Genişlik piksel cinsinden"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="height" className="text-xs font-medium text-slate-400">Yükseklik (px)</label>
            <input
              id="height"
              type="number"
              value={element.height}
              onChange={(e) => onUpdate({ height: Number(e.target.value) })}
              className="bg-slate-700 border border-slate-600 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 w-full font-mono text-center"
              aria-label="Yükseklik piksel cinsinden"
            />
          </div>
        </div>
      )}

      <hr className="border-slate-700 mt-auto" />

      {/* TEHLİKE BÖLGESİ / SİLME */}
      <button
        onClick={onDelete}
        className="w-full bg-red-600/20 hover:bg-red-600 border border-red-500/30 text-red-400 hover:text-white py-2 rounded-lg text-sm font-medium transition-all shadow-md shadow-red-950/20 focus:outline-none focus:ring-2 focus:ring-red-500/50"
        aria-label="Seçili öğeyi sil (Delete tuşu)"
      >
        Elemanı Sil
      </button>
    </aside>
  );
}