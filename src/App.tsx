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
  fontSize?: number;
  fontFamily?: string;
}

export interface SavedProject {
  id: string;
  name: string;
  updatedAt: string;
  elements: CanvasElement[];
  canvasWidth: number;  // Yeni: Projenin genişliği
  canvasHeight: number; // Yeni: Projenin yüksekliği
}

function App() {
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  
  // Yeni: Canvas genişlik ve yükseklik state'leri (Varsayılan 800x500)
  const [canvasWidth, setCanvasWidth] = useState<number>(800);
  const [canvasHeight, setCanvasHeight] = useState<number>(500);

  const [currentView, setCurrentView] = useState<'editor' | 'dashboard'>('editor');
  const [projects, setProjects] = useState<SavedProject[]>([]);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);

  const selectedElement = elements.find((el) => el.id === selectedId) || null;

  useEffect(() => {
    const savedProjects = localStorage.getItem('canvas_ai_projects');
    if (savedProjects) {
      try {
        setProjects(JSON.parse(savedProjects));
      } catch (e) {
        console.error('Projeler yüklenirken hata oluştu:', e);
      }
    }
  }, []);

  const saveProjectsToStorage = (updatedProjects: SavedProject[]) => {
    setProjects(updatedProjects);
    localStorage.setItem('canvas_ai_projects', JSON.stringify(updatedProjects));
  };

  const handleSaveProject = () => {
    if (elements.length === 0) {
      alert('Kaydetmek için canvas üzerinde en az bir eleman olmalıdır.');
      return;
    }

    let updatedProjects = [...projects];

    if (currentProjectId) {
      updatedProjects = updatedProjects.map((p) =>
        p.id === currentProjectId
          ? { ...p, elements, canvasWidth, canvasHeight, updatedAt: new Date().toLocaleString('tr-TR') }
          : p
      );
      alert('Proje değişiklikleri başarıyla kaydedildi! 💾');
    } else {
      const projectName = prompt('Projenize bir isim verin:', `Tasarım #${projects.length + 1}`);
      if (!projectName) return;

      const newProject: SavedProject = {
        id: crypto.randomUUID(),
        name: projectName,
        updatedAt: new Date().toLocaleString('tr-TR'),
        elements: elements,
        canvasWidth,  // Boyut kaydediliyor
        canvasHeight, // Boyut kaydediliyor
      };
      updatedProjects.push(newProject);
      setCurrentProjectId(newProject.id);
      alert('Yeni proje başarıyla listeye kaydedildi! 🚀');
    }

    saveProjectsToStorage(updatedProjects);
  };

  const handleLoadProject = (project: SavedProject) => {
    setElements(project.elements);
    setCanvasWidth(project.canvasWidth || 800);  // Projenin boyutu yükleniyor
    setCanvasHeight(project.canvasHeight || 500); // Projenin boyutu yükleniyor
    setCurrentProjectId(project.id);
    setSelectedId(null);
    setCurrentView('editor');
  };

  const handleExportProjectJSON = (project: SavedProject) => {
    // Dışarı aktarılan JSON'a boyutları da gömüyoruz
    const exportData = {
      canvasWidth: project.canvasWidth,
      canvasHeight: project.canvasHeight,
      elements: project.elements
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${project.name}-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJSON = (jsonData: string) => {
    try {
      const parsed = JSON.parse(jsonData);
      
      // Boyut bilgisi içeren gelişmiş format kontrolü
      if (parsed && Array.isArray(parsed.elements)) {
        setElements(parsed.elements);
        setCanvasWidth(parsed.canvasWidth || 800);
        setCanvasHeight(parsed.canvasHeight || 500);
      } else if (Array.isArray(parsed)) {
        // Eski sade dizi formatıyla geriye dönük uyumluluk
        setElements(parsed);
        setCanvasWidth(800);
        setCanvasHeight(500);
      } else {
        alert('Geçersiz JSON yapısı.');
        return;
      }
      
      setCurrentProjectId(null);
      setSelectedId(null);
      setCurrentView('editor');
      alert('Tasarım editöre başarıyla yüklendi! 📂');
    } catch (e) {
      alert('Geçersiz JSON formatı.');
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
      fontSize: type === 'text' ? 18 : undefined,
      fontFamily: type === 'text' ? 'sans-serif' : undefined,
    };

    setElements([...elements, newElement]);
    setSelectedId(newElement.id);
  };

  const handleAddImage = (imageSrc: string) => {
    const newElement: CanvasElement = {
      id: crypto.randomUUID(),
      type: 'image',
      x: canvasWidth / 2,
      y: canvasHeight / 2,
      width: 200,
      height: 150,
      color: 'transparent',
      src: imageSrc
    };
    setElements([...elements, newElement]);
    setSelectedId(newElement.id);
    setCurrentView('editor');
  };

  const handleClear = () => {
    setElements([]);
    setSelectedId(null);
    setCurrentProjectId(null);
  };

  const handleSelectPreset = (w: number, h: number) => {
    setCanvasWidth(w);
    setCanvasHeight(h);
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden font-sans antialiased bg-slate-900 text-white select-none">
      <Header 
        onClear={handleClear} 
        onSave={handleSaveProject}
        onImport={handleImportJSON}
        currentView={currentView}
        onViewChange={setCurrentView}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          onDragStart={handleDragStart} 
          onImageUpload={handleAddImage}
          currentView={currentView}
          onViewChange={setCurrentView}
          onSelectPreset={handleSelectPreset}
          canvasWidth={canvasWidth}
          canvasHeight={canvasHeight}
        />
        
        {currentView === 'editor' ? (
          <>
            <CanvasArea 
              elements={elements} 
              onDrop={handleDrop} 
              selectedId={selectedId}
              onSelect={setSelectedId}
              onUpdateText={(id, text) => setElements(elements.map(el => el.id === id ? { ...el, text } : el))}
              onUpdatePosition={(id, x, y) => setElements(elements.map(el => el.id === id ? { ...el, x, y } : el))}
              canvasWidth={canvasWidth}
              canvasHeight={canvasHeight}
            />
            <PropertiesPanel 
              element={selectedElement} 
              onUpdate={(updates) => selectedId && setElements(elements.map(el => el.id === selectedId ? { ...el, ...updates } : el))}
              onDelete={() => {
                setElements(elements.filter(el => el.id !== selectedId));
                setSelectedId(null);
              }}
            />
          </>
        ) : (
          <main className="flex-1 bg-slate-900 p-8 overflow-auto flex flex-col gap-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-200">Kaydedilen Projelerim</h2>
              <p className="text-sm text-slate-400 mt-1">Geçmişte oluşturduğunuz ve tarayıcınızda saklanan tasarımlar.</p>
            </div>

            {projects.length === 0 ? (
              <div className="flex-1 border border-dashed border-slate-700 rounded-xl flex flex-col items-center justify-center p-12 text-slate-500">
                <span className="text-4xl mb-3">📁</span>
                <p className="text-base font-medium">Henüz kayıtlı bir projeniz bulunmuyor.</p>
                <button 
                  onClick={() => setCurrentView('editor')}
                  className="mt-4 text-sm bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-all"
                >
                  İlk Tasarımını Oluştur
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.map((project) => (
                  <div key={project.id} className="bg-slate-800 border border-slate-700 rounded-xl p-5 flex flex-col justify-between hover:border-slate-500 transition-all shadow-lg group">
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="font-semibold text-slate-200 group-hover:text-blue-400 transition-colors truncate max-w-[65%]">
                          {project.name}
                        </h4>
                        <span className="text-xs bg-slate-700 text-slate-400 px-2 py-0.5 rounded font-mono shrink-0">
                          {project.canvasWidth || 800}x{project.canvasHeight || 500}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-mono mb-6">Son Güncelleme: {project.updatedAt}</p>
                    </div>

                    <div className="flex items-center gap-2 mt-auto">
                      <button
                        onClick={() => handleLoadProject(project)}
                        className="flex-1 bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/20 text-xs font-semibold py-2 rounded-lg transition-all"
                      >
                        Düzenle 📝
                      </button>
                      <button
                        onClick={() => handleExportProjectJSON(project)}
                        className="bg-slate-700 hover:bg-slate-600 text-slate-300 p-2 rounded-lg text-xs font-semibold transition-all"
                        title="JSON Olarak İndir"
                      >
                        📥 İndir
                      </button>
                      <button
                        onClick={() => handleDeleteProject(project.id)}
                        className="bg-red-500/10 hover:bg-red-600 text-red-400 hover:text-white p-2 rounded-lg text-xs font-semibold transition-all"
                        title="Projeyi Sil"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        )}
      </div>
    </div>
  );
}

export default App;