/* eslint-disable max-lines-per-function */
/* eslint-disable max-nested-callbacks */
import { renderHook } from '@testing-library/react-native';

import { AccessibleViewProps } from '../src';
import {
  useBuildAccessibilityAction,
  useTopLevelAccessibilityActions,
} from '../src/useBuildAccessibilityAction';

const mockProps = (partial?: Partial<AccessibleViewProps>): AccessibleViewProps => ({
  disabled: undefined,
  accessibilityActionLabel: undefined,
  onPress: console.warn,
  ...partial,
});

describe('useBuildAccessibilityAction', () => {
  // @ts-expect-error overwriting the __DEV__ global so that we don get the uuid returned as action names
  __DEV__ = false;
  describe('top level component', () => {
    const isNested = false;
    describe('returns the action correctly', () => {
      it('action is ignored if no onPress', () => {
        expect(
          renderHook(() => useBuildAccessibilityAction(mockProps({ onPress: undefined }), isNested))
            .result.current.action
        ).toBeUndefined();
      });
      it('label defaults to Activate', () => {
        expect(
          renderHook(() => useBuildAccessibilityAction(mockProps(), isNested)).result.current.action
            ?.label
        ).toBe('Activate');
      });
      it('label is adjusted correctly via accessibilityActionLabel', () => {
        expect(
          renderHook(() =>
            useBuildAccessibilityAction(mockProps({ accessibilityActionLabel: 'hello' }), isNested)
          ).result.current.action?.label
        ).toBe('hello');
      });
    });
    describe('reacts to changes', () => {
      const hook = renderHook((accessibilityActionLabel?: string) =>
        useBuildAccessibilityAction(mockProps({ accessibilityActionLabel }), isNested)
      );
      expect(hook.result.current.action?.label).toBe('Activate');
      hook.rerender('hello');
      expect(hook.result.current.action?.label).toBe('hello');
      hook.rerender('world');
      expect(hook.result.current.action?.label).toBe('world');
    });
  });
  describe('nested component', () => {
    const isNested = true;
    describe('returns the action correctly', () => {
      it('action is ignored if no onPress', () => {
        expect(
          renderHook(() => useBuildAccessibilityAction(mockProps({ onPress: undefined }), isNested))
            .result.current.action
        ).toBeUndefined();
      });
      it('label has no default', () => {
        expect(
          renderHook(() => useBuildAccessibilityAction(mockProps(), isNested)).result.current.action
            ?.label
        ).toBeFalsy();
      });
      it('label is adjusted correctly via accessibilityActionLabel', () => {
        expect(
          renderHook(() =>
            useBuildAccessibilityAction(mockProps({ accessibilityActionLabel: 'hello' }), isNested)
          ).result.current.action?.label
        ).toBe('hello');
      });
    });
    describe('reacts to changes', () => {
      const hook = renderHook((accessibilityActionLabel?: string) =>
        useBuildAccessibilityAction(mockProps({ accessibilityActionLabel }), isNested)
      );
      expect(hook.result.current.action?.label).toBeFalsy();
      hook.rerender('hello');
      expect(hook.result.current.action?.label).toBe('hello');
      hook.rerender('world');
      expect(hook.result.current.action?.label).toBe('world');
    });
  });
});
describe('useTopLevelAccessibilityActions', () => {
  const isNested = false;
  describe('returns the action correctly', () => {
    it('action is ignored if no onPress', () => {
      expect(
        renderHook(() =>
          useTopLevelAccessibilityActions(mockProps({ onPress: undefined }), isNested)
        ).result.current.actions.activate
      ).toBeUndefined();
    });
    it('label defaults to Activate', () => {
      expect(
        renderHook(() => useTopLevelAccessibilityActions(mockProps(), isNested)).result.current
          .actions.activate?.label
      ).toBe('Activate');
    });
    it('label is adjusted correctly via accessibilityActionLabel', () => {
      expect(
        renderHook(() =>
          useTopLevelAccessibilityActions(
            mockProps({ accessibilityActionLabel: 'hello' }),
            isNested
          )
        ).result.current.actions.activate?.label
      ).toBe('hello');
    });
  });
  describe('reacts to changes', () => {
    const hook = renderHook((props?: Partial<AccessibleViewProps>) =>
      useTopLevelAccessibilityActions(mockProps(props), isNested)
    );
    expect(hook.result.current.actions.activate?.label).toBe('Activate');
    hook.rerender({ accessibilityActionLabel: 'hello' });
    expect(hook.result.current.actions.activate?.label).toBe('hello');
    hook.rerender({ accessibilityActionLabel: 'world' });
    expect(hook.result.current.actions.activate?.label).toBe('world');
    const onPress = () => console.warn('updated');
    hook.rerender({ onPress });
    expect(hook.result.current.actions.activate?.onAction).toBe(onPress);
  });
});
