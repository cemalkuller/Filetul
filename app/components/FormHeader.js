import React from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

const FormHeader = ({
  leftHeading,
  subHeading,
  leftHeaderTranslateX = 40,
}) => {



  const animateIn = () => {
    Animated.timing(animatePress, {
      toValue: 0.5,
      duration: 500,
      useNativeDriver: true // Add This line
    }).start();
  }
  return (
    <>
      <View style={styles.container}>
        <Animated.Text
        useNativeDriver={true}
          style={[
            styles.heading,
            { transform: [{ translateX: leftHeaderTranslateX }] },
          ]}
        >
          {leftHeading}
        </Animated.Text>

      </View>
      <Text style={styles.subHeading}>{subHeading}</Text>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: { fontSize: 30, fontWeight: 'bold', color: '#1b1b33' },
  subHeading: { fontSize: 18, color: '#1b1b33', textAlign: 'center' },
});

export default FormHeader;
