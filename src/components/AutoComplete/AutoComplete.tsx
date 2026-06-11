import { Autocomplete as BaseAutocomplete } from '@base-ui/react/autocomplete';
import clsx from 'clsx';
import { ChevronDown, X } from 'lucide-react';
import {
    useCallback,
    useEffect,
    useId,
    useRef,
    useState,
    type ClipboardEventHandler,
    type ComponentPropsWithoutRef,
    type FocusEventHandler,
    type KeyboardEventHandler,
    type MouseEvent,
    type ReactNode,
} from 'react';
import { isPlainObject } from 'remeda';
import type { ClassNames } from '../../types/baseui';
import { createTestIdBuilder } from '../../utils/testIds';
import styles from './AutoComplete.module.scss';
import { Button } from '../Button/Button';

export type Primitive = string | number;
export type ValueLabelPair = { value: any; label: ReactNode; disabled?: boolean };

export type AutoCompleteLoadItems<Value> = (
    query: string,
    context: { signal: AbortSignal },
) => Promise<readonly Value[]> | readonly Value[];

type Disable = {
    clear?: boolean;
    emptyLabel?: boolean;
    trigger?: boolean;
    status?: boolean;
};

type SlotProps = {
    classes?: ClassNames<
        typeof BaseAutocomplete,
        | 'ActionButtons'
        | 'ClearIcon'
        | 'Container'
        | 'InputWrapper'
        | 'ItemText'
        | 'Spinner'
        | 'StartAdornment'
        | 'Status'
        | 'TriggerIcon'
        | 'Viewport'
    >;
    clearProps?: Omit<ComponentPropsWithoutRef<typeof BaseAutocomplete.Clear>, 'children' | 'className'>;
    inputProps?: Omit<ComponentPropsWithoutRef<typeof BaseAutocomplete.Input>, 'className'>;
    popupProps?: Omit<ComponentPropsWithoutRef<typeof BaseAutocomplete.Popup>, 'children' | 'className'>;
    positionerProps?: Omit<ComponentPropsWithoutRef<typeof BaseAutocomplete.Positioner>, 'children' | 'className'>;
    triggerProps?: Omit<ComponentPropsWithoutRef<typeof BaseAutocomplete.Trigger>, 'children' | 'className'>;
    disable?: Disable;
};

export type AutoCompleteProps<Value> = {
    items?: readonly Value[];
    async?: boolean;
    loadItems?: AutoCompleteLoadItems<Value>;
    value?: Value | null;
    defaultValue?: Value | null;
    onValueChange?: (value: Value | null) => void;
    inputValue?: string;
    defaultInputValue?: string;
    onInputValueChange?: BaseAutocomplete.Root.Props<Value>['onValueChange'];
    placeholder?: string;
    emptyLabel?: ReactNode | ((query: string) => ReactNode);
    loadingLabel?: ReactNode | ((query: string) => ReactNode);
    errorLabel?: ReactNode | ((error: unknown, query: string) => ReactNode);
    minQueryLength?: number;
    slotProps?: SlotProps;
    startAdornment?: ReactNode;
    itemComponent?: (item: Value) => ReactNode;
    itemDisabled?: (item: Value) => boolean;
    onAdornmentClick?: () => void;
    onItemSelect?: (item: Value, event: MouseEvent<HTMLDivElement>) => void;
    onPaste?: ClipboardEventHandler<HTMLElement>;
    onInputKeyDownCapture?: KeyboardEventHandler<HTMLInputElement>;
    onInputKeyDown?: KeyboardEventHandler<HTMLInputElement>;
    onInputFocus?: FocusEventHandler<HTMLInputElement>;
    onInputBlur?: FocusEventHandler<HTMLInputElement>;
    name?: string;
    testId?: string;
} & Omit<
    BaseAutocomplete.Root.Props<Value>,
    'children' | 'items' | 'value' | 'defaultValue' | 'onValueChange'
>;

const isValueLabelPair = (item: unknown): item is ValueLabelPair =>
    isPlainObject(item) &&
    typeof item === 'object' &&
    item !== null &&
    'value' in item &&
    'label' in item;

const isAbortError = (error: unknown) =>
    error instanceof DOMException && error.name === 'AbortError';

export const AutoComplete = <Value,>({
    items = [],
    async: asyncMode = false,
    loadItems,
    placeholder = '',
    emptyLabel = 'No results found',
    loadingLabel = 'Loading...',
    errorLabel = 'Failed to load options',
    minQueryLength = 0,
    slotProps,
    startAdornment,
    itemComponent,
    itemDisabled,
    onAdornmentClick,
    onItemSelect,
    onPaste,
    onInputKeyDownCapture,
    onInputKeyDown,
    onInputFocus,
    onInputBlur,
    name,
    testId,
    value,
    defaultValue = null,
    onValueChange,
    inputValue: inputValueProp,
    defaultInputValue,
    onInputValueChange,
    disabled,
    itemToStringValue,
    filter,
    ...props
}: AutoCompleteProps<Value>) => {
    const id = useId();
    const inputRef = useRef<HTMLInputElement | null>(null);
    const requestIdRef = useRef(0);
    const controlledValueRef = useRef<Value | null | undefined>(value);
    const testIds = createTestIdBuilder('AutoComplete', { name, testId });
    const isValueControlled = value !== undefined;
    const isInputControlled = inputValueProp !== undefined;
    const getItemValue = useCallback((item: Value): Primitive => {
        if (isValueLabelPair(item)) {
            return item.value as Primitive;
        }

        if (itemToStringValue) {
            return itemToStringValue(item);
        }

        if (isPlainObject(item)) {
            return JSON.stringify(item);
        }

        return item as Primitive;
    }, [itemToStringValue]);

    const getItemLabel = useCallback((item: Value): ReactNode => {
        if (isValueLabelPair(item)) {
            return item.label;
        }

        if (itemToStringValue) {
            return itemToStringValue(item);
        }

        if (isPlainObject(item)) {
            return JSON.stringify(item);
        }

        return item as ReactNode;
    }, [itemToStringValue]);

    const getItemLabelText = useCallback((item: Value) => {
        const label = getItemLabel(item);

        return typeof label === 'string' || typeof label === 'number'
            ? String(label)
            : String(getItemValue(item));
    }, [getItemLabel, getItemValue]);

    const initialSelectedValue = value !== undefined ? value : defaultValue;
    const [uncontrolledValue, setUncontrolledValue] = useState<Value | null>(defaultValue);
    const [inputValue, setInputValue] = useState(() => {
        if (inputValueProp !== undefined) {
            return inputValueProp;
        }

        if (defaultInputValue !== undefined) {
            return defaultInputValue;
        }

        return initialSelectedValue == null ? '' : getItemLabelText(initialSelectedValue);
    });
    const [asyncItems, setAsyncItems] = useState<readonly Value[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<unknown>(null);
    const selectedValue = isValueControlled ? value ?? null : uncontrolledValue;
    const isAsyncEnabled = asyncMode && Boolean(loadItems);
    const renderedItems = isAsyncEnabled ? asyncItems : items;

    useEffect(() => {
        if (inputValueProp !== undefined) {
            setInputValue(inputValueProp);
        }
    }, [inputValueProp]);

    useEffect(() => {
        if (!isValueControlled || value === controlledValueRef.current) {
            return;
        }

        controlledValueRef.current = value;
        if (!isInputControlled) {
            setInputValue(value == null ? '' : getItemLabelText(value));
        }
    }, [getItemLabelText, isInputControlled, isValueControlled, value]);

    useEffect(() => {
        if (!isAsyncEnabled || !loadItems) {
            requestIdRef.current += 1;
            setAsyncItems((currentItems) => currentItems.length === 0 ? currentItems : []);
            setError(null);
            setIsLoading(false);
            return;
        }

        if (inputValue.length < minQueryLength) {
            requestIdRef.current += 1;
            setAsyncItems([]);
            setError(null);
            setIsLoading(false);
            return;
        }

        const controller = new AbortController();
        const requestId = requestIdRef.current + 1;
        requestIdRef.current = requestId;

        setIsLoading(true);
        setError(null);

        Promise.resolve(loadItems(inputValue, { signal: controller.signal }))
            .then((nextItems) => {
                if (controller.signal.aborted || requestId !== requestIdRef.current) {
                    return;
                }

                setAsyncItems(nextItems);
            })
            .catch((nextError: unknown) => {
                if (controller.signal.aborted || isAbortError(nextError) || requestId !== requestIdRef.current) {
                    return;
                }

                setAsyncItems([]);
                setError(nextError);
            })
            .finally(() => {
                if (!controller.signal.aborted && requestId === requestIdRef.current) {
                    setIsLoading(false);
                }
            });

        return () => {
            controller.abort();
        };
    }, [inputValue, isAsyncEnabled, loadItems, minQueryLength]);

    const getItemDisabled = useCallback((item: Value) => {
        if (itemDisabled) {
            return itemDisabled(item);
        }

        return isValueLabelPair(item) ? Boolean(item.disabled) : false;
    }, [itemDisabled]);

    const getAsyncStatus = () => {
        if (isLoading) {
            return (
                <>
                    <span className={clsx(styles.Spinner, slotProps?.classes?.Spinner)} aria-hidden />
                    {typeof loadingLabel === 'function' ? loadingLabel(inputValue) : loadingLabel}
                </>
            );
        }

        if (error) {
            return typeof errorLabel === 'function' ? errorLabel(error, inputValue) : errorLabel;
        }

        return null;
    };

    const getEmptyLabel = () => {
        if (isLoading || error) {
            return null;
        }

        return typeof emptyLabel === 'function' ? emptyLabel(inputValue) : emptyLabel;
    };

    const focusInput = () => {
        inputRef.current?.focus();
    };

    const handleAdornmentClick = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        event.stopPropagation();
        onAdornmentClick?.();
    };

    const setSelectedValue = (nextValue: Value | null) => {
        if (!isValueControlled) {
            setUncontrolledValue(nextValue);
        }

        onValueChange?.(nextValue);
    };

    const handleInputValueChange: NonNullable<BaseAutocomplete.Root.Props<Value>['onValueChange']> = (
        nextValue,
        eventDetails,
    ) => {
        setInputValue(nextValue);
        onInputValueChange?.(nextValue, eventDetails);

        if (eventDetails.reason === 'clear-press' || eventDetails.reason === 'input-clear') {
            setSelectedValue(null);
        } else if (eventDetails.reason === 'input-change' && !isValueControlled && selectedValue !== null) {
            setSelectedValue(null);
        }
    };

    const status = isAsyncEnabled ? getAsyncStatus() : null;
    const resolvedFilter = filter === undefined && isAsyncEnabled ? null : filter;
    const inputProps = slotProps?.inputProps;
    const shouldControlRootValue = isAsyncEnabled || isInputControlled || isValueControlled;
    const valueProps = shouldControlRootValue
        ? { value: inputValue }
        : { defaultValue: inputValue };
    const handleInputChange: NonNullable<ComponentPropsWithoutRef<typeof BaseAutocomplete.Input>['onChange']> = (event) => {
        setInputValue(event.currentTarget.value);
        inputProps?.onChange?.(event);
    };

    const handleItemSelect = (item: Value, event: MouseEvent<HTMLDivElement>) => {
        setSelectedValue(item);
        setInputValue(getItemLabelText(item));
        onItemSelect?.(item, event);
    };

    return (
        <BaseAutocomplete.Root
            {...props}
            {...valueProps}
            name={name}
            disabled={disabled}
            items={renderedItems}
            onValueChange={handleInputValueChange}
            itemToStringValue={getItemLabelText}
            filter={resolvedFilter}>
            <div
                className={clsx(styles.Container, slotProps?.classes?.Container)}
                data-testid={testIds.self()}
                data-disabled={disabled}>
                <div
                    data-testid={testIds.part('InputWrapper')}
                    className={clsx(styles.InputWrapper, slotProps?.classes?.InputGroup, slotProps?.classes?.InputWrapper)}
                    onClick={focusInput}
                    onPasteCapture={onPaste}>
                    <BaseAutocomplete.Input
                        {...inputProps}
                        ref={inputRef}
                        data-testid={testIds.part('Input')}
                        placeholder={placeholder}
                        id={id}
                        onChange={handleInputChange}
                        onKeyDownCapture={onInputKeyDownCapture ?? inputProps?.onKeyDownCapture}
                        onKeyDown={onInputKeyDown ?? inputProps?.onKeyDown}
                        onFocus={onInputFocus ?? inputProps?.onFocus}
                        onBlur={onInputBlur ?? inputProps?.onBlur}
                        className={clsx(styles.Input, slotProps?.classes?.Input)}
                    />
                    <div
                        data-testid={testIds.part('ActionButtons')}
                        className={clsx(styles.ActionButtons, slotProps?.classes?.ActionButtons)}>
                        {startAdornment && (
                            <Button
                                data-testid={testIds.part('StartAdornment')}
                                data-disabled={disabled}
                                disabled={disabled}
                                className={clsx(styles.StartAdornment, slotProps?.classes?.StartAdornment)}
                                onClick={handleAdornmentClick}>
                                {startAdornment}
                            </Button>
                        )}
                        {!slotProps?.disable?.clear && (
                            <BaseAutocomplete.Clear
                                {...slotProps?.clearProps}
                                data-testid={testIds.part('Clear')}
                                className={clsx(styles.Clear, slotProps?.classes?.Clear)}
                                aria-label="Clear">
                                <X className={clsx(styles.ClearIcon, slotProps?.classes?.ClearIcon)} />
                            </BaseAutocomplete.Clear>
                        )}
                        {!slotProps?.disable?.trigger && (
                            <BaseAutocomplete.Trigger
                                {...slotProps?.triggerProps}
                                data-testid={testIds.part('Trigger')}
                                className={clsx(styles.Trigger, slotProps?.classes?.Trigger)}
                                aria-label="Open popup">
                                <ChevronDown className={clsx(styles.TriggerIcon, slotProps?.classes?.TriggerIcon)} />
                            </BaseAutocomplete.Trigger>
                        )}
                    </div>
                </div>
            </div>

            <BaseAutocomplete.Portal>
                <BaseAutocomplete.Positioner
                    {...slotProps?.positionerProps}
                    data-testid={testIds.part('Positioner')}
                    className={clsx(styles.Positioner, slotProps?.classes?.Positioner)}
                    sideOffset={4}>
                    <BaseAutocomplete.Popup
                        {...slotProps?.popupProps}
                        data-testid={testIds.part('Popup')}
                        className={clsx(styles.Popup, slotProps?.classes?.Popup)}
                        aria-busy={(isAsyncEnabled && isLoading) || undefined}>
                        <div className={clsx(styles.Viewport, slotProps?.classes?.Viewport)}>
                            {!slotProps?.disable?.status && (
                                <BaseAutocomplete.Status
                                    data-testid={testIds.part('Status')}
                                    className={clsx(styles.Status, slotProps?.classes?.Status)}>
                                    {status}
                                </BaseAutocomplete.Status>
                            )}
                            {!slotProps?.disable?.emptyLabel && (
                                <BaseAutocomplete.Empty
                                    data-testid={testIds.part('Empty')}
                                    className={clsx(styles.Empty, slotProps?.classes?.Empty)}>
                                    {getEmptyLabel()}
                                </BaseAutocomplete.Empty>
                            )}
                            <BaseAutocomplete.List
                                data-testid={testIds.part('List')}
                                className={clsx(styles.List, slotProps?.classes?.List)}>
                                {(item: Value, index) => (
                                    <BaseAutocomplete.Item
                                        key={`${String(getItemValue(item))}-${index}`}
                                        data-testid={testIds.part('Item', getItemValue(item))}
                                        value={item}
                                        disabled={getItemDisabled(item)}
                                        index={index}
                                        className={clsx(styles.Item, slotProps?.classes?.Item)}
                                        onClick={(event) => handleItemSelect(item, event)}>
                                        <div className={clsx(styles.ItemText, slotProps?.classes?.ItemText)}>
                                            {itemComponent ? itemComponent(item) : getItemLabel(item)}
                                        </div>
                                    </BaseAutocomplete.Item>
                                )}
                            </BaseAutocomplete.List>
                        </div>
                    </BaseAutocomplete.Popup>
                </BaseAutocomplete.Positioner>
            </BaseAutocomplete.Portal>
        </BaseAutocomplete.Root>
    );
};

export default AutoComplete;
