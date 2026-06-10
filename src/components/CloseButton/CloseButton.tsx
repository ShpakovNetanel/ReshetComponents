import { Dialog as BaseDialog } from '@base-ui/react';
import clsx from 'clsx';
import { X } from 'lucide-react';
import type { PropsWithChildren } from 'react';
import { createTestIdBuilder } from '../../utils/testIds';
import styles from './CloseButton.module.scss';

export type CloseButtonProps = BaseDialog.Close.Props & PropsWithChildren & {
    name?: string;
    testId?: string;
};

export const CloseButton = ({ children, className, name, testId, ...props }: CloseButtonProps) => {
    const testIds = createTestIdBuilder('CloseButton', { name, testId });
    const hasVisibleText = typeof children === 'string' && children.trim().length > 0;

    return (
        <BaseDialog.Close
            {...props}
            name={name}
            aria-label={props['aria-label'] ?? (hasVisibleText ? undefined : 'Close')}
            data-testid={testIds.self()}
            className={clsx(styles.Button, className)}>
            {children ?? <X aria-hidden="true" className={styles.Icon} />}
        </BaseDialog.Close>
    );
};

export default CloseButton;
