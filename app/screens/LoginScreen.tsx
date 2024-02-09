import React, { memo, useState, useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

import client from '../api/client';
import Button from '../components/Button';
import TextInput from '../components/TextInput';
import { useLogin } from '../context/LoginProvider';
import { theme } from '../core/theme';
import { Navigation } from '../types';
import { isValidEmail, isValidObjField, updateError } from '../utils/methods';
import { Video, ResizeMode } from 'expo-av';

type Props = {
  navigation: Navigation;
};

const LoginScreen = ({ navigation }: Props) => {
  const { setIsLoggedIn, setProfile, loading, setLoading } = useLogin();
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
    if (!isValidObjField(userInfo)) return updateError('Required all fields!', setError);

    if (!isValidEmail(email)) return updateError('Invalid email!', setError);

    if (!password.trim() || password.length < 6)
      return updateError('Password is too short!', setError);

    return true;
  };

  const setStringValue = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (e) {
      alert('Jwt Token Başarısız.');
    }

    console.log('Done.');
  };

  const submitForm = async () => {
    if (isValidForm()) {
      setLoading(true);
      try {
        const res = await client.post('authenticate', { ...userInfo });

        if (res?.data?.jwtToken) {
          setUserInfo({ email: '', password: '' });
          setProfile(res.data);
          setStringValue('jwt', res.data.jwtToken);
          setIsLoggedIn(true);
          setLoading(false);
        }
      } catch (error) {
        console.log(error?.response?.data?.message);
        setLoading(false);
      }
    }
  };

  const videoRef = useRef(null);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Video
          ref={videoRef}
          source={require('../assets/video.mp4')}
          style={styles.backgroundVideo}
          isMuted={true}
          shouldPlay={true}
          isLooping={true}
          resizeMode={ResizeMode.COVER}
        />
 
        <View style={styles.overlay}>
          <Text style={styles.text}>Filetül Barkod</Text>

          <View style={{ display: 'flex', flexDirection: 'column', padding: 30 }}>
            <View style={{ display: 'flex', flexDirection: 'row' }}>
              <TextInput
                label="E-Posta"
                returnKeyType="next"
                value={email}
                onChangeText={(value) => handleOnChangeText(value, 'email')}
                autoCapitalize="none"
                textContentType="emailAddress"
                keyboardType="email-address"
                mode="flat"
              />
            </View>
            <View style={{ display: 'flex', flexDirection: 'row' }}>
              <TextInput
                label="Şifre"
                returnKeyType="done"
                value={password}
                onChangeText={(value) => handleOnChangeText(value, 'password')}
                secureTextEntry
              />
            </View>
            <View style={{ display: 'flex', flexDirection: 'row', margin: 10, justifyContent: 'flex-end' }}>
              <TouchableOpacity onPress={() => navigation.navigate('forgot')}>
                <Text style={styles.label}>Şifrenizi mi unuttunuz?</Text>
              </TouchableOpacity>
            </View>
            <View style={{ display: 'flex', flexDirection: 'row' }}>
              <Button mode="contained" uppercase={false} onPress={submitForm}>
                Giriş Yap
              </Button>
            </View>
          </View>
          <Image source={require('../assets/apps.png')} style={{ width: 350, height: 46, position: 'absolute', bottom: 80 }} />
        </View>
        {loading && <ActivityIndicator
       animating={true}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'center',
          shadowOpacity: 0.5, 
          shadowRadius: 5,
          elevation: 5
        }}
         />
      }
      </View>
    </TouchableWithoutFeedback>
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
    color: '#fff',
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor : "#000000",
    shadowOpacity: 0.5, 
    shadowRadius: 5,
    elevation: 5
  },
  backgroundVideo: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    width: '100%',
    shadowOpacity: 0.5, 
    shadowRadius: 5,
    elevation: 5
  },
  text: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default memo(LoginScreen);
