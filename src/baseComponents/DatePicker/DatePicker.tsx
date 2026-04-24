import { Popover as BasePopover } from '@base-ui/react'
import { endOfMonth, format, isAfter, isValid, parse, startOfDay } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { useEffect, useId, useMemo, useState, type ChangeEvent, type ReactNode } from 'react'
import { createTestIdBuilder } from '../../utils/testIds'
import Calendar from '../Calendar/Calendar'
import Input from '../Input/Input'
import styles from './DatePicker.module.scss'

export type DatePickerChangeDetails = {
    source: 'calendar' | 'input';
}

const DATE_FORMAT = 'dd.MM.yyyy';

interface DatePickerProps {
    value: Date;
    onValueChange: (date: Date, details: DatePickerChangeDetails) => void;
    displayValue?: Date;
    maxDate?: Date;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    closeOnSelect?: boolean;
    popupFooter?: ReactNode;
    dateFormat?: string;
    name?: string;
    testId?: string;
}

export const DatePicker = ({
    value,
    onValueChange,
    displayValue,
    maxDate,
    open,
    onOpenChange,
    closeOnSelect = true,
    popupFooter,
    dateFormat = DATE_FORMAT,
    name,
    testId,
}: DatePickerProps) => {
    const inputId = useId();
    const testIds = createTestIdBuilder('DatePicker', { name, testId });
    const selectedDate = displayValue ?? value;
    const normalizedMaxDate = useMemo(
        () => (maxDate ? startOfDay(maxDate) : undefined),
        [maxDate]
    );
    const endMonth = useMemo(
        () => (normalizedMaxDate ? endOfMonth(normalizedMaxDate) : undefined),
        [normalizedMaxDate]
    );
    const [month, setMonth] = useState(selectedDate);
    const [internalOpen, setInternalOpen] = useState(false);
    const [inputValue, setInputValue] = useState(
        isValid(selectedDate) ? format(selectedDate, dateFormat) : ''
    );
    const isDateOpened = open ?? internalOpen;

    useEffect(() => {
        if (!isValid(selectedDate)) {
            setInputValue('');
            return;
        }

        setMonth(selectedDate);
        setInputValue(format(selectedDate, dateFormat));
    }, [selectedDate, dateFormat]);

    useEffect(() => {
        if (!isDateOpened && isValid(selectedDate)) {
            setInputValue(format(selectedDate, dateFormat));
        }
    }, [isDateOpened, selectedDate, dateFormat]);

    const setDatePickerOpen = (nextOpen: boolean) => {
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

    const handleDayPickerSelect = (date: Date | undefined) => {
        if (!date) {
            return;
        }

        const normalizedDate = startOfDay(date);

        if (normalizedMaxDate && isAfter(normalizedDate, normalizedMaxDate)) {
            return;
        }

        onValueChange(clampDate(normalizedDate), { source: 'calendar' });

        if (closeOnSelect) {
            setDatePickerOpen(false);
        }
    };

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const nextValue = event.target.value;
        setInputValue(nextValue);

        if (!nextValue.trim()) {
            return;
        }

        const parsedDate = parse(nextValue, dateFormat, new Date());

        if (isValid(parsedDate) && format(parsedDate, dateFormat) === nextValue) {
            onValueChange(clampDate(parsedDate), { source: 'input' });
        }
    };

    return (
        <BasePopover.Root open={isDateOpened} onOpenChange={setDatePickerOpen}>
            <div data-testid={testIds.self()} className={styles.InputWrapper}>
                <Input
                    id={inputId}
                    name={name}
                    testId={testIds.part('Input')}
                    value={inputValue}
                    onChange={handleInputChange}
                    type='text'
                    placeholder={dateFormat}
                    className={styles.Date}
                    onClick={() => {
                        setDatePickerOpen(true);
                    }}
                />
                <BasePopover.Trigger
                    render={(
                        <button type="button" data-testid={testIds.part('Trigger')} className={styles.IconButton} aria-label="Open calendar">
                            <CalendarIcon className={styles.CalendarIcon} />
                        </button>
                    )}
                    nativeButton
                />
            </div>

            <BasePopover.Portal>
                <BasePopover.Positioner sideOffset={8} className={styles.Positioner}>
                    <div data-testid={testIds.part('PopupStack')} className={styles.PopupStack}>
                        <BasePopover.Popup data-testid={testIds.part('Popup')} className={styles.Popup}>
                            <Calendar
                                testId={testIds.part('Calendar')}
                                month={month}
                                endMonth={endMonth}
                                onMonthChange={setMonth}
                                mode='single'
                                selected={isValid(selectedDate) ? selectedDate : undefined}
                                disabled={normalizedMaxDate ? { after: normalizedMaxDate } : undefined}
                                onSelect={handleDayPickerSelect}
                            />
                        </BasePopover.Popup>
                        {popupFooter}
                    </div>
                </BasePopover.Positioner>
            </BasePopover.Portal>
        </BasePopover.Root>
    )
}
