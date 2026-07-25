export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex w-fit items-center gap-2 px-4 py-3 text-center text-xs text-muted-foreground sm:px-6">
        <p>
          Built for{" "}
          <a
            href="https://digitalheroesco.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline underline-offset-4 hover:text-foreground"
          >
            Digital Heroes Training Task
          </a>
        </p>
        <p>&copy; {new Date().getFullYear()} LeadDesk Mini</p>
      </div>
    </footer>
  )
}
