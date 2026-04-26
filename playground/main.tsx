import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import type { DateRange } from 'react-day-picker';
import {
  Button,
  Chip,
  DatePicker,
  Input,
  NumberField,
  Select,
  type SelectValueLabelPair,
} from '../src';
import '../src/theme.css';
import './styles.css';
import { DirectionProvider } from '@base-ui/react';

const formatDate = (date: Date | undefined) =>
  date ? date.toLocaleDateString('he-IL') : 'empty';

const cityOptions: SelectValueLabelPair[] = [
  { value: 'jerusalem', label: 'Jerusalem' },
  { value: 'tel-aviv', label: 'Tel Aviv' },
  { value: 'haifa', label: 'Haifa' },
  { value: 'beer-sheva', label: 'Beer Sheva', disabled: true },
];

function Playground() {
  const [inputValue, setInputValue] = useState('Editable text');
  const [count, setCount] = useState(3);
  const [city, setCity] = useState<SelectValueLabelPair | null>(cityOptions[0]);
  const [singleDate, setSingleDate] = useState(new Date());
  const [multipleDates, setMultipleDates] = useState<Date[]>([new Date()]);
  const [rangeDate, setRangeDate] = useState<DateRange>({
    from: new Date(),
    to: undefined,
  });

  return (
    <DirectionProvider direction='ltr'>
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
      </main>
    </DirectionProvider>
  );
}

createRoot(document.getElementById('root')!).render(<Playground />);
