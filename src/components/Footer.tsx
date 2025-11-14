import { Mail, Phone, MapPin } from "lucide-react";
import logo from "@/assets/logo.png";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src={logo} alt="SmartCredit Logo" className="h-20 w-auto" />
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
                <span>comercial_ca@smartbotla.com</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Phone className="w-4 h-4" />
                <span>+505 88358295</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>PH Blue Business Center, Calle 67,
                San Fransisco, Provincia de Panamá.</span>
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
              SmartBot
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
