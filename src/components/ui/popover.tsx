// Popover sarmalayıcıları (Radix)
import * as PopoverPrimitive from '@radix-ui/react-popover'
import { cn } from '../../lib/cn'

export const Popover = PopoverPrimitive.Root
export const PopoverTrigger = PopoverPrimitive.Trigger

export const PopoverContent = ({ className, align = 'center', sideOffset = 8, ...props }: PopoverPrimitive.PopoverContentProps) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      align={align}
      sideOffset={sideOffset}
      className={cn(
        'z-50 rounded-2xl border border-white/60 bg-white p-3 text-sm shadow-lg outline-none dark:border-white/10 dark:bg-slate-900',
        'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in data-[state=closed]:fade-out data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95',
        className
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
)
PopoverContent.displayName = 'PopoverContent'

