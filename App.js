import { NavigationContainer } from '@react-navigation/native';
import React from 'react';

import LoginProvider from './app/context/LoginProvider';
import MainNavigator from './app/MainNavigator';

export default function App() { 
  return (
    <LoginProvider>
      <NavigationContainer>
        <MainNavigator />
      </NavigationContainer>
    </LoginProvider>
  );
}

