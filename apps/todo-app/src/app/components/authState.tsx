import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useState,
} from 'react';

export interface AuthState {
  name: string | undefined;
  isAuthenticated: boolean;
}

interface SignUp {
  name: string;
  email: string;
  password: string;
}
const defaultAuthState: AuthState = {
  name: undefined,
  isAuthenticated: false,
};

export type AuthContextType = {
  authState: AuthState;
  userIsAuthenticatedFn: () => Promise<void>;
  onAuthenticateFn: (username: string, password: string) => Promise<void>;
  onUsernameEnteredFn: (username: string) => Promise<number | null>;
  onRevokeAuthFn: () => Promise<void>;
  onSignUpFn: ({ name, email, password }: SignUp) => Promise<void>;
};

const defaultAuthContext: AuthContextType = {
  authState: defaultAuthState,
  userIsAuthenticatedFn: async () => {},
  onAuthenticateFn: async () => {},
  onUsernameEnteredFn: async () => null,
  onRevokeAuthFn: async () => {},
  onSignUpFn: async () => {},
};

const AuthContext = createContext<AuthContextType>(defaultAuthContext);
export const useAuthState = () => useContext(AuthContext);

type Props = {
  children: ReactNode;
};

const AuthContextProvider: React.FC<Props> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(defaultAuthState);

  const userIsAuthenticatedFn = useCallback(async () => {
    const url = `/api/users/me`;
    try {
      const res = await fetch(url, {
        credentials: 'same-origin',
        mode: 'same-origin',
      });
      console.log('userIsAuthenticatedFn', res);
      if (res.status === 200) {
        const { name } = await res.json();
        setAuthState({ name, isAuthenticated: true });
        localStorage.setItem('isAuthenticated', 'true');
      } else {
        setAuthState({ name: '', isAuthenticated: false });
        localStorage.setItem('isAuthenticated', 'false');
      }
    } catch (error: unknown) {
      setAuthState({ name: '', isAuthenticated: false });
      console.error(error);
    }
  }, [setAuthState]);

  const onSignUpFn = async ({ name, email, password }: SignUp) => {
    const url = `/api/register`;
    try {
      const res = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        mode: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      });

      const { user } = await res.json();

      setAuthState({ name: user.name, isAuthenticated: true });
      localStorage.setItem('isAuthenticated', 'true');
    } catch (error: unknown) {
      console.error(error);
    }
  };

  // const onAuthenticateFn = async (email: string, password: string) => {
  //   console.log('email', email, password);
  //   const url = `/api/signin`;
  //   try {
  //     const res = await fetch(url, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ email, password }),
  //     });

  //     const { name } = await res.json();
  //     console.log('name', name);
  //     setAuthState({ name, isAuthenticated: true });
  //     localStorage.setItem('isAuthenticated', 'true');
  //   } catch (error: unknown) {
  //     console.error(error);
  //   }
  // };

  const onAuthenticateFn = async (email: string, password: string) => {
    console.log('Attempting to authenticate with email:', email);
    const url = `/api/signin`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      console.log('response', response);
      if (response.ok) {
        const { name } = await response.json();
        console.log('Authenticated as:', name);
        setAuthState({ name, isAuthenticated: true });
        localStorage.setItem('isAuthenticated', 'true');
      } else if (response.status === 401) {
        console.error('Authentication failed: Invalid email or password.');
        setAuthState({ name: '', isAuthenticated: false });
        localStorage.setItem('isAuthenticated', 'false');
      } else {
        // If the server responded with any other error
        console.error('An error occurred during authentication.');
        setAuthState({ name: '', isAuthenticated: false });
        localStorage.setItem('isAuthenticated', 'false');
      }
    } catch (error) {
      console.error(
        'An error occurred while sending the authentication request:',
        error
      );
      setAuthState({ name: '', isAuthenticated: false });
      localStorage.setItem('isAuthenticated', 'false');
    }
  };

  const onUsernameEnteredFn = async (username: string) => {
    console.log('username entered', username);
    const url = `/api/openid/check`;
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });

      const response = await res.json();
      console.log('response', response);
      const { org_id } = response;
      return org_id;
    } catch (error: unknown) {
      console.error(error);
    }

    return null;
  };

  const onRevokeAuthFn = async () => {
    const url = `/api/signout`;
    try {
      const res = await fetch(url, {
        method: 'POST',
      });

      setAuthState(defaultAuthState);
      localStorage.setItem('isAuthenticated', 'false');
    } catch (error: unknown) {
      console.error(error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        authState,
        onSignUpFn,
        onAuthenticateFn,
        onUsernameEnteredFn,
        onRevokeAuthFn,
        userIsAuthenticatedFn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
