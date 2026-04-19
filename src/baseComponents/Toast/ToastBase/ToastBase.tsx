import { Toast as BaseToast } from "@base-ui/react";
import type { ReactNode } from "react";
import styles from './ToastBase.module.scss';
import type { SlotProps as ToastButtonSlotProps } from './ToastButton/ToastButton';
import { ToastButton } from "./ToastButton/ToastButton";
import type { SlotProps as ToastListSlotProps } from './ToastList/ToastList';
import { ToastList } from "./ToastList/ToastList";
import { buildTestId } from "../../../utils/testIds";

type Classes = {
    ViewPort?: keyof typeof styles;
}

type SlotProps = {
    classes?: Classes;
    ToastList?: ToastListSlotProps;
    ToastButton?: ToastButtonSlotProps;
    timeout?: number;
}

type ToastProps = {
    slotProps?: SlotProps;
    trigger?: ReactNode;
    title: string;
    description: string;
    testId?: string;
}

export const ToastBase = ({ slotProps, description, title, trigger, testId }: ToastProps) => {
    return (
        <>
            {trigger ?? <ToastButton
                title={title}
                description={description}
                slotProps={{
                    ...slotProps?.ToastButton,
                    testId: buildTestId(testId, 'button')
                }} />}
            <BaseToast.Portal>
                <ToastList slotProps={{
                    ...slotProps?.ToastList,
                    testId: buildTestId(testId, 'list')
                }} />
            </BaseToast.Portal>
        </>
    )
}
