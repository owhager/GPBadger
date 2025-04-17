import React, { createContext, useContext, useState } from 'react';

// make a context to hold the user info
const UserContext = createContext();

export function UserProvider({ children }) {
  // make state to store user data
  const [user, setUser] = useState(null);

  // give everything inside access to user and setUser
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

// helper so we can use the user info easily anywhere
export function useUser() {
  return useContext(UserContext);
}
