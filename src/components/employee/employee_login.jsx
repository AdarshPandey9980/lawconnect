"use client";
import React, { useState } from 'react';
import { User, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Custom Alert Component
const Alert = ({ children, variant }) => {
  const baseStyles = "p-4 mb-4 rounded-md";
  const variantStyles = {
    destructive: "bg-red-100 text-red-700 border border-red-400",
    default: "bg-blue-100 text-blue-700 border border-blue-400"
  };

  return (
    <div className={`${baseStyles} ${variantStyles[variant || 'default']}`}>
      {children}
    </div>
  );
};

// Static user credentials
const VALID_CREDENTIALS = [
  { username: 'parth', password: 'parthsawant1298', name: 'parth' },
  { username: 'aryan', password: 'aryan1298', name: 'aryan' },
  { username: 'kunal', password: 'kunal1298', name: 'Kunal' }
];

const LoginForm = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = VALID_CREDENTIALS.find(
      (cred) => cred.username === username && cred.password === password
    );

    if (user) {
      // Store user info in sessionStorage
      sessionStorage.setItem('currentUser', JSON.stringify(user));
      // Redirect to employee page
      router.push('/employee_page');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-8">
          Employee Login
        </h1>
        
        {error && (
          <Alert variant="destructive">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Username"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;