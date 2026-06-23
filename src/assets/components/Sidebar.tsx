export default function Sidebar() {
  const tools = [
    { id: 'text', label: 'Metin Ekle', icon: '📝' },
    { id: 'rect', label: 'Kare / Dikdörtgen', icon: '⬛' },
    { id: 'circle', label: 'Daire', icon: '⚪' },
    { id: 'image', label: 'Görsel Yükle', icon: '🖼️' },
  ];

  return (
    <aside className="w-72 bg-slate-800 border-r border-slate-700 p-4 text-white flex flex-col gap-4">
      <h2 className="text-lg font-semibold mb-2 text-slate-300">Bileşenler</h2>
      <div className="grid grid-cols-1 gap-2">
        {tools.map((tool) => (
          <div
            key={tool.id}
            className="flex items-center gap-3 bg-slate-700 hover:bg-slate-600 p-3 rounded-lg cursor-pointer transition-all border border-transparent hover:border-blue-500 shadow-md"
          >
            <span className="text-xl">{tool.icon}</span>
            <span className="text-sm font-medium">{tool.label}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}