import clsx from "clsx";
import { type CSSProperties, type MouseEventHandler, type PropsWithChildren } from "react";
import { useStepper } from "../StepperProvider/StepperProvider";
import { StepProvider } from "../StepProvider/StepProvider";
import styles from "./Step.module.scss";
import { createTestIdBuilder } from "../../../utils/testIds";

export type StepState = 'disabled' | 'active' | 'inactive' | 'completed';

type Classes = {
    Step?: keyof typeof styles;
}

type SlotProps = {
    classes?: Classes;
    style?: CSSProperties;
}

export type StepProps = PropsWithChildren & {
    index: number;
    disabled?: boolean;
    completed?: boolean;
    onStepClick?: MouseEventHandler<HTMLElement>;
    slotProps?: SlotProps;
    name?: string;
    testId?: string;
};

export const Step = ({ index, disabled, children,
    completed, onStepClick, slotProps, name, testId }: StepProps) => {
    const { active, setActive, orientation } = useStepper();
    const testIds = createTestIdBuilder('Step', { name, testId });

    const state: StepState = disabled
        ? "disabled"
        : index === active
            ? "active"
            : completed ?? index < active
                ? "completed"
                : "inactive";

    return (
        <StepProvider stepIndex={index} state={state}>
            <div
                data-testid={testIds.self(index)}
                className={clsx(styles.Step, slotProps?.classes?.Step)}
                data-state={state}
                data-orientation={orientation}
                data-disabled={disabled || undefined}
                onClick={onStepClick
                    ? onStepClick
                    : () => {
                        !disabled && setActive(index)
                    }}
                style={slotProps?.style}
            >
                {children}
            </div>
        </StepProvider >
    );
};
