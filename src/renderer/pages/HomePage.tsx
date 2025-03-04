import React from 'react';
import { Link } from 'wouter';
import { useAuth } from '../hooks/useAuth';

const HomePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome, {user?.username}!</h1>
        <p className="text-xl text-gray-600">
          Access your academic tools and resources
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/lab-reports">
          <a className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-bold mb-2">Lab Reports</h3>
            <p className="text-gray-600">Generate and manage your lab reports</p>
          </a>
        </Link>

        <Link href="/project-ideas">
          <a className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-bold mb-2">Project Ideas</h3>
            <p className="text-gray-600">Get AI-powered project suggestions</p>
          </a>
        </Link>

        <Link href="/exam-prep">
          <a className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-bold mb-2">Exam Prep</h3>
            <p className="text-gray-600">Study materials and practice tests</p>
          </a>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
