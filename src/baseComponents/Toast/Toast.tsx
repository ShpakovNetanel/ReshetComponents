import { AlertTriangle, Check, X } from "lucide-react";
import type { ReactNode } from "react";
import { ToastBase } from "./ToastBase/ToastBase";
import type { SlotProps as ToastListSlotProps } from './ToastBase/ToastList/ToastList';

type SlotProps = {
    ToastList: ToastListSlotProps;
}

type ToastProps = {
    description?: string;
    title?: string;
    icon?: ReactNode;
    slotProps?: SlotProps;
    trigger?: ReactNode;
}

export const Toast = {
    Success: ({ slotProps, description = 'הפעולה הושלמה בהצלחה', title = 'הודעת הצלחה', icon, trigger }: ToastProps) =>
        <ToastBase
            title={title}
            description={description}
            trigger={trigger}
            slotProps={{
                ToastList: {
                    ...slotProps,
                    icon: slotProps?.ToastList?.icon ?? <Check size='2rem' color='green' />
                },
                ToastButton: {
                    icon
                }
            }}
        />,
    Error: ({ slotProps, description = 'הפעולה נכשלה', title = 'הודעת שגיאה', icon, trigger }: ToastProps) =>
        <ToastBase
            title={title}
            description={description}
            trigger={trigger}
            slotProps={{
                ToastList: {
                    ...slotProps?.ToastList,
                    icon: slotProps?.ToastList?.icon ?? <X size='2rem' color="red" />
                },
                ToastButton: {
                    icon
                }
            }}
        />,
    Info: ({ slotProps, description = 'הפעולה חזרה עם התראה', title = 'פעולת אזהרה', icon, trigger }: ToastProps) =>
        <ToastBase
            title={title}
            description={description}
            trigger={trigger}
            slotProps={{
                ToastList: {
                    ...slotProps?.ToastList,
                    icon: slotProps?.ToastList?.icon ?? <AlertTriangle size='2rem' color="rgb(225, 193, 110)" />
                },
                ToastButton: {
                    icon
                }
            }}
        />,
}