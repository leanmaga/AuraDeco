const ServicesSection = () => {
  const { contents: servicios, loading } = useTextContentSection("services");

  if (loading) return <div>Cargando servicios...</div>;

  return (
    <section className="py-16 bg-gradient-to-b from-white to-purple-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">
          Nuestros Servicios
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {servicios.map((servicio, index) => (
            <div
              key={servicio._id}
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2"
            >
              <div className="text-4xl mb-4 text-center">
                {["🎈", "🎉", "✨"][index % 3]}
              </div>
              <h3 className="text-2xl font-bold mb-4 text-center text-purple-600">
                {servicio.title}
              </h3>
              <p className="text-gray-600 text-center whitespace-pre-wrap">
                {servicio.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
