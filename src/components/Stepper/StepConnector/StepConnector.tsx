import clsx from "clsx";
import { useStep } from "../StepProvider/StepProvider";
import styles from "./StepConnector.module.scss";
import { createTestIdBuilder } from "../../../utils/testIds";

type Classes = {
    Connector?: keyof typeof styles;
}

type SlotProps = {
    classes?: Classes;
}

type StepConnectorProps = {
    slotProps?: SlotProps;
    name?: string;
    testId?: string;
}
export const StepConnector = ({ slotProps, name, testId }: StepConnectorProps) => {
    const { state } = useStep();
    const testIds = createTestIdBuilder('StepConnector', { name, testId });

    return <div data-testid={testIds.self()} className={clsx(styles.Connector, slotProps?.classes?.Connector)}
        data-active={state === 'active' || undefined}
        data-completed={state === 'completed' || undefined}
        data-disabled={state === 'disabled' || undefined} />;
};
