import { Link, useNavigate } from 'react-router-dom';
import { useAuthState } from './authState';
import ChevronLeft from './icons/chevron-left';
import FacetsLogoWithText from './FacetsLogoWithText';

export const Toolbar = () => {
  const { authState, onRevokeAuthFn } = useAuthState();
  const navigate = useNavigate();

  const onRevokeAuth = () => {
    const signOut = async () => {
      if (authState.isAuthenticated) {
        onRevokeAuthFn();
      }
    };
    signOut();
    navigate('/');
  };

  return (
    <div className="flex justify-between align-middle pb-2 border-b">
      <button
        className="bg-white rounded-[5px] w-[45px] h-[45px] flex justify-center items-center font-bold p-2 m-2 shadow focus:outline-none focus:shadow-outline"
        onClick={() => navigate('/dashboard')}
      >
        <ChevronLeft />
      </button>
      {authState.isAuthenticated && (
        <div className="flex">
          <span className="p-[20px] text-white">
            Welcome, {authState.name}!
          </span>
          <Link to={'/profile'} className="p-[20px] text-white">
            Profile
          </Link>
          <button
            className="p-[10px] px-2 hover:shadow-md hover:rounded-md hover:bg-slate-100 text-white"
            onClick={onRevokeAuth}
          >
            Sign out
          </button>
          <span className="p-[8px]">
            <FacetsLogoWithText width={40} />
          </span>
        </div>
      )}
    </div>
  );
};

export default Toolbar;
