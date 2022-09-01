import { createContext, useState } from 'react';

interface IAppContext {
  user: any;
  setUser: any;
}

const AppContext = createContext({} as IAppContext);

const ContextProvider = ({ children }: { children: any }) => {
  const [user, setUser] = useState({});

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export { ContextProvider, AppContext };
