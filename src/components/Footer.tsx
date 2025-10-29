import { Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">SC</span>
              </div>
              <span className="text-xl font-bold text-foreground">SmartCredit</span>
            </div>
            <p className="text-muted-foreground">
              Plataforma integral de gestión de créditos para microfinancieras y cooperativas.
            </p>
          </div>

          {/* Enlaces */}
          <div>
            <h4 className="font-bold text-foreground mb-4">Enlaces Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <a href="#caracteristicas" className="text-muted-foreground hover:text-primary transition-smooth">
                  Características
                </a>
              </li>
              <li>
                <a href="#tecnologia" className="text-muted-foreground hover:text-primary transition-smooth">
                  Tecnología
                </a>
              </li>
              <li>
                <a href="#beneficios" className="text-muted-foreground hover:text-primary transition-smooth">
                  Beneficios
                </a>
              </li>
              <li>
                <a href="#contacto" className="text-muted-foreground hover:text-primary transition-smooth">
                  Contacto
                </a>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="font-bold text-foreground mb-4">Contacto</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span>info@smartcredit.com</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Phone className="w-4 h-4" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>Ciudad, País</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-border text-center">
          <p className="text-muted-foreground">
            © 2025 SmartCredit – Todos los derechos reservados. Desarrollado por{" "}
            <a 
              href="https://www.smartbotla.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Da Corta Software
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
