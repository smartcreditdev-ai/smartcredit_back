import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TechnologySection from "@/components/TechnologySection";
import FeaturesSection from "@/components/FeaturesSection";
import BenefitsSection from "@/components/BenefitsSection";
import AISection from "@/components/AISection";
import WhatsAppButton from "@/components/WhatsAppButton";
import heroImage from "@/assets/hero-back.png";
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


  return (
    <div className="min-h-screen">
      <Header />
      <WhatsAppButton />

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
      <FeaturesSection />

      {/* AI Section */}
      <AISection />

      {/* Technology Section */}
      <TechnologySection />

      {/* Benefits Section */}
      <BenefitsSection />

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
