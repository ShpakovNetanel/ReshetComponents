import { Combobox as BaseCombobox } from "@base-ui/react";
import type { Material } from "../types";
import styles from './MaterialSearchLabel.module.scss';
import { isEmptyish } from "remeda";
import { buildTestId } from "../../utils/testIds";

type MaterialSearchLabelProps = {
    materials: Material[] | Material;
}

export const MaterialSearchLabel = ({ materials }: MaterialSearchLabelProps) => {
    const selectedMaterials = Array.isArray(materials) ? materials : [materials];

    return !isEmptyish(selectedMaterials)
        ? <BaseCombobox.Chip data-testid="material-search-label-chip" className={styles.Chip}>
            <span
                className={styles.ChipText}
                data-testid={buildTestId('material-search-label-chip-text', selectedMaterials.length > 1 ? 'multiple' : selectedMaterials[0].id)}>
                {selectedMaterials.length > 1
                    ? `נבחרו ${selectedMaterials.length} מק״טים`
                    : `${selectedMaterials[0].id} - ${selectedMaterials[0].description}`}
            </span>
        </BaseCombobox.Chip>
        : null
}
