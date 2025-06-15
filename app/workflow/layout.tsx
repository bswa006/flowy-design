"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FolderOpen } from "lucide-react";
import { cn } from "@/lib/utils";

interface WorkflowLayoutProps {
  children: React.ReactNode;
}

export default function WorkflowLayout({ children }: WorkflowLayoutProps) {
  const pathname = usePathname();
  const navLinks = [
    {
      href: "/workflow",
      label: "Context",
      icon: <FolderOpen className="w-4 h-4" />,
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-200 flex flex-col py-8 px-4 space-y-6">
        <nav className="flex flex-col gap-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  isActive
                    ? "flex items-center px-4 py-2 rounded-lg bg-white text-gray-900 font-medium text-sm transition-colors shadow-sm"
                    : "flex items-center px-4 py-2 rounded-lg text-neutral-800 hover:bg-neutral-300/60 font-medium text-sm transition-colors",
                  "gap-2"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                <span
                  className={isActive ? "text-gray-900" : "text-neutral-500"}
                >
                  {link.icon}
                </span>
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto text-xs text-muted-foreground">
          Mercury OS &copy; 2024
        </div>
      </aside>
      <main className="flex-1 flex flex-col overflow-hidden h-screen">
        {children}
      </main>
    </div>
  );
}
