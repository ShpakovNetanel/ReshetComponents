import type { PropsWithChildren } from "react";
import { StepperProvider } from "./StepperProvider/StepperProvider";
import clsx from "clsx";
import styles from "./Stepper.module.scss";
import { createTestIdBuilder } from "../../utils/testIds";

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
  name?: string;
  testId?: string;
  
};

export const Stepper= ({
  slotProps,
  children,
  name,
  testId,
  ...providerProps
}: StepperProps) => {
  const testIds = createTestIdBuilder('Stepper', { name, testId });

  return (
    <StepperProvider {...providerProps}>
      <div
        data-testid={testIds.self()}
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
