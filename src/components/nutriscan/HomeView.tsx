import { Camera, AlertCircle } from 'lucide-react';
import ScanCard from './ScanCard';
import type { ScanResult } from '@/types/scan';

interface HomeViewProps {
  history: ScanResult[];
  onOpenScanner: () => void;
  onViewHistory: () => void;
  onSelectScan: (scan: ScanResult) => void;
  deletingId: string | null;
  onStartDelete: (id: string) => void;
  onConfirmDelete: (id: string) => void;
  onCancelDelete: () => void;
}

const HomeView = ({ history, onOpenScanner, onViewHistory, onSelectScan, deletingId, onStartDelete, onConfirmDelete, onCancelDelete }: HomeViewProps) => {
  return (
    <div className="space-y-8">
      <div className="bg-primary rounded-3xl p-8 text-primary-foreground shadow-xl shadow-primary/20">
        <h2 className="text-2xl font-bold mb-2">Ready to scan?</h2>
        <p className="opacity-90 mb-6">Point your camera at any food item or barcode to start.</p>
        <button
          onClick={onOpenScanner}
          className="bg-card text-primary px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <Camera className="w-5 h-5" />
          Open Scanner
        </button>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg text-foreground">Recent Scans</h3>
          <button onClick={onViewHistory} className="text-primary text-sm font-semibold">View all</button>
        </div>
        {history.length === 0 ? (
          <div className="bg-card border border-border rounded-2xl p-8 text-center">
            <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-sm">No scans yet. Start by scanning your first food item!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {history.slice(0, 3).map((scan) => (
              <ScanCard
                key={scan.id}
                scan={scan}
                onClick={() => onSelectScan(scan)}
                deletingId={deletingId}
                onStartDelete={onStartDelete}
                onConfirmDelete={onConfirmDelete}
                onCancelDelete={onCancelDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeView;