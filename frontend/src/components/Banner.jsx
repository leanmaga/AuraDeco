import { useState, useEffect } from "react";
import useSiteImages from "../hooks/useSiteImages";
import api from "../services/api";

// Componente helper para renderizar imagen o video automáticamente
const MediaItem = ({ src, alt = "", className = "" }) => {
  if (!src) {
    return (
      <div
        className={`${className} bg-gray-200 animate-pulse flex items-center justify-center`}
      >
        <span className="text-gray-400">📷</span>
      </div>
    );
  }

  const isVideo =
    src.includes("/video/upload/") ||
    src.endsWith(".mp4") ||
    src.endsWith(".webm");

  if (isVideo) {
    return (
      <video className={className} autoPlay loop muted playsInline>
        <source src={src} type="video/mp4" />
        Tu navegador no admite el elemento de video.
      </video>
    );
  }

  return <img src={src} alt={alt} className={className} />;
};

const Banner = () => {
  const { getImageByKey, loading: imagesLoading } = useSiteImages();
  const [bannerConfig, setBannerConfig] = useState(null);
  const [configLoading, setConfigLoading] = useState(true);

  useEffect(() => {
    loadBannerConfig();
  }, []);

  const loadBannerConfig = async () => {
    try {
      const response = await api.get("/site-config/banner");
      if (response.data.success) {
        setBannerConfig(response.data.config);
      }
    } catch (error) {
      console.error("Error al cargar configuración del banner:", error);
      // Usar configuración por defecto si falla
      setBannerConfig({
        globo1: "banner_globo1",
        puff1: "banner_puff1",
        deco1: "banner_deco1",
        globdeco: "banner_video",
        globo2: "banner_globo2",
        deco2: "banner_deco2",
        globo3: "banner_globo3",
      });
    } finally {
      setConfigLoading(false);
    }
  };

  // Mostrar loading mientras cargan las imágenes o la configuración
  if (imagesLoading || configLoading || !bannerConfig) {
    return (
      <div className="relative bg-white min-h-screen w-full flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mb-4"></div>
          <p className="text-gray-600 font-medium">Cargando...</p>
        </div>
      </div>
    );
  }

  // Obtener URLs de Cloudinary según la configuración
  const media = {
    globo1: getImageByKey(bannerConfig.globo1),
    puff1: getImageByKey(bannerConfig.puff1),
    deco1: getImageByKey(bannerConfig.deco1),
    globdeco: getImageByKey(bannerConfig.globdeco),
    globo2: getImageByKey(bannerConfig.globo2),
    deco2: getImageByKey(bannerConfig.deco2),
    globo3: getImageByKey(bannerConfig.globo3),
  };

  return (
    <div className="relative bg-white min-h-screen w-full flex flex-col lg:flex-row">
      <div className="w-full lg:w-1/2 min-h-screen flex flex-col justify-center items-center p-4">
        <h1 className="mt-4 mb-4 tracking-in-expand text-4xl text-6xl lg:text-8xl font-bold tracking-tight text-gray-900 pb-4 lg:pb-8">
          AuraDeco
        </h1>
        <div className="text-center">
          <p className="mt-1 text-base lg:text-xl text-gray-500 p-2">
            🎈Decoración de globos
          </p>
          <p className="mt-1 text-base lg:text-xl text-gray-500 p-2">
            🎈Globos personalizados
          </p>
          <p className="mt-1 text-base lg:text-xl text-gray-500 p-2">
            🎈Arcos de globos
          </p>
          <p className="mt-1 text-base lg:text-xl text-gray-500 p-2">
            🎈Globos con helio
          </p>
          <p className="mt-1 text-base lg:text-xl text-gray-500 p-2">
            🎈Alquiler de candy bar
          </p>
        </div>

        <a
          href="https://api.whatsapp.com/send?phone=5491121621988&text=Hola,%20gracias%20por%20comunicarte."
          target="_blank"
          rel="noopener noreferrer"
          className="m-4 inline-block rounded-md border border-transparent bg-primary-500 px-6 lg:px-8 py-2 lg:py-3 text-center font-medium text-white hover:bg-primary-300"
        >
          Whatsapp
        </a>
      </div>

      <div className="hidden sm:hidden md:hidden lg:block w-full lg:w-1/2 min-h-screen flex flex-col justify-center items-center">
        <div aria-hidden="true" className="pointer-events-none">
          <div className="flex items-center space-x-2 lg:space-x-8">
            {/* Columna 1 */}
            <div className="grid flex-shrink-0 grid-cols-1 gap-y-4 lg:gap-y-8">
              <div className="h-50 lg:h-64 w-32 lg:w-44 overflow-hidden rounded-lg sm:opacity-0 lg:opacity-100">
                <MediaItem
                  src={media.globo1}
                  alt="Decoración con globos"
                  className="h-full w-full object-cover object-center"
                />
              </div>

              <div className="h-50 lg:h-64 w-32 lg:w-44 overflow-hidden rounded-lg">
                <MediaItem
                  src={media.puff1}
                  alt="Puff decorativo"
                  className="h-full w-full object-cover object-center"
                />
              </div>
            </div>

            {/* Columna 2 */}
            <div className="grid flex-shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
              <div className="hidden sm:block h-50 lg:h-64 w-32 lg:w-44 overflow-hidden rounded-lg">
                <MediaItem
                  src={media.deco1}
                  alt="Decoración de eventos"
                  className="h-full w-full object-cover object-center"
                />
              </div>

              <div className="h-50 lg:h-64 w-32 lg:w-44 overflow-hidden rounded-lg">
                <MediaItem
                  src={media.globdeco}
                  alt="Video de decoración con globos"
                  className="h-full w-full object-cover object-center"
                />
              </div>

              <div className="h-50 lg:h-64 w-32 lg:w-44 overflow-hidden rounded-lg">
                <MediaItem
                  src={media.globo2}
                  alt="Globos decorativos"
                  className="h-full w-full object-cover object-center"
                />
              </div>
            </div>

            {/* Columna 3 */}
            <div className="grid flex-shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
              <div className="h-50 lg:h-64 w-32 lg:w-44 overflow-hidden rounded-lg">
                <MediaItem
                  src={media.deco2}
                  alt="Decoración para fiestas"
                  className="h-full w-full object-cover object-center"
                />
              </div>

              <div className="h-50 lg:h-64 w-32 lg:w-44 overflow-hidden rounded-lg">
                <MediaItem
                  src={media.globo3}
                  alt="Arreglo de globos"
                  className="h-full w-full object-cover object-center"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
