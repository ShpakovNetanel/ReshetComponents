import type { ColumnDef } from '@tanstack/react-table'
import { ChevronRight } from 'lucide-react'
import styles from './expandColumnDef.module.scss'
import clsx from 'clsx'
import { Button } from '../../Button/Button'

export const expandColumnDef: ColumnDef<unknown> = {
  id: 'expand',
  header: () => null,
  cell: ({ row }) => {
    return row.getCanExpand() ? (
      <Button
        className={styles.ExpandButton}
        onClick={row.getToggleExpandedHandler()}
      >
        <ChevronRight
          className={clsx(styles.Chevron)}
          data-expanded={row.getIsExpanded()}
        />
      </Button>
    ) : null
  },
  minSize: 1,
  size: 1,
  maxSize: 1,
}
