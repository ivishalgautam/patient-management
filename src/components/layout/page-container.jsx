import { cn } from "@/lib/utils";
import React from "react";

export default function PageContainer({ children, className }) {
  return (
    <div className={cn("rounded-lg bg-white p-8 shadow-md", className)}>
      {children}
    </div>
  );
}
