import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
    gradient?: boolean;
}

export function Card({ children, className, gradient, ...props }: CardProps) {
    return (
        <div
            className={cn(
                "rounded-xl p-6 transition-all duration-300",
                gradient ? "glass-card" : "glass",
                "hover:border-white/20",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}
