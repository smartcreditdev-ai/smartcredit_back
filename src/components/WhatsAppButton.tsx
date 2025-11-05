import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

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
      className="fixed right-6 bottom-24 z-40 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-full p-4 shadow-glow transition-smooth"
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
      <MessageCircle className="w-6 h-6" />
    </motion.button>
  );
};

export default WhatsAppButton;
