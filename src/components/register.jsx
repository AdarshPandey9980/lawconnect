"use client";
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight, User } from 'lucide-react';
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

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const validatePassword = (pass) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(pass);
    const hasLowerCase = /[a-z]/.test(pass);
    const hasNumbers = /\d/.test(pass);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(pass);
    return pass.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
  };

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
    const { name, email, password, confirmPassword, acceptTerms } = formData;

    if (!name || !email || !password || !confirmPassword) {
      setError('All fields are required');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!validatePassword(password)) {
      setError('Password must be at least 8 characters long and contain uppercase, lowercase, numbers, and special characters');
      return;
    }
    if (!acceptTerms) {
      setError('Please accept the terms and conditions');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message);
      }

      router.push('/login');
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-pink-50 to-indigo-50">
      <div className="w-full lg:w-1/3 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="bg-white p-8 rounded-3xl shadow-xl space-y-8">
            <motion.div className="text-center space-y-2">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
                Create Account
              </h1>
              <p className="text-gray-600">
                Join our legal collaboration platform
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
              <div className="space-y-4">
                <InputField
                  icon={User}
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                  required
                />
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
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-indigo-600 transition-colors" size={20} />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full pl-12 pr-12 py-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-600 text-gray-900 placeholder-gray-400 transition-colors"
                    placeholder="Confirm Password"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="acceptTerms"
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="acceptTerms" className="ml-2 text-sm text-gray-600">
                  I accept the{' '}
                  <Link href="/terms" className="text-indigo-600 hover:text-indigo-500">
                    Terms and Conditions
                  </Link>
                </label>
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-indigo-600 to-pink-600 text-white py-4 rounded-xl flex items-center justify-center space-x-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                <span>{loading ? 'Creating Account...' : 'Create Account'}</span>
                {!loading && <ArrowRight size={20} />}
              </motion.button>
            </form>

            <div className="text-center space-y-4">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link href="/login" className="text-indigo-600 hover:text-indigo-500 font-medium transition-colors">
                  Sign in
                </Link>
              </p>
              <p className="text-xs text-gray-500">
                By creating an account, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="hidden lg:flex lg:w-2/3 relative overflow-hidden">
        <img
          src="/images/k.jpg"
          alt="Legal Background"
          className="w-full h-screen object-cover"
        />
        <div className="absolute inset-0" />
      </div>
    </div>
  );
};

export default RegisterPage;