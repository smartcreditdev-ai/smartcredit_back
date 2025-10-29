import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import heroImage from "@/assets/hero-smartcredit.jpg";
import { 
  Users, 
  FileText, 
  Wallet, 
  CreditCard, 
  Globe, 
  Shield,
  Zap,
  TrendingUp,
  CheckCircle,
  Database,
  Lock,
  Smartphone
} from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

const Index = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    entidad: "",
    mensaje: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "¡Solicitud enviada!",
      description: "Nos pondremos en contacto contigo pronto.",
    });
    setFormData({ nombre: "", email: "", entidad: "", mensaje: "" });
  };

  const features = [
    {
      icon: Users,
      title: "Gestión de Prospectos",
      description: "Administra y califica prospectos de manera eficiente con herramientas de seguimiento avanzadas.",
    },
    {
      icon: FileText,
      title: "Solicitudes de Crédito",
      description: "Sistema integral para recibir, evaluar y aprobar solicitudes de crédito digitalmente.",
    },
    {
      icon: Wallet,
      title: "Administración de Cartera",
      description: "Control total de tu cartera de créditos con análisis de mora y reportes detallados.",
    },
    {
      icon: CreditCard,
      title: "Sistema de Pagos",
      description: "Procesa pagos totales, parciales y promesas de pago con integración a múltiples pasarelas.",
    },
    {
      icon: Globe,
      title: "Multi-idioma",
      description: "Interfaz disponible en español e inglés con soporte para expansión internacional.",
    },
    {
      icon: Shield,
      title: "Roles y Permisos",
      description: "Sistema granular de permisos por agencia y usuario para máxima seguridad.",
    },
  ];

  const techStack = [
    { name: "React 18", description: "Frontend moderno y reactivo" },
    { name: "Supabase", description: "Backend escalable con PostgreSQL" },
    { name: "Tailwind CSS", description: "Diseño responsivo y personalizable" },
    { name: "Vite", description: "Build tool ultra rápido" },
    { name: "TypeScript", description: "Código seguro y mantenible" },
    { name: "JWT Auth", description: "Autenticación segura" },
  ];

  const benefits = [
    {
      icon: Zap,
      title: "Reducción de Errores Manuales",
      description: "Automatiza procesos y elimina errores de captura de datos.",
    },
    {
      icon: TrendingUp,
      title: "Evaluación Crediticia Automatizada",
      description: "Algoritmos inteligentes para evaluar el riesgo crediticio.",
    },
    {
      icon: CheckCircle,
      title: "Control de Mora y Cobranzas",
      description: "Herramientas avanzadas para gestión de cartera vencida.",
    },
    {
      icon: Database,
      title: "Escalabilidad para Múltiples Agencias",
      description: "Crece sin límites con arquitectura multi-tenant.",
    },
    {
      icon: Lock,
      title: "Seguridad de Nivel Empresarial",
      description: "Protección de datos con RLS y encriptación end-to-end.",
    },
    {
      icon: Smartphone,
      title: "Acceso desde Cualquier Dispositivo",
      description: "Interfaz responsive optimizada para móvil, tablet y desktop.",
    },
  ];

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section id="inicio" className="pt-24 pb-20 gradient-hero">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-foreground">
                Gestione su cartera de créditos con precisión y agilidad
              </h1>
              <p className="text-xl text-muted-foreground">
                SmartCredit centraliza la evaluación, aprobación y cobranza de créditos en una sola plataforma moderna y segura.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="cta" size="xl" onClick={() => document.getElementById("contacto")?.scrollIntoView({ behavior: "smooth" })}>
                  Probar SmartCredit
                </Button>
                <Button variant="outline" size="xl" onClick={() => document.getElementById("caracteristicas")?.scrollIntoView({ behavior: "smooth" })}>
                  Ver Características
                </Button>
              </div>
            </div>
            <div className="relative">
              <img 
                src={heroImage} 
                alt="SmartCredit Dashboard - Gestión de créditos moderna" 
                className="rounded-2xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="caracteristicas" className="py-20 gradient-subtle">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-foreground mb-4">Características Principales</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Todo lo que necesitas para gestionar tu cartera de créditos de manera profesional
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="p-6 hover:shadow-lg transition-smooth bg-card">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section id="tecnologia" className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-foreground mb-4">Arquitectura Tecnológica</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              SmartCredit se construyó sobre una arquitectura modular con React y Supabase, garantizando seguridad, rendimiento y facilidad de integración.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {techStack.map((tech, index) => (
              <div key={index} className="text-center p-6 rounded-lg bg-muted hover:bg-muted/80 transition-smooth">
                <h4 className="font-bold text-foreground mb-2">{tech.name}</h4>
                <p className="text-sm text-muted-foreground">{tech.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 p-8 rounded-2xl bg-muted/50">
            <h3 className="text-foreground mb-6 text-center">Stack Tecnológico</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-foreground mb-3">Frontend</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• React 18 con TypeScript</li>
                  <li>• Vite para build ultra rápido</li>
                  <li>• Tailwind CSS para diseño responsive</li>
                  <li>• i18next para internacionalización</li>
                  <li>• Lucide React Icons</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-3">Backend</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Supabase con PostgreSQL</li>
                  <li>• Autenticación JWT</li>
                  <li>• Row Level Security (RLS)</li>
                  <li>• Realtime updates</li>
                  <li>• API REST documentada</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="beneficios" className="py-20 gradient-subtle">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-foreground mb-4">Beneficios para Microfinancieras</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Transforma la gestión de tu cartera de créditos con tecnología de vanguardia
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-secondary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-foreground mb-2">{benefit.title}</h3>
                    <p className="text-muted-foreground">{benefit.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contacto" className="py-20 bg-card">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-foreground mb-4">Solicita una Demo</h2>
            <p className="text-xl text-muted-foreground">
              Descubre cómo SmartCredit puede transformar tu gestión de créditos
            </p>
          </div>
          <Card className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="nombre" className="block text-sm font-medium text-foreground mb-2">
                    Nombre Completo *
                  </label>
                  <Input
                    id="nombre"
                    type="text"
                    required
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    placeholder="Juan Pérez"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                    Email *
                  </label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="juan@empresa.com"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="entidad" className="block text-sm font-medium text-foreground mb-2">
                  Entidad / Cooperativa *
                </label>
                <Input
                  id="entidad"
                  type="text"
                  required
                  value={formData.entidad}
                  onChange={(e) => setFormData({ ...formData, entidad: e.target.value })}
                  placeholder="Cooperativa de Crédito XYZ"
                />
              </div>
              <div>
                <label htmlFor="mensaje" className="block text-sm font-medium text-foreground mb-2">
                  Mensaje
                </label>
                <Textarea
                  id="mensaje"
                  value={formData.mensaje}
                  onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                  placeholder="Cuéntanos sobre tus necesidades..."
                  rows={4}
                />
              </div>
              <Button type="submit" variant="cta" size="lg" className="w-full">
                Solicitar Demo Gratuita
              </Button>
            </form>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
