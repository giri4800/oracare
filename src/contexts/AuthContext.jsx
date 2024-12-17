import { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../services/firebase';

const AuthContext = createContext(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Setting up auth state listener');
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('Auth state changed:', user);
      setCurrentUser(user);
      setLoading(false);
    }, (error) => {
      console.error('Auth state change error:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    currentUser,
    loading,
    signup: async (email, password) => {
      console.log('Attempting signup:', email);
      try {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        console.log('Signup successful:', result.user);
        return result;
      } catch (error) {
        console.error('Signup error:', error);
        throw error;
      }
    },
    login: async (email, password) => {
      console.log('Attempting login:', email);
      try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        console.log('Login successful:', result.user);
        return result;
      } catch (error) {
        console.error('Login error:', error);
        throw error;
      }
    },
    logout: async () => {
      console.log('Attempting logout');
      try {
        await signOut(auth);
        console.log('Logout successful');
      } catch (error) {
        console.error('Logout error:', error);
        throw error;
      }
    }
  };

  console.log('AuthProvider rendering, currentUser:', currentUser, 'loading:', loading);

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
    </AuthContext.Provider>
  );
}