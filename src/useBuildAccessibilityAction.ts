import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { ViewProps } from 'react-native';
import uuid from 'react-native-uuid';

import { AccessibilityActions, AccessibleViewProps } from './types';

const getA11yActionLabel = (
  actionId: string,
  props: AccessibleViewProps & ViewProps,
  isNested: boolean
) => {
  if (!isNested) return props.accessibilityActionLabel || 'Activate';
  return props.accessibilityActionLabel || props.accessibilityLabel || (__DEV__ ? actionId : '');
};
export const useBuildAccessibilityAction = (props: AccessibleViewProps, isNested: boolean) => {
  const id = useRef(uuid.v4().toString()).current;
  const a11yActionLabel = getA11yActionLabel(id, props, isNested);

  const disableA11y = !!props.disabled || !a11yActionLabel;

  const action = useMemo<AccessibilityActions[string]>(
    () =>
      props.onPress && {
        label: a11yActionLabel,
        onAction: props.onPress,
        disabled: disableA11y,
      },
    [a11yActionLabel, disableA11y, props.onPress]
  );
  return { action, id };
};

export const useTopLevelAccessibilityActions = (props: AccessibleViewProps, isNested: boolean) => {
  const [actions, setActions] = useState<AccessibilityActions>({});
  const { action } = useBuildAccessibilityAction(props, isNested);
  useLayoutEffect(() => {
    setActions(({ activate, ...acc }) => ({ activate: action, ...acc }));
  }, [action]);
  return { actions, setActions };
};
