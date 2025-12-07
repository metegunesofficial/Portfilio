// Etiket bileşeni
import * as React from 'react'
import * as RadixLabel from '@radix-ui/react-label'
import { cn } from '../../lib/cn'

export const Label = React.forwardRef<
  React.ElementRef<typeof RadixLabel.Root>,
  React.ComponentPropsWithoutRef<typeof RadixLabel.Root>
>(({ className, ...props }, ref) => (
  <RadixLabel.Root
    ref={ref}
    className={cn('text-sm font-medium text-slate-700 dark:text-slate-200', className)}
    {...props}
  />
))
Label.displayName = 'Label'

