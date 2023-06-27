import { API_URL } from "@env"
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { memo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

import client from '../api/client';
import Background from '../components/Background';
import Button from '../components/Button';
import Header from '../components/Header';
import Logo from '../components/Logo';
import TextInput from '../components/TextInput';
import { useLogin } from '../context/LoginProvider';
import { theme } from '../core/theme';
import { Navigation } from '../types';
import { isValidEmail, isValidObjField, updateError } from '../utils/methods';

type Props = {
  navigation: Navigation;
};

const LoginScreen = ({ navigation }: Props) => {

  const { setIsLoggedIn, setProfile , loading, setLoading } = useLogin();
  const [userInfo, setUserInfo] = useState({
    email: '',
    password: '',
  });



  const [error, setError] = useState('');

  const { email, password } = userInfo;

  const handleOnChangeText = (value, fieldName) => {
    setUserInfo({ ...userInfo, [fieldName]: value });
  };

  const isValidForm = () => {
    if (!isValidObjField(userInfo))
      return updateError('Required all fields!', setError);

    if (!isValidEmail(email)) return updateError('Invalid email!', setError);

    if (!password.trim() || password.length < 6)
      return updateError('Password is too short!', setError);

    return true;
  };


    const setStringValue = async (key , value) => {
    try {
      await AsyncStorage.setItem(key, value)
    } catch(e) {
      alert("Jwt Token Başarısız.");
      // save error
    }
  
    console.log('Done.')
  }



  const submitForm = async () => {
   // navigation.navigate('forgot')
    if (isValidForm()) {
      
      setLoading(true);
      try {
        const res = await client.post('authenticate', { ...userInfo });

        if (res?.data?.jwtToken) {
          setUserInfo({ email: '', password: '' });
          setProfile(res.data);
          setStringValue("jwt",res.data.jwtToken);
          setIsLoggedIn(true);
          setLoading(false);
        }

      } catch (error) {
        console.log(error?.response?.data?.message);
        setLoading(false);
      

      }
    }
  };



  return (
    <>
      <Background>
        <Logo />

        <Header>Barkod Uygulaması</Header>
        {error ? (
          <Text style={{ color: 'red', fontSize: 18, textAlign: 'center' }}>
            {error}
          </Text>
        ) : null}
        <TextInput
          label="E-Posta"
          returnKeyType="next"
          value={email}
          onChangeText={value => handleOnChangeText(value, 'email')}
          autoCapitalize="none"
          textContentType="emailAddress"
          keyboardType="email-address"
        />

        <TextInput
          label="Şifre"
          returnKeyType="done"
          value={password}
          onChangeText={value => handleOnChangeText(value, 'password')}
          secureTextEntry
        />

        <View style={styles.forgotPassword}>
          <TouchableOpacity
            onPress={() => navigation.navigate('forgot')}
          >
            <Text style={styles.label}>Şifrenizi mi unuttunuz?</Text>
          </TouchableOpacity>
        </View>

        <Button mode="contained"  uppercase={false} onPress={submitForm}>
          Giriş Yap
        </Button>

        <View style={styles.row}>


        </View>

      </Background>
      {loading && <ActivityIndicator
       animating={true}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          alignItems: 'center',
          backgroundColor: 'rgba(255,255,255,0.5)',
          justifyContent: 'center'
        }}
         />
      }
    </>
  );
};

const styles = StyleSheet.create({
  forgotPassword: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  label: {
    color: theme.colors.secondary,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
});

export default memo(LoginScreen);
