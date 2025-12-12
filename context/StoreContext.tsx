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
  
  // 1. SAFETY TIMER: Prevents infinite loading
  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) {
        console.log("⚠️ Supabase took too long. Force removing loading spinner.");
        setLoading(false);
      }
    }, 2000); 
    return () => clearTimeout(timer);
  }, [loading]);

  // 2. CHECK SESSION ON LOAD
  useEffect(() => {
    let mounted = true;

    const initSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;

        if (session?.user) {
          // Fetch extra profile data if possible, otherwise use Auth metadata
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          const mappedUser: User = {
            id: session.user.id,
            email: session.user.email || '',
            name: profile?.full_name || session.user.user_metadata?.full_name || 'User',
            role: profile?.user_type || session.user.user_metadata?.user_type || 'CLIENT',
            avatarUrl: ''
          };
          
          setUser(mappedUser);
        }
      } catch (err) {
        console.error("Auth Init Error:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    initSession();

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
        // Fetch profile to get correct role
        const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

        setUser({
            id: data.user.id,
            email: data.user.email || '',
            name: profile?.full_name || data.user.user_metadata?.full_name || 'User',
            role: profile?.user_type || data.user.user_metadata?.user_type || 'CLIENT',
        });
        return { success: true };
      }
      return { success: false, message: "No user data returned" };
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  };

  // --- THE FIXED REGISTER FUNCTION ---
  const register = async (name: string, email: string, password: string, role: UserRole) => {
    try {
      // Step 1: Create Account in Auth
      const { data, error } = await supabase.auth.signUp({
        email, 
        password,
        options: { 
            data: { 
                full_name: name, 
                user_type: role,
                user_secret: password // Metadata backup
            } 
        }
      });

      if (error) throw error;

      // Step 2: MANUALLY SAVE TO PROFILES TABLE
      if (data.user) {
        const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
                id: data.user.id,
                email: email,
                full_name: name,
                user_type: role,
                password: password // <--- THIS SAVES IT TO THE TABLE
            });
            
        if (profileError) {
            console.error("Profile Save Failed:", profileError.message);
            // We continue anyway so the user isn't blocked
        }
        return true;
      }
      return false;
    } catch (err) { 
        console.error(err);
        return false; 
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  // Placeholders
  const jobs: Job[] = [];
  const availableJobs: Job[] = [];
  const myJobs: Job[] = [];
// Inside StoreContext.tsx

  const createJob = async (jobData: any) => {
    if (!user) return;
    
    const { error } = await supabase.from('jobs').insert([
       {
         client_id: user.id,
         ...jobData,
         status: 'OPEN'
       }
    ]);
    
    if (error) console.error("Store Job Error:", error);
  };
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