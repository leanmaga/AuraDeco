import { useTextContentSection } from "../hooks/useTextContent";

const TestimonialsSection = () => {
  const { contents: testimonials, loading } =
    useTextContentSection("testimonials");

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        </div>
      </section>
    );
  }

  const activeTestimonials = testimonials
    .filter((t) => t.active)
    .sort((a, b) => a.order - b.order);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <h2 className="text-4xl font-bold text-center mb-4 text-gray-800">
          💜 Lo que dicen nuestros clientes
        </h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          La satisfacción de nuestros clientes es nuestra mejor carta de
          presentación
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeTestimonials.map((testimonial) => (
            <div
              key={testimonial._id}
              className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {testimonial.title.charAt(0).toUpperCase()}
                </div>
                <div className="ml-3">
                  <h3 className="font-bold text-gray-800">
                    {testimonial.title}
                  </h3>
                  <div className="flex text-yellow-400 text-sm">⭐⭐⭐⭐⭐</div>
                </div>
              </div>
              <p className="text-gray-700 italic leading-relaxed whitespace-pre-wrap">
                "{testimonial.content}"
              </p>
            </div>
          ))}
        </div>

        {activeTestimonials.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Próximamente agregaremos testimonios de nuestros clientes
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default TestimonialsSection;
