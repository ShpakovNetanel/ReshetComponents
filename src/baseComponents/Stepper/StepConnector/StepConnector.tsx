import clsx from "clsx";
import { useStep } from "../StepProvider/StepProvider";
import styles from "./StepConnector.module.scss";
import { buildTestId } from "../../../utils/testIds";

type Classes = {
    Connector?: keyof typeof styles;
}

type SlotProps = {
    classes?: Classes;
}

type StepConnectorProps = {
    slotProps?: SlotProps;
    testId?: string;
}
export const StepConnector = ({ slotProps, testId }: StepConnectorProps) => {
    const { state } = useStep();

    return <div data-testid={buildTestId(testId, 'connector')} className={clsx(styles.Connector, slotProps?.classes?.Connector)}
        data-active={state === 'active' || undefined}
        data-completed={state === 'completed' || undefined}
        data-disabled={state === 'disabled' || undefined} />;
};
