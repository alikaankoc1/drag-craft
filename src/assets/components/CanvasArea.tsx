import { useRef, useState } from 'react';
import type { CanvasElement } from '../../App';

interface CanvasAreaProps {
  elements: CanvasElement[];
  onDrop: (e: React.DragEvent, canvasRect: DOMRect) => void;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onUpdateText: (id: string, newText: string) => void;
  onUpdatePosition: (id: string, x: number, y: number) => void;
  onUpdateElement?: (id: string, updates: Partial<CanvasElement>) => void;
  canvasWidth: number;  // Yeni prop
  canvasHeight: number; // Yeni prop
}

export default function CanvasArea({ 
  elements, 
  onDrop, 
  selectedId, 
  onSelect, 
  onUpdateText,
  onUpdatePosition,
  onUpdateElement,
  canvasWidth,
  canvasHeight
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

      // Allow panning/positioning beyond canvas edges so user can crop by moving image
      const minX = -el.width / 2;
      const maxX = canvasRect.width + el.width / 2;
      const minY = -el.height / 2;
      const maxY = canvasRect.height + el.height / 2;

      newX = Math.max(minX, Math.min(newX, maxX));
      newY = Math.max(minY, Math.min(newY, maxY));

      onUpdatePosition(el.id, newX, newY);
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // --- Simple bottom-right resize handler (supports increasing/decreasing size) ---
  const startResizeCorner = (e: React.MouseEvent, el: CanvasElement, corner: 'tl' | 'tr' | 'bl' | 'br') => {
    e.stopPropagation();
    e.preventDefault();
    if (!onUpdateElement || !canvasRef.current) return;

    const startMouseX = e.clientX;
    const startMouseY = e.clientY;
    const startW = el.width;
    const startH = el.height;
    const startX = el.x;
    const startY = el.y;

    const isRight = corner.includes('r');
    const isBottom = corner.includes('b');

    const handleMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startMouseX;
      const deltaY = moveEvent.clientY - startMouseY;

      const newW = Math.max(24, startW + (isRight ? deltaX : -deltaX));
      const newH = Math.max(24, startH + (isBottom ? deltaY : -deltaY));

      const newX = startX + deltaX / 2;
      const newY = startY + deltaY / 2;

      onUpdateElement(el.id, { width: newW, height: newH, x: newX, y: newY });
    };

    const handleUp = () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
  };

  return (
    <main className="flex-1 bg-slate-900 p-8 flex items-center justify-center overflow-hidden min-h-0 min-w-0">
      <div
        ref={canvasRef}
        onDragOver={handleDragOver}
        onDrop={handleLocalDrop}
        onClick={handleCanvasClick}
        style={{ width: `${canvasWidth}px`, height: `${canvasHeight}px` }} // Dinamik boyutlandırma
        className="bg-white rounded-lg shadow-2xl relative border border-slate-700 transition-all duration-300 shrink-0"
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
              fontSize: el.type === 'text' ? `${el.fontSize}px` : undefined,
              fontFamily: el.type === 'text' ? el.fontFamily : undefined,
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
                    onUpdateText(el.id, (e.target as HTMLDivElement).innerText);
                  }}
                  className={`cursor-move font-medium px-2 py-1 rounded min-w-[50px] border-none focus:outline-none bg-transparent whitespace-nowrap ${activeClass}`}
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
              // Wrap image to add resize handle when selected
              return (
                <div
                  key={el.id}
                  style={style}
                  onMouseDown={(e) => handleElementMouseDown(e, el)}
                  className={`cursor-move relative overflow-visible ${activeClass}`}
                >
                  <img
                    src={el.src}
                    alt="Yüklenen Görsel"
                    style={{ width: '100%', height: '100%', display: 'block', objectFit: 'cover' }}
                    className="select-none pointer-events-auto shadow-md"
                  />

                  {isSelected && onUpdateElement && (
                    <>
                      <div
                        onMouseDown={(ev) => startResizeCorner(ev, el, 'tl')}
                        className="absolute w-4 h-4 bg-white/90 border border-slate-600 rounded shadow -left-2 -top-2 cursor-nwse-resize z-30"
                      />
                      <div
                        onMouseDown={(ev) => startResizeCorner(ev, el, 'tr')}
                        className="absolute w-4 h-4 bg-white/90 border border-slate-600 rounded shadow -right-2 -top-2 cursor-nesw-resize z-30"
                      />
                      <div
                        onMouseDown={(ev) => startResizeCorner(ev, el, 'bl')}
                        className="absolute w-4 h-4 bg-white/90 border border-slate-600 rounded shadow -left-2 -bottom-2 cursor-nesw-resize z-30"
                      />
                      <div
                        onMouseDown={(ev) => startResizeCorner(ev, el, 'br')}
                        className="absolute w-4 h-4 bg-white/90 border border-slate-600 rounded shadow -right-2 -bottom-2 cursor-nwse-resize z-30"
                      />
                    </>
                  )}
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