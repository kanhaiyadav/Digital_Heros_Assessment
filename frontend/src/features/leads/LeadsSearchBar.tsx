import { Search } from "lucide-react"

import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { LEAD_STATUSES, type LeadStatus } from "@/lib/validation/lead.schema"

interface LeadsSearchBarProps {
  search: string
  onSearchChange: (value: string) => void
  status: LeadStatus | "all"
  onStatusChange: (value: LeadStatus | "all") => void
}

export function LeadsSearchBar({
  search,
  onSearchChange,
  status,
  onStatusChange,
}: LeadsSearchBarProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search by name, email, or message..."
          className="pl-8"
        />
      </div>

      <Select
        value={status}
        onValueChange={(value) => onStatusChange(value as LeadStatus | "all")}
      >
        <SelectTrigger className="w-full sm:w-44">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          {LEAD_STATUSES.map((leadStatus) => (
            <SelectItem key={leadStatus} value={leadStatus}>
              {leadStatus}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
