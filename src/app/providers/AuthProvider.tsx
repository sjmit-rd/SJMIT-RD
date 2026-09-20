'use client';
import { createContext, useContext, useEffect, useState, ReactNode, useRef, useCallback } from 'react';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase/firebase';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SESSION_TIMEOUT_MS = 60 * 60 * 1000; // 1 hour

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const logoutTimer = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  const handleSignOut = useCallback(async (isTimeout = false) => {
    if (!auth) return;
    if (logoutTimer.current) {
      clearTimeout(logoutTimer.current);
    }
    await signOut(auth);
    if (isTimeout) {
      router.push('/login?reason=session_expired');
    }
  }, [router]);

  const resetSessionTimeout = useCallback(() => {
    if (logoutTimer.current) {
      clearTimeout(logoutTimer.current);
    }
    logoutTimer.current = setTimeout(() => {
      handleSignOut(true);
    }, SESSION_TIMEOUT_MS);
  }, [handleSignOut]);


  useEffect(() => {
    if (user) {
      const activityEvents = ['mousemove', 'keydown', 'mousedown', 'touchstart', 'scroll'];

      const resetTimer = () => {
        resetSessionTimeout();
      };

      activityEvents.forEach(event => {
        window.addEventListener(event, resetTimer);
      });

      resetSessionTimeout();

      return () => {
        if (logoutTimer.current) {
          clearTimeout(logoutTimer.current);
        }
        activityEvents.forEach(event => {
          window.removeEventListener(event, resetTimer);
        });
      };
    }
  }, [user, resetSessionTimeout]);

  useEffect(() => {
    if (!auth) {
      console.error("Firebase Auth is not initialized.");
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser); // Simply set the user from Firebase
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Accounts are manually provisioned in the Firebase Console (no public signup),
  // so any authenticated Firebase user is an administrator.
  const isAdmin = !!user;

  const logout = async () => {
    await handleSignOut(false);
    router.push('/');
  }

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
