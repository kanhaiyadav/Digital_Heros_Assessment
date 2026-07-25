import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Send } from "lucide-react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useCreateLead } from "@/features/leads/useCreateLead"
import {
  BUDGET_RANGES,
  budgetRangeLabels,
  createLeadSchema,
  type CreateLeadInput,
} from "@/lib/validation/lead.schema"
import { ApiClientError } from "@/lib/api/client"

export function LeadForm() {
  const createLead = useCreateLead()

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateLeadInput>({
    resolver: zodResolver(createLeadSchema),
    defaultValues: {
      name: "",
      email: "",
      budgetRange: "" as CreateLeadInput["budgetRange"],
      message: "",
    },
  })

  function onSubmit(values: CreateLeadInput) {
    createLead.mutate(values, {
      onSuccess: () => {
        toast.success("Thanks! We'll be in touch shortly.")
        reset()
      },
      onError: (error) => {
        const message =
          error instanceof ApiClientError
            ? error.message
            : "Something went wrong. Please try again."
        toast.error(message)
      },
    })
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-4"
    >
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          placeholder="Jane Doe"
          aria-invalid={Boolean(errors.name)}
          {...register("name")}
        />
        {errors.name && (
          <p className="text-xs text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="jane@company.com"
          aria-invalid={Boolean(errors.email)}
          {...register("email")}
        />
        {errors.email && (
          <p className="text-xs text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="budgetRange">Budget range</Label>
        <Controller
          control={control}
          name="budgetRange"
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={field.onChange}
              name={field.name}
            >
              <SelectTrigger
                id="budgetRange"
                className="w-full"
                aria-invalid={Boolean(errors.budgetRange)}
              >
                <SelectValue placeholder="Select a budget" />
              </SelectTrigger>
              <SelectContent>
                {BUDGET_RANGES.map((range) => (
                  <SelectItem key={range} value={range}>
                    {budgetRangeLabels[range]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.budgetRange && (
          <p className="text-xs text-destructive">
            {errors.budgetRange.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          rows={4}
          placeholder="Tell us a bit about what you're looking for..."
          aria-invalid={Boolean(errors.message)}
          {...register("message")}
        />
        {errors.message && (
          <p className="text-xs text-destructive">{errors.message.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting} className="mt-2 w-full">
        {isSubmitting ? <Loader2 className="animate-spin" /> : <Send />}
        Send message
      </Button>
    </form>
  )
}
