import type { CanvasElement } from '../../App';

interface PropertiesPanelProps {
  element: CanvasElement | null;
  onUpdate: (updates: Partial<CanvasElement>) => void;
  onDelete: () => void;
}

export default function PropertiesPanel({ element, onUpdate, onDelete }: PropertiesPanelProps) {
  if (!element) {
    return (
      <aside className="w-64 bg-slate-800 border-l border-slate-700 p-4 text-slate-400 flex items-center justify-center text-sm italic select-none">
        Özellikleri görmek için bir eleman seçin
      </aside>
    );
  }

  return (
    <aside className="w-64 bg-slate-800 border-l border-slate-700 p-4 text-white flex flex-col gap-5 z-10 overflow-auto">
      <div>
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Eleman Özellikleri</h3>
        <p className="text-xs bg-slate-700/50 px-2 py-1 rounded text-slate-300 inline-block capitalize font-mono">
          Tip: {element.type}
        </p>
      </div>

      <hr className="border-slate-700" />

      {/* RENK AYARI (Görsel elementi hariç) */}
      {element.type !== 'image' && (
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-slate-400">Renk</label>
          <div className="flex items-center gap-3 bg-slate-700 p-2 rounded-lg border border-slate-600">
            <input
              type="color"
              value={element.color}
              onChange={(e) => onUpdate({ color: e.target.value })}
              className="w-8 h-8 rounded cursor-pointer bg-transparent border-none"
            />
            <span className="text-sm font-mono uppercase text-slate-300">{element.color}</span>
          </div>
        </div>
      )}

      {/* BOYUT AYARLARI (Metin hariç - metin otomatik büyür) */}
      {element.type !== 'text' && (
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-400">Genişlik (px)</label>
            <input
              type="number"
              value={element.width}
              onChange={(e) => onUpdate({ width: Number(e.target.value) })}
              className="bg-slate-700 border border-slate-600 rounded-lg p-2 text-sm focus:outline-none focus:border-blue-500 w-full font-mono text-center"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-400">Yükseklik (px)</label>
            <input
              type="number"
              value={element.height}
              onChange={(e) => onUpdate({ height: Number(e.target.value) })}
              className="bg-slate-700 border border-slate-600 rounded-lg p-2 text-sm focus:outline-none focus:border-blue-500 w-full font-mono text-center"
            />
          </div>
        </div>
      )}

      <hr className="border-slate-700 mt-auto" />

      {/* TEHLİKE BÖLGESİ / SİLME */}
      <button
        onClick={onDelete}
        className="w-full bg-red-600/20 hover:bg-red-600 border border-red-500/30 text-red-400 hover:text-white py-2 rounded-lg text-sm font-medium transition-all shadow-md shadow-red-950/20"
      >
        Elemanı Sil
      </button>
    </aside>
  );
}