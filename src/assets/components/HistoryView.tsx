import { SavedProject } from '../../App';
import { useToast } from './ToastProvider';

interface HistoryViewProps {
  projects: SavedProject[];
  onSelectProject: (projectId: string) => void;
  onDeleteProject: (projectId: string) => void;
}

export default function HistoryView({
  projects,
  onSelectProject,
  onDeleteProject,
}: HistoryViewProps) {
  const toast = useToast();

  if (projects.length === 0) {
    return (
      <main className="flex-1 bg-slate-900 p-6 overflow-hidden flex items-center justify-center w-full h-full" role="main">
        <div className="text-center">
          <div className="text-6xl mb-4" aria-hidden="true">📭</div>
          <p className="text-slate-400 text-lg">Henüz kaydedilmiş proje yok.</p>
          <p className="text-slate-500 text-sm">Editor'de görsel yükleyerek başlayın!</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 bg-slate-900 p-6 overflow-y-auto w-full" role="main">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <span aria-hidden="true">📚</span>
          <span>Kaydedilen Projeler ({projects.length})</span>
        </h2>

        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3" role="list">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group bg-slate-800/60 border border-slate-700/50 hover:border-slate-600 rounded-xl p-4 transition-all duration-200 hover:shadow-lg hover:bg-slate-800/80"
              role="listitem"
            >
              {/* Proje başlığı */}
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-bold text-white text-sm truncate group-hover:text-blue-400 transition-colors max-w-[200px]" title={project.name}>
                  {project.name}
                </h3>
                <span className="text-[10px] bg-slate-700/80 text-slate-300 px-2 py-1 rounded-md whitespace-nowrap ml-2" aria-label={`Boyutlar: ${project.width} piksel genişlik, ${project.height} piksel yükseklik`}>
                  {project.width}×{project.height}
                </span>
              </div>

              {/* Tarih bilgisi */}
              <div className="text-[11px] text-slate-500 mb-3">
                {new Date(project.savedAt).toLocaleDateString('tr-TR')} -{' '}
                {new Date(project.savedAt).toLocaleTimeString('tr-TR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>

              {/* İçindeki element sayısı */}
              <div className="text-[12px] text-slate-400 mb-4">
                {project.elements.length} öğe • {project.imageUrl ? '1 görsel' : 'Görsel yok'}
              </div>

              {/* Butonlar */}
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    onSelectProject(project.id);
                    toast.show(`"${project.name}" yükleniyor...`);
                  }}
                  className="flex-1 text-sm font-semibold px-3 py-2 rounded-lg bg-blue-600/80 hover:bg-blue-600 text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  aria-label={`Projeyi aç: ${project.name}`}
                >
                  📂 Aç
                </button>
                <button
                  onClick={() => {
                    onDeleteProject(project.id);
                    toast.show(`"${project.name}" silindi`);
                  }}
                  className="text-sm font-semibold px-3 py-2 rounded-lg bg-red-600/20 hover:bg-red-600/40 text-red-300 hover:text-red-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                  aria-label={`Projeyi sil: ${project.name}`}
                  title="Sil"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
