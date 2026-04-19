import { Field as BaseField } from "@base-ui/react"
import styles from './Typegraphy.module.scss'
import type { PropsWithChildren } from "react"
import clsx from "clsx";
import { buildTestId } from '../../utils/testIds';

type Classes = {
    Field?: keyof typeof styles;
}

type SlotProps = {
    classes?: Classes;
}

type TypographyProps = PropsWithChildren & {
    slotProps?: SlotProps;
    testId?: string;
} & BaseField.Label.Props

export const Typography = ({ children, slotProps, testId, ...props }: TypographyProps) => {
    return (
        <BaseField.Root
            data-testid={buildTestId(testId, 'field')}
            className={clsx(styles.Field, slotProps?.classes?.Field)}>
            <BaseField.Label
                {...props}
                data-testid={buildTestId(testId, 'label')}
                className={clsx(styles.Label, props.className)}>
                {children}
            </BaseField.Label>
        </BaseField.Root>
    )
}
