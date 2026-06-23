export default function Header() {
  return (
    <header className="h-16 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-6 text-white shadow-md">
      <div className="flex items-center gap-2">
        <span className="text-2xl">🎨</span>
        <h1 className="text-xl font-bold bg-gradient-to-r via-purple-400 from-blue-400 to-pink-400 bg-clip-text text-transparent">
          Canvas AI
        </h1>
      </div>
      <div className="flex gap-3">
        <button className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg text-sm font-medium transition-all">
          Temizle
        </button>
        <button className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-lg shadow-blue-500/20">
          Tasarımı Kaydet
        </button>
      </div>
    </header>
  );
}