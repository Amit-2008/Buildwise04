import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calculator, Building2, Layers, MapPin, Sparkles, 
  ArrowRight, Package, IndianRupee, Wrench,
  Download, RefreshCw, Save, Check, FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  INDIAN_STATES, 
  calculateEstimation, 
  formatCurrency, 
  formatNumber,
  type EstimationInput,
  type EstimationResult,
  type BuildingType,
  type QualityLevel
} from "@/lib/constructionData";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function CostEstimator() {
  const [formData, setFormData] = useState<EstimationInput>({
    area: 1000,
    floors: 1,
    buildingType: "residential",
    quality: "standard",
    stateCode: "MH",
  });
  
  const [result, setResult] = useState<EstimationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showNameDialog, setShowNameDialog] = useState(false);
  const [estimateName, setEstimateName] = useState("");
  
  const { profile, isGuest, user } = useAuth();
  const { toast } = useToast();

  const handleCalculate = () => {
    setIsCalculating(true);
    setIsSaved(false);
    // Simulate calculation delay for animation
    setTimeout(() => {
      const estimation = calculateEstimation(formData);
      setResult(estimation);
      setIsCalculating(false);
    }, 800);
  };

  const handleSaveClick = () => {
    if (!result || !profile) {
      toast({
        title: "Sign in required",
        description: "Please sign in or continue as guest to save estimates.",
        variant: "destructive",
      });
      return;
    }
    setEstimateName("");
    setShowNameDialog(true);
  };

  const handleSaveEstimate = async () => {
    if (!result || !profile) return;

    const trimmedName = estimateName.trim();
    if (!trimmedName) {
      toast({
        title: "Name required",
        description: "Please enter a name for your estimation.",
        variant: "destructive",
      });
      return;
    }

    setShowNameDialog(false);
    setIsSaving(true);

    const { error } = await supabase.from("estimations").insert([{
      profile_id: profile.id,
      name: trimmedName,
      area: formData.area,
      floors: formData.floors,
      state: formData.stateCode,
      city: null,
      building_type: formData.buildingType,
      quality: formData.quality,
      total_cost: result.costs.totalCost,
      material_cost: result.costs.materialCost,
      labor_cost: result.costs.laborCost,
      materials_data: JSON.parse(JSON.stringify(result.materials)),
    }]);

    setIsSaving(false);

    if (error) {
      toast({
        title: "Failed to save",
        description: "Could not save your estimate. Please try again.",
        variant: "destructive",
      });
    } else {
      setIsSaved(true);
      toast({
        title: "Estimate saved!",
        description: `"${trimmedName}" has been saved to your history.`,
      });
    }
  };

  const handleReset = () => {
    setResult(null);
    setIsSaved(false);
    setFormData({
      area: 1000,
      floors: 1,
      buildingType: "residential",
      quality: "standard",
      stateCode: "MH",
    });
  };

  return (
    <section id="estimator" className="py-20 md:py-32 bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6">
            <Calculator className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium">Smart Estimator</span>
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
            Calculate Your Construction Cost
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Get accurate estimates with our AI-powered calculator. 
            Includes material quantities and state-wise pricing.
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="glass-card rounded-3xl p-6 md:p-8"
            >
              <h3 className="font-display text-xl font-semibold mb-6 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-accent" />
                Project Details
              </h3>

              <div className="space-y-6">
                {/* Area Input */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Package className="w-4 h-4 text-muted-foreground" />
                    Built-up Area (sq ft)
                  </Label>
                  <Input
                    type="number"
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: Number(e.target.value) })}
                    className="h-12 text-lg"
                    min={100}
                    max={100000}
                  />
                </div>

                {/* Floors Input */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Layers className="w-4 h-4 text-muted-foreground" />
                    Number of Floors
                  </Label>
                  <Select
                    value={String(formData.floors)}
                    onValueChange={(value) => setFormData({ ...formData, floors: Number(value) })}
                  >
                    <SelectTrigger className="h-12 text-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map((floor) => (
                        <SelectItem key={floor} value={String(floor)}>
                          {floor} {floor === 1 ? "Floor" : "Floors"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* State Selection */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    Location (State)
                  </Label>
                  <Select
                    value={formData.stateCode}
                    onValueChange={(value) => setFormData({ ...formData, stateCode: value })}
                  >
                    <SelectTrigger className="h-12 text-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {INDIAN_STATES.map((state) => (
                        <SelectItem key={state.code} value={state.code}>
                          {state.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Building Type */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-muted-foreground" />
                    Building Type
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
                    {(["residential", "commercial"] as BuildingType[]).map((type) => (
                      <motion.button
                        key={type}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setFormData({ ...formData, buildingType: type })}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          formData.buildingType === type
                            ? "border-accent bg-accent/10"
                            : "border-border hover:border-accent/50"
                        }`}
                      >
                        <div className="font-medium capitalize">{type}</div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Quality Level */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-muted-foreground" />
                    Material Quality
                  </Label>
                  <div className="grid grid-cols-3 gap-3">
                    {(["economy", "standard", "premium"] as QualityLevel[]).map((quality) => (
                      <motion.button
                        key={quality}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setFormData({ ...formData, quality })}
                        className={`p-3 rounded-xl border-2 transition-all ${
                          formData.quality === quality
                            ? "border-accent bg-accent/10"
                            : "border-border hover:border-accent/50"
                        }`}
                      >
                        <div className="font-medium capitalize text-sm">{quality}</div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Calculate Button */}
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleCalculate}
                    disabled={isCalculating}
                    className="flex-1 h-14 text-lg bg-accent text-accent-foreground hover:bg-accent/90 rounded-xl gap-2"
                  >
                    {isCalculating ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        Calculating...
                      </>
                    ) : (
                      <>
                        <Calculator className="w-5 h-5" />
                        Calculate Estimate
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                  {result && (
                    <Button
                      variant="outline"
                      onClick={handleReset}
                      className="h-14 px-6 rounded-xl"
                    >
                      <RefreshCw className="w-5 h-5" />
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Results Panel */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-6"
            >
              <AnimatePresence mode="wait">
                {result ? (
                  <motion.div
                    key="results"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-6"
                  >
                    {/* Total Cost Card */}
                    <div className="bg-primary text-primary-foreground rounded-3xl p-6 md:p-8 relative overflow-hidden">
                      <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_0%,rgba(255,255,255,0.1)_100%)]" />
                      <div className="relative">
                        <div className="text-sm opacity-80 mb-2">Estimated Total Cost</div>
                        <motion.div
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.5, delay: 0.2 }}
                          className="font-display text-4xl md:text-5xl font-bold mb-4"
                        >
                          {formatCurrency(result.costs.totalCost)}
                        </motion.div>
                        <div className="flex items-center gap-4 text-sm opacity-80">
                          <span>₹{formatNumber(result.costs.costPerSqFt)}/sq ft</span>
                          <span>•</span>
                          <span>{result.stateData.name}</span>
                        </div>
                      </div>
                    </div>

                    {/* Cost Breakdown */}
                    <div className="glass-card rounded-3xl p-6">
                      <h4 className="font-display font-semibold mb-4 flex items-center gap-2">
                        <IndianRupee className="w-5 h-5 text-accent" />
                        Cost Breakdown
                      </h4>
                      <div className="space-y-4">
                        {result.breakdown.map((item, index) => (
                          <motion.div
                            key={item.name}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + index * 0.1 }}
                          >
                            <div className="flex justify-between mb-1">
                              <span className="text-muted-foreground">{item.name}</span>
                              <span className="font-medium">{formatCurrency(item.value)}</span>
                            </div>
                            <div className="h-2 bg-secondary rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${item.percentage}%` }}
                                transition={{ duration: 0.8, delay: 0.4 + index * 0.1 }}
                                className={`h-full rounded-full ${
                                  index === 0 ? "bg-accent" : index === 1 ? "bg-primary" : "bg-muted-foreground"
                                }`}
                              />
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Material Quantities */}
                    <div className="glass-card rounded-3xl p-6">
                      <h4 className="font-display font-semibold mb-4 flex items-center gap-2">
                        <Wrench className="w-5 h-5 text-accent" />
                        Material Requirements
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          { label: "Cement", value: `${formatNumber(result.materials.cement)} bags`, icon: "🧱" },
                          { label: "Steel", value: `${formatNumber(result.materials.steel)} kg`, icon: "⚙️" },
                          { label: "Sand", value: `${result.materials.sand} tons`, icon: "🏜️" },
                          { label: "Bricks", value: `${formatNumber(result.materials.bricks)} pcs`, icon: "🧱" },
                          { label: "Aggregate", value: `${result.materials.aggregate} tons`, icon: "🪨" },
                          { label: "Paint", value: `${formatNumber(result.materials.paint)} L`, icon: "🎨" },
                        ].map((material, index) => (
                          <motion.div
                            key={material.label}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 + index * 0.05 }}
                            className="bg-secondary/50 rounded-xl p-4"
                          >
                            <div className="text-2xl mb-2">{material.icon}</div>
                            <div className="text-lg font-semibold">{material.value}</div>
                            <div className="text-sm text-muted-foreground">{material.label}</div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      {(profile || isGuest) && (
                        <Button
                          onClick={handleSaveClick}
                          disabled={isSaving || isSaved}
                          className={`flex-1 h-12 gap-2 rounded-xl ${
                            isSaved 
                              ? "bg-green-600 hover:bg-green-600 text-white" 
                              : "bg-accent text-accent-foreground hover:bg-accent/90"
                          }`}
                        >
                          {isSaving ? (
                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          ) : isSaved ? (
                            <>
                              <Check className="w-4 h-4" />
                              Saved!
                            </>
                          ) : (
                            <>
                              <Save className="w-4 h-4" />
                              Save Estimate
                            </>
                          )}
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        className="flex-1 h-12 gap-2 rounded-xl"
                      >
                        <Download className="w-4 h-4" />
                        Download PDF
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="glass-card rounded-3xl p-8 md:p-12 text-center h-full min-h-[400px] flex flex-col items-center justify-center"
                  >
                    <div className="w-20 h-20 rounded-2xl bg-accent/10 flex items-center justify-center mb-6 animate-pulse-glow">
                      <Calculator className="w-10 h-10 text-accent" />
                    </div>
                    <h4 className="font-display text-xl font-semibold mb-2">
                      Ready to Calculate
                    </h4>
                    <p className="text-muted-foreground">
                      Fill in your project details and click calculate to get your estimate
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Name Dialog */}
      <Dialog open={showNameDialog} onOpenChange={setShowNameDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-accent" />
              Name Your Estimation
            </DialogTitle>
            <DialogDescription>
              Give your estimation a name so you can easily find it later.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <Label htmlFor="estimate-name">Estimation Name</Label>
            <Input
              id="estimate-name"
              placeholder="e.g. My Dream House, Office Project..."
              value={estimateName}
              onChange={(e) => setEstimateName(e.target.value)}
              maxLength={100}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSaveEstimate();
              }}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNameDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveEstimate}
              className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2"
            >
              <Save className="w-4 h-4" />
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}