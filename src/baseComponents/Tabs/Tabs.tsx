import { Tabs as BaseTabs } from "@base-ui/react"
import styles from './Tabs.module.scss'
import type { CSSProperties } from "react";
import type { ClassNames } from "../../types/baseui";
import clsx from "clsx";
import { createTestIdBuilder } from "../../utils/testIds";

type SlotProps = {
    classes?: ClassNames<typeof BaseTabs>
}

type TabsProps = {
    tabs: {
        value: number;
        label: string;
        color: string;
    }[];
    slotProps?: SlotProps;
    activeTab: number;
    setActiveTab: (tab: number) => void;
    name?: string;
    testId?: string;
}

export const Tabs = ({ tabs, activeTab, setActiveTab, slotProps, name, testId }: TabsProps) => {
    const testIds = createTestIdBuilder('Tabs', { name, testId });

    return (
        <BaseTabs.Root data-testid={testIds.self()} onValueChange={setActiveTab} value={activeTab} className={clsx(styles.Tabs, slotProps?.classes?.Root)} defaultValue="overview">
            <BaseTabs.List data-testid={testIds.part('List')} className={clsx(styles.List, slotProps?.classes?.List)}>
                {tabs.map(tab =>
                    <BaseTabs.Tab
                        key={tab.value}
                        data-testid={testIds.part('Tab', tab.value)}
                        id={tab.label}
                        className={clsx(styles.Tab, slotProps?.classes?.Tab)}
                        value={tab.value}
                        data-text={tab.label}
                        style={{
                            '--tab-color': tab.color
                        } as CSSProperties}>
                        <span className={styles.TabLabel}>{tab.label}</span>
                    </BaseTabs.Tab>
                )}
                <BaseTabs.Indicator data-testid={testIds.part('Indicator')} className={clsx(styles.Indicator, slotProps?.classes?.Indicator)} />
            </BaseTabs.List>
        </BaseTabs.Root>
    )
}
