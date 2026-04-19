import { Input as BaseInput } from '@base-ui/react/input'
import { clsx } from 'clsx'
import styles from './Input.module.scss'
import type { RefAttributes } from 'react';

type InputProps = BaseInput.Props & RefAttributes<HTMLInputElement> & {
  testId?: string;
}

export default function Input({ className, testId, ...props }: InputProps) {
  return <BaseInput {...props} data-testid={testId} className={clsx(styles.Input, className)} />
}
