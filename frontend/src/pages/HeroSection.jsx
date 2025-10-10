import { useTextContent } from "../hooks/useTextContent";

const HeroSection = () => {
  const { content: heroTitle, loading: loadingTitle } =
    useTextContent("hero_title");
  const { content: heroSubtitle, loading: loadingSubtitle } =
    useTextContent("hero_subtitle");
  const { content: heroButton, loading: loadingButton } =
    useTextContent("hero_button_text");

  if (loadingTitle || loadingSubtitle || loadingButton) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <section className="relative h-screen flex items-center justify-center bg-gradient-to-r from-purple-600 to-pink-600">
      <div className="text-center text-white px-4">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
          {heroTitle?.content || "Decoración de Globos Personalizada"}
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
          {heroSubtitle?.content ||
            "Hacemos realidad tus sueños con las decoraciones más increíbles"}
        </p>
        <button className="bg-white text-purple-600 px-8 py-4 rounded-full text-lg font-bold hover:scale-105 transition-transform">
          {heroButton?.content || "Explorar Servicios"}
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
