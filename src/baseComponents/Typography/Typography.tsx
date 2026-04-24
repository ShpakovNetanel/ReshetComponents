import { Field as BaseField } from "@base-ui/react"
import styles from './Typegraphy.module.scss'
import type { PropsWithChildren } from "react"
import clsx from "clsx";
import { createTestIdBuilder } from '../../utils/testIds';

type Classes = {
    Field?: keyof typeof styles;
}

type SlotProps = {
    classes?: Classes;
}

type TypographyProps = PropsWithChildren & {
    slotProps?: SlotProps;
    name?: string;
    testId?: string;
} & BaseField.Label.Props

export const Typography = ({ children, slotProps, name, testId, ...props }: TypographyProps) => {
    const testIds = createTestIdBuilder('Typography', { name, testId });

    return (
        <BaseField.Root
            data-testid={testIds.self()}
            className={clsx(styles.Field, slotProps?.classes?.Field)}>
            <BaseField.Label
                {...props}
                data-testid={testIds.part('Label')}
                className={clsx(styles.Label, props.className)}>
                {children}
            </BaseField.Label>
        </BaseField.Root>
    )
}
