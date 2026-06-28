import { cn } from '@/lib/utils';

export function Badge({ className, variant = 'default', ...props }) {
  const variants = {
    default: 'bg-primary/15 text-primary border-primary/20',
    secondary: 'bg-secondary text-secondary-foreground border-border',
    success: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
    warning: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
    destructive: 'bg-destructive/15 text-red-400 border-destructive/20',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
