import { useRef } from "react";
import { Zap, TrendingUp, CheckCircle, Database, Lock, Smartphone } from "lucide-react";
import { motion, useInView } from "framer-motion";

const BenefitsSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

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

      <div className="container mx-auto px-4 relative z-10" ref={sectionRef}>
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <motion.h2 
            className="text-foreground mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Beneficios para Microfinancieras
          </motion.h2>
          <motion.p 
            className="text-xl text-muted-foreground max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Transforma la gestión de tu cartera de créditos con{" "}
            <span className="text-primary font-semibold">tecnología de vanguardia</span> y{" "}
            <span className="text-secondary font-semibold">resultados medibles</span>
          </motion.p>
        </motion.div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={index}
                className="group"
                initial={{ opacity: 0, x: -50, rotateY: -20 }}
                animate={isInView ? { opacity: 1, x: 0, rotateY: 0 } : {}}
                transition={{ 
                  duration: 0.7, 
                  delay: index * 0.1,
                  ease: [0.25, 0.4, 0.25, 1]
                }}
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.2 }
                }}
              >
                <div className="flex gap-4 p-6 rounded-xl bg-card/50 backdrop-blur-sm border-2 border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg relative overflow-hidden">
                  {/* Background Gradient on Hover */}
                  <div className={`absolute inset-0 ${benefit.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                  
                  {/* Icon Container */}
                  <div className="flex-shrink-0 relative z-10">
                    <motion.div 
                      className={`w-14 h-14 rounded-xl ${benefit.bgColor} flex items-center justify-center shadow-md`}
                      whileHover={{ 
                        scale: 1.2, 
                        rotate: 10,
                        transition: { duration: 0.3, type: "spring", stiffness: 400 }
                      }}
                    >
                      <Icon className={`w-7 h-7 ${benefit.color}`} />
                    </motion.div>
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
              </motion.div>
            );
          })}
        </div>

        {/* Stats Section */}
        <motion.div 
          className="mt-16"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { value: "99.9%", label: "Tiempo de Actividad", color: "primary", delay: 0 },
              { value: "50%", label: "Reducción de Tiempo", color: "secondary", delay: 0.1 },
              { value: "24/7", label: "Soporte Técnico", color: "accent", delay: 0.2 }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className={`text-center p-8 rounded-2xl bg-gradient-to-br from-${stat.color}/10 to-${stat.color}/5 border border-${stat.color}/20 hover:border-${stat.color}/40 transition-all duration-300 hover:shadow-glow`}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.9 + stat.delay }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <motion.div 
                  className={`text-4xl font-bold text-${stat.color} mb-2`}
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : {}}
                  transition={{ 
                    duration: 0.5, 
                    delay: 1 + stat.delay,
                    type: "spring",
                    stiffness: 200
                  }}
                >
                  {stat.value}
                </motion.div>
                <div className="text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default BenefitsSection;
