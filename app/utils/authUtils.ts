export function handleAuthSuccess({
  accessToken,
  refreshToken,
  rememberMe,
  router,
  redirectPath = '/auth/dashboard',
}: {
  accessToken: string;
  refreshToken: string;
  rememberMe: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  router: any; // TypeScript inferirá el tipo correcto
  redirectPath?: string;
}) {
  // Almacenar los tokens en el almacenamiento adecuado
  if (rememberMe) {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
  } else {
    sessionStorage.setItem('access_token', accessToken);
    sessionStorage.setItem('refresh_token', refreshToken);
  }

  // Redirigir al dashboard o cualquier otra ruta
  router.push(redirectPath);
}
