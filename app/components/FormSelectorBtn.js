import React from 'react';
import { Animated, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';

const FormSelectorBtn = ({ title, backgroundColor, style, onPress }) => {


  const [animatePress, setAnimatePress] = useState(new Animated.Value(1))

const animateIn = () => {
  Animated.timing(animatePress, {
    toValue: 0.5,
    duration: 500,
    useNativeDriver: true // Add This line
  }).start();
}

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <Animated.View
      useNativeDriver={true}
      style={[styles.container, style, { backgroundColor }]}>
        <Text style={styles.title}>{title}</Text>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 45,
    width: '50%',
    backgroundColor: '#1b1b33',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: { color: 'white', fontSize: 16 },
});

export default FormSelectorBtn;
