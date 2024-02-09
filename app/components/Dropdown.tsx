import React from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { Menu, Divider, IconButton } from 'react-native-paper';

const DropDown = ({ label, mode, visible, showDropDown, onDismiss, value, placeholder, setValue, list, disabled }) => {
  console.log("list", list);
  const openMenu = () => showDropDown();
  const closeMenu = () => onDismiss();

  const [state, setState] = React.useState(null);

  const handleSelect = (item) => {
    setValue(item.value);
    setState(item.label);
    closeMenu();
  };

  return (
    <View style={{ width: '100%', display: 'flex', backgroundColor: '#eeeeee', borderRadius: 10, padding: 10, paddingLeft: 30, opacity: disabled ? 0.5 : 1 }}>
      <Menu
        visible={visible && !disabled}
        style={{ width: "70%" }}
        onDismiss={closeMenu}
        anchor={
          <TouchableOpacity onPress={openMenu} disabled={disabled}>
            <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', justifyContent: 'space-between', }}>
              <Text style={{ fontWeight: 'bold' }}>{state || placeholder}</Text>
              <IconButton icon="arrow-down" />
            </View>
          </TouchableOpacity>
        }
      >
        <FlatList
          data={list}
          style={{ width: "100%" }}
          keyExtractor={(item) => item.value.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleSelect(item)}> 
              <Menu.Item title={item.label} />
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => <Divider />}
        />
      </Menu>
    </View>
  );
};

export default DropDown;
