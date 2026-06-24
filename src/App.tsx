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
  
  const [canvasWidth, setCanvasWidth] = useState<number>(1080);
  const [canvasHeight, setCanvasHeight] = useState<number>(1080);

  // Görünüm modları arasına 'history' eklendi
  const [currentView, setCurrentView] = useState<'editor' | 'dashboard' | 'history'>('dashboard');
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);

  const [customWidth, setCustomWidth] = useState<string>('1080');
  const [customHeight, setCustomHeight] = useState<string>('1080');

  const [projects, setProjects] = useState<SavedProject[]>(() => {
    const saved = localStorage.getItem('img_resizer_projects');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return []; }
    }
    return [];
  });

  const selectedElement = elements.find((el) => el.id === selectedId) || null;

  const handleAddImage = (imageSrc: string) => {
    const w = parseInt(customWidth) || 1080;
    const h = parseInt(customHeight) || 1080;
    
    setCanvasWidth(w);
    setCanvasHeight(h);

    const imageId = crypto.randomUUID();
    const newElement: CanvasElement = {
      id: imageId,
      type: 'image',
      x: w / 2,
      y: h / 2,
      width: w * 0.9, 
      height: h * 0.9,
      color: 'transparent',
      src: imageSrc
    };

    setElements([newElement]);
    setSelectedId(imageId);
    setCurrentView('editor'); 
  };

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
  currentView={currentView === 'history' ? 'dashboard' : currentView}
  onViewChange={(v) => setCurrentView(v as any)}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          onImageUpload={handleAddImage}
          currentView={currentView}
          onViewChange={setCurrentView}
        />
        
        {/* 1. EDİTÖR GÖRÜNÜMÜ */}
        {currentView === 'editor' && (
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
        )}

 {/* 2. GİRİŞ PANELİ GÖRÜNÜMÜ (EKRANA TAM OTURAN SÜRÜM) */}
{currentView === 'dashboard' && (
  <main className="flex-1 bg-slate-900 p-6 overflow-hidden flex items-center justify-center w-full h-full">
    
    {/* Kartın iç padding değerlerini p-8 ve dikey boşlukları gap-8 yaparak ekrana sığmasını sağladık */}
    <div className="w-full max-w-4xl bg-slate-800/40 border border-slate-700/50 rounded-2xl p-8 backdrop-blur-sm shadow-2xl flex flex-col gap-8 text-center justify-center transition-all max-h-[90vh] overflow-y-auto">
      
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3 justify-center">
          ⚙️ Görsel Boyut Ayarlayıcı
        </h2>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          Görselinizi yüklemeden önce hedef çözünürlük piksellerini belirleyin.
        </p>
      </div>

      {/* BOYUT INPUT ALANLARI */}
      <div className="flex items-center justify-center gap-6 bg-slate-900/50 p-5 rounded-2xl border border-slate-700/40 max-w-xl mx-auto w-full shadow-inner">
        <div className="flex flex-col gap-1.5 items-start flex-1">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1">Genişlik (px)</label>
          <input 
            type="number" 
            value={customWidth} 
            onChange={(e) => setCustomWidth(e.target.value)}
            className="w-full bg-slate-800 text-white font-mono text-base border border-slate-700/80 rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-sm"
          />
        </div>
        <div className="text-slate-500 font-bold text-lg self-end pb-2">✕</div>
        <div className="flex flex-col gap-1.5 items-start flex-1">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1">Yükseklik (px)</label>
          <input 
            type="number" 
            value={customHeight} 
            onChange={(e) => setCustomHeight(e.target.value)}
            className="w-full bg-slate-800 text-white font-mono text-base border border-slate-700/80 rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* DOSYA YÜKLEME ALANI (Dikey yüksekliği min-h-[180px] ile ekrana optimize edildi) */}
      <div className="border-2 border-dashed border-slate-700 hover:border-blue-500/50 transition-all duration-200 rounded-2xl min-h-[180px] bg-slate-900/20 hover:bg-slate-900/40 cursor-pointer max-w-xl mx-auto w-full relative group flex items-center justify-center p-6 shadow-md">
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
          className="absolute inset-0 opacity-0 cursor-pointer z-10"
        />
        <div className="flex flex-col items-center gap-3 pointer-events-none">
          <div className="w-14 h-14 bg-slate-800/80 border border-slate-700 rounded-2xl flex items-center justify-center text-2xl shadow-md group-hover:scale-110 group-hover:border-blue-500/40 group-hover:bg-slate-800 transition-all duration-200">
            📁
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-bold text-slate-200 group-hover:text-blue-400 transition-colors">
              Görsel Seçin veya Buraya Sürükleyin
            </span>
            <span className="text-[11px] text-slate-500 font-medium tracking-wide">
              PNG, JPG, JPEG veya WEBP formatları desteklenir
            </span>
          </div>
        </div>
      </div>

    </div>
  </main>
)}

 {/* 3. KAYITLI BOYUTLANDIRMA GEÇMİŞİ SAYFASI */}
{currentView === 'history' && (
  <main className="flex-1 bg-slate-900 p-8 overflow-auto flex flex-col gap-6 max-w-5xl mx-auto w-full animate-fadeIn">
    <div className="flex items-center justify-between border-b border-slate-800 pb-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold text-slate-200 flex items-center gap-2">
          📂 Kayıtlı Boyutlandırma Geçmişi
        </h2>
        <p className="text-xs text-slate-500">Daha önce çalıştığınız ve kaydettiğiniz tüm özel çözünürlükler.</p>
      </div>
      <button 
        onClick={() => setCurrentView('dashboard')}
        className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
      >
        ← Kapat / Geri Dön
      </button>
    </div>

    {projects.length === 0 ? (
      <div className="border border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center p-16 text-slate-600 text-sm font-medium gap-2">
        <span>📁</span>
        <span>Henüz kaydedilmiş bir boyut çalışması bulunmuyor.</span>
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((project) => (
          <div key={project.id} className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-5 flex items-center justify-between hover:border-blue-500/40 transition-all shadow-md group">
            <div className="flex flex-col gap-1 min-w-0 flex-1 pr-4">
              <h4 className="font-bold text-sm text-slate-200 group-hover:text-blue-400 transition-colors truncate">{project.name}</h4>
              <div className="flex items-center gap-3 text-[11px] text-slate-500 font-mono mt-0.5">
                <span className="bg-slate-900 px-2 py-0.5 rounded text-slate-400 font-semibold">
                  {project.canvasWidth} x {project.canvasHeight} px
                </span>
                <span>{project.updatedAt}</span>
              </div>
            </div>
            
     {/* AKSİYON BUTONLARI (BÜYÜTÜLMÜŞ SÜRÜM) */}
<div className="flex items-center gap-3 shrink-0">
  <button
    onClick={() => handleLoadProject(project)}
    className="bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm px-5 py-3 rounded-xl shadow-lg hover:shadow-blue-500/20 active:scale-95 transition-all flex items-center gap-1.5 h-12"
    title="Çalışmayı Editörde Aç"
  >
    <span>Aç</span> 
    <span className="text-base">📝</span>
  </button>

  {/* 📥 SEÇMELİ FORMAT İLE PC'YE İNDİRME BUTONU (BÜYÜTÜLDÜ) */}
  <button
    onClick={() => {
      const format = prompt(
        `"${project.name}" çalışmasını hangi formatta indirmek istersiniz?\n\nSeçenekler: png, jpeg, json`,
        "png"
      )?.toLowerCase().trim();

      if (!format) return;

      const fileBaseName = project.name.toLowerCase().replace(/[^a-z0-9]/g, '_');

      if (format === 'json') {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(project, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", `${fileBaseName}_config.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
        return;
      }

      if (format === 'png' || format === 'jpeg') {
        const canvas = document.createElement('canvas');
        canvas.width = project.canvasWidth;
        canvas.height = project.canvasHeight;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          alert('Görsel dönüştürme hatası oluştu.');
          return;
        }

        if (format === 'jpeg') {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        const imageElement = project.elements.find(el => el.type === 'image' && el.src);

        if (imageElement && imageElement.src) {
          const img = new Image();
          img.crossOrigin = "anonymous"; 
          img.src = imageElement.src;

          img.onload = () => {
            const drawX = imageElement.x - (imageElement.width / 2);
            const drawY = imageElement.y - (imageElement.height / 2);
            
            ctx.drawImage(img, drawX, drawY, imageElement.width, imageElement.height);

            const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
            const imgUrl = canvas.toDataURL(mimeType, 1.0);
            
            const downloadAnchor = document.createElement('a');
            downloadAnchor.setAttribute("href", imgUrl);
            downloadAnchor.setAttribute("download", `${fileBaseName}.${format}`);
            document.body.appendChild(downloadAnchor);
            downloadAnchor.click();
            downloadAnchor.remove();
          };

          img.onerror = () => {
            alert('Görsel dosyası yüklenirken bir hata oluştu.');
          };
        } else {
          alert('Bu çalışmada boyutlandırılacak bir görsel bulunamadı.');
        }
        return;
      }

      alert('Geçersiz format! Lütfen sadece png, jpeg veya json yazın.');
    }}
    className="bg-emerald-600/20 hover:bg-emerald-600 border border-emerald-500/30 text-emerald-400 hover:text-white text-lg w-12 h-12 rounded-xl flex items-center justify-center shadow-lg hover:shadow-emerald-600/20 active:scale-95 transition-all"
    title="Format Seç ve İndir"
  >
    📥
  </button>

  {/* 🗑️ SİLME BUTONU (BÜYÜTÜLDÜ) */}
  <button
    onClick={() => handleDeleteProject(project.id)}
    className="bg-red-500/10 hover:bg-red-600 text-red-400 hover:text-white text-lg w-12 h-12 rounded-xl flex items-center justify-center shadow-lg hover:shadow-red-600/20 active:scale-95 transition-all"
    title="Sil"
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