import { useDrawerStatus } from '@react-navigation/drawer';
import { DrawerActions } from '@react-navigation/native'
import React, { memo, useEffect, useState } from 'react';
import { IMAGE_FOLDER } from "@env"
import { jwt } from '../api/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { KeyboardAvoidingView, StatusBar, StyleSheet, View, Dimensions, Keyboard, ScrollView, TouchableWithoutFeedback, Text, FlatList, TouchableOpacity, Alert, Image } from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import Toast from 'react-native-toast-message';
import * as ImagePicker from 'expo-image-picker';
import Background from '../components/BackgroundForm';
import Hamburger from 'react-native-animated-hamburger';
import {
    Appbar, Avatar, DefaultTheme,
    Provider,
    Surface,
    ThemeProvider,
    ActivityIndicator
} from 'react-native-paper';
import { useBarcode } from '../context/LoginProvider';
import { Navigation } from '../types';
import DropDown from "react-native-paper-dropdown";
import { ImageEditor } from "expo-image-editor";
import { imageUrl } from "../helpers"
import { Button as PButton, TextInput, Avatar as PAvatar } from 'react-native-paper';
import * as ImageManipulator from 'expo-image-manipulator';


type Props = {
    navigation: Navigation;
};
interface TForm {
    lang?: any;
    fair?: any;
    template?: any;
}


const { width: SCREEN_WIDTH } = Dimensions.get('window');
const ITEM_WIDTH = SCREEN_WIDTH / 5;
const ratio = SCREEN_WIDTH / 541;




const Home = ({ navigation }: Props) => {


    const [imageUri, setImageUri] = useState(undefined);
    const [editorVisible, setEditorVisible] = useState(false);


    const [imageData, setImageData] = useState(undefined);
    const [aspectLock, setaspectLock] = useState(false);

    const isDrawerVisible = useDrawerStatus();
    const [contentVisible, setContentVisible] = useState(false);
    const { barcodes , SetBarcode , SetBarcodes} = useBarcode();

    const [showDropDown, setShowDropDown] = useState(false);
    const [showMultiSelectDropDown, setShowMultiSelectDropDown] = useState(false);
    const [bearer, SetBearer] = useState("");
    const [allfairs, allsetFairs] = useState([]);
    const [allLangs, setAllLangs] = useState([]);

    const [Formdata, SetformData] = React.useState<Partial<TForm>>({});
    const [loading, setLoading] = useState(false);
    const [template, setTemplate] = useState(false);

    const [Ffair, SetFfair] = useState("");
    const [Flang, SetFlang] = useState("");

    const [FDescription, setDescription] = React.useState('');
    const [FCustomerName, setFCustomerName] = React.useState("");
    const [FCustomerEmail, setFCustomerEmail] = React.useState("");

    const DDFormat = (data, functions, label) => {
        var values = [{ value: '', label: 'Seçim Yapınız' }];
        if (data?.length) {
            console.log(data);
            data?.map((data) => {
                values.push({
                    label: data?.label,
                    value: data?.id,
                })
            });
        }
        if (functions === 'allsetFairs') {
            allsetFairs(values);
        }
        else if (functions === "setAllLangs") {
            setAllLangs(values);
        }
        
        return values;
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
  
      const submitFile = async (file) => {

      
        try {


                
            const manipResult = await ImageManipulator.manipulateAsync(
                file.localUri || file.uri,
              [{ resize: { width: 800} }],
              { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
            ); 
            console.log("Bu",manipResult);
       
        try {


            let localUri = manipResult.uri;
            let filename = localUri.split('/').pop();

            // Infer the type of the image
            let match = /\.(\w+)$/.exec(filename);
            let type = match ? `image/${match[1]}` : `image`;

            // Upload the image using the fetch and FormData APIs
            let formData = new FormData();
            // Assume "photo" is the name of the form field the server expects
            formData.append('Getfile', { uri: localUri, name: filename, type });


            let Bearers = await AsyncStorage.getItem("jwt");
            setLoading(true);
            try {
                const res = await jwt(Bearers).post('BusinessCard', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                if (res.data) {

                    setImageData(res?.data?.image);
                    console.log(res.data);
                    showToast("success","Kartvizit Yükleme","Kartvizit Görüntüsü Başarıyla Yüklendi");
                }
                else {
                }
                setLoading(false);
            } catch (error) {
                console.log(error);
                setLoading(false);
            }



        } catch (error) {
            console.log(error);
            setLoading(false);
        }
        } catch (error) {
            console.log(error);
        
        }
    }


    const getFormFields = async () => {


        try {
            let Bearers = await AsyncStorage.getItem("jwt");


            try {
                const res = await jwt(Bearers).get('Fairs');
                if (res.data) {
                    DDFormat(res.data, "allsetFairs", "label");
                }
                else {
                }
                SetBearer(Bearers);
            } catch (error) {
                console.log(error);
            }

            //Lang

            try {
                const LangRes = await jwt(Bearers).get('Languages');
                console.log(LangRes.data);
                if (LangRes.data) {
                    DDFormat(LangRes.data, "setAllLangs", "label");
                }
                else {
                }
            } catch (error) {
                console.log(error);
            }

        } catch (error) {

        }
    }

    const getTemplates = async () => {

        try {
            let Bearers = await AsyncStorage.getItem("jwt");


            try {
                const res = await jwt(Bearers).post('Templates' , {"fair": Ffair, "langauge": Flang});
                console.log("Template",res);
                if (res.data) {
                    if(res?.data?.length)
                    {
                        setTemplate(true);
                    }
                   else 
                   {
                    setTemplate(false);
                     showToast("error", "Gönderilecek Mail Şablonu Bulunamadı", "top");
                   }
                }
                else {
                }
        
            } catch (error) {
                console.log(error);
            }

        } catch (error) {

        }
    }

    const FormPost = async () => {

        const FormData = {
            "name": FCustomerName,
            "mail": FCustomerEmail,
            "description": FDescription,
            "fair_id": Ffair,
            "language_id": Flang,
            "image": imageData,
            "products": barcodes
          }
          console.log(FormData);
          setLoading(true);
          try {
            let userData = await AsyncStorage.getItem("jwt");
            try {
              if(userData)
              {
              
            const res = await  jwt(userData).post('saveForm', FormData);
            console.log(res?.data);
            setLoading(false);
        
            SetBarcodes([]); 
            SetBarcode('');
            SetBarcodes([]); 
            SetBarcode('');
            setTemplate(false);
            SetFfair("");
            setDescription("");
            SetFlang("");
            setFCustomerName("");
            setFCustomerEmail("");
            setDescription("");


            navigation.navigate('SuccessPage');
            if (res?.data?.success) {
              console.log(res?.data);
             
           
            }
            else {
                console.log(res?.data);
                setLoading(false);
            }
              }
          } catch (error) {
       
            console.log(error.response.data);
            setLoading(false);
      
          }
      
      
          } catch (error) {
      

            setLoading(false);
           
      
          }



    }
    useEffect(() => {
        getFormFields();
        setLoading(false);
        setImageData(null);
    }, [bearer]);

    useEffect(() => {
      
        if(Ffair && Flang)
        {
            getTemplates();
        }

    }, [Ffair,Flang]);

    

    useEffect(() => {

        console.log(Formdata);

    }, [Formdata]);

    useEffect(() => {

        console.log(imageData);

    }, [imageData]);



    const _goBack = () => navigation.dispatch(DrawerActions.openDrawer());
    const goBack = () => { navigation.navigate('Barcode') }


    const openCam = async () => {
        // Get the permission to access the camera roll
        const response = await ImagePicker.requestCameraPermissionsAsync();
        // If they said yes then launch the image picker
        if (response.granted) {
            const pickerResult = await ImagePicker.launchCameraAsync();
            // Check they didn't cancel the picking
            if (!pickerResult.canceled) {
                                console.log("Resim",pickerResult?.assets[0]?.uri);
                launchEditor(pickerResult?.assets[0]?.uri);
            }
        } else {
            // If not then alert the user they need to enable it
            Alert.alert(
                "Please enable camera roll permissions for this app in your settings."
            );
        }
    };

    const launchEditor = (uri: string) => {
        // Then set the image uri
        setImageUri(uri);
        // And set the image editor to be visible
        setEditorVisible(true);
    };


    return (
        <Background>

        
            <Provider theme={DefaultTheme}>

              
                    <StatusBar
                        backgroundColor={
                            DefaultTheme.colors.primary
                        }
                        barStyle={"light-content"}
                    />
                    <Appbar.Header>
                        <Appbar.BackAction onPress={goBack} />


                        <Appbar.Content title="Yeni Form Oluşturma" subtitle="Lütfen Formu Eksiksiz Doldurun" />

                        <Hamburger type="cross" color={"#fff"} active={contentVisible} onPress={_goBack}
                            underlayColor="transparent"
                        >
                        </Hamburger>
                    </Appbar.Header>
                    <Surface style={styles.containerStyle}>
                    <KeyboardAwareScrollView 
                    style={styles.containerStyle} 
                    keyboardShouldPersistTaps="never"
                    onKeyboardWillShow={(frames: Object) => {
                        console.log('Keyboard event', frames)
                      }}
                      extraHeight={200}
                      enableOnAndroid={true}
                      enableResetScrollToCoords={true}
                    >
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}  >
                            <ScrollView
                                keyboardShouldPersistTaps={true}
                                keyboardDismissMode='on-drag'
                                ref={React.useRef()}
                                automaticallyAdjustContentInsets={false}
                                horizontal={false}
                                showsVerticalScrollIndicator={false}
                                showsHorizontalScrollIndicator={false}
                                style={styles.safeContainerStyle}
                            >

                                {loading && <ActivityIndicator
                                    animating={true}
                                    color='black'
                                    size={'large'}
                                    style={{
                                        position: 'absolute',
                                        left: 0,
                                        right: 0,
                                        top: 0,
                                        bottom: 0,
                                        alignItems: 'center',
                                        backgroundColor: 'rgba(255,255,255,0.5)',
                                        justifyContent: 'center',
                                        zIndex: 99
                                    }}
                                />
                                }
                                <View style={styles.listContainer}>
                                   
                                </View>

                               

                                <DropDown
                                    label={"Dil Seçiniz"}
                                    mode={"outlined"}
                                    visible={showMultiSelectDropDown}
                                    showDropDown={() => setShowMultiSelectDropDown(true)}
                                    onDismiss={() => setShowMultiSelectDropDown(false)}
                                    value={Flang}
                                    placeholder="Dil Seçimi Yapınız"
                                    setValue={(e) => { SetFlang(e) ; SetFfair("") }}
                                    list={allLangs}
                                />
                                <View style={styles.spacerStyle} />
                                <DropDown
                                    label={"Fuar Seçiniz"}
                                    mode={"outlined"}
                                    visible={showDropDown}
                                    showDropDown={() => Flang ? setShowDropDown(true) : setShowDropDown(false)}
                                    onDismiss={() => setShowDropDown(false)}
                           
                                    value={Ffair}
                                    placeholder="Fuar Seçimi Yapınız"
                                    setValue={(e) => { SetFfair(e) }}
                                    list={allfairs}
                                    inputProps={{
                                        //Part 2: Passing boolean to disable textInput.
                                        disabled: !Flang,
                                      }}
                                />
                                <View style={styles.spacerStyle} />
                                <TextInput
                                    label="Müşteri Adı Soyadı"
                                    value={FCustomerName}
                                    onChangeText={text => setFCustomerName(text)}
                                    mode="outlined"
                                  //  disabled={!template}
                                />
                                <View style={styles.spacerStyle} />

                                <TextInput
                                   // disabled={!template}
                                    keyboardType='email-address'
                                    autoCapitalize='none'
                                    autoCorrect={false}
                                    mode="outlined"
                                    label="Müşteri E-Posta"
                                    value={FCustomerEmail}
                                    onChangeText={text => setFCustomerEmail(text)}
                                />
                                <View style={styles.spacerStyle} />

                                <TextInput
                                    //disabled={!template}
                                    multiline
                                    mode="outlined"
                                    numberOfLines={4}
                                    value={FDescription}
                                    label="Eklemek İstediğiniz Not"
                                    style={{ minHeight: 100, }}
                                    autoCapitalize='none'
                                    autoCorrect={false}
                                    onChangeText={(Description) => { setDescription(Description) }}
                                />
                         
                                <View style={styles.spacerStyle} />
                                <View >
                                    {imageData ?

                                        <View style={{ borderRadius: 500, overflow: 'hidden', width: (SCREEN_WIDTH - 40) / 2, height: (SCREEN_WIDTH - 40) / 2, marginLeft: '25%', display: 'flex', alignContent: 'center', alignItems: 'center' }}>
                                            <View style={{
                                                width: (SCREEN_WIDTH - 40) / 2, height: (SCREEN_WIDTH - 40) / 2, backgroundColor: "rgba(0,0,0,0.5)",
                                                position: 'absolute', zIndex: 3
                                            }}>
                                                <PButton style={{ marginTop: '40%' }} color="white" icon="refresh" onPress={() => openCam()}> Değiştir</PButton>
                                            </View>
                                            <PAvatar.Image size={(SCREEN_WIDTH - 40) / 2} style={{ marginBottom: 20 }} source={{ uri: IMAGE_FOLDER + imageData }} />

                                        </View>

                                        : <PButton icon="arrow-right" mode="text" disabled={ !template  ? true  : false} onPress={() => openCam()}> Kartvizit Seçiniz</PButton>
                                    }



                                    <ImageEditor
                                        visible={editorVisible}
                                        onCloseEditor={() => setEditorVisible(false)}
                                        imageUri={imageUri}
                                      
                                        lockAspectRatio={aspectLock}
                                        minimumCropDimensions={{
                                            width: 100,
                                            height: 100,
                                        }}
                                        onEditingComplete={(result) => {

                                            submitFile(result);
                                        }}
                                        mode="crop-only"
                                    />
                                </View>
                                
                                <View style={styles.spacerStyle} />
                                <View style={styles.spacerStyle} />



                                <PButton style={{
                                    marginTop: 20,
                                    height: 50,
                                    marginLeft: 0,
                                    marginRight: 0,
                                    justifyContent: 'center',
                                    }}
                                    disabled={ !template || !FCustomerName  || !FCustomerEmail || !Ffair ? true  : false}

                                    icon="arrow-right" mode="contained" onPress={() => FormPost()}  > E-Postayı Gönder</PButton>
                                <View style={styles.spacerStyle} />
                                <View style={styles.spacerStyle} />
                                <View style={styles.spacerStyle} />

                            </ScrollView>
                        </TouchableWithoutFeedback>
                        </KeyboardAwareScrollView>
                    </Surface>
               
            </Provider>

            

        </Background>
    );
};





const styles = StyleSheet.create({
    containerStyle: {
        flex: 1,
    },
    spacerStyle: {
        marginBottom: 15,
    },
    safeContainerStyle: {
        flex: 1,
        margin: 20,

    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#efefef',
    },
    listContainer: {
        height: ITEM_WIDTH + 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    list: {
        height: ITEM_WIDTH * 2,
        flexGrow: 0,

    },
    box: {
        width: ITEM_WIDTH,
        height: ITEM_WIDTH,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',

        elevation: 12,
    },
    label: {
        fontWeight: 'bold',
        fontSize: 12,
        color: DefaultTheme.colors.primary,
    },
});
export default memo(Home);
