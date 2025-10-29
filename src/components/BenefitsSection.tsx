import { useEffect, useRef, useState } from "react";
import { Zap, TrendingUp, CheckCircle, Database, Lock, Smartphone } from "lucide-react";

const BenefitsSection = () => {
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

  const benefits = [
    {
      icon: Zap,
      title: "Reducción de Errores Manuales",
      description: "Automatiza procesos y elimina errores de captura de datos.",
      color: "text-accent",
      bgColor: "bg-accent/10",
      delay: "delay-100",
    },
    {
      icon: TrendingUp,
      title: "Evaluación Crediticia Automatizada",
      description: "Algoritmos inteligentes para evaluar el riesgo crediticio.",
      color: "text-primary",
      bgColor: "bg-primary/10",
      delay: "delay-200",
    },
    {
      icon: CheckCircle,
      title: "Control de Mora y Cobranzas",
      description: "Herramientas avanzadas para gestión de cartera vencida.",
      color: "text-secondary",
      bgColor: "bg-secondary/10",
      delay: "delay-300",
    },
    {
      icon: Database,
      title: "Escalabilidad para Múltiples Agencias",
      description: "Crece sin límites con arquitectura multi-tenant.",
      color: "text-primary",
      bgColor: "bg-primary/10",
      delay: "delay-[400ms]",
    },
    {
      icon: Lock,
      title: "Seguridad de Nivel Empresarial",
      description: "Protección de datos con RLS y encriptación end-to-end.",
      color: "text-secondary",
      bgColor: "bg-secondary/10",
      delay: "delay-[500ms]",
    },
    {
      icon: Smartphone,
      title: "Acceso desde Cualquier Dispositivo",
      description: "Interfaz responsive optimizada para móvil, tablet y desktop.",
      color: "text-accent",
      bgColor: "bg-accent/10",
      delay: "delay-[600ms]",
    },
  ];

  return (
    <section id="beneficios" ref={sectionRef} className="py-20 gradient-subtle relative overflow-hidden">
      {/* Floating Particles Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-10 w-2 h-2 bg-primary rounded-full animate-ping" style={{ animationDuration: "2s" }} />
        <div className="absolute top-1/3 right-20 w-2 h-2 bg-secondary rounded-full animate-ping" style={{ animationDuration: "3s" }} />
        <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-accent rounded-full animate-ping" style={{ animationDuration: "2.5s" }} />
        <div className="absolute top-40 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <h2 className="text-foreground mb-4">Beneficios para Microfinancieras</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Transforma la gestión de tu cartera de créditos con{" "}
            <span className="text-primary font-semibold">tecnología de vanguardia</span> y{" "}
            <span className="text-secondary font-semibold">resultados medibles</span>
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={index}
                className={`group transition-all duration-700 ${isVisible ? `opacity-100 translate-x-0 ${benefit.delay}` : "opacity-0 -translate-x-10"}`}
              >
                <div className="flex gap-4 p-6 rounded-xl bg-card/50 backdrop-blur-sm border-2 border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:scale-105 relative overflow-hidden">
                  {/* Background Gradient on Hover */}
                  <div className={`absolute inset-0 ${benefit.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                  
                  {/* Icon Container */}
                  <div className="flex-shrink-0 relative z-10">
                    <div className={`w-14 h-14 rounded-xl ${benefit.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                      <Icon className={`w-7 h-7 ${benefit.color}`} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="relative z-10">
                    <h3 className="text-foreground font-bold mb-2 group-hover:text-primary transition-colors">
                      {benefit.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>

                  {/* Hover Effect Corner */}
                  <div className={`absolute -bottom-2 -right-2 w-20 h-20 ${benefit.bgColor} rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Stats Section */}
        <div className={`mt-16 transition-all duration-1000 delay-700 ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-glow">
              <div className="text-4xl font-bold text-primary mb-2 animate-pulse">99.9%</div>
              <div className="text-muted-foreground">Tiempo de Actividad</div>
            </div>
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-secondary/10 to-secondary/5 border border-secondary/20 hover:border-secondary/40 transition-all duration-300 hover:shadow-glow">
              <div className="text-4xl font-bold text-secondary mb-2 animate-pulse" style={{ animationDelay: "0.2s" }}>50%</div>
              <div className="text-muted-foreground">Reducción de Tiempo</div>
            </div>
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20 hover:border-accent/40 transition-all duration-300 hover:shadow-glow">
              <div className="text-4xl font-bold text-accent mb-2 animate-pulse" style={{ animationDelay: "0.4s" }}>24/7</div>
              <div className="text-muted-foreground">Soporte Técnico</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
