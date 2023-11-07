import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Signin from './auth/signin';
import { useAuthState } from '../components/authState';
import FacetsLogoWithText from '../components/FacetsLogoWithText';
import ROUTES from '../../utils/routes';

export const Home = () => {
  const navigate = useNavigate();
  const { authState } = useAuthState();

  useEffect(() => {
    console.log('authState.isAuthenticated', authState.isAuthenticated);
    if (authState.isAuthenticated) {
      console.log('navigate to dashboard');
      navigate(ROUTES.DASHBOARD);
    }
  }, [authState.isAuthenticated, navigate]);

  // Render method should just return JSX, no side effects like navigation
  if (authState.isAuthenticated) {
    // Render a placeholder or null while waiting for the navigation to happen
    return null;
  } else {
    return (
      <div className="">
        <div className="flex justify-center mt-[10%]">
          <FacetsLogoWithText width={100} />
        </div>
        <p className="text-center py-8">
          Easy bits of wellness at your fingertips.
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
