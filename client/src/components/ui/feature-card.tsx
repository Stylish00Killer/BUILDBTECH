
import * as React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  icon?: LucideIcon;
  className?: string;
}

export function FeatureCard({
  title,
  description,
  icon: Icon,
  className,
  ...props
}: FeatureCardProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-lg border bg-card p-6 shadow-sm transition-all hover:shadow-md",
        className
      )}
      {...props}
    >
      {Icon && (
        <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
      )}
      <h3 className="mb-2 font-semibold tracking-tight">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
