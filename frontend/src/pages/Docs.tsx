import { GitBranch } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useActiveSection } from "@/hooks/useActiveSection"
import { GITHUB_REPO_URL, SITE_NAME } from "@/lib/site-config"
import { cn } from "@/lib/utils"

const TOC = [
  { id: "overview", label: "Overview" },
  { id: "tech-stack", label: "Tech stack" },
  { id: "data-model", label: "Data model" },
  { id: "auth", label: "Auth approach" },
  { id: "api", label: "API reference" },
  { id: "security", label: "Security" },
  { id: "deployment", label: "Deployment" },
  { id: "source", label: "Source code" },
] as const

const TECH_STACK = [
  { layer: "Frontend", tech: "React 19, Vite, TypeScript", purpose: "SPA build and type safety" },
  { layer: "UI", tech: "Tailwind CSS v4, shadcn/ui (base-ui)", purpose: "Design system and components" },
  { layer: "Routing / data", tech: "React Router v7, TanStack Query v5", purpose: "Client routing and server state" },
  { layer: "Forms", tech: "React Hook Form, Zod", purpose: "Validation mirrored with the backend" },
  { layer: "Backend", tech: "Node.js, Express, TypeScript", purpose: "REST API" },
  { layer: "Database", tech: "MongoDB, Mongoose", purpose: "Persistence and schema modeling" },
  { layer: "Auth", tech: "JWT, bcrypt, httpOnly cookies", purpose: "Session handling and password storage" },
]

const LEAD_FIELDS = [
  { field: "name", type: "String", notes: "required, trimmed, 2-100 chars" },
  { field: "email", type: "String", notes: "required, lowercase, not unique - the same person may submit more than once" },
  { field: "budgetRange", type: "enum", notes: "<5k / 5k-15k / 15k-50k / 50k+ - bounded so the UI stays a clean <select>" },
  { field: "message", type: "String", notes: "required, trimmed, 10-2000 chars" },
  { field: "status", type: "enum", notes: "New (default) / Contacted / Closed" },
  { field: "createdAt / updatedAt", type: "Date", notes: "automatic timestamps" },
]

const ADMIN_FIELDS = [
  { field: "email", type: "String", notes: "required, unique, lowercase - the login identifier" },
  { field: "passwordHash", type: "String", notes: "bcrypt hash, select: false so it is never returned by default" },
  { field: "name", type: "String", notes: "display name" },
]

const REFRESH_FIELDS = [
  { field: "admin", type: "ObjectId ref", notes: "indexed reference to AdminUser" },
  { field: "tokenHash", type: "String", notes: "SHA-256 of the raw refresh token - the raw value is never stored" },
  { field: "expiresAt", type: "Date", notes: "TTL-indexed, MongoDB auto-purges expired rows" },
  { field: "revokedAt", type: "Date", notes: "set on logout, rotation, or reuse detection" },
]

const API_ROUTES = [
  { method: "POST", path: "/api/leads", auth: "Public", desc: "Create a lead from the public form" },
  { method: "GET", path: "/api/leads", auth: "Admin", desc: "List leads - search, status, page, limit, sortBy, sortOrder" },
  { method: "PATCH", path: "/api/leads/:id/status", auth: "Admin", desc: "Update a lead's status" },
  { method: "POST", path: "/api/auth/login", auth: "Public", desc: "Log in, sets access + refresh cookies" },
  { method: "POST", path: "/api/auth/logout", auth: "Admin", desc: "Revoke session, clears cookies" },
  { method: "POST", path: "/api/auth/refresh", auth: "Cookie", desc: "Rotate tokens using the refresh cookie" },
  { method: "GET", path: "/api/auth/me", auth: "Admin", desc: "Current admin session" },
  { method: "GET", path: "/api/health", auth: "Public", desc: "Deploy/uptime smoke check" },
]

const SECURITY_ITEMS = [
  "helmet() for HTTP header hardening",
  "CORS allowlist with credentials - never a wildcard origin",
  "Rate limiting: global cap plus a stricter one on /auth/login",
  "Mongoose strict schemas + Zod whitelisting before any value reaches a query",
  "20kb request body size limit",
  "Centralized error handler - production 500s never leak stack traces",
  "bcrypt password hashing, passwordHash hidden by default",
  "httpOnly cookies - tokens are never readable by JavaScript",
  "sameSite + CORS preflight as the CSRF mitigation for state-changing routes",
  ".env gitignored, only .env.example placeholders committed",
  "Refresh tokens stored as a hash, TTL-expired, and rotated on every use",
]

export function Docs() {
  const activeId = useActiveSection(TOC.map((t) => t.id))

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Badge variant="outline" className="mb-3 w-fit">
            Documentation
          </Badge>
          <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">{SITE_NAME}</h1>
          <p className="mt-2 max-w-xl text-muted-foreground">
            A lead-capture product with a public form and a secured admin dashboard, built end to end for the
            Digital Heroes assessment.
          </p>
        </div>
        <Button render={<a href={GITHUB_REPO_URL} target="_blank" rel="noopener noreferrer" />} nativeButton={false} variant="outline" className="w-fit shrink-0">
          <GitBranch />
          View on GitHub
        </Button>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1fr_220px]">
        <div className="flex max-w-3xl flex-col gap-12">
          <section id="overview" className="scroll-mt-24">
            <h2 className="font-heading text-xl font-semibold tracking-tight">Overview</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              LeadDesk Mini captures leads from a public landing page and lets a single admin manage them from a
              protected dashboard. Every submission is validated on both the client and the server, stored in
              MongoDB, and surfaced in a searchable, sortable, filterable admin table with a New / Contacted /
              Closed status workflow.
            </p>
            <ul className="mt-4 grid list-disc gap-1.5 pl-5 text-sm text-muted-foreground marker:text-primary">
              <li>Client + server validation on every field, using the same rules on both sides</li>
              <li>Search across name, email, and message, with sortable Name / Budget / Received columns</li>
              <li>Real JWT-based auth for the admin area - no hardcoded credentials, no public sign-up</li>
              <li>Fully responsive, with light/dark/system theming</li>
            </ul>
          </section>

          <Separator />

          <section id="tech-stack" className="scroll-mt-24">
            <h2 className="font-heading text-xl font-semibold tracking-tight">Tech stack</h2>
            <div className="mt-4 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Layer</TableHead>
                    <TableHead>Technology</TableHead>
                    <TableHead>Purpose</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {TECH_STACK.map((row) => (
                    <TableRow key={row.layer}>
                      <TableCell className="font-medium">{row.layer}</TableCell>
                      <TableCell className="text-muted-foreground">{row.tech}</TableCell>
                      <TableCell className="text-muted-foreground">{row.purpose}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </section>

          <Separator />

          <section id="data-model" className="scroll-mt-24">
            <h2 className="font-heading text-xl font-semibold tracking-tight">Data model</h2>

            <h3 className="mt-6 font-heading text-base font-medium">Lead</h3>
            <div className="mt-3 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Field</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {LEAD_FIELDS.map((row) => (
                    <TableRow key={row.field}>
                      <TableCell className="font-mono text-xs">{row.field}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{row.type}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{row.notes}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Indexed on <code className="font-mono text-xs">{"{ status, createdAt }"}</code> for the admin list's
              default filter and sort. Search is a case-insensitive regex across name/email/message, not a MongoDB
              text index - text indexes only match whole tokens, so a partial search like "jo" would fail to find
              "John."
            </p>

            <h3 className="mt-8 font-heading text-base font-medium">AdminUser</h3>
            <div className="mt-3 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Field</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ADMIN_FIELDS.map((row) => (
                    <TableRow key={row.field}>
                      <TableCell className="font-mono text-xs">{row.field}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{row.type}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{row.notes}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              There is no public registration route anywhere in the API - the only admin account is created by a
              one-off idempotent seed script from environment variables.
            </p>

            <h3 className="mt-8 font-heading text-base font-medium">RefreshToken</h3>
            <div className="mt-3 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Field</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {REFRESH_FIELDS.map((row) => (
                    <TableRow key={row.field}>
                      <TableCell className="font-mono text-xs">{row.field}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{row.type}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{row.notes}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </section>

          <Separator />

          <section id="auth" className="scroll-mt-24">
            <h2 className="font-heading text-xl font-semibold tracking-tight">Auth approach</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              JWT access token (15 minutes) plus a rotated JWT refresh token (30 days), both stored as httpOnly
              cookies - never readable by JavaScript.
            </p>
            <ol className="mt-4 flex list-decimal flex-col gap-2 pl-5 text-sm text-muted-foreground marker:font-medium marker:text-primary">
              <li>Login checks the password with bcrypt.compare, behind a rate limiter (10 attempts / 15 min / IP).</li>
              <li>On success, both cookies are set - the access token needs no database round trip to verify.</li>
              <li>When the access token expires mid-session, the frontend silently calls /auth/refresh once and retries - no visible re-login.</li>
              <li>Every refresh rotates the token: the old one is marked revoked and a new one is issued.</li>
              <li>If a revoked refresh token is ever presented again, that is treated as theft - every session for that admin is force-revoked.</li>
              <li>Logout revokes the current refresh token and clears both cookies.</li>
            </ol>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              In production the frontend and backend are different origins, so cookies use{" "}
              <code className="font-mono text-xs">secure: true</code> + <code className="font-mono text-xs">sameSite: 'none'</code>{" "}
              together, and CORS uses an exact origin allowlist with <code className="font-mono text-xs">credentials: true</code>{" "}
              - never a wildcard.
            </p>
          </section>

          <Separator />

          <section id="api" className="scroll-mt-24">
            <h2 className="font-heading text-xl font-semibold tracking-tight">API reference</h2>
            <div className="mt-4 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Method</TableHead>
                    <TableHead>Path</TableHead>
                    <TableHead>Auth</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {API_ROUTES.map((route) => (
                    <TableRow key={route.method + route.path}>
                      <TableCell className="font-mono text-xs">{route.method}</TableCell>
                      <TableCell className="font-mono text-xs">{route.path}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{route.auth}</Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{route.desc}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </section>

          <Separator />

          <section id="security" className="scroll-mt-24">
            <h2 className="font-heading text-xl font-semibold tracking-tight">Security</h2>
            <ul className="mt-4 grid list-disc gap-1.5 pl-5 text-sm text-muted-foreground marker:text-primary">
              {SECURITY_ITEMS.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <Separator />

          <section id="deployment" className="scroll-mt-24">
            <h2 className="font-heading text-xl font-semibold tracking-tight">Deployment</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Frontend on Vercel, API on Render, database on MongoDB Atlas - all free tier. Render's free tier
              sleeps after ~15 minutes idle, so a GitHub Actions cron pings the health endpoint every 10 minutes
              around the clock, and the app itself pings it every 4 minutes while a tab is open, so a cold start is
              rarely if ever seen in practice.
            </p>
          </section>

          <Separator />

          <section id="source" className="scroll-mt-24">
            <h2 className="font-heading text-xl font-semibold tracking-tight">Source code</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              The full source, README, and commit history are on GitHub.
            </p>
            <Button render={<a href={GITHUB_REPO_URL} target="_blank" rel="noopener noreferrer" />} nativeButton={false} className="mt-4 w-fit">
              <GitBranch />
              {GITHUB_REPO_URL.replace("https://", "")}
            </Button>
          </section>
        </div>

        <aside className="hidden lg:block">
          <nav className="sticky top-20 flex flex-col gap-1 border-l border-border pl-4">
            <p className="mb-1 text-xs font-medium tracking-wide text-muted-foreground uppercase">On this page</p>
            {TOC.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={cn(
                  "rounded-md px-2 py-1 text-sm transition-colors",
                  activeId === item.id
                    ? "font-medium text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </aside>
      </div>
    </div>
  )
}
