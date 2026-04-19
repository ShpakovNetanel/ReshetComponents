import clsx from "clsx";
import type { PropsWithChildren } from "react";
import { useStep } from "../StepProvider/StepProvider";
import styles from "./StepLabel.module.scss";
import { buildTestId } from "../../../utils/testIds";

type Classes = {
    Label?: keyof typeof styles;
}

type SlotProps = {
    classes?: Classes;
}

type StepLabelProps = PropsWithChildren & {
    slotProps?: SlotProps;
    testId?: string;
}

export const StepLabel = ({ children, slotProps, testId }: StepLabelProps) => {
    const { state } = useStep();

    return <div
        data-testid={buildTestId(testId, 'label')}
        className={clsx(styles.Label, slotProps?.classes?.Label)}
        data-active={state === 'active' || undefined}
        data-completed={state === 'completed' || undefined}
        data-disabled={state === 'disabled' || undefined}>
        {children}
    </div>;
};
