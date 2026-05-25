import React from "react";
import { cn } from "@/lib/utils";

export const GridBackground = ({ children, className }: { children?: React.ReactNode, className?: string }) => {
  return (
    <div className={cn("relative w-full bg-brand-black bg-grid-white flex items-center justify-center", className)}>
      {/* Radial gradient for the container to give a faded look */}
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-brand-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      <div className="relative z-10 w-full">
        {children}
      </div>
    </div>
  );
};
