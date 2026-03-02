import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface Profile {
  id: string;
  user_id: string | null;
  email: string | null;
  full_name: string | null;
  is_guest: boolean;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isLoading: boolean;
  isGuest: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  continueAsGuest: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();
    
    if (data) {
      setProfile(data as Profile);
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsGuest(false);
        
        // Defer profile fetch
        if (session?.user) {
          setTimeout(() => {
            fetchProfile(session.user.id);
          }, 0);
        } else {
          setProfile(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      
      // Check for guest profile in localStorage (stored locally for security)
      const guestProfileData = localStorage.getItem("guest_profile_data");
      if (!session && guestProfileData) {
        try {
          const parsedProfile = JSON.parse(guestProfileData) as Profile;
          setIsGuest(true);
          setProfile(parsedProfile);
        } catch {
          localStorage.removeItem("guest_profile_data");
        }
      }
      
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (!error) {
      localStorage.removeItem("guest_profile_data");
      setIsGuest(false);
    }
    
    return { error: error as Error | null };
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
      },
    });

    if (!error && data.user) {
      // Create profile for the new user
      await supabase.from("profiles").insert({
        user_id: data.user.id,
        email,
        full_name: fullName || null,
        is_guest: false,
      });
      
      localStorage.removeItem("guest_profile_data");
      setIsGuest(false);
    }

    return { error: error as Error | null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("guest_profile_data");
    setProfile(null);
    setIsGuest(false);
  };

  const continueAsGuest = async () => {
    // Check if guest profile already exists in localStorage
    const existingGuestData = localStorage.getItem("guest_profile_data");
    
    if (existingGuestData) {
      try {
        const parsedProfile = JSON.parse(existingGuestData) as Profile;
        setProfile(parsedProfile);
        setIsGuest(true);
        return;
      } catch {
        localStorage.removeItem("guest_profile_data");
      }
    }
    
    // Create new guest profile
    const { data, error } = await supabase
      .from("profiles")
      .insert({
        is_guest: true,
        full_name: "Guest User",
      })
      .select()
      .single();

    if (!error && data) {
      // Store full profile data locally (not in DB query) for security
      const profileData: Profile = {
        id: data.id,
        user_id: data.user_id,
        email: data.email,
        full_name: data.full_name,
        is_guest: data.is_guest,
      };
      localStorage.setItem("guest_profile_data", JSON.stringify(profileData));
      setProfile(profileData);
      setIsGuest(true);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        isLoading,
        isGuest,
        signIn,
        signUp,
        signOut,
        continueAsGuest,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
