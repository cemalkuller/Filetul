import { NavigationContainer } from '@react-navigation/native';
import React from 'react';

import LoginProvider from './app/context/LoginProvider';
import MainNavigator from './app/MainNavigator';
import Toast from 'react-native-toast-message';

export default function App() { 
  return (
    <LoginProvider>
      <NavigationContainer>
        <MainNavigator />
      </NavigationContainer>
      <Toast />
    </LoginProvider>
  );
}

