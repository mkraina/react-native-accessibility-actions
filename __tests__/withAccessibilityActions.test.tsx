/* eslint-disable max-lines-per-function */
import React, { useEffect } from 'react';
import { Button as RNButton, ButtonProps, View, ViewProps } from 'react-native';
import { render } from '@testing-library/react-native';

import { withAccessibilityActions } from '../src';

const nestedComponents = ['directions', 'increase', 'decrease'];

const memoRerendered = jest.fn();
const MemoizedComponent = React.memo<ButtonProps>(props => {
  useEffect(() => memoRerendered());
  return <RNButton {...props} />;
});

const Wrapper = withAccessibilityActions(View);
const Button = withAccessibilityActions(RNButton, props => props.title);
const Memoized = withAccessibilityActions(MemoizedComponent, props => props.title);

const onPressMore = jest.fn();
const onPressDirections = jest.fn();
const increaseValue = jest.fn();
const decreaseValue = jest.fn();

const Component: React.FC<
  Partial<{
    disabled: boolean;
    noOnPress: boolean;
    directionsLabel: string;
    wrapperLabel: string;
    withMemoized: boolean;
  }>
> = ({ noOnPress, disabled, directionsLabel, wrapperLabel, withMemoized }) => (
  <>
    <Wrapper testID="wrapper" accessibilityActionLabel={wrapperLabel} onPress={onPressMore}>
      <Button
        testID="directions"
        title={directionsLabel ?? 'directions'}
        onPress={onPressDirections}
      />
      <Button testID="increase" title="increase" onPress={noOnPress ? undefined : increaseValue} />
      <View>
        <Button testID="decrease" title="decrease" onPress={decreaseValue} disabled={disabled} />
        {withMemoized && <Memoized testID="memo" title="memo" onPress={memoRerendered} />}
      </View>
    </Wrapper>
  </>
);

const matchesAccessibilityActions = (
  testId: string,
  component: ReturnType<typeof render>,
  labels?: string[]
) => {
  const actions = (
    component.getAllByTestId(testId)[0]?.props as ViewProps
  ).accessibilityActions?.map(({ label }) => label);
  if (!labels) return expect(actions).toBeUndefined();
  expect(actions).toStrictEqual(labels);
};

const childrenNoA11yActions = (component: ReturnType<typeof render>) => {
  nestedComponents.forEach(testId => matchesAccessibilityActions(testId, component));
};

describe('withAccessibilityActions', () => {
  it('works correctly if all have onPress and not disabled', () => {
    const component = render(<Component />);
    matchesAccessibilityActions('wrapper', component, [
      'Activate',
      'directions',
      'increase',
      'decrease',
    ]);
    childrenNoA11yActions(component);
  });

  it('works correctly if onPress not provided to child', () => {
    const component = render(<Component noOnPress />);
    matchesAccessibilityActions('wrapper', component, ['Activate', 'directions', 'decrease']);
    childrenNoA11yActions(component);
  });
  it('works correctly if disabled provided to child', () => {
    const component = render(<Component disabled />);
    matchesAccessibilityActions('wrapper', component, ['Activate', 'directions', 'increase']);
    childrenNoA11yActions(component);
  });
  it('works correctly if custom accessibility label provided to child', () => {
    const a11yActionLabel = 'my super directions';
    const component = render(<Component directionsLabel={a11yActionLabel} />);
    matchesAccessibilityActions('wrapper', component, [
      'Activate',
      a11yActionLabel,
      'increase',
      'decrease',
    ]);
    childrenNoA11yActions(component);
  });
  it('works correctly if no accessibility label provided to wrapper', () => {
    const component = render(<Component wrapperLabel="more" />);
    matchesAccessibilityActions('wrapper', component, [
      'more',
      'directions',
      'increase',
      'decrease',
    ]);
    childrenNoA11yActions(component);
  });
  it('reacts to changes correctly', () => {
    const component = render(<Component />);
    matchesAccessibilityActions('wrapper', component, [
      'Activate',
      'directions',
      'increase',
      'decrease',
    ]);
    component.update(<Component wrapperLabel="more" />);
    matchesAccessibilityActions('wrapper', component, [
      'more',
      'directions',
      'increase',
      'decrease',
    ]);
    component.update(<Component noOnPress />);
    matchesAccessibilityActions('wrapper', component, ['Activate', 'directions', 'decrease']);
    component.update(<Component directionsLabel="not directions" />);
    matchesAccessibilityActions('wrapper', component, [
      'Activate',
      'not directions',
      'increase',
      'decrease',
    ]);
  });
  it('doesnt break memoization', () => {
    const component = render(<Component withMemoized />);
    // rerender the component
    component.rerender(<Component withMemoized />);
    component.rerender(<Component withMemoized />);
    component.rerender(<Component withMemoized />);
    component.container;
    expect(memoRerendered).toBeCalledTimes(1);
    childrenNoA11yActions(component);
  });
});
