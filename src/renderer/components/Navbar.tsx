import React from 'react';
import { Link } from 'wouter';
import { useAuth } from '../hooks/useAuth';

const Navbar: React.FC = () => {
  const { user, logoutMutation } = useAuth();

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/">
            <a className="text-xl font-bold text-gray-800">BUILDBTECH</a>
          </Link>

          {user ? (
            <div className="flex items-center space-x-4">
              <Link href="/lab-reports">
                <a className="text-gray-600 hover:text-gray-800">Lab Reports</a>
              </Link>
              <Link href="/project-ideas">
                <a className="text-gray-600 hover:text-gray-800">Project Ideas</a>
              </Link>
              <Link href="/exam-prep">
                <a className="text-gray-600 hover:text-gray-800">Exam Prep</a>
              </Link>
              <Link href="/chat">
                <a className="text-gray-600 hover:text-gray-800">AI Chat</a>
              </Link>
              <button
                onClick={() => logoutMutation.mutate()}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link href="/auth">
              <a className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Login
              </a>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;