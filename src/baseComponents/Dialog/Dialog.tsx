import { Dialog as BaseDialog } from '@base-ui/react';
import clsx from 'clsx';
import type { ReactNode } from 'react';
import styles from './Dialog.module.scss';
import type { ClassNames } from '../../types/baseui';
import { buildTestId } from '../../utils/testIds';

type SlotProps = {
    classes?: ClassNames<typeof BaseDialog, 'Trigger'>,
    disabled?: {
        trigger?: boolean
    },
    hidden?: {
        trigger?: boolean;
    }
}

type DialogProps = {
    slotProps?: SlotProps;
    children?: ReactNode;
    trigger?: ReactNode;
    testId?: string;
} & BaseDialog.Root.Props

export default function Dialog({ slotProps, children, trigger, testId, ...props }: DialogProps) {
    return (
        <BaseDialog.Root {...props}>
            {!slotProps?.hidden?.trigger && <BaseDialog.Trigger className={clsx(styles.Trigger, slotProps?.classes?.Trigger)}
                data-testid={buildTestId(testId, 'trigger')}
                disabled={slotProps?.disabled?.trigger}>
                {trigger}
            </BaseDialog.Trigger>}
            <BaseDialog.Portal>
                <BaseDialog.Backdrop data-testid={buildTestId(testId, 'backdrop')} className={clsx(styles.Backdrop, slotProps?.classes?.Backdrop)} />
                <BaseDialog.Popup data-testid={buildTestId(testId, 'popup')} className={clsx(styles.Popup, slotProps?.classes?.Popup)}>
                    {children}
                </BaseDialog.Popup>
            </BaseDialog.Portal>
        </BaseDialog.Root>
    );
}
