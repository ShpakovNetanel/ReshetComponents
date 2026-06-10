import { Button as BaseButton } from '@base-ui/react';
import type { PropsWithChildren } from 'react';
import styles from './Button.module.scss';
import clsx from 'clsx';
import { createTestIdBuilder } from '../../utils/testIds';

type ButtonProps = BaseButton.Props & PropsWithChildren & {
    name?: string;
    testId?: string;
};

export const Button = ({ name, testId, ...props }: ButtonProps) => {
    const testIds = createTestIdBuilder('Button', { name, testId });

    return <BaseButton {...props} name={name} data-testid={testIds.self()}
    className={clsx(styles.Button, props.className)}>{props.children}</BaseButton>
}
