import { useRef } from 'react';
import type { CanvasElement } from '../../App';

interface CanvasAreaProps {
  elements: CanvasElement[];
  onDrop: (e: React.DragEvent, canvasRect: DOMRect) => void;
}

export default function CanvasArea({ elements, onDrop }: CanvasAreaProps) {
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    // Tarayıcının varsayılan engellemesini kaldırıyoruz ki drop olayı tetiklenebilsin
    e.preventDefault();
  };

  const handleLocalDrop = (e: React.DragEvent) => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      onDrop(e, rect);
    }
  };

  return (
    <main className="flex-1 bg-slate-900 p-8 flex items-center justify-center overflow-auto">
      <div
        ref={canvasRef}
        onDragOver={handleDragOver}
        onDrop={handleLocalDrop}
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
            // CSS konumlandırması için elemanın merkezini hizalayacak ufak bir ayar
            const style: React.CSSProperties = {
              position: 'absolute',
              left: `${el.x}px`,
              top: `${el.y}px`,
              transform: 'translate(-50%, -50%)', // Tam bırakılan fare ucuna gelmesi için
            };

            if (el.type === 'text') {
              return (
                <div key={el.id} style={style} className="cursor-move text-black font-medium border border-transparent hover:border-blue-400 px-2 py-1 rounded text-lg">
                  {el.text}
                </div>
              );
            }

            if (el.type === 'rect') {
              return (
                <div key={el.id} style={style} className="w-24 h-24 bg-blue-500 cursor-move border border-transparent hover:border-blue-400 rounded-sm shadow-md" />
              );
            }

            if (el.type === 'circle') {
              return (
                <div key={el.id} style={style} className="w-24 h-24 bg-red-500 rounded-full cursor-move border border-transparent hover:border-blue-400 shadow-md" />
              );
            }

            if (el.type === 'image') {
              return (
                <div key={el.id} style={style} className="w-32 h-24 bg-slate-200 border border-dashed border-slate-400 flex items-center justify-center cursor-move hover:border-blue-400 rounded-md">
                  <span className="text-xs text-slate-500 font-medium">Görsel Alanı</span>
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