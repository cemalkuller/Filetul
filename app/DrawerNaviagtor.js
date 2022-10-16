import { API_URL } from "@env"
import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Appbar, Avatar, Button } from 'react-native-paper';

import Home from './components/Home';
import { useLogin } from './context/LoginProvider';
import Barcode from './screens/Barcode';
import Form from './screens/Form';
import SuccessPage from './screens/Success';

const Drawer = createDrawerNavigator();

const CustomDrawer = props => {



  const { profile, logOut } = useLogin();
  console.log(profile);
  return (
    <>
      <Appbar.Header>


        <TouchableOpacity >
          <Avatar.Image
            style={{ marginLeft: 10 }}
            size={40}
            source={!profile?.avatar?.url ? require('./assets/man.png') : { uri: `${API_URL}${profile?.avatar?.url}` }}
          />
        </TouchableOpacity>
        <Appbar.Content title={`${profile.title}`} subtitle={profile.email} />


      </Appbar.Header>

      <View style={{ flex: 1 }}>
        <DrawerContentScrollView {...props}>


        </DrawerContentScrollView>
        <Button mode="contained"

          style={{
            position: 'absolute',
            right: 0,
            left: 0,
            bottom: 50,
          }}
          onPress={() => logOut()}
        >
          Çıkış Yap
        </Button>

      </View>
    </>
  );
};

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
    
      screenOptions={{
        headerShown: false,
        headerStyle: {
          backgroundColor: 'none',
          elevation: 0,
        },
        headerTitle: '',
        headerTintColor: 'black',
        headerLeft: false,
        headerRight: () => (
          <TouchableOpacity onPress={() => console.log("acildi")}>

            <Text>Çıkış Yap </Text>
          </TouchableOpacity>
        ),
      }}

      drawerContent={props => <CustomDrawer {...props} />}
    >
      <Drawer.Screen component={Home} name='Home' />
      <Drawer.Screen component={Barcode} name='Barcode' />
      <Drawer.Screen component={Form} name='Form' />
      <Drawer.Screen component={SuccessPage} name='SuccessPage' />
      
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
