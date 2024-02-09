import React, { useState , useRef } from 'react';
import { View,  StyleSheet, Image , TouchableOpacity , TouchableWithoutFeedback , ScrollView} from 'react-native';
import { ActivityIndicator, List, Divider, Button } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { FlatGrid } from 'react-native-super-grid';
import { DrawerActions } from '@react-navigation/native';
import { StatusBar } from 'react-native';
import Background from '../components/BackgroundForm';
import {displayCameraActivityFailedAlert} from '../components/AlertCamera';
import { Navigation } from '../types';
import { connect } from 'react-redux';

import {
  Appbar,
  DefaultTheme,
  Text,
  Provider,
} from 'react-native-paper';
import Hamburger from 'tavukburger';
import { FAB } from 'react-native-paper';
import ActionSheet from "react-native-actions-sheet";
import Toast from 'react-native-toast-message';

type Props = {
  navigation: Navigation;
};

const FileUploadForm = ({ navigation , dynamicUrl }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [searchType, setSearchType] = useState('search_similar');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [contentVisible, setContentVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const actionSheetRef = React.createRef<ActionSheet>();
  const actionSheetRefModal = useRef<ActionSheet>();

  const [selectedBarkod, setselectedBarkod] = useState(null);


  const _goBack = () => navigation.dispatch(DrawerActions.openDrawer());
  const goBack = () => {
    navigation.navigate('Home');
  };


  const showToast = (type = null, title = null, description = null, position = null) => {
    Toast.show({
      position: position ? position : 'top',
      type: type ? type : 'success',
      text1: title ? title : 'Barkod Bulundu',
      visibilityTime: 2000,
      text2: description ? description : 'Barkod Bulundu ve Listeye Eklendi 👋'
    });
  }

  const handleImagePickerOption = async (option: string) => {
    setMenuVisible(false);

    let result;

    if (option === 'camera') {
      try {
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });
      } catch (e) {
        if (e.message.includes("Call to function 'ExponentImagePicker.launchCameraAsync' has been rejected")) {
          displayCameraActivityFailedAlert();
        } else {
          throw e;
        }
      }
      
    } else if (option === 'gallery') {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
    }

    if (!result.canceled) {
      actionSheetRef.current?.setModalVisible(false);
      setResults([]);
      setSelectedFile(result);
     
    }
  };

  const handleSubmit = async () => {
    setLoading(true);

    let resizedImage = selectedFile;

    const manipResult = await manipulateAsync(
      selectedFile.assets[0].uri,
      [{ resize: { width: 500 } }],
      { compress: 1, format: SaveFormat.JPEG }
    );

    resizedImage = manipResult;
    const formData = new FormData();
    formData.append('image', JSON.parse(JSON.stringify({ uri: resizedImage.uri, type: 'image/jpeg', name: 'image.jpg' })));
    formData.append('searchType', searchType);
      console.log(dynamicUrl);
    try {
      const response = await fetch(dynamicUrl + searchType, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.ok) {
        const data = await response.json();

        setResults(data.slice(0, 20));
      } else {
        setLoading(false);
        console.log('Hata: İstek gerçekleştirilemedi.');
      }
    } catch (error) {
      setLoading(false);
      console.log('Hata: İstek gerçekleştirilemedi.', error);
    }

    setLoading(false);
  };

  const handleActionPress = async (imageName: string) => {
    console.log("imageName",imageName);
    setLoading(true);
    const query = { query: imageName };
    try {
     
      const response = await fetch(dynamicUrl+'query_firebird', {
        method: 'POST',
        body: JSON.stringify(query),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        actionSheetRefModal?.current?.setModalVisible(true);
        setLoading(false);
        const data = await response.json();
        setselectedBarkod(data);
       
      } else {
        showToast("error", "Hata Oluştu", "Ürün Bulunamadı ", "top");
      
        setLoading(false);
      }
     
    } catch (error) {
      showToast("error", "Hata Oluştu", error , "top");
      
      console.log('Hata: İstek gerçekleştirilemedi.', error);
      setLoading(false);
    }

  };

  return (
    <Background>
      <Provider theme={DefaultTheme}>
        <StatusBar
          backgroundColor={DefaultTheme.colors.primary}
          barStyle={'light-content'}
        />
        <Appbar.Header>
          <Appbar.BackAction onPress={goBack} />
          <Appbar.Content
            title="Resimden Kumaş Arama"
            subtitle="Lütfen Formu Eksiksiz Doldurun"
          />
          <Hamburger
            type="cross"
            color={'#fff'}
            active={contentVisible}
            onPress={_goBack}
            underlayColor="transparent"
          />
        </Appbar.Header>
        <View style={styles.container}>
        
          <View style={styles.fileContainer}>
            <View style={styles.switchContainer}>
              {selectedFile && (
                <>
                  <Image
                    source={{ uri: selectedFile.assets[0].uri }}
                    style={styles.imagePreview}
                  />
                  <FAB
                    small
                    icon="refresh"
                    onPress={() => actionSheetRef.current?.setModalVisible(true)}
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: 30,
                      position: 'absolute',
                      bottom: 20,
                      display: 'flex',
                      right: 10,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#ffffff',
                    }}
                  />
                </>
              )}
            </View>
          </View>
          {!selectedFile && 
          <Button onPress={() => actionSheetRef.current?.setModalVisible(true)}>
            {'Resim Seç'}
         
          </Button>
          }
          <Button
            mode="contained"
            style={{ marginTop: 0 }}
            onPress={handleSubmit}
            disabled={!selectedFile || loading}
          >
            Kumaşı Ara
          </Button>

          {loading && (
            <View
              style={[styles.loadingOverlay, styles.loadingOverlayShow]}
            >
              <ActivityIndicator
                size="large"
                color="#ffffff"
                
              />
            </View>
          )}
          {results && (
            <FlatGrid
              itemDimension={130}
              data={results}
              renderItem={({ item }) => (
       
                  <TouchableOpacity onPress={() => handleActionPress(item.image)}>
                    <Image
                      source={{
                        uri: `http://filetul.ngrok.app/images/${item.image}`,
                      }}
                      style={styles.resultItemImg}
                    />
                
                  <Text style={{position :  'absolute' , backgroundColor : '#6000ec', color : '#fff' , padding : 10 , bottom : 20 , left : 20}} >{Math.round(item.similarity)}%</Text>
                </TouchableOpacity>
              )}
            />
          )}
             <ActionSheet ref={actionSheetRefModal}
              initialOffsetFromBottom={0.8}
              onBeforeShow={data => console.log(data)}
       
              statusBarTranslucent
              bounceOnOpen={true}
              drawUnderStatusBar={true}
              bounciness={10}
              gestureEnabled={true}
              keyboardDismissMode='interactive'
              keyboardHandlerEnabled={false}
              defaultOverlayOpacity={0.7}
             >
        <View
                style={{
                  paddingHorizontal: 12,
                }}>
                <Appbar.Header style={{ backgroundColor: 'transparent' }}   >
                  <Appbar.BackAction  onPress={() => {
                       actionSheetRefModal?.current?.setModalVisible(false);
                        }} />
                  <Appbar.Content title={selectedBarkod?.product_name} />
                </Appbar.Header>
                <Divider />

                <TouchableWithoutFeedback  >
                  <ScrollView
                    keyboardShouldPersistTaps="always"
                    keyboardDismissMode='on-drag'

                    automaticallyAdjustContentInsets={false}
                    horizontal={false}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    nestedScrollEnabled
                    onMomentumScrollEnd={() => {
                      actionSheetRefModal?.current?.handleChildScrollEnd();
                    }}
                    style={styles.scrollview}
                  >


                    <Image style={styles.image} source={!selectedBarkod?.image ? require('../assets/noproduct.png') : { uri: `${selectedBarkod?.image}` }} />

                  <List.Section>
                  <List.Item
                      
                        title={"Kumaş Kodu"}
                        description={selectedBarkod?.barcode}
                       
                      />
                         <Divider />
                      <List.Item
                      
                        title={"Ürün Adı"}
                        description={selectedBarkod?.product_name}
                       
                      />
                         <Divider />
                
                <List.Item
               
                  title={"Kompozisyon"}
                  description={selectedBarkod?.product_description}
                 
                />
                      <Divider />
                
                      <List.Item
                       
                        title={"Genişlik"}
                        description={selectedBarkod?.width}
                       
                      />
                     <Divider />
                
                <List.Item
               
                  title={"Gramaj"}
                  description={selectedBarkod?.weight}
                 
                />
                 
                    
                    
                    </List.Section>
                 

                    <View style={styles.footer} />
                  </ScrollView>
                </TouchableWithoutFeedback>
              </View>
      </ActionSheet>
        </View>
        <ActionSheet ref={actionSheetRef}>
          <View style={styles.actionSheetContainer}>
            <Button
              onPress={() => handleImagePickerOption('camera')}
              style={styles.actionSheetButton}
            >
              Kamera
            </Button>
            <Button
              onPress={() => handleImagePickerOption('gallery')}
              style={styles.actionSheetButton}
            >
              Galeri
            </Button>
            <Button
              onPress={() => actionSheetRef.current?.setModalVisible(false)}
              style={styles.actionSheetCancelButton}
            >
              İptal
            </Button>
          </View>
        </ActionSheet>
      </Provider>
    </Background>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginBottom: 20,
    fontSize: 20,
    fontWeight: 'bold',
  },
  fileContainer: {
    marginTop: 10,
    marginBottom: 10,
  },
  imagePreview: {
    width: 100,
    height: 150,
    marginTop: 10,
    marginBottom: 10,
    flex: 1,
    padding: 20,
    backgroundColor: '#000000',
    borderRadius: 30,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    opacity: 0,
    visibility: 'hidden',
    transition: 'opacity 0.3s ease, visibility 0.3s ease',
  },
  loadingOverlayShow: {
    opacity: 1,
    visibility: 'visible',
  },
  loadingSpinner: {
    width: 40,
    height: 40,
    borderWidth: 4,
    borderColor: '#f3f3f3',
    borderTopColor: '#3498db',
    borderRadius: 50,
    animationDuration: '1s',
    animationTimingFunction: 'linear',
    animationIterationCount: 'infinite',
  },
  resultContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 20,
  },
  resultItem: {
    flexBasis: '20%',
    padding: 10,
    boxSizing: 'border-box',
  },
  resultItemImg: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },
  resultItemDetails: {
    textAlign: 'center',
  },
  resultItemTitle: {
    marginBottom: 5,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '80%',
  },
  switchText: {
    fontSize: 16,
  },
  actionSheetContainer: {
    padding: 20,
  },
  actionSheetButton: {
    marginBottom: 10,
  },
  actionSheetCancelButton: {
    marginTop: 10,
  },
  scrollview: {
    width: '100%',
    height: '100%',
    padding: 0,
  },
  image: {
    width: "100%",
    height: 300,
  },
  footer: {
    height: 200,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
const mapStateToProps = state => ({
  dynamicUrl: state.dynamicUrl,
});

export default connect(mapStateToProps)(FileUploadForm);
