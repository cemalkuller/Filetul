import React, { memo } from 'react';
import { Button, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, IconButton } from 'react-native-paper';

type Props = {
  SetFlash: () => void;
  active? : boolean
};

const FlashButton = ({ SetFlash , active }: Props) => (
  <TouchableOpacity onPress={SetFlash} style={styles.container}>
   
    <IconButton  
     icon={active ? "volume-high" : 'volume-off'}  
     color={Colors.white}
     animated={true}
    size={40} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 40 ,
    right: 10,
  },
  image: {
    width: 32,
    height: 32,
  },
});

export default memo(FlashButton);
