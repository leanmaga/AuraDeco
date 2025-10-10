const AboutSection = () => {
  const { content: aboutTitle } = useTextContent("about_title");
  const { content: aboutDescription } = useTextContent("about_description");
  const { content: aboutMission } = useTextContent("about_mission");
  const { content: aboutVision } = useTextContent("about_vision");

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 max-w-4xl">
        <h2 className="text-4xl font-bold text-center mb-8">
          {aboutTitle?.content || "Sobre Nosotros"}
        </h2>

        <p className="text-lg text-gray-700 text-center mb-12 whitespace-pre-wrap">
          {aboutDescription?.content ||
            "Conoce más sobre nuestra historia y pasión por la decoración"}
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-purple-50 p-6 rounded-lg">
            <h3 className="text-2xl font-bold mb-4 text-purple-600">
              Nuestra Misión
            </h3>
            <p className="text-gray-700 whitespace-pre-wrap">
              {aboutMission?.content || "Crear momentos inolvidables..."}
            </p>
          </div>

          <div className="bg-pink-50 p-6 rounded-lg">
            <h3 className="text-2xl font-bold mb-4 text-pink-600">
              Nuestra Visión
            </h3>
            <p className="text-gray-700 whitespace-pre-wrap">
              {aboutVision?.content || "Ser líderes en decoración..."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
