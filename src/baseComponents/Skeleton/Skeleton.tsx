import clsx from 'clsx'
import type { ComponentProps } from 'react'
import styles from './Skeleton.module.scss'

function Skeleton({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot='skeleton'
      className={clsx(styles.Skeleton, className)}
      {...props}
    />
  )
}

export { Skeleton }
