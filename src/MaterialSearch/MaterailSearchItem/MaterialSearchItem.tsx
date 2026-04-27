import { Bookmark } from "lucide-react";
import { useState, type CSSProperties, type MouseEvent, type PointerEvent } from "react";
import { Chip } from '../../baseComponents/Chip/Chip';
import { Typography } from '../../baseComponents/Typography/Typography';
import type { Material } from "../types";
import { buildTestId } from "../../utils/testIds";
import styles from './MaterialSearchItem.module.scss';

type MaterialSearchItemProps = {
    item: Material;
}

const stringToHslColor = (value: string) => {
    let hash = 0;

    for (let index = 0; index < value.length; index += 1) {
        hash = value.charCodeAt(index) + ((hash << 5) - hash);
    }

    return `hsl(${Math.abs(hash) % 360} 70% 42%)`;
};

export const MaterialSearchItem = ({ item }: MaterialSearchItemProps) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isFavorite, setIsFavorite] = useState(Boolean(item.favorite));

    const showFavoriteIcon = isHovered || isFavorite;

    const handleFavoriteClick = (e: MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        setIsFavorite((favorite) => !favorite);
    };

    const stopItemSelection = (e: PointerEvent<HTMLButtonElement> | MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
    };

    return (
        <div className={styles.Item} data-testid={buildTestId('material-search-item', item.id)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}>
            <div className={styles.Material} data-testid={buildTestId('material-search-item-material', item.id)}>
                <div className={styles.MaterialTexts} data-testid={buildTestId('material-search-item-texts', item.id)}>
                    <div className={styles.A}
                        style={{
                            '--category-color': stringToHslColor(item.category)
                        } as CSSProperties}>
                        <Typography className={styles.MaterialTitle} name={buildTestId('material-search-item-id', item.id)}>
                            {item.id}
                        </Typography>
                        <Chip name={buildTestId('material-search-item-category', item.id)}
                            label={item.category} slotProps={{
                                classes: {
                                    Label: styles.Label
                                }
                            }} />
                    </div>
                    <Typography className={styles.MaterialTitle} name={buildTestId('material-search-item-nickname', item.id)}>
                        {item.nickname ?? item.id}
                    </Typography>
                    <Typography className={styles.MaterialDescription} name={buildTestId('material-search-item-description', item.id)}>
                        {item.description}
                    </Typography>
                </div>
            </div>
            {showFavoriteIcon &&
                <button
                    type="button"
                    data-testid={buildTestId('material-search-item-favorite-toggle', item.id)}
                    className={styles.Button}
                    aria-pressed={isFavorite}
                    onClick={handleFavoriteClick}
                    onPointerDown={stopItemSelection}
                    onMouseDown={stopItemSelection}>
                    {isFavorite
                        ? <Bookmark className={styles.Icon} data-filled />
                        : <Bookmark className={styles.Icon} />}
                </button>}
        </div>
    )
}
