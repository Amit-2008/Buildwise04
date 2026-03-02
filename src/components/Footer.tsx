import { motion } from "framer-motion";
import { Building2, Heart, Github, Linkedin, Mail, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 md:gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-2 mb-4"
            >
              <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                <Building2 className="w-5 h-5 text-accent-foreground" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg">
                  BUILDWISE<span className="text-accent">PRO</span>
                </h3>
              </div>
            </motion.div>
            <p className="text-primary-foreground/70 max-w-sm mb-6">
              Smart Construction Intelligence Platform. Get accurate estimates, 
              material calculations, and pricing insights for your construction projects.
            </p>
            <div className="flex gap-3">
              {[Github, Linkedin, Mail].map((Icon, i) => (
                <motion.a
                  key={i}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  href="#"
                  className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  <Icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Features</h4>
            <ul className="space-y-2 text-primary-foreground/70">
              <li><a href="#estimator" className="hover:text-accent transition-colors">Cost Estimator</a></li>
              <li><a href="#prices" className="hover:text-accent transition-colors">Material Prices</a></li>
              <li><a href="#land" className="hover:text-accent transition-colors">Land Rates</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">AI Assistant</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-primary-foreground/70">
              <li>
                <a 
                  href="mailto:amitnarsale390@gmail.com" 
                  className="hover:text-accent transition-colors flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  amitnarsale390@gmail.com
                </a>
              </li>
              <li>
                <a 
                  href="tel:8983868083" 
                  className="hover:text-accent transition-colors flex items-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  8983868083
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-primary-foreground/60">
            © 2026 BuildWise Pro. All rights reserved.
          </p>
          <p className="text-sm text-primary-foreground/60 flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-red-400 fill-red-400" /> in India
          </p>
        </div>
      </div>
    </footer>
  );
}
