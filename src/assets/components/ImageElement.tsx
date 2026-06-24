import { CanvasElement } from '../../App';

interface ImageElementProps {
  element: CanvasElement;
  isSelected: boolean;
  onMouseDown: (e: React.MouseEvent, element: CanvasElement) => void;
  onResizeStart: (e: React.MouseEvent, element: CanvasElement, corner: 'tl' | 'tr' | 'bl' | 'br') => void;
  onSelect: () => void;
}

export default function ImageElement({
  element,
  isSelected,
  onMouseDown,
  onResizeStart,
  onSelect,
}: ImageElementProps) {
  if (element.type === 'text') {
    return (
      <div
        key={element.id}
        onClick={onSelect}
        className={`absolute cursor-move transition-shadow duration-200 ${
          isSelected ? 'ring-2 ring-blue-500 shadow-lg shadow-blue-500/50' : 'hover:shadow-md'
        }`}
        style={{
          left: element.x,
          top: element.y,
          width: element.width,
          height: element.height,
          fontSize: element.fontSize,
          fontFamily: element.fontFamily,
          color: element.color,
          wordBreak: 'break-word',
          whiteSpace: 'pre-wrap',
        }}
        onMouseDown={(e) => onMouseDown(e, element)}
      >
        {element.text}
      </div>
    );
  }

  // Image element
  return (
    <div
      key={element.id}
      onClick={onSelect}
      className={`absolute group transition-shadow duration-200 ${
        isSelected ? 'ring-2 ring-blue-500 shadow-lg shadow-blue-500/50' : 'hover:shadow-md'
      }`}
      style={{
        left: element.x,
        top: element.y,
        width: element.width,
        height: element.height,
      }}
      onMouseDown={(e) => onMouseDown(e, element)}
    >
      {/* Görsel */}
      <img
        src={element.src || ''}
        alt="Canvas element"
        className="w-full h-full object-cover"
        draggable={false}
      />

      {/* Resize Handles - Sadece seçili ise göster */}
      {isSelected && (
        <>
          {/* Top-Left */}
          <div
            onMouseDown={(e) => onResizeStart(e, element, 'tl')}
            className="absolute -top-2 -left-2 w-5 h-5 bg-white/90 border border-white/40 rounded-full cursor-nwse-resize hover:bg-blue-500 transition-colors"
          />
          {/* Top-Right */}
          <div
            onMouseDown={(e) => onResizeStart(e, element, 'tr')}
            className="absolute -top-2 -right-2 w-5 h-5 bg-white/90 border border-white/40 rounded-full cursor-nesw-resize hover:bg-blue-500 transition-colors"
          />
          {/* Bottom-Left */}
          <div
            onMouseDown={(e) => onResizeStart(e, element, 'bl')}
            className="absolute -bottom-2 -left-2 w-5 h-5 bg-white/90 border border-white/40 rounded-full cursor-nesw-resize hover:bg-blue-500 transition-colors"
          />
          {/* Bottom-Right */}
          <div
            onMouseDown={(e) => onResizeStart(e, element, 'br')}
            className="absolute -bottom-2 -right-2 w-5 h-5 bg-white/90 border border-white/40 rounded-full cursor-nwse-resize hover:bg-blue-500 transition-colors"
          />
        </>
      )}
    </div>
  );
}
