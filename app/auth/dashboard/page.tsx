"use client"; // Esto convierte el componente en un Client Component

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation'; // Para redirigir al login
import { ChevronDown, User, LogOut } from 'lucide-react';
import axios from 'axios'; // Para hacer la petición al backend
import withAuth from '../../hoc/withAuth'; // El HOC que verifica la autenticación

function Dashboard() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter(); // Para manejar la redirección

  // Lógica para alternar el dropdown
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  // Función de logout
  const handleLogout = async () => {
    const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');

    if (token) {
      try {
        // Hacemos la petición al backend para cerrar sesión
        await axios.post('http://localhost/authentication/public/auth/logout', {}, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (error) {
        console.error('Error al hacer logout en el backend:', error);
      }
    }

    // Elimina los tokens de localStorage y sessionStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('refresh_token');

    // Redirige al login
    router.push('/auth/login');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <nav className="bg-gray-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Image src="/placeholder.svg" alt="Logo" width={32} height={32} />
            <span className="text-xl font-semibold">Dashboard</span>
          </div>
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="flex items-center space-x-2 focus:outline-none"
            >
              <span>CESAR Bugueno</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-md shadow-lg py-1">
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 flex items-center"
                >
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </a>
                <button
                  onClick={handleLogout}
                  className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 flex items-center w-full text-left"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
      <main className="container mx-auto mt-8 px-4">
        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
        <div className="bg-gray-800 rounded-lg p-6">
          <p className="text-xl">You are logged in!</p>
        </div>
      </main>
    </div>
  );
}

// Protegemos el componente Dashboard con el HOC de autenticación
export default withAuth(Dashboard);
