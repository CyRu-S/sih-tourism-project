import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(null); // 'tourist', 'admin', or null

  const login = (username, password) => {
    // Dummy authentication for hackathon
    if (username === 'admin' && password === 'admin') {
      setUserRole('admin');
      return true;
    } else if (username && password) {
      setUserRole('tourist');
      return true;
    }
    return false;
  };

  const logout = () => {
    setUserRole(null);
  };

  return (
    <AuthContext.Provider value={{ userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
