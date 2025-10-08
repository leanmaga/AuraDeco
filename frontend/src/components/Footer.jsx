const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white p-4">
      <div className="container mx-auto">
        <div className="flex flex-col p-2 justify-between items-center md:flex-row lg:flex-row">
          <div className="p-4">
            <p className="text-lg font-semibold">Glob.deco</p>
            <p className="text-sm">Gonzalez Catan, Buenos Aires Argentina</p>
            <a
              className="text-sm"
              href="https://api.whatsapp.com/send?phone=5491121621988&text=Hola,%20gracias%20por%20comunicarte."
              target="_blank"
              rel="noopener noreferrer"
            >
              +54 9 11 2162-1988
            </a>
          </div>

          <div className="p-4">
            <ul className="flex space-x-4">
              <p className="text-[10px] md:text-sm ">
                &copy; 2024{" "}
                <a
                  href="https://patagoniascript.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  PatagoniaScript
                </a>
                . Todos los derechos reservados.
              </p>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
