import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from "@fortawesome/free-solid-svg-icons/faBars";
import { faBlog, faHouse, faMoneyCheckDollar, faPowerOff, faStar, faUser, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "@/context/AuthContext";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {logout} = useAuth();
  return (
    <>
      {/* Botón para abrir el menú */}
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="absolute top-4 left-4 mb-6 z-50 p-2 rounded-md"
      >
        {isOpen ? <FontAwesomeIcon icon={faXmark}/> : <FontAwesomeIcon icon={faBars} className="text-black "/>}
      </button>

      {/* Menú lateral */}
      <div 
        className={`fixed top-0 left-0 h-full w-60 bg-[#86847feb] text-white shadow-lg z-10 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300`}
      >
        <ul className="pt-28 space-y-4">
          <li><a href="/dashboard/admin" className="block p-2 pl-4 hover:bg-[#e1cc96eb] rounded"><FontAwesomeIcon icon={faHouse} className="text-1xl text-[#faf9f8dc] mr-2"/>Inicio</a></li>
          <li><a href="/dashboard/admin/users" className="block p-2 pl-4 hover:bg-[#e1cc96eb] rounded"><FontAwesomeIcon icon={faUser} className="text-1xl text-[#faf9f8dc] mr-2" />Usuarios</a></li>
          <li><a href="/dashboard/admin/payments" className="block p-2 pl-4 hover:bg-[#e1cc96eb] rounded"><FontAwesomeIcon icon={faMoneyCheckDollar} className="text-1xl text-[#faf9f8dc] mr-2" />Transacciones</a></li>
          <li><a href="/dashboard/admin/post" className="block p-2 pl-4 hover:bg-[#e1cc96eb] rounded"><FontAwesomeIcon icon={faBlog} className="text-1xl text-[#faf9f8dc] mr-2" />Publicaciones</a></li>
          <li><a href="/dashboard/admin/reviews" className="block p-2 pl-4 hover:bg-[#e1cc96eb] rounded"><FontAwesomeIcon icon={faStar} className="text-1xl text-[#faf9f8dc] mr-2" />Reseñas</a></li>
          <li><a onClick={logout} className="block p-2 pl-4 hover:bg-[#e1cc96eb] rounded cursor-pointer"><FontAwesomeIcon icon={faPowerOff} className="text-1xl text-[#faf9f8dc] mr-2" />Cerrar sesion</a></li>
        </ul>
      </div>
    </>
  );
};

export default Sidebar;