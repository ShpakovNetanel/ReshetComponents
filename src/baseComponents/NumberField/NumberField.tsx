import {
    NumberField as BaseNumberField,
    type NumberFieldRootChangeEventDetails as BaseNumberFieldRootChangeEventDetails,
    type NumberFieldRootCommitEventDetails as BaseNumberFieldRootCommitEventDetails
} from "@base-ui/react";
import clsx from "clsx";
import { Minus, Plus } from "lucide-react";
import { useId } from "react";
import type { ClassNames } from "../../types/baseui";
import { buildTestId } from "../../utils/testIds";
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
    testId?: string;
} & BaseNumberField.Root.Props

export const NumberField = ({ onValueChange, onValueCommitted, value, slotProps, label, testId, ...props }: NumberFieldProps) => {
    const id = useId();

    return (
        <BaseNumberField.Root
            {...props}
            data-testid={buildTestId(testId, 'root')}
            id={id}
            value={value}
            onValueChange={onValueChange}
            onValueCommitted={onValueCommitted}
            className={clsx(styles.Field, slotProps?.classes?.Root)}>
            <BaseNumberField.ScrubArea className={clsx(styles.ScrubArea, slotProps?.classes?.ScrubArea)}>
                <label htmlFor={id} data-testid={buildTestId(testId, 'label')} className={clsx(styles.Label, slotProps?.classes?.Label)}>
                    {label}
                </label>
            </BaseNumberField.ScrubArea>
            <BaseNumberField.Group data-testid={buildTestId(testId, 'group')} className={clsx(styles.Group, slotProps?.classes?.Group)}>
                {!props.disabled && <BaseNumberField.Increment data-testid={buildTestId(testId, 'increment')} className={clsx(styles.Increment, slotProps?.classes?.Increment)}>
                    <Plus className={clsx(slotProps?.classes?.Icon)} />
                </BaseNumberField.Increment>}
                <BaseNumberField.Input data-testid={buildTestId(testId, 'input')} disabled={props.disabled} className={clsx(styles.Input, slotProps?.classes?.Input)}
                    maxLength={String(props.max).length} />
                {!props.disabled && <BaseNumberField.Decrement data-testid={buildTestId(testId, 'decrement')} className={clsx(styles.Decrement, slotProps?.classes?.Decrement)}>
                    <Minus className={clsx(slotProps?.classes?.Icon)} />
                </BaseNumberField.Decrement>}
            </BaseNumberField.Group>
        </BaseNumberField.Root>
    );
}
