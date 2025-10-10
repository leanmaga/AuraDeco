import { useTextContent } from "../hooks/useTextContent";

const Footer = () => {
  const { content: footerText } = useTextContent("footer_text");
  const { content: footerContact } = useTextContent("footer_contact");
  const { content: footerHours } = useTextContent("footer_hours");

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sobre Nosotros */}
          <div>
            <h3 className="text-xl font-bold mb-4">AuraDeco</h3>
            <p className="text-gray-400 whitespace-pre-wrap">
              {footerText?.content || "Decoración de globos personalizada"}
            </p>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contacto</h3>
            <p className="text-gray-400 whitespace-pre-wrap">
              {footerContact?.content || "info@auradeco.com\n+54 11 1234-5678"}
            </p>
          </div>

          {/* Horarios */}
          <div>
            <h3 className="text-xl font-bold mb-4">Horarios</h3>
            <p className="text-gray-400 whitespace-pre-wrap">
              {footerHours?.content ||
                "Lun - Vie: 9:00 - 18:00\nSáb: 10:00 - 14:00"}
            </p>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} AuraDeco. Todos los derechos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
