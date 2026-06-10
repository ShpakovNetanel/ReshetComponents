import type { Table } from '@tanstack/react-table'
import TablePrimitive from '../TablePrimitive'
import styles from './Empty.module.scss'

export interface EmptyProps<TData> {
  table: Table<TData>
  numberOfColumns: number
}

export function Empty<TData>({ table, numberOfColumns }: EmptyProps<TData>) {
  return (
    <TablePrimitive.TableRow>
      <TablePrimitive.TableCell
        colSpan={table.getHeaderGroups()[0]?.headers.length ?? numberOfColumns}
        className={styles.NoResultsCell}
      >
        No results.
      </TablePrimitive.TableCell>
    </TablePrimitive.TableRow>
  )
}
