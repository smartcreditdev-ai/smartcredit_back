import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Users, FileText, Wallet, CreditCard, Globe, Shield } from "lucide-react";

const FeaturesSection = () => {
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

  const features = [
    {
      icon: Users,
      title: "Gestión de Prospectos",
      description: "Administra y califica prospectos de manera eficiente con herramientas de seguimiento avanzadas.",
      color: "from-blue-500 to-cyan-500",
      delay: "delay-100",
    },
    {
      icon: FileText,
      title: "Solicitudes de Crédito",
      description: "Sistema integral para recibir, evaluar y aprobar solicitudes de crédito digitalmente.",
      color: "from-purple-500 to-pink-500",
      delay: "delay-200",
    },
    {
      icon: Wallet,
      title: "Administración de Cartera",
      description: "Control total de tu cartera de créditos con análisis de mora y reportes detallados.",
      color: "from-green-500 to-emerald-500",
      delay: "delay-300",
    },
    {
      icon: CreditCard,
      title: "Sistema de Pagos",
      description: "Procesa pagos totales, parciales y promesas de pago con integración a múltiples pasarelas.",
      color: "from-orange-500 to-red-500",
      delay: "delay-[400ms]",
    },
    {
      icon: Globe,
      title: "Multi-idioma",
      description: "Interfaz disponible en español e inglés con soporte para expansión internacional.",
      color: "from-cyan-500 to-blue-500",
      delay: "delay-[500ms]",
    },
    {
      icon: Shield,
      title: "Roles y Permisos",
      description: "Sistema granular de permisos por agencia y usuario para máxima seguridad.",
      color: "from-indigo-500 to-purple-500",
      delay: "delay-[600ms]",
    },
  ];

  return (
    <section id="caracteristicas" ref={sectionRef} className="py-20 gradient-subtle relative overflow-hidden">
      {/* Animated Background Circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: "3s" }} />
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: "4s" }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header with Animation */}
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <h2 className="text-foreground mb-4">Características Principales</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Todo lo que necesitas para gestionar tu cartera de créditos de manera{" "}
            <span className="text-primary font-semibold">profesional</span> e{" "}
            <span className="text-accent font-semibold">inteligente</span>
          </p>
        </div>

        {/* Features Grid with Staggered Animation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className={`group transition-all duration-700 ${isVisible ? `opacity-100 translate-y-0 ${feature.delay}` : "opacity-0 translate-y-10"}`}
              >
                <Card className="p-6 h-full hover:shadow-lg transition-all duration-300 hover:scale-105 bg-card/80 backdrop-blur-sm border-2 border-border hover:border-primary/30 relative overflow-hidden">
                  {/* Gradient Overlay on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-300" style={{ background: `linear-gradient(135deg, var(--primary), var(--secondary))` }} />
                  
                  {/* Icon with Gradient Background */}
                  <div className="relative z-10">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    
                    <h3 className="text-foreground mb-3 font-bold group-hover:text-primary transition-colors">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  </div>

                  {/* Decorative Corner Element */}
                  <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors duration-300" />
                </Card>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Section */}
        <div className={`mt-16 text-center transition-all duration-1000 delay-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <div className="inline-block p-8 rounded-2xl bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-glow">
            <p className="text-lg text-foreground font-semibold mb-2">
              ¿Listo para transformar tu gestión de créditos?
            </p>
            <p className="text-muted-foreground">
              Descubre todas las funcionalidades en una demo personalizada
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
