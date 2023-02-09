import { TouchableOpacity } from 'react-native';
import { withAccessibilityActions } from 'react-native-accessibility-actions';

export const Pressable = withAccessibilityActions(TouchableOpacity);
