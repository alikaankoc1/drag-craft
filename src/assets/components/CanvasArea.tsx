import { useRef, useState } from 'react';
import type { CanvasElement } from '../../App';

interface CanvasAreaProps {
  elements: CanvasElement[];
  onDrop: (e: React.DragEvent, canvasRect: DOMRect) => void;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onUpdateText: (id: string, newText: string) => void;
  onUpdatePosition: (id: string, x: number, y: number) => void;
}

export default function CanvasArea({ 
  elements, 
  onDrop, 
  selectedId, 
  onSelect, 
  onUpdateText,
  onUpdatePosition
}: CanvasAreaProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
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

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === canvasRef.current) {
      onSelect(null);
      setEditingId(null);
    }
  };

  const handleElementMouseDown = (e: React.MouseEvent, el: CanvasElement) => {
    if (editingId === el.id) return;
    
    e.stopPropagation();
    onSelect(el.id);

    if (!canvasRef.current) return;
    const canvasRect = canvasRef.current.getBoundingClientRect();

    const startX = e.clientX - canvasRect.left - el.x;
    const startY = e.clientY - canvasRect.top - el.y;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      let newX = moveEvent.clientX - canvasRect.left - startX;
      let newY = moveEvent.clientY - canvasRect.top - startY;

      newX = Math.max(0, Math.min(newX, canvasRect.width));
      newY = Math.max(0, Math.min(newY, canvasRect.height));

      onUpdatePosition(el.id, newX, newY);
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
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
              width: el.type !== 'text' ? `${el.width}px` : undefined,
              height: el.type !== 'text' ? `${el.height}px` : undefined,
              color: el.type === 'text' ? el.color : undefined,
              backgroundColor: (el.type === 'rect' || el.type === 'circle') ? el.color : undefined,
              transform: 'translate(-50%, -50%)',
            };

            const activeClass = isSelected 
              ? 'outline outline-2 outline-blue-500 shadow-lg z-20' 
              : 'hover:outline hover:outline-1 hover:outline-blue-400/50 z-10';

            if (el.type === 'text') {
              return (
                <div
                  key={el.id}
                  style={style}
                  onMouseDown={(e) => handleElementMouseDown(e, el)}
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
                  className={`cursor-move font-medium px-2 py-1 rounded text-lg min-w-[50px] border-none focus:outline-none bg-transparent whitespace-nowrap ${activeClass}`}
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
                  onMouseDown={(e) => handleElementMouseDown(e, el)}
                  className={`cursor-move rounded-sm shadow-md transition-shadow ${activeClass}`}
                />
              );
            }

            if (el.type === 'circle') {
              return (
                <div
                  key={el.id}
                  style={style}
                  onMouseDown={(e) => handleElementMouseDown(e, el)}
                  className={`cursor-move rounded-full shadow-md transition-shadow ${activeClass}`}
                />
              );
            }

            if (el.type === 'image') {
              return (
                <img
                  key={el.id}
                  src={el.src}
                  alt="Yüklenen Görsel"
                  style={style}
                  onMouseDown={(e) => handleElementMouseDown(e, el)}
                  className={`cursor-move object-cover shadow-md transition-shadow select-none pointer-events-auto ${activeClass}`}
                />
              );
            }

            return null;
          })
        )}
      </div>
    </main>
  );
}