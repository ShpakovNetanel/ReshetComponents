import { Combobox as BaseCombobox, Separator as BaseSeparator } from "@base-ui/react"
import clsx from "clsx"
import { Check, ChevronDown, X } from "lucide-react"
import { useId, useRef, type MouseEvent, type ReactNode } from "react"
import type { ClassNames } from "../../types/baseui"
import { buildTestId } from "../../utils/testIds"
import styles from './Combobox.module.scss'
import { isEmptyish, isPlainObject } from "remeda"

export type Primitive = string | number;
export type ValueLabelPair = { value: any; label: string };

type Disable = {
	emptyLabel?: boolean;
	checkIndicator?: boolean;
	trigger?: boolean;
	clearable?: boolean;
	separator?: boolean;
}

type SlotProps = {
	classes?: ClassNames<typeof BaseCombobox, 'Checkbox' | 'Container' | 'ItemIndicatorIcon' | 'InputWrapper'
		| 'ActionButtons' | 'StartAdornment' | 'TriggerIcon'>;
	disable?: Disable;
}

type ComboboxProps<Value, Multiple extends boolean | undefined = false> = {
	items: Value[];
	placeholder: string;
	emptyLabel: string;
	slotProps?: SlotProps;
	startAdornment?: ReactNode;
	itemComponent?: (item: Value) => ReactNode;
	valueNode?: (values: Value[] | Value) => ReactNode;
	onAdormentClick?: () => void
	onPaste?: React.ClipboardEventHandler<HTMLElement>
	onInputKeyDownCapture?: React.KeyboardEventHandler<HTMLInputElement>;
	onInputKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
	onInputFocus?: React.FocusEventHandler<HTMLInputElement>;
	onInputBlur?: React.FocusEventHandler<HTMLInputElement>;
	itemSelectedNoIndicatorClassName?: string;
	testId?: string;

} & BaseCombobox.Root.Props<Value, Multiple>;

function isValueLabelPair(item: unknown):
	item is ValueLabelPair {
	return isPlainObject(item) &&
		typeof item === 'object' &&
		item !== null &&
		'value' in item &&
		'label' in item
}

export const Combobox = <Value, Multiple extends boolean | undefined = false>({
	items,
	placeholder = '',
	emptyLabel,
	itemComponent,
	startAdornment,
	slotProps,
	valueNode,
	onAdormentClick,
	onPaste,
	onInputKeyDownCapture,
	onInputKeyDown,
	onInputFocus,
	onInputBlur,
	itemSelectedNoIndicatorClassName,
	testId,
	disabled,
	...props
}: ComboboxProps<Value, Multiple>) => {
	const id = useId();
	const inputRef = useRef<HTMLInputElement | null>(null);
	const containerRef = useRef<HTMLDivElement | null>(null);
	const hasSingleValue = !props.multiple && props.value != null;
	const isIndicatorEnabled = !slotProps?.disable?.checkIndicator;

	const focusInput = () => {
		inputRef.current?.focus();
	};

	const handleAdornmentClick = (event: MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		event.stopPropagation();
		onAdormentClick?.();
	};

	const getItemValue = (item: Value) => {
		if (isPlainObject(item)) {
			if (isValueLabelPair(item)) {
				return item.value as Primitive
			}

			if (props.itemToStringValue) {
				return props.itemToStringValue(item)
			}

			return JSON.stringify(item)
		}

		return item as Primitive
	}

	const getItemLabel = (item: Value) => {
		if (isPlainObject(item)) {
			if (isValueLabelPair(item)) {
				return item.label as Primitive
			}

			if (props.itemToStringLabel) {
				return props.itemToStringLabel(item)
			}

			return JSON.stringify(item)
		}

		return item as Primitive
	}

	return (
		<BaseCombobox.Root items={items} {...props} disabled={disabled}>
			<div className={clsx(styles.Container, slotProps?.classes?.Container)}
				data-testid={buildTestId(testId, 'container')}
				data-disabled={disabled}>
				{props.multiple
					?
					<BaseCombobox.Chips
						data-testid={buildTestId(testId, 'chips')}
						className={clsx(styles.Chips, slotProps?.classes?.Chips)}
						ref={containerRef}
						onClick={focusInput}
						onPasteCapture={onPaste}>
						{startAdornment &&
							<button type="button"
								data-testid={buildTestId(testId, 'start-adornment')}
								data-disabled={disabled}
								className={clsx(styles.StartAdornment, slotProps?.classes?.StartAdornment)}
								onClick={handleAdornmentClick}>
								{startAdornment}
							</button>}
						<BaseCombobox.Value>
							{(values: Value[]) =>
								<>
									{valueNode
										? valueNode(values)
										: values.map((value) => (
											<BaseCombobox.Chip
												key={getItemValue(value)}
												data-testid={buildTestId(testId, 'chip', getItemValue(value))}
												className={styles.Chip}
											>
												{getItemValue(value)}
												<BaseCombobox.ChipRemove data-testid={buildTestId(testId, 'chip-remove', getItemValue(value))} className={styles.ChipRemove} aria-label="Remove">
													<X />
												</BaseCombobox.ChipRemove>
											</BaseCombobox.Chip>
										))}

									<BaseCombobox.Input
										ref={inputRef}
										data-testid={buildTestId(testId, 'input')}
										placeholder={isEmptyish(values) ? placeholder : ''}
										id={id}
										onKeyDownCapture={onInputKeyDownCapture}
										onKeyDown={onInputKeyDown}
										onFocus={onInputFocus}
										onBlur={onInputBlur}
										className={clsx(styles.Input, slotProps?.classes?.Input)} />
								</>
							}
						</BaseCombobox.Value>
						{!slotProps?.disable?.trigger &&
							<BaseCombobox.Trigger data-testid={buildTestId(testId, 'trigger')} className={clsx(styles.Trigger, slotProps?.classes?.Trigger)}>
								<ChevronDown className={clsx(styles.TriggerIcon, slotProps?.classes?.TriggerIcon)} />
							</BaseCombobox.Trigger>}
					</BaseCombobox.Chips>
					:
					<div
						data-testid={buildTestId(testId, 'input-wrapper')}
						className={clsx(styles.InputWrapper, slotProps?.classes?.InputWrapper)}
						onClick={focusInput}
						onPasteCapture={onPaste}>
						<BaseCombobox.Input
							ref={inputRef}
							data-testid={buildTestId(testId, 'input')}
							placeholder={placeholder}
							id={id}
							onKeyDownCapture={onInputKeyDownCapture}
							onKeyDown={onInputKeyDown}
							onFocus={onInputFocus}
							onBlur={onInputBlur}
							className={clsx(styles.Input, slotProps?.classes?.Input)} />
						<div data-testid={buildTestId(testId, 'action-buttons')} className={clsx(styles.ActionButtons, slotProps?.classes?.ActionButtons)}>
							{startAdornment && <button type="button" data-testid={buildTestId(testId, 'start-adornment')} className={clsx(styles.StartAdornment, slotProps?.classes?.StartAdornment)} onClick={handleAdornmentClick}>
								{startAdornment}
							</button>}
							{!slotProps?.disable?.trigger &&
								<BaseCombobox.Trigger
									data-testid={buildTestId(testId, 'trigger')}
									className={clsx(styles.Trigger, slotProps?.classes?.Trigger)}
									data-selected={hasSingleValue}
									aria-label="Open popup">
									<ChevronDown className={clsx(styles.TriggerIcon, slotProps?.classes?.TriggerIcon)} />
								</BaseCombobox.Trigger>}
						</div>
					</div>
				}
			</div>
			<BaseCombobox.Portal>
				<BaseCombobox.Positioner
					data-testid={buildTestId(testId, 'positioner')}
					className={clsx(styles.Positioner, slotProps?.classes?.Positioner)}
					sideOffset={4}
					anchor={containerRef}>
					<BaseCombobox.Popup data-testid={buildTestId(testId, 'popup')} 
					className={clsx(styles.Popup, slotProps?.classes?.Popup)}>
						{!slotProps?.disable?.emptyLabel &&
							<BaseCombobox.Empty data-testid={buildTestId(testId, 'empty')} className={clsx(styles.Empty, slotProps?.classes?.Empty)}>
								{emptyLabel}
							</BaseCombobox.Empty>}
						<BaseCombobox.List data-testid={buildTestId(testId, 'list')} className={clsx(styles.List, slotProps?.classes?.List)}>
							{(item: Value, index) => (
								<BaseCombobox.Item
									key={index}
									data-testid={buildTestId(testId, 'item', getItemValue(item))}
									value={item}
									data-has-indicator={isIndicatorEnabled}
									className={clsx(
										styles.Item,
										slotProps?.classes?.Item,
										!isIndicatorEnabled && styles.ItemNoIndicator,
										!isIndicatorEnabled && itemSelectedNoIndicatorClassName
									)}>
									{isIndicatorEnabled &&
										<BaseCombobox.ItemIndicator
											data-testid={buildTestId(testId, 'item-indicator', getItemValue(item))}
											className={clsx(styles.ItemIndicator, slotProps?.classes?.ItemIndicator)}>
											<Check className={clsx(styles.ItemIndicatorIcon, slotProps?.classes?.ItemIndicatorIcon)} />
										</BaseCombobox.ItemIndicator>}
									{itemComponent
										? <div className={styles.ItemText}>{itemComponent(item)}</div>
										: <div className={styles.ItemText}>{getItemLabel(item)}</div>}
									{index < items.length - 1 && !slotProps?.disable?.separator &&
										<BaseSeparator orientation="horizontal"
											className={styles.Separator} />}
								</BaseCombobox.Item>
							)}
						</BaseCombobox.List>
					</BaseCombobox.Popup>
				</BaseCombobox.Positioner>
			</BaseCombobox.Portal>
		</BaseCombobox.Root >
	)
}
