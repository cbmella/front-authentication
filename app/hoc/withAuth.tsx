"use client"; // Esto convierte el componente en un Client Component

import { useEffect, ComponentType, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { UserData } from '../types/UserData';


const withAuth = <P extends object>(WrappedComponent: ComponentType<P>) => {
  return function AuthenticatedComponent(props: P) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [hasChecked, setHasChecked] = useState(false);

    useEffect(() => {
      const checkTokenValidity = async (): Promise<void> => {
        const localToken = localStorage.getItem('access_token');
        const sessionToken = sessionStorage.getItem('access_token');
        const token = localToken || sessionToken;

        // Si no hay token, redirigir inmediatamente
        if (!token) {
          router.replace('/auth/login');
          return; // Detener ejecución
        }

        try {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/validate-token`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.status === 200 && response.data.valid) {
            setIsLoading(false); // Token válido, desactivar loading
            setUserData(response.data.user);
          } else {
            // Token inválido, limpiar almacenamiento y redirigir
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            sessionStorage.removeItem('access_token');
            sessionStorage.removeItem('refresh_token');
            router.replace('/auth/login');
          }
        } catch (error) {
          console.error('Token validation failed:', error);
          // En caso de error, limpiar almacenamiento y redirigir
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          sessionStorage.removeItem('access_token');
          sessionStorage.removeItem('refresh_token');
          router.replace('/auth/login');
        } finally {
          setHasChecked(true); // Marcar que la validación se completó
        }
      };

      if (!hasChecked) {
        checkTokenValidity();
      }
    }, [router, hasChecked]);

    if (isLoading) {
      return <p>Loading...</p>; // Mostrar mientras se verifica el token
    }

    return <WrappedComponent {...props} user={userData} />; // Pasar los datos del usuario como prop
  };
};

export default withAuth;
