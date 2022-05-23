import React, { memo } from 'react';
import { Button, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, IconButton } from 'react-native-paper';

type Props = {
  goBack: () => void;
};

const BackButton = ({ goBack }: Props) => (
  <TouchableOpacity onPress={goBack} style={styles.container}>
   
    <IconButton  
     icon={"keyboard-backspace"}  
     color={Colors.white}
     animated={true}
    size={50} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 30 ,
    left: 0,
  },
  image: {
    width: 32,
    height: 32,
  },
});

export default memo(BackButton);
