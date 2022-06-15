import React, { memo } from 'react';
import Background from '../components/Background';
import Logo from '../components/Logo';
import Header from '../components/Header';
import Paragraph from '../components/Paragraph';
import { Navigation } from '../types';
import { Button, View, StyleSheet } from 'react-native';
import { ActivityIndicator, Button as PButton, List, Avatar, Appbar, Divider } from 'react-native-paper';
type Props = {
  navigation: Navigation;
};

const Success = ({ navigation }: Props) => (
  <Background>
    <Logo />
   
    <Paragraph>
      E-Posta Müşteriye Başarılı Bir Şekilde Gönderilmiştir.
    </Paragraph>
    <View style={styles.dis}>
    <View style={styles.container}>
              <View style={styles.buttonContainer}>
                <PButton icon="barcode" mode="contained" onPress={() => navigation.navigate('Barcode')}>Yeni Barkod Tara </PButton>
              </View>
              <View style={styles.buttonContainer}>
                <PButton icon="home" onPress={() => navigation.navigate('Home')} >Ana Ekrana Dön</PButton>
              </View>
            </View>
            </View>
  </Background>
);
const styles = StyleSheet.create({
    dis : {
     
        
     
    },
    container: {
      
    },
    buttonContainer: {
      marginBottom : 30
    }
});
export default memo(Success);

