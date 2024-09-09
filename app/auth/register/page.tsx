"use client"; // Esto convierte el componente en un Client Component

import { useState } from 'react';
import axios, { AxiosError } from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import withAuthRedirect from '../../hoc/withAuthRedirect';
import { handleAuthSuccess } from '../../utils/authUtils'; // Importar la función utilitaria

function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      setIsSubmitting(true); // Comienza el estado de carga
      const response = await axios.post('http://localhost/authentication/public/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.confirmPassword
      });

      const { access_token, refresh_token } = response.data;

      // Reutilizamos la lógica de almacenamiento y redirección
      handleAuthSuccess({
        accessToken: access_token,
        refreshToken: refresh_token,
        rememberMe: true, // Asumimos que quiere ser recordado al registrarse
        router,
      });

    } catch (err: unknown) {
      setIsSubmitting(false); // Detener la carga si hay un error
      if (err instanceof AxiosError) {
        setError('Error al registrarse: ' + (err.response?.data?.message || 'Error desconocido'));
      } else {
        setError('Error desconocido al registrarse');
      }
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-96">
        <div className="flex justify-center mb-8">
          <Image src="/placeholder.svg" alt="Logo" width={64} height={64} />
        </div>
        <form onSubmit={handleSubmit}>
          {error && <p className="text-red-500 text-center">{error}</p>}
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-300 mb-2">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              className="w-full bg-gray-700 rounded px-3 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-300 mb-2">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full bg-gray-700 rounded px-3 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-300 mb-2">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full bg-gray-700 rounded px-3 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-gray-300 mb-2">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className="w-full bg-gray-700 rounded px-3 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex items-center justify-between mb-6">
            <a href="#" className="text-blue-400 text-sm hover:underline">Already registered?</a>
            <button
              type="submit"
              className="bg-blue-500 text-white rounded py-2 px-4 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Registering...' : 'REGISTER'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default withAuthRedirect(Register);
