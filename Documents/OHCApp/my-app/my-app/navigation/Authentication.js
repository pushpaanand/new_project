import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, createContext, useEffect } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [mainisLoggedIn, setMainIsLoggedIn] = useState(true);
    const [isFirstLaunch, setIsFirstLaunch] = useState(null);
    const [LoginOkay, setLoginOkay] = useState(true);
    const [userid, setUserid] = useState('');
    const [username, setUsername] = useState('');    
  
    const [usertoken, setUserToken] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

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
    
    const login = () => {
        setIsLoading(true);
        setUserToken('isloggedin');
        AsyncStorage.setItem("userToken", 'isloggedin');
        setIsLoading(false);
      }
      const logout = () => {
        setIsLoading(true);
        setUserToken(null);
        AsyncStorage.removeItem('userToken');
        AsyncStorage.removeItem('username');
        
        setIsLoading(false);
      }
    
      const isLoggedIn = async () => {
        try {
          setIsLoading(true);
          let userToken = await AsyncStorage.getItem('userToken');
          setUserToken(userToken);
          setIsLoading(false);
        } catch (e) {
          console.log(`isLogged in error ${e}`);
        }
      }
    
      useEffect(() => {
        isLoggedIn();
      }, []);
      return (
        <AuthContext.Provider value={{
          login, logout, usertoken, setUserToken, username, setUsername, mainisLoggedIn, setMainIsLoggedIn, LoginOkay, setLoginOkay, 
           userid, setUserid, isFirstLaunch, setIsFirstLaunch
        }}>
          {children}
        </AuthContext.Provider>
      );
    };
    
    export { AuthContext, AuthProvider };