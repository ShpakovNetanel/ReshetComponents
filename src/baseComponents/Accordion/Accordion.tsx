import { Accordion as BaseAccordion } from "@base-ui/react";
import clsx from "clsx";
import { ChevronRight } from "lucide-react";
import { useState, type HTMLAttributes, type PropsWithChildren, type ReactNode } from "react";
import type { ClassNames } from "../../types/baseui";
import { createTestIdBuilder } from "../../utils/testIds";
import styles from './Accordion.module.scss';

type HeaderProps = HTMLAttributes<HTMLDivElement> & {
    [key: `data-${string}`]: string | undefined;
};

type SlotProps = {
    classes?: ClassNames<typeof BaseAccordion>;
    headerProps?: HeaderProps;
}

type AccordionProps = {
    slotProps?: SlotProps;
    title?: ReactNode;
    actions?: ReactNode;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    name?: string;
    testId?: string;
} & PropsWithChildren;

export const Accordion = ({
    title,
    actions,
    children,
    slotProps,
    defaultOpen = true,
    onOpenChange: onOpenChangeProp,
    name,
    testId,
    ...props
}: AccordionProps) => {
    const [openState, setOpenState] = useState(defaultOpen);
    const testIds = createTestIdBuilder('Accordion', { name, testId });

    const handleOpenChange = (open: boolean) => {
        setOpenState(open);
        onOpenChangeProp?.(open);
    }

    return (
        <BaseAccordion.Root
            data-testid={testIds.self()}
            value={openState ? ['item'] : []}
            className={clsx(styles.Accordion, slotProps?.classes?.Root)}
            {...props}>
            <BaseAccordion.Item data-testid={testIds.part('Item')} onOpenChange={handleOpenChange} value="item" className={clsx(styles.Item, slotProps?.classes?.Item)}>
                <div
                    data-testid={slotProps?.headerProps?.['data-testid'] ?? testIds.part('Header')}
                    {...slotProps?.headerProps}
                    className={clsx(styles.Header, slotProps?.classes?.Header, slotProps?.headerProps?.className)}>
                    <BaseAccordion.Trigger data-testid={testIds.part('Trigger')} className={clsx(styles.Trigger, slotProps?.classes?.Trigger)}>
                        <ChevronRight aria-hidden="true" className={styles.TriggerIcon} />
                        {title}
                    </BaseAccordion.Trigger>
                    {actions}
                </div>
                <BaseAccordion.Panel data-testid={testIds.part('Panel')} className={clsx(styles.Panel, slotProps?.classes?.Panel)}>
                    {children}
                </BaseAccordion.Panel>
            </BaseAccordion.Item>
        </BaseAccordion.Root>
    )
}
