import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

import { jwt } from '../api/client';

const LoginContext = createContext();
const LoginProvider = ({ children }) => {


 const getToken = async () => {
    setLoading(true);
    let userData = await AsyncStorage.getItem("jwt");
    try {
      if(userData)
      {
      const res = await jwt(userData).get('users/me');
      if (res.data) {
        setProfile(res.data);
        setIsLoggedIn(true);
        setLoading(false)
      }
      else {
        setProfile({});
        setIsLoggedIn(false);
        setLoading(false);
      }
    }
    else 
    {
      setProfile({});
      setIsLoggedIn(false);
      setLoading(false);
    }

    } catch (error) {
      setProfile({});
      setLoading(false);
    }



  }

  const logOut = async () => {
    AsyncStorage.removeItem("jwt");
    setProfile({});
    setIsLoggedIn(false);
  }

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profile, setProfile] = useState({});
  const [barcode, SetBarcode] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {

    getToken();
  }, []);

  return (
    <LoginContext.Provider
      value={{ isLoggedIn, setIsLoggedIn, profile, setProfile, barcode, SetBarcode, logOut, loading, setLoading }}
    >
      {children}
    </LoginContext.Provider>
  );
};

export const useLogin = () => useContext(LoginContext);
export const useBarcode = () => useContext(LoginContext);
export default LoginProvider;
