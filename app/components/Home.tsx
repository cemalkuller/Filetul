import { API_URL } from "@env"
import { useIsDrawerOpen } from '@react-navigation/drawer';
import { DrawerActions } from '@react-navigation/native'
import React, { memo, useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View  , FlatList} from 'react-native';
import ActionSheet, { SheetManager } from "react-native-actions-sheet";
import Hamburger from 'react-native-animated-hamburger';
import { Appbar, Avatar, Button, FAB, List, Modal, Portal, Provider, Searchbar , DataTable , IconButton , DefaultTheme } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLogin } from '../context/LoginProvider';
import { useBarcode } from '../context/LoginProvider';
import { Navigation } from '../types';
import { jwt } from '../api/client';
import Toast from 'react-native-toast-message';
type Props = {
  navigation: Navigation;
};
const Sheets = {
  testSheet: 'test_sheet_id',
};
const colors = ['#4a4e4d', '#0e9aa7', '#3da4ab', '#f6cd61', '#fe8a71'];
const optionsPerPage = [2, 3, 4];

const Home = ({ navigation }: Props) => {

  const isDrawerVisible = useIsDrawerOpen();
  const [visible, setVisible] = React.useState(false);
  const { profile, logOut } = useLogin();
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const containerStyle = { width: '80%', marginLeft: '10%', backgroundColor: 'rgba(255,255,255,0)', padding: 20, TouchableOpacity: 0 };
  const [contentVisible, setContentVisible] = useState(false);
  const { barcode, SetBarcode } = useBarcode();


  const [page, setPage] = React.useState(0);
  const [itemsPerPage, setItemsPerPage] = React.useState(optionsPerPage[0]);

  const [sendingData, setSendingData] = useState([]);

  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, sendingData?.length);


  const getFormFields = async () => {


    try {
        let Bearers = await AsyncStorage.getItem("jwt");

        try {
            const LangRes = await jwt(Bearers).get('Forms?limit=20&page=1');
            console.log(LangRes.data);
            setSendingData(LangRes?.data?.items);
           
        } catch (error) {
          console.log(error.response);
        }

    } catch (error) {
      console.log(error.response);
    }
}

React.useEffect(() => {
  getFormFields();
}, [navigation]);



  React.useEffect(() => {
    setPage(0);
  
  }, [itemsPerPage]);





  useEffect(() => {
    if (isDrawerVisible) {
      setContentVisible(true);
    } else {
      setContentVisible(false);
    }
    setState({ open: false })
  }, [isDrawerVisible]);

  const _renderItem = ({ item }) =>
  {
  
    return (

      <DataTable.Row>
        <DataTable.Cell style={{ flex: 2 }}>
        
          <Text>{item?.fullname}</Text>
          
          
        </DataTable.Cell>
        <DataTable.Cell style={{ flex: 2 }}>
          {item?.fair}
          </DataTable.Cell>
        <DataTable.Cell numeric>{item?.qty}</DataTable.Cell>
        <DataTable.Cell numeric>
        <IconButton  icon="arrow-right-bold-circle" 
       size={28}
       color={DefaultTheme.colors.primary}
   
    onPress={() => console.log('Pressed')}/>
          </DataTable.Cell>

       
      </DataTable.Row>
    );
  }
  

  const _goBack = () => navigation.dispatch(DrawerActions.openDrawer());

  const _handleSearch = (query) => {

    scanBarkod(barcode);
    SheetManager.show(Sheets.testSheet, { text: query });

  }

  const _handleMore = () => console.log('Shown more');

  const [state, setState] = React.useState({ open: false });

  const onStateChange = ({ open }) => setState({ open });

  const onItemsPerPageChange = () => {console.log("test")};


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
        if(userData)
        {
        
      const res = await  jwt(userData).post('product/search', { title: barcode});

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
            onBlur={query => { console.log("Barcode",query) }}
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
          <DataTable style={{height : "80%"}}>
      <DataTable.Header>
        <DataTable.Title  style={{ flex: 2 }}>Müşteri</DataTable.Title>
        <DataTable.Title  style={{ flex: 2 }}>Fuar</DataTable.Title>
        <DataTable.Title numeric>Adet</DataTable.Title>
        <DataTable.Title> </DataTable.Title>
      </DataTable.Header>

          {sendingData?.length ? 
           <FlatList data={sendingData} renderItem={_renderItem} />
           : <></>
          }

 

    </DataTable>

            <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
            </Modal>
            <FAB.Group
              open={open}
              icon={open ? 'barcode' : 'barcode'}
              actions={[]}
              onStateChange={() => navigation.navigate('Barcode')}
              color="#ffffff"

              fabStyle={{ backgroundColor: "#6200ee" }}
              onPress={() => {

                // navigation.navigate('Barcode')

              }}
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
  }
});

export default memo(Home);
