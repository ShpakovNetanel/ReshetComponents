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

type ToastData = {
    owner?: string;
    icon?: ReactNode;
}

export const ToastList = ({ name, testId, slotProps }: ToastListProps) => {
    const { toasts } = BaseToast.useToastManager();
    const testIds = createTestIdBuilder('ToastList', { name, testId: testId ?? slotProps?.testId });

    return (
        toasts.filter((toast) => {
            const owner = (toast.data as ToastData | undefined)?.owner;
            return !name || !owner || owner === name;
        }).map((toast) => {
            const icon = (toast.data as ToastData | undefined)?.icon ?? slotProps?.icon;

            return (
            <BaseToast.Root key={toast.id} toast={toast} data-testid={testIds.self(toast.id)} className={clsx(styles.Toast, slotProps?.classes?.Toast)}>
                <BaseToast.Content data-testid={testIds.part('Content', toast.id)} className={clsx(styles.Content, slotProps?.classes?.Content)}>
                    {icon && <span className={styles.StatusIcon}>{icon}</span>}
                    <div className={styles.Text}>
                        <BaseToast.Title data-testid={testIds.part('Title', toast.id)} className={clsx(styles.Title, slotProps?.classes?.Title)} />
                        <BaseToast.Description data-testid={testIds.part('Description', toast.id)} className={clsx(styles.Description, slotProps?.classes?.Description)} />
                    </div>
                    {!slotProps?.disable?.close &&
                        <BaseToast.Close data-testid={testIds.part('Close', toast.id)} className={clsx(styles.Close, slotProps?.classes?.Close)} aria-label="Close">
                            <X className={clsx(styles.Icon, slotProps?.classes?.Icon)} />
                        </BaseToast.Close>}
                </BaseToast.Content>
            </BaseToast.Root>
            );
        })
    )
}
