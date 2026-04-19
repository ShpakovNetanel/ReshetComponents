import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from 'lucide-react'
import {
  DayPicker,
  type ClassNames,
  type DayPickerProps,
} from 'react-day-picker'
import { he } from 'react-day-picker/locale'
import styles from './Calendar.module.scss'

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

type CalendarProps = DayPickerProps & {
  'data-testid'?: string;
}

function Calendar({ ...props }: CalendarProps) {
  return (
    <DayPicker
      animate
      showOutsideDays
      navLayout='around'
      captionLayout='dropdown'
      locale={he}
      dir='rtl'
      {...props}
      classNames={classNames}
      components={{
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === 'left') {
            return (
              <ChevronLeftIcon size='1rem' className={className} {...props} />
            )
          }

          if (orientation === 'right') {
            return (
              <ChevronRightIcon size='1rem' className={className} {...props} />
            )
          }

          return (
            <ChevronDownIcon size='1rem' className={className} {...props} />
          )
        },
        ...props.components,
      }}
    />
  )
}

export default Calendar
