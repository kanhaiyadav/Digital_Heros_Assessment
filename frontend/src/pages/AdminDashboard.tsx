import { useEffect, useState } from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { LeadsPagination } from "@/features/leads/LeadsPagination"
import { LeadsSearchBar } from "@/features/leads/LeadsSearchBar"
import { LeadsTable } from "@/features/leads/LeadsTable"
import { useLeadsQuery } from "@/features/leads/useLeadsQuery"
import type {
  LeadSortField,
  LeadStatus,
  SortOrder,
} from "@/lib/validation/lead.schema"

const PAGE_SIZE = 6

export function AdminDashboard() {
  const [searchInput, setSearchInput] = useState("")
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState<LeadStatus | "all">("all")
  const [page, setPage] = useState(1)
  const [sortBy, setSortBy] = useState<LeadSortField>("createdAt")
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc")

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(searchInput)
      setPage(1)
    }, 300)

    return () => clearTimeout(timeout)
  }, [searchInput])

  const { data, isLoading, isPlaceholderData } = useLeadsQuery({
    search,
    status,
    page,
    limit: PAGE_SIZE,
    sortBy,
    sortOrder,
  })

  function handleStatusChange(next: LeadStatus | "all") {
    setStatus(next)
    setPage(1)
  }

  function handleSortChange(field: LeadSortField) {
    if (field === sortBy) {
      setSortOrder((current) => (current === "asc" ? "desc" : "asc"))
    } else {
      setSortBy(field)
      setSortOrder(field === "createdAt" ? "desc" : "asc")
    }
    setPage(1)
  }

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-10 sm:px-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Leads</h1>
        <p className="text-sm text-muted-foreground">
          Search, filter, and manage incoming leads.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All leads</CardTitle>
          <CardDescription>
            Update a lead&apos;s status as you work through it.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <LeadsSearchBar
            search={searchInput}
            onSearchChange={setSearchInput}
            status={status}
            onStatusChange={handleStatusChange}
          />

          <LeadsTable
            leads={data?.data ?? []}
            isLoading={isLoading}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSortChange={handleSortChange}
          />

          {data && data.meta.total > 0 && (
            <LeadsPagination
              page={data.meta.page}
              totalPages={data.meta.totalPages}
              total={data.meta.total}
              onPageChange={setPage}
            />
          )}
        </CardContent>
      </Card>

      {isPlaceholderData && (
        <p className="text-xs text-muted-foreground">Refreshing...</p>
      )}
    </div>
  )
}
