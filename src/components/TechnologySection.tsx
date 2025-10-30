import { useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import techBackground from "@/assets/tech-background.jpg";
import { Database, Lock, Zap, Globe, ArrowRight, Code, Server, Shield, Palette, Layers, Rocket } from "lucide-react";
import { motion, useInView } from "framer-motion";
import * as anime from "animejs";

const TechnologySection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const techIconsRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

  useEffect(() => {
    if (isInView && techIconsRef.current) {
      // Anime.js animation for tech icons
      anime({
        targets: techIconsRef.current.querySelectorAll('.tech-icon'),
        scale: [0, 1],
        rotate: [180, 0],
        opacity: [0, 1],
        delay: anime.stagger(150),
        duration: 800,
        easing: 'easeOutElastic(1, .8)'
      });

      // Floating animation for icons
      anime({
        targets: techIconsRef.current.querySelectorAll('.tech-card'),
        translateY: [
          { value: -10, duration: 2000 },
          { value: 0, duration: 2000 }
        ],
        loop: true,
        easing: 'easeInOutSine',
        delay: anime.stagger(200)
      });
    }
  }, [isInView]);

  const technologies = [
    {
      name: "React",
      icon: Layers,
      description: "Frontend moderno y reactivo",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      name: "Supabase",
      icon: Database,
      description: "Backend escalable con PostgreSQL",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      name: "Tailwind",
      icon: Palette,
      description: "Diseño responsive y personalizable",
      gradient: "from-cyan-500 to-blue-500",
    },
    {
      name: "Vite",
      icon: Rocket,
      description: "Build tool ultra rápido",
      gradient: "from-purple-500 to-pink-500",
    },
  ];

  const features = [
    {
      icon: Zap,
      title: "Realtime Updates",
      description: "Sincronización en tiempo real",
      color: "text-accent",
    },
    {
      icon: Lock,
      title: "JWT Auth",
      description: "Autenticación segura",
      color: "text-secondary",
    },
    {
      icon: Database,
      title: "PostgreSQL",
      description: "Base de datos robusta",
      color: "text-primary",
    },
    {
      icon: Globe,
      title: "i18next",
      description: "Multi-idioma integrado",
      color: "text-accent",
    },
  ];

  return (
    <section id="tecnologia" ref={sectionRef} className="py-20 relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url(${techBackground})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-card via-card/95 to-card" />

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-pulse delay-700" />
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-accent/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <motion.h2 
            className="text-foreground mb-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Arquitectura Tecnológica
          </motion.h2>
          <motion.p 
            className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            SmartCredit combina <span className="text-primary font-semibold">React</span> y{" "}
            <span className="text-secondary font-semibold">Supabase</span> en una arquitectura modular que garantiza{" "}
            <span className="text-accent font-semibold">seguridad</span>, rendimiento, escalabilidad y facilidad de integración.
          </motion.p>
        </motion.div>

        {/* Technology Icons Grid */}
        <div ref={techIconsRef} className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {technologies.map((tech, index) => {
            const Icon = tech.icon;
            return (
              <motion.div
                key={index}
                className="tech-card group"
                whileHover={{ 
                  scale: 1.08,
                  rotateY: 10,
                  transition: { duration: 0.3 }
                }}
              >
                <Card className="p-8 hover:shadow-glow transition-all duration-300 bg-card/50 backdrop-blur-sm border-2 border-border hover:border-primary/50 relative overflow-hidden h-full">
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300" 
                    style={{ background: `linear-gradient(135deg, var(--primary), var(--secondary))` }}
                  />
                  <div className="flex flex-col items-center text-center gap-4 relative z-10">
                    <motion.div 
                      className={`tech-icon w-20 h-20 rounded-2xl bg-gradient-to-br ${tech.gradient} flex items-center justify-center shadow-lg`}
                      whileHover={{ 
                        rotate: 360,
                        scale: 1.15,
                        transition: { duration: 0.6, ease: "easeInOut" }
                      }}
                    >
                      <Icon className="w-10 h-10 text-white" />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={isInView ? { opacity: 1 } : {}}
                      transition={{ delay: 0.5 + index * 0.1 }}
                    >
                      <h3 className="text-foreground font-bold mb-1">{tech.name}</h3>
                      <p className="text-sm text-muted-foreground">{tech.description}</p>
                    </motion.div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Architecture Diagram */}
        <motion.div 
          className="mb-16"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="relative">
            {/* Frontend Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.7 }}
                whileHover={{ scale: 1.03 }}
              >
                <Card className="p-8 bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 group">
                  <div className="flex items-center gap-4 mb-4">
                    <motion.div 
                      className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Code className="w-6 h-6 text-primary" />
                    </motion.div>
                    <h3 className="text-xl font-bold text-foreground">Frontend</h3>
                  </div>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <ArrowRight className="w-4 h-4 text-primary" />
                      React 18 + TypeScript
                    </li>
                    <li className="flex items-center gap-2">
                      <ArrowRight className="w-4 h-4 text-primary" />
                      Tailwind CSS
                    </li>
                    <li className="flex items-center gap-2">
                      <ArrowRight className="w-4 h-4 text-primary" />
                      Vite Build Tool
                    </li>
                    <li className="flex items-center gap-2">
                      <ArrowRight className="w-4 h-4 text-primary" />
                      Responsive UI
                    </li>
                  </ul>
                </Card>
              </motion.div>

              {/* Connection Flow */}
              <motion.div 
                className="flex flex-col items-center justify-center gap-4 py-8"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                {/* Top Arrow */}
                <div className="hidden lg:block">
                  <div className="flex items-center gap-2">
                    <motion.div 
                      className="w-24 h-0.5 bg-gradient-to-r from-primary to-secondary"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <ArrowRight className="w-6 h-6 text-primary" />
                    </motion.div>
                  </div>
                </div>

                {/* Central Icon */}
                <div className="relative">
                  <motion.div 
                    className="w-20 h-20 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Zap className="w-10 h-10 text-primary-foreground" />
                  </motion.div>
                  <motion.div 
                    className="absolute -inset-2 rounded-full border-2 border-primary/30"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <motion.div 
                    className="absolute -inset-4 rounded-full border border-secondary/20"
                    animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                  />
                </div>

                {/* Label */}
                <motion.div 
                  className="text-center"
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : {}}
                  transition={{ delay: 1 }}
                >
                  <p className="text-sm font-semibold text-foreground">
                    API REST
                  </p>
                  <p className="text-xs text-muted-foreground">Comunicación Segura</p>
                  <div className="flex items-center justify-center gap-1 mt-2">
                    <motion.div 
                      className="w-2 h-2 rounded-full bg-green-500"
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                    <span className="text-xs text-green-600">En tiempo real</span>
                  </div>
                </motion.div>

                {/* Bottom Arrow */}
                <div className="hidden lg:block">
                  <div className="flex items-center gap-2">
                    <motion.div
                      animate={{ x: [0, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                    >
                      <ArrowRight className="w-6 h-6 text-secondary" />
                    </motion.div>
                    <motion.div 
                      className="w-24 h-0.5 bg-gradient-to-r from-secondary to-primary"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                    />
                  </div>
                </div>
              </motion.div>

              {/* Backend Section */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.9 }}
                whileHover={{ scale: 1.03 }}
              >
                <Card className="p-8 bg-gradient-to-br from-secondary/10 to-secondary/5 border-2 border-secondary/20 hover:border-secondary/40 transition-all duration-300 group">
                  <div className="flex items-center gap-4 mb-4">
                    <motion.div 
                      className="w-12 h-12 rounded-lg bg-secondary/20 flex items-center justify-center"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Server className="w-6 h-6 text-secondary" />
                    </motion.div>
                    <h3 className="text-xl font-bold text-foreground">Backend</h3>
                  </div>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <ArrowRight className="w-4 h-4 text-secondary" />
                      Supabase Platform
                    </li>
                    <li className="flex items-center gap-2">
                      <ArrowRight className="w-4 h-4 text-secondary" />
                      PostgreSQL Database
                    </li>
                    <li className="flex items-center gap-2">
                      <ArrowRight className="w-4 h-4 text-secondary" />
                      Row Level Security
                    </li>
                    <li className="flex items-center gap-2">
                      <ArrowRight className="w-4 h-4 text-secondary" />
                      Realtime Subscriptions
                    </li>
                  </ul>
                </Card>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Key Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  className="group relative p-6 rounded-xl bg-muted/50 hover:bg-muted transition-all duration-300 cursor-pointer"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: 1.1 + index * 0.1 }}
                  whileHover={{ scale: 1.08, y: -5 }}
                >
                  <div className="flex flex-col items-center text-center gap-3">
                    <motion.div 
                      className={`w-12 h-12 rounded-lg bg-background/80 flex items-center justify-center ${feature.color}`}
                      whileHover={{ rotate: 360, scale: 1.2 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Icon className="w-6 h-6" />
                    </motion.div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">{feature.title}</h4>
                      <p className="text-xs text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                  <div className="absolute inset-0 rounded-xl bg-gradient-primary opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Security Badge */}
        <motion.div 
          className="mt-12 flex justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 1.5 }}
        >
          <motion.div whileHover={{ scale: 1.05 }}>
            <Card className="p-6 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border-2 border-primary/20 hover:shadow-glow transition-all duration-300">
              <div className="flex items-center gap-4">
                <motion.div 
                  className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Shield className="w-6 h-6 text-primary" />
                </motion.div>
                <div>
                  <h4 className="font-bold text-foreground">Seguridad Empresarial</h4>
                  <p className="text-sm text-muted-foreground">Encriptación end-to-end, JWT Auth, y RLS integrado</p>
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default TechnologySection;