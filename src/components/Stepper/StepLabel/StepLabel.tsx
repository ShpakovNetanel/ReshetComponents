import clsx from "clsx";
import type { PropsWithChildren } from "react";
import { useStep } from "../StepProvider/StepProvider";
import styles from "./StepLabel.module.scss";
import { createTestIdBuilder } from "../../../utils/testIds";

type Classes = {
    Label?: keyof typeof styles;
}

type SlotProps = {
    classes?: Classes;
}

type StepLabelProps = PropsWithChildren & {
    slotProps?: SlotProps;
    name?: string;
    testId?: string;
}

export const StepLabel = ({ children, slotProps, name, testId }: StepLabelProps) => {
    const { state } = useStep();
    const testIds = createTestIdBuilder('StepLabel', { name, testId });

    return <div
        data-testid={testIds.self()}
        className={clsx(styles.Label, slotProps?.classes?.Label)}
        data-active={state === 'active' || undefined}
        data-completed={state === 'completed' || undefined}
        data-disabled={state === 'disabled' || undefined}>
        {children}
    </div>;
};
