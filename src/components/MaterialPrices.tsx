import { useState } from "react";
import { motion } from "framer-motion";
import { BarChart3, MapPin, TrendingUp, Clock, Package } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { INDIAN_STATES, formatNumber } from "@/lib/constructionData";

const materialInfo = [
  { key: "cement", name: "Cement", unit: "per 50kg bag", icon: "🧱", color: "bg-amber-500" },
  { key: "steel", name: "Steel", unit: "per kg", icon: "⚙️", color: "bg-slate-500" },
  { key: "sand", name: "River Sand", unit: "per ton", icon: "🏜️", color: "bg-yellow-500" },
  { key: "bricks", name: "Bricks", unit: "per 1000 pcs", icon: "🧱", color: "bg-red-500" },
  { key: "aggregate", name: "Aggregate", unit: "per ton", icon: "🪨", color: "bg-gray-500" },
  { key: "paint", name: "Paint", unit: "per liter", icon: "🎨", color: "bg-blue-500" },
];

export function MaterialPrices() {
  const [selectedState, setSelectedState] = useState("MH");
  const stateData = INDIAN_STATES.find(s => s.code === selectedState) || INDIAN_STATES[0];

  return (
    <section id="prices" className="py-20 md:py-32">
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
            <BarChart3 className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium">Live Market Rates</span>
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
            Construction Material Prices
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Real-time material prices across different Indian states. 
            Updated regularly to reflect market conditions.
          </p>
        </motion.div>

        {/* State Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-md mx-auto mb-12"
        >
          <div className="glass-card rounded-2xl p-4 flex items-center gap-4">
            <MapPin className="w-5 h-5 text-accent flex-shrink-0" />
            <Select value={selectedState} onValueChange={setSelectedState}>
              <SelectTrigger className="border-0 bg-transparent text-lg font-medium focus:ring-0 focus:ring-offset-0">
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
        </motion.div>

        {/* Price Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {materialInfo.map((material, index) => {
            const price = stateData.materialPrices[material.key as keyof typeof stateData.materialPrices];
            const avgPrice = INDIAN_STATES.reduce((sum, s) => 
              sum + s.materialPrices[material.key as keyof typeof s.materialPrices], 0
            ) / INDIAN_STATES.length;
            const percentDiff = ((price - avgPrice) / avgPrice * 100).toFixed(1);
            const isHigher = price > avgPrice;

            return (
              <motion.div
                key={material.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
                whileHover={{ y: -5 }}
                className="glass-card rounded-2xl p-6 hover-lift cursor-default"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl ${material.color}/10 flex items-center justify-center text-2xl`}>
                      {material.icon}
                    </div>
                    <div>
                      <h4 className="font-display font-semibold text-lg">{material.name}</h4>
                      <p className="text-sm text-muted-foreground">{material.unit}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-end justify-between">
                  <div>
                    <div className="font-display text-3xl font-bold text-foreground">
                      ₹{formatNumber(price)}
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <TrendingUp className={`w-4 h-4 ${isHigher ? 'text-red-500' : 'text-green-500'}`} />
                      <span className={`text-sm font-medium ${isHigher ? 'text-red-500' : 'text-green-500'}`}>
                        {isHigher ? '+' : ''}{percentDiff}% vs avg
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Updated today
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Info Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 max-w-4xl mx-auto"
        >
          <div className="glass-card rounded-2xl p-6 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
              <Package className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h4 className="font-semibold mb-1">Understanding Price Variations</h4>
              <p className="text-sm text-muted-foreground">
                Material prices vary by region due to transportation costs, local availability, 
                and market conditions. Coastal states typically have lower sand prices, while 
                northern states may have higher steel costs due to transportation from major ports.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
