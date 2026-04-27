import { Toast as BaseToast } from "@base-ui/react"
import type { ReactNode } from "react";
import styles from './ToastButton.module.scss';
import { createTestIdBuilder } from "../../../../utils/testIds";

type Classes = {
    Button?: keyof typeof styles;
}

export type SlotProps = {
    classes?: Classes;
    icon?: ReactNode;
    toastIcon?: ReactNode;
    testId?: string;
}

type ToastButtonProps = {
    title: string;
    description: string;
    name?: string;
    testId?: string;
    slotProps?: SlotProps;
}

export const ToastButton = ({ description, title, name, testId, slotProps }: ToastButtonProps) => {
    const toastManager = BaseToast.useToastManager();
    const testIds = createTestIdBuilder('ToastButton', { name, testId: testId ?? slotProps?.testId });

    const createToast = () => {
        toastManager.add({
            title,
            description,
            data: {
                owner: name,
                icon: slotProps?.toastIcon,
            },
        })
    }

    return <button
        data-testid={testIds.self()}
        className={styles.Button}
        onClick={createToast}>
        {slotProps?.icon ?? 'Toast Me!'}
    </button>
}
