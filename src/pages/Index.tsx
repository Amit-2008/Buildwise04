import { useState, useEffect, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { Header } from "@/components/Header";
import { ConstructionSplash } from "@/components/ConstructionSplash";
import { HeroSection } from "@/components/HeroSection";
import { KeyFeatures } from "@/components/KeyFeatures";
import { CostEstimator } from "@/components/CostEstimator";
import { Calculator } from "@/components/Calculator";
import { MaterialPrices } from "@/components/MaterialPrices";
import { LandPrices } from "@/components/LandPrices";
import { AIChatbot } from "@/components/AIChatbot";
import { FloatingCalculator } from "@/components/FloatingCalculator";
import { Footer } from "@/components/Footer";

const Index = () => {
  const [activeSection, setActiveSection] = useState("home");
  const [showSplash, setShowSplash] = useState(() => {
    // Only show splash once per session
    const hasSeenSplash = sessionStorage.getItem("hasSeenSplash");
    return !hasSeenSplash;
  });

  const handleSplashComplete = () => {
    setShowSplash(false);
    sessionStorage.setItem("hasSeenSplash", "true");
  };

  const handleNavigate = useCallback((section: string) => {
    setActiveSection(section);
    
    if (section === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (section === "chat") {
      // Chat is handled by the floating button
      return;
    } else {
      // Small delay to ensure DOM is ready
      requestAnimationFrame(() => {
        const element = document.getElementById(section);
        if (element) {
          const offset = 100;
          const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
          window.scrollTo({ top: elementPosition - offset, behavior: "smooth" });
        }
      });
    }
  }, []);

  // Update active section based on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["features", "estimator", "calculator", "prices", "land"];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            return;
          }
        }
      }
      
      if (window.scrollY < 400) {
        setActiveSection("home");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {showSplash && (
          <ConstructionSplash onComplete={handleSplashComplete} />
        )}
      </AnimatePresence>

      <div className={`min-h-screen bg-background ${showSplash ? "overflow-hidden" : ""}`}>
        <Header activeSection={activeSection} onNavigate={handleNavigate} />
        <main>
          <HeroSection onNavigate={handleNavigate} />
          <KeyFeatures />
          <CostEstimator />
          <Calculator />
          <MaterialPrices />
          <LandPrices />
        </main>
        <Footer />
        <FloatingCalculator />
        <AIChatbot />
      </div>
    </>
  );
};

export default Index;
