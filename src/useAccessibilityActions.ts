import { useMemo } from 'react';
import {
  AccessibilityActionEvent,
  AccessibilityActionInfo,
  AccessibilityProps,
} from 'react-native';
import useEventCallback from 'use-event-callback';

import { AccessibilityActions } from './types';

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
