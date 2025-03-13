import Link from 'next/link';

export default function NotFound() {
return (
    <div
    className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center"
    style={{ backgroundImage: "url('/your-background-image.jpg')" }}
    >
    <div className="bg-black bg-opacity-80 text-red-500 p-10 rounded-lg shadow-lg text-center">
        <h2 className="text-4xl font-bold mb-4">404 - Not Found</h2>
        <p className="text-lg mb-6">No se pudo encontrar el recurso solicitado.</p>
        <Link
        href="/"
        className="bg-red-600 hover:bg-red-700 text-black font-bold py-2 px-6 rounded-lg transition duration-300"
        >
        Volver al inicio
        </Link>
    </div>
    </div>
);
}