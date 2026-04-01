import { Scan } from 'lucide-react';

interface LoginScreenProps {
  onLogin: () => void;
}

const LoginScreen = ({ onLogin }: LoginScreenProps) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6 text-center">
      <div className="w-20 h-20 bg-nutri-emerald-light rounded-3xl flex items-center justify-center mb-8">
        <Scan className="w-10 h-10 text-primary" />
      </div>
      <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">NutriScan AI</h1>
      <p className="text-muted-foreground max-w-xs mb-12">
        Scan any food item to get instant nutritional insights and health ratings.
      </p>
      <button
        onClick={onLogin}
        className="w-full max-w-xs bg-foreground text-background rounded-2xl py-4 font-semibold flex items-center justify-center gap-3 hover:opacity-90 transition-opacity"
      >
        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
        Continue with Google
      </button>
    </div>
  );
};

export default LoginScreen;