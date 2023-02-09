import React, { useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';
import { useAccessibilityActions } from 'react-native-accessibility-actions';

import { HorizontalList } from './src/HorizontalList';
import { Text } from './src';

const onPressMore = () => console.warn('on more info');
const onPressDirections = () => console.warn('on directions');

const App = React.memo(() => {
  const [x, setX] = useState(2);
  const canDecrease = x > 0;
  const increaseValue = () => setX(c => c + 1);
  const decreaseValue = () => setX(c => c - 1);
  const moreInfoLabel = x % 2 ? 'More' : 'More info';
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#EEEEEE" />
      <Text style={styles.headline}>Welcome</Text>
      <View
        accessible
        style={styles.a11yActionsView}
        {...useAccessibilityActions(
          () => ({
            more_info: { label: moreInfoLabel, onAction: onPressMore },
            get_directions: { label: 'Get Directions', onAction: onPressDirections },
            increaseValue: { label: 'Increase value', onAction: increaseValue },
            decreaseValue: {
              label: 'Decrease value',
              onAction: decreaseValue,
              disabled: !canDecrease,
            },
          }),
          [canDecrease, moreInfoLabel]
        )}
      >
        <Text accessible={false}>{x}</Text>
      </View>
      <HorizontalList
        title="a11y actions test"
        data={[
          { title: 'First item', subtitle: 'lorem ipsum' },
          { title: 'Second item', subtitle: 'dolor sit amet' },
        ]}
      />
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#EEEEEE' },
  headline: { textAlign: 'center' },
  a11yActionsView: {
    padding: 16,
    alignSelf: 'center',
    aspectRatio: 1,
  },
  button: { margin: 8 },
});

export default () => <App />;
