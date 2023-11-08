import { createContext } from 'react';

const UserContext = createContext({
  user: null,
  userData: null,
  setContext() {
    // real implementation comes from App.jsx
  },
});

export default UserContext;
