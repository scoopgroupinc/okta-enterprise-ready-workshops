import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Signin from '../pages/auth/signin';
import { useAuthState } from './authState';

export const Home = () => {
  const navigate = useNavigate();
  const { authState } = useAuthState();

  useEffect(() => {
    if (authState.isAuthenticated) {
      navigate('/dashboard');
    }
  }, [authState.isAuthenticated, navigate]);

  // Render method should just return JSX, no side effects like navigation
  if (authState.isAuthenticated) {
    // Render a placeholder or null while waiting for the navigation to happen
    return null;
  } else {
    return (
      <div className="">
        <h1 className="text-5xl text-center my-6">Ready to take on the day?</h1>
        <p className="text-center py-8">
          You won't miss a task with this fantastic Todo app - sign in and get
          tasking!
        </p>
        <Signin />
        {/* {authState.isAuthenticated && (
        <p className="text-center">
          <Link to="/todo" className="underline">
            Where's my todos?
          </Link>
        </p>
      )} */}
      </div>
    );
  }
};

export default Home;
