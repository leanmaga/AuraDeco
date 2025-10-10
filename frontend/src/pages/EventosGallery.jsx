import { useTextContentSection } from "../hooks/useTextContent";

const EventosGallery = () => {
  const { contents: eventos, loading } = useTextContentSection("events");

  if (loading) {
    return <div className="text-center py-12">Cargando eventos...</div>;
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">
          Nuestros Últimos Eventos
        </h2>

        {eventos.length === 0 ? (
          <p className="text-center text-gray-500">
            No hay eventos para mostrar en este momento
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {eventos.map((evento) => (
              <div
                key={evento._id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-3 text-purple-600">
                    {evento.title}
                  </h3>
                  <p className="text-gray-600 whitespace-pre-wrap">
                    {evento.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default EventosGallery;
