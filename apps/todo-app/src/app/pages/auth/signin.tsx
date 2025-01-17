import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from '../../components/authState';
import ROUTES from 'apps/todo-app/src/utils/routes';

export const Signin = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [hidePassword, setHidePassword] = useState<boolean>(true);

  const { onAuthenticateFn, onUsernameEnteredFn } = useAuthState();
  const navigate = useNavigate();

  const onAuthenticate = async () => {
    const signIn = async () => {
      console.log('signin ', username, password);
      // When user enters just the email but no password. check if the user is part of an org
      if (username && !password) {
        console.log('username entered but no password', username);
        const org_id = await onUsernameEnteredFn(username);
        console.log(org_id);
        if (org_id) {
          window.location.assign(
            `http://localhost:3333/openid/start/${org_id}`
          );
          return;
        } else {
          setHidePassword(false);
          // enable sign in with auth0
          return;
        }
      }
      if (username && password) {
        await onAuthenticateFn(username, password);
      }
      setUsername('');
      setPassword('');
    };
    signIn();
  };

  return (
    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <div className="mb-6">
        <label
          htmlFor="email"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="w-full text-slate-900 placeholder-slate-400 rounded-md py-2 pl-2 ring-1 ring-slate-200"
          value={username}
          onChange={(event) => setUsername(event.currentTarget.value)}
        />
      </div>

      <div id="password-field" className="mb-6" hidden={hidePassword}>
        <label
          htmlFor="password"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Password
        </label>
        <input
          id="password"
          name="email"
          type="password"
          autoComplete="current-password"
          required
          className="w-full text-slate-900 placeholder-slate-400 rounded-md py-2 pl-2 ring-1 ring-slate-200"
          value={password}
          onChange={(event) => setPassword(event.currentTarget.value)}
        />
      </div>
      <button
        className="btn btn-primary w-full"
        onClick={onAuthenticate}
        disabled={!username}
      >
        Sign in
      </button>
      <div className="py-2">
        <button
          onClick={() => navigate(ROUTES.SIGN_UP)}
          className="btn btn-link w-full"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default Signin;
