// src/pages/Login.tsx
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

export default function Login() {
  const { register, handleSubmit } = useForm();
  const setAuth = useAuthStore((s) => s.setAuth);

  const onSubmit = async (data: any) => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', data);
      setAuth(res.data.token, res.data.user);
    } catch (err) {
      alert('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-100 to-indigo-200 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Engineering Resource Login</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium">Email</label>
            <input
              {...register('email')}
              type="email"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
              placeholder="john@example.com"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Password</label>
            <input
              {...register('password')}
              type="password"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
              placeholder="Enter password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
