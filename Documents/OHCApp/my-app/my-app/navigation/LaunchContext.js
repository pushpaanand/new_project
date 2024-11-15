import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const LaunchContext = createContext();

export const LaunchProvider = ({ children }) => {
  const [isFirstLaunch, setIsFirstLaunch] = useState(null);

  useEffect(() => {
    const checkIfFirstLaunch = async () => {
      try {
        const value = await AsyncStorage.getItem('hasLaunched');
        if (value === null) {
          await AsyncStorage.setItem('hasLaunched', 'true');
          setIsFirstLaunch(true); // First launch
        } else {
          setIsFirstLaunch(false); // Not first launch
        }
      } catch (error) {
        console.log('Error checking first launch:', error);
      }
    };
    checkIfFirstLaunch();
  }, []);

  return (
    <LaunchContext.Provider value={{ isFirstLaunch, setIsFirstLaunch }}>
      {children}
    </LaunchContext.Provider>
  );
};
