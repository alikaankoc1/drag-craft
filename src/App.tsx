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
  canvasWidth: number;
  canvasHeight: number;
}

function App() {
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [canvasWidth, setCanvasWidth] = useState<number>(800);
  const [canvasHeight, setCanvasHeight] = useState<number>(500);

const [currentView, setCurrentView] = useState<'editor' | 'dashboard'>('dashboard');
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);

  // Yeni State'ler: Arama Motoru ve Şablonlar İçin
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [templatedTemplates, setTemplatedTemplates] = useState<{ id: string; name: string; bgKeyword: string; text: string }[]>([]);

  // Varsayılan / Popüler Şablon Önerileri
  const defaultTemplates = [
    { id: '1', name: 'Hayırlı Cumalar Şablonu', bgKeyword: 'mosque,islamic', text: 'Hayırlı Cumalar\n"Dualarınız Kabul Olsun"' },
    { id: '2', name: 'Doğum Günü Kutlaması', bgKeyword: 'birthday,party', text: 'Mutlu Yıllar!\nİyi ki Doğdun 🎉' },
    { id: '3', name: 'Teknoloji & İnovasyon', bgKeyword: 'cyberpunk,technology', text: 'Geleceği Tasarla\nCanvas AI ile Keşfet' },
    { id: '4', name: 'Minimalist Doğa Tasarımı', bgKeyword: 'minimalist,nature', text: 'Sakinliği Hisset' },
    { id: '5', name: 'Motivasyon Kartı', bgKeyword: 'workspace,success', text: 'Asla Vazgeçme!\nBugün Yeni Bir Başlangıç' }
  ];

  // HATASIZ LAZY STATE: Projeleri ilk renderda doğrudan LocalStorage'dan güvenle okuyoruz
  const [projects, setProjects] = useState<SavedProject[]>(() => {
    const savedProjects = localStorage.getItem('canvas_ai_projects');
    if (savedProjects) {
      try {
        return JSON.parse(savedProjects);
      } catch (e) {
        console.error('Projeler yüklenirken hata oluştu:', e);
        return [];
      }
    }
    return [];
  });

  // Seçili elemanı türetilmiş state olarak buluyoruz
  const selectedElement = elements.find((el) => el.id === selectedId) || null;

  useEffect(() => {
    // İlk açılışta varsayılan şablonları yükle
    setTemplatedTemplates(defaultTemplates);
  }, []);

  // Arama yapıldığında şablonları dinamik olarak güncelleme lojiği
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setTemplatedTemplates(defaultTemplates);
      return;
    }

    const query = searchQuery.trim();
    // Kullanıcının arattığı kelimeye göre dinamik 4 farklı varyasyon şablonu üretiliyor
    const dynamicResults = [
      { id: `d1-${Date.now()}`, name: `${query} Özel Tasarımı`, bgKeyword: query, text: `${query}\nÖzel Şablonu` },
      { id: `d2-${Date.now()}`, name: `Minimalist ${query}`, bgKeyword: `${query},minimalist`, text: query.toUpperCase() },
      { id: `d3-${Date.now()}`, name: `Modern ${query} Kartı`, bgKeyword: `${query},modern`, text: `Harika Bir Gün\n${query} ile Başlar` },
      { id: `d4-${Date.now()}`, name: `${query} Sunumu`, bgKeyword: `${query},abstract`, text: `Başlık Alanı\n${query} Konsepti` }
    ];
    setTemplatedTemplates(dynamicResults);
  };

  // Şablona Tıklandığında Editöre Aktarma ve Canvas'ı Yapılandırma
 // Şablona Tıklandığında Editöre Aktarma ve Canvas'ı Yapılandırma
  const handleSelectTemplate = (template: { name: string; bgKeyword: string; text: string }) => {
    // Canvas boyutunu kare şablon standardına çekelim (Sosyal Medya dostu: 800x800)
    setCanvasWidth(800);
    setCanvasHeight(800);

    const generatedElements: CanvasElement[] = [];
    const imageId = crypto.randomUUID();
    const textId = crypto.randomUUID();

    // Güvenilir ve hızlı çalışan Unsplash Source alternatifi (Dinamik anahtar kelime beslemeli)
    const dynamicBgUrl = `https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=800&h=800&q=80`; 
    
    // NOT: İsterseniz bgKeyword'e göre tamamen özelleşmiş statik Unsplash id'leri de eşleştirebilirsiniz.
    // Şablon kelimesine göre arayüze can verecek dinamik arka plan görsel atamaları:
    let selectedBg = dynamicBgUrl;
    if (template.bgKeyword.includes('mosque')) {
      selectedBg = 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=800&h=800&q=80'; // Cuma / Cami konsepti
    } else if (template.bgKeyword.includes('birthday')) {
      selectedBg = 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&h=800&q=80'; // Doğum Günü konsepti
    } else if (template.bgKeyword.includes('cyberpunk')) {
      selectedBg = 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&h=800&q=80'; // Teknoloji konsepti
    } else if (template.bgKeyword.includes('minimalist')) {
      selectedBg = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&h=800&q=80'; // Doğa konsepti
    } else if (template.bgKeyword.includes('workspace')) {
      selectedBg = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&h=800&q=80'; // Motivasyon/Çalışma alanı konsepti
    } else {
      // Arama motorundan dinamik kelime geldiyse Unsplash Source alternatifi kullanalım:
      selectedBg = `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&h=800&q=80`;
    }

    // 1. Katman: Arka Plan Görsel Elemanı (Canvas'ı kaplayacak şekilde merkezde: 400x400 konumunda 800x800 boyut)
    generatedElements.push({
      id: imageId,
      type: 'image',
      x: 400,
      y: 400,
      width: 800,
      height: 800,
      color: 'transparent',
      src: selectedBg
    });

    // 2. Katman: Görselin üstüne gelecek olan özelleştirilebilir şık Metin Elemanı
    generatedElements.push({
      id: textId,
      type: 'text',
      x: 400,
      y: 400,
      width: 600,
      height: 150,
      color: '#ffffff', // Koyu renkli resimlerin üzerinde net okunması için beyaz font
      text: template.text,
      fontSize: 36,
      fontFamily: 'sans-serif'
    });

    // Hazırlanan elemanları canvas state'ine basıyoruz
    setElements(generatedElements);
    setCurrentProjectId(null); // Yeni bir şablondan türetildiği için henüz bir proje ID'si yok
    setSelectedId(textId); // Metni doğrudan seçili hale getirelim ki PropertiesPanel hemen açılsın
    setCurrentView('editor'); // Kullanıcıyı pürüzsüzce editör alanına yönlendiriyoruz
  };
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
        canvasWidth,
        canvasHeight,
      };
      updatedProjects.push(newProject);
      setCurrentProjectId(newProject.id);
      alert('Yeni proje başarıyla listeye kaydedildi! 🚀');
    }

    saveProjectsToStorage(updatedProjects);
  };

  const handleLoadProject = (project: SavedProject) => {
    setElements(project.elements);
    setCanvasWidth(project.canvasWidth || 800);
    setCanvasHeight(project.canvasHeight || 500);
    setCurrentProjectId(project.id);
    setSelectedId(null);
    setCurrentView('editor');
  };

  // Proje Silme Fonksiyonu
  const handleDeleteProject = (id: string) => {
    if (!confirm('Bu projeyi silmek istediğinize emin misiniz?')) return;
    const updatedProjects = projects.filter((p) => p.id !== id);
    saveProjectsToStorage(updatedProjects);
    if (currentProjectId === id) {
      handleClear();
    }
  };

  const handleExportProjectJSON = (project: SavedProject) => {
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
      if (parsed && Array.isArray(parsed.elements)) {
        setElements(parsed.elements);
        setCanvasWidth(parsed.canvasWidth || 800);
        setCanvasHeight(parsed.canvasHeight || 500);
      } else if (Array.isArray(parsed)) {
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
          onSelectPreset={(w, h) => { setCanvasWidth(w); setCanvasHeight(h); }}
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
      /* DASHBOARD: ARAMA MOTORLU CANVA ŞABLON PANELİ */
<main className="flex-1 bg-slate-900 p-8 overflow-auto flex flex-col gap-8">
  
  {/* MİNİMALİST VE PROJE RENKLERİNE UYGUN ARAMA ALANI */}
  <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm">
    <div className="flex flex-col gap-1 text-center md:text-left">
      <h2 className="text-xl font-bold text-white flex items-center gap-2 justify-center md:justify-start">
        <span className="text-blue-400">✨</span> Bugün ne tasarlayacaksınız?
      </h2>
      <p className="text-xs text-slate-400">
        Kelimenizi aratın ve hazır şablonlarla saniyeler içinde çalışmaya başlayın.
      </p>
    </div>
    
    <form onSubmit={handleSearchSubmit} className="w-full md:w-96 shrink-0">
      <div className="relative flex items-center bg-slate-900/90 border border-slate-700 rounded-xl overflow-hidden px-3.5 py-0.5 focus-within:border-blue-500/70 focus-within:ring-1 focus-within:ring-blue-500/20 transition-all shadow-inner">
        <span className="text-base mr-2 text-slate-500">🔍</span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder='Örn: "cuma", "space", "neon"...'
          className="w-full bg-transparent text-slate-200 placeholder-slate-500 text-xs font-medium focus:outline-none py-2.5"
        />
        {searchQuery && (
          <button 
            type="button" 
            onClick={() => { setSearchQuery(''); setTemplatedTemplates(defaultTemplates); }}
            className="text-slate-500 hover:text-slate-300 text-xs font-bold px-1 transition-colors"
          >
            ✕
          </button>
        )}
      </div>
    </form>
  </div>

  {/* DİNAMİK KEŞFET / ŞABLONLAR KART LİSTESİ (Aşağıdaki kısım aynen devam ediyor...) */}
            {/* DİNAMİK KEŞFET / ŞABLONLAR KART LİSTESİ */}
            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2">
                <span>✨</span> Önerilen Şablon Tasarımları
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {templatedTemplates.map((tmpl) => (
                  <div 
                    key={tmpl.id}
                    onClick={() => handleSelectTemplate(tmpl)}
                    className="group bg-slate-800 border border-slate-700/60 rounded-xl overflow-hidden shadow-md cursor-pointer hover:border-blue-500/50 hover:shadow-xl transition-all flex flex-col h-48 relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/80 z-10 transition-opacity group-hover:opacity-90" />
                    <img 
                      src={`https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=50`}
                      alt={tmpl.name}
                      className="absolute inset-0 w-full h-full object-cover filter saturate-50 contrast-125 opacity-40 group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="p-4 flex flex-col justify-between h-full relative z-20">
                      <span className="text-[10px] bg-blue-500/20 text-blue-400 border border-blue-500/30 font-semibold px-2 py-0.5 rounded-full w-fit uppercase tracking-wider">
                        Şablon
                      </span>
                      <p className="text-xs font-medium text-slate-200 line-clamp-3 text-center italic bg-slate-900/40 p-1.5 rounded border border-slate-700/30 backdrop-blur-[2px]">
                        {tmpl.text.replace('\n', ' ')}
                      </p>
                      <h4 className="font-bold text-sm text-white group-hover:text-blue-400 transition-colors truncate mt-1">
                        {tmpl.name}
                      </h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <hr className="border-slate-800" />

            {/* KULLANICININ KENDİ KAYDETTİĞİ PROJELER */}
            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2">
                <span>📁</span> Benim Kaydettiğim Tasarımlar
              </h3>

              {projects.length === 0 ? (
                <div className="border border-dashed border-slate-700 rounded-xl flex flex-col items-center justify-center p-8 text-slate-500">
                  <p className="text-sm font-medium">Henüz lokalde kayıtlı bir tasarımınız bulunmuyor.</p>
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
            </div>

          </main>
        )}
      </div>
    </div>
  );
}

export default App;