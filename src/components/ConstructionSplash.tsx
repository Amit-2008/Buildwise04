import { motion } from "framer-motion";
import { Building2 } from "lucide-react";

interface ConstructionSplashProps {
  onComplete: () => void;
}

export function ConstructionSplash({ onComplete }: ConstructionSplashProps) {
  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-background flex items-center justify-center overflow-hidden"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      onAnimationComplete={() => {
        setTimeout(onComplete, 3000);
      }}
    >
      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
      

      <div className="relative flex flex-col items-center">
        {/* Crane Animation */}
        <div className="relative w-64 h-56 mb-8">
          {/* Ground line */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted-foreground/30 rounded-full" />
          
          {/* Crane base/tower */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
            {/* Tower structure */}
            <div className="relative">
              {/* Main vertical tower */}
              <div className="w-4 h-40 bg-gradient-to-t from-primary to-primary/80 rounded-t-sm">
                {/* Tower lattice pattern */}
                <div className="absolute inset-0 flex flex-col justify-evenly px-0.5">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="h-0.5 bg-primary-foreground/20" />
                  ))}
                </div>
              </div>
              
              {/* Operator cabin */}
              <motion.div
                className="absolute -top-2 -left-3 w-10 h-6 bg-accent rounded-sm border-2 border-accent-foreground/20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="absolute top-1 left-1 w-3 h-2 bg-background/50 rounded-sm" />
              </motion.div>
              
              {/* Rotating jib arm */}
              <motion.div
                className="absolute -top-1 left-1/2 origin-left"
                initial={{ rotate: -15 }}
                animate={{ rotate: 15 }}
                transition={{ duration: 3, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
              >
                {/* Main horizontal arm */}
                <div className="w-32 h-2 bg-gradient-to-r from-primary to-accent rounded-r-full">
                  {/* Arm lattice */}
                  <div className="absolute inset-0 flex justify-evenly items-center">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="w-0.5 h-full bg-primary-foreground/20" />
                    ))}
                  </div>
                </div>
                
                {/* Counter weight arm */}
                <div className="absolute top-0 right-full w-12 h-2 bg-primary rounded-l-full" />
                <div className="absolute top-1 right-full mr-8 w-6 h-4 bg-muted-foreground rounded-sm" />
                
                {/* Hook and cable */}
                <motion.div
                  className="absolute top-full left-24"
                  animate={{ y: [0, 20, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  {/* Cable */}
                  <div className="w-0.5 h-16 bg-muted-foreground/60 mx-auto" />
                  {/* Hook */}
                  <motion.div 
                    className="relative"
                    animate={{ rotate: [-5, 5, -5] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <div className="w-4 h-4 bg-accent rounded-full mx-auto border-2 border-accent-foreground/30" />
                    <div className="w-1 h-3 bg-accent mx-auto rounded-b-full" />
                    <div className="w-6 h-1.5 bg-accent rounded-full -mt-0.5 mx-auto" />
                  </motion.div>
                  
                  {/* Lifting block */}
                  <motion.div
                    className="mt-2"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1, duration: 0.5 }}
                  >
                    <div className="w-10 h-8 bg-primary rounded border-2 border-primary-foreground/20 flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-primary-foreground" />
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>
          </div>
          
          {/* Building being constructed */}
          <div className="absolute bottom-1 right-8 flex flex-col items-center">
            {[0, 1, 2].map((row) => (
              <div key={row} className="flex gap-0.5">
                {[0, 1].map((col) => (
                  <motion.div
                    key={`${row}-${col}`}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      delay: 0.5 + (2 - row) * 0.4 + col * 0.15,
                      duration: 0.3,
                      ease: "backOut",
                    }}
                    className="w-6 h-5 bg-muted-foreground/40 rounded-sm border border-muted-foreground/20"
                  />
                ))}
              </div>
            ))}
          </div>
          
          {/* Construction dust particles */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-accent/40 rounded-full"
              style={{
                left: `${30 + Math.random() * 40}%`,
                bottom: `${10 + Math.random() * 20}%`,
              }}
              animate={{
                y: [-10, -30],
                x: [0, (Math.random() - 0.5) * 20],
                opacity: [0.6, 0],
              }}
              transition={{
                duration: 1.5 + Math.random(),
                repeat: Infinity,
                delay: i * 0.3,
              }}
            />
          ))}
        </div>

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex items-center gap-3 mb-4"
        >
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
            <Building2 className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display font-bold text-2xl text-foreground">
              BUILDWISE<span className="text-accent">PRO</span>
            </h1>
          </div>
        </motion.div>

        {/* Loading bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="w-48 h-1.5 bg-secondary rounded-full overflow-hidden"
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ delay: 0.8, duration: 2, ease: "easeInOut" }}
            className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
          />
        </motion.div>

        {/* Loading text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-sm text-muted-foreground mt-4"
        >
          Constructing your experience...
        </motion.p>
      </div>
    </motion.div>
  );
}