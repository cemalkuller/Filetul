import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import { useLogin } from './context/LoginProvider';
import DrawerNavigator from './DrawerNaviagtor';
import AppForm from './screens/AppForm';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';

const Stack = createStackNavigator();

const StackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen component={AppForm} name='AppForm' />
      <Stack.Screen component={ForgotPasswordScreen} name='forgot' />

    </Stack.Navigator>
  );
};

const MainNavigator = () => {
  const { isLoggedIn } = useLogin();
  return isLoggedIn ? <DrawerNavigator /> : <StackNavigator />;
};
export default MainNavigator;
