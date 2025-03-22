import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from "@fortawesome/free-solid-svg-icons/faBars";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

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
          <li><a href="/dashboard/admin" className="block p-2 pl-4 hover:bg-[#e1cc96eb] rounded">Inicio</a></li>
          <li><a href="/dashboard/admin/users" className="block p-2 pl-4 hover:bg-[#e1cc96eb] rounded">Usuarios</a></li>
          <li><a href="/dashboard/admin/payments" className="block p-2 pl-4 hover:bg-[#e1cc96eb] rounded">Transacciones</a></li>
          <li><a href="#" className="block p-2 pl-4 hover:bg-[#e1cc96eb] rounded">Publicaciones</a></li>
        </ul>
      </div>
    </>
  );
};

export default Sidebar;