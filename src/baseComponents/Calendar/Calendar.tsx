import clsx from 'clsx'
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from 'lucide-react'
import type { ChangeEvent } from 'react'
import {
  DayPicker,
  type ClassNames,
  type DayPickerProps,
  type DropdownProps,
} from 'react-day-picker'
import { he } from 'react-day-picker/locale'
import styles from './Calendar.module.scss'
import Select from '../Select/Select'
import { createTestIdBuilder } from '../../utils/testIds'

const classNames: ClassNames = {
  // UI
  root: styles.Root,
  chevron: styles.Chevron,
  day: styles.Day,
  day_button: styles.DayButton,
  caption_label: styles.CaptionLabel,
  dropdowns: styles.Dropdowns,
  dropdown: styles.Dropdown,
  dropdown_root: styles.DropdownRoot,
  footer: styles.Footer,
  month_grid: styles.MonthGrid,
  month_caption: styles.MonthCaption,
  months_dropdown: styles.MonthsDropdown,
  month: styles.Month,
  months: styles.Months,
  nav: styles.Nav,
  button_next: styles.ButtonNext,
  button_previous: styles.ButtonPrevious,
  week: styles.Week,
  weeks: styles.Weeks,
  weekday: styles.Weekday,
  weekdays: styles.Weekdays,
  week_number: styles.WeekNumber,
  week_number_header: styles.WeekNumberHeader,
  years_dropdown: styles.YearsDropdown,

  // SelectionState
  range_end: styles.RangeEnd,
  range_middle: styles.RangeMiddle,
  range_start: styles.RangeStart,
  selected: styles.Selected,

  // DayFlag
  disabled: styles.Disabled,
  hidden: styles.Hidden,
  outside: styles.Outside,
  focused: styles.Focused,
  today: styles.Today,

  // Animation
  weeks_before_enter: styles.WeeksBeforeEnter,
  weeks_before_exit: styles.WeeksBeforeExit,
  weeks_after_enter: styles.WeeksAfterEnter,
  weeks_after_exit: styles.WeeksAfterExit,
  caption_after_enter: styles.CaptionAfterEnter,
  caption_after_exit: styles.CaptionAfterExit,
  caption_before_enter: styles.CaptionBeforeEnter,
  caption_before_exit: styles.CaptionBeforeExit,
}

export type CalendarSlotProps = {
  classes?: {
    Root?: string;
    Chevron?: string;
    CaptionLabel?: string;
    Dropdowns?: string;
    Dropdown?: string;
    DropdownRoot?: string;
    DropdownTrigger?: string;
    DropdownValue?: string;
    DropdownIcon?: string;
    DropdownPopup?: string;
    DropdownItem?: string;
    MonthCaption?: string;
    MonthsDropdown?: string;
    Nav?: string;
    ButtonNext?: string;
    ButtonPrevious?: string;
    YearsDropdown?: string;
  };
}

type CalendarProps = DayPickerProps & {
  name?: string;
  testId?: string;
  'data-testid'?: string;
  fluid?: boolean;
  slotProps?: CalendarSlotProps;
}

const createDropdownChangeEvent = (
  value: number
): ChangeEvent<HTMLSelectElement> =>
  ({
    target: { value: String(value) },
    currentTarget: { value: String(value) },
  }) as ChangeEvent<HTMLSelectElement>

function CalendarDropdown({
  'aria-label': ariaLabel,
  className,
  disabled,
  onChange,
  options = [],
  slotProps,
  style,
  value,
}: DropdownProps & { slotProps?: CalendarSlotProps }) {
  const selectedOption =
    options.find((option) => option.value === Number(value)) ?? null

  return (
    <span className={clsx(styles.DropdownRoot, className, slotProps?.classes?.DropdownRoot)}>
      <Select
        items={options}
        value={selectedOption}
        disabled={disabled}
        modal={false}
        itemDisabled={(item) => item.disabled}
        isItemEqualToValue={(item, selected) => item.value === selected.value}
        onValueChange={(nextValue) => {
          if (!nextValue) {
            return
          }

          onChange?.(createDropdownChangeEvent(nextValue.value))
        }}
        slotProps={{
          classes: {
            Trigger: clsx(styles.DropdownTrigger, slotProps?.classes?.DropdownTrigger),
            Value: clsx(styles.DropdownValue, slotProps?.classes?.DropdownValue),
            Icon: clsx(styles.DropdownIcon, slotProps?.classes?.DropdownIcon),
            TriggerIcon: clsx(styles.Chevron, slotProps?.classes?.Chevron),
            Popup: clsx(styles.DropdownPopup, slotProps?.classes?.DropdownPopup),
            Item: clsx(styles.DropdownItem, slotProps?.classes?.DropdownItem),
          },
          triggerProps: {
            'aria-label': ariaLabel,
            style,
          },
          popupProps: {
            dir: 'rtl',
          },
        }}
      />
    </span>
  )
}

function Calendar({ name, testId, 'data-testid': dataTestId, fluid, slotProps, ...props }: CalendarProps) {
  const testIds = createTestIdBuilder('Calendar', { name, testId })

  return (
    <DayPicker
      animate
      showOutsideDays
      navLayout='around'
      captionLayout='dropdown'
      locale={he}
      dir='rtl'
      data-testid={dataTestId ?? testIds.self()}
      {...props}
      classNames={{
        ...classNames,
        ...props.classNames,
        root: clsx(classNames.root, fluid && styles.Fluid, props.classNames?.root, slotProps?.classes?.Root),
        chevron: clsx(classNames.chevron, props.classNames?.chevron, slotProps?.classes?.Chevron),
        caption_label: clsx(classNames.caption_label, props.classNames?.caption_label, slotProps?.classes?.CaptionLabel),
        dropdowns: clsx(classNames.dropdowns, props.classNames?.dropdowns, slotProps?.classes?.Dropdowns),
        dropdown: clsx(classNames.dropdown, props.classNames?.dropdown, slotProps?.classes?.Dropdown),
        dropdown_root: clsx(classNames.dropdown_root, props.classNames?.dropdown_root, slotProps?.classes?.DropdownRoot),
        month_caption: clsx(classNames.month_caption, props.classNames?.month_caption, slotProps?.classes?.MonthCaption),
        months_dropdown: clsx(classNames.months_dropdown, props.classNames?.months_dropdown, slotProps?.classes?.MonthsDropdown),
        nav: clsx(classNames.nav, props.classNames?.nav, slotProps?.classes?.Nav),
        button_next: clsx(classNames.button_next, props.classNames?.button_next, slotProps?.classes?.ButtonNext),
        button_previous: clsx(classNames.button_previous, props.classNames?.button_previous, slotProps?.classes?.ButtonPrevious),
        years_dropdown: clsx(classNames.years_dropdown, props.classNames?.years_dropdown, slotProps?.classes?.YearsDropdown),
      }}
      components={{
        Dropdown: (dropdownProps) => (
          <CalendarDropdown {...dropdownProps} slotProps={slotProps} />
        ),
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === 'left') {
            return (
              <ChevronLeftIcon size='1rem' className={clsx(className, slotProps?.classes?.Chevron)} {...props} />
            )
          }

          if (orientation === 'right') {
            return (
              <ChevronRightIcon size='1rem' className={clsx(className, slotProps?.classes?.Chevron)} {...props} />
            )
          }

          return (
            <ChevronDownIcon size='1rem' className={clsx(className, slotProps?.classes?.Chevron)} {...props} />
          )
        },
        ...props.components,
      }}
    />
  )
}

export default Calendar
