import { Toggle as BaseToggle } from '@base-ui/react';
import clsx from 'clsx';
import type { ReactNode } from 'react';
import { createTestIdBuilder } from '../../utils/testIds';
import styles from './Toggle.module.scss';

type ToggleClasses = {
  Root?: string;
  Icon?: string;
  Label?: string;
};

export type ToggleSlotProps = {
  classes?: ToggleClasses;
};

export type ToggleProps<Value extends string = string> = Omit<
  BaseToggle.Props<Value>,
  'children' | 'className'
> & {
  children?: ReactNode;
  className?: string;
  icon?: ReactNode;
  label?: ReactNode;
  slotProps?: ToggleSlotProps;
  name?: string;
  testId?: string;
};

export function Toggle<Value extends string = string>({
  children,
  className,
  icon,
  label,
  slotProps,
  name,
  testId,
  value,
  ...props
}: ToggleProps<Value>) {
  const testIds = createTestIdBuilder('Toggle', { name, testId });
  const visibleLabel = children ?? label;

  return (
    <BaseToggle
      {...props}
      value={value}
      className={clsx(styles.Root, className, slotProps?.classes?.Root)}
      data-testid={testIds.self(value)}
    >
      {icon ? (
        <span
          aria-hidden="true"
          className={clsx(styles.Icon, slotProps?.classes?.Icon)}
          data-testid={testIds.part('Icon', value)}
        >
          {icon}
        </span>
      ) : null}
      {visibleLabel ? (
        <span
          className={clsx(styles.Label, slotProps?.classes?.Label)}
          data-testid={testIds.part('Label', value)}
        >
          {visibleLabel}
        </span>
      ) : null}
    </BaseToggle>
  );
}

export default Toggle;
