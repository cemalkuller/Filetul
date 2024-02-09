import { useIsFocused } from '@react-navigation/native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import React, { memo, useEffect, useRef, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View, Image, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native';
import ActionSheet, { SheetManager } from "react-native-actions-sheet";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { ActivityIndicator, Button as PButton, List, Avatar, Appbar, Divider, Searchbar, Button, Surface } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import BackButtonCam from '../components/BackButtonCam';
import FlashButton from '../components/FlashButton';
import SearchButton from '../components/SearchButton';
import BasketButton from '../components/BasketButton';
import { useBarcode } from '../context/LoginProvider';
import { Navigation } from '../types';
import { jwt } from '../api/client';
import BarcodeMask from 'react-native-barcode-mask';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
const Sheets = {
  testSheet: 'test_sheet_id',
};



type Props = {
  navigation: Navigation;
};

const Barcode = ({ navigation }: Props) => {

  const [visible, setVisible] = React.useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [selectedBarkod, setselectedBarkod] = useState(null);
  const [scanned, setScanned] = useState(false);
  const { barcode, SetBarcode, barcodes, SetBarcodes } = useBarcode();
  const [loading, setLoading] = useState(false);
  const [sound, setSound] = useState(true);
  const [accessToken, setAccessToken] = useState("");
  const actionSheetRef = useRef<ActionSheet>(null);
  const BarcodeactionSheetRef = useRef<ActionSheet>(null);
  const [company, setCompany] = React.useState(null);

  const isFocused = useIsFocused();

  const handleNote = (e: any) => {


    const sel = selectedBarkod;
    sel.note = e;
    setselectedBarkod(sel);

  }

  const getAToken = async () => {
    let userData = await AsyncStorage.getItem("access_token");
    try {

      setAccessToken(userData);
    } catch (error) {
      // An error occurred!
    }
  }
  const setStringValue = async (key, value) => {
    try {

      const stringValue = JSON.stringify(value);
      console.log(stringValue);
      await AsyncStorage.setItem(key, stringValue)
    } catch (e) {

    }

  }
  const SecCompany = (e) => {

    setCompany(e);
    setStringValue("company", e);
  }


  const getCompany = async () => {
    let CompanyData = await AsyncStorage.getItem("company");
 
    try {

      const decodedObject = JSON.parse(CompanyData);
      setCompany(decodedObject);
      console.log("Bu2" ,decodedObject);
      //  setCompany(CompanyData);
    } catch (error) {

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




  }

  async function playError() {


  }

  useFocusEffect(
    React.useCallback(() => {
      getCompany();
      return () => {
        // Your cleanup code when the screen is unfocused
      };
    }, [])
  );


  useEffect(() => {

    
    getAToken();
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);


  useEffect(() => {

    if (!barcodes?.length) {
      //aç bunu SheetManager.hide(Sheets.testSheet, null);
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
        if (userData) {

          const res = await jwt(userData).post('barcode', { barcode: barcode  , company : company?.id});

          setLoading(false);
          setScanned(false);

          if (res?.data?.success) {
            if(res?.data?.data?.barcode)
            {
              setselectedBarkod(res?.data?.data);
              BarcodeactionSheetRef.current?.show();
            }
           else 
           {
            showToast("error", barcode, "Aradığınız barkod bulunamadı", "top");
           }
          }
          else {
            showToast("error", barcode, res?.data?.message, "top");
          }
        }
      } catch (error) {
        setLoading(false);
        setScanned(false);
        showToast("error", barcode, "Hata Oluştu", "top");
        console.log("Hata", error.response);


      }


    } catch (error) {

      console.log(error.response.data);
      setLoading(false);
      setScanned(false);
      showToast("error", barcode, "Hata Oluştu", "top");

    }

  };


  const setscanBarkod = async (barcod) => {


    setScanned(false);

    if (barcod?.barcode) {
      showToast("success", barcod?.product_name);
      BarcodeactionSheetRef.current?.hide();
      SetBarcodes([...barcodes, barcod]);
    }
    else {
      showToast("error", "Bakod Bulunamadı", "top");
    }


  };

  const OpenModal = () => {

    SheetManager.show(Sheets.testSheet, { text: barcode })

  }

  const degistir = (kelime: any) => {
    if (kelime) {
      const kel = kelime.replace("195.175.208.222:3491", "filetul.ngrok.app");

      return kel;

    }
    else {
      return null
    }
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

          scanBarkod(data);
          SetBarcode(data);

          // setLoading(false);
          //setScanned(false);
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
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}  >
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
          </TouchableWithoutFeedback>
        )}
        <BackButtonCam goBack={() => navigation.navigate('Home')} />
        {barcodes?.length ? <BasketButton value={barcodes?.length} action={() => OpenModal()} /> : <></>}
        <FlashButton active={sound} SetFlash={() => setSound(!sound)} />
        <SearchButton active={sound} setSearch={() => setVisible(!visible)} />

        {visible &&
          <View style={{ position: 'absolute', top: 130, width: '80%' }}>
            <Searchbar
              key={"search"}
              placeholder="Aramak İstediğiniz Barkod"
              onChangeText={query => { SetBarcode(query); console.log("Barcode", query) }}
              value={barcode}
              searchAccessibilityLabel="test"
              keyboardType={company?.id == 3 ? 'default' : 'numeric'}
              style={{ textAlign: 'center' }}
              inputStyle={{ textAlign: 'center' }}
              onBlur={query => { console.log("Barcode", query) }}

            />
            <View style={{ display: "flex", justifyContent: "center" }}>
              <Button disabled={!barcode} icon="barcode" mode="contained" style={{ marginTop: 20 }} onPress={() => scanBarkod(barcode)}>
                Arama Yap
              </Button>

            </View>
          </View>

        }
        <Text style={{color : "#ffffff" , zIndex : 99 , position : "absolute", bottom : 200 , fontSize : 20}} >Seçilen Firma : {company?.title}</Text>
        {barcodes?.length ? <PButton style={styles.aButton} contentStyle={{flexDirection: 'row-reverse'}} icon="arrow-right" mode="contained" onPress={() => navigation.navigate('Form')}> Devam Et</PButton> : <></>}

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
                        left={() => <Avatar.Image style={{ backgroundColor: '#eee' }} size={64} source={!data?.image ? require('../assets/noproduct.png') : { uri: `${degistir(data?.image)}` }} />}
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

        <Surface >
          <KeyboardAwareScrollView

            keyboardShouldPersistTaps="never"
            onKeyboardWillShow={(frames: Object) => {
              console.log('Keyboard event', frames)
            }}
            extraHeight={200}
            enableOnAndroid={true}
            enableResetScrollToCoords={true}
          >
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
              defaultOverlayOpacity={0.1}

              ref={BarcodeactionSheetRef}



            >
              <View
                style={{
                  paddingHorizontal: 12,
                }}>
                <Appbar.Header style={{ backgroundColor: 'transparent' }}   >
                  <Appbar.BackAction onPress={SheetManager.hideAll} />
                  <Appbar.Content title={selectedBarkod?.product_name} />
                </Appbar.Header>
                <Divider />

                <TouchableWithoutFeedback onPress={Keyboard.dismiss}  >
                  <ScrollView
                    keyboardShouldPersistTaps="always"
                    keyboardDismissMode='on-drag'

                    automaticallyAdjustContentInsets={false}
                    horizontal={false}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    nestedScrollEnabled
                    onMomentumScrollEnd={() => {
                      actionSheetRef.current?.handleChildScrollEnd();
                    }}
                    style={styles.scrollview}
                  >


                    <Image style={styles.image} source={!selectedBarkod?.image ? require('../assets/noproduct.png') : { uri: `${degistir(selectedBarkod?.image)}` }} />

                    <View style={styles.textAreaContainer} >
                      <TextInput
                        style={styles.textArea}
                        underlineColorAndroid="transparent"
                        placeholder="Eklemek İstediğiniz Not"
                        placeholderTextColor="grey"
                        numberOfLines={10}
                        value={selectedBarkod?.note}

                        onChangeText={newText => handleNote(newText)}
                        multiline={true}
                      />

                    </View>
                    <View style={styles.textAreaContainer} >
                      <PButton onPress={() => setscanBarkod(selectedBarkod)} mode='contained'  >Listeye Ekle</PButton>
                    </View>

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
                </TouchableWithoutFeedback>
              </View>
            </ActionSheet>
          </KeyboardAwareScrollView>
        </Surface>

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
  image: {
    width: "100%",
    height: 100,
  },
  footer: {
    height: 200,
  },
  textAreaContainer: {
    borderColor: "#eeeeee",
    borderWidth: 1,
    padding: 5,
    marginTop: 20
  },
  textArea: {
    height: 150,
    justifyContent: "flex-start"
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