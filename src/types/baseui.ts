import type { ComponentProps, FunctionComponent } from 'react';

export type BasePrimitive = Record<string, unknown>;

export type ClassNames<TPrimitive extends BasePrimitive, CustomSlots extends string = ''> = {
  [ComponentName in keyof TPrimitive as TPrimitive[ComponentName] extends FunctionComponent<any>
    ? 'className' extends keyof ComponentProps<TPrimitive[ComponentName]>
      ? ComponentName
      : never
    : never]?: string | undefined;
} & {
  [K in CustomSlots]?: string | undefined;
};
