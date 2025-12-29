import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './auth';

interface Props {
  allowedRoles: string[];
  children: React.ReactElement;
}

export const ProtectedRoute = ({ allowedRoles, children }: Props) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user || !allowedRoles.includes(user.role)) {
    // Redirect unauthorized users to home
    return <Navigate to="/" replace />;
  }

  return children;
};
