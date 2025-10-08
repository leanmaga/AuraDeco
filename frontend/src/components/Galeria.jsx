const Galeria = ({
  img1,
  img2,
  img3,
  img4,
  titulo1,
  titulo2,
  titulo3,
  titulo4,
  red1,
  red2,
  red3,
  red4,
}) => {
  return (
    <div className="w-full bg-white flex justify-center items-center">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="sr-only">Products</h2>

        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          <a
            className="group"
            target="_blank"
            rel="noopener noreferrer"
            href={red1}
          >
            <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
              <img
                src={img1}
                alt="Tall slender porcelain bottle with natural clay textured body and cork stopper."
                className="h-full w-full object-cover object-center group-hover:opacity-75"
              />
            </div>
            <h3 className="mt-4 text-sm text-gray-700">{titulo1}</h3>
          </a>
          <a
            className="group"
            target="_blank"
            rel="noopener noreferrer"
            href={red2}
          >
            <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
              <img
                src={img2}
                alt="Olive drab green insulated bottle with flared screw lid and flat top."
                className="h-full w-full object-cover object-center group-hover:opacity-75"
              />
            </div>
            <h3 className="mt-4 text-sm text-gray-700">{titulo2}</h3>
          </a>
          <a
            className="group"
            target="_blank"
            rel="noopener noreferrer"
            href={red3}
          >
            <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
              <img
                src={img3}
                alt="Person using a pen to cross a task off a productivity paper card."
                className="h-full w-full object-cover object-center group-hover:opacity-75"
              />
            </div>
            <h3 className="mt-4 text-sm text-gray-700">{titulo3}</h3>
          </a>
          <a
            className="group"
            target="_blank"
            rel="noopener noreferrer"
            href={red4}
          >
            <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
              <img
                src={img4}
                alt="Hand holding black machined steel mechanical pencil with brass tip and top."
                className="h-full w-full object-cover object-center group-hover:opacity-75"
              />
            </div>
            <h3 className="mt-4 text-sm text-gray-700">{titulo4}</h3>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Galeria;
