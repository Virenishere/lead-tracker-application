"use client"

import React, { forwardRef, useRef } from "react"

import { cn } from "@/lib/utils"
import { AnimatedBeam } from "../ui/animated-beam";


const Circle = forwardRef<HTMLDivElement,{ className?: string; children?: React.ReactNode }>(({ className, children }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "z-10 flex size-10 sm:size-12 items-center justify-center rounded-full border border-border bg-card text-foreground p-2 sm:p-3 shadow-md transition-colors",
        className
      )}
    >
      {children}
    </div>
  )
})

Circle.displayName = "Circle"

export function HomePipeline() {
  const containerRef = useRef<HTMLDivElement>(null)
  const div1Ref = useRef<HTMLDivElement>(null)
  const div2Ref = useRef<HTMLDivElement>(null)
  const div3Ref = useRef<HTMLDivElement>(null)
  const div4Ref = useRef<HTMLDivElement>(null)
  const div5Ref = useRef<HTMLDivElement>(null)

  return (
    <div
      className="relative flex w-full max-w-[500px] items-center justify-center overflow-hidden p-6 sm:p-10"
      ref={containerRef}
    >
      <div className="flex size-full flex-col items-stretch justify-between gap-10">
        <div className="flex flex-row justify-between">
          {/* new */}
          <Circle ref={div1Ref}>
            <Icons.new />
          </Circle>
          
          {/* contacted */}
          <Circle ref={div2Ref}>
            <Icons.contacted />
          </Circle>
          
          {/* qualified */}
          <Circle ref={div3Ref}>
            <Icons.qualified />
          </Circle>

          {/* proposal */}
          <Circle ref={div4Ref}>
            <Icons.proposal />
          </Circle>

          {/* won */}
          <Circle ref={div5Ref}>
            <Icons.won />
          </Circle>
        </div>
      </div>

      <AnimatedBeam
        duration={3}
        containerRef={containerRef}
        fromRef={div1Ref}
        toRef={div5Ref}
      />
    </div>
  )
}

const Icons = {
  new: () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-foreground"
    >
      <path
        d="M12 5V19M5 12H19"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  contacted: () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className="text-foreground"
    >
      <path d="M6.62 10.79C8.06 13.62 10.38 15.94 13.21 17.38L15.41 15.18C15.69 14.9 16.09 14.81 16.45 14.93C17.61 15.32 18.86 15.53 20.16 15.53C20.62 15.53 21 15.91 21 16.37V20.16C21 20.62 20.62 21 20.16 21C10.68 21 3 13.32 3 3.84C3 3.38 3.38 3 3.84 3H7.64C8.1 3 8.48 3.38 8.48 3.84C8.48 5.14 8.69 6.39 9.08 7.55C9.2 7.91 9.11 8.31 8.83 8.59L6.62 10.79Z" />
    </svg>
  ),
  qualified: () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-foreground"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        fill="currentColor"
      />
      <path
        d="M8 12L10.5 14.5L16 9"
        className="stroke-background"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  proposal: () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className="text-foreground"
    >
      <path d="M6 2C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2H6ZM13 3.5L18.5 9H14C13.45 9 13 8.55 13 8V3.5ZM7 12H17V13.5H7V12ZM7 15H17V16.5H7V15ZM7 18H14V19.5H7V18Z" />
    </svg>
  ),
  won: () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className="text-foreground"
    >
      <path d="M18 2H6V4H3V8C3 10.76 5.24 13 8 13H8.35C8.93 14.37 10.03 15.43 11.5 15.86V18H8V20H16V18H12.5V15.86C13.97 15.43 15.07 14.37 15.65 13H16C18.76 13 21 10.76 21 8V4H18V2ZM5 6H6V10.8C5.42 10.45 5 9.82 5 9V6ZM19 6V9C19 9.82 18.58 10.45 18 10.8V6H19ZM8 4H16V9C16 11.21 14.21 13 12 13C9.79 13 8 11.21 8 9V4Z" />
    </svg>
  )
}
