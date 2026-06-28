import { cn } from '@/lib/utils';

export function Button({ className, variant = 'default', size = 'default', ...props }) {
  const variants = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    outline: 'border border-border bg-transparent hover:bg-secondary',
    ghost: 'hover:bg-secondary',
    destructive: 'bg-destructive text-white hover:bg-destructive/90',
  };

  const sizes = {
    default: 'h-10 px-4 py-2',
    sm: 'h-8 rounded-md px-3 text-sm',
    lg: 'h-11 rounded-lg px-8',
    icon: 'h-10 w-10',
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
}
