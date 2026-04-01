import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { onAuthStateChanged, User, signInWithRedirect, getRedirectResult, signOut } from 'firebase/auth';
import { collection, query, where, orderBy, onSnapshot, Timestamp, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '@/lib/firebase';
import type { ScanResult } from '@/types/scan';
import LoginScreen from '@/components/nutriscan/LoginScreen';
import AppHeader from '@/components/nutriscan/AppHeader';
import HomeView from '@/components/nutriscan/HomeView';
import ScannerView from '@/components/nutriscan/ScannerView';
import ResultView from '@/components/nutriscan/ResultView';
import HistoryView from '@/components/nutriscan/HistoryView';

type ViewType = 'home' | 'scanner' | 'history' | 'result';

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<ViewType>('home');
  const [lastResult, setLastResult] = useState<ScanResult | null>(null);
  const [history, setHistory] = useState<ScanResult[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    // Handle redirect result first
    getRedirectResult(auth).catch((err) => {
      console.error("Redirect result error:", err);
    });

    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
      if (u) {
        const userRef = doc(db, 'users', u.uid);
        setDoc(userRef, {
          uid: u.uid,
          email: u.email,
          displayName: u.displayName,
          photoURL: u.photoURL,
          updatedAt: Timestamp.now()
        }, { merge: true });
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, 'scans'),
      where('userId', '==', user.uid),
      orderBy('timestamp', 'desc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const scans = snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as ScanResult[];
      setHistory(scans);
    }, (err) => console.error("Firestore error:", err));
    return () => unsubscribe();
  }, [user]);

  const handleLogin = async () => {
    try {
      await signInWithRedirect(auth, googleProvider);
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  const handleDeleteScan = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'scans', id));
      if (lastResult?.id === id) setLastResult(null);
      setDeletingId(null);
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans pb-24">
      <AppHeader
        onHistory={() => setView('history')}
        onLogout={() => signOut(auth)}
      />
      <main className="max-w-md mx-auto p-6">
        {view === 'home' && (
          <HomeView
            history={history}
            onOpenScanner={() => setView('scanner')}
            onViewHistory={() => setView('history')}
            onSelectScan={(scan) => { setLastResult(scan); setView('result'); }}
            deletingId={deletingId}
            onStartDelete={setDeletingId}
            onConfirmDelete={handleDeleteScan}
            onCancelDelete={() => setDeletingId(null)}
          />
        )}
        {view === 'scanner' && (
          <ScannerView
            userId={user.uid}
            onBack={() => setView('home')}
            onResult={(result) => { setLastResult(result); setView('result'); }}
          />
        )}
        {view === 'result' && lastResult && (
          <ResultView
            result={lastResult}
            onBack={() => setView('home')}
            onScanAnother={() => setView('scanner')}
          />
        )}
        {view === 'history' && (
          <HistoryView
            history={history}
            onBack={() => setView('home')}
            onSelectScan={(scan) => { setLastResult(scan); setView('result'); }}
            deletingId={deletingId}
            onStartDelete={setDeletingId}
            onConfirmDelete={handleDeleteScan}
            onCancelDelete={() => setDeletingId(null)}
          />
        )}
      </main>
    </div>
  );
};

export default Index;