import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from "@/components/ui/carousel";
import famaLogo from "@/assets/logos/logo_fama.png";
import finacreditLogo from "@/assets/logos/logo_finacredit.png";
import puenteDeAmistadLogo from "@/assets/logos/logo_puente_de_amistad.png";
import yamnonhLogo from "@/assets/logos/logo_yamnonh.png";
import grameenLogo from "@/assets/logos/logo_grameen.png";
import optimaLogo from "@/assets/logos/logo_optima.png";

const InstitutionsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });
  const [api, setApi] = useState<CarouselApi>();
  const isHoveredRef = useRef(false);

  useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      if (isHoveredRef.current) return;
      api.scrollNext();
    }, 3000);

    return () => clearInterval(interval);
  }, [api]);

  const institutions = [
    { name: "FAMA", logo: famaLogo },
    { name: "Finacredit", logo: finacreditLogo },
    { name: "Puente de Amistad", logo: puenteDeAmistadLogo },
    { name: "Yamanonh", logo: yamnonhLogo },
    { name: "Grameen Costa Rica", logo: grameenLogo },
    { name: "Óptima", logo: optimaLogo },
  ];

  return (
    <section id="instituciones" ref={sectionRef} className="py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-foreground mb-4">
            Impulsando la transformación digital de instituciones financieras
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            SmartCredit acompaña a instituciones financieras en la digitalización de sus procesos de crédito, evaluación, rutas y gestión operativa.
          </p>
        </motion.div>

        {/* Institutions Carousel */}
        <div
          className="relative max-w-5xl mx-auto px-8"
          onMouseEnter={() => {
            isHoveredRef.current = true;
          }}
          onMouseLeave={() => {
            isHoveredRef.current = false;
          }}
        >
          <Carousel opts={{ align: "start", loop: true }} setApi={setApi} className="w-full">
            <CarouselContent>
              {institutions.map((institution, index) => (
                <CarouselItem key={institution.name} className="basis-[85%] md:basis-1/2 lg:basis-1/4">
                  <motion.div
                    className="flex flex-col items-center p-5 bg-white border border-border rounded-lg shadow-md"
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ scale: 1.03 }}
                  >
                    <div className="h-28 w-full flex items-center justify-center mb-2">
                      <img
                        src={institution.logo}
                        alt={`Logo de ${institution.name}`}
                        className="max-h-full max-w-full w-auto object-contain"
                      />
                    </div>
                    <h3 className="text-sm font-medium text-muted-foreground text-center">{institution.name}</h3>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default InstitutionsSection;
