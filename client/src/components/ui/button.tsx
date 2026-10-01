import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline';
}

export const Button: React.FC<ButtonProps> = ({ variant = 'default', className, ...props }) => {
  return (
    <button
      className={cn(
        'px-4 py-2 rounded-md font-medium',
        variant === 'outline' ? 'border border-gray-300' : 'bg-blue-500 text-white',
        className
      )}
      {...props}
    />
  );
};
