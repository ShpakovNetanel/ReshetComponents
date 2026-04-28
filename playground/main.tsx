import { Toast as BaseToast, DirectionProvider } from '@base-ui/react';
import {
  Bell,
  Check,
  List,
  MessageCircle,
  Plus,
  Save,
  Settings
} from 'lucide-react';
import { useMemo, useState, type ReactNode } from 'react';
import type { DateRange } from 'react-day-picker';
import { createRoot } from 'react-dom/client';
import {
  Accordion,
  Button,
  Calendar,
  Chip,
  Combobox,
  DarkModeProvider,
  DatePicker,
  Dialog,
  Drawer,
  Input,
  Menu,
  NumberField,
  Select,
  SpeedDial,
  Step,
  StepConnector,
  StepIndicator,
  StepLabel,
  Stepper,
  Tabs,
  Toast,
  Tooltip,
  Typography,
  type ComboboxValueLabelPair,
  type ReshetThemeMode,
  type SelectValueLabelPair,
} from '../src';
import '../src/theme.css';
import './styles.css';

type PropDoc = {
  name: string;
  type: string;
  description: string;
};

type ComponentDoc = {
  id: string;
  title: string;
  summary: string;
  layer: string;
  props: PropDoc[];
  usage: string;
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

const tabOptions = [
  { value: 0, label: 'Overview', color: '#2563eb' },
  { value: 1, label: 'Details', color: '#16a34a' },
  { value: 2, label: 'Activity', color: '#c2410c' },
];

const stepLabels = ['Account', 'Profile', 'Review'];
const tooltipDirections = ['top', 'right', 'bottom', 'left'] as const;

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
        <h3>Usage</h3>
        <pre>
          <code>{doc.usage}</code>
        </pre>
      </section>
    </div>

    <section className="PropsPanel" aria-labelledby={`${doc.id}-props-title`}>
      <p className="Eyebrow">API</p>
      <h3 id={`${doc.id}-props-title`}>Props</h3>
      <PropTable props={doc.props} />
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
  const [singleDate, setSingleDate] = useState(new Date());
  const [multipleDates, setMultipleDates] = useState<Date[]>([new Date()]);
  const [rangeDate, setRangeDate] = useState<DateRange>({
    from: new Date(),
    to: undefined,
  });
  const [calendarDate, setCalendarDate] = useState<Date | undefined>(new Date());
  const [activeTab, setActiveTab] = useState(tabOptions[0].value);

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
        usage: darkModeUsage,
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
          { name: 'disableChevron', type: 'boolean', description: 'When true, the chevron icon is not rendered in the trigger.' },
          { name: 'onOpenChange', type: '(open: boolean) => void', description: 'Called whenever the panel opens or closes.' },
          { name: 'slotProps', type: '{ classes?, headerProps? }', description: 'Pass class names or header data attributes for styling and tests.' },
          { name: 'name / testId', type: 'string', description: 'Customize generated test IDs.' },
        ],
        usage: `<Accordion
  title="Advanced settings"
  defaultOpen={false}
  disableChevron={false}>
  <p>Panel content</p>
</Accordion>`,
        preview: (
          <div className="PreviewStack">
            <Accordion
              name="docs-accordion"
              title={<strong>Advanced settings</strong>}
              actions={<Chip label="Optional" slotProps={{ backgroundColor: '#e6f4ff' }} />}
              defaultOpen={false}>
              <p className="PreviewText">Use the panel for grouped content that can be hidden until needed.</p>
            </Accordion>
            <Accordion
              name="docs-accordion-no-chevron"
              title={<strong>No chevron</strong>}
              disableChevron>
              <p className="PreviewText">Set disableChevron when the title or layout already communicates expansion.</p>
            </Accordion>
          </div>
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
        usage: `<Button type="button" onClick={handleSave}>
  Save
</Button>`,
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
        usage: `<Calendar
  mode="single"
  selected={date}
  onSelect={setDate}
/>`,
        preview: (
          <Calendar
            name="docs-calendar"
            mode="single"
            selected={calendarDate}
            onSelect={setCalendarDate}
          />
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
        usage: `<Chip
  label="Active"
  slotProps={{ backgroundColor: '#16a34a' }}
/>`,
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
        usage: `<Combobox
  items={items}
  value={value}
  placeholder="Choose item"
  emptyLabel="No item found"
  onValueChange={setValue}
/>`,
        preview: (
          <div className="PreviewStack">
            <label>Single</label>
            <Combobox
              name="docs-combobox-single"
              items={comboboxOptions}
              value={comboSingle}
              placeholder="Choose item"
              emptyLabel="No item found"
              onValueChange={setComboSingle}
            />
            <output>{comboSingle?.label ?? 'No item selected'}</output>
            <label>Multiple</label>
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
        usage: `<DatePicker
  mode="range"
  value={range}
  closeOnSelect={false}
  onValueChange={setRange}
/>`,
        preview: (
          <div className="PreviewStack">
            <label>Single</label>
            <DatePicker
              name="docs-single-date"
              mode="single"
              value={singleDate}
              onValueChange={setSingleDate}
            />
            <output>{formatDate(singleDate)}</output>
            <label>Multiple</label>
            <DatePicker
              name="docs-multiple-date"
              mode="multiple"
              value={multipleDates}
              closeOnSelect={false}
              onValueChange={setMultipleDates}
            />
            <output>{multipleDates.map(formatDate).join(', ') || 'empty'}</output>
            <label>Range</label>
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
        usage: `<Dialog trigger={<Button>Open dialog</Button>}>
  <div>Dialog content</div>
</Dialog>`,
        preview: (
          <Dialog
            name="docs-dialog"
            trigger={<Button type="button">Open dialog</Button>}>
            <div className="DialogContent">
              <h3>Confirm action</h3>
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
        usage: `<Drawer slotProps={{ direction: 'right', width: '360px' }}>
  <div>Drawer content</div>
</Drawer>`,
        preview: (
          <Drawer
            name="docs-drawer"
            slotProps={{ width: '360px', direction: 'right' }}>
            <div className="DrawerContent">
              <h3>Drawer panel</h3>
              <p>Use this panel for navigation, filters, or contextual actions.</p>
              <Button>Drawer action</Button>
            </div>
          </Drawer>
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
        usage: `<Input
  value={value}
  onChange={(event) => setValue(event.target.value)}
/>`,
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
        summary: 'A trigger and popup menu for a list of React node items.',
        layer: '@layer base',
        props: [
          { name: 'items', type: 'ReactNode[]', description: 'Each array item is rendered as a menu item.' },
          { name: 'slotProps.trigger', type: 'ReactNode', description: 'Custom trigger content. Defaults to a menu icon.' },
          { name: 'slotProps.classes', type: 'Base UI class map', description: 'Adds classes to trigger, positioner, popup, and items.' },
          { name: 'open', type: 'boolean', description: 'Controlled open state from Base UI Menu.' },
          { name: 'onOpenChange', type: '(open: boolean) => void', description: 'Called when the menu opens or closes.' },
          { name: 'name / testId', type: 'string', description: 'Customize generated test IDs.' },
        ],
        usage: `<Menu
  items={['Profile', 'Settings', 'Sign out']}
  slotProps={{ trigger: <List /> }}
/>`,
        preview: (
          <Menu
            name="docs-menu"
            items={['Profile', 'Settings', 'Sign out']}
            slotProps={{ trigger: <List size={20} /> }}
          />
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
        usage: `<NumberField
  label="Amount"
  min={0}
  max={20}
  value={count}
  onValueChange={(value) => setCount(value ?? 0)}
/>`,
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
        usage: `<Select
  items={cityOptions}
  value={city}
  placeholder="Choose city"
  onValueChange={setCity}
/>`,
        preview: (
          <div className="PreviewStack">
            <Select
              name="docs-city"
              items={cityOptions}
              value={city}
              placeholder="Choose city"
              onValueChange={setCity}
            />
            <output>{city?.label ?? 'No city selected'}</output>
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
        usage: `<SpeedDial
  trigger={<button>+</button>}
  items={[{ visible: true, component: <button>Save</button> }]}
/>`,
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
        usage: `<Stepper defaultActive={1}>
  <Step index={0}>
    <StepIndicator />
    <StepLabel>Account</StepLabel>
  </Step>
</Stepper>`,
        preview: (
          <div className="PreviewStack">
            <Stepper name="docs-stepper-horizontal" defaultActive={1}>
              {renderStepperSteps()}
            </Stepper>
            <Stepper name="docs-stepper-vertical" defaultActive={1} orientation="vertical">
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
        usage: `<Tabs
  tabs={tabs}
  activeTab={activeTab}
  setActiveTab={setActiveTab}
/>`,
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
        id: 'toast',
        title: 'Toast',
        summary: 'Success, error, and info toast triggers with configurable copy and icons.',
        layer: '@layer base + @layer library',
        props: [
          { name: 'title', type: 'string', description: 'Toast title text.' },
          { name: 'description', type: 'string', description: 'Toast body text.' },
          { name: 'icon', type: 'ReactNode', description: 'Icon rendered inside the trigger button.' },
          { name: 'trigger', type: 'ReactNode', description: 'Custom trigger element for ToastBase.' },
          { name: 'slotProps.ToastList', type: 'ToastListSlotProps', description: 'Customize rendered toast list and list icon.' },
          { name: 'name / testId', type: 'string', description: 'Customize generated test IDs.' },
        ],
        usage: `<Toast.Success
  title="Saved"
  description="Item saved"
  icon={<Check />}
/>`,
        preview: (
          <div className="Inline">
            <Toast.Success
              name="docs-toast-success"
              title="Saved"
              description="The docs item was saved."
              icon={<Check size={18} />}
            />
            <Toast.Error
              name="docs-toast-error"
              title="Failed"
              description="The action could not be completed."
              icon="Error"
            />
            <Toast.Info
              name="docs-toast-info"
              title="Heads up"
              description="There is more information to review."
              icon={<MessageCircle size={18} />}
            />
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
        usage: `<Tooltip title="Helpful detail" slotProps={{ side: 'top' }}>
  <Button>Hover</Button>
</Tooltip>`,
        preview: (
          <div className="TooltipGrid">
            {tooltipDirections.map((side) => (
              <Tooltip
                key={side}
                name={`docs-tooltip-${side}`}
                title={`${side} tooltip`}
                slotProps={{ side }}>
                <Button>{side}</Button>
              </Tooltip>
            ))}
            {tooltipDirections.map((side) => (
              <Tooltip
                key={`outline-${side}`}
                name={`docs-tooltip-outline-${side}`}
                title={`${side} outline`}
                slotProps={{ side, boldType: 'Outline' }}>
                <Button>{side}</Button>
              </Tooltip>
            ))}
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
        usage: `<Typography htmlFor="email">
  Email address
</Typography>`,
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
      calendarDate,
      city,
      comboMulti,
      comboSingle,
      count,
      docsTheme,
      inputValue,
      multipleDates,
      rangeDate,
      singleDate,
    ],
  );

  const activeDoc = componentDocs.find((doc) => doc.id === activeComponent) ?? componentDocs[0];

  return (
    <DirectionProvider direction="ltr">
      <BaseToast.Provider>
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
                    full prop notes, usage snippet, and CSS layer guidance.
                  </p>
                </div>
                <Button
                  type="button"
                  onClick={() => setDocsTheme((theme) => theme === 'dark' ? 'light' : 'dark')}>
                  {docsTheme === 'dark' ? 'Light mode' : 'Dark mode'}
                </Button>
              </header>

              <ComponentPanel doc={activeDoc} />
            </div>
          </main>
        </DarkModeProvider>
      </BaseToast.Provider>
    </DirectionProvider>
  );
}

createRoot(document.getElementById('root')!).render(<Documentation />);
