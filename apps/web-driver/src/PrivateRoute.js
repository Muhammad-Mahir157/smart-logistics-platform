import React, { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getUserInfo } from './api';

const PrivateRoute = () => {
  const [loading, setLoading] = useState(true);
  const [authState, setAuthState] = useState({
    token: '',
    isAuthenticated: false,
    user: null
  });


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const getUser = async () => {
        setLoading(true);
        await getUserInfo()
          .then((response) => {
            localStorage.setItem('driverId', response.data._id);
            setAuthState({
              token: localStorage.getItem('token'),
              isAuthenticated: true,
              user: response.data
            });
          })
          .catch((error) => {
            console.error(error);
            setAuthState({
              token: '',
              isAuthenticated: false,
              user: null
            });
            localStorage.removeItem('token');
            localStorage.removeItem('driverId');
          });
          setLoading(false);
      }

      getUser();
    } else {
      setAuthState({
        token: '',
        isAuthenticated: false,
        user: null
      });
      localStorage.removeItem('driverId');
      setLoading(false);
    }
  }, []);

  return (
    <>
    {!loading && (
    authState.isAuthenticated ? <Outlet /> : <Navigate to="/login" />
    )}
    </>
  )
};

export default PrivateRoute;
