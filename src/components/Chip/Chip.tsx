import clsx from 'clsx';
import styles from './Chip.module.scss';
import type { ComponentPropsWithoutRef, MouseEventHandler, ReactNode } from 'react';
import { createTestIdBuilder } from '../../utils/testIds';

type ChipClasses = {
    Root?: string;
    Label?: string;
}

export type ChipSlotProps = {
    classes?: ChipClasses;
    rootProps?: Omit<ComponentPropsWithoutRef<'div'>, 'children' | 'className' | 'onClick'>;
}

export type ChipProps = Omit<ComponentPropsWithoutRef<'div'>, 'children' | 'className' | 'onClick'> & {
    label: ReactNode;
    className?: string;
    slotProps?: ChipSlotProps;
    onChipClick?: MouseEventHandler<HTMLDivElement>;
    name?: string;
    testId?: string;
}

export const Chip = ({ label, className, slotProps, onChipClick, name, testId, ...props }: ChipProps) => {
    const testIds = createTestIdBuilder('Chip', { name, testId });
    const rootProps = slotProps?.rootProps;

    return (
        <div
            {...props}
            {...rootProps}
            className={clsx(styles.Label, className, slotProps?.classes?.Root, slotProps?.classes?.Label)}
            data-testid={testIds.self()}
            onClick={onChipClick}>
            {label}
        </div>
    )
}
