import type { CanvasElement } from '../../App';

interface SidebarProps {
  onDragStart: (e: React.DragEvent, type: CanvasElement['type']) => void;
}

export default function Sidebar({ onDragStart }: SidebarProps) {
  const tools: { id: CanvasElement['type']; label: string; icon: string }[] = [
    { id: 'text', label: 'Metin Ekle', icon: '📝' },
    { id: 'rect', label: 'Kare / Dikdörtgen', icon: '⬛' },
    { id: 'circle', label: 'Daire', icon: '⚪' },
    { id: 'image', label: 'Görsel Yükle', icon: '🖼️' },
  ];

  return (
    <aside className="w-72 bg-slate-800 border-r border-slate-700 p-4 text-white flex flex-col gap-4 z-10">
      <h2 className="text-lg font-semibold mb-2 text-slate-300">Bileşenler</h2>
      <div className="grid grid-cols-1 gap-2">
        {tools.map((tool) => (
          <div
            key={tool.id}
            draggable
            onDragStart={(e) => onDragStart(e, tool.id)}
            className="flex items-center gap-3 bg-slate-700 hover:bg-slate-600 p-3 rounded-lg cursor-grab active:cursor-grabbing transition-all border border-transparent hover:border-blue-500 shadow-md select-none"
          >
            <span className="text-xl">{tool.icon}</span>
            <span className="text-sm font-medium">{tool.label}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}