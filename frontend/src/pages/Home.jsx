import { Link } from "react-router-dom";
import { globo1, globo2, arreglo2, arreglo3 } from "../assets/images";
import Banner from "../components/Banner";
import BuyCard from "../components/BuyCard";
import PhotoCard from "../components/PhotoCard";
import Galeria from "../components/Galeria";
import { globo5, globo4, globo7, globo6 } from "../assets/images";
import arreglo from "../assets/arreglo.mp4";

const Home = () => {
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
        imagenPrincipal={arreglo}
        imagenenSecundariaUno={arreglo2}
        imagenSecundariaDos={arreglo3}
      />

      <Galeria
        className="w-full"
        img1={globo5}
        img2={globo4}
        img3={globo7}
        img4={globo6}
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
        <BuyCard imagen={globo1} />
        <BuyCard imagen={globo2} />
      </div>
    </div>
  );
};

export default Home;
