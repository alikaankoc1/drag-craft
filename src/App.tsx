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
  width: number;
  height: number;
  color: string;
  text?: string;
  src?: string; // Yeni: Yüklenen resmin URL'ini tutacak alan
}

function App() {
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedElement = elements.find((el) => el.id === selectedId) || null;

  const handleDragStart = (e: React.DragEvent, type: CanvasElement['type']) => {
    e.dataTransfer.setData('text/plain', type);
  };

  const handleDrop = (e: React.DragEvent, canvasRect: DOMRect) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('text/plain') as CanvasElement['type'];
    if (!type || type === 'image') return; // Image tipini buradan engelliyoruz, çünkü onu input ile alacağız

    const x = e.clientX - canvasRect.left;
    const y = e.clientY - canvasRect.top;

    const newElement: CanvasElement = {
      id: crypto.randomUUID(),
      type,
      x,
      y,
      width: type === 'text' ? 150 : 96,
      height: type === 'text' ? 40 : 96,
      color: type === 'rect' ? '#3b82f6' : type === 'circle' ? '#ef4444' : '#000000',
      text: type === 'text' ? 'Düzenlemek için çift tıklayın' : undefined,
    };

    setElements([...elements, newElement]);
    setSelectedId(newElement.id);
  };

  // Yeni: Dışarıdan yüklenen resmi canvas'ın merkezine ekleyen fonksiyon
  const handleAddImage = (imageSrc: string) => {
    const newElement: CanvasElement = {
      id: crypto.randomUUID(),
      type: 'image',
      x: 400, // Canvas'ın tam ortası (800 / 2)
      y: 250, // Canvas'ın tam ortası (500 / 2)
      width: 200, // Varsayılan resim genişliği
      height: 150, // Varsayılan resim yüksekliği
      color: 'transparent',
      src: imageSrc
    };

    setElements([...elements, newElement]);
    setSelectedId(newElement.id);
  };

  const handleUpdatePosition = (id: string, x: number, y: number) => {
    setElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, x, y } : el))
    );
  };

  const handleUpdateElement = (id: string, updates: Partial<CanvasElement>) => {
    setElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, ...updates } : el))
    );
  };

  const handleDeleteElement = (id: string) => {
    setElements((prev) => prev.filter((el) => el.id !== id));
    setSelectedId(null);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedId && (e.key === 'Delete' || e.key === 'Backspace')) {
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
        {/* Sidebar'a resim ekleme fonksiyonunu gönderiyoruz */}
        <Sidebar onDragStart={handleDragStart} onImageUpload={handleAddImage} />
        <CanvasArea 
          elements={elements} 
          onDrop={handleDrop} 
          selectedId={selectedId}
          onSelect={setSelectedId}
          onUpdateText={(id, text) => handleUpdateElement(id, { text })}
          onUpdatePosition={handleUpdatePosition}
        />
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