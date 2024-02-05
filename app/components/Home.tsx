import { API_URL } from "@env"
import { useDrawerStatus } from '@react-navigation/drawer';
import React, { memo, useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, FlatList } from 'react-native';
import ActionSheet, { SheetManager } from "react-native-actions-sheet";
import Hamburger from 'react-native-animated-hamburger';
import { Appbar, Avatar, Button, FAB, Modal, Portal, Provider, Searchbar, IconButton } from 'react-native-paper';
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
const optionsPerPage = [2, 3, 4];

const Home = ({ navigation }: Props) => {

  const isDrawerVisible = useDrawerStatus();
  const [visible, setVisible] = React.useState(false);
  const { profile } = useLogin();
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const containerStyle = { width: '80%', marginLeft: '10%', backgroundColor: 'rgba(255,255,255,0)', padding: 20, TouchableOpacity: 0 };
  const [contentVisible, setContentVisible] = useState(false);
  const { barcode, SetBarcode } = useBarcode();


  const [page, setPage] = React.useState(0);
  const [itemsPerPage, setItemsPerPage] = React.useState(optionsPerPage[0]);

  const [sendingData, setSendingData] = useState([]);


  const DATA = [
    {
      id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
      title: 'Filetül',
      color: '#761532',
      onpress: "Barcode",
      icon: 'barcode',
      fontColor: '#ffffff'
    },
    {
      id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28bas',
      title: 'Redpep',
      color: '#CD0000',
      onpress: "Barcode",
      icon: 'barcode',
      fontColor: '#ffffff'
    },
    {
      id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28bas',
      title: 'Keyos',
      color: '#ff5a2a',
      onpress: "Barcode",
      icon: 'barcode',
      fontColor: '#ffffff'
    },
    {
      id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28bas',
      title: 'Sateks',
      color: '#000',
      onpress: "Barcode",
      icon: 'barcode',
      fontColor: '#ffffff'
    }
  ];




  React.useEffect(() => {
    setPage(0);

  }, [itemsPerPage]);

  useEffect(() => {
    if (isDrawerVisible) {
      setContentVisible(false);
    } else {
      setContentVisible(true);
    }
    setState({ open: false })
  }, [isDrawerVisible]);

  const _goBack = () => navigation.toggleDrawer();

  const _handleSearch = (query) => {

    Keyboard.dismiss()

    scanBarkod(barcode);
    SheetManager.show(Sheets.testSheet, { text: query });

  }


  const [state, setState] = React.useState({ open: false });




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

  const { open } = state;
  const actionSheetRef = useRef<ActionSheet>(null);

  return (
    <>
      <Appbar.Header>
        <TouchableOpacity onPress={_goBack}>
          <Avatar.Image
            style={{ marginLeft: 10 }}
            size={40}
            source={!profile?.avatar?.url ? require('../assets/man.png') : { uri: `${API_URL}${profile?.avatar?.url}` }}

          />
        </TouchableOpacity>
        <Appbar.Content title="Filetül" subtitle="Barkod Uygulaması" />
        <Appbar.Action icon="magnify" onPress={showModal} />

        <Hamburger type="cross" color={"#fff"} active={contentVisible} onPress={_goBack}
          underlayColor="transparent"
        >
        </Hamburger>
      </Appbar.Header>
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
      <View style={styles.container}>
        <Provider>
          <Portal>
            <FlatList
              data={DATA}
              numColumns={2}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => navigation.navigate(item.onpress)} style={{
                  flex: 1,
                  height: 150,
                  margin: 10,
                  borderRadius: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: item.color,

                }}>

                  <IconButton
                    icon={item.icon}
                    size={30}
                    color={item.fontColor}
                  />
                  <Text style={{ color: item.fontColor, fontSize: 18 }}>{item.title}</Text>

                </TouchableOpacity>
              )}
            />


            <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle} />
   

            <FAB
              icon="barcode"
              style={styles.fab}
              onPress={() => navigation.navigate('Barcode')}
              color="#ffffff"
            />


          </Portal>
        </Provider>
        <ActionSheet
          initialOffsetFromBottom={0.4}
          onBeforeShow={data => console.log(data)}
          id={Sheets.testSheet}
          statusBarTranslucent
          bounceOnOpen={true}
          drawUnderStatusBar={true}
          bounciness={4}
          gestureEnabled={true}
          keyboardDismissMode='interactive'
          keyboardHandlerEnabled={false}
          defaultOverlayOpacity={0.3}>
          <View
            style={{
              paddingHorizontal: 12,
            }}>

            <ScrollView
              nestedScrollEnabled
              onMomentumScrollEnd={() => {
                actionSheetRef.current?.handleChildScrollEnd();
              }}
              style={styles.scrollview}>
              <Text style={{ fontSize: 20, marginBottom: 20 }} >Sorgulanan Barkod</Text>

              <Text style={{ fontSize: 20, marginBottom: 20 }} > {barcode}</Text>

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
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
});


export default memo(Home);
