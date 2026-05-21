import { Radio as BaseRadio, RadioGroup as BaseRadioGroup } from '@base-ui/react';
import clsx from 'clsx';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { createTestIdBuilder } from '../../utils/testIds';
import styles from './Radio.module.scss';

export type RadioValue = string | number;

type RadioClasses = {
  Root?: string;
  Control?: string;
  Indicator?: string;
  Label?: string;
  Description?: string;
};

export type RadioSlotProps = {
  classes?: RadioClasses;
  indicatorProps?: Omit<
    ComponentPropsWithoutRef<typeof BaseRadio.Indicator>,
    'children' | 'className'
  >;
};

export type RadioProps<Value extends RadioValue = string> = Omit<
  BaseRadio.Root.Props<Value>,
  'children' | 'className'
> & {
  children?: ReactNode;
  className?: string;
  label?: ReactNode;
  description?: ReactNode;
  slotProps?: RadioSlotProps;
  name?: string;
  testId?: string;
};

export type RadioGroupOption<Value extends RadioValue = string> = {
  value: Value;
  label: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
};

type RadioGroupClasses = {
  Root?: string;
  Radio?: RadioClasses;
};

export type RadioGroupSlotProps = {
  classes?: RadioGroupClasses;
  radio?: Omit<RadioSlotProps, 'classes'>;
};

export type RadioGroupProps<Value extends RadioValue = string> = Omit<
  BaseRadioGroup.Props<Value>,
  'children' | 'className'
> & {
  children?: ReactNode;
  className?: string;
  items?: RadioGroupOption<Value>[];
  orientation?: 'vertical' | 'horizontal';
  slotProps?: RadioGroupSlotProps;
  testId?: string;
};

const toTestIdPart = (value: RadioValue | undefined) =>
  value === undefined ? undefined : value;

export function Radio<Value extends RadioValue = string>({
  children,
  className,
  label,
  description,
  slotProps,
  name,
  testId,
  value,
  ...props
}: RadioProps<Value>) {
  const testIds = createTestIdBuilder('Radio', { name, testId });
  const valuePart = testId ? undefined : toTestIdPart(value);

  return (
    <BaseRadio.Root
      {...props}
      value={value}
      className={clsx(styles.Root, className, slotProps?.classes?.Root)}
      data-testid={testIds.self(valuePart)}>
      <span
        aria-hidden="true"
        className={clsx(styles.Control, slotProps?.classes?.Control)}
        data-testid={testIds.part('Control', valuePart)}>
        <BaseRadio.Indicator
          keepMounted
          {...slotProps?.indicatorProps}
          className={clsx(styles.Indicator, slotProps?.classes?.Indicator)}
          data-testid={testIds.part('Indicator', valuePart)}
        />
      </span>
      <span className={styles.Content}>
        <span
          className={clsx(styles.Label, slotProps?.classes?.Label)}
          data-testid={testIds.part('Label', valuePart)}>
          {children ?? label}
        </span>
        {description ? (
          <span
            className={clsx(styles.Description, slotProps?.classes?.Description)}
            data-testid={testIds.part('Description', valuePart)}>
            {description}
          </span>
        ) : null}
      </span>
    </BaseRadio.Root>
  );
}

export function RadioGroup<Value extends RadioValue = string>({
  children,
  className,
  items,
  orientation = 'vertical',
  slotProps,
  name,
  testId,
  ...props
}: RadioGroupProps<Value>) {
  const testIds = createTestIdBuilder('RadioGroup', { name, testId });

  return (
    <BaseRadioGroup
      {...props}
      name={name}
      className={clsx(styles.Group, className, slotProps?.classes?.Root)}
      data-orientation={orientation}
      data-testid={testIds.self()}>
      {items
        ? items.map((item) => (
            <Radio
              key={String(item.value)}
              value={item.value}
              label={item.label}
              description={item.description}
              disabled={item.disabled}
              slotProps={{
                ...slotProps?.radio,
                classes: slotProps?.classes?.Radio,
              }}
              testId={testIds.part('Item', item.value)}
            />
          ))
        : children}
    </BaseRadioGroup>
  );
}

export default Radio;
