import { Dialog as BaseDialog } from "@base-ui/react";
import clsx from "clsx";
import { Menu } from "lucide-react";
import type { PropsWithChildren, ReactNode } from "react";
import { createTestIdBuilder } from "../../utils/testIds";
import styles from "./Drawer.module.scss";

type Direction = "left" | "right" | "top" | "bottom";
const XAxios = ['left', 'right'];
const YAxios = ['top', 'bottom'];

type Classes = {
    Trigger?: keyof typeof styles;
    Drawer?: keyof typeof styles;
    Icon?: keyof typeof styles;
}

type SlotProps = {
    height?: string;
    width?: string;
    direction?: Direction;
    disableBackdrop?: boolean;
    classes?: Classes;
}

type DrawerProps = {
    triggerIcon?: ReactNode;
    slotProps?: SlotProps;
    name?: string;
    testId?: string;
} & PropsWithChildren
    & BaseDialog.Root.Props;

export const Drawer = ({
    children,
    triggerIcon,
    slotProps,
    name,
    testId,
    ...props
}: DrawerProps) => {
    const testIds = createTestIdBuilder('Drawer', { name, testId });
    const direction = slotProps?.direction ?? 'right';

    const width: string = slotProps?.width ?
        slotProps.width :
        XAxios.includes(direction) ?
            '30vw' :
            '100%';

    const height: string = slotProps?.height ?
        slotProps.height :
        YAxios.includes(direction) ?
            '25vh' :
            '100%';

    return (
        <BaseDialog.Root {...props}>
            <BaseDialog.Trigger data-testid={testIds.part('Trigger')} className={clsx(styles.Trigger, slotProps?.classes?.Trigger)}>
                {triggerIcon ?? <Menu className={clsx(slotProps?.classes?.Icon)}/>}
            </BaseDialog.Trigger>
            <BaseDialog.Portal>
                {!slotProps?.disableBackdrop && <BaseDialog.Backdrop
                    data-testid={testIds.part('Backdrop')}
                    className={styles.Backdrop} />}
                <BaseDialog.Popup data-testid={testIds.part('Popup')} className={clsx(styles.Drawer, slotProps?.classes?.Drawer, styles[direction])}
                    style={{ width, height }}>
                    {children}
                </BaseDialog.Popup>
            </BaseDialog.Portal>
        </BaseDialog.Root>
    );
};
