import { API_URL } from "@env"
import { useDrawerStatus } from '@react-navigation/drawer';
import React, { memo, useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, FlatList } from 'react-native';
import ActionSheet, { SheetManager } from "react-native-actions-sheet";
import Hamburger from 'tavukburger';
import { Appbar, Avatar, Button, FAB, Modal, Portal, Provider, Searchbar, IconButton, Card, Title, Paragraph, Snackbar } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLogin } from '../context/LoginProvider';
import { useBarcode } from '../context/LoginProvider';
import { Navigation } from '../types';
import { jwt } from '../api/client';
import Toast from 'react-native-toast-message';
import { Keyboard } from 'react-native'


type Props = {
  navigation: Navigation;
};
const Sheets = {
  testSheet: 'test_sheet_id',
};
const Home = ({ navigation }: Props) => {

  const isDrawerVisible = useDrawerStatus();
  const [visible, setVisible] = React.useState(false);
  const { profile } = useLogin();
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const containerStyle = { width: '80%', marginLeft: '10%', backgroundColor: 'rgba(255,255,255,0)', padding: 20, TouchableOpacity: 0 };
  const [contentVisible, setContentVisible] = useState(false);
  const { barcode, SetBarcode, SetBarcodes } = useBarcode();


  const [visibleSnac, setvisibleSnac] = useState(false);
  const onDismissSnackBar = () => setvisibleSnac(false);


  const [company, setCompany] = React.useState(null);
  const DATA = [
    {
      id: '1',
      title: 'Filetül',
      color: '#761532',
      onpress: "Barcode",
      icon: 'barcode',
      fontColor: '#ffffff'
    },
    {
      id: '2',
      title: 'Redpep',
      color: '#CD0000',
      onpress: "Barcode",
      icon: 'barcode',
      fontColor: '#ffffff'
    },
    {
      id: '3',
      title: 'Keyos',
      color: '#ff5a2a',
      onpress: "Barcode",
      icon: 'barcode',
      fontColor: '#ffffff'
    }
  ];

  useEffect(() => {
    if (isDrawerVisible) {
      setContentVisible(false);
    } else {
      setContentVisible(true);
    }
    setState({ open: false })
  }, [isDrawerVisible]);


  useEffect(() => {
    getCompany();
  }, [profile]);


  const getCompany = async () => {
    let CompanyData = await AsyncStorage.getItem("company");
    try {
      const decodedObject = JSON.parse(CompanyData);
      setCompany(decodedObject);


      console.log(decodedObject);
      //  setCompany(CompanyData);
    } catch (error) {

    }

  }

  const _goBack = () => navigation.toggleDrawer();

  const _handleSearch = (query) => {

    Keyboard.dismiss()

    scanBarkod(barcode);
    SheetManager.show(Sheets.testSheet, { text: query });

  }


  const [state, setState] = React.useState({ open: false });

  const setStringValue = async (key, value) => {
    try {

      const stringValue = JSON.stringify(value);
      console.log(stringValue);
      await AsyncStorage.setItem(key, stringValue)
    } catch (e) {

    }

  }



  const SecCompany = (e) => {

    if (e.id != company?.id) {
      SetBarcode("");
      SetBarcodes([]);
      setCompany(e);
      setStringValue("company", e);
    }

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

  const scanBarkod = async (barcode) => {


    try {
      let userData = await AsyncStorage.getItem("jwt");
      try {
        if (userData) {

          const res = await jwt(userData).post('product/search', { title: barcode });

          console.log(res?.data);
          if (res?.data?.success) {


            console.log(res?.data?.data);

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


    }

  };


  const actionSheetRef = useRef<ActionSheet>(null);

  const gitNav = () => {
    if (!company?.id) {
      setvisibleSnac(true);
      console.log("yok");
    }
    else {
      navigation.navigate('Barcode');
    }

  }

  return (
    <>
      <View style={{
        width: '100%',

        justifyContent: 'flex-start',
        borderRadius: 20,
        paddingBottom: 100,
        backgroundColor: '#000000',
        shadowOpacity: 0.5,
        shadowRadius: 5,
        elevation: 5

      }}>
        <Appbar.Header style={styles.appBar}>
          <Hamburger type="cross" color={"#fff"} active={contentVisible} onPress={_goBack}
            underlayColor="transparent"
          >
          </Hamburger>


          <Appbar.Content style={{ alignItems: 'flex-start', }} subtitleStyle={{ fontSize: 18 }} title={"Merhaba"} subtitle={profile?.title} color="#ffffff" />

          <TouchableOpacity onPress={_goBack} >


            <Avatar.Image
              style={{ marginLeft: 10 }}
              size={40}
              source={!profile?.avatar?.url ? require('../assets/man.png') : { uri: `${API_URL}${profile?.avatar?.url}` }}

            />
          </TouchableOpacity>
        </Appbar.Header>
        <View style={styles.searchBar}>
          <Text style={{ color: "#ffffff", fontSize: 30, marginTop: 15 }}>Hangi Firmada İşlem Yapacaksınız?</Text>

        </View>

      </View>
      {visible ?
        <>
          <Searchbar
            placeholder="Aramak İstediğiniz Barkod"
            onChangeText={query => { SetBarcode(query) }}
            value={barcode}
            style={{ textAlign: 'center' }}
            onBlur={query => { console.log("Barcode", query) }}
          />
          <Button disabled={!barcode} icon="barcode" mode="contained" style={{ width: '60%', marginLeft: '20%', marginTop: 20, marginBottom: 20 }} onPress={() => _handleSearch(barcode)}>
            Arama Yap
          </Button>
        </>
        : <></>
      }

      <View style={styles.container1}>
        <View style={styles.container}>
          <Provider>
            <Portal>
              <FlatList
                data={DATA}
                numColumns={1}
                renderItem={({ item }) => (
                  <TouchableOpacity key={"Key" + item.id} onPress={() => SecCompany(item)}
                  //onPress={() => navigation.navigate(item.onpress)}

                  >


                    <Card style={company?.id == item.id ? styles.active : styles.normal}  >
                      <Card.Content  >
                        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }} >
                          <View >
                            <Title style={company?.id == item.id ? styles.activetext : styles.normaltext}>{item.title}</Title>
                            {company?.id != item.id && <Paragraph>Firma Değiştirmek İçin Tıklayınız.</Paragraph>}
                          </View>

                          {company?.id == item.id &&
                            <View style={{ backgroundColor: "#000000", borderRadius: 50 }} >
                              <IconButton icon="check-bold"

                                color={"#ffffff"}
                                size={20} onPress={() => _handleSearch(barcode)} />
                            </View>
                          }
                        </View>
                      </Card.Content>

                    </Card>


                  </TouchableOpacity>
                )}
              />






            </Portal>
          </Provider>

        </View>
        <Button icon="arrow-right" mode="contained" style={{ height: 60, outerHeight: 60, innerHeight: 60, }} contentStyle={{ flexDirection: 'row-reverse', borderRadius: 15, height: 60, backgroundColor: '#000000', }} color="transparent" labelStyle={{ fontWeight: "800", lineHeight: 30, color: '#ffffff' }} onPress={() => { gitNav() }}>
          Devam Et
        </Button>


      </View>
      <Snackbar
        visible={visibleSnac}
        onDismiss={onDismissSnackBar}
        action={{
          label: 'Tamam',
          onPress: () => {
            // Do something
          },
        }}>
        Barkod Sorgulamak İçin Firma Seçiniz.
      </Snackbar>
    </>
  );
};

const styles = StyleSheet.create({
  container1: {
    position: 'absolute',
    width: '100%', // Yatayda %100 genişlik
    height: '60%', // Dikeyde içeriğe göre boyutlanacak
    top: 200,
    zIndex: 9999,
    padding: 30

  },
  active:
  {
    flex: 1,

    margin: 10,
    borderRadius: 10,
    window: '100%',
    backgroundColor: "#ffc200"

  },
  normaltext:
  {
    color: "#000000"
  },

  activetext:
  {
    color: "#000000"

  },
  normal:
  {
    flex: 1,
    margin: 10,
    borderRadius: 10,
    window: '100%'
  },

  searchBar: {
    flexDirection: 'row', // Yatayda sıralama
    alignItems: 'center', // Dikeyde hizalama
    paddingHorizontal: 16, // Yatayda iç boşluk
    width: '90%', // Yatayda %100 genişlik
    padding: 20,
    paddingTop: 10,
    marginLeft: '5%',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
    borderRadius: 15
  },
  scrollview: {
    width: '100%',
    height: '100%',
    padding: 12,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    height: 100,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 35,
    backgroundColor: "#6200ee"
  },
  appBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',

    padding: 15,
    backgroundColor: 'transparent', // Arka plan rengi
    elevation: 0,


  },

});



export default memo(Home);
