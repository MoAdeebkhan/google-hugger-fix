import { BarChart3, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ScanResult } from '@/types/scan';

interface ScanCardProps {
  scan: ScanResult;
  onClick: () => void;
  deletingId: string | null;
  onStartDelete: (id: string) => void;
  onConfirmDelete: (id: string) => void;
  onCancelDelete: () => void;
}

const ScanCard = ({ scan, onClick, deletingId, onStartDelete, onConfirmDelete, onCancelDelete }: ScanCardProps) => {
  return (
    <button
      onClick={onClick}
      className="w-full bg-card border border-border rounded-2xl p-4 flex items-center gap-4 text-left hover:border-primary/30 transition-colors"
    >
      <div className="w-16 h-16 bg-secondary rounded-xl overflow-hidden flex-shrink-0">
        {scan.imageUrl ? (
          <img src={scan.imageUrl} className="w-full h-full object-cover" alt={scan.foodName} referrerPolicy="no-referrer" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-muted-foreground/40" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h4 className="font-bold truncate text-foreground">{scan.foodName}</h4>
          <div className="flex items-center gap-1">
            {deletingId === scan.id ? (
              <div className="flex items-center gap-1 animate-in fade-in zoom-in duration-200">
                <button
                  onClick={(e) => { e.stopPropagation(); onConfirmDelete(scan.id!); }}
                  className="text-[10px] bg-nutri-rose text-primary-foreground px-2 py-1 rounded-md font-bold hover:opacity-90"
                >
                  Confirm
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onCancelDelete(); }}
                  className="text-[10px] bg-secondary text-muted-foreground px-2 py-1 rounded-md font-bold hover:opacity-90"
                >
                  No
                </button>
              </div>
            ) : (
              <button
                onClick={(e) => { e.stopPropagation(); onStartDelete(scan.id!); }}
                className="p-2 text-muted-foreground/30 hover:text-nutri-rose hover:bg-nutri-rose-light rounded-full transition-all"
                title="Delete scan"
              >
                <XCircle className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
          <span className={cn(
            "px-2 py-0.5 rounded-full font-bold",
            scan.rating >= 70 ? "bg-nutri-emerald-light text-primary" :
            scan.rating >= 40 ? "bg-nutri-amber-light text-nutri-amber" :
            "bg-nutri-rose-light text-nutri-rose"
          )}>
            {scan.rating}/100
          </span>
          <span>•</span>
          <span>{scan.calories} kcal</span>
        </div>
      </div>
    </button>
  );
};

export default ScanCard;