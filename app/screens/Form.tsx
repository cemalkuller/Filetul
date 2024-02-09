import { API_URL } from "@env"
import { useDrawerStatus } from '@react-navigation/drawer';
import { DrawerActions , useFocusEffect } from '@react-navigation/native';
import React, { memo, useEffect, useState } from 'react';

import { IMAGE_FOLDER } from "@env";
import { jwt } from '../api/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar, StyleSheet, View, Dimensions, Keyboard, ScrollView, TouchableWithoutFeedback, Alert ,TouchableOpacity } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useLogin } from '../context/LoginProvider';
import Toast from 'react-native-toast-message';
import * as ImagePicker from 'expo-image-picker';
import Background from '../components/BackgroundForm';
import DropDown from '../components/Dropdown';
import {InputField,TextArea} from '../components/InputField';
import Hamburger from 'tavukburger';
import {
    Appbar, 
    Provider,
    Surface,
    ActivityIndicator,
    Text
} from 'react-native-paper';
import { useBarcode } from '../context/LoginProvider';
import { Navigation } from '../types';
//import DropDown from "react-native-paper-dropdown";
import { ImageEditor } from "expo-image-editor";
import { Button as PButton, TextInput, Avatar as PAvatar ,  DarkTheme,
    DefaultTheme, } from 'react-native-paper';
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

const Home = ({ navigation }: Props) => {

    const [imageUri, setImageUri] = useState(undefined);
    const [editorVisible, setEditorVisible] = useState(false);
    const [imageData, setImageData] = useState(undefined);

    const isDrawerVisible = useDrawerStatus();
    const [contentVisible, setContentVisible] = useState(false);
    const { barcodes, SetBarcode, SetBarcodes } = useBarcode();

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
    const [aspectLock, setaspectLock] = useState(false);
    const [company, setCompany] = React.useState(null);
    const { profile } = useLogin();

    useFocusEffect(
        React.useCallback(() => {
          getCompany();
          return () => {
            // Your cleanup code when the screen is unfocused
          };
        }, [])
      );
      
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
            visibilityTime: 4000,
            text2: description ? description : 'Barkod Bulundu ve Listeye Eklendi 👋'
        });
    }

    const submitFile = async (file) => {
        try {
            const manipResult = await ImageManipulator.manipulateAsync(
                file.localUri || file.uri,
                [{ resize: { width: 800 } }],
                { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
            );
            console.log("Bu", manipResult);

            try {
                let localUri = manipResult.uri;
                let filename = localUri.split('/').pop();
                let match = /\.(\w+)$/.exec(filename);
                let type = match ? `image/${match[1]}` : `image`;

                let formData = new FormData();
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
                        console.log("Sonn", res.data);
                        showToast("success", "Kartvizit Yükleme", "Kartvizit Görüntüsü Başarıyla Yüklendi");
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
        setLoading(true);
        try {
            let Bearers = await AsyncStorage.getItem("jwt");

            try {
                const res = await jwt(Bearers).post('Templates', { "fair": Ffair, "langauge": Flang });
                console.log("Template", res);
                if (res.data) {
                    setLoading(false);
                    if (res?.data?.length) {
                        setTemplate(true);
                    }
                    else {
                        setTemplate(false);
                        showToast("error", "Gönderilecek Mail Şablonu Bulunamadı", "lütfen başka fuar seçiniz veya şablonu ekleyiniz");
                    }
                }
                else {
                }
            } catch (error) {
                setLoading(false);
                console.log(error);
            }
        } catch (error) {
            setLoading(false);
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
            "products": barcodes,
            "company" : company?.id
        }
        console.log(FormData);
        setLoading(true);
        try {
            let userData = await AsyncStorage.getItem("jwt");
            try {
                if (userData) {
                    const res = await jwt(userData).post('saveForm', FormData);
                    console.log(res?.data);
                    setLoading(false);
                    SetBarcodes([]);
                    SetBarcode('');
                    setTemplate(false);
                    SetFfair("");
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
        if (Ffair && Flang) {
            getTemplates();
        }
    }, [Ffair, Flang]);

    useEffect(() => {
        console.log(Formdata);
    }, [Formdata]);

    useEffect(() => {
        console.log(imageData);
    }, [imageData]);

    const _goBack = () => navigation.dispatch(DrawerActions.openDrawer());
    const goBack = () => { navigation.navigate('Barcode') }

    const openCam = async () => {
        const response = await ImagePicker.requestCameraPermissionsAsync();
        if (response.granted) {
            const pickerResult = await ImagePicker.launchCameraAsync();
            if (!pickerResult.canceled) {
                console.log("Resim", pickerResult?.assets[0]?.uri);
                launchEditor(pickerResult?.assets[0]?.uri);
            }
        } else {
            Alert.alert(
                "Please enable camera roll permissions for this app in your settings."
            );
        }
    };

    const launchEditor = (uri: string) => {
        setImageUri(uri);
        setEditorVisible(true);
    };

    return (
        <Background>
            <Provider theme={DefaultTheme}>
                <StatusBar
                    backgroundColor={DefaultTheme.colors.primary}
                    barStyle={"light-content"}
                />
                 <View style={{
        width: '100%',

        justifyContent: 'flex-start',
        borderRadius: 20,
        paddingBottom: 20,
        backgroundColor: '#000000',
        opacity: 1,
        elevation: 5,

      }}>
        <Appbar.Header style={styles.appBar}>
        <Appbar.BackAction onPress={goBack} color="#ffffff" />
       


          <Appbar.Content style={{ alignItems: 'flex-start',  }} subtitleStyle={{fontSize : 18}} title={"Merhaba"} subtitle={profile?.title} color="#ffffff" />
          <Hamburger type="cross" color={"#fff"} active={contentVisible} onPress={_goBack}
            underlayColor="transparent"
          >
          </Hamburger>
          <TouchableOpacity onPress={_goBack} >


            <PAvatar.Image
              style={{ marginLeft: 10 }}
              size={40}
              source={!profile?.avatar?.url ? require('../assets/man.png') : { uri: `${API_URL}${profile?.avatar?.url}` }}

            />
          </TouchableOpacity>
          
        </Appbar.Header>
        <View style={styles.searchBar}>
            <Text style={{color : "#ffffff", fontSize : 16 , marginTop : 15}} >{company?.title} Firmasında</Text>
          <Text style={{color : "#ffffff", fontSize : 20 , marginTop : 5}}>{barcodes?.length } ürün için form oluştur.</Text>
         
        </View>

      </View>


        

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
                                />}
                                <View style={styles.listContainer}></View>
                                <DropDown
                                    label={"Dil Seçiniz"}
                                    mode={"outlined"}
                                    visible={showMultiSelectDropDown}
                                    showDropDown={() => setShowMultiSelectDropDown(true)}
                                    onDismiss={() => setShowMultiSelectDropDown(false)}
                                    value={Flang}
                                    placeholder="Dil Seçimi Yapınız"
                                    setValue={(e) => { SetFlang(e); SetFfair("") }}
                                    list={allLangs}
                                    disabled={false}
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
                                    disabled={!Flang}
                                   
                                />
                                <View style={styles.spacerStyle} />
                                <InputField
                                    label="Müşteri Adı Soyadı"
                                    value={FCustomerName}
                                    onChangeText={text => setFCustomerName(text)}
                                    disabled={!Flang || !Ffair || !template }
                                />
                             
                                <InputField
                                    keyboardType='email-address'
                                    autoCapitalize='none'
                                    autoCorrect={false}
                                    label="Müşteri E-Posta"
                                    value={FCustomerEmail}
                                    onChangeText={text => setFCustomerEmail(text)}
                                    disabled={!Flang || !Ffair || !template }
                                />
                              
                                <TextArea
                                    value={FDescription}
                                    label="Eklemek İstediğiniz Not"
                                    onChangeText={(Description) => { setDescription(Description) }}
                                    disabled={!Flang || !Ffair || !template }
                                />
                                <View style={styles.spacerStyle} />
                                <View>
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
                                        : <PButton icon="credit-card-scan" mode="outlined"   labelStyle={{color : "#000000" , height : 35 , lineHeight : 35}} contentStyle={{ flexDirection: 'row-reverse'  }} disabled={!Flang || !Ffair || !template } onPress={() => openCam()}> Kartvizit Seçiniz</PButton>
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
                                <PButton
                                    style={{
                                        marginTop: 20,
                                        height: 80,
                                        marginLeft: 0,
                                        marginRight: 0,
                                        justifyContent: 'center',
                                        
                                    }}
                                    color="#000000"
                                    disabled={!template || !FCustomerName || !FCustomerEmail || !Ffair ? true : false}
                                    contentStyle={{ flexDirection: 'row-reverse' }}
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
        margin : 0
    },
    spacerStyle: {
        marginBottom: 15,
    },
    safeContainerStyle: {
        flex: 1,
        margin: 20,
    },
    listContainer: {
        height: ITEM_WIDTH + 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    appBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        padding: 15,
        backgroundColor: 'transparent', // Arka plan rengi
        elevation: 0,
    
    
      },
      searchBar: {
        flexDirection: "column", // Yatayda sıralama
        alignItems: 'center', // Dikeyde hizalama
        paddingHorizontal: 16, // Yatayda iç boşluk
        width: '90%', // Yatayda %100 genişlik
        padding: 20,
        paddingTop: 10,
        marginLeft: '5%',
        justifyContent : "center"
      },
});

export default memo(Home);
