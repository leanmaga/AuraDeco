import { useTextContentSection } from "../hooks/useTextContent";

const ServicesSection = () => {
  const { contents: services, loading } = useTextContentSection("services");

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        </div>
      </section>
    );
  }

  const activeServices = services
    .filter((s) => s.active)
    .sort((a, b) => a.order - b.order);

  return (
    <section className="py-16 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <h2 className="text-4xl font-bold text-center mb-4 text-gray-800">
          ✨ Nuestros Servicios
        </h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Creamos experiencias únicas para cada ocasión especial
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeServices.map((service) => (
            <div
              key={service._id}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="text-4xl mb-4">
                {service.key.includes("globos") && "🎈"}
                {service.key.includes("arreglo") && "💐"}
                {service.key.includes("centro") && "🌸"}
                {service.key.includes("columna") && "🏛️"}
                {service.key.includes("deco") && "🎨"}
                {service.key.includes("evento") && "🎉"}
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">
                {service.title}
              </h3>
              <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                {service.content}
              </p>
            </div>
          ))}
        </div>

        {activeServices.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Próximamente agregaremos nuestros servicios
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ServicesSection;
