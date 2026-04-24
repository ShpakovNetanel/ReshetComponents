import { Select as BaseSelect } from '@base-ui/react';
import clsx from 'clsx';
import { Check, ChevronDown } from 'lucide-react';
import { Fragment, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { isPlainObject } from 'remeda';
import type { ClassNames } from '../../types/baseui';
import { createTestIdBuilder } from '../../utils/testIds';
import styles from './Select.module.scss';

export type Primitive = string | number;
export type ValueLabelPair = { value: any; label: ReactNode; disabled?: boolean };

type SlotProps = {
    classes?: ClassNames<typeof BaseSelect, 'Placeholder' | 'TriggerIcon' | 'ItemIndicatorIcon'>;
    triggerProps?: Omit<ComponentPropsWithoutRef<typeof BaseSelect.Trigger>, 'children' | 'className'>;
    popupProps?: Omit<ComponentPropsWithoutRef<typeof BaseSelect.Popup>, 'children' | 'className'>;
}

type SelectValue<Value, Multiple extends boolean | undefined> =
    Multiple extends true ? Value[] : Value | null;

type SelectProps<Value, Multiple extends boolean | undefined = false> = {
    items: Value[];
    placeholder?: ReactNode;
    itemComponent?: (item: Value) => ReactNode;
    valueNode?: (value: Multiple extends true ? Value[] : Value | null) => ReactNode;
    itemDisabled?: (item: Value) => boolean;
    slotProps?: SlotProps;
    name?: string;
    testId?: string;
    value?: SelectValue<Value, Multiple>;
} & Omit<BaseSelect.Root.Props<Value, Multiple>, 'children' | 'items' | 'value'>;

const isValueLabelPair = (item: unknown): item is ValueLabelPair =>
    isPlainObject(item) &&
    typeof item === 'object' &&
    item !== null &&
    'value' in item &&
    'label' in item;

export const Select = <Value, Multiple extends boolean | undefined = false>({
    items,
    placeholder,
    itemComponent,
    valueNode,
    itemDisabled,
    slotProps,
    name,
    testId,
    itemToStringLabel,
    itemToStringValue,
    value,
    ...props
}: SelectProps<Value, Multiple>) => {
    const testIds = createTestIdBuilder('Select', { name, testId });

    const getItemValue = (item: Value) => {
        if (isValueLabelPair(item)) {
            return item.value as Primitive;
        }

        if (itemToStringValue) {
            return itemToStringValue(item) as Primitive;
        }

        if (isPlainObject(item)) {
            return JSON.stringify(item) as Primitive;
        }

        return item as Primitive;
    };

    const getItemLabel = (item: Value): ReactNode => {
        if (isValueLabelPair(item)) {
            return item.label;
        }

        if (itemToStringLabel) {
            return itemToStringLabel(item);
        }

        if (isPlainObject(item)) {
            return JSON.stringify(item);
        }

        return item as ReactNode;
    };

    const getItemLabelText = (item: Value) => {
        const label = getItemLabel(item);
        return typeof label === 'string' || typeof label === 'number'
            ? String(label)
            : String(getItemValue(item));
    };

    const getItemDisabled = (item: Value) => {
        if (itemDisabled) {
            return itemDisabled(item);
        }

        return isValueLabelPair(item) ? Boolean(item.disabled) : false;
    };

    const renderDefaultValue = (value: Value | Value[]) => {
        if (Array.isArray(value)) {
            return value.map((item, index) => (
                <Fragment key={`${String(getItemValue(item))}-${index}`}>
                    {index > 0 ? ', ' : null}
                    {getItemLabel(item)}
                </Fragment>
            ));
        }

        return getItemLabel(value);
    };

    return (
        <BaseSelect.Root
            {...props}
            name={name}
            value={value as BaseSelect.Root.Props<Value, Multiple>['value']}>
            <BaseSelect.Trigger
                {...slotProps?.triggerProps}
                data-testid={testIds.part('Trigger')}
                data-disabled={props.disabled}
                className={clsx(styles.Trigger, slotProps?.classes?.Trigger)}>
                <BaseSelect.Value
                    data-testid={testIds.part('Value')}
                    className={clsx(styles.Value, slotProps?.classes?.Value)}>
                    {(value) => {
                        const isEmptyValue = value == null || (Array.isArray(value) && value.length === 0);

                        if (isEmptyValue) {
                            return (
                                <span className={clsx(styles.Placeholder, slotProps?.classes?.Placeholder)}>
                                    {placeholder}
                                </span>
                            );
                        }

                        return valueNode ? valueNode(value) : renderDefaultValue(value);
                    }}
                </BaseSelect.Value>
                <BaseSelect.Icon
                    data-testid={testIds.part('Icon')}
                    className={clsx(styles.Icon, slotProps?.classes?.Icon)}>
                    <ChevronDown className={clsx(styles.TriggerIcon, slotProps?.classes?.TriggerIcon)} />
                </BaseSelect.Icon>
            </BaseSelect.Trigger>
            <BaseSelect.Portal>
                <BaseSelect.Positioner
                    data-testid={testIds.part('Positioner')}
                    className={clsx(styles.Positioner, slotProps?.classes?.Positioner)}
                    sideOffset={4}>
                    <BaseSelect.Popup
                        {...slotProps?.popupProps}
                        data-testid={testIds.part('Popup')}
                        className={clsx(styles.Popup, slotProps?.classes?.Popup)}>
                        <BaseSelect.List
                            data-testid={testIds.part('List')}
                            className={clsx(styles.List, slotProps?.classes?.List)}>
                            {items.map((item, index) => (
                                <BaseSelect.Item
                                    key={`${String(getItemValue(item))}-${index}`}
                                    data-testid={testIds.part('Item', getItemValue(item))}
                                    value={item}
                                    disabled={getItemDisabled(item)}
                                    label={getItemLabelText(item)}
                                    className={clsx(styles.Item, slotProps?.classes?.Item)}>
                                    <BaseSelect.ItemIndicator
                                        data-testid={testIds.part('ItemIndicator', getItemValue(item))}
                                        className={clsx(styles.ItemIndicator, slotProps?.classes?.ItemIndicator)}>
                                        <Check className={clsx(styles.ItemIndicatorIcon, slotProps?.classes?.ItemIndicatorIcon)} />
                                    </BaseSelect.ItemIndicator>
                                    <BaseSelect.ItemText
                                        className={clsx(styles.ItemText, slotProps?.classes?.ItemText)}>
                                        {itemComponent ? itemComponent(item) : getItemLabel(item)}
                                    </BaseSelect.ItemText>
                                </BaseSelect.Item>
                            ))}
                        </BaseSelect.List>
                    </BaseSelect.Popup>
                </BaseSelect.Positioner>
            </BaseSelect.Portal>
        </BaseSelect.Root>
    );
};

export default Select;
