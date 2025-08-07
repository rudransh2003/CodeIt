import React, { useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserContext } from '../context/user.context';

const UserAuth = ({ children }) => {
  const { user, loading } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      // Save the current location so we can redirect back after login
      navigate('/login', { 
        state: { from: location.pathname },
        replace: true 
      });
    }
  }, [user, loading, navigate, location.pathname]);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  // Don't render children if user is not authenticated
  if (!user) {
    return null;
  }

  return <>{children}</>;
};

export default UserAuth;