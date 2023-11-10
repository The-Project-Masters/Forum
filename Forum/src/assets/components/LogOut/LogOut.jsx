import { logoutUser } from '../../services/auth.service.js';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { Button } from 'react-bootstrap';
import UserContext from '../../providers/user.context.js';

const LogoutComponent = ({ set }) => {
  const navigate = useNavigate();
  const { user, userData } = useContext(UserContext);

  const logOut = async () => {
    await logoutUser();
    set({ user: null, userData: { handle: null } });
    navigate('/home');
  };

  const userName = user.displayName ? `Hello, ${user.displayName}` : `Hello, ${user.email}`;

  return (
    <div className="text-white mt-3 mb-3">
      <h4>{userName}</h4>
      <Button onClick={logOut}>Log Out</Button>
    </div>
  );
};

export default LogoutComponent;
