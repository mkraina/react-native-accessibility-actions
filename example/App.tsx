import React, { useState } from 'react';
import { StatusBar, StyleSheet, Text, View } from 'react-native';
import { useAccessibilityActions } from 'react-native-accessibility-actions';

import { Adjustable } from './src/Adjustable';

const onPressMore = () => console.warn('on more info');
const onPressDirections = () => console.warn('on directions');

export default function App() {
  const [x, setX] = useState(2);
  const canDecrease = x > 0;
  const increaseValue = () => setX(c => c + 1);
  const decreaseValue = () => setX(c => c - 1);
  console.warn(useAccessibilityActions);
  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
      <StatusBar translucent barStyle="dark-content" />
      <View
        accessible
        style={styles.a11yActionsView}
        {...useAccessibilityActions(
          () => ({
            more_info: { label: 'More Info', onAction: onPressMore },
            get_directions: { label: 'Get Directions', onAction: onPressDirections },
            increaseValue: { label: 'Increase value', onAction: increaseValue },
            decreaseValue: {
              label: 'Decrease value',
              onAction: decreaseValue,
              disabled: !canDecrease,
            },
          }),
          [canDecrease]
        )}
      >
        <Text>{x}</Text>
      </View>
      <Adjustable />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  a11yActionsView: {
    alignSelf: 'stretch',
    height: 40,
    backgroundColor: 'yellow',
  },
});
