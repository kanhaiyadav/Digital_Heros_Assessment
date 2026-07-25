import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useUpdateLeadStatus } from "@/features/leads/useUpdateLeadStatus"
import {
  LEAD_STATUSES,
  budgetRangeLabels,
  type Lead,
  type LeadSortField,
  type LeadStatus,
  type SortOrder,
} from "@/lib/validation/lead.schema"

const STATUS_BADGE_VARIANT: Record<
  LeadStatus,
  "default" | "secondary" | "outline"
> = {
  New: "default",
  Contacted: "secondary",
  Closed: "outline",
}

interface LeadsTableProps {
  leads: Lead[]
  isLoading: boolean
  sortBy: LeadSortField
  sortOrder: SortOrder
  onSortChange: (field: LeadSortField) => void
}

function SortableHead({
  field,
  label,
  sortBy,
  sortOrder,
  onSortChange,
}: {
  field: LeadSortField
  label: string
  sortBy: LeadSortField
  sortOrder: SortOrder
  onSortChange: (field: LeadSortField) => void
}) {
  const isActive = sortBy === field
  const Icon = isActive
    ? sortOrder === "asc"
      ? ArrowUp
      : ArrowDown
    : ArrowUpDown

  return (
    <TableHead>
      <button
        type="button"
        onClick={() => onSortChange(field)}
        aria-sort={
          isActive ? (sortOrder === "asc" ? "ascending" : "descending") : "none"
        }
        className="flex items-center gap-1 font-medium text-foreground outline-none hover:text-primary focus-visible:text-primary"
      >
        {label}
        <Icon
          className={`size-3.5 ${isActive ? "text-primary" : "text-muted-foreground"}`}
        />
      </button>
    </TableHead>
  )
}

export function LeadsTable({
  leads,
  isLoading,
  sortBy,
  sortOrder,
  onSortChange,
}: LeadsTableProps) {
  const updateStatus = useUpdateLeadStatus()

  function handleStatusChange(id: string, status: LeadStatus) {
    updateStatus.mutate(
      { id, status },
      {
        onError: () => toast.error("Could not update status, please try again"),
      }
    )
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-10 w-full" />
        ))}
      </div>
    )
  }

  if (leads.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-muted-foreground">
        No leads found.
      </p>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <SortableHead
            field="name"
            label="Name"
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSortChange={onSortChange}
          />
          <TableHead>Email</TableHead>
          <SortableHead
            field="budgetRange"
            label="Budget"
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSortChange={onSortChange}
          />
          <TableHead>Message</TableHead>
          <SortableHead
            field="createdAt"
            label="Received"
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSortChange={onSortChange}
          />
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {leads.map((lead) => (
          <TableRow key={lead._id}>
            <TableCell className="font-medium">{lead.name}</TableCell>
            <TableCell className="text-muted-foreground">
              {lead.email}
            </TableCell>
            <TableCell>
              <Badge variant="outline">
                {budgetRangeLabels[lead.budgetRange]}
              </Badge>
            </TableCell>
            <TableCell
              className="max-w-64 whitespace-normal text-muted-foreground"
              title={lead.message}
            >
              <span className="line-clamp-2">{lead.message}</span>
            </TableCell>
            <TableCell className="text-muted-foreground">
              {new Date(lead.createdAt).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </TableCell>
            <TableCell>
              <Select
                value={lead.status}
                onValueChange={(value) =>
                  handleStatusChange(lead._id, value as LeadStatus)
                }
              >
                <SelectTrigger size="sm" className="w-32">
                  <SelectValue>
                    <Badge variant={STATUS_BADGE_VARIANT[lead.status]}>
                      {lead.status}
                    </Badge>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {LEAD_STATUSES.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
