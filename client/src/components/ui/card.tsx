import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Card: React.FC<CardProps> = ({ className, children, ...props }) => {
  return (
    <div
      className={cn('rounded-xl border bg-card text-card-foreground shadow-sm', className)}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<CardProps> = ({ className, children, ...props }) => {
  return (
    <div className={cn('flex flex-col space-y-2 border-b px-6 py-6', className)} {...props}>
      {children}
    </div>
  );
};

export const CardContent: React.FC<CardProps> = ({ className, children, ...props }) => {
  return (
    <div className={cn('px-6 py-6', className)} {...props}>
      {children}
    </div>
  );
};

export const CardTitle: React.FC<CardProps> = ({ className, children, ...props }) => {
  return (
    <h2 className={cn('text-2xl font-semibold tracking-tight text-card-foreground', className)} {...props}>
      {children}
    </h2>
  );
};

export const CardDescription: React.FC<CardProps> = ({ className, children, ...props }) => {
  return (
    <p className={cn('text-sm leading-relaxed text-muted-foreground', className)} {...props}>
      {children}
    </p>
  );
};

export const CardFooter: React.FC<CardProps> = ({ className, children, ...props }) => {
  return (
    <div className={cn('flex items-center border-t px-6 py-6', className)} {...props}>
      {children}
    </div>
  );
};
