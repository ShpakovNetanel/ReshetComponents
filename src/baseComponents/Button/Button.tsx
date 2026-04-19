import { Button as BaseButton } from '@base-ui/react';
import type { PropsWithChildren } from 'react';
import styles from './Button.module.scss';
import clsx from 'clsx';

type ButtonProps = BaseButton.Props & PropsWithChildren & {
    testId?: string;
};

export const Button = ({ testId, ...props }: ButtonProps) => {
    return <BaseButton {...props} data-testid={testId}
    className={clsx(styles.Button, props.className)}>{props.children}</BaseButton>
}
