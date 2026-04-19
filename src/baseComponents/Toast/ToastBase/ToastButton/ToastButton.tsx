import { Toast as BaseToast } from "@base-ui/react"
import type { ReactNode } from "react";
import styles from './ToastButton.module.scss';
import { buildTestId } from "../../../../utils/testIds";

type Classes = {
    Button?: keyof typeof styles;
}

export type SlotProps = {
    classes?: Classes;
    icon?: ReactNode;
    testId?: string;
}

type ToastButtonProps = {
    title: string;
    description: string;
    slotProps?: SlotProps;
}

export const ToastButton = ({ description, title, slotProps }: ToastButtonProps) => {
    const toastManager = BaseToast.useToastManager();

    const createToast = () => {
        toastManager.add({
            title,
            description,
        })
    }

    return <button
        data-testid={buildTestId(slotProps?.testId, 'button')}
        className={styles.Button}
        onClick={createToast}>
        {slotProps?.icon ?? 'Toast Me!'}
    </button>
}
