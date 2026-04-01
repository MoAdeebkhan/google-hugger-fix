import { Scan, History, LogOut } from 'lucide-react';

interface AppHeaderProps {
  onHistory: () => void;
  onLogout: () => void;
}

const AppHeader = ({ onHistory, onLogout }: AppHeaderProps) => {
  return (
    <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <Scan className="w-5 h-5 text-primary-foreground" />
        </div>
        <span className="font-bold text-lg text-foreground">NutriScan</span>
      </div>
      <div className="flex items-center gap-4">
        <button onClick={onHistory} className="p-2 text-muted-foreground hover:bg-secondary rounded-full transition-colors">
          <History className="w-6 h-6" />
        </button>
        <button onClick={onLogout} className="p-2 text-muted-foreground hover:bg-secondary rounded-full transition-colors">
          <LogOut className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
};

export default AppHeader;