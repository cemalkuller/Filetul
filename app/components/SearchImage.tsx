import React, { useState } from 'react';
import { View, ActivityIndicator, StyleSheet, Image } from 'react-native';
import { Button, Switch } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { FlatGrid } from 'react-native-super-grid';
import { DrawerActions } from '@react-navigation/native'
import { StatusBar } from 'react-native';
import Background from '../components/BackgroundForm';
import { Navigation } from '../types';
import {
  Appbar, DefaultTheme,Text,
  Provider} from 'react-native-paper';
import Hamburger from 'react-native-animated-hamburger';

type Props = {
  navigation: Navigation;
};

const FileUploadForm = ({ navigation }: Props) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [searchType, setSearchType] = useState('compare_colors');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [contentVisible, setContentVisible] = useState(false);
  const onToggleSwitch = () => setSearchType(searchType == 'compare_colors' ? "compare" : 'compare_colors');
  const _goBack = () => navigation.dispatch(DrawerActions.openDrawer());
  const goBack = () => { navigation.navigate('Home') }
  const handleFileSelect = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
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

    try {
      const response = await fetch('https://18b3-46-1-133-202.ngrok-free.app/'+searchType, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setResults(data.results);
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


                <Appbar.Content title="Resimden Kumaş Arama" subtitle="Lütfen Formu Eksiksiz Doldurun" />

                <Hamburger type="cross" color={"#fff"} active={contentVisible} onPress={_goBack}
                    underlayColor="transparent"
                >
                </Hamburger>
            </Appbar.Header>
    <View style={styles.container}>
  
      <View style={styles.fileContainer}>
      
      <View style={styles.switchContainer}>
        {selectedFile && (
          <Image
            source={{ uri: selectedFile.assets[0].uri }}
            style={styles.imagePreview}
          />
        )}
        </View>
       <View style={styles.switchContainer}>
        <Text style={styles.switchText}>Renge Göre </Text>
        <Switch
          value={searchType === 'compare_colors'}
          onValueChange={onToggleSwitch}
          style={styles.switch}
        />
        <Text style={styles.switchText}>Desene Göre </Text>
      </View>
    </View>
      <Button onPress={handleFileSelect}>{selectedFile ? 'Resmi Değiştir' : 'Resim Seç'}</Button>
      <Button mode="contained" style={{marginTop : 20  }} onPress={handleSubmit} disabled={!selectedFile || loading}>
        Kumaşı Ara
      </Button>

      {loading && (
        <View style={[styles.loadingOverlay, styles.loadingOverlayShow]}>
          <ActivityIndicator
            size="large"
            color="#3498db"
            style={styles.loadingSpinner}
          />
        </View>
      )}

      <FlatGrid
        itemDimension={130}
        data={results}
        renderItem={({ item }) => (
          <Image
            source={{ uri: `http://195.175.208.222:3491/images/${item.image_name}` }}
            style={styles.resultItemImg}
          />
        )}
      />
    </View>
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
    marginTop : 30,
    marginBottom: 20
  },
  imagePreview: {
    width: 100,
    height: 100,
    marginTop: 10,
    marginBottom: 10,
    flex: 1,
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
    width : '80%'
  },
  switchText: {
    flex: 1,
    marginRight: 10,
  },
  switch: {
    flex: 1,
    width : '100%'
  }
});

export default FileUploadForm;
