import { useState } from "react"
import { MessageSquareText } from "lucide-react"

const ILLUSTRATION_SRC = "/hero-illustration.png"

export function HeroIllustration() {
  const [imageFailed, setImageFailed] = useState(false)

  return (
    <div className="relative flex h-64 w-full items-center justify-center overflow-hidden bg-gradient-to-br from-primary/20 via-background to-chart-2/20 lg:h-full">
      <div
        aria-hidden
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(color-mix(in oklch, var(--foreground), transparent 85%) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />

      {imageFailed ? (
        <div
          aria-hidden
          className="relative flex size-40 items-center justify-center rounded-full bg-primary/10 sm:size-56"
        >
          <div className="flex size-24 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-xl sm:size-32">
            <MessageSquareText className="size-10 sm:size-14" />
          </div>
        </div>
      ) : (
        <img
          src={ILLUSTRATION_SRC}
          alt=""
          aria-hidden
          onError={() => setImageFailed(true)}
          className="relative z-10 max-h-52 object-contain drop-shadow-xl sm:max-h-72 lg:max-h-120"
        />
      )}
    </div>
  )
}
