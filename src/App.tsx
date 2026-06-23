import { useState } from 'react';
import Header from './assets/components/Header';
import Sidebar from './assets/components/Sidebar';
import CanvasArea from './assets/components/CanvasArea';

// Canvas üzerindeki her bir elemanın sahip olacağı veri yapısı (Type)
export interface CanvasElement {
  id: string;
  type: 'text' | 'rect' | 'circle' | 'image';
  x: number;
  y: number;
  text?: string;
}

function App() {
  // Canvas üzerindeki tüm elemanları tutan state
  const [elements, setElements] = useState<CanvasElement[]>([]);

  // Sürüklenen elemanın tipini geçici olarak tutacak fonksiyonlar
  const handleDragStart = (e: React.DragEvent, type: CanvasElement['type']) => {
    e.dataTransfer.setData('text/plain', type);
  };

  // Eleman canvas üzerine bırakıldığında tetiklenecek fonksiyon
  const handleDrop = (e: React.DragEvent, canvasRect: DOMRect) => {
    e.preventDefault();
    
    // Bırakılan elemanın tipini alıyoruz (text, rect, circle, image)
    const type = e.dataTransfer.getData('text/plain') as CanvasElement['type'];
    
    if (!type) return;

    // Fare koordinatlarından canvas'ın sol üst köşesini çıkararak tam bırakılan yeri buluyoruz
    const x = e.clientX - canvasRect.left;
    const y = e.clientY - canvasRect.top;

    // Yeni elemanı oluşturuyoruz
    const newElement: CanvasElement = {
      id: crypto.randomUUID(), // Benzersiz ID
      type,
      x,
      y,
      text: type === 'text' ? 'Çift tıklayıp düzenleyin' : undefined,
    };

    // State'i güncelleyip yeni elemanı canvas'a ekliyoruz
    setElements([...elements, newElement]);
  };

  // Canvas'ı tamamen temizleme fonksiyonu
  const handleClear = () => {
    setElements([]);
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden font-sans antialiased bg-slate-900 selection:bg-blue-500/30">
      <Header onClear={handleClear} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar onDragStart={handleDragStart} />
        <CanvasArea elements={elements} onDrop={handleDrop} />
      </div>
    </div>
  );
}

export default App;