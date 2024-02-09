import { NavigationContainer } from '@react-navigation/native';
import React ,{useEffect} from 'react';
import { Provider } from 'react-redux';

import LoginProvider from './app/context/LoginProvider';
import MainNavigator from './app/MainNavigator';
import Toast from 'react-native-toast-message';

import store , { setDynamicUrl } from './store';

export default function App() { 
  return (
    <Provider store={store}>
    <LoginProvider store={store}>
      <NavigationContainer>
        <MainNavigator />
      </NavigationContainer>
      <Toast />
    </LoginProvider>
    </Provider>
  );
}

