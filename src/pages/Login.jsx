import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

const schema = yup.object().shape({
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
});

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await authAPI.login(data.username, data.password);
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="card max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-full mb-4">
            <span className="text-3xl">🌿</span>
          </div>
          <h1 className="text-lg sm:text-2xl font-normal text-slate-900 dark:text-slate-100 mb-1 sm:mb-2">
            Cardamom Dry Center
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Management System
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="username" className="label">
              Username
            </label>
            <input
              id="username"
              type="text"
              {...register('username')}
              className="input-field"
              placeholder="Enter your username"
            />
            {errors.username && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                {errors.username.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="label">
              Password
            </label>
            <input
              id="password"
              type="password"
              {...register('password')}
              className="input-field"
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm sm:text-base"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 bg-slate-100 dark:bg-slate-700 rounded-lg">
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Demo Credentials:
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Username: <span className="font-medium">admin</span>
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Password: <span className="font-medium">admin123</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

