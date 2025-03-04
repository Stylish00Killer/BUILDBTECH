
import * as React from "react";
import { cn } from "@/lib/utils";

interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
}

export function PageContainer({
  children,
  className,
  fullWidth = false,
  ...props
}: PageContainerProps) {
  return (
    <div
      className={cn(
        "min-h-screen py-8 px-4 sm:px-6",
        fullWidth ? "w-full" : "container mx-auto max-w-7xl",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function PageHeader({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("mb-8 space-y-2 text-center", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function PageTitle({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h1
      className={cn("text-3xl font-bold tracking-tight md:text-4xl", className)}
      {...props}
    >
      {children}
    </h1>
  );
}

export function PageDescription({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-muted-foreground", className)}
      {...props}
    >
      {children}
    </p>
  );
}

export function PageContent({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("space-y-8", className)}
      {...props}
    >
      {children}
    </div>
  );
}
