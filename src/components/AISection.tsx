import { useRef, useEffect, useState } from "react";
import { Brain, FileText, BarChart3, Sparkles, Lightbulb, TrendingUp } from "lucide-react";
import { motion, useInView } from "framer-motion";

const AISection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });
  const [nodes, setNodes] = useState<Array<{ x: number; y: number; vx: number; vy: number }>>([]);

  // Neural network animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Initialize nodes
    const nodeCount = 80;
    const initialNodes = Array.from({ length: nodeCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
    }));
    setNodes(initialNodes);

    let animationFrameId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw nodes
      setNodes((prevNodes) => {
        const updatedNodes = prevNodes.map((node) => {
          let { x, y, vx, vy } = node;

          x += vx;
          y += vy;

          if (x < 0 || x > canvas.width) vx *= -1;
          if (y < 0 || y > canvas.height) vy *= -1;

          return { x, y, vx, vy };
        });

        // Draw connections
        ctx.lineWidth = 1.5;

        for (let i = 0; i < updatedNodes.length; i++) {
          for (let j = i + 1; j < updatedNodes.length; j++) {
            const dx = updatedNodes[i].x - updatedNodes[j].x;
            const dy = updatedNodes[i].y - updatedNodes[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 120) {
              const opacity = (1 - distance / 120) * 0.5;
              // Alternate between primary blue and secondary teal
              const color = i % 2 === 0 
                ? `rgba(59, 130, 246, ${opacity})` // Primary blue
                : `rgba(20, 184, 166, ${opacity})`; // Secondary teal
              ctx.strokeStyle = color;
              ctx.beginPath();
              ctx.moveTo(updatedNodes[i].x, updatedNodes[i].y);
              ctx.lineTo(updatedNodes[j].x, updatedNodes[j].y);
              ctx.stroke();
            }
          }
        }

        // Draw nodes with glow effect
        updatedNodes.forEach((node, index) => {
          // Glow
          const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, 8);
          const color = index % 3 === 0 
            ? 'rgba(59, 130, 246, 0.4)' // Primary
            : index % 3 === 1
            ? 'rgba(20, 184, 166, 0.4)' // Secondary
            : 'rgba(249, 115, 22, 0.4)'; // Accent
          gradient.addColorStop(0, color);
          gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(node.x, node.y, 8, 0, Math.PI * 2);
          ctx.fill();

          // Core
          const coreColor = index % 3 === 0 
            ? 'rgba(59, 130, 246, 1)' // Primary
            : index % 3 === 1
            ? 'rgba(20, 184, 166, 1)' // Secondary
            : 'rgba(249, 115, 22, 1)'; // Accent
          ctx.fillStyle = coreColor;
          ctx.beginPath();
          ctx.arc(node.x, node.y, 4, 0, Math.PI * 2);
          ctx.fill();
        });

        return updatedNodes;
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const features = [
    {
      icon: FileText,
      title: "Generación de Reportes",
      description: "Crea reportes detallados automáticamente con análisis inteligente de datos crediticios.",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: Brain,
      title: "Análisis de Documentación",
      description: "Extrae y valida información clave de documentos de manera automática y precisa.",
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      icon: BarChart3,
      title: "Análisis Predictivo",
      description: "Predice comportamientos de pago y riesgos crediticios con machine learning avanzado.",
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
  ];

  const capabilities = [
    {
      icon: Sparkles,
      text: "Procesamiento de lenguaje natural",
    },
    {
      icon: Lightbulb,
      text: "Detección automática de patrones",
    },
    {
      icon: TrendingUp,
      text: "Insights accionables en tiempo real",
    },
  ];

  return (
    <section id="inteligencia-artificial" ref={sectionRef} className="py-20 relative overflow-hidden bg-gradient-to-b from-background via-primary/5 to-background">
      {/* Neural Network Canvas Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none opacity-70"
      />

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: "4s" }} />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: "5s" }} />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6 }}
          >
            <Brain className="w-5 h-5 text-primary" />
            <span className="text-sm font-semibold text-primary">Potenciado por Inteligencia Artificial</span>
          </motion.div>

          <motion.h2
            className="text-foreground mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Integración con OpenAI
          </motion.h2>
          <motion.p
            className="text-xl text-muted-foreground max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Aprovecha el poder de la{" "}
            <span className="text-primary font-semibold">inteligencia artificial de última generación</span> para
            transformar tus datos en{" "}
            <span className="text-secondary font-semibold">decisiones estratégicas</span>
          </motion.p>
        </motion.div>

        {/* Main Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                className="group"
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: index * 0.2 }}
              >
                <div className="relative p-8 rounded-2xl bg-card/80 backdrop-blur-sm border-2 border-border hover:border-primary/40 transition-all duration-300 hover:shadow-glow overflow-hidden h-full">
                  {/* Background Effect */}
                  <div className={`absolute inset-0 ${feature.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                  {/* Content */}
                  <div className="relative z-10">
                    <motion.div
                      className={`w-16 h-16 rounded-2xl ${feature.bgColor} flex items-center justify-center mb-6 shadow-lg`}
                      whileHover={{
                        scale: 1.1,
                        rotate: 5,
                        transition: { duration: 0.3, type: "spring", stiffness: 400 }
                      }}
                    >
                      <Icon className={`w-8 h-8 ${feature.color}`} />
                    </motion.div>

                    <h3 className="text-foreground font-bold mb-3 text-xl group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>

                  {/* Corner Glow */}
                  <div className={`absolute -bottom-4 -right-4 w-32 h-32 ${feature.bgColor} rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Capabilities Section */}
        <motion.div
          className="mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="bg-card/60 backdrop-blur-sm rounded-2xl p-8 border-2 border-border">
            <h3 className="text-2xl font-bold text-foreground mb-6 text-center">
              Capacidades Avanzadas de IA
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {capabilities.map((capability, index) => {
                const Icon = capability.icon;
                return (
                  <motion.div
                    key={index}
                    className="flex items-center gap-3 p-4 rounded-xl bg-primary/5 hover:bg-primary/10 transition-colors duration-300"
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <Icon className="w-6 h-6 text-primary flex-shrink-0" />
                    <span className="text-foreground font-medium">{capability.text}</span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AISection;