import { useIsFocused } from '@react-navigation/native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import React, { memo, useEffect, useRef, useState } from 'react';
import { Button, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Platform } from 'react-native';
import ActionSheet, { SheetManager } from "react-native-actions-sheet";
import Torch from 'react-native-torch';

import BackButtonCam from '../components/BackButtonCam';
import FlashButton from '../components/FlashButton';
import { useBarcode } from '../context/LoginProvider';
import { Navigation } from '../types';

const Sheets = {
  testSheet: 'test_sheet_id',
};
const colors = ['#4a4e4d', '#0e9aa7', '#3da4ab', '#f6cd61', '#fe8a71'];



type Props = {
  navigation: Navigation;
};

const Barcode = ({ navigation }: Props) => {

  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const { barcode, SetBarcode } = useBarcode();
  const [hasIsik, setIsik] = useState(false);
  const actionSheetRef = useRef < ActionSheet > (null);
  const isFocused = useIsFocused();


  const isikyak = () => {

    if (Platform.OS === 'ios') {
      Torch.switchState(!hasIsik);
    } else {
      const cameraAllowed =  Torch.requestCameraPermission(
        'Camera Permissions', 
        'We require camera permissions to use the torch on the back of your phone.'
      );
    
      if (cameraAllowed) {
        Torch.switchState(!hasIsik);
      }
    }
      setIsik(!hasIsik);
  }


  useEffect(() => {
    
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);


  const handleBarCodeScanned = ({ type, data }) => {
  
    SheetManager.show(Sheets.testSheet, { text: data });
    SetBarcode(data);
    navigation.navigate('Home')
  };

  if (hasPermission === null) {
    return <Text>Kameraya İzin Verin</Text>;
  }
  if (hasPermission === false) {


    return <Text>Kamera İzinleriniz Geçersiz</Text>;
  }

  return (
    <View style={styles.container}>
      
      <View style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: '100%',
        bottom: 0,
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: "center",

      }}>
        {isFocused ? (
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          
          style={[StyleSheet.absoluteFill ,{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            height: '100%',
            bottom: 0
          }]}
        >


        <View style={styles.layerTop} />
        <View style={styles.layerCenter}>
          <View style={styles.layerLeft} />
          <View style={styles.focused} />
          <View style={styles.layerRight} />
        </View>
        <View style={styles.layerBottom} />

        </BarCodeScanner>
        ) : (console.log("Kapandı"))}
    <BackButtonCam goBack={() => navigation.navigate('Home')} />
    <FlashButton SetFlash={() => isikyak()} />
    

        {scanned && <Button title={'Tekrar Taramak İçin Dokunun'} onPress={() => setScanned(false)} />}
      </View>

    </View>
  );
}
const opacity = 'rgba(0, 0, 0, .6)';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: "center",
  },
  footer: {
    height: 100,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    height: 15,
    backgroundColor: '#f0f0f0',
    marginVertical: 15,
    borderRadius: 5,
  },
  circle: {
    width: 60,
    height: 60,
    borderRadius: 100,
  },
  btnLeft: {
    width: 30,
    height: 30,
    backgroundColor: '#f0f0f0',
    borderRadius: 100,
  },
  input: {
    width: '100%',
    minHeight: 50,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  scrollview: {
    width: '100%',
    height: '100%',
    padding: 12,
  },
  btn: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#fe8a71',
    paddingHorizontal: 10,
    borderRadius: 5,
    elevation: 5,
    shadowColor: 'black',
    shadowOffset: { width: 0.3 * 4, height: 0.5 * 4 },
    shadowOpacity: 0.2,
    shadowRadius: 0.7 * 4,
  },
  safeareview: {
    justifyContent: 'center',
    flex: 1,
  },
  btnTitle: {
    color: 'white',
    fontWeight: 'bold',
  },
  layerTop: {
    flex: 2,
    backgroundColor: opacity
  },
  layerCenter: {
    flex: 1,
    flexDirection: 'row'
  },
  layerLeft: {
    flex: 1,
    backgroundColor: opacity
  },
  focused: {
    flex: 10
  },
  layerRight: {
    flex: 1,
    backgroundColor: opacity
  },
  layerBottom: {
    flex: 2,
    backgroundColor: opacity
  },
});


export default memo(Barcode);