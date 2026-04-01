import React, { useRef, useCallback, useState } from 'react';
import Webcam from 'react-webcam';
import { ChevronLeft, Loader2, AlertCircle, Camera } from 'lucide-react';
import { GoogleGenAI, Type } from '@google/genai';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { ScanResult } from '@/types/scan';

const GENAI_MODEL = "gemini-2.5-flash-preview-04-17";

interface ScannerViewProps {
  userId: string;
  onBack: () => void;
  onResult: (result: ScanResult) => void;
}

const ScannerView = ({ userId, onBack, onResult }: ScannerViewProps) => {
  const webcamRef = useRef<Webcam>(null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const captureAndAnalyze = useCallback(async () => {
    if (!webcamRef.current) return;

    setScanning(true);
    setError(null);

    try {
      const imageSrc = webcamRef.current.getScreenshot();
      if (!imageSrc) throw new Error("Failed to capture image");

      const base64Data = imageSrc.split(',')[1];
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) throw new Error("Gemini API key not configured");

      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: GENAI_MODEL,
        contents: {
          parts: [
            { text: "Analyze this food item or barcode. Provide nutritional data and a health rating out of 100. Be accurate. If it's a barcode, identify the product first. Return ONLY JSON." },
            { inlineData: { mimeType: "image/jpeg", data: base64Data } }
          ]
        },
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              foodName: { type: Type.STRING },
              rating: { type: Type.NUMBER },
              calories: { type: Type.NUMBER },
              protein: { type: Type.NUMBER },
              carbs: { type: Type.NUMBER },
              fats: { type: Type.NUMBER },
              pros: { type: Type.ARRAY, items: { type: Type.STRING } },
              cons: { type: Type.ARRAY, items: { type: Type.STRING } },
              barcode: { type: Type.STRING }
            },
            required: ["foodName", "rating", "calories", "protein", "carbs", "fats", "pros", "cons"]
          }
        }
      });

      const text = response.text;
      if (!text) throw new Error("No response from AI");
      const result = JSON.parse(text);
      const scanData: any = {
        ...result,
        userId,
        timestamp: Timestamp.now(),
        imageUrl: imageSrc
      };

      const docRef = await addDoc(collection(db, 'scans'), scanData);
      onResult({ id: docRef.id, ...scanData });
    } catch (err: any) {
      console.error("Analysis error:", err);
      setError(err.message || "AI analysis failed. Please try again with a clearer image.");
    } finally {
      setScanning(false);
    }
  }, [userId, onResult]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-2">
        <button onClick={onBack} className="p-2 hover:bg-secondary rounded-full">
          <ChevronLeft className="w-6 h-6 text-foreground" />
        </button>
        <h2 className="text-xl font-bold text-foreground">Scanner</h2>
      </div>

      <div className="relative aspect-square rounded-3xl overflow-hidden bg-foreground shadow-2xl">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={{ facingMode: "environment" }}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 border-2 border-card/30 pointer-events-none m-12 rounded-2xl">
          <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary -mt-1 -ml-1 rounded-tl-lg" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary -mt-1 -mr-1 rounded-tr-lg" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary -mb-1 -ml-1 rounded-bl-lg" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary -mb-1 -mr-1 rounded-br-lg" />
        </div>

        {scanning && (
          <div className="absolute inset-0 bg-foreground/60 backdrop-blur-sm flex flex-col items-center justify-center text-primary-foreground p-6 text-center">
            <Loader2 className="w-12 h-12 animate-spin mb-4 text-primary" />
            <p className="font-bold text-lg">Analyzing Food...</p>
            <p className="text-sm opacity-70 mt-2">AI is calculating nutritional data</p>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-nutri-rose-light border border-nutri-rose/20 rounded-2xl p-4 flex items-start gap-3 text-nutri-rose text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <button
        onClick={captureAndAnalyze}
        disabled={scanning}
        className="w-full bg-foreground text-background rounded-2xl py-5 font-bold text-lg shadow-xl shadow-foreground/10 disabled:opacity-50 flex items-center justify-center gap-3"
      >
        {scanning ? (
          <Loader2 className="w-6 h-6 animate-spin" />
        ) : (
          <>
            <Camera className="w-6 h-6" />
            Capture & Analyze
          </>
        )}
      </button>
    </div>
  );
};

export default ScannerView;