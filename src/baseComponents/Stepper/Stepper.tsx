import type { PropsWithChildren } from "react";
import { StepperProvider } from "./StepperProvider/StepperProvider";
import clsx from "clsx";
import styles from "./Stepper.module.scss";
import { buildTestId } from "../../utils/testIds";

type Classes = {
    Stepper?: keyof typeof styles;
}

type SlotProps = {
    classes: Classes;
}

export type StepperProps = PropsWithChildren & {
  active?: number;
  setActiveStep?: (step: number) => void
  defaultActive?: number;
  orientation?: "horizontal" | "vertical";
  slotProps?: SlotProps;
  testId?: string;
  
};

export const Stepper= ({
  slotProps,
  children,
  testId,
  ...providerProps
}: StepperProps) => {
  return (
    <StepperProvider {...providerProps}>
      <div
        data-testid={buildTestId(testId, 'root')}
        className={clsx(
          styles.Stepper,
          styles[providerProps.orientation || "horizontal"],
          slotProps?.classes?.Stepper
        )}
      >
        {children}
      </div>
    </StepperProvider>
  );
};
