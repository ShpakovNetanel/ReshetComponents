import { Input as BaseInput } from '@base-ui/react/input'
import { clsx } from 'clsx'
import { createTestIdBuilder } from '../../utils/testIds'
import styles from './Input.module.scss'
import type { RefAttributes } from 'react';

type InputProps = BaseInput.Props & RefAttributes<HTMLInputElement> & {
  name?: string;
  testId?: string;
}

export default function Input({ className, name, testId, ...props }: InputProps) {
  const testIds = createTestIdBuilder('Input', { name, testId })

  return <BaseInput {...props} name={name} data-testid={testIds.self()} className={clsx(styles.Input, className)} />
}
