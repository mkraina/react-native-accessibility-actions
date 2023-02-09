/* eslint-disable @typescript-eslint/ban-types */
import React, { Dispatch, SetStateAction, useContext, useLayoutEffect, useMemo } from 'react';
import { Text, View, ViewProps } from 'react-native';

import { AccessibilityActions, AccessibleViewProps } from './types';
import { useAccessibilityActions } from './useAccessibilityActions';
import {
  useBuildAccessibilityAction,
  useTopLevelAccessibilityActions,
} from './useBuildAccessibilityAction';

type SetTopLevelActions = Dispatch<SetStateAction<AccessibilityActions>>;
const SetTopLevelActionsContext = React.createContext<SetTopLevelActions | undefined>(undefined);

type ActionsContenxtProps = {
  onAccessibilityAction: ViewProps['onAccessibilityAction'];
  accessibilityActions: ViewProps['accessibilityActions'];
};

const ActionsContext = React.createContext<ActionsContenxtProps | undefined>(undefined);

const TopLevelProvider = React.memo<
  AccessibleViewProps & ViewProps & { children: React.ReactNode }
>(({ onAccessibilityAction, ...props }) => {
  const { actions, setActions } = useTopLevelAccessibilityActions(props, false);
  const a11yActions = useAccessibilityActions(() => actions, [actions]);

  return (
    <SetTopLevelActionsContext.Provider value={setActions}>
      <ActionsContext.Provider
        value={useMemo(
          () => ({
            onPress: null,
            accessibilityActions: [
              ...(props.accessibilityActions || []),
              ...(a11yActions.accessibilityActions || []),
            ],
            onAccessibilityAction: e => {
              a11yActions.onAccessibilityAction?.(e);
              onAccessibilityAction?.(e);
            },
          }),
          [a11yActions, onAccessibilityAction, props.accessibilityActions]
        )}
      >
        {props.children}
      </ActionsContext.Provider>
    </SetTopLevelActionsContext.Provider>
  );
});

type NestedComponentProps = AccessibleViewProps & {
  children: React.ReactNode;
  setTopLevelActions: SetTopLevelActions | undefined;
};
const NestedProvider = React.memo<NestedComponentProps>(
  ({ setTopLevelActions, children, ...props }) => {
    const { id, action } = useBuildAccessibilityAction(props, true);
    useLayoutEffect(() => {
      setTopLevelActions?.(acc => ({ ...acc, [id]: action }));
      return () => setTopLevelActions?.(acc => ({ ...acc, [id]: undefined }));
    }, [action, id, setTopLevelActions]);
    return <>{children}</>;
  }
);

type WrappedComponentRef<T extends {}> = InstanceType<React.ComponentClass<T>>;

export const withAccessibilityActions = <T extends {}>(
  WrappedComponent: React.ComponentClass<T> | React.FC<T>,
  getDefaultAccessibilityActionLabel?: (props: T) => string | undefined,
  onlyProvideActionsToWrapper?: boolean
) => {
  const TopLevelComponent = React.forwardRef<WrappedComponentRef<T>, T>((props, ref) => (
    <WrappedComponent ref={ref} accessible {...props} {...useContext(ActionsContext)} />
  )) as unknown as React.ComponentClass<T>;

  return React.forwardRef<WrappedComponentRef<T>, T & Partial<AccessibleViewProps>>(
    (props, ref) => {
      const accessibilityActionLabel =
        props.accessibilityActionLabel || getDefaultAccessibilityActionLabel?.(props);
      const setTopLevelActions = useContext(SetTopLevelActionsContext);
      const a11yProps = {
        accessibilityActionLabel,
        disabled: props.disabled,
        onPress: props.onPress,
      };
      if (setTopLevelActions || onlyProvideActionsToWrapper) {
        return (
          <NestedProvider {...a11yProps} setTopLevelActions={setTopLevelActions}>
            <WrappedComponent ref={ref} accessible={!setTopLevelActions} {...props} />
          </NestedProvider>
        );
      }
      return (
        <TopLevelProvider {...props} {...a11yProps}>
          <TopLevelComponent {...props} ref={ref} />
        </TopLevelProvider>
      );
    }
  );
};

export const AccessibleView = withAccessibilityActions(View);

export const AccessibleText = withAccessibilityActions(
  Text,
  props => (typeof props.children === 'string' ? props.children : undefined),
  true
);
