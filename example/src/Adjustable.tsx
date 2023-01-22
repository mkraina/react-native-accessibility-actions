import React from 'react';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { useAccessibilityActions } from 'react-native-accessibility-actions';

export const Adjustable: React.FC = () => {
  const [val, setVal] = useState(0);
  return (
    <View
      accessibilityValue={{ text: `${val}` }}
      accessibilityRole="adjustable"
      {...useAccessibilityActions(
        () => ({
          increment: { label: 'Foo', onAction: () => setVal(v => v + 1) },
          decrement: { label: 'Bar', onAction: () => setVal(c => c - 1), disabled: val === 0 },
          custom: { label: 'Custom action', onAction: () => console.warn('cusom action') },
        }),
        [val]
      )}
    >
      <Text>{val}</Text>
    </View>
  );
};
