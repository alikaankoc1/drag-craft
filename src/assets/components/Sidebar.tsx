import { useRef } from 'react';
import type { CanvasElement } from '../../App';

interface SidebarProps {
  onDragStart: (e: React.DragEvent, type: CanvasElement['type']) => void;
  onImageUpload: (src: string) => void; // Yeni prop
}

export default function Sidebar({ onDragStart, onImageUpload }: SidebarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const tools: { id: CanvasElement['type']; label: string; icon: string }[] = [
    { id: 'text', label: 'Metin Ekle', icon: '📝' },
    { id: 'rect', label: 'Kare / Dikdörtgen', icon: '⬛' },
    { id: 'circle', label: 'Daire', icon: '⚪' },
  ];

  // Dosya seçildiğinde tetiklenen fonksiyon
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          onImageUpload(reader.result); // Resmin base64 URL'ini App.tsx'e fırlatıyoruz
        }
      };
      reader.readAsDataURL(file);
    }
    // Aynı resmi tekrar yükleyebilmek için input'u sıfırlıyoruz
    e.target.value = '';
  };

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

        {/* Gizli Dosya Seçici Input */}
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden" 
        />

        {/* Görsel Yükle Butonu */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-3 bg-slate-700 hover:bg-slate-600 p-3 rounded-lg cursor-pointer transition-all border border-transparent hover:border-blue-500 shadow-md select-none"
        >
          <span className="text-xl">🖼️</span>
          <span className="text-sm font-medium">Görsel Yükle</span>
        </div>
      </div>
    </aside>
  );
}