import { Checkbox } from '@base-ui/react'
import type { ColumnDef } from '@tanstack/react-table'
import { Check } from 'lucide-react'
import styles from './selectColumnDef.module.scss'

export const selectColumn: ColumnDef<unknown> = {
  id: 'select',
  header: ({ table }) => (
    <Checkbox.Root
      className={styles.CheckboxRoot}
      checked={table.getIsAllPageRowsSelected()}
      indeterminate={table.getIsSomeRowsSelected()}
      onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      aria-label='Select all'
    >
      <Checkbox.Indicator>
        <Check size='0.75rem' />
      </Checkbox.Indicator>
    </Checkbox.Root>
  ),
  cell: ({ row }) => (
    <Checkbox.Root
      className={styles.CheckboxRoot}
      checked={row.getIsSelected()}
      onCheckedChange={(value) => row.toggleSelected(!!value)}
      aria-label='Select row'
    >
      <Checkbox.Indicator>
        <Check size='0.75rem' />
      </Checkbox.Indicator>
    </Checkbox.Root>
  ),
  size: 10,
  minSize: 10,
} as const
