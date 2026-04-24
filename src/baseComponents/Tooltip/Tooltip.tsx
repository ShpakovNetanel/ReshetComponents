import { Tooltip as BaseTooltip } from "@base-ui/react";
import clsx from "clsx";
import type { PropsWithChildren } from "react";
import { isEmptyish } from "remeda";
import type { ClassNames } from "../../types/baseui";
import type { Direction } from "../../types/types";
import { createTestIdBuilder } from "../../utils/testIds";
import { ArrowSvg } from "../ArrowSvg/ArrowSvg";
import styles from "./Tooltip.module.scss";

export type TooltipSlotProps = {
    side?: Direction;
    outlineColor?: string;
    boldType?: 'Outline' | 'BoxShadow';
    classes?: ClassNames<typeof BaseTooltip, 'Panel'>;
    disableArrow?: boolean;
    displayWhenEmpty?: boolean;
    provider?: BaseTooltip.Provider.Props;
}

type TooltipProps = {
    title: string;
    slotProps?: TooltipSlotProps
    name?: string;
    testId?: string;
} & PropsWithChildren & BaseTooltip.Root.Props;

export const Tooltip = ({ title, children, slotProps, name, testId, ...props }: TooltipProps) => {
    const testIds = createTestIdBuilder('Tooltip', { name, testId });
    const preferredSide = slotProps?.side ?? 'top';

    return (
        <BaseTooltip.Provider delay={100} {...slotProps?.provider}>
            <div data-testid={testIds.self()} className={clsx(styles.Panel, slotProps?.classes?.Panel)}>
                <BaseTooltip.Root {...props}>
                    <BaseTooltip.Trigger
                        render={<span />}
                        className={clsx(styles.Button, slotProps?.classes?.Trigger)}
                        data-testid={testIds.part('Trigger')}
                        data-visible={!isEmptyish(title) || slotProps?.displayWhenEmpty}>
                        {children}
                    </BaseTooltip.Trigger>
                    <BaseTooltip.Portal>
                        <BaseTooltip.Positioner
                            className={clsx(styles.Positioner, slotProps?.classes?.Positioner)}
                            side={preferredSide}
                            sideOffset={10}
                            arrowPadding={12}
                            collisionPadding={12}
                            collisionAvoidance={{
                                side: 'flip',
                                align: 'shift',
                                fallbackAxisSide: 'end',
                            }}>
                            {isEmptyish(title)
                                ? null
                                : <BaseTooltip.Popup className={clsx(styles.Popup, slotProps?.classes?.Popup)}
                                    data-testid={testIds.part('Popup')}
                                    data-bold={slotProps?.boldType ?? 'BoxShadow'}
                                    style={{
                                        '--outline-color': slotProps?.outlineColor ?? 'black'
                                    } as React.CSSProperties}>
                                    {!slotProps?.disableArrow && <BaseTooltip.Arrow data-testid={testIds.part('Arrow')} className={clsx(styles.Arrow, slotProps?.classes?.Arrow)}>
                                        <ArrowSvg outlineColor={slotProps?.outlineColor ?? 'black'}
                                            boldType={slotProps?.boldType ?? 'BoxShadow'} />
                                    </BaseTooltip.Arrow>}
                                    {title}
                                </BaseTooltip.Popup>}
                        </BaseTooltip.Positioner>
                    </BaseTooltip.Portal>
                </BaseTooltip.Root>
            </div>
        </BaseTooltip.Provider>
    )
}
