import clsx from "clsx";
import { Check } from "lucide-react";
import type { ReactNode } from "react";
import { useStep } from "../StepProvider/StepProvider";
import styles from "./StepIndicator.module.scss";
import { createTestIdBuilder } from "../../../utils/testIds";

type Classes = {
    Indicator?: keyof typeof styles;
    Icon?: keyof typeof styles;
}

type SlotProps = {
    classes?: Classes;
    completedIcon?: ReactNode;
}

type StepIndicatorProps = {
    slotProps?: SlotProps;
    name?: string;
    testId?: string;
}

export const StepIndicator = ({ slotProps, name, testId }: StepIndicatorProps) => {
    const { stepIndex, state } = useStep();
    const testIds = createTestIdBuilder('StepIndicator', { name, testId });

    return (
        <div
            data-testid={testIds.self()}
            className={clsx(styles.Indicator, slotProps?.classes?.Indicator)}
            data-active={state === 'active' || undefined}
            data-completed={state === 'completed' || undefined}
            data-disabled={state === 'disabled' || undefined}>
            {state === 'completed'
                ? slotProps?.completedIcon ?? <Check className={clsx(styles.Icon, slotProps?.classes?.Icon)} size={12} />
                : stepIndex}
        </div>
    );
};
