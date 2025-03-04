import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Route, Redirect } from 'wouter';

interface ProtectedRouteProps {
  component: React.FC;
  path: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ component: Component, path }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Route path={path}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </Route>
    );
  }

  return (
    <Route path={path}>
      {user ? <Component /> : <Redirect to="/auth" />}
    </Route>
  );
};

export default ProtectedRoute;
