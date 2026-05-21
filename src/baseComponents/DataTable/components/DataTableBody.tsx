import { type Table } from '@tanstack/react-table'
import TablePrimitive from '../TablePrimitive'
import styles from './DataTableBody.module.scss'
import { LoadingRow } from './LoadingRow'
import { Empty } from './Empty'
import { DataTableRow } from './DataTableRow'
import type { RenderDetailPanel } from '../types'
import type { Virtualizer } from '@tanstack/react-virtual'

export interface DataTableBodyProps<TData> {
  table: Table<TData>
  numberOfColumns: number
  rowVirtualizer: Virtualizer<HTMLDivElement, Element>
  isLoading?: boolean
  enableVirtualization?: boolean
  renderDetailPanel?: RenderDetailPanel<TData>
  loadingRowsCount: number
}

export function DataTableBody<TData>({
  table,
  numberOfColumns,
  isLoading,
  enableVirtualization,
  rowVirtualizer,
  renderDetailPanel,
  loadingRowsCount,
}: DataTableBodyProps<TData>) {
  const { rows } = table.getRowModel()
  const virtualItems = rowVirtualizer.getVirtualItems()

  return (
    <TablePrimitive.TableBody
      className={styles.TableBody}
      data-virtualized={enableVirtualization}
      style={{
        height: enableVirtualization
          ? `${rowVirtualizer.getTotalSize()}px`
          : undefined,
      }}
    >
      {isLoading ? (
        Array.from({ length: loadingRowsCount }).map((_, index) => (
          <LoadingRow
            key={`skeleton-${index}`}
            table={table}
            index={index}
            enableVirtualization={enableVirtualization}
            rowVirtualizer={rowVirtualizer}
          />
        ))
      ) : rows?.length ? (
        enableVirtualization ? (
          virtualItems.map((virtualRow) => {
            if (renderDetailPanel && virtualRow.index % 2 === 1) {
              return null
            }

            const staticIndex = renderDetailPanel
              ? virtualRow.index / 2
              : virtualRow.index

            return (
              <DataTableRow
                key={virtualRow.key}
                table={table}
                row={rows[staticIndex]}
                renderDetailPanel={renderDetailPanel}
                enableVirtualization
                rowVirtualizer={rowVirtualizer}
                virtualRow={virtualRow}
              />
            )
          })
        ) : (
          rows.map((row) => (
            <DataTableRow
              key={row.id}
              table={table}
              row={row}
              renderDetailPanel={renderDetailPanel}
            />
          ))
        )
      ) : (
        <Empty
          table={table}
          numberOfColumns={numberOfColumns}
        />
      )}
    </TablePrimitive.TableBody>
  )
}
