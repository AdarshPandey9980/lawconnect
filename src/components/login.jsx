"use client";
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight, Shield, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const InputField = ({ icon: Icon, ...props }) => (
  <div className="relative group">
    <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-indigo-600 transition-colors" size={20} />
    <input
      className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-600 text-gray-900 placeholder-gray-400 transition-colors"
      {...props}
    />
  </div>
);

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    twoFactorCode: '',
    rememberDevice: false,
    language: 'en'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [show2FA, setShow2FA] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/main';

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (!show2FA) {
        const result = await signIn('credentials', {
          email: formData.email,
          password: formData.password,
          redirect: false,
        });

        if (!result?.error) {
          router.push(callbackUrl);
          router.refresh();
          return;
        }

        if (result.error === 'requires_2fa') {
          setShow2FA(true);
          return;
        }
        
        throw new Error(result.error);
      }

      const verify2FA = await fetch('/api/verify-2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: formData.twoFactorCode,
          rememberDevice: formData.rememberDevice
        }),
      });

      if (!verify2FA.ok) {
        throw new Error('Invalid 2FA code');
      }

      router.push(callbackUrl);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-pink-50 to-indigo-50">
      <div className="hidden lg:flex lg:w-2/3 relative overflow-hidden">
        <img
          src="/images/s.jpg"
          alt="Legal Background"
          className="w-full h-screen object-cover"
        />
        <div className="absolute inset-0 " />
      </div>

      <div className="w-full lg:w-1/3 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="bg-white p-8 rounded-3xl shadow-xl space-y-8">
            <motion.div className="text-center space-y-2">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
                Welcome to LawConnect
              </h1>
              <p className="text-gray-600">
                Secure legal collaboration platform
              </p>
            </motion.div>

            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl flex items-center"
                >
                  <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                  <p className="text-sm">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-6">
              <AnimatePresence mode="wait">
                {!show2FA ? (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-4"
                  >
                    <InputField
                      icon={Mail}
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Email Address"
                      required
                    />
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-indigo-600 transition-colors" size={20} />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full pl-12 pr-12 py-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-600 text-gray-900 placeholder-gray-400 transition-colors"
                        placeholder="Password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600 transition-colors"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <InputField
                      icon={Shield}
                      type="text"
                      name="twoFactorCode"
                      value={formData.twoFactorCode}
                      onChange={handleChange}
                      placeholder="Enter 2FA Code"
                      required
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    name="rememberDevice"
                    checked={formData.rememberDevice}
                    onChange={handleChange}
                    className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                    {show2FA ? 'Trust this device' : 'Remember me'}
                  </span>
                </label>
                {!show2FA && (
                  <Link
                    href="/forgot-password"
                    className="text-sm text-indigo-600 hover:text-indigo-500 transition-colors"
                  >
                    Forgot Password?
                  </Link>
                )}
              </div>

              <div className="relative">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                <select
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-600 text-gray-900 appearance-none"
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                </select>
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-indigo-600 to-pink-600 text-white py-4 rounded-xl flex items-center justify-center space-x-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                <span>{loading ? 'Processing...' : show2FA ? 'Verify' : 'Sign In'}</span>
                {!loading && <ArrowRight size={20} />}
              </motion.button>
            </form>

            <div className="text-center space-y-4">
              <p className="text-gray-600">
                New to LawConnect?{' '}
                <Link href="/register" className="text-indigo-600 hover:text-indigo-500 font-medium transition-colors">
                  Create an account
                </Link>
              </p>
              <p className="text-xs text-gray-500">
                By signing in, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;