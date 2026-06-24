import { useRef } from 'react';
import type { CanvasElement } from '../../App';
import TemplateSelector from './TemplateSelector'; // Yeni şablon seçiciyi dahil ediyoruz

interface SidebarProps {
  onDragStart: (e: React.DragEvent, type: CanvasElement['type']) => void;
  onImageUpload: (src: string) => void;
  currentView: 'editor' | 'dashboard';
  onViewChange: (view: 'editor' | 'dashboard') => void;
  onSelectPreset: (width: number, height: number) => void; // Yeni prop
  canvasWidth: number;                                    // Yeni prop
  canvasHeight: number;                                   // Yeni prop
}

export default function Sidebar({ 
  onDragStart, 
  onImageUpload, 
  currentView, 
  onViewChange,
  onSelectPreset,
  canvasWidth,
  canvasHeight
}: SidebarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const tools: { id: CanvasElement['type']; label: string; icon: string }[] = [
    { id: 'text', label: 'Metin Ekle', icon: '📝' },
    { id: 'rect', label: 'Kare / Dikdörtgen', icon: '⬛' },
    { id: 'circle', label: 'Daire', icon: '⚪' },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          onImageUpload(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  return (
    <aside className="w-72 bg-slate-800 border-r border-slate-700 p-4 text-white flex flex-col justify-between z-10 overflow-y-auto shrink-0">
      <div className="flex flex-col gap-6">
        
        {/* Şablon Seçici Bölümü */}
        {currentView === 'editor' && (
          <>
            <TemplateSelector 
              onSelectPreset={onSelectPreset} 
              canvasWidth={canvasWidth} 
              canvasHeight={canvasHeight} 
            />
            <hr className="border-slate-700" />
          </>
        )}

        {/* Bileşenler Bölümü */}
        <div className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-1">Bileşenler</h2>
          <div className="grid grid-cols-1 gap-2">
            {tools.map((tool) => (
              <div
                key={tool.id}
                draggable={currentView === 'editor'}
                onDragStart={(e) => onDragStart(e, tool.id)}
                onClick={() => {
                  if (currentView !== 'editor') onViewChange('editor');
                }}
                className={`flex items-center gap-3 bg-slate-700 hover:bg-slate-600 p-3 rounded-lg transition-all border border-transparent hover:border-blue-500 shadow-md select-none ${
                  currentView === 'editor' ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer opacity-70 hover:opacity-100'
                }`}
              >
                <span className="text-xl">{tool.icon}</span>
                <span className="text-sm font-medium">{tool.label}</span>
              </div>
            ))}

            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden" 
            />

            <div
              onClick={() => {
                if (currentView !== 'editor') onViewChange('editor');
                setTimeout(() => fileInputRef.current?.click(), 50);
              }}
              className="flex items-center gap-3 bg-slate-700 hover:bg-slate-600 p-3 rounded-lg cursor-pointer transition-all border border-transparent hover:border-blue-500 shadow-md select-none"
            >
              <span className="text-xl">🖼️</span>
              <span className="text-sm font-medium">Görsel Yükle</span>
            </div>
          </div>
        </div>
      </div>

      {/* Alt Sekme: Dashboard Butonu */}
      <div className="mt-8 pt-4 border-t border-slate-700">
        <button
          onClick={() => onViewChange(currentView === 'dashboard' ? 'editor' : 'dashboard')}
          className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all border shadow-md select-none font-medium text-sm ${
            currentView === 'dashboard'
              ? 'bg-blue-600 border-blue-500 text-white font-semibold'
              : 'bg-slate-900/50 hover:bg-slate-700 border-slate-700 text-slate-300 hover:text-white'
          }`}
        >
          <span className="text-xl">📁</span>
          <span>{currentView === 'dashboard' ? 'Editöre Geri Dön' : 'Kaydedilen Projelerim'}</span>
        </button>
      </div>
    </aside>
  );
}