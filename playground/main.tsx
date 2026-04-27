import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import type { DateRange } from 'react-day-picker';
import { DirectionProvider, Toast as BaseToast } from '@base-ui/react';
import { Bell, Check, Menu, MessageCircle, Plus, Save, Settings } from 'lucide-react';
import {
  Button,
  Chip,
  Combobox,
  type ComboboxValueLabelPair,
  DatePicker,
  Drawer,
  Input,
  MaterialSearch,
  type Material,
  NumberField,
  Select,
  type SelectValueLabelPair,
  SpeedDial,
  Step,
  StepConnector,
  StepIndicator,
  StepLabel,
  Stepper,
  Tabs,
  Toast,
  Tooltip,
} from '../src';
import '../src/theme.css';
import './styles.css';

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

const materialOptions: Material[] = [
  {
    id: '100421',
    category: 'Medical',
    nickname: 'Trauma kit',
    description: 'Advanced field trauma kit',
    type: 'equipment',
    favorite: true,
  },
  {
    id: '100884',
    category: 'Comms',
    nickname: 'Radio set',
    description: 'Encrypted handheld radio',
    type: 'equipment',
  },
  {
    id: '101204',
    category: 'Logistics',
    nickname: 'Water pack',
    description: 'Portable water resupply pack',
    type: 'supply',
  },
  {
    id: '102018',
    category: 'Tools',
    nickname: 'Repair tool',
    description: 'Compact field repair tool',
    type: 'tool',
  },
];

const tabOptions = [
  { value: 0, label: 'Overview', color: '#2563eb' },
  { value: 1, label: 'Details', color: '#16a34a' },
  { value: 2, label: 'Activity', color: '#c2410c' },
];

const stepLabels = ['Account', 'Profile', 'Review'];

const tooltipDirections = ['top', 'right', 'bottom', 'left'] as const;

const renderStepperSteps = () =>
  stepLabels.map((label, index) => (
    <Step key={label} index={index} name={`playground-step-${label.toLowerCase()}`}>
      <StepIndicator name={`playground-step-indicator-${label.toLowerCase()}`} />
      <StepLabel name={`playground-step-label-${label.toLowerCase()}`}>{label}</StepLabel>
      {index < stepLabels.length - 1 && (
        <StepConnector name={`playground-step-connector-${label.toLowerCase()}`} />
      )}
    </Step>
  ));

function Playground() {
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
  const [selectedMaterials, setSelectedMaterials] = useState<Material[]>([
    materialOptions[0],
  ]);
  const [singleDate, setSingleDate] = useState(new Date());
  const [multipleDates, setMultipleDates] = useState<Date[]>([new Date()]);
  const [rangeDate, setRangeDate] = useState<DateRange>({
    from: new Date(),
    to: undefined,
  });
  const [activeTab, setActiveTab] = useState(tabOptions[0].value);

  return (
    <DirectionProvider direction='ltr'>
      <BaseToast.Provider>
        <main className="Playground">
          <header className="Header">
            <div>
              <h1>Reshet Components Playground</h1>
              <p>Use this page to test component behavior while developing the library.</p>
            </div>
          </header>

          <section className="Section">
            <h2>Inputs</h2>
            <div className="Grid">
              <div className="Field">
                <label htmlFor="playground-input">Input</label>
                <Input
                  id="playground-input"
                  name="playground-input"
                  value={inputValue}
                  onChange={(event) => setInputValue(event.target.value)}
                />
                <output>{inputValue}</output>
              </div>

              <div className="Field">
                <NumberField
                  name="playground-count"
                  label="Number"
                  min={0}
                  max={20}
                  value={count}
                  onValueChange={(nextValue) => setCount(nextValue ?? 0)}
                />
                <output>{count}</output>
              </div>

              <div className="Field">
                <label>Button and chip</label>
                <div className="Inline">
                  <Button onClick={() => setCount((value) => value + 1)}>
                    Add one
                  </Button>
                  <Chip label={`Count ${count}`} slotProps={{ backgroundColor: '#2563eb' }} />
                </div>
              </div>

              <div className="Field">
                <label>Dropdown</label>
                <Select
                  name="playground-city"
                  items={cityOptions}
                  value={city}
                  placeholder="Choose city"
                  onValueChange={setCity}
                />
                <output>{city?.label ?? 'No city selected'}</output>
              </div>
            </div>
          </section>

          <section className="Section">
            <h2>Combobox Modes</h2>
            <div className="Grid">
              <div className="Field">
                <label>Single combobox</label>
                <Combobox
                  name="playground-combobox-single"
                  items={comboboxOptions}
                  value={comboSingle}
                  placeholder="Choose item"
                  emptyLabel="No item found"
                  onValueChange={setComboSingle}
                />
                <output>{comboSingle?.label ?? 'No item selected'}</output>
              </div>

              <div className="Field">
                <label>Multi combobox</label>
                <Combobox
                  name="playground-combobox-multi"
                  items={comboboxOptions}
                  multiple
                  value={comboMulti}
                  placeholder="Choose items"
                  emptyLabel="No items found"
                  onValueChange={setComboMulti}
                />
                <output>{comboMulti.map((item) => item.label).join(', ') || 'No items selected'}</output>
              </div>
            </div>
          </section>

          <section className="Section">
            <h2>Material Search</h2>
            <div className="Grid">
              <div className="Field FieldWide">
                <label>MaterialSearch</label>
                <MaterialSearch
                  name="playground-material-search"
                  materials={materialOptions}
                  value={selectedMaterials}
                  onValueChange={setSelectedMaterials}
                  onAddMaterials={(materials) => setSelectedMaterials(materials)}
                />
                <output>
                  {selectedMaterials.map((material) => material.id).join(', ') || 'No materials selected'}
                </output>
              </div>
            </div>
          </section>

          <section className="Section">
            <h2>DatePicker Modes</h2>
            <div className="Grid">
              <div className="Field">
                <label>Single</label>
                <DatePicker
                  name="playground-single-date"
                  mode="single"
                  value={singleDate}
                  onValueChange={setSingleDate}
                />
                <output>{formatDate(singleDate)}</output>
              </div>

              <div className="Field">
                <label>Multiple</label>
                <DatePicker
                  name="playground-multiple-date"
                  mode="multiple"
                  value={multipleDates}
                  closeOnSelect={false}
                  onValueChange={setMultipleDates}
                />
                <output>{multipleDates.map(formatDate).join(', ') || 'empty'}</output>
              </div>

              <div className="Field">
                <label>Range</label>
                <DatePicker
                  name="playground-range-date"
                  mode="range"
                  value={rangeDate}
                  closeOnSelect={false}
                  onValueChange={setRangeDate}
                />
                <output>
                  {formatDate(rangeDate.from)} - {formatDate(rangeDate.to)}
                </output>
              </div>
            </div>
          </section>

          <section className="Section">
            <h2>Overlays and Feedback</h2>
            <div className="Grid">
              <div className="Field">
                <label>Drawer</label>
                <Drawer
                  name="playground-drawer"
                  triggerIcon={<Menu />}
                  slotProps={{ width: '360px', direction: 'right', disable: { trigger: false } }}>
                  <div className="DrawerContent">
                    <h3>Drawer panel</h3>
                    <p>Use this panel to inspect drawer positioning and backdrop behavior.</p>
                    <Button>Drawer action</Button>
                  </div>
                </Drawer>
              </div>

              <div className="Field">
                <label>Speed dial</label>
                <SpeedDial
                  name="playground-speed-dial"
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
              </div>

              <div className="Field">
                <label>Toasts</label>
                <div className="Inline">
                  <Toast.Success
                    name="playground-toast-success"
                    title="Saved"
                    description="The playground item was saved."
                    icon={<Check size={18} />}
                  />
                  <Toast.Error
                    name="playground-toast-error"
                    title="Failed"
                    description="The action could not be completed."
                    icon="Error"
                  />
                  <Toast.Info
                    name="playground-toast-info"
                    title="Heads up"
                    description="There is more information to review."
                    icon={<MessageCircle size={18} />}
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="Section">
            <h2>Navigation</h2>
            <div className="Grid">
              <div className="Field">
                <label>Tabs</label>
                <Tabs
                  name="playground-tabs"
                  tabs={tabOptions}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                />
                <output>{tabOptions.find((tab) => tab.value === activeTab)?.label}</output>
              </div>

              <div className="Field">
                <label>Horizontal stepper</label>
                <Stepper name="playground-stepper-horizontal" defaultActive={1}>
                  {renderStepperSteps()}
                </Stepper>
              </div>

              <div className="Field">
                <label>Vertical stepper</label>
                <Stepper name="playground-stepper-vertical" defaultActive={1} orientation="vertical">
                  {renderStepperSteps()}
                </Stepper>
              </div>
            </div>
          </section>

          <section className="Section">
            <h2>Tooltip Directions</h2>
            <div className="TooltipGrid">
              {tooltipDirections.map((side) => (
                <Tooltip
                  key={side}
                  name={`playground-tooltip-${side}`}
                  title={`${side} tooltip`}
                  slotProps={{ side }}>
                  <Button>{side}</Button>
                </Tooltip>
              ))}
            </div>
          </section>
        </main>
      </BaseToast.Provider>
    </DirectionProvider>
  );
}

createRoot(document.getElementById('root')!).render(<Playground />);
