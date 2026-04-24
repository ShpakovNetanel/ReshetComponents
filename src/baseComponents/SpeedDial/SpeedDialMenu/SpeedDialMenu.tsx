import { Menu as BaseMenu, Separator as BaseSeparator } from "@base-ui/react"
import styles from "./SpeedDialMenu.module.scss"
import clsx from "clsx";
import React from "react";
import { createTestIdBuilder } from "../../../utils/testIds";

type Classes = {
    Button?: keyof typeof styles;
    Popup?: keyof typeof styles;
    Item?: keyof typeof styles;
    Separator?: keyof typeof styles;
}

type Disable = {
    separator?: boolean;
}

type SlotProps = {
    classes?: Classes;
    disable?: Disable;
    openOnHover?: boolean
}

type SpeedDialMenuProps = {
    items: React.ReactNode[];
    trigger?: React.ReactNode;
    slotProps?: SlotProps;
    name?: string;
    testId?: string;
} & BaseMenu.SubmenuRoot.Props

export const SpeedDialMenu = ({ items, trigger, slotProps, name, testId, ...props }: SpeedDialMenuProps) => {
    const testIds = createTestIdBuilder('SpeedDialMenu', { name, testId });

    return (
        <BaseMenu.SubmenuRoot {...props}>
            <BaseMenu.SubmenuTrigger data-testid={testIds.part('Trigger')}
                openOnHover={slotProps?.openOnHover ?? false}
                className={clsx(styles.Button, slotProps?.classes?.Button)}>
                {trigger}
            </BaseMenu.SubmenuTrigger>
            <BaseMenu.Portal>
                <BaseMenu.Positioner className={styles.Positioner}>
                    <BaseMenu.Popup
                        data-testid={testIds.part('Popup')}
                        className={clsx(styles.Popup, slotProps?.classes?.Popup)}>
                        {items.map((item, index) => (
                            <React.Fragment key={index}>
                                <BaseMenu.Item data-testid={testIds.part('Item', index)} className={clsx(styles.Item, slotProps?.classes?.Item)}>
                                    {item}
                                </BaseMenu.Item>
                                {index !== items.length - 1 &&
                                    <BaseSeparator data-testid={testIds.part('Separator', index)} className={clsx(styles.Separator, slotProps?.classes?.Separator)} />}
                            </React.Fragment>
                        ))}
                    </BaseMenu.Popup>
                </BaseMenu.Positioner>
            </BaseMenu.Portal>
        </BaseMenu.SubmenuRoot>
    )
}
