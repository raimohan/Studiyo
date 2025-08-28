import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile 
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

interface UserData {
  uid: string;
  email: string;
  displayName: string;
  role: 'student' | 'admin';
  profilePicture?: string;
  createdAt: Date;
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  authLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);

  // Memoized fetchUserData function
  const fetchUserData = useCallback(async (uid: string) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        const data = userDoc.data() as UserData;
        // Ensure we get the latest profile picture
        setUserData({
          ...data,
          profilePicture: data.profilePicture || data.photoURL
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setAuthLoading(true);
      const result = await signInWithEmailAndPassword(auth, email, password);
      await fetchUserData(result.user.uid);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  const register = async (email: string, password: string, displayName: string) => {
    try {
      setAuthLoading(true);
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(result.user, { displayName });
      
      // Create user document in Firestore
      const newUserData: UserData = {
        uid: result.user.uid,
        email,
        displayName,
        role: 'student',
        createdAt: new Date(),
      };
      
      await setDoc(doc(db, 'users', result.user.uid), newUserData);
      setUserData(newUserData);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = async () => {
    try {
      setAuthLoading(true);
      await signOut(auth);
      setUserData(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        await fetchUserData(user.uid);
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [fetchUserData]);

  const value: AuthContextType = {
    user,
    userData,
    login,
    register,
    logout,
    loading,
    authLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
