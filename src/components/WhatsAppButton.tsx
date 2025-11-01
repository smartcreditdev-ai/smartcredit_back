import { motion } from "framer-motion";
import whatsappLogo from "@/assets/whatsapp-logo.svg";

const WhatsAppButton = () => {
  const handleWhatsAppClick = () => {
    // Replace with your actual WhatsApp number
    const phoneNumber = "50763803725"; // Format: country code + number (no + or spaces)
    const message = encodeURIComponent("Hola, me gustaría obtener más información sobre SmartCredit");
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
  };

  return (
    <motion.button
      onClick={handleWhatsAppClick}
      className="fixed right-6 top-1/2 -translate-y-1/2 z-40 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-full p-4 shadow-glow transition-smooth"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20
      }}
      aria-label="Contactar por WhatsApp"
    >
      <img src={whatsappLogo} alt="WhatsApp" className="w-6 h-6" />
      <motion.div
        className="absolute inset-0 rounded-full bg-[#25D366]"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0, 0.5]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </motion.button>
  );
};

export default WhatsAppButton;
