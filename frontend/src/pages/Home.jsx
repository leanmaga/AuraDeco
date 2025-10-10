import { Link } from "react-router-dom";
import Banner from "../components/Banner";
import BuyCard from "../components/BuyCard";
import PhotoCard from "../components/PhotoCard";
import Galeria from "../components/Galeria";
import useSiteImages from "../hooks/useSiteImages";
import { useTextContent } from "../hooks/useTextContent";
import Footer from "../components/Footer";
import ServicesSection from "./ServicesSection";
import TestimonialSection from "./TestimonialSection";

const Home = () => {
  // Cargar imágenes desde Cloudinary
  const { getImageByKey, loading: loadingImages } = useSiteImages();

  // Cargar contenidos textuales dinámicos
  const { content: btnEventText, loading: loadingBtn } =
    useTextContent("home_btn_evento");
  const { content: photoTitle, loading: loadingPhotoTitle } =
    useTextContent("home_photo_title");
  const { content: photoSubtitle, loading: loadingPhotoSubtitle } =
    useTextContent("home_photo_subtitle");
  const { content: photoParrafo, loading: loadingPhotoParrafo } =
    useTextContent("home_photo_parrafo");
  const { content: gallery1Title, loading: loadingGal1 } = useTextContent(
    "home_gallery1_title"
  );
  const { content: gallery2Title, loading: loadingGal2 } = useTextContent(
    "home_gallery2_title"
  );
  const { content: gallery3Title, loading: loadingGal3 } = useTextContent(
    "home_gallery3_title"
  );
  const { content: gallery4Title, loading: loadingGal4 } = useTextContent(
    "home_gallery4_title"
  );
  const { content: gallery1Link, loading: loadingGal1Link } =
    useTextContent("home_gallery1_link");
  const { content: gallery2Link, loading: loadingGal2Link } =
    useTextContent("home_gallery2_link");
  const { content: gallery3Link, loading: loadingGal3Link } =
    useTextContent("home_gallery3_link");
  const { content: gallery4Link, loading: loadingGal4Link } =
    useTextContent("home_gallery4_link");

  // Verificar si algo está cargando
  const loading =
    loadingImages ||
    loadingBtn ||
    loadingPhotoTitle ||
    loadingPhotoSubtitle ||
    loadingPhotoParrafo ||
    loadingGal1 ||
    loadingGal2 ||
    loadingGal3 ||
    loadingGal4 ||
    loadingGal1Link ||
    loadingGal2Link ||
    loadingGal3Link ||
    loadingGal4Link;

  // Si las imágenes o contenidos están cargando, mostrar un loading
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
      {/* Botón flotante para armar evento - TEXTO DINÁMICO */}
      <Link
        to="/arma-tu-evento"
        className="fixed bottom-6 left-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-4 rounded-full shadow-2xl hover:scale-110 transition-transform z-50 font-bold flex items-center gap-2"
      >
        <span className="text-2xl">🎉</span>
        <span>{btnEventText?.content || "Armá tu Evento"}</span>
      </Link>

      <Banner className="min-h-screen w-full" />

      {/* PhotoCard - TEXTOS DINÁMICOS */}
      <PhotoCard
        className="min-h-screen w-full"
        title={photoTitle?.content || "Arreglo de globos personalizado"}
        subtitle={
          photoSubtitle?.content ||
          "Miren la hermosa deco que realizamos para los 15 de Sofía💚🦋!"
        }
        parrafo={
          photoParrafo?.content ||
          "También realizamos centros de mesa y columnas"
        }
        imagenPrincipal={images.arreglo}
        imagenenSecundariaUno={images.arreglo2}
        imagenSecundariaDos={images.arreglo3}
      />

      {/* Galería - TÍTULOS Y LINKS DINÁMICOS */}
      <Galeria
        className="w-full"
        img1={images.gallery1}
        img2={images.gallery2}
        img3={images.gallery3}
        img4={images.gallery4}
        titulo1={
          gallery1Title?.content ||
          "Miren esta belleza de deco! De Frozen para los 3 añitos 🧊❄️"
        }
        titulo2={gallery2Title?.content || "Arreglo de La Sirenita!🧜🦀"}
        titulo3={gallery3Title?.content || "Hermosa deco para los 18"}
        titulo4={
          gallery4Title?.content ||
          "Harry Potter Está deco superó nuestras expectativas, quedó divina!😍"
        }
        red1={
          gallery1Link?.content ||
          "https://www.instagram.com/p/C0FwghyMLIT/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=="
        }
        red2={
          gallery2Link?.content ||
          "https://www.instagram.com/p/CseRK0vL7NC/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=="
        }
        red3={
          gallery3Link?.content ||
          "https://www.instagram.com/p/C1zbN2qM9y-/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=="
        }
        red4={
          gallery4Link?.content ||
          "https://www.instagram.com/p/C07rqJLMpl7/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=="
        }
      />

      <div className="w-full flex flex-row my-8">
        <BuyCard imagen={images.globo1} />
        <BuyCard imagen={images.globo2} />
      </div>

      <ServicesSection />
      <TestimonialSection />

      <Footer />
    </div>
  );
};

export default Home;
