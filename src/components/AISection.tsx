import { useRef, useEffect, useState } from "react";
import { Brain, FileText, BarChart3, Sparkles, Lightbulb, TrendingUp } from "lucide-react";
import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";

const AISection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });
  const nodesRef = useRef<Array<{ x: number; y: number; vx: number; vy: number }>>([]);
  const [isDragging, setIsDragging] = useState(false);
  const x = useMotionValue(0);

  // Neural network animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let currentWidth = 0;
    let currentHeight = 0;
    
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      
      const rect = parent.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const width = Math.max(300, rect.width);
      const height = Math.max(300, rect.height);
      
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      
      // Reset context transform
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      
      // Reinitialize nodes if size changed significantly or nodes don't exist
      if (nodesRef.current.length === 0 || Math.abs(currentWidth - width) > 50 || Math.abs(currentHeight - height) > 50) {
        currentWidth = width;
        currentHeight = height;
        const nodeCount = 80;
        nodesRef.current = Array.from({ length: nodeCount }, () => ({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.8,
          vy: (Math.random() - 0.5) * 0.8,
        }));
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Initialize nodes
    if (nodesRef.current.length === 0) {
      const nodeCount = 80;
      const rect = canvas.parentElement?.getBoundingClientRect() || { width: 800, height: 600 };
      nodesRef.current = Array.from({ length: nodeCount }, () => ({
        x: Math.random() * rect.width,
        y: Math.random() * rect.height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
      }));
    }

    let animationFrameId: number;
    const animate = () => {
      const dpr = window.devicePixelRatio || 1;
      const canvasWidth = canvas.width / dpr;
      const canvasHeight = canvas.height / dpr;
      
      // Ensure context is properly scaled
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      const nodes = nodesRef.current;

      // Update nodes
      for (let i = 0; i < nodes.length; i++) {
        nodes[i].x += nodes[i].vx;
        nodes[i].y += nodes[i].vy;

        if (nodes[i].x < 0 || nodes[i].x > canvasWidth) nodes[i].vx *= -1;
        if (nodes[i].y < 0 || nodes[i].y > canvasHeight) nodes[i].vy *= -1;
      }

      // Draw connections
      ctx.lineWidth = 1.5;

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            const opacity = (1 - distance / 120) * 0.5;
            // Alternate between primary blue and secondary teal
            const color = i % 2 === 0 
              ? `rgba(59, 130, 246, ${opacity})` // Primary blue
              : `rgba(20, 184, 166, ${opacity})`; // Secondary teal
            ctx.strokeStyle = color;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw nodes with glow effect
      nodes.forEach((node, index) => {
        // Glow
        const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, 8);
        const color = index % 3 === 0 
          ? 'rgba(59, 130, 246, 0.4)' // Primary
          : index % 3 === 1
          ? 'rgba(20, 184, 166, 0.4)' // Secondary
          : 'rgba(239, 165, 2, 0.4)'; // Accent
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
          : 'rgba(239, 165, 2, 1)'; // Accent
        ctx.fillStyle = coreColor;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 4, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    // Start animation with a small delay to ensure canvas is rendered
    const timeoutId = setTimeout(() => {
      animate();
    }, 100);

    return () => {
      clearTimeout(timeoutId);
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

  const aiProviders = [
    "OpenAI",
    "Gemini",
    "Llama 3",
    "Copilot",
    "Grok",
    "Claude",
    "Titan"
  ];

  // Auto-scroll animation when not dragging
  useEffect(() => {
    if (!isDragging && isInView) {
      // Calculate approximate width: each label (160px) + gap (24px) = ~184px per item
      const itemWidth = 184;
      const totalWidth = itemWidth * aiProviders.length;
      const currentX = x.get();
      
      // Reset to start if we've scrolled past the first set
      if (currentX <= -totalWidth) {
        x.set(0);
      }
      
      const animation = animate(x, currentX - totalWidth, {
        duration: 30,
        ease: "linear",
        onComplete: () => {
          if (!isDragging) {
            x.set(0);
          }
        }
      });
      
      return () => animation.stop();
    }
  }, [isDragging, isInView, x, aiProviders.length]);

  return (
    <section id="inteligencia-artificial" ref={sectionRef} className="py-20 relative overflow-hidden bg-gradient-to-b from-background via-primary/5 to-background">
      {/* Neural Network Canvas Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none opacity-60 z-0"
        style={{ minHeight: '600px' }}
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
            Integración de Inteligencia Artificial
          </motion.h2>
          <motion.p
            className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Aprovecha el poder de la{" "}
            <span className="text-primary font-semibold">inteligencia artificial de última generación</span> para
            transformar tus datos en{" "}
            <span className="text-secondary font-semibold">decisiones estratégicas</span>
          </motion.p>
          
          {/* AI Providers Slider */}
          <motion.div
            className="overflow-hidden mb-8 cursor-grab active:cursor-grabbing"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
            onPointerDown={() => setIsDragging(true)}
            onPointerUp={() => setIsDragging(false)}
            onPointerLeave={() => setIsDragging(false)}
          >
            <motion.div
              ref={sliderRef}
              className="flex gap-6 items-center"
              style={{ x }}
              drag="x"
              dragConstraints={{ left: -184 * aiProviders.length * 2, right: 0 }}
              dragElastic={0.2}
              onDragStart={() => setIsDragging(true)}
              onDragEnd={() => setIsDragging(false)}
            >
              {/* First set of items */}
              {aiProviders.map((provider, idx) => (
                <div
                  key={idx}
                  className="px-6 py-4 rounded-lg bg-card/80 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-md flex items-center justify-center shrink-0"
                  style={{ minWidth: '160px', height: '80px' }}
                >
                  <span className="text-lg font-semibold text-foreground whitespace-nowrap">{provider}</span>
                </div>
              ))}
              {/* Duplicate for seamless loop */}
              {aiProviders.map((provider, idx) => (
                <div
                  key={`dup-${idx}`}
                  className="px-6 py-4 rounded-lg bg-card/80 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-md flex items-center justify-center shrink-0"
                  style={{ minWidth: '160px', height: '80px' }}
                >
                  <span className="text-lg font-semibold text-foreground whitespace-nowrap">{provider}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
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