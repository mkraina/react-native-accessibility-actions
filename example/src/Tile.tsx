import React, { useState } from 'react';
import { Image, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import useEventCallback from 'use-event-callback';

import { Button } from './Button';
import { Pressable } from './Pressable';
import { Text } from './Text';

const styles = StyleSheet.create({
  container: { padding: 8, borderRadius: 8, backgroundColor: 'white' },
  image: { width: '100%', aspectRatio: 1, borderRadius: 8 },
  textsContainer: { paddingVertical: 20 },
});

export type TileProps = { title: string; subtitle: string; style?: StyleProp<ViewStyle> };

export const Tile = React.memo<TileProps>(props => {
  const [liked, setLiked] = useState(false);
  return (
    <Pressable
      style={[styles.container, props.style]}
      onPress={useEventCallback(() => console.warn('open detail', props.title))}
    >
      <Image style={styles.image} source={{ uri: 'https://picsum.photos/700' }} />
      <View style={styles.textsContainer}>
        <Text>{props.title}</Text>
        <Text>{props.subtitle}</Text>
      </View>
      <Button
        title={liked ? 'Unlike' : 'Like'}
        onPress={useEventCallback(() => setLiked(c => !c))}
      />
    </Pressable>
  );
});
