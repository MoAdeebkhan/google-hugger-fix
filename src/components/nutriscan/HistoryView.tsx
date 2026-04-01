import { ChevronLeft, History } from 'lucide-react';
import ScanCard from './ScanCard';
import type { ScanResult } from '@/types/scan';

interface HistoryViewProps {
  history: ScanResult[];
  onBack: () => void;
  onSelectScan: (scan: ScanResult) => void;
  deletingId: string | null;
  onStartDelete: (id: string) => void;
  onConfirmDelete: (id: string) => void;
  onCancelDelete: () => void;
}

const HistoryView = ({ history, onBack, onSelectScan, deletingId, onStartDelete, onConfirmDelete, onCancelDelete }: HistoryViewProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-2">
        <button onClick={onBack} className="p-2 hover:bg-secondary rounded-full">
          <ChevronLeft className="w-6 h-6 text-foreground" />
        </button>
        <h2 className="text-xl font-bold text-foreground">Scan History</h2>
      </div>

      {history.length === 0 ? (
        <div className="bg-card border border-border rounded-3xl p-12 text-center">
          <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
            <History className="w-8 h-8 text-muted-foreground/40" />
          </div>
          <p className="text-muted-foreground">Your history is empty.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((scan) => (
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
  );
};

export default HistoryView;