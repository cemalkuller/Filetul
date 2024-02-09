import React from 'react';
import { View } from 'react-native';
import { TextInput, DefaultTheme, Provider as PaperProvider } from 'react-native-paper';

const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: 'transparent', // Label rengini kırmızı olarak ayarla
    },
  };

const InputField = ({ label, value, onChangeText , keyboardType= null ,autoCapitalize= null , autoCorrect= null , disabled=false , returnKeyType=null , textContentType = null , secureTextEntry = null}) => {
  return (
   <PaperProvider theme={theme}>
      <View style={{ width: '100%', display: 'flex', backgroundColor: '#eeeeee', borderRadius: 10, padding: 0, paddingBottom : 6 ,  marginTop: 10, paddingLeft : 20  , justifyContent : 'center' }}>
        <TextInput
          textContentType={textContentType}
          returnKeyType={returnKeyType}
          label={label}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType ? keyboardType : 'default'}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          secureTextEntry={secureTextEntry}
          mode="flat"
          style={{ width : "93%", lineHeight : 10 , margin : 0 , textShadowColor : "#ff0000",   backgroundColor : 'transparent' , borderBlockColor : 'transparent' , borderColor : "#000000" ,  fontWeight: 'bold' , fontSize : 15 , color : "#000000" , padding : 0 }}
          outlineColor='transparent'
          underlineColor="transparent"
          activeOutlineColor='transparent'
          activeUnderlineColor='#000000'
          placeholderTextColor={"#000000"}
          selectionColor='#000000'
          clearButtonMode="always"
          disabled={disabled}
          
        /> 
      </View>
      <View style={{ height: 15 }} />
    </PaperProvider>
  );
};

// TextArea Component
const TextArea = ({ label, value, onChangeText, disabled=false }) => {
  return (
    <>
      <View style={{ width: '100%', display: 'flex', backgroundColor: '#eeeeee', borderRadius: 10, padding: 10, marginTop: 15 }}>
        <TextInput
          multiline
          mode="flat"
          numberOfLines={4}
          value={value}
          label={label}
          autoCapitalize='none'
          autoCorrect={false}
          onChangeText={onChangeText}
          style={{ minHeight: 100  , lineHeight : 10 , margin : 0 , textShadowColor : "#ff0000",   backgroundColor : 'transparent' , borderBlockColor : 'transparent' , borderColor : "#000000" ,  fontWeight: 'bold' , fontSize : 15 , color : "#000000" , padding : 0 }}
          outlineColor='transparent'
          underlineColor="transparent"
          activeOutlineColor='transparent'
          activeUnderlineColor='#000000'
          placeholderTextColor={"#000000"}
          selectionColor='#000000'
          clearButtonMode="always"
          disabled={disabled}
        />
      </View>
      <View style={{ height: 15 }} />
    </>
  );
};

export { InputField, TextArea };
