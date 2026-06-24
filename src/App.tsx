import { useState } from 'react';
import Header from './assets/components/Header';
import Sidebar from './assets/components/Sidebar';
import CanvasArea from './assets/components/CanvasArea';
import PropertiesPanel from './assets/components/PropertiesPanel';

export interface CanvasElement {
  id: string;
  type: 'image';
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  src?: string;
}

export interface SavedProject {
  id: string;
  name: string;
  updatedAt: string;
  elements: CanvasElement[];
  canvasWidth: number;
  canvasHeight: number;
}

function App() {
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  
  // Varsayılan tuval boyutları (Kullanıcı tamamen özgürce değiştirecek)
  const [canvasWidth, setCanvasWidth] = useState<number>(800);
  const [canvasHeight, setCanvasHeight] = useState<number>(800);

  // Görünüm yönetimi: 'dashboard' (görsel yükleme ekranı) veya 'editor' (boyutlandırma ekranı)
  const [currentView, setCurrentView] = useState<'editor' | 'dashboard'>('dashboard');
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);

  // Giriş alanları için geçici boyut state'leri
  const [customWidth, setCustomWidth] = useState<string>('800');
  const [customHeight, setCustomHeight] = useState<string>('600');

  // LocalStorage'dan kayıtlı geçmiş boyut çalışmalarını çekiyoruz
  const [projects, setProjects] = useState<SavedProject[]>(() => {
    const saved = localStorage.getItem('img_resizer_projects');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return []; }
    }
    return [];
  });

  const selectedElement = elements.find((el) => el.id === selectedId) || null;

  // 🚀 Yeni Görsel Yüklendiğinde Çalışacak Akış
  const handleAddImage = (imageSrc: string) => {
    const w = parseInt(customWidth) || 800;
    const h = parseInt(customHeight) || 600;
    
    setCanvasWidth(w);
    setCanvasHeight(h);

    const imageId = crypto.randomUUID();
    const newElement: CanvasElement = {
      id: imageId,
      type: 'image',
      x: w / 2,
      y: h / 2,
      width: w * 0.9, // Çalışma alanına rahat sığması için %90 oranında başlatıyoruz
      height: h * 0.9,
      color: 'transparent',
      src: imageSrc
    };

    setElements([newElement]);
    setSelectedId(imageId);
    setCurrentView('editor'); // Doğrudan düzenleme alanına geçiş
  };

  // LocalStorage Kayıt Fonksiyonu
  const saveProjectsToStorage = (updatedProjects: SavedProject[]) => {
    setProjects(updatedProjects);
    localStorage.setItem('img_resizer_projects', JSON.stringify(updatedProjects));
  };

  const handleSaveProject = () => {
    if (elements.length === 0) {
      alert('Kaydedilecek ayarlanmış bir görsel bulunamadı.');
      return;
    }

    let updatedProjects = [...projects];

    if (currentProjectId) {
      updatedProjects = updatedProjects.map((p) =>
        p.id === currentProjectId
          ? { ...p, elements, canvasWidth, canvasHeight, updatedAt: new Date().toLocaleString('tr-TR') }
          : p
      );
      alert('Görsel boyut ayarları güncellendi! 💾');
    } else {
      const projectName = prompt('Bu boyutlandırma çalışmasına bir isim verin:', `Görsel Boyutu - ${canvasWidth}x${canvasHeight}`);
      if (!projectName) return;

      const newProject: SavedProject = {
        id: crypto.randomUUID(),
        name: projectName,
        updatedAt: new Date().toLocaleString('tr-TR'),
        elements,
        canvasWidth,
        canvasHeight,
      };
      updatedProjects.push(newProject);
      setCurrentProjectId(newProject.id);
      alert('Boyut ayarı başarıyla kaydedildi! 🚀');
    }

    saveProjectsToStorage(updatedProjects);
  };

  const handleLoadProject = (project: SavedProject) => {
    setElements(project.elements);
    setCanvasWidth(project.canvasWidth);
    setCanvasHeight(project.canvasHeight);
    setCustomWidth(project.canvasWidth.toString());
    setCustomHeight(project.canvasHeight.toString());
    setCurrentProjectId(project.id);
    setSelectedId(project.elements[0]?.id || null);
    setCurrentView('editor');
  };

  const handleDeleteProject = (id: string) => {
    if (!confirm('Bu boyutlandırma kaydını silmek istediğinize emin misiniz?')) return;
    const updated = projects.filter((p) => p.id !== id);
    saveProjectsToStorage(updated);
    if (currentProjectId === id) handleClear();
  };

  const handleClear = () => {
    setElements([]);
    setSelectedId(null);
    setCurrentProjectId(null);
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden font-sans antialiased bg-slate-900 text-white select-none">
      <Header 
        onClear={handleClear} 
        onSave={handleSaveProject}
        onImport={() => {}}
        currentView={currentView}
        onViewChange={setCurrentView}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          onDragStart={() => {}} 
          onImageUpload={handleAddImage}
          currentView={currentView}
          onViewChange={setCurrentView}
          onSelectPreset={(w, h) => { 
            setCanvasWidth(w); 
            setCanvasHeight(h);
            setCustomWidth(w.toString());
            setCustomHeight(h.toString());
          }}
          canvasWidth={canvasWidth}
          canvasHeight={canvasHeight}
        />
        
        {currentView === 'editor' ? (
          <>
            <CanvasArea 
              elements={elements} 
              onDrop={() => {}} 
              selectedId={selectedId}
              onSelect={setSelectedId}
              onUpdateText={() => {}}
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
          /* 🎯 DASHBOARD: KARE/DİKTÖRTGEN KALDIRILMIŞ SAF GÖRSEL BOYUTLANDIRICI */
          <main className="flex-1 bg-slate-900 p-8 overflow-auto flex flex-col gap-8 items-center justify-center max-w-4xl mx-auto w-full">
            
            {/* GİRİŞ VE BOYUT AYARLAMA KARTI */}
            <div className="w-full bg-slate-800/50 border border-slate-700/60 rounded-2xl p-8 backdrop-blur-sm shadow-2xl flex flex-col gap-6 text-center">
              <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2 justify-center">
                  ⚙️ Görsel Boyut Ayarlayıcı
                </h2>
                <p className="text-sm text-slate-400">
                  Hedeflediğiniz genişlik ve yükseklik değerlerini girip görselinizi yükleyin.
                </p>
              </div>

              {/* BOYUT INPUT ALANLARI */}
              <div className="flex items-center justify-center gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-700/50 max-w-md mx-auto w-full">
                <div className="flex flex-col gap-1 items-start flex-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Genişlik (px)</label>
                  <input 
                    type="number" 
                    value={customWidth} 
                    onChange={(e) => setCustomWidth(e.target.value)}
                    className="w-full bg-slate-800 text-white font-mono text-sm border border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="text-slate-600 font-bold self-end pb-2">✕</div>
                <div className="flex flex-col gap-1 items-start flex-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Yükseklik (px)</label>
                  <input 
                    type="number" 
                    value={customHeight} 
                    onChange={(e) => setCustomHeight(e.target.value)}
                    className="w-full bg-slate-800 text-white font-mono text-sm border border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* DOSYA YÜKLEME / TETİKLEYİCİ ALAN */}
              <div className="border-2 border-dashed border-slate-700 hover:border-blue-500/50 transition-colors rounded-xl p-8 bg-slate-900/30 cursor-pointer max-w-md mx-auto w-full relative group">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        if (event.target?.result) handleAddImage(event.target.result as string);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center gap-3">
                  <span className="text-3xl group-hover:scale-110 transition-transform">📁</span>
                  <span className="text-xs font-semibold text-slate-300">Görsel Seçin veya Sürükleyin</span>
                  <span className="text-[10px] text-slate-500 font-medium">PNG, JPG veya WEBP</span>
                </div>
              </div>
            </div>

            {/* GEÇMİŞ ÇALIŞMALAR (KAYDEDİLENLER) LİSTESİ */}
            <div className="w-full flex flex-col gap-4 mt-4">
              <h3 className="text-base font-bold text-slate-300 flex items-center gap-2">
                📂 Kayıtlı Boyutlandırma Geçmişi
              </h3>

              {projects.length === 0 ? (
                <div className="border border-dashed border-slate-800 rounded-xl flex items-center justify-center p-6 text-slate-600 text-xs font-medium">
                  Henüz kaydedilmiş bir boyut ayarı geçmişi yok.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {projects.map((project) => (
                    <div key={project.id} className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 flex items-center justify-between hover:border-slate-600 transition-all shadow-md">
                      <div className="flex flex-col gap-1 min-w-0 flex-1 pr-2">
                        <h4 className="font-bold text-sm text-slate-200 truncate">{project.name}</h4>
                        <span className="text-[11px] text-slate-500 font-mono">Boyut: {project.canvasWidth} x {project.canvasHeight} px</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleLoadProject(project)}
                          className="bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/20 text-xs font-bold px-3 py-1.5 rounded-lg transition-all"
                        >
                          Aç
                        </button>
                        <button
                          onClick={() => handleDeleteProject(project.id)}
                          className="bg-red-500/10 hover:bg-red-600 text-red-400 hover:text-white p-1.5 rounded-lg text-xs transition-all"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </main>
        )}
      </div>
    </div>
  );
}

export default App;