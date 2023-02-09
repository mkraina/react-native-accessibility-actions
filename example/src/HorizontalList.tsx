import React from 'react';
import { Dimensions, FlatList, ListRenderItem, StyleSheet, View } from 'react-native';
import { AccessibleView } from 'react-native-accessibility-actions';
import useEventCallback from 'use-event-callback';

import { Button } from './Button';
import { Text } from './Text';
import { Tile, TileProps } from './Tile';
const ITEM_WIDTH = Math.min(180, Dimensions.get('window').width / 1.5);

export type HorizontalListItem = Omit<TileProps, 'style'>;
type Props = { data: HorizontalListItem[]; title: string };

const styles = StyleSheet.create({
  container: { paddingVertical: 8 },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  title: { padding: 8, fontWeight: 'bold', fontSize: 18 },
  tile: { width: ITEM_WIDTH },
  separator: { width: 8 },
});

const keyExtractor = (item: HorizontalListItem, index: number) => `${index}`;

const renderItem: ListRenderItem<HorizontalListItem> = ({ item }) => (
  <Tile {...item} style={styles.tile} />
);
const Separator = React.memo(() => <View style={styles.separator} />);
export const HorizontalList = React.memo<Props>(({ title, data }) => {
  const viewAll = useEventCallback(() => console.warn('View all pressed'));
  return (
    <View style={styles.container}>
      <AccessibleView style={styles.titleContainer} accessibilityRole="header">
        <Text style={styles.title}>{title}</Text>
        <Button onPress={viewAll} title="View all" />
      </AccessibleView>
      <FlatList
        horizontal
        data={data}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        initialNumToRender={2}
        ListHeaderComponent={Separator}
        ItemSeparatorComponent={Separator}
        ListFooterComponent={Separator}
      />
    </View>
  );
});
