import { Toast as BaseToast } from "@base-ui/react";
import styles from './ToastList.module.scss';
import { X } from "lucide-react";
import clsx from "clsx";
import type { ReactNode } from "react";
import type { ClassNames } from "../../../../types/baseui";
import { createTestIdBuilder } from "../../../../utils/testIds";

type Disable = {
    close?: boolean;
}

export type SlotProps = {
    classes?: ClassNames<typeof BaseToast, 'Icon' | 'Toast'>;
    disable?: Disable;
    icon?: ReactNode;
    testId?: string;
}

type ToastListProps = {
    name?: string;
    testId?: string;
    slotProps?: SlotProps;
}

export const ToastList = ({ name, testId, slotProps }: ToastListProps) => {
    const { toasts } = BaseToast.useToastManager();
    const testIds = createTestIdBuilder('ToastList', { name, testId: testId ?? slotProps?.testId });

    return (
        toasts.map((toast) => (
            <BaseToast.Root key={toast.id} toast={toast} data-testid={testIds.self(toast.id)} className={clsx(styles.Toast, slotProps?.classes?.Toast)}>
                <BaseToast.Content data-testid={testIds.part('Content', toast.id)} className={clsx(styles.Content, slotProps?.classes?.Content)}>
                    {slotProps?.icon}
                    <div>
                        <BaseToast.Title data-testid={testIds.part('Title', toast.id)} className={clsx(styles.Title, slotProps?.classes?.Title)} />
                        <BaseToast.Description data-testid={testIds.part('Description', toast.id)} className={clsx(styles.Description, slotProps?.classes?.Description)} />
                        <BaseToast.Close data-testid={testIds.part('Close', toast.id)} className={clsx(styles.Close, slotProps?.classes?.Close)} aria-label="Close">
                            <X className={clsx(styles.Icon, slotProps?.classes?.Icon)} />
                        </BaseToast.Close>
                    </div>
                </BaseToast.Content>
            </BaseToast.Root>
        ))
    )
}
