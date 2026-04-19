import { Tabs as BaseTabs } from "@base-ui/react"
import styles from './Tabs.module.scss'
import type { CSSProperties } from "react";
import type { ClassNames } from "../../types/baseui";
import clsx from "clsx";
import { buildTestId } from "../../utils/testIds";

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
    testId?: string;
}

export const Tabs = ({ tabs, activeTab, setActiveTab, slotProps, testId }: TabsProps) => {
    return (
        <BaseTabs.Root data-testid={buildTestId(testId, 'root')} onValueChange={setActiveTab} value={activeTab} className={clsx(styles.Tabs, slotProps?.classes?.Root)} defaultValue="overview">
            <BaseTabs.List data-testid={buildTestId(testId, 'list')} className={clsx(styles.List, slotProps?.classes?.List)}>
                {tabs.map(tab =>
                    <BaseTabs.Tab
                        key={tab.value}
                        data-testid={buildTestId(testId, 'tab', tab.value)}
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
                <BaseTabs.Indicator data-testid={buildTestId(testId, 'indicator')} className={clsx(styles.Indicator, slotProps?.classes?.Indicator)} />
            </BaseTabs.List>
        </BaseTabs.Root>
    )
}
