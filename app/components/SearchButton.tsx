import React, { memo } from 'react';
import {  StyleSheet, TouchableOpacity, Text , View } from 'react-native';
import { Colors, IconButton, Button } from 'react-native-paper';

type Props = {
  setSearch: () => void;
  active? : boolean
};

const SearchButton = ({ setSearch , active }: Props) => (
  
<Button labelStyle={{fontSize : 20}} style={styles.container} icon="magnify" mode="text" color={"white"} onPress={setSearch}>
    Arama Yap
  </Button>
    
);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 55 ,
    display : 'flex',
    justifyContent : "flex-start",
    textAlign : 'left',
    right: 70,
    width : 200,
    flexWrap : 'nowrap',
    fontSize : 20,
    alignSelf: 'stretch',
    alignContent:"center"

  },
  image: {
    width: 32,
    height: 32,
  },
  headline : {
    width : 100
  }
});

export default memo(SearchButton);
