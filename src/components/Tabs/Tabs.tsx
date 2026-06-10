import { Tabs as BaseTabs } from "@base-ui/react"
import styles from './Tabs.module.scss'
import type { CSSProperties, ReactNode } from "react";
import type { ClassNames } from "../../types/baseui";
import clsx from "clsx";
import { createTestIdBuilder } from "../../utils/testIds";

type SlotProps = {
    classes?: ClassNames<typeof BaseTabs>
}

type TabsProps = {
    tabs: {
        value: number | string;
        label: ReactNode;
        labelText?: string;
        color?: string;
    }[];
    slotProps?: SlotProps;
    activeTab: number | string;
    setActiveTab: (tab: number | string) => void;
    name?: string;
    testId?: string;
}

export const Tabs = ({ tabs, activeTab, setActiveTab, slotProps, name, testId }: TabsProps) => {
    const testIds = createTestIdBuilder('Tabs', { name, testId });
    const activeTabColor = tabs.find(tab => tab.value === activeTab)?.color ?? tabs[0]?.color ?? 'currentColor';

    return (
        <BaseTabs.Root data-testid={testIds.self()} onValueChange={setActiveTab} value={activeTab} className={clsx(styles.Tabs, slotProps?.classes?.Root)} defaultValue="overview">
            <BaseTabs.List
                data-testid={testIds.part('List')}
                className={clsx(styles.List, slotProps?.classes?.List)}
                style={{
                    '--active-tab-color': activeTabColor
                } as CSSProperties}>
                {tabs.map(tab => {
                    const isTextLabel = typeof tab.label === 'string' || typeof tab.label === 'number';
                    const labelText = tab.labelText ?? (isTextLabel ? String(tab.label) : String(tab.value));
                    const ariaLabel = tab.labelText ?? (isTextLabel ? String(tab.label) : undefined);

                    return (
                        <BaseTabs.Tab
                            key={tab.value}
                            data-testid={testIds.part('Tab', tab.value)}
                            id={labelText}
                            aria-label={ariaLabel}
                            className={clsx(styles.Tab, slotProps?.classes?.Tab)}
                            value={tab.value}
                            data-text={labelText}
                            style={{
                                '--tab-color': tab.color
                            } as CSSProperties}>
                            <span className={styles.TabSizer} aria-hidden="true">{tab.label}</span>
                            <span className={styles.TabLabel}>{tab.label}</span>
                        </BaseTabs.Tab>
                    );
                })}
                <BaseTabs.Indicator data-testid={testIds.part('Indicator')} className={clsx(styles.Indicator, slotProps?.classes?.Indicator)} />
            </BaseTabs.List>
        </BaseTabs.Root>
    )
}
