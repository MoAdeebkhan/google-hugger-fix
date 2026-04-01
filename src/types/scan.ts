export interface ScanResult {
  id?: string;
  foodName: string;
  rating: number;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  pros: string[];
  cons: string[];
  barcode?: string;
  timestamp: any;
  imageUrl?: string;
  userId?: string;
}