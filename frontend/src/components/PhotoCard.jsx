const PhotoCard = ({
  title,
  subtitle,
  parrafo,
  imagenPrincipal,
  imagenenSecundariaUno,
  imagenSecundariaDos,
}) => {
  return (
    <main className="w-full min-h-screen flex justify-center items-center pr-8 pl-8 flex-col lg:flex-row py-8">
      <div className=" flex flex-wrap flex-col justify-center content-center items-center lg:pr-20">
        <h1 className="my-4 text-3xl font-semibold text-white">{title}</h1>

        <p className="my-4 text-sm leading-4 font-semibold text-slate-500">
          {subtitle}
        </p>

        <p className="my-4 text-sm font-semibold leading-6 text-slate-400">
          {parrafo}
        </p>
      </div>

      <div className="flex col-start-1 lg:col-span-2  gap-8">
        <div className="flex justify-center content-center flex-wrap">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="lg:w-[350px] lg:h-[740px] w-[200px] h-[500px] object-cover rounded-lg"
            loading="lazy"
          >
            <source src={imagenPrincipal} type="video/mp4" />
            Tu navegador no admite el elemento de video.
          </video>
        </div>

        <div className="flex flex-col space-y-10">
          <img
            src={imagenenSecundariaUno}
            alt=""
            className="lg:w-[350px] lg:h-[350px] w-[200px] h-[230px]  object-cover rounded-lg"
            loading="lazy"
          />
          <img
            src={imagenSecundariaDos}
            alt=""
            className="lg:w-[350px] lg:h-[350px] w-[200px] h-[230px]  object-cover rounded-lg"
            loading="lazy"
          />
        </div>
      </div>
    </main>
  );
};

export default PhotoCard;
