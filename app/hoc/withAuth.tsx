"use client"; // Esto convierte el componente en un Client Component

import { useEffect, ComponentType } from 'react';
import { useRouter } from 'next/navigation';

const withAuth = <T extends Record<string, unknown>>(WrappedComponent: ComponentType<T>) => {
  return function AuthenticatedComponent(props: T) {
    const router = useRouter();

    useEffect(() => {
      const localToken = localStorage.getItem('access_token');
      const sessionToken = sessionStorage.getItem('access_token');

      if (!localToken && !sessionToken) {
        router.push('/auth/login');
      }
    }, [router]);

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;

