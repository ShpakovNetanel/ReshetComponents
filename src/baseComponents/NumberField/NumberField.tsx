import {
    NumberField as BaseNumberField,
    type NumberFieldRootChangeEventDetails as BaseNumberFieldRootChangeEventDetails,
    type NumberFieldRootCommitEventDetails as BaseNumberFieldRootCommitEventDetails
} from "@base-ui/react";
import clsx from "clsx";
import { Minus, Plus } from "lucide-react";
import { useId } from "react";
import type { ClassNames } from "../../types/baseui";
import { createTestIdBuilder } from "../../utils/testIds";
import styles from './NumberField.module.scss';

type SlotProps = {
    classes?: ClassNames<typeof BaseNumberField, 'Label' | 'Icon'>;
}

type NumberFieldProps = {
    slotProps?: SlotProps;
    onValueChange?: (value: number | null, eventDetails: BaseNumberFieldRootChangeEventDetails) => void;
    onValueCommitted?: (value: number | null, eventDetails: BaseNumberFieldRootCommitEventDetails) => void;
    value?: number;
    label?: string;
    name?: string;
    testId?: string;
} & BaseNumberField.Root.Props

export const NumberField = ({ onValueChange, onValueCommitted, value, slotProps, label, name, testId, ...props }: NumberFieldProps) => {
    const id = useId();
    const testIds = createTestIdBuilder('NumberField', { name, testId });

    return (
        <BaseNumberField.Root
            {...props}
            name={name}
            data-testid={testIds.self()}
            id={id}
            value={value}
            onValueChange={onValueChange}
            onValueCommitted={onValueCommitted}
            className={clsx(styles.Field, slotProps?.classes?.Root)}>
            <BaseNumberField.ScrubArea className={clsx(styles.ScrubArea, slotProps?.classes?.ScrubArea)}>
                <label htmlFor={id} data-testid={testIds.part('Label')} className={clsx(styles.Label, slotProps?.classes?.Label)}>
                    {label}
                </label>
            </BaseNumberField.ScrubArea>
            <BaseNumberField.Group data-testid={testIds.part('Group')} className={clsx(styles.Group, slotProps?.classes?.Group)}>
                {!props.disabled && <BaseNumberField.Increment data-testid={testIds.part('Increment')} className={clsx(styles.Increment, slotProps?.classes?.Increment)}>
                    <Plus className={clsx(slotProps?.classes?.Icon)} />
                </BaseNumberField.Increment>}
                <BaseNumberField.Input data-testid={testIds.part('Input')} disabled={props.disabled} className={clsx(styles.Input, slotProps?.classes?.Input)}
                    maxLength={String(props.max).length} />
                {!props.disabled && <BaseNumberField.Decrement data-testid={testIds.part('Decrement')} className={clsx(styles.Decrement, slotProps?.classes?.Decrement)}>
                    <Minus className={clsx(slotProps?.classes?.Icon)} />
                </BaseNumberField.Decrement>}
            </BaseNumberField.Group>
        </BaseNumberField.Root>
    );
}
