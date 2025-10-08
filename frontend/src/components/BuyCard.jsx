const BuyCard = ({ imagen }) => {
  return (
    <div className="flex flex-wrap justify-center content-center items-center w-full gap-6">
      <div className="flex items-center p-4">
        <img
          src={imagen}
          alt="aro de globos celestes,grises y blancos"
          className="object-cover rounded-lg lg:w-[275px] lg:h-[445px] w-[150px] h-[245px]"
          loading="lazy"
        />
      </div>

      <form className="flex flex-col justify-center items-center col-span-1">
        <div className="flex flex-wrap justify-between text-justify gap-4">
          <h1 className="my-4 flex text-white text-start sm:text-2xl">
            Aro de Globos
            <span>
              <button
                className="flex items-center justify-center w-9 h-9 rounded-full text-violet-600 bg-violet-50 hover:scale-50 focus:scale-150 hover:text-primary-500"
                type="button"
                aria-label="Like"
              >
                <svg
                  width="20"
                  height="20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                  />
                </svg>
              </button>
            </span>
          </h1>
        </div>

        <div className="flex justify-center content-center items-center font-medium">
          <div className="flex flex-col justify-center content-center gap-4">
            <a
              href="https://www.instagram.com/glob.deco/?hl=es"
              target="_blank"
              rel="noopener noreferrer"
              className="w-32 flex justify-center text-center items-center h-8 font-semibold rounded-full bg-secondary-600 text-white hover:bg-secondary-400"
              type="button"
            >
              Galería
            </a>

            <a
              href="https://api.whatsapp.com/send?phone=5491121621988&text=Hola,%20gracias%20por%20comunicarte."
              target="_blank"
              rel="noopener noreferrer"
              className="w-32 flex justify-center text-center items-center h-8 font-semibold rounded-full border border-secondary-600 text-white hover:bg-secondary-400"
              type="button"
            >
              Pedí el tuyo
            </a>
          </div>
        </div>
      </form>
    </div>
  );
};

export default BuyCard;
