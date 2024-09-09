"use client"; // Esto convierte el HOC en un Client Component

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ComponentType } from 'react'; // Importamos ComponentType para manejar tipos genéricos

// Definir el HOC con genéricos para no usar `any`
const withAuthRedirect = <P extends object>(WrappedComponent: ComponentType<P>) => {
  return function AuthRedirectWrapper(props: P) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const localToken = localStorage.getItem('access_token');
      const sessionToken = sessionStorage.getItem('access_token');

      // Si ya hay un token, redirigimos al dashboard
      if (localToken || sessionToken) {
        router.push('/auth/dashboard');
      } else {
        setIsLoading(false); // Si no hay token, permitimos que el componente se muestre
      }
    }, [router]);

    if (isLoading) {
      return <p className="text-center text-white">Cargando...</p>; // Mostrar un estado de carga
    }

    return <WrappedComponent {...props} />; // Renderizamos el componente envuelto con las props tipadas
  };
};

export default withAuthRedirect;
