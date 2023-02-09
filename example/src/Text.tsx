import React, { ComponentProps } from 'react';
import { StyleSheet } from 'react-native';
import { AccessibleText } from 'react-native-accessibility-actions';

const styles = StyleSheet.create({ text: { color: 'black' } });
export const Text = React.memo<ComponentProps<typeof AccessibleText>>(({ style, ...props }) => (
  <AccessibleText style={[styles.text, style]} {...props} />
));
