import { useRef } from 'react';

interface HeaderProps {
  onClear: () => void;
  onSave: () => void;
  onExport: () => void;
  onImport: (jsonData: string) => void;
}

export default function Header({ onClear, onSave, onExport, onImport }: HeaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result && typeof event.target.result === 'string') {
          onImport(event.target.result);
        }
      };
      reader.readAsText(file);
    }
    e.target.value = ''; // Aynı dosyayı tekrar seçebilmek için sıfırla
  };

  return (
    <header className="h-16 bg-slate-800 border-b border-slate-700 px-6 flex items-center justify-between z-20 shadow-md">
      {/* Logo */}
      <div className="flex items-center gap-2 select-none">
        <span className="text-2xl">🎨</span>
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Canvas AI
        </h1>
      </div>

      {/* Aksiyon Butonları */}
      <div className="flex items-center gap-3">
        <button
          onClick={onClear}
          className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white bg-slate-700 hover:bg-slate-600 rounded-lg transition-all border border-slate-600 active:scale-95"
        >
          Temizle
        </button>

        {/* Gizli JSON Import Input'u */}
        <input
          type="file"
          ref={fileInputRef}
          accept=".json"
          onChange={handleFileChange}
          className="hidden"
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white bg-slate-700 hover:bg-slate-600 rounded-lg transition-all border border-slate-600 active:scale-95"
        >
          Dosya Yükle (.json)
        </button>

        <button
          onClick={onExport}
          className="px-4 py-2 text-sm font-medium text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 rounded-lg transition-all border border-blue-500/20 active:scale-95"
        >
          JSON İndir
        </button>

        <button
          onClick={onSave}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-all shadow-md shadow-blue-950/50 active:scale-95"
        >
          Tasarımı Kaydet
        </button>
      </div>
    </header>
  );
}