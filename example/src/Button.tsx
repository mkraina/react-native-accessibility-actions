import React from 'react';
import { StyleSheet } from 'react-native';

import { Pressable } from './Pressable';
import { Text } from './Text';

const styles = StyleSheet.create({
  container: {
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 360,
    backgroundColor: '#EEEEEE',
  },
  title: { fontWeight: 'bold', fontSize: 16 },
});

export const Button = React.memo<{ title: string; onPress: () => void }>(({ title, onPress }) => (
  <Pressable accessibilityActionLabel={title} onPress={onPress} style={styles.container}>
    <Text style={styles.title}>{title}</Text>
  </Pressable>
));
