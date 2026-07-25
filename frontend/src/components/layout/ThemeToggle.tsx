import { Monitor, Moon, Sun } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"

const NEXT_THEME = {
  light: "dark",
  dark: "system",
  system: "light",
} as const

const THEME_ICON = {
  light: Sun,
  dark: Moon,
  system: Monitor,
} as const

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const Icon = THEME_ICON[theme]

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={`Switch theme (current: ${theme})`}
      onClick={() => setTheme(NEXT_THEME[theme])}
    >
      <Icon />
    </Button>
  )
}
