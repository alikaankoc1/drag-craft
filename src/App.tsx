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
  src?: string;
  fontSize?: number;   // Yeni: Font boyutu (px)
  fontFamily?: string; // Yeni: Font ailesi
}

function App() {
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedElement = elements.find((el) => el.id === selectedId) || null;

  useEffect(() => {
    const savedData = localStorage.getItem('canvas_design');
    if (savedData) {
      try {
        setElements(JSON.parse(savedData));
      } catch (e) {
        console.error('Kayıtlı veri yüklenirken hata oluştu:', e);
      }
    }
  }, []);

  const handleSaveToLocalStorage = () => {
    localStorage.setItem('canvas_design', JSON.stringify(elements));
    alert('Tasarımınız tarayıcı hafızasına başarıyla kaydedildi! 🚀');
  };

  const handleExportJSON = () => {
    if (elements.length === 0) {
      alert('İndirmek için canvas üzerinde en az bir eleman olmalıdır.');
      return;
    }
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(elements, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `tasarim-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJSON = (jsonData: string) => {
    try {
      const parsedData = JSON.parse(jsonData) as CanvasElement[];
      if (Array.isArray(parsedData)) {
        setElements(parsedData);
        setSelectedId(null);
        alert('Tasarım başarıyla yüklendi! 📂');
      } else {
        alert('Geçersiz dosya formatı.');
      }
    } catch (e) {
      alert('Dosya okunurken bir hata oluştu, lütfen geçerli bir JSON seçin.');
    }
  };

  const handleDragStart = (e: React.DragEvent, type: CanvasElement['type']) => {
    e.dataTransfer.setData('text/plain', type);
  };

  const handleDrop = (e: React.DragEvent, canvasRect: DOMRect) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('text/plain') as CanvasElement['type'];
    if (!type || type === 'image') return;

    const x = e.clientX - canvasRect.left;
    const y = e.clientY - canvasRect.top;

    const newElement: CanvasElement = {
      id: crypto.randomUUID(),
      type,
      x,
      y,
      width: type === 'text' ? 200 : 96,
      height: type === 'text' ? 50 : 96,
      color: type === 'rect' ? '#3b82f6' : type === 'circle' ? '#ef4444' : '#000000',
      text: type === 'text' ? 'Düzenlemek için çift tıklayın' : undefined,
      fontSize: type === 'text' ? 18 : undefined, // Varsayılan metin boyutu
      fontFamily: type === 'text' ? 'sans-serif' : undefined, // Varsayılan font ailesi
    };

    setElements([...elements, newElement]);
    setSelectedId(newElement.id);
  };

  const handleAddImage = (imageSrc: string) => {
    const newElement: CanvasElement = {
      id: crypto.randomUUID(),
      type: 'image',
      x: 400,
      y: 250,
      width: 200,
      height: 150,
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
    localStorage.removeItem('canvas_design');
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden font-sans antialiased bg-slate-900 selection:bg-blue-500/30">
      <Header 
        onClear={handleClear} 
        onSave={handleSaveToLocalStorage}
        onExport={handleExportJSON}
        onImport={handleImportJSON}
      />
      <div className="flex flex-1 overflow-hidden">
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