# Components README

This file is meant to be prompt-friendly documentation for the component library in `src/baseComponents`.

Use it when you need to explain:

- what components are exported
- how they are usually imported
- how `data-testid` values are generated
- when to use `name`
- when to use `testId`

## Public Exports

The package exports its public components from [src/index.ts](../index.ts).

Main component exports:

- `Accordion`
- `AmmoLoading`
- `Button`
- `Calendar`
- `Chip`
- `Combobox`
- `DatePicker`
- `DarkModeProvider`
- `Dialog`
- `Drawer`
- `Input`
- `Menu`
- `NumberField`
- `Select`
- `SpeedDial`
- `SpeedDialMenu`
- `Step`
- `StepConnector`
- `StepIndicator`
- `StepLabel`
- `Stepper`
- `Tabs`
- `Toast`
- `ToastBase`
- `ToastButton`
- `ToastList`
- `Tooltip`
- `Typography`
- `ThemeProvider`

Utility exports:

- `buildTestId`
- `testIdProps`
- `useReshetTheme`

## Basic Import Pattern

```tsx
import { Button, DatePicker, Select, SpeedDial, ToastList } from 'reshet-components';
```

## Theme Provider

The library exports both `ThemeProvider` and `DarkModeProvider`. They are the same component; `ThemeProvider` is the preferred application-facing name.

Use controlled mode when the consuming application already has dark-mode state:

```tsx
import { ThemeProvider } from 'reshet-components';

function AppShell() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  return (
    <ThemeProvider theme={theme} onThemeChange={setTheme}>
      <App />
    </ThemeProvider>
  );
}
```

Use uncontrolled mode when the component library can choose the initial mode:

```tsx
<ThemeProvider defaultTheme="system">
  <App />
</ThemeProvider>
```

Supported modes:

- `light`
- `dark`
- `system`

Important popup note:

- `syncDocumentTheme` defaults to `true`.
- Keep it enabled when using portaled components such as `Select`, `Combobox`, `DatePicker`, `Menu`, `Dialog`, `Drawer`, `Tooltip`, and `Toast`.
- It mirrors `data-theme` to `document.documentElement`, so popup surfaces inherit the same light/dark tokens as the provider subtree.

Inside a provider, `useReshetTheme()` returns:

- `theme`
- `resolvedTheme`
- `isDark`
- `setTheme`

## Test ID System

The test id system lives in [src/utils/testIds.ts](../utils/testIds.ts).

There are two relevant helpers:

- `buildTestId(...parts)`
- `createTestIdBuilder(componentName, { name, testId })`

`buildTestId`:

- trims values
- removes non-alphanumeric separators
- converts everything to lowercase
- joins parts with `-`

Example:

```ts
buildTestId('SpeedDial', 'Popup', 'Main Actions')
// => "speeddial-popup-main-actions"
```

## Preferred Usage

Use `name` for normal testing.

Use `testId` only when you need an exact manual prefix.

Recommended:

```tsx
<SpeedDial name="main-actions" />
<DatePicker name="birth-date" />
<ToastList name="notifications" />
```

Less common override:

```tsx
<SpeedDial name="main-actions" testId="fab-menu" />
```

In that case the generated ids start from `fab-menu` instead of `SpeedDial`.

## Generation Rules

The internal pattern is:

### Root element

Without `testId`:

```ts
buildTestId(ComponentName, name, ...suffixes)
```

With `testId`:

```ts
buildTestId(testId, ...suffixes)
```

### Named child part

Without `testId`:

```ts
buildTestId(ComponentName, PartName, name, ...suffixes)
```

With `testId`:

```ts
buildTestId(testId, PartName, ...suffixes)
```

## What To Pass From The Outside

For most tests, only pass `name`.

Example:

```tsx
<Select name="country" />
```

That gives a stable family of ids such as:

- `select-trigger-country`
- `select-value-country`
- `select-popup-country`
- `select-item-country-israel`

## Concrete Examples

### SpeedDial

Component code uses `createTestIdBuilder('SpeedDial', { name, testId })`.

Example:

```tsx
<SpeedDial name="main-actions" />
```

Generated ids:

- Trigger: `speeddial-trigger-main-actions`
- Popup: `speeddial-popup-main-actions`
- First item: `speeddial-item-main-actions-0`

This matches the pattern:

```ts
buildTestId('SpeedDial', 'Popup', name)
```

### ToastList

Example:

```tsx
<ToastList name="notifications" />
```

Generated ids per toast:

- Toast root: `toastlist-notifications-<toastId>`
- Content: `toastlist-content-notifications-<toastId>`
- Title: `toastlist-title-notifications-<toastId>`
- Description: `toastlist-description-notifications-<toastId>`
- Close: `toastlist-close-notifications-<toastId>`

This matches the pattern:

```ts
buildTestId('ToastList', name, toastId)
buildTestId('ToastList', 'Content', name, toastId)
```

### DatePicker

Example:

```tsx
<DatePicker name="birth-date" />
```

Generated ids:

- Wrapper/root DOM node: `datepicker-birth-date`
- Input: `datepicker-input-birth-date`
- Trigger button: `datepicker-trigger-birth-date`
- Popup stack: `datepicker-popupstack-birth-date`
- Popup: `datepicker-popup-birth-date`
- Nested calendar root: `datepicker-calendar-birth-date`

Note:

- `DatePicker` composes other components internally.
- Parents can pass a prebuilt `testId` into nested children when they want one continuous namespace.

### Stepper

Example:

```tsx
<Stepper name="checkout-steps" />
<Step index={0} name="shipping" />
```

Generated ids:

- Stepper root: `stepper-checkout-steps`
- Step 0: `step-shipping-0`

## How To Think About `name`

`name` is not the HTML `name` attribute concept everywhere.

In this component library, `name` is primarily the semantic testing suffix.

Pick values that describe the entity being tested:

- `primary-submit`
- `filters`
- `birth-date`
- `notifications`
- `main-actions`
- `checkout-steps`

Avoid vague values like:

- `item`
- `test`
- `component`

## When To Use `testId`

Use `testId` only if you need full control over the prefix or need backward compatibility with an older test suite.

Example:

```tsx
<SpeedDial name="main-actions" testId="fab" />
```

Generated ids:

- Trigger: `fab-trigger`
- Popup: `fab-popup`
- First item: `fab-item-0`

When `testId` is provided, it overrides the component namespace and `name` is not used for the generated prefix.

## Important Testing Note

Some base UI primitives do not render their own visible root element.

Because of that, the useful `data-testid` may live on a rendered child part instead of a conceptual root wrapper.

Examples:

- `SpeedDial` exposes ids on `Trigger`, `Popup`, and `Item`
- `Menu` exposes ids on `Trigger`, `Popup`, and `Item`
- `Dialog` exposes ids on `Trigger`, `Backdrop`, and `Popup`

Do not assume every component has a DOM node named `Root`.

## Prompt Summary

If you need a short explanation for another model or teammate, use this:

```text
This component library generates data-testid values automatically.
Prefer passing `name` and let the component build ids from its own namespace.
The default pattern is:
- root: buildTestId(ComponentName, name)
- part: buildTestId(ComponentName, PartName, name, ...suffixes)
If `testId` is provided, it overrides the namespace:
- root: buildTestId(testId, ...suffixes)
- part: buildTestId(testId, PartName, ...suffixes)
All ids are sanitized to lowercase kebab-case.
Example:
<SpeedDial name="main-actions" /> -> `speeddial-popup-main-actions`
<ToastList name="notifications" /> -> `toastlist-content-notifications-123`
```
