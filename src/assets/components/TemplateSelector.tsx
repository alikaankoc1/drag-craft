interface PresetTemplate {
  id: string;
  name: string;
  width: number;
  height: number;
  icon: string;
}

interface TemplateSelectorProps {
  onSelectPreset: (width: number, height: number) => void;
  canvasWidth: number;
  canvasHeight: number;
}

const PRESET_TEMPLATES: PresetTemplate[] = [
  { id: 'insta-post', name: 'Instagram Gönderisi', width: 800, height: 800, icon: '📸' },
  { id: 'insta-story', name: 'Instagram Story', width: 450, height: 800, icon: '📱' },
  { id: 'yt-banner', name: 'YouTube Banner', width: 900, height: 506, icon: '📺' },
  { id: 'a4-document', name: 'A4 Belge', width: 595, height: 842, icon: '📄' },
  { id: 'custom-presentation', name: 'Sunum (16:9)', width: 960, height: 540, icon: '📊' },
];

export default function TemplateSelector({ onSelectPreset, canvasWidth, canvasHeight }: TemplateSelectorProps) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-1">Şablon Boyutları</h3>
      
      <div className="flex flex-col gap-2">
        {PRESET_TEMPLATES.map((preset) => {
          const isSelected = canvasWidth === preset.width && canvasHeight === preset.height;
          return (
            <button
              key={preset.id}
              onClick={() => onSelectPreset(preset.width, preset.height)}
              className={`flex items-center justify-between p-2.5 rounded-lg border text-left transition-all text-sm group ${
                isSelected
                  ? 'bg-blue-600/20 border-blue-500 text-blue-400 font-medium'
                  : 'bg-slate-700/40 hover:bg-slate-700 border-slate-700 hover:border-slate-600 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-base">{preset.icon}</span>
                <span>{preset.name}</span>
              </div>
              <span className="text-xs font-mono text-slate-500 group-hover:text-slate-400">
                {preset.width}x{preset.height}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}