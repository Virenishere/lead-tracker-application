"use client"

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { InteractiveHoverButton } from "../ui/interactive-hover-button"
import { Backlight } from "../ui/backlight"
import { X } from "lucide-react"
import demoLead from "../../assets/demolead.mp4";

export function VideoCard() {
  return (
    <AlertDialog>
      <AlertDialogTrigger render={<InteractiveHoverButton>Show Dialog</InteractiveHoverButton>} />

      <AlertDialogContent
        size="xl"
        className="w-[92vw] sm:max-w-4xl lg:max-w-5xl p-0 gap-0 overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
      >
        {/* Header */}
        <AlertDialogHeader className="flex flex-row items-center justify-between px-6 py-5 space-y-0">
          <AlertDialogTitle className="text-xl font-semibold">
            Watch Our Demo
          </AlertDialogTitle>

          <AlertDialogCancel
            className="
              relative
              right-0
              top-0
              size-9
              rounded-full
              border
              bg-transparent
              p-0
              opacity-100
              shadow-none
              hover:bg-muted
            "
          >
            <X className="size-5" />
            <span className="sr-only">Close</span>
          </AlertDialogCancel>
        </AlertDialogHeader>

        {/* Video section */}
        <div className="px-6 pb-6">
          <Backlight
            blur={10}
            className="w-full rounded-2xl"
          >
            <div
              className="
                relative
                w-full
                overflow-hidden
                rounded-2xl
                bg-black
                aspect-video
              "
            >
              <video 
              src={demoLead}
              className="absolute inset-0 h-full w-full object-cover"
                autoPlay
                muted
                loop
                playsInline
              />
            </div>
          </Backlight>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}