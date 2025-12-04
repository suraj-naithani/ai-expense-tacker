"use client";

import React from "react";
import { cn } from "@/lib/utils";

type LoaderProps = {
    size?: number;
    strokeWidth?: number;
    fullscreen?: boolean;
    className?: string;
};

export const Loader: React.FC<LoaderProps> = ({
    size = 30,
    strokeWidth = 3,
    fullscreen = false,
    className,
}) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    const arcLength = circumference * 0.25;

    return (
        <div
            className={cn(
                fullscreen
                    ? "fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm"
                    : "inline-flex items-center justify-center",
                className,
            )}
        >
            <svg
                width={size}
                height={size}
                className="animate-spin-slow"
                style={{ display: "block" }}
            >
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="rgba(148, 163, 184, 0.4)"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                />

                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="#3b82f6"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    fill="transparent"
                    strokeDasharray={`${arcLength} ${circumference}`}
                    strokeDashoffset={0}
                />
            </svg>
        </div>
    );
};


