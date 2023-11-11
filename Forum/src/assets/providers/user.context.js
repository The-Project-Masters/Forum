import { createContext, useState } from 'react';

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [userContext, setUserContext] = useState({
    user: null,
    userData: null,
    setContext: (user, userData) => {
      setUserContext({ user, userData });
    },
  });

  return (
    UserContext.Provider({ value: userContext }, children)
  );
};

export { UserProvider };
export default UserContext;
