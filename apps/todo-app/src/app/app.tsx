// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './app.module.scss';

import { Route, Routes, useLocation } from 'react-router-dom';
import Todo from './components/todolist';
import { useAuthState } from './components/authState';
import Home from './components/home';
import Toolbar from './components/toolbar';
import Profile from './components/profile';
import Feelings from './pages/activity/feelings';
import Values from './pages/activity/values';
import Goals from './pages/activity/goals';
import Journal from './pages/activity/journal';
import Dashboard from './pages/dashboard';
import { useEffect, useState } from 'react';
import Modal from './components/Modal';

export const App = () => {
  const { userIsAuthenticatedFn, authState } = useAuthState();
  const [modalOpen, setModalOpen] = useState(false);
  const location = useLocation();
  console.log('Current route:', location.pathname);

  useEffect(() => {
    userIsAuthenticatedFn();
  }, [userIsAuthenticatedFn]);

  useEffect(() => {
    if (!authState.isAuthenticated && location.pathname !== '/') {
      setModalOpen(true);
    } else {
      setModalOpen(false);
    }
  }, [authState, location]);

  return (
    <div className="">
      <Toolbar />
      <Modal open={modalOpen} />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/todo" element={<Todo />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/values" element={<Values />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/feelings" element={<Feelings />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
