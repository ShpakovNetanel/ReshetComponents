import { DirectionProvider } from '@base-ui/react';
import type { ColumnDef } from '@tanstack/react-table';
import {
  Bell,
  List,
  Plus,
  Save,
  Settings,
  Star
} from 'lucide-react';
import { useMemo, useState, type ReactNode } from 'react';
import type { DateRange } from 'react-day-picker';
import { createRoot } from 'react-dom/client';
import {
  Accordion,
  Button,
  Calendar,
  Chip,
  CloseButton,
  Combobox,
  DarkModeProvider,
  DataTable,
  DatePicker,
  Dialog,
  Drawer,
  Input,
  Menu,
  NumberField,
  Radio,
  RadioGroup,
  Select,
  SpeedDial,
  SpeedDialMenu,
  Step,
  StepConnector,
  StepIndicator,
  StepLabel,
  Stepper,
  Tabs,
  Toggle,
  Tooltip,
  Typography,
  type ComboboxValueLabelPair,
  type DatePickerMode,
  type RadioGroupOption,
  type ReshetThemeMode,
  type SelectValueLabelPair
} from '../src';
import '../src/theme.css';
import './styles.css';

type PropDoc = {
  name: string;
  type: string;
  description: string;
};

type UsageExample = {
  title: string;
  code: string;
};

type ComponentDoc = {
  id: string;
  title: string;
  summary: string;
  layer: string;
  props: PropDoc[];
  usage: UsageExample[];
  notes: string[];
  preview: ReactNode;
};

type ComponentPanelProps = {
  doc: ComponentDoc;
};

const formatDate = (date: Date | undefined) =>
  date ? date.toLocaleDateString('he-IL') : 'empty';

const cityOptions: SelectValueLabelPair[] = [
  { value: 'jerusalem', label: 'Jerusalem' },
  { value: 'tel-aviv', label: 'Tel Aviv' },
  { value: 'haifa', label: 'Haifa' },
  { value: 'beer-sheva', label: 'Beer Sheva', disabled: true },
];

const comboboxOptions: ComboboxValueLabelPair[] = [
  { value: 'alpha', label: 'Alpha' },
  { value: 'bravo', label: 'Bravo' },
  { value: 'charlie', label: 'Charlie' },
  { value: 'delta', label: 'Delta' },
  { value: 'echo', label: 'Echo' },
];

type InvoiceRow = {
  id: string;
  status: 'Paid' | 'Pending' | 'Failed';
  customer: string;
  owner: string;
  amount: number;
};

const invoiceRows: InvoiceRow[] = [
  { id: 'INV-1042', status: 'Paid', customer: 'Northwind', owner: 'Dana', amount: 1840 },
  { id: 'INV-1043', status: 'Pending', customer: 'Blue River', owner: 'Ari', amount: 920 },
  { id: 'INV-1044', status: 'Failed', customer: 'Cedar Labs', owner: 'Mika', amount: 1260 },
  { id: 'INV-1045', status: 'Paid', customer: 'Atlas Co', owner: 'Noam', amount: 2480 },
];

const invoiceColumns: ColumnDef<InvoiceRow, unknown>[] = [
  {
    accessorKey: 'id',
    header: 'Invoice',
    size: 110,
    cell: ({ getValue }) => <strong>{getValue<string>()}</strong>,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    size: 120,
    cell: ({ getValue }) => {
      const status = getValue<InvoiceRow['status']>();
      const colorByStatus = {
        Paid: '#16a34a',
        Pending: '#2563eb',
        Failed: '#dc2626',
      };

      return <Chip label={status} slotProps={{ backgroundColor: colorByStatus[status] }} />;
    },
  },
  {
    accessorKey: 'customer',
    header: 'Customer',
    size: 150,
  },
  {
    accessorKey: 'owner',
    header: 'Owner',
    size: 110,
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    size: 110,
    cell: ({ getValue }) =>
      getValue<number>().toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
      }),
  },
];

const radioOptions: RadioGroupOption<string>[] = [
  {
    value: 'email',
    label: 'Email',
    description: 'Send a message to the account owner.',
  },
  {
    value: 'sms',
    label: 'SMS',
    description: 'Use only for urgent notifications.',
  },
  {
    value: 'none',
    label: 'No notification',
    description: 'Save the record without sending an update.',
  },
];

const tabOptions = [
  { value: 0, label: 'Overview', color: '#2563eb' },
  { value: 1, label: 'Details', color: '#16a34a' },
  { value: 2, label: 'Activity', color: '#c2410c' },
];

const stepLabels = ['Account', 'Profile', 'Review'];
const tooltipDirections = ['top', 'right', 'bottom', 'left'] as const;

type CalendarPreviewMode = 'single' | 'multiple' | 'range';
type ComboboxPreviewMode = 'single' | 'multiple';
type DataTablePreviewMode = 'basic' | 'filters' | 'details' | 'dense';
type DrawerPreviewDirection = 'left' | 'right' | 'top' | 'bottom';
type MenuPreviewMode = 'grouped' | 'flat';
type RadioPreviewOrientation = 'vertical' | 'horizontal';
type SelectPreviewMode = 'single' | 'multiple';
type SpeedDialMenuPreviewMode = 'separators' | 'compact';
type StepperPreviewOrientation = 'horizontal' | 'vertical';
type TogglePreviewValue = 'compact' | 'favorite';
type TooltipPreviewStyle = 'boxShadow' | 'outline';

type PreviewOption<TValue extends string> = {
  label: string;
  value: TValue;
};

const cssLayerUsage = `import { Button } from 'reshet-components';
import 'reshet-components/styles.css';
import './app.css';

/* app.css */
@layer app {
  .primaryAction {
    background: #14532d;
  }
}`;

const tokenOverrideUsage = `@import 'reshet-components/styles.css';

@layer base {
  [data-theme='dark'] {
    --color-blue: #14532d;
    --color-surface: #0f172a;
  }
}`;

const darkModeUsage = `import { ThemeProvider } from 'reshet-components';

const [theme, setTheme] = useState<'light' | 'dark'>('light');

<ThemeProvider
  theme={theme}
  onThemeChange={setTheme}
  syncDocumentTheme>
  <AppComponents />
</ThemeProvider>`;

const renderStepperSteps = () =>
  stepLabels.map((label, index) => (
    <Step key={label} index={index} name={`docs-step-${label.toLowerCase()}`}>
      <StepIndicator name={`docs-step-indicator-${label.toLowerCase()}`} />
      <StepLabel name={`docs-step-label-${label.toLowerCase()}`}>{label}</StepLabel>
      {index < stepLabels.length - 1 && (
        <StepConnector name={`docs-step-connector-${label.toLowerCase()}`} />
      )}
    </Step>
  ));

const PreviewModeControl = <TValue extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: PreviewOption<TValue>[];
  value: TValue;
  onChange: (value: TValue) => void;
}) => (
  <div className="PreviewModeControl" aria-label={label}>
    <span>{label}</span>
    <div className="SegmentedControl" role="group">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={option.value === value}
          onClick={() => onChange(option.value)}>
          {option.label}
        </button>
      ))}
    </div>
  </div>
);

const PropTable = ({ props }: { props: PropDoc[] }) => (
  <div className="PropTable" role="table" aria-label="Props">
    <div className="PropRow PropHead" role="row">
      <span role="columnheader">Prop</span>
      <span role="columnheader">Type</span>
      <span role="columnheader">How to use it</span>
    </div>
    {props.map((prop) => (
      <div className="PropRow" role="row" key={prop.name}>
        <code role="cell">{prop.name}</code>
        <code role="cell">{prop.type}</code>
        <span role="cell">{prop.description}</span>
      </div>
    ))}
  </div>
);

const CssLayerGuide = ({ layer }: { layer: string }) => (
  <section className="GuidePanel" aria-labelledby="css-layer-title">
    <div>
      <p className="Eyebrow">Styling</p>
      <h3 id="css-layer-title">CSS layers</h3>
      <p>
        This component ships its default styles inside <code>{layer}</code>. Import
        the package stylesheet once, then put app overrides in a later layer such as
        <code>@layer app</code>. Theme token changes belong in <code>@layer base</code>
        after the Reshet stylesheet.
      </p>
    </div>
    <div className="SnippetGrid">
      <div>
        <h4>Component override</h4>
        <pre>
          <code>{cssLayerUsage}</code>
        </pre>
      </div>
      <div>
        <h4>Theme tokens</h4>
        <pre>
          <code>{tokenOverrideUsage}</code>
        </pre>
      </div>
    </div>
  </section>
);

const ComponentPanel = ({ doc }: ComponentPanelProps) => (
  <section
    className="ComponentPanel"
    id={`panel-${doc.id}`}
    role="tabpanel"
    aria-labelledby={`tab-${doc.id}`}>
    <header className="ComponentHeader">
      <div>
        <p className="Eyebrow">Component</p>
        <h2>{doc.title}</h2>
        <p>{doc.summary}</p>
      </div>
      <span className="LayerBadge">{doc.layer}</span>
    </header>

    <div className="PanelGrid">
      <section className="PreviewPanel" aria-label={`${doc.title} preview`}>
        {doc.preview}
      </section>
      <section className="UsagePanel" aria-label={`${doc.title} usage`}>
        <h3>Usage Examples</h3>
        <div className="ExampleStack">
          {doc.usage.map((example) => (
            <article key={example.title}>
              <h4>{example.title}</h4>
              <pre>
                <code>{example.code}</code>
              </pre>
            </article>
          ))}
        </div>
      </section>
    </div>

    <section className="PropsPanel" aria-labelledby={`${doc.id}-props-title`}>
      <p className="Eyebrow">API</p>
      <h3 id={`${doc.id}-props-title`}>Props</h3>
      <PropTable props={doc.props} />
    </section>

    <section className="NotesPanel" aria-labelledby={`${doc.id}-notes-title`}>
      <p className="Eyebrow">AI Usage Notes</p>
      <h3 id={`${doc.id}-notes-title`}>How to choose and wire it</h3>
      <ul>
        {doc.notes.map((note) => (
          <li key={note}>{note}</li>
        ))}
      </ul>
    </section>

    <CssLayerGuide layer={doc.layer} />
  </section>
);

function Documentation() {
  const [activeComponent, setActiveComponent] = useState('accordion');
  const [docsTheme, setDocsTheme] = useState<ReshetThemeMode>('light');
  const [inputValue, setInputValue] = useState('Editable text');
  const [count, setCount] = useState(3);
  const [city, setCity] = useState<SelectValueLabelPair | null>(cityOptions[0]);
  const [comboSingle, setComboSingle] = useState<ComboboxValueLabelPair | null>(
    comboboxOptions[0],
  );
  const [comboMulti, setComboMulti] = useState<ComboboxValueLabelPair[]>([
    comboboxOptions[1],
    comboboxOptions[2],
  ]);
  const [comboboxMode, setComboboxMode] = useState<ComboboxPreviewMode>('single');
  const [singleDate, setSingleDate] = useState(new Date());
  const [multipleDates, setMultipleDates] = useState<Date[]>([new Date()]);
  const [rangeDate, setRangeDate] = useState<DateRange>({
    from: new Date(),
    to: undefined,
  });
  const [datePickerMode, setDatePickerMode] = useState<DatePickerMode>('single');
  const [calendarDate, setCalendarDate] = useState<Date | undefined>(new Date());
  const [calendarDates, setCalendarDates] = useState<Date[] | undefined>([new Date()]);
  const [calendarRange, setCalendarRange] = useState<DateRange | undefined>({ from: new Date(), to: undefined });
  const [calendarMode, setCalendarMode] = useState<CalendarPreviewMode>('single');
  const [dataTableMode, setDataTableMode] = useState<DataTablePreviewMode>('basic');
  const [activeTab, setActiveTab] = useState(tabOptions[0].value);
  const [drawerDirection, setDrawerDirection] = useState<DrawerPreviewDirection>('right');
  const [menuMode, setMenuMode] = useState<MenuPreviewMode>('grouped');
  const [radioValue, setRadioValue] = useState(radioOptions[0].value);
  const [radioOrientation, setRadioOrientation] = useState<RadioPreviewOrientation>('vertical');
  const [selectMode, setSelectMode] = useState<SelectPreviewMode>('single');
  const [cities, setCities] = useState<SelectValueLabelPair[]>([cityOptions[0], cityOptions[2]]);
  const [speedDialMenuMode, setSpeedDialMenuMode] = useState<SpeedDialMenuPreviewMode>('separators');
  const [stepperOrientation, setStepperOrientation] = useState<StepperPreviewOrientation>('horizontal');
  const [activeToggles, setActiveToggles] = useState<Record<TogglePreviewValue, boolean>>({
    compact: true,
    favorite: false,
  });
  const [tooltipSide, setTooltipSide] = useState<(typeof tooltipDirections)[number]>('top');
  const [tooltipStyle, setTooltipStyle] = useState<TooltipPreviewStyle>('boxShadow');

  const componentDocs = useMemo<ComponentDoc[]>(
    () => [
      {
        id: 'darkmodeprovider',
        title: 'ThemeProvider',
        summary: 'A scoped theme provider that switches all Reshet components inside it between light, dark, or system mode. It is exported as ThemeProvider and DarkModeProvider.',
        layer: '@layer base',
        props: [
          { name: 'theme', type: "'light' | 'dark' | 'system'", description: 'Controlled theme mode. Use this to sync with an outside app dark-mode state.' },
          { name: 'defaultTheme', type: "'light' | 'dark' | 'system'", description: 'Initial mode for uncontrolled usage. Defaults to light.' },
          { name: 'onThemeChange', type: '(theme) => void', description: 'Called when setTheme is used from the provider context.' },
          { name: 'syncDocumentTheme', type: 'boolean', description: 'Mirrors data-theme to documentElement so portaled popups inherit the same theme. Defaults to true and should usually stay enabled.' },
          { name: 'children', type: 'ReactNode', description: 'Every component inside receives the selected CSS token set through data-theme.' },
          { name: 'className / style', type: 'HTML div props', description: 'Forwarded to the provider wrapper element.' },
          { name: 'useReshetTheme', type: 'hook', description: 'Read theme, resolvedTheme, isDark, and setTheme inside the provider.' },
        ],
        usage: [
          { title: 'Controlled app theme', code: darkModeUsage },
          { title: 'Uncontrolled system theme', code: `<ThemeProvider defaultTheme="system">
  <App />
</ThemeProvider>` },
          { title: 'Portaled components', code: `<ThemeProvider syncDocumentTheme>
  <Select items={items} value={value} onValueChange={setValue} />
  <Dialog trigger={<Button>Open</Button>}>Content</Dialog>
</ThemeProvider>` },
        ],
        notes: [
          'Prefer ThemeProvider over DarkModeProvider in application code; they are the same export, but ThemeProvider explains intent better.',
          'Keep syncDocumentTheme enabled when using Select, Combobox, DatePicker, Menu, Dialog, Drawer, Tooltip, or Toast because their popups render in portals.',
          'Use controlled theme when the host app already stores the theme; use defaultTheme when Reshet can own the initial choice.',
        ],
        preview: (
          <div className="PreviewStack">
            <div className="Inline">
              <Button
                type="button"
                onClick={() => setDocsTheme((theme) => theme === 'dark' ? 'light' : 'dark')}>
                Switch docs theme
              </Button>
              <Chip
                label={`Current: ${docsTheme}`}
                slotProps={{ backgroundColor: docsTheme === 'dark' ? '#33415a' : '#e6f4ff' }}
              />
            </div>
            <Input
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
            />
            <Select
              name="docs-theme-city"
              items={cityOptions}
              value={city}
              placeholder="Choose city"
              onValueChange={setCity}
            />
          </div>
        ),
      },
      {
        id: 'accordion',
        title: 'Accordion',
        summary: 'A controlled single-section disclosure for grouped content.',
        layer: '@layer base',
        props: [
          { name: 'title', type: 'ReactNode', description: 'Rendered inside the accordion trigger.' },
          { name: 'actions', type: 'ReactNode', description: 'Optional controls rendered on the header row beside the trigger.' },
          { name: 'defaultOpen', type: 'boolean', description: 'Initial open state. Defaults to true.' },
          { name: 'onOpenChange', type: '(open: boolean) => void', description: 'Called whenever the panel opens or closes.' },
          { name: 'slotProps', type: '{ classes?, headerProps? }', description: 'Pass class names or header data attributes for styling and tests.' },
          { name: 'name / testId', type: 'string', description: 'Customize generated test IDs.' },
        ],
        usage: [
          { title: 'Closed by default', code: `<Accordion
  title="Advanced settings"
  defaultOpen={false}>
  <p>Panel content</p>
</Accordion>` },
          { title: 'Header actions', code: `<Accordion
  title={<strong>Filters</strong>}
  actions={<Button type="button">Reset</Button>}>
  <FilterControls />
</Accordion>` },
          { title: 'Open-state callback', code: `<Accordion
  title="Audit details"
  onOpenChange={(open) => analytics.track('accordion', { open })}>
  <AuditTrail />
</Accordion>` },
        ],
        notes: [
          'Use Accordion for one collapsible content group, not for a multi-item FAQ list; this wrapper renders a single Base UI item.',
          'Put secondary controls in actions so the trigger remains focused on opening and closing the panel.',
          'Pass headerProps when tests or analytics need attributes on the whole header row rather than only the trigger.',
        ],
        preview: (
          <Accordion
            name="docs-accordion"
            title={<strong>Advanced settings</strong>}
            actions={<Chip label="Optional" slotProps={{ backgroundColor: '#e6f4ff' }} />}
            defaultOpen={false}>
            <p className="PreviewText">Use the panel for grouped content that can be hidden until needed.</p>
          </Accordion>
        ),
      },
      {
        id: 'button',
        title: 'Button',
        summary: 'A styled Base UI button that forwards standard button props.',
        layer: '@layer base',
        props: [
          { name: 'children', type: 'ReactNode', description: 'The button label or icon content.' },
          { name: 'onClick', type: 'MouseEventHandler', description: 'Runs when the button is activated.' },
          { name: 'disabled', type: 'boolean', description: 'Disables pointer and keyboard activation.' },
          { name: 'type', type: "'button' | 'submit' | 'reset'", description: 'Use button for non-form actions and submit inside forms.' },
          { name: 'className', type: 'string', description: 'Adds an app class next to the default module class.' },
          { name: 'name / testId', type: 'string', description: 'Customize generated test IDs.' },
        ],
        usage: [
          { title: 'Basic action', code: `<Button type="button" onClick={handleSave}>
  Save
</Button>` },
          { title: 'Icon button content', code: `<Button type="button" aria-label="Save changes">
  <Save size={18} />
</Button>` },
          { title: 'Disabled state', code: `<Button type="button" disabled>
  Saving
</Button>` },
        ],
        notes: [
          'Use type="button" for non-form actions so clicks do not accidentally submit a parent form.',
          'All Base UI button props are forwarded, so aria attributes, disabled, className, and event handlers work normally.',
          'Use children for the visible label or icon; use aria-label when the button only contains an icon.',
        ],
        preview: (
          <div className="Inline">
            <Button onClick={() => setCount((value) => value + 1)}>Add one</Button>
            <Button disabled>Disabled</Button>
          </div>
        ),
      },
      {
        id: 'calendar',
        title: 'Calendar',
        summary: 'A Hebrew, RTL DayPicker wrapper with styled month and year dropdowns.',
        layer: '@layer base',
        props: [
          { name: 'mode', type: "'single' | 'multiple' | 'range'", description: 'Selection mode inherited from react-day-picker.' },
          { name: 'selected', type: 'Date | Date[] | DateRange', description: 'The selected value for the chosen mode.' },
          { name: 'onSelect', type: 'DayPicker handler', description: 'Receives the next calendar selection.' },
          { name: 'disabled', type: 'DayPicker disabled matcher', description: 'Disables specific dates or ranges.' },
          { name: 'components', type: 'DayPicker components', description: 'Override internal DayPicker pieces.' },
          { name: 'name / testId', type: 'string', description: 'Customize generated test IDs.' },
        ],
        usage: [
          { title: 'Single date', code: `<Calendar
  mode="single"
  selected={date}
  onSelect={setDate}
/>` },
          { title: 'Range selection', code: `<Calendar
  mode="range"
  selected={range}
  onSelect={setRange}
  disabled={{ after: new Date() }}
/>` },
          { title: 'Custom classes', code: `<Calendar
  mode="single"
  selected={date}
  onSelect={setDate}
  slotProps={{ classes: { Root: styles.CalendarRoot } }}
/>` },
        ],
        notes: [
          'Calendar is the low-level date surface. Use DatePicker when you also need an input and popover.',
          'The wrapper defaults to Hebrew locale, RTL direction, outside days, animated navigation, and month/year dropdowns.',
          'Most react-day-picker props pass through, including mode, selected, onSelect, disabled, month, and onMonthChange.',
        ],
        preview: (
          <div className="PreviewStack">
            <PreviewModeControl
              label="Mode"
              value={calendarMode}
              onChange={setCalendarMode}
              options={[
                { label: 'Single', value: 'single' },
                { label: 'Multiple', value: 'multiple' },
                { label: 'Range', value: 'range' },
              ]}
            />
            {calendarMode === 'single' && (
              <Calendar
                name="docs-calendar-single"
                mode="single"
                selected={calendarDate}
                onSelect={setCalendarDate}
              />
            )}
            {calendarMode === 'multiple' && (
              <Calendar
                name="docs-calendar-multiple"
                mode="multiple"
                selected={calendarDates}
                onSelect={setCalendarDates}
              />
            )}
            {calendarMode === 'range' && (
              <Calendar
                name="docs-calendar-range"
                mode="range"
                selected={calendarRange}
                onSelect={setCalendarRange}
              />
            )}
          </div>
        ),
      },
      {
        id: 'chip',
        title: 'Chip',
        summary: 'A compact metadata label with automatic readable foreground color.',
        layer: '@layer base',
        props: [
          { name: 'label', type: 'ReactNode', description: 'The visible chip content.' },
          { name: 'onChipClick', type: 'MouseEventHandler', description: 'Optional click behavior for interactive chips.' },
          { name: 'slotProps.backgroundColor', type: 'string', description: 'Sets the chip background and derives readable text color.' },
          { name: 'slotProps.classes.Label', type: 'string', description: 'Adds a class to the root label element.' },
          { name: 'name / testId', type: 'string', description: 'Customize generated test IDs.' },
        ],
        usage: [
          { title: 'Status label', code: `<Chip
  label="Active"
  slotProps={{ backgroundColor: '#16a34a' }}
/>` },
          { title: 'Clickable chip', code: `<Chip
  label="Clear filter"
  onChipClick={() => clearFilter('status')}
  slotProps={{ backgroundColor: '#eef2f7' }}
/>` },
          { title: 'Custom content', code: `<Chip
  label={<><Check size={12} /> Complete</>}
  slotProps={{ backgroundColor: '#2563eb' }}
/>` },
        ],
        notes: [
          'Use Chip for short metadata, status, or selected-filter labels.',
          'backgroundColor accepts hex and rgb values; the component derives a readable foreground color when it can parse the background.',
          'If onChipClick is provided, also make the surrounding UX clear because the rendered element is a div, not a button.',
        ],
        preview: (
          <div className="Inline">
            <Chip label="Active" slotProps={{ backgroundColor: '#16a34a' }} />
            <Chip label={`Count ${count}`} slotProps={{ backgroundColor: '#2563eb' }} />
            <Chip label="Neutral" slotProps={{ backgroundColor: '#eef2f7' }} />
          </div>
        ),
      },
      {
        id: 'combobox',
        title: 'Combobox',
        summary: 'A searchable picker with single and multiple value modes.',
        layer: '@layer base',
        props: [
          { name: 'items', type: 'Value[]', description: 'Options to search and select.' },
          { name: 'value', type: 'Value | Value[] | null', description: 'Controlled selected value. Use an array when multiple is true.' },
          { name: 'onValueChange', type: '(value) => void', description: 'Receives the selected option or selected option array.' },
          { name: 'multiple', type: 'boolean', description: 'Enables chip-style multiple selection.' },
          { name: 'placeholder', type: 'string', description: 'Input placeholder when no value is selected.' },
          { name: 'emptyLabel', type: 'string', description: 'Message shown when filtering returns no results.' },
          { name: 'itemComponent', type: '(item) => ReactNode', description: 'Custom option renderer.' },
          { name: 'slotProps', type: '{ classes?, disable? }', description: 'Customize internal slots and hide trigger, separator, or indicators.' },
        ],
        usage: [
          { title: 'Single searchable value', code: `<Combobox
  items={items}
  value={value}
  placeholder="Choose item"
  emptyLabel="No item found"
  onValueChange={setValue}
/>` },
          { title: 'Multiple chips', code: `<Combobox
  multiple
  items={items}
  value={values}
  placeholder="Choose items"
  emptyLabel="No items found"
  onValueChange={setValues}
/>` },
          { title: 'Custom option and selected value', code: `<Combobox
  items={users}
  value={user}
  itemToStringValue={(user) => user.id}
  itemToStringLabel={(user) => user.name}
  itemComponent={(user) => <UserOption user={user} />}
  valueNode={(user) => user ? <UserPill user={user} /> : null}
  placeholder="Assign user"
  emptyLabel="No users found"
  onValueChange={setUser}
/>` },
        ],
        notes: [
          'Use Combobox when users need to type to filter options; use Select when the option list is short enough to scan.',
          'Primitive values, { value, label } pairs, and object values are supported. For object values, prefer itemToStringValue and itemToStringLabel for stable matching and readable filtering.',
          'slotProps.disable can remove the trigger, separators, empty label, or check indicators when embedding the control in denser workflows.',
        ],
        preview: (
          <div className="PreviewStack">
            <PreviewModeControl
              label="Type"
              value={comboboxMode}
              onChange={setComboboxMode}
              options={[
                { label: 'Single', value: 'single' },
                { label: 'Multiple', value: 'multiple' },
              ]}
            />
            {comboboxMode === 'single' ? (
              <>
                <Combobox
                  name="docs-combobox-single"
                  items={comboboxOptions}
                  value={comboSingle}
                  placeholder="Choose item"
                  emptyLabel="No item found"
                  onValueChange={setComboSingle}
                />
                <output>{comboSingle?.label ?? 'No item selected'}</output>
              </>
            ) : (
              <>
                <Combobox
                  name="docs-combobox-multi"
                  items={comboboxOptions}
                  multiple
                  value={comboMulti}
                  placeholder="Choose items"
                  emptyLabel="No items found"
                  onValueChange={setComboMulti}
                />
                <output>{comboMulti.map((item) => item.label).join(', ') || 'No items selected'}</output>
              </>
            )}
          </div>
        ),
      },
      {
        id: 'datatable',
        title: 'DataTable',
        summary: 'A TanStack-powered data grid with sorting, row selection, loading rows, optional filters, detail panels, and virtualization support.',
        layer: '@layer primitives + @layer base',
        props: [
          { name: 'columns', type: 'ColumnDef<TData, TValue>[]', description: 'Column definitions from @tanstack/react-table. Undefined entries are filtered so conditional columns are easy to compose.' },
          { name: 'data', type: 'TData[]', description: 'Rows displayed by the table.' },
          { name: 'enableRowSelectionColumn', type: 'boolean', description: 'Adds a leading checkbox column for selecting all page rows or individual rows.' },
          { name: 'enableGlobalSearch', type: 'boolean', description: 'Renders a table-level search input wired to TanStack global filtering.' },
          { name: 'showColumnFilters', type: 'boolean', description: 'Renders a filter input below columns that can be filtered.' },
          { name: 'renderDetailPanel', type: '({ row, table }) => ReactElement', description: 'Adds an expand column and renders a collapsible detail row for each record.' },
          { name: 'enableVirtualization', type: 'boolean', description: 'Uses @tanstack/react-virtual for larger scrollable row sets.' },
          { name: 'isLoading / loadingRowsCount', type: 'boolean / number', description: 'Shows skeleton rows while data is loading. loadingRowsCount defaults to 5.' },
          { name: 'dense', type: 'boolean', description: 'Removes row gaps and rounded row corners for compact operational tables.' },
          { name: 'name / testId', type: 'string', description: 'Customize generated test IDs for the wrapper, table, and global search input.' },
        ],
        usage: [
          { title: 'Basic sortable table', code: `<DataTable
  columns={columns}
  data={rows}
  getRowId={(row) => row.id}
/>` },
          { title: 'Search and filters', code: `<DataTable
  columns={columns}
  data={rows}
  enableGlobalSearch
  globalSearchPlaceholder="Search invoices"
  showColumnFilters
/>` },
          { title: 'Selection and detail panel', code: `<DataTable
  columns={columns}
  data={rows}
  enableRowSelectionColumn
  renderDetailPanel={({ row }) => <InvoiceDetails invoice={row.original} />}
/>` },
          { title: 'Virtualized dense rows', code: `<DataTable
  columns={columns}
  data={largeRows}
  dense
  enableVirtualization
/>` },
        ],
        notes: [
          'Use TanStack ColumnDef objects for accessors, headers, cell rendering, sorting, and filter behavior.',
          'Pass getRowId when row identity matters for selection, expansion, or later controlled table state.',
          'Use enableVirtualization for long lists inside a constrained-height parent; small tables are simpler without it.',
        ],
        preview: (
          <div className="PreviewStack DataTablePreview">
            <PreviewModeControl
              label="Mode"
              value={dataTableMode}
              onChange={setDataTableMode}
              options={[
                { label: 'Basic', value: 'basic' },
                { label: 'Filters', value: 'filters' },
                { label: 'Details', value: 'details' },
                { label: 'Dense', value: 'dense' },
              ]}
            />
            <DataTable
              name="docs-invoices"
              columns={invoiceColumns}
              data={invoiceRows}
              getRowId={(row) => row.id}
              enableGlobalSearch
              globalSearchPlaceholder="Search invoices"
              enableRowSelectionColumn={dataTableMode !== 'basic'}
              showColumnFilters={dataTableMode === 'filters'}
              dense={dataTableMode === 'dense'}
              renderDetailPanel={
                dataTableMode === 'details'
                  ? ({ row }) => (
                      <div className="DataTableDetail">
                        <strong>{row.original.customer}</strong>
                        <span>
                          Owned by {row.original.owner}. Current status is {row.original.status.toLowerCase()}.
                        </span>
                      </div>
                    )
                  : undefined
              }
            />
          </div>
        ),
      },
      {
        id: 'datepicker',
        title: 'DatePicker',
        summary: 'A popover date input with single, multiple, and range selection modes.',
        layer: '@layer base',
        props: [
          { name: 'mode', type: "'single' | 'multiple' | 'range'", description: 'Controls value shape and calendar selection behavior.' },
          { name: 'value', type: 'Date | Date[] | DateRange', description: 'Controlled selected value.' },
          { name: 'onValueChange', type: '(value, details) => void', description: 'Receives value plus source: calendar or input.' },
          { name: 'maxDate', type: 'Date', description: 'Prevents choosing dates after this day.' },
          { name: 'closeOnSelect', type: 'boolean', description: 'Keep open for multiple or range flows by setting false.' },
          { name: 'dateFormat', type: 'string', description: 'date-fns parse and display format. Defaults to dd.MM.yyyy.' },
          { name: 'popupFooter', type: 'ReactNode', description: 'Optional content below the calendar.' },
        ],
        usage: [
          { title: 'Single date input', code: `<DatePicker
  value={date}
  onValueChange={(nextDate) => setDate(nextDate)}
/>` },
          { title: 'Range picker that stays open', code: `<DatePicker
  mode="range"
  value={range}
  closeOnSelect={false}
  onValueChange={setRange}
/>` },
          { title: 'Multiple dates with max date', code: `<DatePicker
  mode="multiple"
  value={dates}
  maxDate={new Date()}
  closeOnSelect={false}
  onValueChange={(nextDates, details) => {
    setDates(nextDates);
    console.log(details.source);
  }}
/>` },
        ],
        notes: [
          'The value shape follows mode: Date for single, Date[] for multiple, and DateRange for range.',
          'onValueChange includes details.source so consumers can distinguish typed input from calendar clicks.',
          'dateFormat is both the display format and strict parse format. If users type dates, show a format they can reproduce.',
        ],
        preview: (
          <div className="PreviewStack">
            <PreviewModeControl
              label="Mode"
              value={datePickerMode}
              onChange={setDatePickerMode}
              options={[
                { label: 'Single', value: 'single' },
                { label: 'Multiple', value: 'multiple' },
                { label: 'Range', value: 'range' },
              ]}
            />
            {datePickerMode === 'single' && (
              <>
                <DatePicker
                  name="docs-single-date"
                  mode="single"
                  value={singleDate}
                  onValueChange={setSingleDate}
                />
                <output>{formatDate(singleDate)}</output>
              </>
            )}
            {datePickerMode === 'multiple' && (
              <>
                <DatePicker
                  name="docs-multiple-date"
                  mode="multiple"
                  value={multipleDates}
                  closeOnSelect={false}
                  onValueChange={setMultipleDates}
                />
                <output>{multipleDates.map(formatDate).join(', ') || 'empty'}</output>
              </>
            )}
            {datePickerMode === 'range' && (
              <>
                <DatePicker
                  name="docs-range-date"
                  mode="range"
                  value={rangeDate}
                  closeOnSelect={false}
                  onValueChange={setRangeDate}
                />
                <output>
                  {formatDate(rangeDate.from)} - {formatDate(rangeDate.to)}
                </output>
              </>
            )}
          </div>
        ),
      },
      {
        id: 'dialog',
        title: 'Dialog',
        summary: 'A modal dialog with trigger, backdrop, and popup slots.',
        layer: '@layer base',
        props: [
          { name: 'trigger', type: 'ReactNode', description: 'Element rendered inside the dialog trigger.' },
          { name: 'children', type: 'ReactNode', description: 'Popup content.' },
          { name: 'open', type: 'boolean', description: 'Controlled open state from Base UI Dialog.' },
          { name: 'onOpenChange', type: '(open: boolean) => void', description: 'Called when the dialog opens or closes.' },
          { name: 'slotProps.disabled.trigger', type: 'boolean', description: 'Disables the trigger.' },
          { name: 'slotProps.hidden.trigger', type: 'boolean', description: 'Allows rendering a controlled dialog without a visible trigger.' },
        ],
        usage: [
          { title: 'Triggered modal', code: `<Dialog trigger={<Button>Open dialog</Button>}>
  <div>
    <CloseButton />
    <div>Dialog content</div>
  </div>
</Dialog>` },
          { title: 'Controlled modal', code: `<Dialog
  open={open}
  onOpenChange={setOpen}
  slotProps={{ hidden: { trigger: true } }}>
  <ConfirmDelete onClose={() => setOpen(false)} />
</Dialog>` },
          { title: 'Disabled trigger', code: `<Dialog
  trigger={<Button>Open</Button>}
  slotProps={{ disabled: { trigger: isSaving } }}>
  <Form />
</Dialog>` },
        ],
        notes: [
          'Use Dialog for blocking workflows that require a user decision or focused form.',
          'children render directly inside the popup, so include your own title, body, actions, and close behavior.',
          'Use slotProps.hidden.trigger for dialogs opened by external state rather than a local trigger button.',
        ],
        preview: (
          <Dialog
            name="docs-dialog"
            trigger={<Button type="button">Open dialog</Button>}>
            <div className="DialogContent">
              <div className="SurfaceHeader">
                <h3>Confirm action</h3>
                <CloseButton name="docs-dialog" />
              </div>
              <p>Dialog content is supplied as children.</p>
              <Button type="button">Action</Button>
            </div>
          </Dialog>
        ),
      },
      {
        id: 'drawer',
        title: 'Drawer',
        summary: 'A slide-in panel that opens from any side.',
        layer: '@layer base',
        props: [
          { name: 'triggerIcon', type: 'ReactNode', description: 'Custom trigger icon. Defaults to a menu icon.' },
          { name: 'children', type: 'ReactNode', description: 'Drawer panel content.' },
          { name: 'slotProps.direction', type: "'left' | 'right' | 'top' | 'bottom'", description: 'Controls which side the drawer enters from.' },
          { name: 'slotProps.width', type: 'string', description: 'CSS width for left and right drawers.' },
          { name: 'slotProps.height', type: 'string', description: 'CSS height for top and bottom drawers.' },
          { name: 'slotProps.disableBackdrop', type: 'boolean', description: 'Removes the backdrop when true.' },
        ],
        usage: [
          { title: 'Right drawer', code: `<Drawer slotProps={{ direction: 'right', width: '360px' }}>
  <div>
    <CloseButton />
    <div>Drawer content</div>
  </div>
</Drawer>` },
          { title: 'Bottom drawer', code: `<Drawer
  triggerIcon={<Settings />}
  slotProps={{ direction: 'bottom', height: '45vh' }}>
  <SettingsPanel />
</Drawer>` },
          { title: 'Without backdrop', code: `<Drawer slotProps={{ disableBackdrop: true, width: '320px' }}>
  <FilterPanel />
</Drawer>` },
        ],
        notes: [
          'Use Drawer for secondary surfaces such as filters, navigation, or contextual details.',
          'direction controls the entrance side; width matters for left/right drawers, and height matters for top/bottom drawers.',
          'Drawer is built on Base UI Dialog, so open and onOpenChange can be used for controlled state.',
        ],
        preview: (
          <div className="PreviewStack">
            <PreviewModeControl
              label="Direction"
              value={drawerDirection}
              onChange={setDrawerDirection}
              options={[
                { label: 'Left', value: 'left' },
                { label: 'Right', value: 'right' },
                { label: 'Top', value: 'top' },
                { label: 'Bottom', value: 'bottom' },
              ]}
            />
            <Drawer
              name="docs-drawer"
              slotProps={{
                direction: drawerDirection,
                width: drawerDirection === 'left' || drawerDirection === 'right' ? '360px' : undefined,
                height: drawerDirection === 'top' || drawerDirection === 'bottom' ? '34vh' : undefined,
              }}>
              <div className="DrawerContent">
                <div className="SurfaceHeader">
                  <h3>{drawerDirection} drawer</h3>
                  <CloseButton name="docs-drawer" />
                </div>
                <p>Use this panel for navigation, filters, or contextual actions.</p>
                <Button>Drawer action</Button>
              </div>
            </Drawer>
          </div>
        ),
      },
      {
        id: 'input',
        title: 'Input',
        summary: 'A styled Base UI input that forwards native input props.',
        layer: '@layer base',
        props: [
          { name: 'value', type: 'string', description: 'Controlled input value.' },
          { name: 'onChange', type: 'ChangeEventHandler<HTMLInputElement>', description: 'Receives native input change events.' },
          { name: 'placeholder', type: 'string', description: 'Text shown when value is empty.' },
          { name: 'disabled', type: 'boolean', description: 'Disables editing.' },
          { name: 'className', type: 'string', description: 'Adds an app class next to the default module class.' },
          { name: 'name / testId', type: 'string', description: 'Customize generated test IDs.' },
        ],
        usage: [
          { title: 'Controlled input', code: `<Input
  value={value}
  onChange={(event) => setValue(event.target.value)}
/>` },
          { title: 'Named form input', code: `<Input
  name="email"
  type="email"
  placeholder="name@example.com"
  autoComplete="email"
/>` },
          { title: 'Disabled input', code: `<Input
  value="Readonly display"
  disabled
/>` },
        ],
        notes: [
          'Input is a thin styled wrapper around Base UI Input and forwards native input attributes.',
          'Use name for both form submission and predictable generated test IDs.',
          'For labels, pair Input with Typography or another accessible label using htmlFor and id.',
        ],
        preview: (
          <div className="PreviewStack">
            <Input
              id="docs-input"
              name="docs-input"
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
            />
            <output>{inputValue}</output>
          </div>
        ),
      },
      {
        id: 'menu',
        title: 'Menu',
        summary: 'A trigger and popup menu for flat or grouped React node actions.',
        layer: '@layer base',
        props: [
          { name: 'items', type: 'ReactNode[] | MenuGroup[]', description: 'Pass a flat array for simple menus, or grouped objects shaped like { label, items } for labeled sections.' },
          { name: 'items[].label', type: 'ReactNode', description: 'Group heading rendered with Base UI GroupLabel when using grouped items.' },
          { name: 'items[].items', type: 'ReactNode[]', description: 'The actions inside a labeled group.' },
          { name: 'slotProps.trigger', type: 'ReactNode', description: 'Custom trigger content. Defaults to a menu icon.' },
          { name: 'slotProps.classes', type: 'Base UI class map', description: 'Adds classes to trigger, positioner, popup, and items.' },
          { name: 'open', type: 'boolean', description: 'Controlled open state from Base UI Menu.' },
          { name: 'onOpenChange', type: '(open: boolean) => void', description: 'Called when the menu opens or closes.' },
          { name: 'name / testId', type: 'string', description: 'Customize generated test IDs.' },
        ],
        usage: [
          { title: 'Icon trigger menu', code: `<Menu
  items={['Profile', 'Settings', 'Sign out']}
  slotProps={{ trigger: <List /> }}
/>` },
          { title: 'Action items', code: `<Menu
  items={[
    <button type="button" onClick={edit}>Edit</button>,
    <button type="button" onClick={archive}>Archive</button>,
  ]}
/>` },
          { title: 'Grouped menu', code: `<Menu
  items={[
    { label: 'Account', items: ['Profile', 'Security'] },
    { label: 'Danger zone', items: ['Delete account'] },
  ]}
/>` },
          { title: 'Controlled menu', code: `<Menu
  open={open}
  onOpenChange={setOpen}
  items={actions}
/>` },
        ],
        notes: [
          'Menu renders each action inside a Base UI Menu.Item, so pass compact action content rather than large panels.',
          'Use grouped items when actions need labels such as Account, Export, or Danger zone.',
          'Use slotProps.trigger for custom trigger content; the default trigger is a menu icon.',
        ],
        preview: (
          <div className="PreviewStack">
            <PreviewModeControl
              label="Structure"
              value={menuMode}
              onChange={setMenuMode}
              options={[
                { label: 'Grouped', value: 'grouped' },
                { label: 'Flat', value: 'flat' },
              ]}
            />
            <Menu
              name="docs-menu"
              items={menuMode === 'grouped'
                ? [
                    { label: 'Account', items: ['Profile', 'Settings'] },
                    { label: 'Session', items: ['Sign out'] },
                  ]
                : ['Profile', 'Settings', 'Sign out']}
              slotProps={{ trigger: <List size={20} /> }}
            />
          </div>
        ),
      },
      {
        id: 'numberfield',
        title: 'NumberField',
        summary: 'A numeric input with increment, decrement, and scrub label behavior.',
        layer: '@layer custom',
        props: [
          { name: 'value', type: 'number', description: 'Controlled numeric value.' },
          { name: 'onValueChange', type: '(value, details) => void', description: 'Called while the value changes.' },
          { name: 'onValueCommitted', type: '(value, details) => void', description: 'Called when editing is committed.' },
          { name: 'min / max', type: 'number', description: 'Bounds accepted numeric values and controls input maxLength.' },
          { name: 'label', type: 'string', description: 'Visible label and scrub area text.' },
          { name: 'slotProps.classes', type: 'NumberField class map', description: 'Adds classes to root, label, group, input, and controls.' },
        ],
        usage: [
          { title: 'Controlled amount', code: `<NumberField
  label="Amount"
  min={0}
  max={20}
  value={count}
  onValueChange={(value) => setCount(value ?? 0)}
/>` },
          { title: 'Commit-only side effects', code: `<NumberField
  label="Quantity"
  value={quantity}
  onValueChange={(value) => setQuantity(value ?? 0)}
  onValueCommitted={(value) => saveQuantity(value)}
/>` },
          { title: 'Disabled display', code: `<NumberField
  label="Locked"
  value={10}
  disabled
/>` },
        ],
        notes: [
          'Use NumberField when the value should be numeric and users benefit from increment, decrement, keyboard, and scrub interactions.',
          'onValueChange fires during editing; onValueCommitted is better for saving, validation, or network updates.',
          'Always provide min and max when the domain has bounds. The wrapper also uses max to size the input length.',
        ],
        preview: (
          <div className="PreviewStack">
            <NumberField
              name="docs-count"
              label="Amount"
              min={0}
              max={20}
              value={count}
              onValueChange={(nextValue) => setCount(nextValue ?? 0)}
            />
            <output>{count}</output>
          </div>
        ),
      },
      {
        id: 'radio',
        title: 'Radio and RadioGroup',
        summary: 'A Base UI radio wrapper for one-of-many choices, with an item-mapping RadioGroup shortcut and custom child support.',
        layer: '@layer base',
        props: [
          { name: 'Radio.value', type: 'string | number', description: 'Unique value submitted or selected when the radio is active.' },
          { name: 'Radio.label', type: 'ReactNode', description: 'Visible label when children are not provided.' },
          { name: 'Radio.description', type: 'ReactNode', description: 'Optional helper text under the label.' },
          { name: 'Radio.disabled / required / readOnly', type: 'boolean', description: 'Base UI radio state props forwarded to the root.' },
          { name: 'RadioGroup.items', type: 'RadioGroupOption[]', description: 'Optional shortcut that renders Radio children from { value, label, description, disabled } objects.' },
          { name: 'RadioGroup.value / defaultValue', type: 'string | number', description: 'Use value for controlled state or defaultValue for uncontrolled initial selection.' },
          { name: 'RadioGroup.onValueChange', type: '(value, details) => void', description: 'Receives the newly selected option value.' },
          { name: 'RadioGroup.orientation', type: "'vertical' | 'horizontal'", description: 'Controls visual layout. Defaults to vertical.' },
          { name: 'name / testId', type: 'string', description: 'RadioGroup name controls the submitted field; name and testId also customize generated test IDs.' },
        ],
        usage: [
          { title: 'Mapped options', code: `<RadioGroup
  name="notification"
  value={value}
  onValueChange={setValue}
  items={[
    { value: 'email', label: 'Email' },
    { value: 'sms', label: 'SMS' },
  ]}
/>` },
          { title: 'Custom children', code: `<RadioGroup name="plan" defaultValue="team">
  <Radio value="solo" label="Solo" description="For one user" />
  <Radio value="team">
    <strong>Team</strong>
  </Radio>
</RadioGroup>` },
          { title: 'Horizontal layout', code: `<RadioGroup
  name="size"
  orientation="horizontal"
  defaultValue="m"
  items={sizeOptions}
/>` },
        ],
        notes: [
          'Use RadioGroup for mutually exclusive choices. Radio is intended to live inside RadioGroup for normal form behavior.',
          'Use items for straightforward option lists; use Radio children when labels need richer custom markup.',
          'Keep option labels concise and put explanatory copy in description so the selected value stays easy to scan.',
        ],
        preview: (
          <div className="PreviewStack">
            <PreviewModeControl
              label="Layout"
              value={radioOrientation}
              onChange={setRadioOrientation}
              options={[
                { label: 'Vertical', value: 'vertical' },
                { label: 'Horizontal', value: 'horizontal' },
              ]}
            />
            {radioOrientation === 'vertical' ? (
              <RadioGroup
                name="docs-radio"
                value={radioValue}
                onValueChange={setRadioValue}
                items={radioOptions}
              />
            ) : (
              <RadioGroup
                name="docs-radio-custom"
                value={radioValue}
                onValueChange={setRadioValue}
                orientation="horizontal">
                {radioOptions.map((option) => (
                  <Radio key={option.value} value={option.value} label={option.label} />
                ))}
              </RadioGroup>
            )}
            <output>{radioOptions.find((option) => option.value === radioValue)?.label}</output>
          </div>
        ),
      },
      {
        id: 'select',
        title: 'Select',
        summary: 'A styled select with primitive or value-label items.',
        layer: '@layer base',
        props: [
          { name: 'items', type: 'Value[]', description: 'Options rendered in the popup.' },
          { name: 'value', type: 'Value | Value[] | null', description: 'Controlled selected value.' },
          { name: 'onValueChange', type: '(value) => void', description: 'Receives the selected item or items.' },
          { name: 'placeholder', type: 'ReactNode', description: 'Shown when no value is selected.' },
          { name: 'itemComponent', type: '(item) => ReactNode', description: 'Custom option renderer.' },
          { name: 'valueNode', type: '(value) => ReactNode', description: 'Custom selected value renderer.' },
          { name: 'itemDisabled', type: '(item) => boolean', description: 'Marks options as disabled.' },
        ],
        usage: [
          { title: 'Value-label options', code: `<Select
  items={cityOptions}
  value={city}
  placeholder="Choose city"
  onValueChange={setCity}
/>` },
          { title: 'Primitive options', code: `<Select
  items={['Low', 'Medium', 'High']}
  value={priority}
  placeholder="Priority"
  onValueChange={setPriority}
/>` },
          { title: 'Custom rendering', code: `<Select
  items={users}
  value={assignee}
  itemToStringValue={(user) => user.id}
  itemToStringLabel={(user) => user.name}
  itemComponent={(user) => <UserOption user={user} />}
  valueNode={(user) => user ? <UserPill user={user} /> : null}
  onValueChange={setAssignee}
/>` },
        ],
        notes: [
          'Use Select for bounded choices where search is unnecessary; use Combobox for searchable or long lists.',
          'The wrapper understands { value, label, disabled } items automatically.',
          'For arbitrary objects, pass itemToStringValue and itemToStringLabel so values, labels, item keys, and test IDs stay stable.',
        ],
        preview: (
          <div className="PreviewStack">
            <PreviewModeControl
              label="Type"
              value={selectMode}
              onChange={setSelectMode}
              options={[
                { label: 'Single', value: 'single' },
                { label: 'Multiple', value: 'multiple' },
              ]}
            />
            {selectMode === 'single' ? (
              <>
                <Select
                  name="docs-city"
                  items={cityOptions}
                  value={city}
                  placeholder="Choose city"
                  onValueChange={setCity}
                />
                <output>{city?.label ?? 'No city selected'}</output>
              </>
            ) : (
              <>
                <Select
                  name="docs-cities"
                  items={cityOptions}
                  multiple
                  value={cities}
                  placeholder="Choose cities"
                  onValueChange={setCities}
                />
                <output>{cities.map((item) => item.label).join(', ') || 'No cities selected'}</output>
              </>
            )}
          </div>
        ),
      },
      {
        id: 'speeddial',
        title: 'SpeedDial',
        summary: 'A hover-open action menu around a trigger.',
        layer: '@layer base',
        props: [
          { name: 'trigger', type: 'ReactNode', description: 'The visible activator.' },
          { name: 'items', type: 'SpeedDialItem[]', description: 'Actions to render in the popup.' },
          { name: 'items[].component', type: 'ReactNode', description: 'The rendered action button or element.' },
          { name: 'items[].visible', type: 'boolean', description: 'Hidden items are filtered out before render.' },
          { name: 'items[].closeOnClick', type: 'boolean', description: 'Reserved on item type for action close behavior.' },
          { name: 'name / testId', type: 'string', description: 'Customize generated test IDs.' },
        ],
        usage: [
          { title: 'Floating actions', code: `<SpeedDial
  trigger={<button>+</button>}
  items={[{ visible: true, component: <button>Save</button> }]}
/>` },
          { title: 'Conditional actions', code: `<SpeedDial
  trigger={<Plus />}
  items={[
    { visible: canSave, component: <button onClick={save}>Save</button> },
    { visible: canNotify, component: <button onClick={notify}>Notify</button> },
  ]}
/>` },
          { title: 'Nested SpeedDialMenu', code: `<SpeedDial
  trigger={<Plus />}
  items={[
    {
      visible: true,
      component: <SpeedDialMenu trigger="More" items={['Copy', 'Delete']} />,
    },
  ]}
/>` },
        ],
        notes: [
          'Use SpeedDial for a compact cluster of secondary actions around a primary floating trigger.',
          'Each item controls its own visible flag, so callers can keep permission or state logic near the action definition.',
          'The current wrapper opens the root trigger on hover through Base UI Menu behavior.',
        ],
        preview: (
          <SpeedDial
            name="docs-speed-dial"
            trigger={<span className="SpeedDialTrigger"><Plus size={22} /></span>}
            items={[
              {
                visible: true,
                component: <button className="SpeedDialAction" type="button"><Save size={18} /></button>,
              },
              {
                visible: true,
                component: <button className="SpeedDialAction" type="button"><Bell size={18} /></button>,
              },
              {
                visible: true,
                component: <button className="SpeedDialAction" type="button"><Settings size={18} /></button>,
              },
            ]}
          />
        ),
      },
      {
        id: 'speeddialmenu',
        title: 'SpeedDialMenu',
        summary: 'A nested submenu component for grouped SpeedDial actions.',
        layer: '@layer base',
        props: [
          { name: 'trigger', type: 'ReactNode', description: 'Content rendered in the submenu trigger item.' },
          { name: 'items', type: 'ReactNode[]', description: 'Every item is rendered as a Base UI menu item inside the submenu popup.' },
          { name: 'slotProps.openOnHover', type: 'boolean', description: 'Opens the submenu when the trigger is hovered. Defaults to false.' },
          { name: 'slotProps.disable.separator', type: 'boolean', description: 'Removes separators between submenu items when true.' },
          { name: 'slotProps.classes', type: 'class map', description: 'Adds classes to Button, Popup, Item, and Separator slots.' },
          { name: 'name / testId', type: 'string', description: 'Customize generated test IDs for the submenu trigger, popup, items, and separators.' },
        ],
        usage: [
          { title: 'Inside SpeedDial', code: `<SpeedDial
  trigger={<Plus />}
  items={[{
    visible: true,
    component: (
      <SpeedDialMenu
        trigger="More"
        items={['Copy', 'Archive', 'Delete']}
      />
    ),
  }]}
/>` },
          { title: 'Open on hover', code: `<SpeedDialMenu
  trigger="Export"
  items={['CSV', 'PDF']}
  slotProps={{ openOnHover: true }}
/>` },
          { title: 'No separators', code: `<SpeedDialMenu
  trigger="Actions"
  items={actions}
  slotProps={{ disable: { separator: true } }}
/>` },
        ],
        notes: [
          'Render SpeedDialMenu inside a parent menu surface, usually as one SpeedDial item.',
          'Use it when several related actions should stay visually grouped under one action.',
          'Keep submenu items short; each entry is wrapped in a menu item and separated by default.',
        ],
        preview: (
          <div className="PreviewStack">
            <PreviewModeControl
              label="Separators"
              value={speedDialMenuMode}
              onChange={setSpeedDialMenuMode}
              options={[
                { label: 'On', value: 'separators' },
                { label: 'Off', value: 'compact' },
              ]}
            />
            <SpeedDial
              name="docs-speed-dial-menu"
              trigger={<span className="SpeedDialTrigger"><Plus size={22} /></span>}
              items={[
                {
                  visible: true,
                  component: (
                    <SpeedDialMenu
                      name="docs-nested-speed-dial-menu"
                      trigger={<span className="SpeedDialAction"><Settings size={18} /></span>}
                      items={['Copy', 'Archive', 'Delete']}
                      slotProps={{
                        openOnHover: true,
                        disable: { separator: speedDialMenuMode === 'compact' },
                      }}
                    />
                  ),
                },
              ]}
            />
          </div>
        ),
      },
      {
        id: 'stepper',
        title: 'Stepper',
        summary: 'A horizontal or vertical multi-step indicator system.',
        layer: '@layer base',
        props: [
          { name: 'active', type: 'number', description: 'Controlled active step index.' },
          { name: 'setActiveStep', type: '(step: number) => void', description: 'Controlled setter for active step changes.' },
          { name: 'defaultActive', type: 'number', description: 'Initial active step for uncontrolled usage.' },
          { name: 'orientation', type: "'horizontal' | 'vertical'", description: 'Controls layout direction.' },
          { name: 'Step.index', type: 'number', description: 'Required index for each child step.' },
          { name: 'Step.disabled / completed', type: 'boolean', description: 'Overrides state for individual steps.' },
        ],
        usage: [
          { title: 'Uncontrolled stepper', code: `<Stepper defaultActive={1}>
  <Step index={0}>
    <StepIndicator />
    <StepLabel>Account</StepLabel>
  </Step>
</Stepper>` },
          { title: 'Controlled stepper', code: `<Stepper active={activeStep} setActiveStep={setActiveStep}>
  {steps.map((step, index) => (
    <Step key={step.id} index={index} completed={index < activeStep}>
      <StepIndicator />
      <StepLabel>{step.label}</StepLabel>
    </Step>
  ))}
</Stepper>` },
          { title: 'Vertical stepper', code: `<Stepper orientation="vertical" defaultActive={0}>
  <Step index={0}><StepIndicator /><StepLabel>Account</StepLabel></Step>
  <Step index={1} disabled><StepIndicator /><StepLabel>Review</StepLabel></Step>
</Stepper>` },
        ],
        notes: [
          'Stepper provides context; Step, StepIndicator, StepLabel, and StepConnector must be rendered inside it.',
          'Use active and setActiveStep for wizard state owned by the page. Use defaultActive for local demo or simple uncontrolled state.',
          'Step computes state from disabled, active index, completed, and index position; child components read that state from context.',
        ],
        preview: (
          <div className="PreviewStack">
            <PreviewModeControl
              label="Orientation"
              value={stepperOrientation}
              onChange={setStepperOrientation}
              options={[
                { label: 'Horizontal', value: 'horizontal' },
                { label: 'Vertical', value: 'vertical' },
              ]}
            />
            <Stepper
              name={`docs-stepper-${stepperOrientation}`}
              defaultActive={1}
              orientation={stepperOrientation}>
              {renderStepperSteps()}
            </Stepper>
          </div>
        ),
      },
      {
        id: 'tabs',
        title: 'Tabs',
        summary: 'A controlled tab list with per-tab indicator color.',
        layer: '@layer base',
        props: [
          { name: 'tabs', type: '{ value: number; label: string; color: string }[]', description: 'Tab definitions and indicator colors.' },
          { name: 'activeTab', type: 'number', description: 'Current selected tab value.' },
          { name: 'setActiveTab', type: '(tab: number) => void', description: 'Called when the user selects a tab.' },
          { name: 'slotProps.classes', type: 'BaseTabs class map', description: 'Adds classes to Root, List, Tab, and Indicator.' },
          { name: 'name / testId', type: 'string', description: 'Customize generated test IDs.' },
        ],
        usage: [
          { title: 'Controlled tabs', code: `<Tabs
  tabs={tabs}
  activeTab={activeTab}
  setActiveTab={setActiveTab}
/>` },
          { title: 'Tab definitions', code: `const tabs = [
  { value: 0, label: 'Overview', color: '#2563eb' },
  { value: 1, label: 'Details', color: '#16a34a' },
];` },
          { title: 'Render panel content', code: `<>
  <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
  {activeTab === 0 ? <Overview /> : <Details />}
</>` },
        ],
        notes: [
          'Tabs renders only the tab list and indicator; the consuming page owns panel rendering.',
          'activeTab must match one of the numeric tabs[].value entries.',
          'The color field controls the visual indicator color for each tab.',
        ],
        preview: (
          <div className="PreviewStack">
            <Tabs
              name="docs-tabs"
              tabs={tabOptions}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
            <output>{tabOptions.find((tab) => tab.value === activeTab)?.label}</output>
          </div>
        ),
      },
      {
        id: 'toggle',
        title: 'Toggle',
        summary: 'A Base UI two-state button for independent on/off options.',
        layer: '@layer base',
        props: [
          { name: 'pressed / defaultPressed', type: 'boolean', description: 'Use pressed for controlled state or defaultPressed for uncontrolled initial state.' },
          { name: 'onPressedChange', type: '(pressed, details) => void', description: 'Receives the next pressed state.' },
          { name: 'value', type: 'string', description: 'Identifies the toggle when it is used with Base UI toggle group primitives.' },
          { name: 'icon', type: 'ReactNode', description: 'Optional icon rendered before the label.' },
          { name: 'label / children', type: 'ReactNode', description: 'Visible toggle content. Children take precedence over label.' },
          { name: 'disabled', type: 'boolean', description: 'Disables pointer and keyboard activation.' },
          { name: 'slotProps.classes', type: '{ Root?, Icon?, Label? }', description: 'Adds classes to the internal Toggle slots.' },
          { name: 'name / testId', type: 'string', description: 'Customize generated test IDs.' },
        ],
        usage: [
          { title: 'Controlled toggle', code: `<Toggle
  pressed={compact}
  onPressedChange={setCompact}
  icon={<Settings size={16} />}>
  Compact
</Toggle>` },
          { title: 'Uncontrolled toggle', code: `<Toggle defaultPressed label="Pinned" />` },
          { title: 'Disabled toggle', code: `<Toggle pressed disabled>
  Locked
</Toggle>` },
        ],
        notes: [
          'Use Toggle for independent pressed/unpressed actions such as compact mode, favorite, or pin.',
          'For mutually exclusive choices, use RadioGroup or Tabs instead of separate Toggle controls.',
          'Provide an accessible name through visible text or aria-label when rendering icon-only toggles.',
        ],
        preview: (
          <div className="PreviewStack">
            <div className="Inline">
              <Toggle
                name="docs-toggle-compact"
                value="compact"
                pressed={activeToggles.compact}
                onPressedChange={(pressed) => setActiveToggles((toggles) => ({ ...toggles, compact: pressed }))}
                icon={<Settings size={16} />}
              >
                Compact
              </Toggle>
              <Toggle
                name="docs-toggle-favorite"
                value="favorite"
                pressed={activeToggles.favorite}
                onPressedChange={(pressed) => setActiveToggles((toggles) => ({ ...toggles, favorite: pressed }))}
                icon={<Star size={16} />}
              >
                Favorite
              </Toggle>
              <Toggle defaultPressed disabled label="Locked" />
            </div>
            <output>
              {activeToggles.compact ? 'Compact on' : 'Compact off'}
              {' · '}
              {activeToggles.favorite ? 'favorite selected' : 'favorite clear'}
            </output>
          </div>
        ),
      },
      {
        id: 'tooltip',
        title: 'Tooltip',
        summary: 'A tooltip wrapper with arrow, side, and visual style controls.',
        layer: '@layer base',
        props: [
          { name: 'title', type: 'string', description: 'Tooltip text. Empty titles do not render a popup unless displayWhenEmpty is true.' },
          { name: 'children', type: 'ReactNode', description: 'Trigger content.' },
          { name: 'slotProps.side', type: "'top' | 'right' | 'bottom' | 'left'", description: 'Preferred tooltip side.' },
          { name: 'slotProps.boldType', type: "'Outline' | 'BoxShadow'", description: 'Selects tooltip arrow and popup style.' },
          { name: 'slotProps.disableArrow', type: 'boolean', description: 'Hides the arrow.' },
          { name: 'slotProps.provider', type: 'Tooltip.Provider props', description: 'Overrides provider behavior such as delay.' },
        ],
        usage: [
          { title: 'Basic tooltip', code: `<Tooltip title="Helpful detail" slotProps={{ side: 'top' }}>
  <Button>Hover</Button>
</Tooltip>` },
          { title: 'Outline style', code: `<Tooltip
  title="Validation note"
  slotProps={{ side: 'right', boldType: 'Outline', outlineColor: '#dc2626' }}>
  <Button>Inspect</Button>
</Tooltip>` },
          { title: 'Provider delay', code: `<Tooltip
  title="Appears immediately"
  slotProps={{ provider: { delay: 0 }, disableArrow: true }}>
  <Button>Fast</Button>
</Tooltip>` },
        ],
        notes: [
          'Use Tooltip for short supporting text. Do not put interactive content inside the tooltip popup.',
          'Empty title values skip popup rendering unless displayWhenEmpty is set, which is useful for preserving trigger layout.',
          'side is a preference; collision handling can flip or shift the popup to keep it visible.',
        ],
        preview: (
          <div className="PreviewStack">
            <PreviewModeControl
              label="Side"
              value={tooltipSide}
              onChange={setTooltipSide}
              options={tooltipDirections.map((side) => ({ label: side, value: side }))}
            />
            <PreviewModeControl
              label="Style"
              value={tooltipStyle}
              onChange={setTooltipStyle}
              options={[
                { label: 'Shadow', value: 'boxShadow' },
                { label: 'Outline', value: 'outline' },
              ]}
            />
            <div className="TooltipGrid">
              <Tooltip
                name={`docs-tooltip-${tooltipSide}-${tooltipStyle}`}
                title={`${tooltipSide} ${tooltipStyle === 'outline' ? 'outline' : 'shadow'} tooltip`}
                slotProps={{
                  side: tooltipSide,
                  boldType: tooltipStyle === 'outline' ? 'Outline' : 'BoxShadow',
                }}>
                <Button>{tooltipSide}</Button>
              </Tooltip>
            </div>
          </div>
        ),
      },
      {
        id: 'typography',
        title: 'Typography',
        summary: 'A Field.Label wrapper for consistent label typography.',
        layer: '@layer base',
        props: [
          { name: 'children', type: 'ReactNode', description: 'Label text or inline content.' },
          { name: 'htmlFor', type: 'string', description: 'Associates the label with a form control.' },
          { name: 'className', type: 'string', description: 'Adds a class to the label element.' },
          { name: 'slotProps.classes.Field', type: 'string', description: 'Adds a class to the field root.' },
          { name: 'name / testId', type: 'string', description: 'Customize generated test IDs.' },
        ],
        usage: [
          { title: 'Input label', code: `<Typography htmlFor="email">
  Email address
</Typography>` },
          { title: 'Required label', code: `<Typography htmlFor="firstName">
  First name <span aria-hidden="true">*</span>
</Typography>` },
          { title: 'Custom label props', code: `<Typography
  htmlFor="amount"
  className={styles.RequiredLabel}>
  Amount
</Typography>` },
        ],
        notes: [
          'Typography is specifically a Base UI Field.Label wrapper, not a general text component.',
          'Use htmlFor with a matching input id to create an accessible label relationship.',
          'children can include inline elements, but keep the label concise and form-control focused.',
        ],
        preview: (
          <div className="PreviewStack">
            <Typography htmlFor="docs-input">Documented label</Typography>
            <Input value={inputValue} onChange={(event) => setInputValue(event.target.value)} />
          </div>
        ),
      },
    ],
    [
      activeTab,
      calendarDates,
      calendarDate,
      calendarMode,
      calendarRange,
      cities,
      city,
      comboMulti,
      comboboxMode,
      comboSingle,
      count,
      dataTableMode,
      datePickerMode,
      docsTheme,
      drawerDirection,
      inputValue,
      menuMode,
      multipleDates,
      rangeDate,
      radioOrientation,
      radioValue,
      selectMode,
      singleDate,
      speedDialMenuMode,
      stepperOrientation,
      activeToggles,
      tooltipSide,
      tooltipStyle,
    ],
  );

  const activeDoc = componentDocs.find((doc) => doc.id === activeComponent) ?? componentDocs[0];

  return (
    <DirectionProvider direction="ltr">
        <DarkModeProvider theme={docsTheme} className="ThemeRoot">
          <main className="DocsPage">
            <aside className="Sidebar" aria-label="Component documentation">
              <div className="SidebarHeader">
                <strong>Reshet Components</strong>
                <span>{componentDocs.length} components</span>
              </div>
              <nav className="VerticalTabs" role="tablist" aria-orientation="vertical">
                {componentDocs.map((doc) => (
                  <button
                    key={doc.id}
                    id={`tab-${doc.id}`}
                    type="button"
                    role="tab"
                    aria-selected={activeDoc.id === doc.id}
                    aria-controls={`panel-${doc.id}`}
                    className="VerticalTab"
                    onClick={() => setActiveComponent(doc.id)}>
                    <span>{doc.title}</span>
                    <small>{doc.layer.replaceAll('@layer ', '')}</small>
                  </button>
                ))}
              </nav>
            </aside>

            <div className="DocsMain">
              <header className="Hero">
                <div>
                  <p className="Eyebrow">React component library</p>
                  <h1>Component Documentation</h1>
                  <p>
                    Select a component from the vertical tabs to see its live example,
                    detailed prop notes, multiple usage examples, AI usage notes, and CSS layer guidance.
                  </p>
                </div>
                <div className="HeroActions">
                  <Button
                    type="button"
                    onClick={() => setDocsTheme((theme) => theme === 'dark' ? 'light' : 'dark')}>
                    {docsTheme === 'dark' ? 'Light mode' : 'Dark mode'}
                  </Button>
                </div>
              </header>

              <ComponentPanel doc={activeDoc} />
            </div>
          </main>
        </DarkModeProvider>
    </DirectionProvider>
  );
}

createRoot(document.getElementById('root')!).render(<Documentation />);
