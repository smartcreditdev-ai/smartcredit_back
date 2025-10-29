import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">SC</span>
            </div>
            <span className="text-xl font-bold text-foreground">SmartCredit</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollToSection("inicio")} className="text-foreground hover:text-primary transition-smooth">
              Inicio
            </button>
            <button onClick={() => scrollToSection("caracteristicas")} className="text-foreground hover:text-primary transition-smooth">
              Características
            </button>
            <button onClick={() => scrollToSection("tecnologia")} className="text-foreground hover:text-primary transition-smooth">
              Tecnología
            </button>
            <button onClick={() => scrollToSection("beneficios")} className="text-foreground hover:text-primary transition-smooth">
              Beneficios
            </button>
            <button onClick={() => scrollToSection("contacto")} className="text-foreground hover:text-primary transition-smooth">
              Contacto
            </button>
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button variant="cta" size="lg" onClick={() => scrollToSection("contacto")}>
              Solicitar Demo
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 flex flex-col gap-4">
            <button onClick={() => scrollToSection("inicio")} className="text-foreground hover:text-primary transition-smooth text-left">
              Inicio
            </button>
            <button onClick={() => scrollToSection("caracteristicas")} className="text-foreground hover:text-primary transition-smooth text-left">
              Características
            </button>
            <button onClick={() => scrollToSection("tecnologia")} className="text-foreground hover:text-primary transition-smooth text-left">
              Tecnología
            </button>
            <button onClick={() => scrollToSection("beneficios")} className="text-foreground hover:text-primary transition-smooth text-left">
              Beneficios
            </button>
            <button onClick={() => scrollToSection("contacto")} className="text-foreground hover:text-primary transition-smooth text-left">
              Contacto
            </button>
            <Button variant="cta" size="lg" onClick={() => scrollToSection("contacto")} className="w-full">
              Solicitar Demo
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
