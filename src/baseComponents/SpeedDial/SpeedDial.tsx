import { Menu as BaseMenu } from "@base-ui/react";
import styles from "./SpeedDial.module.scss";
import React from "react";
import { createTestIdBuilder } from "../../utils/testIds";

export type SpeedDialItem = {
    component: React.ReactNode;
    closeOnClick?: boolean;
    visible: boolean;
};

type SpeedDialProps = {
    items: SpeedDialItem[];
    trigger: React.ReactNode;
    name?: string;
    testId?: string;
} & BaseMenu.Root.Props;

export const SpeedDial = ({ items, trigger, name, testId, ...props }: SpeedDialProps) => {
    const testIds = createTestIdBuilder('SpeedDial', { name, testId });

    return (
        <BaseMenu.Root {...props}>
            <BaseMenu.Trigger data-testid={testIds.part('Trigger')} className={styles.Button} openOnHover>
                {trigger}
            </BaseMenu.Trigger>
            <BaseMenu.Portal>
                <BaseMenu.Positioner className={styles.Positioner} sideOffset={8}>
                    <BaseMenu.Popup data-testid={testIds.part('Popup')} className={styles.Popup}>
                        {items.filter(item => item.visible).map((item, index) =>
                            <div key={index} data-testid={testIds.part('Item', index)}>
                                {item.component}
                            </div>
                        )}
                    </BaseMenu.Popup>
                </BaseMenu.Positioner>
            </BaseMenu.Portal>
        </BaseMenu.Root>
    );
}
