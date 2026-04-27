import { Plus } from "lucide-react";
import { useState, type KeyboardEvent } from "react";
import { Combobox } from '../baseComponents/Combobox/Combobox';
import { MaterialSearchItem } from "./MaterailSearchItem/MaterialSearchItem";
import styles from './MaterialSearch.module.scss';
import { MaterialSearchLabel } from "./MaterialSearchLabel/MaterialSearchLabel";
import type { Material } from "./types";

type MaterialSearchProps = {
    materials: Material[];
    value?: Material[];
    defaultValue?: Material[];
    disabled?: boolean;
    limit?: number;
    placeholder?: string;
    emptyLabel?: string;
    onValueChange?: (materials: Material[]) => void;
    onAddMaterials?: (materials: Material[]) => void;
    name?: string;
    testId?: string;
}

export const MaterialSearch = ({
    materials,
    value,
    defaultValue = [],
    disabled = false,
    limit = 10,
    placeholder = 'בחירת מק״ט...',
    emptyLabel = 'אין מק״טים להצגה',
    onValueChange,
    onAddMaterials,
    name = 'material-search-combobox',
    testId,
}: MaterialSearchProps) => {
    const [filter, setFilter] = useState('');
    const [comboboxToggle, setComboboxToggle] = useState(false);
    const [internalValue, setInternalValue] = useState<Material[]>(defaultValue);
    const selectedMaterials = value ?? internalValue;

    const visibleMaterials = filter.trim()
        ? materials.filter(material => {
            const normalizedFilter = filter.trim().toLowerCase();
            return [
                material.id,
                material.category,
                material.nickname,
                material.description,
            ].some(field => field?.toLowerCase().includes(normalizedFilter));
        })
        : materials;

    const updateSelectedMaterials = (nextValue: Material[]) => {
        if (value === undefined) {
            setInternalValue(nextValue);
        }

        onValueChange?.(nextValue);
    };

    const closeCombobox = () => {
        setComboboxToggle(false);
    };

    const handleOpenChange = (open: boolean) => {
        setComboboxToggle(open);
    };

    const addMaterials = () => {
        if (disabled || selectedMaterials.length === 0) {
            return;
        }

        closeCombobox();
        onAddMaterials?.(selectedMaterials);
    }

    const handleInputKeyDownCapture = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && selectedMaterials.length > 0) {
            event.preventDefault();
            event.stopPropagation();
            addMaterials();
        }
    };

    const handleSelectedMaterialsChange = (
        value: Material[],
        eventDetails: { reason: string; event: Event; cancel: () => void }
    ) => {
        const isEnterItemPress = eventDetails.reason === 'item-press'
            && eventDetails.event instanceof globalThis.KeyboardEvent
            && eventDetails.event.key === 'Enter';

        if (isEnterItemPress) {
            eventDetails.cancel();
            return;
        }

        updateSelectedMaterials(value);
    };

    return (
        <div className={styles.Combobox}
            data-testid="material-search">
            <Combobox
                name={name}
                testId={testId}
                open={comboboxToggle}
                disabled={disabled}
                onOpenChange={handleOpenChange}
                value={selectedMaterials}
                onValueChange={handleSelectedMaterialsChange}
                isItemEqualToValue={(item, selectedItem) => item.id === selectedItem.id}
                items={visibleMaterials}
                onInputValueChange={setFilter}
                inputValue={filter}
                multiple
                limit={limit}
                startAdornment={<Plus className={styles.Plus}
                    data-disabled={disabled} />}
                onAdormentClick={addMaterials}
                onInputKeyDownCapture={handleInputKeyDownCapture}
                onPaste={(event) => {
                    const pastedValue = event.clipboardData.getData('text');
                    const pastedIds = pastedValue
                        .split(/[\s,]+/)
                        .map((value) => value.trim())
                        .filter((value) => value !== '');
                    const nextMaterials = materials.filter(material => pastedIds.includes(material.id));

                    updateSelectedMaterials(nextMaterials);
                    setFilter('');
                }}
                slotProps={{
                    classes: {
                        Checkbox: styles.Checkbox,
                        Container: styles.Container,
                        Chips: styles.Chips,
                        Input: styles.Input,
                        Trigger: styles.Trigger,
                        TriggerIcon: styles.TriggerIcon,
                        Popup: styles.Popup,
                        Item: styles.Item,
                        StartAdornment: styles.StartAdornment
                    },
                    disable: {
                        checkIndicator: true,
                        separator: true
                    }
                }}
                placeholder={placeholder}
                emptyLabel={emptyLabel}
                itemComponent={(item: Material) => <MaterialSearchItem item={item} />}
                valueNode={(materials: Material[] | Material) => <MaterialSearchLabel materials={materials} />}
            />
        </div>
    )
}
