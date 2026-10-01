import { cn } from '@/lib/utils';

type PageContainerProps = {
  children: React.ReactNode;
  className?: string;
  centered?: boolean;
};

export function PageContainer({ children, className, centered = true }: PageContainerProps) {
  return (
    <main
      className={cn(
        'flex w-full min-h-[calc(100vh-4rem)] flex-1 flex-col px-4 py-8 sm:px-6 sm:py-10 lg:px-8',
        centered && 'items-center justify-center',
        className,
      )}
    >
      {children}
    </main>
  );
}
