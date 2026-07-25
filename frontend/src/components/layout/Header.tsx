import { useState } from "react"
import { BookOpen, LayoutDashboard, LogOut } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { ProfileModal } from "@/components/layout/ProfileModal"
import { ThemeToggle } from "@/components/layout/ThemeToggle"
import { useSession } from "@/features/auth/useSession"
import { useLogout } from "@/features/auth/useLogout"
import { PROFILE, SITE_NAME } from "@/lib/site-config"

export function Header() {
  const { data } = useSession()
  const logout = useLogout()
  const navigate = useNavigate()
  const isAuthed = Boolean(data?.data)

  const [profileOpen, setProfileOpen] = useState(false)

  function handleLogout() {
    logout.mutate(undefined, {
      onSuccess: () => {
        toast.success("Logged out")
        navigate("/login")
      },
      onError: () => {
        toast.error("Could not log out, please try again")
      },
    })
  }

  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur shadow-sm">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setProfileOpen(true)}
            aria-label={`About ${PROFILE.name}`}
            className="rounded-full ring-primary/40 transition-transform outline-none hover:scale-105 focus-visible:ring-2"
          >
            <img
              src={PROFILE.photo}
              alt={PROFILE.name}
              className="size-8 rounded-full object-cover ring-2 ring-primary/60 sm:size-9"
            />
          </button>
          <Link to="/" className="font-semibold tracking-tight text-primary">
            {SITE_NAME}
          </Link>
        </div>

        <nav className="flex items-center gap-1.5 sm:gap-2">
          <Button render={<Link to="/docs" />} nativeButton={false} variant="ghost" size="sm">
            <BookOpen />
            <span className="hidden sm:inline">Docs</span>
          </Button>

          {isAuthed ? (
            <>
              <Button render={<Link to="/admin" />} nativeButton={false} variant="ghost" size="sm">
                <LayoutDashboard />
                <span className="hidden sm:inline">Admin</span>
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout} disabled={logout.isPending}>
                <LogOut />
                <span className="hidden sm:inline">Log out</span>
              </Button>
            </>
          ) : (
            <Button render={<Link to="/login" />} nativeButton={false} variant="ghost" size="sm">
              Admin login
            </Button>
          )}
          <ThemeToggle />
        </nav>
      </div>

      <ProfileModal open={profileOpen} onOpenChange={setProfileOpen} />
    </header>
  )
}
