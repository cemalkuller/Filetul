import React, { memo } from 'react';
import { Button, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, IconButton} from 'react-native-paper';
import {View , Text} from 'react-native';
import { theme } from '../core/theme';

type Props = {
  action: () => void;
  value? : any
};

const BasketButton = ({ action , value }: Props) => (
  <TouchableOpacity onPress={action} style={styles.container}>
   
    <View style={styles.view}>
    <IconButton  
     icon={"basket"}  
     color={theme.colors.mor}
     animated={true}
    size={40} 
    />
    
        <View style={styles.text}>
            <Text style={styles.ictext}>{value}</Text>
            </View>    
        </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 105 ,
    left: 20,
  },
  image: {
    width: 32,
    height: 32,
  },
  view : {
      position : 'relative',
      display : "flex",
      justifyContent : 'center',
      alignContent : 'center',
      textAlign : 'center',
  },
  text : {
     
        position : "absolute",
      backgroundColor : theme.colors.mor,
      marginLeft : 'auto',
      marginRight : 'auto',
      bottom : 22.5,
      left : '35%',
      display : "flex",
      justifyContent : 'center',
      alignContent : 'center',
      textAlign : 'center'
    
  },
  ictext : {
    display : "flex",
    justifyContent : 'center',
    alignContent : 'center',
    textAlign : 'center',
    borderRadius : 100,
    minWidth : "30%",
    minHeight  : 15 ,
    fontSize : 10,
    fontWeight : '900',
    color : '#fff'
   
  }
});

export default memo(BasketButton);
