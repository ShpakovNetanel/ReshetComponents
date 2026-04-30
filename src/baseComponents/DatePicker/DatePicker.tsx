import { Popover as BasePopover } from '@base-ui/react'
import clsx from 'clsx'
import { endOfMonth, format, isAfter, isValid, parse, startOfDay } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { useEffect, useId, useMemo, useState, type ChangeEvent, type ReactNode } from 'react'
import type { DateRange } from 'react-day-picker'
import { createTestIdBuilder } from '../../utils/testIds'
import Calendar from '../Calendar/Calendar'
import type { CalendarSlotProps } from '../Calendar/Calendar'
import Input from '../Input/Input'
import styles from './DatePicker.module.scss'
import { Button } from '../Button/Button'

export type DatePickerChangeDetails = {
    source: 'calendar' | 'input';
}

const DATE_FORMAT = 'dd.MM.yyyy';
const MULTIPLE_DATE_SEPARATOR = ', ';
const RANGE_DATE_SEPARATOR = ' - ';

export type DatePickerMode = 'single' | 'multiple' | 'range';

type DatePickerValueByMode = {
    single: Date;
    multiple: Date[];
    range: DateRange;
}

type DatePickerCommonProps = {
    maxDate?: Date;
    open?: boolean;
    disabled?: boolean;
    onOpenChange?: (open: boolean) => void;
    closeOnSelect?: boolean;
    popupFooter?: ReactNode;
    dateFormat?: string;
    slotProps?: {
        calendar?: CalendarSlotProps;
        classes?: {
            InputWrapper?: string;
            Input?: string;
            Trigger?: string;
            CalendarIcon?: string;
            Positioner?: string;
            PopupStack?: string;
            Popup?: string;
        }
    };
    name?: string;
    testId?: string;
}

type DatePickerModeProps<Mode extends DatePickerMode> = DatePickerCommonProps & {
    mode: Mode;
    value: DatePickerValueByMode[Mode];
    onValueChange: (value: DatePickerValueByMode[Mode], details: DatePickerChangeDetails) => void;
    displayValue?: DatePickerValueByMode[Mode];
}

export type DatePickerSingleProps = DatePickerCommonProps & {
    mode?: 'single';
    value: Date;
    onValueChange: (date: Date, details: DatePickerChangeDetails) => void;
    displayValue?: Date;
}

export type DatePickerMultipleProps = DatePickerModeProps<'multiple'>;
export type DatePickerRangeProps = DatePickerModeProps<'range'>;
export type DatePickerProps = DatePickerSingleProps | DatePickerMultipleProps | DatePickerRangeProps;

const isValidDate = (date: Date | undefined): date is Date =>
    date instanceof Date && isValid(date);

const formatDate = (date: Date | undefined, dateFormat: string) =>
    isValidDate(date) ? format(date, dateFormat) : '';

const formatSelection = (
    value: Date | Date[] | DateRange,
    mode: DatePickerMode,
    dateFormat: string
) => {
    if (mode === 'multiple') {
        return (value as Date[])
            .filter(isValidDate)
            .map((date) => format(date, dateFormat))
            .join(MULTIPLE_DATE_SEPARATOR);
    }

    if (mode === 'range') {
        const range = value as DateRange;
        const from = formatDate(range.from, dateFormat);
        const to = formatDate(range.to, dateFormat);

        if (!from) {
            return '';
        }

        return to ? `${from}${RANGE_DATE_SEPARATOR}${to}` : from;
    }

    return formatDate(value as Date, dateFormat);
};

const getSelectionMonth = (
    value: Date | Date[] | DateRange,
    mode: DatePickerMode
) => {
    if (mode === 'multiple') {
        return (value as Date[]).find(isValidDate);
    }

    if (mode === 'range') {
        const range = value as DateRange;
        return isValidDate(range.from) ? range.from : range.to;
    }

    return isValidDate(value as Date) ? (value as Date) : undefined;
};

const parseDateValue = (value: string, dateFormat: string) => {
    const parsedDate = parse(value.trim(), dateFormat, new Date());

    if (isValid(parsedDate) && format(parsedDate, dateFormat) === value.trim()) {
        return parsedDate;
    }

    return undefined;
};

const isMultipleDatePickerProps = (props: DatePickerProps): props is DatePickerMultipleProps =>
    props.mode === 'multiple';

const isRangeDatePickerProps = (props: DatePickerProps): props is DatePickerRangeProps =>
    props.mode === 'range';

export const DatePicker = (props: DatePickerProps) => {
    const {
        maxDate,
        open,
        disabled,
        onOpenChange,
        closeOnSelect = true,
        popupFooter,
        dateFormat = DATE_FORMAT,
        slotProps,
        name,
        testId,
    } = props;
    const mode = props.mode ?? 'single';
    const inputId = useId();
    const testIds = createTestIdBuilder('DatePicker', { name, testId });
    const selectedValue = props.displayValue ?? props.value;
    const selectedMonth = getSelectionMonth(selectedValue, mode);
    const normalizedMaxDate = useMemo(
        () => (maxDate ? startOfDay(maxDate) : undefined),
        [maxDate]
    );
    const endMonth = useMemo(
        () => (normalizedMaxDate ? endOfMonth(normalizedMaxDate) : undefined),
        [normalizedMaxDate]
    );
    const disabledDays = disabled || (normalizedMaxDate ? { after: normalizedMaxDate } : undefined);
    const [month, setMonth] = useState(selectedMonth);
    const [internalOpen, setInternalOpen] = useState(false);
    const [inputValue, setInputValue] = useState(
        formatSelection(selectedValue, mode, dateFormat)
    );
    const isDateOpened = !disabled && (open ?? internalOpen);

    useEffect(() => {
        if (selectedMonth) {
            setMonth(selectedMonth);
        }

        setInputValue(formatSelection(selectedValue, mode, dateFormat));
    }, [selectedValue, selectedMonth, mode, dateFormat]);

    useEffect(() => {
        if (!isDateOpened) {
            setInputValue(formatSelection(selectedValue, mode, dateFormat));
        }
    }, [isDateOpened, selectedValue, mode, dateFormat]);

    const setDatePickerOpen = (nextOpen: boolean) => {
        if (disabled) {
            if (open === undefined) {
                setInternalOpen(false);
            }

            onOpenChange?.(false);
            return;
        }

        if (open === undefined) {
            setInternalOpen(nextOpen);
        }

        onOpenChange?.(nextOpen);
    };

    const clampDate = (date: Date) => {
        const normalizedDate = startOfDay(date);

        if (normalizedMaxDate && isAfter(normalizedDate, normalizedMaxDate)) {
            return normalizedMaxDate;
        }

        return normalizedDate;
    };

    const clampDates = (dates: Date[]) =>
        dates.map(clampDate).filter((date, index, clampedDates) =>
            clampedDates.findIndex((clampedDate) => clampedDate.getTime() === date.getTime()) === index
        );

    const clampRange = (range: DateRange) => ({
        from: range.from ? clampDate(range.from) : undefined,
        to: range.to ? clampDate(range.to) : undefined,
    });

    const closeAfterCalendarSelect = () => {
        if (closeOnSelect) {
            setDatePickerOpen(false);
        }
    };

    const handleSingleSelect = (date: Date | undefined) => {
        if (disabled) {
            return;
        }

        if (isMultipleDatePickerProps(props) || isRangeDatePickerProps(props)) {
            return;
        }

        if (!date) {
            return;
        }

        const normalizedDate = startOfDay(date);

        if (normalizedMaxDate && isAfter(normalizedDate, normalizedMaxDate)) {
            return;
        }

        props.onValueChange(clampDate(normalizedDate), { source: 'calendar' });
        closeAfterCalendarSelect();
    };

    const handleMultipleSelect = (dates: Date[] | undefined) => {
        if (disabled) {
            return;
        }

        if (!isMultipleDatePickerProps(props)) {
            return;
        }

        props.onValueChange(clampDates(dates ?? []), { source: 'calendar' });
        closeAfterCalendarSelect();
    };

    const handleRangeSelect = (range: DateRange | undefined) => {
        if (disabled) {
            return;
        }

        if (!isRangeDatePickerProps(props)) {
            return;
        }

        if (!range) {
            props.onValueChange({ from: undefined }, { source: 'calendar' });
            closeAfterCalendarSelect();
            return;
        }

        props.onValueChange(clampRange(range), { source: 'calendar' });

        if (range.to) {
            closeAfterCalendarSelect();
        }
    };

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (disabled) {
            return;
        }

        const nextValue = event.target.value;
        setInputValue(nextValue);

        if (!nextValue.trim()) {
            return;
        }

        if (isMultipleDatePickerProps(props)) {
            const dates = nextValue
                .split(MULTIPLE_DATE_SEPARATOR)
                .map((value) => parseDateValue(value, dateFormat));

            if (dates.every(isValidDate)) {
                props.onValueChange(clampDates(dates), { source: 'input' });
            }
            return;
        }

        if (isRangeDatePickerProps(props)) {
            const [fromValue, toValue] = nextValue.split(RANGE_DATE_SEPARATOR);
            const from = parseDateValue(fromValue ?? '', dateFormat);
            const to = parseDateValue(toValue ?? '', dateFormat);

            if (from && (!toValue || to)) {
                props.onValueChange(clampRange({ from, to }), { source: 'input' });
            }
            return;
        }

        const parsedDate = parseDateValue(nextValue, dateFormat);

        if (parsedDate) {
            props.onValueChange(clampDate(parsedDate), { source: 'input' });
        }
    };

    const calendarProps = {
        testId: testIds.part('Calendar'),
        fluid: true,
        slotProps: slotProps?.calendar,
        month,
        endMonth,
        onMonthChange: setMonth,
        disabled: disabledDays,
    };

    const renderCalendar = () => {
        if (isMultipleDatePickerProps(props)) {
            return (
                <Calendar
                    {...calendarProps}
                    mode='multiple'
                    selected={props.value}
                    onSelect={handleMultipleSelect}
                />
            );
        }

        if (isRangeDatePickerProps(props)) {
            return (
                <Calendar
                    {...calendarProps}
                    mode='range'
                    selected={props.value}
                    onSelect={handleRangeSelect}
                />
            );
        }

        return (
            <Calendar
                {...calendarProps}
                mode='single'
                selected={isValidDate(props.value) ? props.value : undefined}
                onSelect={handleSingleSelect}
            />
        );
    };

    return (
        <BasePopover.Root open={isDateOpened} onOpenChange={setDatePickerOpen}>
            <div
                data-testid={testIds.self()}
                className={clsx(styles.InputWrapper, slotProps?.classes?.InputWrapper)}
                data-disabled={disabled || undefined}>
                <Input
                    id={inputId}
                    name={name}
                    testId={testIds.part('Input')}
                    value={inputValue}
                    onChange={handleInputChange}
                    disabled={disabled}
                    placeholder={dateFormat}
                    className={clsx(styles.Date, slotProps?.classes?.Input)}
                    onClick={() => {
                        setDatePickerOpen(true);
                    }}
                />
                <BasePopover.Trigger
                    render={(
                        <Button
                            data-testid={testIds.part('Trigger')}
                            className={clsx(styles.IconButton, slotProps?.classes?.Trigger)}
                            aria-label="Open calendar"
                            disabled={disabled}>
                            <CalendarIcon className={clsx(styles.CalendarIcon, slotProps?.classes?.CalendarIcon)} />
                        </Button>
                    )}
                    nativeButton
                />
            </div>

            <BasePopover.Portal>
                <BasePopover.Positioner
                    sideOffset={8}
                    className={clsx(styles.Positioner, slotProps?.classes?.Positioner)}>
                    <div
                        data-testid={testIds.part('PopupStack')}
                        className={clsx(styles.PopupStack, slotProps?.classes?.PopupStack)}>
                        <BasePopover.Popup
                            data-testid={testIds.part('Popup')}
                            className={clsx(styles.Popup, slotProps?.classes?.Popup)}>
                            {renderCalendar()}
                        </BasePopover.Popup>
                        {popupFooter}
                    </div>
                </BasePopover.Positioner>
            </BasePopover.Portal>
        </BasePopover.Root>
    )
}
