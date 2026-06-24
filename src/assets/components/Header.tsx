import { useRef } from 'react';

interface HeaderProps {
  onClear: () => void;
  onSave: () => void;
  onImport: (jsonData: string) => void;
  currentView: 'editor' | 'dashboard';
  onViewChange: (view: 'editor' | 'dashboard') => void;
}

export default function Header({ 
  onClear, 
  onSave, 
  onImport, 
  currentView, 
  onViewChange 
}: HeaderProps) {
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
    e.target.value = '';
  };

  return (
    <header className="h-16 bg-slate-800 border-b border-slate-700 px-6 flex items-center justify-between z-20 shadow-md">
      {/* Logo */}
      <div 
        onClick={() => onViewChange('editor')} 
        className="flex items-center gap-2 select-none cursor-pointer group"
      >
        <span className="text-2xl group-hover:scale-110 transition-transform">🎨</span>
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Canvas AI
        </h1>
      </div>

      {/* Aksiyon Butonları */}
      <div className="flex items-center gap-3">
        {currentView === 'editor' && (
          <button
            onClick={onClear}
            className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white bg-slate-700 hover:bg-slate-600 rounded-lg transition-all border border-slate-600 active:scale-95"
          >
            Temizle
          </button>
        )}

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
          Dışarıdan Dosya Yükle (.json)
        </button>

        <button
          onClick={onSave}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-all shadow-md shadow-blue-950/50 active:scale-95"
        >
          {currentView === 'dashboard' ? 'Yeni Proje Değişikliklerini Kaydet' : 'Tasarımı Kaydet'}
        </button>
      </div>
    </header>
  );
}