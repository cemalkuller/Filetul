import React, { memo } from 'react';
import { ImageBackground, KeyboardAvoidingView, StyleSheet } from 'react-native';

type Props = {
  children: React.ReactNode;
};

const BackgroundForm = ({ children }: Props) => (
  <ImageBackground
    source={require('../assets/background_dot.png')}
    resizeMode="repeat"
    style={styles.background}
  >
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      {children}
    </KeyboardAvoidingView>
  </ImageBackground>
);

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
  },
  container: {
    flex: 1,
 
  },
});

export default BackgroundForm;
