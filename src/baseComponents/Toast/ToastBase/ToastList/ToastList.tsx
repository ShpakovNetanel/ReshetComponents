import { Toast as BaseToast } from "@base-ui/react";
import styles from './ToastList.module.scss';
import { X } from "lucide-react";
import clsx from "clsx";
import type { ReactNode } from "react";
import type { ClassNames } from "../../../../types/baseui";
import { buildTestId } from "../../../../utils/testIds";

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
    slotProps?: SlotProps;
}

export const ToastList = ({ slotProps }: ToastListProps) => {
    const { toasts } = BaseToast.useToastManager();

    return (
        toasts.map((toast) => (
            <BaseToast.Root key={toast.id} toast={toast} data-testid={buildTestId(slotProps?.testId, 'toast', toast.id)} className={clsx(styles.Toast, slotProps?.classes?.Toast)}>
                <BaseToast.Content data-testid={buildTestId(slotProps?.testId, 'content', toast.id)} className={clsx(styles.Content, slotProps?.classes?.Content)}>
                    {slotProps?.icon}
                    <div>
                        <BaseToast.Title data-testid={buildTestId(slotProps?.testId, 'title', toast.id)} className={clsx(styles.Title, slotProps?.classes?.Title)} />
                        <BaseToast.Description data-testid={buildTestId(slotProps?.testId, 'description', toast.id)} className={clsx(styles.Description, slotProps?.classes?.Description)} />
                        <BaseToast.Close data-testid={buildTestId(slotProps?.testId, 'close', toast.id)} className={clsx(styles.Close, slotProps?.classes?.Close)} aria-label="Close">
                            <X className={clsx(styles.Icon, slotProps?.classes?.Icon)} />
                        </BaseToast.Close>
                    </div>
                </BaseToast.Content>
            </BaseToast.Root>
        ))
    )
}
