import { Menu as BaseMenu } from "@base-ui/react"
import type { ReactNode } from "react"
import styles from './Menu.module.scss'
import type { ClassNames } from "../../types/baseui"
import clsx from "clsx"
import { MenuIcon } from 'lucide-react'
import { createTestIdBuilder } from "../../utils/testIds"
type SlotProps = {
    classes?: ClassNames<typeof BaseMenu>;
    trigger?: ReactNode;
}

type MenuProps = {
    items: ReactNode[];
    slotProps?: SlotProps;
    name?: string;
    testId?: string;
} & BaseMenu.Root.Props;

export const Menu = ({ items, slotProps, name, testId, ...props }: MenuProps) => {
    const testIds = createTestIdBuilder('Menu', { name, testId });

    return (
        <BaseMenu.Root {...props}>
            <BaseMenu.Trigger data-testid={testIds.part('Trigger')} className={clsx(styles.Button, slotProps?.classes?.Trigger)}>
                {slotProps?.trigger ?? <MenuIcon />}
            </BaseMenu.Trigger>
            <BaseMenu.Portal>
                <BaseMenu.Positioner className={clsx(styles.Positioner, slotProps?.classes?.Positioner)} sideOffset={8}>
                    <BaseMenu.Popup data-testid={testIds.part('Popup')} className={clsx(styles.Popup, slotProps?.classes?.Popup)}>
                        {items.map((item, index) => (
                            <BaseMenu.Item data-testid={testIds.part('Item', index)} className={clsx(styles.Item, slotProps?.classes?.Item)} key={index}>
                                {item}
                            </BaseMenu.Item>
                        ))}
                    </BaseMenu.Popup>
                </BaseMenu.Positioner>
            </BaseMenu.Portal>
        </BaseMenu.Root>
    )
}
