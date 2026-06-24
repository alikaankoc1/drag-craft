import { CanvasElement } from '../../App';
import CanvasArea from './CanvasArea';
import PropertiesPanel from './PropertiesPanel';

interface EditorViewProps {
  elements: CanvasElement[];
  selectedId: string | null;
  canvasWidth: number;
  canvasHeight: number;
  onSelect: (id: string | null) => void;
  onUpdatePosition: (id: string, x: number, y: number) => void;
  onUpdateElement: (id: string, updates: Partial<CanvasElement>) => void;
  onUpdateText: (id: string, newText: string) => void;
  onDelete: () => void;
}

export default function EditorView({
  elements,
  selectedId,
  canvasWidth,
  canvasHeight,
  onSelect,
  onUpdatePosition,
  onUpdateElement,
  onUpdateText,
  onDelete,
}: EditorViewProps) {
  const selectedElement = elements.find((el) => el.id === selectedId) || null;

  return (
    <>
      <CanvasArea
        elements={elements}
        onDrop={() => {}}
        selectedId={selectedId}
        onSelect={onSelect}
        onUpdateText={onUpdateText}
        onUpdatePosition={onUpdatePosition}
        onUpdateElement={onUpdateElement}
        canvasWidth={canvasWidth}
        canvasHeight={canvasHeight}
      />
      <PropertiesPanel
        element={selectedElement}
        onUpdate={(updates) => {
          if (selectedId) {
            onUpdateElement(selectedId, updates);
          }
        }}
        onDelete={onDelete}
      />
    </>
  );
}
