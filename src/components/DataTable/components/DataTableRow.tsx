import { flexRender, type Row, type Table } from "@tanstack/react-table";
import { Fragment, useRef } from "react";
import TablePrimitive from "../TablePrimitive";
import { Collapsible } from "@base-ui/react";
import styles from "./DataTableRow.module.scss";
import type { RenderDetailPanel } from "../types";
import type { VirtualItem, Virtualizer } from "@tanstack/react-virtual";
import { isDefined } from "remeda";

export interface DataTableRowProps<TData> {
  table: Table<TData>;
  row: Row<TData>;
  renderDetailPanel?: RenderDetailPanel<TData>;
  enableVirtualization?: boolean;
  virtualRow?: VirtualItem;
  rowVirtualizer?: Virtualizer<HTMLDivElement, Element>;
}

export function DataTableRow<TData>({
  table,
  row,
  renderDetailPanel,
  enableVirtualization,
  virtualRow,
  rowVirtualizer,
}: DataTableRowProps<TData>) {
  const parentRowRef = useRef<HTMLTableRowElement | null>(null);

  const rowIndex = renderDetailPanel ? row.index * 2 : row.index;
  const detailPanelIndex =
    renderDetailPanel && isDefined(rowIndex) ? rowIndex + 1 : rowIndex;

  return (
    <Fragment>
      <TablePrimitive.TableRow
        className={styles.TableRow}
        data-index={rowIndex}
        data-state={row.getIsSelected() && "selected"}
        data-virtualized={enableVirtualization}
        ref={(node) => {
          rowVirtualizer?.measureElement(node);
          parentRowRef.current = node;
        }}
        style={{
          transform: virtualRow
            ? `translateY(${virtualRow.start}px)`
            : undefined,
        }}
      >
        {row.getVisibleCells().map((cell) => (
          <TablePrimitive.TableCell
            key={cell.id}
            className={styles.TableCell}
            data-column-id={cell.column.id}
            data-virtualized={enableVirtualization}
            style={{
              flex: enableVirtualization
                ? `var(--col-${cell.column.id}-size)`
                : undefined,
              width: !enableVirtualization ? cell.column.getSize() : undefined,
            }}
          >
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TablePrimitive.TableCell>
        ))}
      </TablePrimitive.TableRow>

      {renderDetailPanel && row.getCanExpand() && (
        <Collapsible.Root
          className={styles.CollapsibleRoot}
          open={row.getIsExpanded()}
          render={
            <TablePrimitive.TableRow
              className={styles.TableRow}
              data-detail-panel
              data-index={detailPanelIndex}
              data-virtualized={enableVirtualization}
              ref={
                rowVirtualizer
                  ? (node) => rowVirtualizer.measureElement(node)
                  : undefined
              }
              style={{
                transform: virtualRow
                  ? `translateY(${virtualRow.start}px)`
                  : undefined,
                top: virtualRow
                  ? `${parentRowRef.current?.getBoundingClientRect()?.height}px`
                  : undefined,
              }}
            />
          }
        >
          <TablePrimitive.TableCell
            className={styles.DetailPanelCell}
            data-virtualized={enableVirtualization}
            colSpan={row.getVisibleCells().length}
          >
            <Collapsible.Panel className={styles.CollapsiblePanel}>
              <div>{renderDetailPanel({ row, table })}</div>
            </Collapsible.Panel>
          </TablePrimitive.TableCell>
        </Collapsible.Root>
      )}
    </Fragment>
  );
}
