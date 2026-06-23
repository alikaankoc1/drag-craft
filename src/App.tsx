import { useState, useEffect } from 'react';
import Header from './assets/components/Header';
import Sidebar from './assets/components/Sidebar';
import CanvasArea from './assets/components/CanvasArea';
import PropertiesPanel from './assets/components/PropertiesPanel';

export interface CanvasElement {
  id: string;
  type: 'text' | 'rect' | 'circle' | 'image';
  x: number;
  y: number;
  width: number;  // Yeni özellik
  height: number; // Yeni özellik
  color: string;  // Yeni özellik
  text?: string;
}

function App() {
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Seçili elemanın nesne referansını buluyoruz
  const selectedElement = elements.find((el) => el.id === selectedId) || null;

  const handleDragStart = (e: React.DragEvent, type: CanvasElement['type']) => {
    e.dataTransfer.setData('text/plain', type);
  };

  const handleDrop = (e: React.DragEvent, canvasRect: DOMRect) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('text/plain') as CanvasElement['type'];
    if (!type) return;

    const x = e.clientX - canvasRect.left;
    const y = e.clientY - canvasRect.top;

    // Varsayılan boyutlar ve renkler ile yeni eleman oluşturma
    const newElement: CanvasElement = {
      id: crypto.randomUUID(),
      type,
      x,
      y,
      width: type === 'image' ? 128 : type === 'text' ? 150 : 96,
      height: type === 'text' ? 40 : 96,
      color: type === 'rect' ? '#3b82f6' : type === 'circle' ? '#ef4444' : '#000000',
      text: type === 'text' ? 'Düzenlemek için çift tıklayın' : undefined,
    };

    setElements([...elements, newElement]);
    setSelectedId(newElement.id);
  };

  const handleUpdatePosition = (id: string, x: number, y: number) => {
    setElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, x, y } : el))
    );
  };

  // Elemanın herhangi bir özelliğini (renk, boyut vb.) güncelleyen genel fonksiyon
  const handleUpdateElement = (id: string, updates: Partial<CanvasElement>) => {
    setElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, ...updates } : el))
    );
  };

  // Eleman silme fonksiyonu
  const handleDeleteElement = (id: string) => {
    setElements((prev) => prev.filter((el) => el.id !== id));
    setSelectedId(null);
  };

  // Klavyeden Delete tuşuna basıldığında silme işlemini tetikleme
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedId && (e.key === 'Delete' || e.key === 'Backspace')) {
        // Eğer bir input veya contentEditable içinde yazı yazılmıyorsa sil
        const activeEl = document.activeElement;
        if (activeEl?.tagName !== 'INPUT' && activeEl?.getAttribute('contenteditable') !== 'true') {
          handleDeleteElement(selectedId);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId]);

  const handleClear = () => {
    setElements([]);
    setSelectedId(null);
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden font-sans antialiased bg-slate-900 selection:bg-blue-500/30">
      <Header onClear={handleClear} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar onDragStart={handleDragStart} />
        <CanvasArea 
          elements={elements} 
          onDrop={handleDrop} 
          selectedId={selectedId}
          onSelect={setSelectedId}
          onUpdateText={(id, text) => handleUpdateElement(id, { text })}
          onUpdatePosition={handleUpdatePosition}
        />
        {/* Sağ Panel: Sadece bir eleman seçili olduğunda açılır */}
        <PropertiesPanel 
          element={selectedElement} 
          onUpdate={(updates) => selectedId && handleUpdateElement(selectedId, updates)}
          onDelete={() => selectedId && handleDeleteElement(selectedId)}
        />
      </div>
    </div>
  );
}

export default App;