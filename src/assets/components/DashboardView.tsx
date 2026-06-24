import { useToast } from './ToastProvider';
import { validateCanvasSize, validateFileSize, validateFileType, LIMITS } from '../utils/validation';

interface DashboardViewProps {
  customWidth: string;
  customHeight: string;
  onWidthChange: (value: string) => void;
  onHeightChange: (value: string) => void;
  onImageUpload: (src: string, file: File) => void;
}

export default function DashboardView({
  customWidth,
  customHeight,
  onWidthChange,
  onHeightChange,
  onImageUpload,
}: DashboardViewProps) {
  const toast = useToast();

  const handleFileInput = (file: File) => {
    // Validate file size
    const sizeValidation = validateFileSize(file);
    if (!sizeValidation.valid) {
      toast.show(sizeValidation.error || 'Dosya çok büyük');
      return;
    }

    // Validate file type
    const typeValidation = validateFileType(file);
    if (!typeValidation.valid) {
      toast.show(typeValidation.error || 'Desteklenmeyen dosya türü');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        onImageUpload(event.target.result as string, file);
      }
    };
    reader.onerror = () => {
      toast.show('Dosya okuma hatası. Lütfen tekrar deneyin.');
    };
    reader.readAsDataURL(file);
  };

  return (
    <main className="flex-1 bg-slate-900 p-6 overflow-hidden flex items-center justify-center w-full h-full">
      <div className="w-full max-w-4xl bg-slate-800/40 border border-slate-700/50 rounded-2xl p-8 backdrop-blur-sm shadow-2xl flex flex-col gap-8 text-center justify-center transition-all max-h-[90vh] overflow-y-auto">
        {/* Başlık */}
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3 justify-center">
            ⚙️ Görsel Boyut Ayarlayıcı
          </h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Görselinizi yüklemeden önce hedef çözünürlük piksellerini belirleyin.
          </p>
        </div>

        {/* Boyut Input Alanları */}
        <div className="flex items-center justify-center gap-6 bg-slate-900/50 p-5 rounded-2xl border border-slate-700/40 max-w-xl mx-auto w-full shadow-inner">
          <div className="flex flex-col gap-1.5 items-start flex-1">
            <label htmlFor="canvas-width" className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1">
              Genişlik (px)
            </label>
            <input
              id="canvas-width"
              type="number"
              min={LIMITS.MIN_CANVAS_SIZE}
              max={LIMITS.MAX_CANVAS_SIZE}
              value={customWidth}
              onChange={(e) => onWidthChange(e.target.value)}
              className="w-full bg-slate-800 text-white font-mono text-base border border-slate-700/80 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all shadow-sm"
              aria-label={`Canvas genişliği piksel cinsinden (${LIMITS.MIN_CANVAS_SIZE}–${LIMITS.MAX_CANVAS_SIZE})`}
            />
            <span className="text-[9px] text-slate-500">
              {LIMITS.MIN_CANVAS_SIZE}–{LIMITS.MAX_CANVAS_SIZE}px
            </span>
          </div>
          <div className="text-slate-500 font-bold text-lg self-end pb-2">✕</div>
          <div className="flex flex-col gap-1.5 items-start flex-1">
            <label htmlFor="canvas-height" className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1">
              Yükseklik (px)
            </label>
            <input
              id="canvas-height"
              type="number"
              min={LIMITS.MIN_CANVAS_SIZE}
              max={LIMITS.MAX_CANVAS_SIZE}
              value={customHeight}
              onChange={(e) => onHeightChange(e.target.value)}
              className="w-full bg-slate-800 text-white font-mono text-base border border-slate-700/80 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all shadow-sm"
              aria-label={`Canvas yüksekliği piksel cinsinden (${LIMITS.MIN_CANVAS_SIZE}–${LIMITS.MAX_CANVAS_SIZE})`}
            />
            <span className="text-[9px] text-slate-500">
              {LIMITS.MIN_CANVAS_SIZE}–{LIMITS.MAX_CANVAS_SIZE}px
            </span>
          </div>
        </div>

        {/* Dosya Yükleme Alanı */}
        <div className="border-2 border-dashed border-slate-700 hover:border-blue-500/50 transition-all duration-200 rounded-2xl min-h-[180px] bg-slate-900/20 hover:bg-slate-900/40 cursor-pointer max-w-xl mx-auto w-full relative group flex items-center justify-center p-6 shadow-md">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                handleFileInput(file);
              }
            }}
            className="absolute inset-0 opacity-0 cursor-pointer z-10"
            aria-label="Görsel dosyası seçin veya buraya sürükleyin. Desteklenen formatlar: PNG, JPG, JPEG, WEBP"
          />
          <div className="flex flex-col items-center gap-3 pointer-events-none">
            <div className="w-14 h-14 bg-slate-800/80 border border-slate-700 rounded-2xl flex items-center justify-center text-2xl shadow-md group-hover:scale-110 group-hover:border-blue-500/40 group-hover:bg-slate-800 transition-all duration-200" aria-hidden="true">
              📁
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-bold text-slate-200 group-hover:text-blue-400 transition-colors">
                Görsel Seçin veya Buraya Sürükleyin
              </span>
              <span className="text-[11px] text-slate-500 font-medium tracking-wide">
                PNG, JPG, JPEG veya WEBP formatları desteklenir (max {(LIMITS.MAX_FILE_SIZE / (1024 * 1024)).toFixed(0)}MB)
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
