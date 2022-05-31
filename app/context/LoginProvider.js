import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
const querystring = require('querystring');
import { REMOTE_USERNAME , REMOTE_PASSWORD } from "@env"

import { jwt , remote } from '../api/client';

const LoginContext = createContext();
const LoginProvider = ({ children }) => {

  const setStringValue = async (key , value) => {
    try {
      await AsyncStorage.setItem(key, value)
    } catch(e) {
      // save error
    }
  
    console.log('Done.')
  }

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
        setLoading(false);



          // Uzak sunucu Login
          try {
            if(userData)
            {
              const res = await remote.post('login', querystring.stringify({ username: REMOTE_USERNAME , password : REMOTE_PASSWORD }));
        
            if (res.data) {
              if(res?.data?.Data?.access_token)
              {
                setStringValue('access_token', res?.data?.Data?.access_token);
              }
              
           
            }
          
          }
               
          } catch (error) {
            setProfile({});
            setLoading(false);
          }








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
  const [barcodes, SetBarcodes] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {

    getToken();
  }, []);

  return (
    <LoginContext.Provider
      value={{ isLoggedIn, setIsLoggedIn, profile, setProfile, barcode, SetBarcode, logOut, loading, setLoading , barcodes, SetBarcodes }}
    >
      {children}
    </LoginContext.Provider>
  );
};

export const useLogin = () => useContext(LoginContext);
export const useBarcode = () => useContext(LoginContext);
export default LoginProvider;
