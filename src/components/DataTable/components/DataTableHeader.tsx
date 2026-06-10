import { flexRender, type Table } from '@tanstack/react-table'
import { Fragment } from 'react'
import { ColumnHeader } from './ColumnHeader'
import TablePrimitive from '../TablePrimitive'
import styles from './DataTableHeader.module.scss'
import Input from '../../Input/Input'

export interface DataTableHeaderProps<TData> {
  table: Table<TData>
  enableVirtualization?: boolean
  showColumnFilters?: boolean
}

export function DataTableHeader<TData>({
  table,
  enableVirtualization,
  showColumnFilters,
}: DataTableHeaderProps<TData>) {
  return (
    <TablePrimitive.TableHeader
      className={styles.TableHeader}
      data-virtualized={enableVirtualization}
    >
      {table.getHeaderGroups().map((headerGroup) => (
        <Fragment key={headerGroup.id}>
        <TablePrimitive.TableRow
          className={styles.TableRow}
          data-virtualized={enableVirtualization}
        >
          {headerGroup.headers.map((header) => (
            <TablePrimitive.TableHead
              key={header.id}
              className={styles.TableHead}
              data-column-id={header.column.id}
              data-virtualized={enableVirtualization}
              style={{
                flex: enableVirtualization
                  ? `var(--header-${header?.id}-size)`
                  : undefined,
                width: !enableVirtualization ? header.getSize() : undefined,
              }}
            >
              {header.isPlaceholder ? null : (
                <ColumnHeader column={header.column}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </ColumnHeader>
              )}
            </TablePrimitive.TableHead>
          ))}
        </TablePrimitive.TableRow>
        {showColumnFilters && (
          <TablePrimitive.TableRow
            className={styles.FilterRow}
            data-virtualized={enableVirtualization}
          >
            {headerGroup.headers.map((header) => (
              <TablePrimitive.TableHead
                key={`${header.id}-filter`}
                className={styles.FilterHead}
                data-column-id={header.column.id}
                data-virtualized={enableVirtualization}
                style={{
                  flex: enableVirtualization
                    ? `var(--header-${header?.id}-size)`
                    : undefined,
                  width: !enableVirtualization ? header.getSize() : undefined,
                }}
              >
                {header.column.getCanFilter() ? (
                  <Input
                    aria-label={`Filter ${header.column.id}`}
                    className={styles.FilterInput}
                    value={String(header.column.getFilterValue() ?? '')}
                    onChange={(event) =>
                      header.column.setFilterValue(event.target.value)
                    }
                  />
                ) : null}
              </TablePrimitive.TableHead>
            ))}
          </TablePrimitive.TableRow>
        )}
        </Fragment>
      ))}
    </TablePrimitive.TableHeader>
  )
}
