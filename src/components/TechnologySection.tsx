import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import techBackground from "@/assets/tech-background.jpg";
import { Database, Lock, Zap, Globe, ArrowRight, Code, Server, Shield, Palette, Layers, Rocket } from "lucide-react";

const TechnologySection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const technologies = [
    {
      name: "React",
      icon: Layers,
      description: "Frontend moderno y reactivo",
      delay: "delay-100",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      name: "Supabase",
      icon: Database,
      description: "Backend escalable con PostgreSQL",
      delay: "delay-200",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      name: "Tailwind",
      icon: Palette,
      description: "Diseño responsive y personalizable",
      delay: "delay-300",
      gradient: "from-cyan-500 to-blue-500",
    },
    {
      name: "Vite",
      icon: Rocket,
      description: "Build tool ultra rápido",
      delay: "delay-[400ms]",
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
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <h2 className="text-foreground mb-4">Arquitectura Tecnológica</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            SmartCredit combina <span className="text-primary font-semibold">React</span> y{" "}
            <span className="text-secondary font-semibold">Supabase</span> en una arquitectura modular que garantiza{" "}
            <span className="text-accent font-semibold">seguridad</span>, rendimiento, escalabilidad y facilidad de integración.
          </p>
        </div>

        {/* Technology Icons Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {technologies.map((tech, index) => {
            const Icon = tech.icon;
            return (
              <div
                key={index}
                className={`group transition-all duration-700 ${isVisible ? `opacity-100 translate-y-0 ${tech.delay}` : "opacity-0 translate-y-10"}`}
              >
                <Card className="p-8 hover:shadow-glow transition-all duration-300 hover:scale-105 bg-card/50 backdrop-blur-sm border-2 border-border hover:border-primary/50 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300" style={{ background: `linear-gradient(135deg, var(--primary), var(--secondary))` }} />
                  <div className="flex flex-col items-center text-center gap-4 relative z-10">
                    <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${tech.gradient} flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}>
                      <Icon className="w-10 h-10 text-white" />
                    </div>
                    <div>
                      <h3 className="text-foreground font-bold mb-1">{tech.name}</h3>
                      <p className="text-sm text-muted-foreground">{tech.description}</p>
                    </div>
                  </div>
                </Card>
              </div>
            );
          })}
        </div>

        {/* Architecture Diagram */}
        <div className={`mb-16 transition-all duration-1000 delay-500 ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}>
          <div className="relative">
            {/* Frontend Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              <Card className="p-8 bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 group">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Code className="w-6 h-6 text-primary" />
                  </div>
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

              {/* Connection Flow */}
              <div className="flex flex-col items-center justify-center gap-4 py-8">
                {/* Top Arrow */}
                <div className="hidden lg:block">
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-0.5 bg-gradient-to-r from-primary to-secondary animate-pulse" />
                    <ArrowRight className="w-6 h-6 text-primary animate-bounce" style={{ animationDuration: "2s" }} />
                  </div>
                </div>

                {/* Central Icon */}
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-gradient-primary flex items-center justify-center animate-pulse shadow-glow">
                    <Zap className="w-10 h-10 text-primary-foreground" />
                  </div>
                  <div className="absolute -inset-2 rounded-full border-2 border-primary/30 animate-ping" />
                  <div className="absolute -inset-4 rounded-full border border-secondary/20 animate-ping" style={{ animationDuration: "2s" }} />
                </div>

                {/* Label */}
                <div className="text-center">
                  <p className="text-sm font-semibold text-foreground">
                    API REST
                  </p>
                  <p className="text-xs text-muted-foreground">Comunicación Segura</p>
                  <div className="flex items-center justify-center gap-1 mt-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs text-green-600">En tiempo real</span>
                  </div>
                </div>

                {/* Bottom Arrow */}
                <div className="hidden lg:block">
                  <div className="flex items-center gap-2">
                    <ArrowRight className="w-6 h-6 text-secondary animate-bounce" style={{ animationDuration: "2s", animationDelay: "0.5s" }} />
                    <div className="w-24 h-0.5 bg-gradient-to-r from-secondary to-primary animate-pulse" />
                  </div>
                </div>
              </div>

              {/* Backend Section */}
              <Card className="p-8 bg-gradient-to-br from-secondary/10 to-secondary/5 border-2 border-secondary/20 hover:border-secondary/40 transition-all duration-300 group">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-secondary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Server className="w-6 h-6 text-secondary" />
                  </div>
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
            </div>
          </div>
        </div>

        {/* Key Features */}
        <div className={`transition-all duration-1000 delay-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group relative p-6 rounded-xl bg-muted/50 hover:bg-muted transition-all duration-300 hover:scale-105 cursor-pointer"
                >
                  <div className="flex flex-col items-center text-center gap-3">
                    <div className={`w-12 h-12 rounded-lg bg-background/80 flex items-center justify-center group-hover:scale-110 transition-transform ${feature.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">{feature.title}</h4>
                      <p className="text-xs text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                  <div className="absolute inset-0 rounded-xl bg-gradient-primary opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Security Badge */}
        <div className={`mt-12 flex justify-center transition-all duration-1000 delay-1000 ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}>
          <Card className="p-6 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border-2 border-primary/20 hover:shadow-glow transition-all duration-300 hover:scale-105">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h4 className="font-bold text-foreground">Seguridad Empresarial</h4>
                <p className="text-sm text-muted-foreground">Encriptación end-to-end, JWT Auth, y RLS integrado</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default TechnologySection;
