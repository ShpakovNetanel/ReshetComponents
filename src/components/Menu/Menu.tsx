import { Menu as BaseMenu } from "@base-ui/react"
import { Fragment, isValidElement, type ReactNode } from "react"
import styles from './Menu.module.scss'
import type { ClassNames } from "../../types/baseui"
import clsx from "clsx"
import { MenuIcon } from 'lucide-react'
import { createTestIdBuilder } from "../../utils/testIds"

export type MenuGroup = {
    label?: ReactNode;
    items: ReactNode[];
}

type SlotProps = {
    classes?: ClassNames<typeof BaseMenu, 'Separator'>;
    trigger?: ReactNode;
}

type MenuProps = {
    items: ReactNode[] | MenuGroup[];
    slotProps?: SlotProps;
    name?: string;
    testId?: string;
} & BaseMenu.Root.Props;

const isMenuGroup = (item: ReactNode | MenuGroup): item is MenuGroup =>
    !isValidElement(item) &&
    typeof item === 'object' &&
    item !== null &&
    'items' in item &&
    Array.isArray((item as MenuGroup).items);

export const Menu = ({ items, slotProps, name, testId, ...props }: MenuProps) => {
    const testIds = createTestIdBuilder('Menu', { name, testId });
    const renderItem = (item: ReactNode, index: number, groupIndex?: number) => {
        const suffix = groupIndex === undefined ? index : `${groupIndex}-${index}`;

        return (
            <BaseMenu.Item
                data-testid={testIds.part('Item', suffix)}
                className={clsx(styles.Item, slotProps?.classes?.Item)}
                key={suffix}>
                {item}
            </BaseMenu.Item>
        );
    };

    return (
        <BaseMenu.Root {...props}>
            <BaseMenu.Trigger data-testid={testIds.part('Trigger')} className={clsx(styles.Button, slotProps?.classes?.Trigger)}>
                {slotProps?.trigger ?? <MenuIcon />}
            </BaseMenu.Trigger>
            <BaseMenu.Portal>
                <BaseMenu.Positioner className={clsx(styles.Positioner, slotProps?.classes?.Positioner)} sideOffset={8}>
                    <BaseMenu.Popup data-testid={testIds.part('Popup')} className={clsx(styles.Popup, slotProps?.classes?.Popup)}>
                        {items.map((item, index) => {
                            if (!isMenuGroup(item)) {
                                return renderItem(item, index);
                            }

                            return (
                                <Fragment key={index}>
                                    <BaseMenu.Group
                                        data-testid={testIds.part('Group', index)}
                                        className={clsx(styles.Group, slotProps?.classes?.Group)}>
                                        {item.label && (
                                            <BaseMenu.GroupLabel
                                                data-testid={testIds.part('GroupLabel', index)}
                                                className={clsx(styles.GroupLabel, slotProps?.classes?.GroupLabel)}>
                                                {item.label}
                                            </BaseMenu.GroupLabel>
                                        )}
                                        {item.items.map((groupItem, groupItemIndex) =>
                                            renderItem(groupItem, groupItemIndex, index)
                                        )}
                                    </BaseMenu.Group>
                                    {index < items.length - 1 && (
                                        <BaseMenu.Separator
                                            data-testid={testIds.part('Separator', index)}
                                            className={clsx(styles.Separator, slotProps?.classes?.Separator)}
                                        />
                                    )}
                                </Fragment>
                            );
                        })}
                    </BaseMenu.Popup>
                </BaseMenu.Positioner>
            </BaseMenu.Portal>
        </BaseMenu.Root>
    )
}
