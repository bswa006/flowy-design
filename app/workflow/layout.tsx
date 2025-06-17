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
      <main className="flex-1 flex flex-col overflow-hidden h-screen">
        {children}
      </main>
    </div>
  );
}
