const TestimonialsSection = () => {
  const { contents: testimonios, loading } =
    useTextContentSection("testimonials");

  if (loading) return <div>Cargando testimonios...</div>;

  return (
    <section className="py-16 bg-purple-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">
          Lo Que Dicen Nuestros Clientes
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonios.map((testimonio) => (
            <div
              key={testimonio._id}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <div className="flex items-center mb-4">
                <div className="text-3xl mr-3">⭐⭐⭐⭐⭐</div>
              </div>
              <h4 className="font-bold text-lg mb-2">{testimonio.title}</h4>
              <p className="text-gray-600 italic whitespace-pre-wrap">
                "{testimonio.content}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
