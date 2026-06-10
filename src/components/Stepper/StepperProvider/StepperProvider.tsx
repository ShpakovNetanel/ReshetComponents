import {
  createContext,
  useContext,
  useState,
  type PropsWithChildren,
} from "react";

type StepperContextType = {
  active: number;
  setActive: (n: number) => void;
  orientation: "horizontal" | "vertical";
};

const StepperContext = createContext<StepperContextType | null>(null);

export const useStepper = () => {
  const ctx = useContext(StepperContext);
  if (!ctx) throw new Error("Stepper components must be inside <Stepper />");
  return ctx;
};

export type StepperProviderProps = PropsWithChildren & {
  active?: number;
  setActiveStep?: (step: number) => void
  defaultActive?: number;
  orientation?: "horizontal" | "vertical";
}

export const StepperProvider = ({
  active,
  setActiveStep,
  defaultActive = 0,
  orientation = "horizontal",
  children,
}: StepperProviderProps) => {
  const [internalActive, setInternalActive] = useState(defaultActive);

  const isControlled = active !== undefined;
  const current = isControlled ? active : internalActive;

  const setActive = (n: number) => {
    if (!isControlled) setInternalActive(n);

    setActiveStep?.(n);
  };

  return (
    <StepperContext.Provider value={{
      active: current!, setActive, orientation
    }}>
      {children}
    </StepperContext.Provider>
  );
};