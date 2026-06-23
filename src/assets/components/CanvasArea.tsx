import { useRef, useState } from 'react';
import type { CanvasElement } from '../../App';

interface CanvasAreaProps {
  elements: CanvasElement[];
  onDrop: (e: React.DragEvent, canvasRect: DOMRect) => void;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onUpdateText: (id: string, newText: string) => void;
}

export default function CanvasArea({ 
  elements, 
  onDrop, 
  selectedId, 
  onSelect, 
  onUpdateText 
}: CanvasAreaProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  // Hangi metnin şu an düzenleme modunda (edit mode) olduğunu tutan state
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleLocalDrop = (e: React.DragEvent) => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      onDrop(e, rect);
    }
  };

  // Boş beyaz alana tıklandığında seçimi temizle
  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === canvasRef.current) {
      onSelect(null);
      setEditingId(null);
    }
  };

  return (
    <main className="flex-1 bg-slate-900 p-8 flex items-center justify-center overflow-auto">
      <div
        ref={canvasRef}
        onDragOver={handleDragOver}
        onDrop={handleLocalDrop}
        onClick={handleCanvasClick}
        className="w-[800px] h-[500px] bg-white rounded-lg shadow-2xl relative overflow-hidden border border-slate-700"
      >
        {elements.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
            <p className="text-slate-400 text-sm">
              Sol panelden elementleri buraya sürükleyip bırakın
            </p>
          </div>
        ) : (
          elements.map((el) => {
            const isSelected = el.id === selectedId;
            const isEditing = el.id === editingId;

            const style: React.CSSProperties = {
              position: 'absolute',
              left: `${el.x}px`,
              top: `${el.y}px`,
              transform: 'translate(-50%, -50%)',
            };

            // Seçili elemanların etrafına mavi border ve odaklanma sınıfı ekliyoruz
            const activeClass = isSelected 
              ? 'outline outline-2 outline-blue-500 shadow-lg z-20' 
              : 'hover:outline hover:outline-1 hover:outline-blue-400/50 z-10';

            if (el.type === 'text') {
              return (
                <div
                  key={el.id}
                  style={style}
                  onClick={(e) => {
                    e.stopPropagation(); // Üst taraftaki canvas click'ini engellemek için
                    onSelect(el.id);
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    setEditingId(el.id);
                  }}
                  contentEditable={isEditing}
                  suppressContentEditableWarning
                  onBlur={(e) => {
                    setEditingId(null);
                    onUpdateText(el.id, e.target.innerText);
                  }}
                  className={`cursor-move text-black font-medium px-2 py-1 rounded text-lg min-w-[50px] border-none focus:outline-none bg-transparent ${activeClass}`}
                >
                  {el.text}
                </div>
              );
            }

            if (el.type === 'rect') {
              return (
                <div
                  key={el.id}
                  style={style}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(el.id);
                  }}
                  className={`w-24 h-24 bg-blue-500 cursor-move rounded-sm shadow-md transition-shadow ${activeClass}`}
                />
              );
            }

            if (el.type === 'circle') {
              return (
                <div
                  key={el.id}
                  style={style}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(el.id);
                  }}
                  className={`w-24 h-24 bg-red-500 rounded-full cursor-move shadow-md transition-shadow ${activeClass}`}
                />
              );
            }

            if (el.type === 'image') {
              return (
                <div
                  key={el.id}
                  style={style}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(el.id);
                  }}
                  className={`w-32 h-24 bg-slate-200 border border-dashed border-slate-400 flex items-center justify-center cursor-move rounded-md ${activeClass}`}
                >
                  <span className="text-xs text-slate-500 font-medium select-none pointer-events-none">Görsel Alanı</span>
                </div>
              );
            }

            return null;
          })
        )}
      </div>
    </main>
  );
}