import { API_URL } from "@env"
import { useIsDrawerOpen } from '@react-navigation/drawer';
import { DrawerActions } from '@react-navigation/native'
import React, { memo, useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ActionSheet, { SheetManager } from "react-native-actions-sheet";
import Hamburger from 'react-native-animated-hamburger';
import { Appbar, Avatar, Button, FAB, List, Modal, Portal, Provider, Searchbar } from 'react-native-paper';

import { useLogin } from '../context/LoginProvider';
import { useBarcode } from '../context/LoginProvider';
import { Navigation } from '../types';

type Props = {
  navigation: Navigation;
};
const Sheets = {
  testSheet: 'test_sheet_id',
};
const colors = ['#4a4e4d', '#0e9aa7', '#3da4ab', '#f6cd61', '#fe8a71'];

const Home = ({ navigation }: Props) => {

  const isDrawerVisible = useIsDrawerOpen();
  const [visible, setVisible] = React.useState(false);
  const { profile , logOut } = useLogin();
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const containerStyle = { width: '80%', marginLeft: '10%', backgroundColor: 'rgba(255,255,255,0)', padding: 20, TouchableOpacity: 0 };
  const [contentVisible, setContentVisible] = useState(false);
  const { barcode, SetBarcode } = useBarcode();


  useEffect(() => {
    if (isDrawerVisible) {
      setContentVisible(true);
    } else {
      setContentVisible(false);
    }
    setState({ open: false })
  }, [isDrawerVisible]);



  const _goBack = () => navigation.dispatch(DrawerActions.openDrawer());

  const _handleSearch = (query) => {

    SheetManager.show(Sheets.testSheet, { text: query });

  }

  const _handleMore = () => console.log('Shown more');

  const [state, setState] = React.useState({ open: false });

  const onStateChange = ({ open }) => setState({ open });

  const { open } = state;
  const actionSheetRef = useRef<ActionSheet>(null);

  return (
    <>
      <Appbar.Header>
        

        <TouchableOpacity onPress={_goBack}>
          
          <Avatar.Image
          style={{marginLeft : 10}}
            size={40}
            source={ !profile?.avatar?.url ?  require('../assets/man.png') : { uri: `${API_URL}${profile?.avatar?.url}`} }
            
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
          style={{textAlign : 'center'}}
        />
        <Button disabled={!barcode} icon="barcode"  mode="contained" style={{width : '60%' , marginLeft : '20%' ,  marginTop : 20 , marginBottom : 20}} onPress={() => _handleSearch(barcode)}>
        Arama Yap
      </Button>
      </>
        : <></>
      }
      <View style={styles.container}>

        <Provider>
          <Portal>

            <List.AccordionGroup>
              <List.Accordion expanded={true} title="Geçmiş Taramalar" id="1">
                <List.Item
                  title="Cemal Küller"
                  description="1234567899"
                  left={props => <List.Icon {...props} icon="barcode" />}
                />
              </List.Accordion>
              <List.Accordion title="Mail Gönderilenler" id="2">
                <List.Item
                  title="First Item"
                  description="Item description"
                  left={props => <List.Icon {...props} icon="folder" />}
                />
              </List.Accordion>

            </List.AccordionGroup>
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
