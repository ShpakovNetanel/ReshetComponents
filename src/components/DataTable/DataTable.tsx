import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  type ColumnDef,
  type TableOptions,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getExpandedRowModel,
} from "@tanstack/react-table";
import TablePrimitive from "./TablePrimitive";
import styles from "./DataTable.module.scss";
import { useMemo, useRef } from "react";
import { selectColumn } from "./columns/selectColumnDef";
import { expandColumnDef } from "./columns/expandColumnDef";
import { isDefined } from "remeda";
import { DataTableHeader } from "./components/DataTableHeader";
import { DataTableBody } from "./components/DataTableBody";
import type { RenderDetailPanel } from "./types";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useColumnSizeVars } from "./useColumnSizeVars";
import clsx from "clsx";
import { createTestIdBuilder } from "../../utils/testIds";
import Input from "../Input/Input";

export interface DataTableProps<TData, TValue = unknown> extends Omit<
  TableOptions<TData>,
  "columns" | "getCoreRowModel"
> {
  columns: (ColumnDef<TData, TValue> | undefined)[];
  data: TData[];
  isLoading?: boolean;
  enableRowSelectionColumn?: boolean;
  showColumnFilters?: boolean;
  enableGlobalSearch?: boolean;
  globalSearchPlaceholder?: string;
  enableVirtualization?: boolean;
  renderDetailPanel?: RenderDetailPanel<TData>;
  className?: string;
  loadingRowsCount?: number;
  dense?: boolean;
  name?: string;
  testId?: string;
}

export function DataTable<TData, TValue = unknown>({
  columns: providedColumns,
  isLoading,
  data,
  enableRowSelectionColumn,
  showColumnFilters,
  enableGlobalSearch,
  globalSearchPlaceholder,
  enableVirtualization,
  renderDetailPanel,
  className,
  loadingRowsCount = 5,
  dense,
  name,
  testId,
  ...options
}: DataTableProps<TData, TValue>) {
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const testIds = createTestIdBuilder("DataTable", { name, testId });

  const columns = useMemo<ColumnDef<TData, TValue>[]>(
    () =>
      [
        renderDetailPanel
          ? (expandColumnDef as ColumnDef<TData, TValue>)
          : undefined,
        enableRowSelectionColumn
          ? (selectColumn as ColumnDef<TData, TValue>)
          : undefined,
        ...providedColumns,
      ].filter((column) => column !== undefined),
    [providedColumns, enableRowSelectionColumn, renderDetailPanel],
  );

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getExpandedRowModel: getExpandedRowModel(),
    getRowCanExpand: renderDetailPanel ? () => true : undefined,
    ...options,
  });

  const rowCount = table.getRowModel().rows.length;
  const { expanded } = table.getState();
  const canMeasureElement =
    typeof navigator === "undefined" ||
    navigator.userAgent.indexOf("Firefox") === -1;

  // Set up this way to avoid extra rerenders when not virtualized
  const rowVirtualizer = useVirtualizer({
    count: enableVirtualization
      ? isLoading
        ? loadingRowsCount
        : renderDetailPanel
          ? rowCount * 2
          : rowCount
      : 0,
    estimateSize: (index: number) =>
      renderDetailPanel && index % 2 === 1 ? (expanded ? 100 : 0) : 64,
    getScrollElement: () =>
      enableVirtualization ? tableContainerRef.current : null,
    measureElement: canMeasureElement
      ? (element: Element) => element?.getBoundingClientRect().height
      : undefined,
    gap: renderDetailPanel ? 5 : 10,
    overscan: 5,
    enabled: enableVirtualization,
  });

  const columnSizeVars = useColumnSizeVars(table);

  return (
    <div
      className={clsx(styles.DataTableWrapper, className)}
      data-dense={dense || undefined}
      data-testid={testIds.self()}
    >
      {enableGlobalSearch && (
        <div className={styles.Toolbar}>
          <Input
            aria-label="Search table"
            className={styles.GlobalSearchInput}
            data-testid={testIds.part("GlobalSearch")}
            placeholder={globalSearchPlaceholder ?? "Search..."}
            value={String(table.getState().globalFilter ?? "")}
            onChange={(event) => table.setGlobalFilter(event.target.value)}
          />
        </div>
      )}
      <div className={styles.DataTableContainer} ref={tableContainerRef}>
        <TablePrimitive.Table
          className={styles.Table}
          data-testid={testIds.part("Table")}
          data-expandable={isDefined(renderDetailPanel)}
          data-virtualized={enableVirtualization}
          data-dense={dense || undefined}
          style={{ ...columnSizeVars }}
        >
          <DataTableHeader
            table={table}
            enableVirtualization={enableVirtualization}
            showColumnFilters={showColumnFilters}
          />
          <DataTableBody
            table={table}
            numberOfColumns={columns.length}
            isLoading={isLoading}
            renderDetailPanel={renderDetailPanel}
            enableVirtualization={enableVirtualization}
            rowVirtualizer={rowVirtualizer}
            loadingRowsCount={loadingRowsCount}
          />
        </TablePrimitive.Table>
      </div>
    </div>
  );
}
