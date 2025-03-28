'use client';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-r from-brown-600 via-brown-500 to-brown-700 text-white p-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-red-500 mb-6 animate-pulse">Sobre Nosotros</h1>
        <p className="text-xl text-black font-medium leading-relaxed">
          Somos un grupo de estudiantes del curso Soy Henry, apasionados por la programación y comprometidos con la creación de una plataforma fitness innovadora.
        </p>
      </div>

      {/* Team Section */}
      <div className="w-full max-w-4xl text-center mb-16 flex-grow">
        <h2 className="text-4xl font-semibold text-red-500 mb-8">Nuestro Equipo</h2>
        <p className="text-lg text-black mb-6">
          Nuestro equipo está compuesto por personas dedicadas tanto al <span className="text-blue-400">Front-End</span> como al <span className="text-green-400">Back-End</span>.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300">
            <h3 className="text-xl font-bold text-black mb-2">Karen Casallas</h3>
            <p className="text-black">Front-End</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300">
            <h3 className="text-xl font-bold text-black mb-2">Salvador Velázquez</h3>
            <p className="text-black">Front-End</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300">
            <h3 className="text-xl font-bold text-black mb-2">Renzo Jiménez</h3>
            <p className="text-black">Back-End</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300">
            <h3 className="text-xl font-bold text-black mb-2">Marcos Murphy</h3>
            <p className="text-black">Front-End</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300">
            <h3 className="text-xl font-bold text-black mb-2">Omar Águila</h3>
            <p className="text-black">Back-End</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300">
            <h3 className="text-xl font-bold text-black mb-2">Zanela Ornelas</h3>
            <p className="text-black">Front-End</p>
          </div>
          
        </div>
      </div>

      {/* Project Section */}
      <div className="text-center mb-16 flex-grow">
        <h2 className="text-4xl font-semibold text-red-500 mb-8">Nuestro Proyecto</h2>
        <p className="text-xl text-black mb-6">
          Este es nuestro proyecto final, una página fitness que busca ayudarte a llevar un estilo de vida más saludable mediante un contador de calorías y agua, registro de comidas y un blog de recetas.
        </p>
        <p className="text-xl text-black mb-8">
          Nuestro objetivo es crear una plataforma donde puedas monitorear tus hábitos alimenticios y de consumo de agua, estableciendo metas personalizadas para alcanzar tus objetivos de bienestar.
        </p>
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8 hover:shadow-2xl transition-all duration-300">
          <h3 className="text-2xl font-semibold text-red-500 mb-4">Funcionalidades</h3>
          <ul className="list-disc pl-6 text-lg text-black space-y-2">
            <li>Contabilizar calorías y agua consumidas diariamente.</li>
            <li>Establecer metas de consumo de agua según el peso.</li>
            <li>Registrar comidas y recetas en un diario de comidas.</li>
          </ul>
        </div>
      </div>

      {/* Closing Statement */}
      <div className="w-full text-center text-lg text-black mb-16">
        <p>Este es un espacio para compartir y descubrir recetas de todo el mundo, conectar con otros usuarios, y mantenerte motivado en tu camino hacia una vida más saludable.</p>
        <p className="mt-4 font-bold">¡Únete a nuestra comunidad y empieza a transformar tu bienestar hoy mismo!</p>
      </div>

      {/* Footer */}
      <div className="w-full text-center text-sm text-black mt-auto py-4">
        <p>&copy; 2025 Nuestro Proyecto Fitness | Todos los derechos reservados</p>
      </div>
    </div>
  );
}
