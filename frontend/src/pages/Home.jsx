import { Link } from "react-router-dom";
import Banner from "../components/Banner";
import BuyCard from "../components/BuyCard";
import PhotoCard from "../components/PhotoCard";
import Galeria from "../components/Galeria";
import useSiteImages from "../hooks/useSiteImages";

const Home = () => {
  // Cargar imágenes desde Cloudinary
  const { getImageByKey, loading } = useSiteImages();

  // Si las imágenes están cargando, mostrar un loading
  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mb-4"></div>
          <p className="text-gray-600 font-medium">Cargando...</p>
        </div>
      </div>
    );
  }

  // Obtener URLs de las imágenes desde Cloudinary
  const images = {
    // Banner
    globdeco: getImageByKey("banner_video"),

    // PhotoCard
    arreglo: getImageByKey("photocard_video_arreglo"),
    arreglo2: getImageByKey("photocard_arreglo2"),
    arreglo3: getImageByKey("photocard_arreglo3"),

    // Galería
    gallery1: getImageByKey("gallery_foto1"),
    gallery2: getImageByKey("gallery_foto2"),
    gallery3: getImageByKey("gallery_foto3"),
    gallery4: getImageByKey("gallery_foto4"),

    // BuyCards
    globo1: getImageByKey("buycard_globo1"),
    globo2: getImageByKey("buycard_globo2"),
  };

  return (
    <div className="min-h-screen w-full flex flex-col">
      {/* Botón flotante para armar evento */}
      <Link
        to="/arma-tu-evento"
        className="fixed bottom-6 left-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-4 rounded-full shadow-2xl hover:scale-110 transition-transform z-50 font-bold flex items-center gap-2"
      >
        <span className="text-2xl">🎉</span>
        <span>Armá tu Evento</span>
      </Link>

      <Banner className="min-h-screen w-full" />

      <PhotoCard
        className="min-h-screen w-full"
        title="Arreglo de globos personalizado"
        subtitle="Miren la hermosa deco que realizamos para los 15 de Sofía💚🦋!"
        parrafo="También realizamos centros de mesa y columnas"
        imagenPrincipal={images.arreglo}
        imagenenSecundariaUno={images.arreglo2}
        imagenSecundariaDos={images.arreglo3}
      />

      <Galeria
        className="w-full"
        img1={images.gallery1}
        img2={images.gallery2}
        img3={images.gallery3}
        img4={images.gallery4}
        titulo1="Miren esta belleza de deco! De Frozen para los 3 añitos 🧊❄️"
        titulo2="Arreglo de La Sirenita!🧜🦀"
        titulo3="Hermosa deco para los 18"
        titulo4="Harry Potter Está deco superó nuestras expectativas, quedó divina!😍"
        red1="https://www.instagram.com/p/C0FwghyMLIT/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=="
        red2="https://www.instagram.com/p/CseRK0vL7NC/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=="
        red3="https://www.instagram.com/p/C1zbN2qM9y-/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=="
        red4="https://www.instagram.com/p/C07rqJLMpl7/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=="
      />

      <div className="w-full flex flex-row my-8">
        <BuyCard imagen={images.globo1} />
        <BuyCard imagen={images.globo2} />
      </div>
    </div>
  );
};

export default Home;
