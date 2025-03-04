import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Redirect } from 'wouter';

const AuthPage: React.FC = () => {
  const { user, loginMutation, registerMutation } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });

  if (user) {
    return <Redirect to="/" />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      loginMutation.mutate({
        username: formData.username,
        password: formData.password
      });
    } else {
      if (formData.password !== formData.confirmPassword) {
        alert("Passwords don't match!");
        return;
      }
      registerMutation.mutate({
        username: formData.username,
        password: formData.password
      });
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-1/2 p-8">
        <h2 className="text-2xl font-bold mb-4">
          {isLogin ? 'Login' : 'Register'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Username</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block mb-1">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full p-2 border rounded"
            />
          </div>
          {!isLogin && (
            <div>
              <label className="block mb-1">Confirm Password</label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                className="w-full p-2 border rounded"
              />
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="mt-4 text-blue-500 hover:underline"
        >
          {isLogin ? 'Need an account? Register' : 'Have an account? Login'}
        </button>
      </div>
      <div className="w-1/2 bg-blue-500 p-8 text-white">
        <h1 className="text-4xl font-bold mb-4">Welcome to BUILDBTECH</h1>
        <p className="text-xl">
          Your all-in-one platform for academic success
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
