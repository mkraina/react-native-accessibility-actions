import { AccessibilityActionName } from 'react-native';

export interface AccessibleViewProps {
  accessibilityActionLabel: string | undefined;
  disabled: boolean | undefined;
  onPress: (() => void) | undefined;
}

export type AccessibilityAction = {
  /**
   * used as an a11y label for the `accessibilityAction`
   */
  label: string;
  /**
   * callback to be invoked as `onAccessibilityAction` for this action name
   */
  onAction: () => void;
  /**
   * whether to not expose the accessibility action to the user
   * disables this action in both `accessibilityActions` & `onAccessibilityAction`
   */
  disabled?: boolean;
};

export type AccessibilityActions = Record<
  AccessibilityActionName | string,
  AccessibilityAction | undefined
>;
