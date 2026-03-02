import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Building, Trees, Wheat, Info, TrendingUp } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { INDIAN_STATES, formatNumber, formatCurrency } from "@/lib/constructionData";

const areaTypes = [
  { key: "urban", name: "Urban", icon: Building, description: "Metro cities & tier-1 areas" },
  { key: "semiUrban", name: "Semi-Urban", icon: Trees, description: "Tier-2 cities & suburbs" },
  { key: "rural", name: "Rural", icon: Wheat, description: "Villages & agricultural" },
];

export function LandPrices() {
  const [selectedState, setSelectedState] = useState("MH");
  const [selectedArea, setSelectedArea] = useState<"urban" | "semiUrban" | "rural">("urban");
  
  const stateData = INDIAN_STATES.find(s => s.code === selectedState) || INDIAN_STATES[0];
  const landPrice = stateData.landPricePerSqFt[selectedArea];

  // Sort states by selected area land price
  const sortedStates = [...INDIAN_STATES].sort((a, b) => 
    b.landPricePerSqFt[selectedArea] - a.landPricePerSqFt[selectedArea]
  );

  return (
    <section id="land" className="py-20 md:py-32 bg-secondary/30">
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
            <MapPin className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium">Land Explorer</span>
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
            Land Price Index
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explore land prices across Indian states by area type. 
            Plan your investment with accurate market data.
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          {/* Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="glass-card rounded-2xl p-6 mb-8"
          >
            <div className="grid md:grid-cols-2 gap-6">
              {/* State Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Select State</label>
                <Select value={selectedState} onValueChange={setSelectedState}>
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

              {/* Area Type */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Area Type</label>
                <div className="grid grid-cols-3 gap-3">
                  {areaTypes.map((type) => (
                    <motion.button
                      key={type.key}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedArea(type.key as any)}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        selectedArea === type.key
                          ? "border-accent bg-accent/10"
                          : "border-border hover:border-accent/50"
                      }`}
                    >
                      <type.icon className={`w-5 h-5 mx-auto mb-1 ${
                        selectedArea === type.key ? "text-accent" : "text-muted-foreground"
                      }`} />
                      <div className="font-medium text-sm">{type.name}</div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Price Display */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-1"
            >
              <div className="bg-primary text-primary-foreground rounded-3xl p-8 relative overflow-hidden sticky top-24">
                <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_0%,rgba(255,255,255,0.1)_100%)]" />
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-6">
                    <MapPin className="w-7 h-7" />
                  </div>
                  <h3 className="font-display text-xl font-semibold mb-2">
                    {stateData.name}
                  </h3>
                  <p className="text-sm opacity-80 mb-6">
                    {areaTypes.find(t => t.key === selectedArea)?.description}
                  </p>
                  
                  <div className="font-display text-4xl md:text-5xl font-bold mb-2">
                    ₹{formatNumber(landPrice)}
                  </div>
                  <div className="text-sm opacity-80">per sq ft</div>

                  <div className="mt-8 pt-6 border-t border-white/20 space-y-4">
                    <div className="flex justify-between">
                      <span className="opacity-80">For 1000 sq ft</span>
                      <span className="font-semibold">{formatCurrency(landPrice * 1000)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="opacity-80">For 2400 sq ft</span>
                      <span className="font-semibold">{formatCurrency(landPrice * 2400)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* State Comparison */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="lg:col-span-2"
            >
              <div className="glass-card rounded-3xl p-6">
                <h4 className="font-display font-semibold mb-6 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-accent" />
                  State-wise Comparison ({areaTypes.find(t => t.key === selectedArea)?.name})
                </h4>
                
                <div className="space-y-4">
                  {sortedStates.map((state, index) => {
                    const price = state.landPricePerSqFt[selectedArea];
                    const maxPrice = sortedStates[0].landPricePerSqFt[selectedArea];
                    const percentage = (price / maxPrice) * 100;
                    const isSelected = state.code === selectedState;

                    return (
                      <motion.div
                        key={state.code}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + index * 0.05 }}
                        onClick={() => setSelectedState(state.code)}
                        className={`p-4 rounded-xl cursor-pointer transition-all ${
                          isSelected ? "bg-accent/10 border-2 border-accent" : "hover:bg-secondary"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-muted-foreground w-6">
                              #{index + 1}
                            </span>
                            <span className={`font-medium ${isSelected ? "text-accent" : ""}`}>
                              {state.name}
                            </span>
                          </div>
                          <span className="font-semibold">₹{formatNumber(price)}/sq ft</span>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden ml-9">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${percentage}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.4 + index * 0.05 }}
                            className={`h-full rounded-full ${isSelected ? "bg-accent" : "bg-primary/50"}`}
                          />
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Disclaimer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-8"
          >
            <div className="glass-card rounded-2xl p-4 flex items-start gap-3">
              <Info className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">
                Land prices shown are indicative averages based on government indices and market surveys. 
                Actual prices may vary based on exact location, accessibility, and local demand. 
                Always verify with local authorities before making purchase decisions.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
