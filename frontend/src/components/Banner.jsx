import { deco1, deco2, globo1, globo2, globo3, puff1 } from "../assets/images";
import globdeco from "../assets/globdeco.mp4";

const Banner = () => {
  return (
    <div className="relative bg-white min-h-screen w-full flex flex-col lg:flex-row">
      <div className="w-full lg:w-1/2 min-h-screen flex flex-col justify-center items-center p-4">
        <h1 className="mt-4 mb-4 tracking-in-expand text-4xl text-6xl lg:text-8xl font-bold tracking-tight text-gray-900 pb-4 lg:pb-8">
          Glob.deco
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
            <div className="grid flex-shrink-0 grid-cols-1 gap-y-4 lg:gap-y-8">
              <div className="h-50 lg:h-64  w-32 lg:w-44 overflow-hidden rounded-lg sm:opacity-0 lg:opacity-100">
                <img
                  src={globo1}
                  alt=""
                  className="h-full w-full object-cover object-center"
                />
              </div>

              <div className="h-50 lg:h-64  w-32 lg:w-44 overflow-hidden rounded-lg">
                <img
                  src={puff1}
                  alt=""
                  className="h-full w-full object-cover object-center"
                />
              </div>
            </div>

            <div className="grid flex-shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
              <div className="hidden sm:block h-50 lg:h-64 w-32 lg:w-44 overflow-hidden rounded-lg">
                <img
                  src={deco1}
                  alt=""
                  className="h-full w-full object-cover object-center"
                />
              </div>

              <div className="h-50 lg:h-64  w-32 lg:w-44 overflow-hidden rounded-lg">
                <video width="640" height="360" autoPlay loop muted playsInline>
                  <source src={globdeco} type="video/mp4" />
                  Tu navegador no admite el elemento de video.
                </video>
              </div>

              <div className="h-50 lg:h-64  w-32 lg:w-44 overflow-hidden rounded-lg">
                <img
                  src={globo2}
                  alt=""
                  className="h-full w-full object-cover object-center"
                />
              </div>
            </div>

            <div className="grid flex-shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
              <div className="h-50 lg:h-64  w-32 lg:w-44 overflow-hidden rounded-lg">
                <img
                  src={deco2}
                  alt=""
                  className="h-full w-full object-cover object-center"
                />
              </div>

              <div className="h-50 lg:h-64  w-32 lg:w-44 overflow-hidden rounded-lg">
                <img
                  src={globo3}
                  alt=""
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
