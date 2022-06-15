import { useIsFocused } from '@react-navigation/native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import React, { memo, useEffect, useRef, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ActionSheet, { SheetManager } from "react-native-actions-sheet";
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import {imageUrl} from "../helpers"
import { ActivityIndicator, Button as PButton, List, Avatar, Appbar, Divider } from 'react-native-paper';
import BackButtonCam from '../components/BackButtonCam';
import FlashButton from '../components/FlashButton';
import BasketButton from '../components/BasketButton';
import { REMOTE_URL } from "@env"
import { useBarcode } from '../context/LoginProvider';
import { Navigation } from '../types';
import { jwt } from '../api/client';
const querystring = require('querystring');
import BarcodeMask from 'react-native-barcode-mask';

const Sheets = {
  testSheet: 'test_sheet_id',
};



type Props = {
  navigation: Navigation;
};

const Barcode = ({ navigation }: Props) => {

  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const { barcode, SetBarcode, barcodes, SetBarcodes } = useBarcode();
  const [loading, setLoading] = useState(false);
  const [sound, setSound] = useState(true);
  const [accessToken, setAccessToken] = useState("");
  const actionSheetRef = useRef<ActionSheet>(null);
  const isFocused = useIsFocused();


  const getAToken = async () => {
    let userData = await AsyncStorage.getItem("access_token");
    try {
      console.log(userData);
      setAccessToken(userData);
    } catch (error) {
      // An error occurred!
    }

  }


  const handleRemoveItem = (idx, productname) => {

    const temp = [...barcodes];
    temp.splice(idx, 1);

    Alert.alert(productname, 'Seçilen ürün silinecektir, onaylıyor musunuz?', [
      {
        text: 'Hayır, Vazgeç',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      { text: 'Evet, Sil', onPress: () => { SetBarcodes(temp); SetBarcode(''); } },
    ]);




  }

  const handleRemoveItems = () => {


    Alert.alert("Ürünler Silinsin mi?", 'Tüm seçilen ürünler silinecektir, onaylıyor musunuz?', [
      {
        text: 'Hayır, Vazgeç',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      { text: 'Evet, Sil', onPress: () => { SetBarcodes([]); SetBarcode(''); } },
    ]);
  }




  const showToast = (type = null, title = null, description = null, position = null) => {
    Toast.show({
      position: position ? position : 'top',
      type: type ? type : 'success',
      text1: title ? title : 'Barkod Bulundu',
      visibilityTime: 2000,
      text2: description ? description : 'Barkod Bulundu ve Listeye Eklendi 👋'
    });
  }

  async function playSound() {

    try {
      const { sound: soundObject, status } = await Audio.Sound.createAsync(
        require('../assets/beep.mp3'),
        { shouldPlay: true }
      );
    } catch (error) {
      // An error occurred!
    }



  }

  async function playError() {

    try {
      const { sound: soundObject, status } = await Audio.Sound.createAsync(
        require('../assets/error.mp3'),
        { shouldPlay: true }
      );
    } catch (error) {
      // An error occurred!
    }



  }


  useEffect(() => {

    console.log(barcodes);
    getAToken();
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);


  useEffect(() => {

    if (!barcodes?.length) {
      SheetManager.hide(Sheets.testSheet, null);
    }


  }, [barcodes]);



  const scanBarkod = async (barcode) => {

    //console.log(barcode);

    if (sound) {
      playSound();
    }
    setLoading(true);
    try {
      let userData = await AsyncStorage.getItem("jwt");
      try {
        if(userData)
        {
        
      const res = await  jwt(userData).post('product/barcode', { barcode: barcode});
      console.log(res?.data);
      setLoading(false);
      setScanned(false);

      if (res?.data?.success) {
        //console.log(res?.data?.Data);
        showToast("success", res?.data?.data?.product_name);
        SetBarcodes([...barcodes, res?.data?.data]);
      }
      else {
        showToast("error", barcode, res?.data?.message, "top");
      }
        }
    } catch (error) {
 
      console.log(error.response.data);
     

    }


    } catch (error) {

      console.log(error.response.data);
      setLoading(false);
      setScanned(false);


    }

  };

  const OpenModal = () => {

    SheetManager.show(Sheets.testSheet, { text: barcode })

  }

  const handleBarCodeScanned = ({ data }) => {


    const datam = barcodes.filter(function (item) {
      return item.barcode == data;
    });

    if (datam?.length === 0) {
      if (!scanned) {
        setScanned(true);
        setLoading(true);
        // SheetManager.show(Sheets.testSheet, { text: data });
        if (data !== barcode) {
          scanBarkod(data);
          SetBarcode(data);
        }
        else {
          setLoading(false);
          setScanned(false);
        }


      }
    }
    else {

      if (data !== barcode) {
        if (sound) {
          playError();
        }
        SetBarcode(data);
        showToast("error", data + " - " + datam[0]?.product_name, "Bu Ürün Daha Önce Eklenmiş", "bottom");
        setScanned(false);
        console.log("error", data + " - " + datam[0]?.product_name,);
      }
    }

    // navigation.navigate('Home')
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
        {isFocused && (
          <BarCodeScanner
            onBarCodeScanned={handleBarCodeScanned}

            style={[StyleSheet.absoluteFill, {
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              height: '100%',
              bottom: 0
            }]}
          >
            <BarcodeMask outerMaskOpacity={0.8} backgroundColor={"#000000"} showAnimatedLine />
          </BarCodeScanner>
        )}
        <BackButtonCam goBack={() => navigation.navigate('Home')} />
        {barcodes?.length ? <BasketButton value={barcodes?.length} action={() => OpenModal()} /> : <></>}
        <FlashButton active={sound} SetFlash={() => setSound(!sound)} />

        {barcodes?.length ? <PButton style={styles.aButton} icon="arrow-right" mode="contained" onPress={() => navigation.navigate('Form')}> Devam Et</PButton> : <></>}

        {loading && <ActivityIndicator
          animating={true}
          color='white'
          size={'large'}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center'
          }}
        />
        }
        <ActionSheet
          initialOffsetFromBottom={0.7}
          onBeforeShow={data => console.log(data)}
          id={Sheets.testSheet}
          statusBarTranslucent
          bounceOnOpen={true}
          drawUnderStatusBar={true}
          bounciness={10}
          gestureEnabled={true}
          keyboardDismissMode='interactive'
          keyboardHandlerEnabled={false}
          defaultOverlayOpacity={0.1}>
          <View
            style={{
              paddingHorizontal: 12,
            }}>
            <Appbar.Header style={{ backgroundColor: 'transparent' }}   >
              <Appbar.BackAction onPress={SheetManager.hideAll} />
              <Appbar.Content title={`${barcodes?.length} Ürün Seçildi`} />
              <Appbar.Action icon="delete" onPress={handleRemoveItems} />
            </Appbar.Header>
            <Divider />

            <ScrollView
              nestedScrollEnabled
              onMomentumScrollEnd={() => {
                actionSheetRef.current?.handleChildScrollEnd();
              }}
              style={styles.scrollview}>

              <List.Section>
                {barcodes?.map((data, idx) => {
                  return (
                    <>
                      <List.Item
                        key={`barcodeList${idx}`}
                        title={data?.product_name}
                        description={data?.product_description}
                        left={() => <Avatar.Image style={{backgroundColor : '#eee'}} size={64} source={!data?.image ? require('../assets/noproduct.png') : { uri: `${imageUrl(data?.image)}` }} />}
                        right={props => <TouchableOpacity
                          onPress={() => {
                            handleRemoveItem(idx, data?.product_name)
                          }}
                        ><List.Icon {...props} icon="delete" color="red" />
                        </TouchableOpacity>
                        }

                      />
                      <Divider />
                    </>
                  )
                })
                }



              </List.Section>


              <View>

                <TouchableOpacity
                  onPress={() => {
                    SheetManager.hide(Sheets.testSheet, null);
                  }}
                  style={styles.listItem}>


                </TouchableOpacity>

              </View>

              {/*  Add a Small Footer at Bottom */}
              <View style={styles.footer} />
            </ScrollView>

          </View>
        </ActionSheet>
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
    height: 200,
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
    padding: 0,
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
  aButton: {
    position: 'absolute',
    bottom: 120,
    right: 40,
  }
});


export default memo(Barcode);