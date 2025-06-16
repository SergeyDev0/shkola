import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  // Здесь должна быть ваша логика проверки авторизации
  // Например, проверка токена в localStorage
  const isAuthenticated = localStorage.getItem('token');

  return isAuthenticated ? children : <Navigate to="/auth" replace />;
};

export default PrivateRoute;
