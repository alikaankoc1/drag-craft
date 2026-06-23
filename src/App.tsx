import Header from './assets/components/Header';
import Sidebar from './assets/components/Sidebar';
import CanvasArea from './assets/components/CanvasArea';

function App() {
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden font-sans antialiased bg-slate-900 selection:bg-blue-500/30">
      {/* Üst Menü */}
      <Header />
      
      {/* Alt Kısım: Sol Menü + Orta Canvas */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <CanvasArea />
      </div>
    </div>
  );
}

export default App;