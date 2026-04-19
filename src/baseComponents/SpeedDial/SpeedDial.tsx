import { Menu as BaseMenu } from "@base-ui/react";
import styles from "./SpeedDial.module.scss";
import React from "react";
import { buildTestId } from "../../utils/testIds";

export type SpeedDialItem = {
    component: React.ReactNode;
    closeOnClick?: boolean;
    visible: boolean;
};

type SpeedDialProps = {
    items: SpeedDialItem[];
    trigger: React.ReactNode;
    testId?: string;
} & BaseMenu.Root.Props;

export const SpeedDial = ({ items, trigger, testId, ...props }: SpeedDialProps) => {
    return (
        <BaseMenu.Root {...props}>
            <BaseMenu.Trigger data-testid={buildTestId(testId, 'trigger')} className={styles.Button} openOnHover>
                {trigger}
            </BaseMenu.Trigger>
            <BaseMenu.Portal>
                <BaseMenu.Positioner className={styles.Positioner} sideOffset={8}>
                    <BaseMenu.Popup data-testid={buildTestId(testId, 'popup')} className={styles.Popup}>
                        {items.filter(item => item.visible).map((item, index) =>
                            <div key={index} data-testid={buildTestId(testId, 'item', index)}>
                                {item.component}
                            </div>
                        )}
                    </BaseMenu.Popup>
                </BaseMenu.Positioner>
            </BaseMenu.Portal>
        </BaseMenu.Root>
    );
}
