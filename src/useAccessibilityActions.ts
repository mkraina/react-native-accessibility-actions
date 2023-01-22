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

type Props = {
  accessibilityActions: AccessibilityActionInfo[];
  accessibilityRole?: AccessibilityProps['accessibilityRole'];
};

export const useAccessibilityActions = (
  actionsGetter: () => AccessibilityActions,
  deps: React.DependencyList
): AccessibilityProps => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const actions = useMemo(() => actionsGetter(), deps);
  const props = useMemo<Props>(() => {
    const accessibilityRole: AccessibilityProps['accessibilityRole'] =
      !!actions.increment || !!actions.decrement ? 'adjustable' : undefined;
    const nonAdjustableActions: string[] = [];
    const accessibilityActions = Object.entries(actions).reduce<AccessibilityActionInfo[]>(
      (acc, [key, value]) => {
        if (!value || (value.disabled && key !== 'activate')) return acc;
        const isAdjustableAction = key === 'increment' || key === 'decrement';
        /*if (accessibilityRole === 'adjustable' && !isAdjustableAction) {
          __DEV__ && nonAdjustableActions.push(key);
          return acc;
        }*/
        return [...acc, { name: key, label: isAdjustableAction ? undefined : value.label }];
      },
      []
    );
    if (accessibilityRole !== 'adjustable') return { accessibilityActions };
    if (nonAdjustableActions.length)
      console.warn(
        `hola, custom actions cannot be provided alongside "increment" or "decrement" which makes component "adjustable".
          provided actions: ${nonAdjustableActions.join('\n')}`
      );

    return { accessibilityActions, accessibilityRole };
  }, [actions]);

  const onAccessibilityAction = useEventCallback((event: AccessibilityActionEvent) => {
    actions[event.nativeEvent.actionName]?.onAction();
  });

  return useMemo<AccessibilityProps>(
    () => ({ ...props, onAccessibilityAction }),
    [props, onAccessibilityAction]
  );
};
