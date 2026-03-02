import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, LogOut, History, ChevronDown, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { user, profile, isGuest, signOut } = useAuth();
  const navigate = useNavigate();

  // Check if user is admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setIsAdmin(false);
        return;
      }
      
      const { data, error } = await supabase.rpc('has_role', {
        _user_id: user.id,
        _role: 'admin'
      });
      
      if (!error && data) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    };
    
    checkAdminStatus();
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
  };

  if (!user && !isGuest) {
    return (
      <Button
        size="sm"
        variant="outline"
        onClick={() => navigate("/auth")}
        className="gap-2"
      >
        <User className="w-4 h-4" />
        Sign In
      </Button>
    );
  }

  const displayName = profile?.full_name || user?.email?.split("@")[0] || "Guest";
  const displayEmail = user?.email || (isGuest ? "Guest Account" : "");

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="gap-2"
      >
        <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
          <User className="w-4 h-4 text-accent" />
        </div>
        <span className="hidden sm:inline max-w-[100px] truncate">
          {displayName}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 w-64 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden"
            >
              {/* User Info */}
              <div className="p-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                    <User className="w-5 h-5 text-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{displayName}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {displayEmail}
                    </p>
                  </div>
                </div>
                {isGuest && (
                  <p className="mt-3 text-xs text-amber-500 bg-amber-500/10 px-2 py-1 rounded">
                    Guest mode - Data may be lost
                  </p>
                )}
              </div>

              {/* Menu Items */}
              <div className="p-2">
                {/* Admin Button - Only visible for admin users */}
                {isAdmin && (
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      navigate("/admin");
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm bg-primary/10 text-primary hover:bg-primary/20 transition-colors mb-1"
                  >
                    <Shield className="w-4 h-4" />
                    Admin Dashboard
                  </button>
                )}
                
                <button
                  onClick={() => {
                    setIsOpen(false);
                    navigate("/history");
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-secondary transition-colors"
                >
                  <History className="w-4 h-4" />
                  My Estimates
                </button>
                
                {isGuest ? (
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      navigate("/auth");
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-accent hover:bg-secondary transition-colors"
                  >
                    <User className="w-4 h-4" />
                    Create Account
                  </button>
                ) : null}
                
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  {isGuest ? "Exit Guest Mode" : "Sign Out"}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
