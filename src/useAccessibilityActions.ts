import { useMemo } from 'react';
import {
  AccessibilityActionEvent,
  AccessibilityActionInfo,
  AccessibilityActionName,
  AccessibilityProps,
} from 'react-native';
import useEventCallback from 'use-event-callback';

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

export const useAccessibilityActions = (
  actionsGetter: () => AccessibilityActions,
  deps: React.DependencyList
): AccessibilityProps => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const actions = useMemo(() => actionsGetter(), deps);
  const accessibilityActions = useMemo(
    () =>
      Object.entries(actions).reduce<AccessibilityActionInfo[]>((acc, [key, value]) => {
        if (!value || (value.disabled && key !== 'activate')) return acc;
        return [...acc, { name: key, label: value.label }];
      }, []),
    [actions]
  );

  const onAccessibilityAction = useEventCallback((event: AccessibilityActionEvent) => {
    actions[event.nativeEvent.actionName]?.onAction();
  });

  return useMemo<AccessibilityProps>(
    () => ({ accessibilityActions, onAccessibilityAction }),
    [accessibilityActions, onAccessibilityAction]
  );
};
