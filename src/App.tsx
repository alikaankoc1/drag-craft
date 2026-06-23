import { useState } from 'react';
import Header from './assets/components/Header';
import Sidebar from './assets/components/Sidebar';
import CanvasArea from './assets/components/CanvasArea';

export interface CanvasElement {
  id: string;
  type: 'text' | 'rect' | 'circle' | 'image';
  x: number;
  y: number;
  text?: string;
}

function App() {
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, type: CanvasElement['type']) => {
    e.dataTransfer.setData('text/plain', type);
  };

  const handleDrop = (e: React.DragEvent, canvasRect: DOMRect) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('text/plain') as CanvasElement['type'];
    if (!type) return;

    const x = e.clientX - canvasRect.left;
    const y = e.clientY - canvasRect.top;

    const newElement: CanvasElement = {
      id: crypto.randomUUID(),
      type,
      x,
      y,
      text: type === 'text' ? 'Düzenlemek için çift tıklayın' : undefined,
    };

    setElements([...elements, newElement]);
    setSelectedId(newElement.id);
  };

  // Sürüklenen elemanın koordinatlarını anlık güncelleyen fonksiyon
  const handleUpdatePosition = (id: string, x: number, y: number) => {
    setElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, x, y } : el))
    );
  };

  const handleUpdateText = (id: string, newText: string) => {
    setElements(
      elements.map((el) => (el.id === id ? { ...el, text: newText } : el))
    );
  };

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
          onUpdateText={handleUpdateText}
          onUpdatePosition={handleUpdatePosition} // Yeni fonksiyonu geçtik
        />
      </div>
    </div>
  );
}

export default App;