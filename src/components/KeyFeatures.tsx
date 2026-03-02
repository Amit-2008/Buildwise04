import { motion } from "framer-motion";
import { Calculator, MapPin, BarChart3, MessageCircle, Clock, Shield } from "lucide-react";

const features = [
  {
    icon: Calculator,
    title: "Smart Cost Estimation",
    description: "Get accurate construction cost breakdowns with material and labor costs tailored to your location.",
    color: "bg-accent/10 text-accent",
  },
  {
    icon: MapPin,
    title: "State-wise Pricing",
    description: "Access real-time material and land prices across all Indian states and major cities.",
    color: "bg-emerald-500/10 text-emerald-500",
  },
  {
    icon: BarChart3,
    title: "Material Analytics",
    description: "Detailed breakdown of cement, steel, sand, and other construction materials with current market rates.",
    color: "bg-blue-500/10 text-blue-500",
  },
  {
    icon: MessageCircle,
    title: "AI Construction Assistant",
    description: "Get instant answers to your construction queries from our AI-powered chatbot.",
    color: "bg-purple-500/10 text-purple-500",
  },
  {
    icon: Clock,
    title: "Instant Results",
    description: "Calculate costs in seconds, not hours. Save time with our optimized estimation engine.",
    color: "bg-orange-500/10 text-orange-500",
  },
  {
    icon: Shield,
    title: "Accurate & Reliable",
    description: "Our estimates are based on real market data, ensuring you get reliable cost projections.",
    color: "bg-rose-500/10 text-rose-500",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export function KeyFeatures() {
  return (
    <section id="features" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
            Why Choose Us
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Key Features
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Everything you need to plan your construction project with confidence
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="glass-card rounded-2xl p-6 hover-lift cursor-default"
            >
              <div className={`w-14 h-14 rounded-xl ${feature.color} flex items-center justify-center mb-4`}>
                <feature.icon className="w-7 h-7" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
