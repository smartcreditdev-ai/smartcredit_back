import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  HeadphonesIcon, 
  Mail, 
  Phone, 
  Send
} from 'lucide-react';

const Soporte = () => {
  const { t } = useTranslation();
  const [contactForm, setContactForm] = useState({
    nombre: '',
    email: '',
    asunto: '',
    mensaje: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitContact = (e) => {
    e.preventDefault();
    
    const { nombre, email, asunto, mensaje } = contactForm;
    const subject = encodeURIComponent(asunto);
    const body = encodeURIComponent(
      `Nombre: ${nombre}\nEmail: ${email}\n\nMensaje:\n${mensaje}`
    );
    
    const mailtoLink = `mailto:comercial@smartbotla.com?subject=${subject}&body=${body}`;
    window.open(mailtoLink);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <HeadphonesIcon className="w-8 h-8 mr-3 text-primary-500" />
            {t('soporte.title')}
          </h1>
          <p className="text-gray-600 mt-1">{t('soporte.subtitle')}</p>
        </div>
      </div>

      {/* Contacto */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="space-y-6">
          {/* Información de contacto */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
              <Phone className="w-8 h-8 text-blue-500 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Teléfono</h3>
              <p className="text-gray-600 mb-2">+507 6380-3725</p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
              <Mail className="w-8 h-8 text-green-500 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
              <p className="text-gray-600 mb-2">comercial@smartbotla.com</p>
            </div>
          </div>

          {/* Formulario de contacto */}
          <div className="max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Envíanos un mensaje</h3>
            <form onSubmit={handleSubmitContact} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={contactForm.nombre}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Tu nombre completo"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={contactForm.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="tu@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Asunto *
                </label>
                <input
                  type="text"
                  name="asunto"
                  value={contactForm.asunto}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="¿En qué podemos ayudarte?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mensaje *
                </label>
                <textarea
                  name="mensaje"
                  value={contactForm.mensaje}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Describe tu consulta o problema en detalle..."
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 flex items-center"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Enviar Mensaje
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Soporte;
