export default function CanvasArea() {
  return (
    <main className="flex-1 bg-slate-900 p-8 flex items-center justify-center overflow-auto">
      {/* Gerçek Canva boyutlarında beyaz çalışma alanı */}
      <div className="w-[800px] h-[500px] bg-white rounded-lg shadow-2xl relative overflow-hidden flex items-center justify-center border border-slate-700">
        <p className="text-slate-400 pointer-events-none select-none text-sm">
          Sol panelden elementleri buraya sürükleyip bırakın
        </p>
      </div>
    </main>
  );
}