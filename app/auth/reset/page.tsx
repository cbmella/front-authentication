"use client"; // Esto convierte el componente en un Client Component

import { useState } from 'react';
import Image from 'next/image';
import axios from 'axios';
import withAuthRedirect from '../../hoc/withAuthRedirect'; // Importar el HOC

function ResetPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setMessage('');

    try {
      const response = await axios.post('http://localhost:8000/auth/password-reset', { email });
      setMessage('Password reset link has been sent to your email.');
    } catch (error) {
      setError('Error requesting password reset. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-96">
        <div className="flex justify-center mb-8">
          <Image src="/placeholder.svg" alt="Logo" width={64} height={64} />
        </div>
        <p className="text-gray-300 text-sm mb-6">
          Forgot your password? No problem. Just let us know your email address and we will email you a password reset link that will allow you to choose a new one.
        </p>
        {message && <p className="text-green-500 text-center mb-4">{message}</p>}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="email" className="block text-gray-300 mb-2">Email</label>
            <input
              type="email"
              id="email"
              className="w-full bg-gray-700 rounded px-3 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white rounded py-2 px-4 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 uppercase text-sm font-semibold"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Email Password Reset Link'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default withAuthRedirect(ResetPassword); // Envolver el componente con el HOC

