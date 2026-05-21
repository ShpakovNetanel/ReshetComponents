import { type Column } from '@tanstack/react-table'
import clsx from 'clsx'
import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react'
import styles from './ColumnHeader.module.scss'
import type { HTMLAttributes, PropsWithChildren } from 'react'

interface ColumnHeaderProps<TData, TValue>
  extends HTMLAttributes<HTMLDivElement>,
    PropsWithChildren {
  column: Column<TData, TValue>
}

export function ColumnHeader<TData, TValue>({
  column,
  className,
  children,
}: ColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={className}>{children}</div>
  }

  return (
    <div className={clsx(styles.ColumnHeader, className)}>
      {/* TODO: style button */}
      <button
        type='button'
        className='data-[state=open]:bg-accent -ml-3 h-8'
        onClick={() => column.toggleSorting()}
        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
      >
        <span>{children}</span>
        {column.getIsSorted() === 'desc' ? (
          <ArrowDown size='1rem' />
        ) : column.getIsSorted() === 'asc' ? (
          <ArrowUp size='1rem' />
        ) : (
          <ChevronsUpDown size='1rem' />
        )}
      </button>
    </div>
  )
}
