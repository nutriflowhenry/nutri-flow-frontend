'use client';

export default function ContactPage() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-r from-brown-600 via-brown-500 to-brown-700 text-white p-6">
      <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-lg border border-red-600">
        <h2 className="text-4xl font-extrabold text-red-500 mb-4 animate-pulse">¡Contáctanos!</h2>
        <p className="text-lg text-gray-700 mb-2">Puedes copiarnos el correo o hacer clic en el botón para enviarnos un mensaje.</p>
        <p className="text-lg font-semibold text-gray-900 mb-4 select-all">nutriflowhenry@gmail.com</p>
        <a
          href="mailto:nutriflowhenry@gmail.com"
          className="bg-red-600 text-white text-xl font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-red-700 transition-all duration-300"
        >
          📧 Enviar correo
        </a>
      </div>
    </div>
  );
}
