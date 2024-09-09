"use client"; // Esto convierte el componente en un Client Component

import { useEffect, ComponentType, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const withAuth = <P extends object>(WrappedComponent: ComponentType<P>) => {
   return function AuthenticatedComponent(props: P) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true); // Para manejar el estado de carga
    const [hasChecked, setHasChecked] = useState(false); // Para evitar ejecutar varias veces la validación

    useEffect(() => {
      const checkTokenValidity = async () => {
        const localToken = localStorage.getItem('access_token');
        const sessionToken = sessionStorage.getItem('access_token');
        const token = localToken || sessionToken;

        if (!token) {
          // Redirigir al login si no hay token
          router.replace('/auth/login');
          setHasChecked(true);
        } else {
          try {
            // Verificar la validez del token
            const response = await axios.get('http://localhost/authentication/public/auth/validate-token', {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            if (response.status === 200 && response.data.valid) {
              setIsLoading(false); // Si el token es válido, dejamos de cargar
            } else {
              router.replace('/auth/login'); // Redirigir si el token no es válido
            }
          } catch (error) {
            console.error('Token validation failed:', error);
            router.replace('/auth/login'); // Redirigir en caso de error
          } finally {
            setHasChecked(true); // Marcar que la validación se completó
          }
        }
      };

      // Solo ejecutar la validación una vez
      if (!hasChecked) {
        checkTokenValidity();
      }
    }, [router, hasChecked]);

    if (isLoading) {
      return <p>Loading...</p>; // Mostrar estado de carga mientras se verifica el token
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
