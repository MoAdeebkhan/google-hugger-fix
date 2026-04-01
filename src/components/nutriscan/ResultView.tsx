import { ChevronLeft, CheckCircle2, XCircle, Flame, Dna, Wheat, Droplets } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ScanResult } from '@/types/scan';

interface ResultViewProps {
  result: ScanResult;
  onBack: () => void;
  onScanAnother: () => void;
}

const ResultView = ({ result, onBack, onScanAnother }: ResultViewProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-2">
        <button onClick={onBack} className="p-2 hover:bg-secondary rounded-full">
          <ChevronLeft className="w-6 h-6 text-foreground" />
        </button>
        <h2 className="text-xl font-bold text-foreground">Analysis Result</h2>
      </div>

      <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
        <div className="aspect-video bg-secondary relative">
          {result.imageUrl && (
            <img src={result.imageUrl} className="w-full h-full object-cover" alt={result.foodName} referrerPolicy="no-referrer" />
          )}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
            <div className="bg-card/90 backdrop-blur px-4 py-2 rounded-xl shadow-lg">
              <h3 className="font-bold text-lg text-foreground">{result.foodName}</h3>
              {result.barcode && <p className="text-[10px] text-muted-foreground font-mono">BC: {result.barcode}</p>}
            </div>
            <div className={cn(
              "w-16 h-16 rounded-2xl flex flex-col items-center justify-center shadow-lg text-primary-foreground",
              result.rating >= 70 ? "bg-primary" :
              result.rating >= 40 ? "bg-nutri-amber" :
              "bg-nutri-rose"
            )}>
              <span className="text-2xl font-black leading-none">{result.rating}</span>
              <span className="text-[10px] font-bold uppercase opacity-80">Score</span>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 gap-4 mb-8">
            {[
              { icon: Flame, label: "Calories", value: `${result.calories} kcal`, colorBg: "bg-orange-100", colorText: "text-orange-600" },
              { icon: Dna, label: "Protein", value: `${result.protein}g`, colorBg: "bg-blue-100", colorText: "text-blue-600" },
              { icon: Wheat, label: "Carbs", value: `${result.carbs}g`, colorBg: "bg-nutri-amber-light", colorText: "text-nutri-amber" },
              { icon: Droplets, label: "Fats", value: `${result.fats}g`, colorBg: "bg-purple-100", colorText: "text-purple-600" },
            ].map(({ icon: Icon, label, value, colorBg, colorText }) => (
              <div key={label} className="bg-secondary rounded-2xl p-4 flex items-center gap-3">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", colorBg, colorText)}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase">{label}</p>
                  <p className="font-bold text-foreground">{value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="font-bold flex items-center gap-2 text-primary mb-3">
                <CheckCircle2 className="w-5 h-5" />
                Pros
              </h4>
              <ul className="space-y-2">
                {result.pros.map((pro, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                    {pro}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold flex items-center gap-2 text-nutri-rose mb-3">
                <XCircle className="w-5 h-5" />
                Cons
              </h4>
              <ul className="space-y-2">
                {result.cons.map((con, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-nutri-rose mt-1.5 flex-shrink-0" />
                    {con}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={onScanAnother}
        className="w-full bg-primary text-primary-foreground rounded-2xl py-4 font-bold hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
      >
        Scan Another Item
      </button>
    </div>
  );
};

export default ResultView;