// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './app.module.scss';

import { Route, Routes, useLocation } from 'react-router-dom';
import Todo from './pages/todolist';
import { useAuthState } from './components/authState';
import Home from './pages/home';
import Toolbar from './components/toolbar';
import Profile from './pages/profile';
import Feelings from './pages/activity/feelings';
import Values from './pages/activity/values';
import Goals from './pages/activity/goals';
import Journal from './pages/activity/journal';
import Dashboard from './pages/dashboard';
import { useEffect, useState } from 'react';
import Modal from './components/Modal';
import SignUp from './pages/auth/signup';
import ROUTES from '../utils/routes';
import Chat from './pages/activity/chat';

export const App = () => {
  const { userIsAuthenticatedFn, authState } = useAuthState();
  const [modalOpen, setModalOpen] = useState(false);
  const location = useLocation();
  console.log('Current route:', location.pathname);

  useEffect(() => {
    userIsAuthenticatedFn();
  }, [userIsAuthenticatedFn]);

  useEffect(() => {
    if (
      !authState.isAuthenticated &&
      location.pathname !== '/' &&
      location.pathname !== '/signup'
    ) {
      setModalOpen(true);
    } else {
      setModalOpen(false);
    }
  }, [authState, location]);

  return (
    <div className="">
      {location.pathname !== '/' && <Toolbar />}

      <Modal open={modalOpen} />
      <main>
        <Routes>
          <Route path="/chat" element={<Chat />} />
          <Route path={ROUTES.HOME} element={<Home />} />
          <Route path={ROUTES.SIGN_UP} element={<SignUp />} />
          <Route path={ROUTES.TO_DO} element={<Todo />} />
          <Route path={ROUTES.PROFILE} element={<Profile />} />
          <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
          <Route path={ROUTES.VALUES} element={<Values />} />
          <Route path={ROUTES.GOALS} element={<Goals />} />
          <Route path={ROUTES.JOURNAL} element={<Journal />} />
          <Route path={ROUTES.FEELINGS} element={<Feelings />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
