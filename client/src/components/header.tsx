
import React from "react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        <div className="font-semibold">Your App Name</div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          {/* Add other header items here */}
        </div>
      </div>
    </header>
  );
}
