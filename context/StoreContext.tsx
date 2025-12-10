import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../services/supbaseClient'; 
import { User, Job, JobStatus, UserRole } from '../types';

interface StoreContextType {
  user: User | null;
  loading: boolean;
  jobs: Job[];
  authenticate: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  createJob: (job: any) => void;
  updateJobStatus: (id: string, status: any) => void;
  availableJobs: Job[];
  myJobs: Job[];
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  // 1. THE "FORCE QUIT" TIMER
  // This runs immediately and guarantees loading stops after 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) {
        console.log("⚠️ Supabase took too long. Force removing loading spinner.");
        setLoading(false);
      }
    }, 2000); // 2 seconds max wait
    return () => clearTimeout(timer);
  }, [loading]);

  // 2. THE ACTUAL DATA FETCH
  useEffect(() => {
    let mounted = true;

    const initSession = async () => {
      try {
        console.log("1. Asking Supabase for session...");
        
        // This is the line that was hanging
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;

        if (session?.user) {
          console.log("2. Session found for:", session.user.email);
          
          // Basic user mapping
          const mappedUser: User = {
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.full_name || session.user.email || 'User',
            role: session.user.user_metadata?.user_type || 'CLIENT', // Default to CLIENT if unknown
            avatarUrl: ''
          };
          
          setUser(mappedUser);
        } else {
          console.log("2. No active session found.");
        }
      } catch (err) {
        console.error("❌ Auth Error:", err);
      } finally {
        if (mounted) {
           console.log("3. Finished loading.");
           setLoading(false);
        }
      }
    };

    initSession();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) setUser(null);
    });

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  // --- Auth Functions ---
  
  const authenticate = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { success: false, message: error.message };
      
      if (data.user) {
        // Force update the user state locally so UI updates immediately
        setUser({
            id: data.user.id,
            email: data.user.email || '',
            name: data.user.user_metadata?.full_name || 'User',
            role: data.user.user_metadata?.user_type || 'CLIENT',
        });
        return { success: true };
      }
      return { success: false, message: "No user data returned" };
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  };

  const register = async (name: string, email: string, password: string, role: UserRole) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email, 
        password,
        options: { data: { full_name: name, user_type: role } }
      });
      if (error) return false;
      return !!data.user;
    } catch { return false; }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  // Placeholders
  const jobs: Job[] = [];
  const availableJobs: Job[] = [];
  const myJobs: Job[] = [];
  const createJob = () => {};
  const updateJobStatus = () => {};

  return (
    <StoreContext.Provider value={{ user, loading, jobs, authenticate, register, logout, createJob, updateJobStatus, availableJobs, myJobs }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within StoreProvider");
  return context;
};