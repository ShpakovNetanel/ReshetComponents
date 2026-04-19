import clsx from 'clsx';
import styles from './Chip.module.scss';
import type { MouseEventHandler, ReactNode } from 'react';

type Classes = {
    Label?: string | undefined;
}

type SlotProps = {
    classes?: Classes;
    backgroundColor?: string;
}

type ChipProps = {
    label: ReactNode;
    slotProps?: SlotProps;
    onChipClick?: MouseEventHandler<HTMLElement>;
    testId?: string;
}

const normalizeHex = (value: string) => {
    const hex = value.trim().replace('#', '');

    if (hex.length === 3) {
        return hex.split('').map((part) => `${part}${part}`).join('');
    }

    return hex.length === 6 ? hex : null;
};

const extractRgb = (value: string) => {
    const normalizedHex = normalizeHex(value);

    if (normalizedHex) {
        return {
            r: parseInt(normalizedHex.slice(0, 2), 16),
            g: parseInt(normalizedHex.slice(2, 4), 16),
            b: parseInt(normalizedHex.slice(4, 6), 16),
        };
    }

    const rgbMatch = value.match(/rgba?\(\s*(\d{1,3})[\s,]+(\d{1,3})[\s,]+(\d{1,3})/i);

    if (!rgbMatch) {
        return null;
    }

    return {
        r: Number(rgbMatch[1]),
        g: Number(rgbMatch[2]),
        b: Number(rgbMatch[3]),
    };
};

const getReadableForeground = (backgroundColor?: string) => {
    if (!backgroundColor) {
        return undefined;
    }

    const rgb = extractRgb(backgroundColor);

    if (!rgb) {
        return undefined;
    }

    const luminance = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;

    return luminance > 160 ? '#182131' : '#f8fbff';
};

export const Chip = ({ label, slotProps, onChipClick, testId }: ChipProps) => {
    const textColor = getReadableForeground(slotProps?.backgroundColor);

    return (
        <div className={clsx(styles.Label, slotProps?.classes?.Label)}
            data-testid={testId}
            style={{
                background: slotProps?.backgroundColor,
                ['--chip-foreground' as string]: textColor
            }}
            onClick={onChipClick}>
            {label}
        </div>
    )
}
