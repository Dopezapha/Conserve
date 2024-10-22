import React, { createContext, useState, useContext, useEffect } from 'react';
import { authenticate, UserSession, AppConfig } from '@stacks/connect';
import { StacksMainnet } from '@stacks/network';

// Create an app config and user session
const appConfig = new AppConfig(['store_write', 'publish_data']);
const userSession = new UserSession({ appConfig });

export const ContractContext = createContext();

export const ContractProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);

  const network = new StacksMainnet();

  useEffect(() => {
    if (userSession.isSignInPending()) {
      userSession.handlePendingSignIn().then(userData => {
        setUserData(userData);
        setLoading(false);
      });
    } else if (userSession.isUserSignedIn()) {
      setUserData(userSession.loadUserData());
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, []);

  const connectWallet = () => {
    authenticate({
      appDetails: {
        name: 'Conservation Platform',
        icon: window.location.origin + '/logo.png',
      },
      redirectTo: '/',
      onFinish: () => {
        setUserData(userSession.loadUserData());
        window.location.reload();
      },
    });
  };

  const disconnect = () => {
    userSession.signUserOut('/');
    setUserData(null);
  };

  const value = {
    userData,
    loading,
    projects,
    setProjects,
    currentProject,
    setCurrentProject,
    connectWallet,
    disconnect,
    network,
  };

  return (
    <ContractContext.Provider value={value}>
      {children}
    </ContractContext.Provider>
  );
};

// Define the ConnectWallet component
export const ConnectWallet = () => {
  const { userData, connectWallet, disconnect } = useContext(ContractContext);

  return userData ? (
    <button onClick={disconnect}>Disconnect Wallet</button>
  ) : (
    <button onClick={connectWallet}>Connect Wallet</button>
  );
};

// Custom hook to use the ContractContext
export const useContract = () => useContext(ContractContext);
