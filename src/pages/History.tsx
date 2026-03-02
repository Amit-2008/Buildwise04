import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Building2, ArrowLeft, Calendar, MapPin, Trash2, 
  IndianRupee, Package, AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { formatCurrency, INDIAN_STATES } from "@/lib/constructionData";

interface Estimation {
  id: string;
  name: string | null;
  area: number;
  floors: number;
  state: string;
  city: string | null;
  building_type: string;
  quality: string;
  total_cost: number;
  material_cost: number;
  labor_cost: number;
  created_at: string;
}

export default function History() {
  const [estimations, setEstimations] = useState<Estimation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { profile, isGuest, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!profile && !isGuest && !user) {
      navigate("/auth");
      return;
    }
    
    fetchEstimations();
  }, [profile, isGuest, user, navigate]);

  const fetchEstimations = async () => {
    if (!profile) {
      setIsLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("estimations")
      .select("*")
      .eq("profile_id", profile.id)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setEstimations(data as Estimation[]);
    }
    setIsLoading(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from("estimations")
      .delete()
      .eq("id", id);

    if (!error) {
      setEstimations(estimations.filter((e) => e.id !== id));
    }
  };

  const getStateName = (code: string) => {
    return INDIAN_STATES.find((s) => s.code === code)?.name || code;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-card border-b border-border/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-accent" />
              <span className="font-display font-bold">My Estimates</span>
            </div>
            
            <div className="w-20" />
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : estimations.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 mx-auto rounded-2xl bg-secondary flex items-center justify-center mb-6">
              <Package className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="font-display text-xl font-semibold mb-2">
              No Estimates Yet
            </h2>
            <p className="text-muted-foreground mb-6">
              Your saved construction estimates will appear here
            </p>
            <Button onClick={() => navigate("/")} className="gap-2">
              Create Your First Estimate
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-4 max-w-3xl mx-auto">
            {isGuest && (
              <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-start gap-3 mb-6">
                <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-amber-500 font-medium">Guest Mode</p>
                  <p className="text-xs text-muted-foreground">
                    Your estimates are stored temporarily.{" "}
                    <button
                      onClick={() => navigate("/auth")}
                      className="text-accent hover:underline"
                    >
                      Create an account
                    </button>{" "}
                    to save them permanently.
                  </p>
                </div>
              </div>
            )}
            
            {estimations.map((estimation, index) => (
              <motion.div
                key={estimation.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass-card rounded-2xl p-5 hover:border-accent/30 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      {estimation.name && (
                        <h3 className="font-display font-semibold text-foreground mb-1 truncate">
                          {estimation.name}
                        </h3>
                      )}
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl font-display font-bold text-foreground">
                          {formatCurrency(estimation.total_cost)}
                        </span>
                      </div>
                    
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Package className="w-4 h-4" />
                        {estimation.area} sq ft
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {getStateName(estimation.state)}
                      </span>
                      <span className="capitalize">{estimation.building_type}</span>
                      <span className="capitalize">{estimation.quality}</span>
                    </div>
                    
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                      <Calendar className="w-3 h-3" />
                      {new Date(estimation.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2">
                    <div className="text-right text-xs space-y-1">
                      <div className="text-muted-foreground">
                        Material: {formatCurrency(estimation.material_cost)}
                      </div>
                      <div className="text-muted-foreground">
                        Labor: {formatCurrency(estimation.labor_cost)}
                      </div>
                    </div>
                    
                    {!isGuest && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(estimation.id)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
