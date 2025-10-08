import { NavLink } from "react-router-dom";

import { logo } from "../assets/images";

const Navbar = () => {
  return (
    <header className='bg-black fixed z-10 w-full flex flex-row justify-between content-center items-center text-center p-4'>
      <NavLink to='/'>
        <img src={logo} alt='logo' className='logo object-contain' />
      </NavLink>
      <nav className='flex text-lg gap-7'>
        
        <NavLink to='/about' className={ ({ isActive }) => isActive ? "text-primary-600" : "text-primary-400" }>
          Galería
        </NavLink>
        
        <NavLink to='/contact' className={({ isActive }) => isActive ? "text-primary-600" : "text-primary-400"}>
          Contacto
        </NavLink>

      </nav>
    </header>
  );
};

export default Navbar;