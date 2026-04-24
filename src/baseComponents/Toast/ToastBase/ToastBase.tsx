import { Toast as BaseToast } from "@base-ui/react";
import type { ReactNode } from "react";
import styles from './ToastBase.module.scss';
import type { SlotProps as ToastButtonSlotProps } from './ToastButton/ToastButton';
import { ToastButton } from "./ToastButton/ToastButton";
import type { SlotProps as ToastListSlotProps } from './ToastList/ToastList';
import { ToastList } from "./ToastList/ToastList";

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
    name?: string;
    testId?: string;
}

export const ToastBase = ({ slotProps, description, title, trigger, name, testId }: ToastProps) => {
    return (
        <>
            {trigger ?? <ToastButton
                title={title}
                description={description}
                name={name}
                testId={slotProps?.ToastButton?.testId ?? testId}
                slotProps={{
                    ...slotProps?.ToastButton
                }} />}
            <BaseToast.Portal>
                <ToastList
                    name={name}
                    testId={slotProps?.ToastList?.testId ?? testId}
                    slotProps={{
                    ...slotProps?.ToastList,
                }} />
            </BaseToast.Portal>
        </>
    )
}
