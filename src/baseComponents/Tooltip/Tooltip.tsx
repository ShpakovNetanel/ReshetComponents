import { Tooltip as BaseTooltip } from "@base-ui/react";
import clsx from "clsx";
import type { PropsWithChildren } from "react";
import { isEmptyish } from "remeda";
import type { ClassNames } from "../../types/baseui";
import type { Direction } from "../../types/types";
import { buildTestId } from "../../utils/testIds";
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
    testId?: string;
} & PropsWithChildren & BaseTooltip.Root.Props;

export const Tooltip = ({ title, children, slotProps, testId, ...props }: TooltipProps) => {
    return (
        <BaseTooltip.Provider delay={100} {...slotProps?.provider}>
                <div data-testid={buildTestId(testId, 'wrapper')} className={clsx(styles.Panel, slotProps?.classes?.Panel)}>
                <BaseTooltip.Root {...props}>
                    <BaseTooltip.Trigger
                        render={<span />}
                        className={clsx(styles.Button, slotProps?.classes?.Trigger)}
                        data-testid={buildTestId(testId, 'trigger')}
                        data-visible={!isEmptyish(title) || slotProps?.displayWhenEmpty}>
                        {children}
                    </BaseTooltip.Trigger>
                    <BaseTooltip.Portal>
                        <BaseTooltip.Positioner sideOffset={10} side={slotProps?.side ?? 'top'}>
                            {isEmptyish(title)
                                ? <></>
                                : <BaseTooltip.Popup className={clsx(styles.Popup, slotProps?.classes?.Popup)}
                                    data-testid={buildTestId(testId, 'popup')}
                                    data-bold={slotProps?.boldType ?? 'BoxShadow'}
                                    style={{
                                        '--outline-color': slotProps?.outlineColor ?? 'black'
                                    } as React.CSSProperties}>
                                    {!slotProps?.disableArrow && <BaseTooltip.Arrow data-testid={buildTestId(testId, 'arrow')} className={clsx(styles.Arrow, slotProps?.classes?.Arrow)}
                                        data-side={slotProps?.side ?? 'bottom'}>
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
