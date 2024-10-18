import React from "react";
import { cn } from "@/lib/utils"; // Utility function for conditional classes, optional based on your setup

interface CardProps {
  className?: string;
  children: React.ReactNode;
}

export function Card({ className, children }: CardProps) {
  return (
    <div className={cn("bg-white dark:bg-gray-800 rounded-lg shadow-md", className)}>
      {children}
    </div>
  );
}

interface CardHeaderProps {
  className?: string;
  children: React.ReactNode;
}

export function CardHeader({ className, children }: CardHeaderProps) {
  return (
    <div className={cn("px-6 py-4 border-b dark:border-gray-700", className)}>
      {children}
    </div>
  );
}

interface CardTitleProps {
  className?: string;
  children: React.ReactNode;
}

export function CardTitle({ className, children }: CardTitleProps) {
  return (
    <h2 className={cn("text-xl font-semibold ", className)}>
      {children}
    </h2>
  );
}

interface CardContentProps {
  className?: string;
  children: React.ReactNode;
}

export function CardContent({ className, children }: CardContentProps) {
  return (
    <div className={cn("p-6", className)}>
      {children}
    </div>
  );
}
