import { ArrowUpRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import { PROFILE } from "@/lib/site-config"

export function ProfileModal({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <div className="-m-4 mb-0 flex flex-col items-center gap-3 rounded-t-xl bg-gradient-to-b from-primary/15 to-transparent px-4 pt-8 pb-6 text-center">
          <img
            src={PROFILE.photo}
            alt={PROFILE.name}
            className="size-24 rounded-full object-cover shadow-lg ring-4 ring-background"
          />
          <div>
            <DialogTitle className="text-lg">{PROFILE.name}</DialogTitle>
            <DialogDescription className="mt-0.5">
              Candidate — Digital Heroes Training Task
            </DialogDescription>
          </div>
        </div>

        <p className="text-sm leading-relaxed text-pretty text-muted-foreground">
          {PROFILE.blurb}
        </p>

        <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button
            render={
              <a
                href={PROFILE.portfolioUrl}
                target="_blank"
                rel="noopener noreferrer"
              />
            }
            nativeButton={false}
          >
            View my portfolio
            <ArrowUpRight />
          </Button>
          <DialogClose render={<Button variant="ghost" />}>Close</DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  )
}
