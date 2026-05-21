import { type Table } from "@tanstack/react-table";
import TablePrimitive from "../TablePrimitive";
import { Skeleton } from "../../Skeleton/Skeleton";
import styles from "./LoadingRow.module.scss";
import type { VirtualItem, Virtualizer } from "@tanstack/react-virtual";

export interface LoadingRowProps<TData> {
  table: Table<TData>;
  index: number;
  enableVirtualization?: boolean;
  virtualRow?: VirtualItem;
  rowVirtualizer?: Virtualizer<HTMLDivElement, Element>;
}

export function LoadingRow<TData>({
  table,
  index,
  enableVirtualization,
  virtualRow,
  rowVirtualizer,
}: LoadingRowProps<TData>) {
  return (
    <TablePrimitive.TableRow
      key={`skeleton-${index}`}
      className={styles.TableRow}
      data-index={index}
      data-virtualized={enableVirtualization}
      ref={(node) => {
        rowVirtualizer?.measureElement(node);
      }}
      style={{
        transform: virtualRow ? `translateY(${virtualRow.start}px)` : undefined,
      }}
    >
      {table.getHeaderGroups()[0]?.headers.map((header) => (
        <TablePrimitive.TableCell
          key={header.id}
          className={styles.TableCell}
          data-column-id={header.column.id}
          data-virtualized={enableVirtualization}
          style={{
            flex: enableVirtualization
              ? `var(--header-${header.id}-size)`
              : undefined,
            width: !enableVirtualization ? header.getSize() : undefined,
          }}
        >
          <Skeleton className={styles.Skeleton} aria-hidden="true" />
        </TablePrimitive.TableCell>
      ))}
    </TablePrimitive.TableRow>
  );
}
