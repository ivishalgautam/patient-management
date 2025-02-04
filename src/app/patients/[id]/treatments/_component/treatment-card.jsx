import { CalendarIcon, CheckCircleIcon } from "lucide-react";
import { format } from "date-fns";
import { Muted } from "@/components/ui/typography";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function TreatmentCard({
  is_active,
  created_at,
  service_name,
  added_by,
  updateMutation,
  id,
}) {
  return (
    <div className="overflow-hidden rounded-lg border bg-white">
      <div className="space-y-4 p-6">
        <div className="bg-primary rounded-md p-4">
          <h3 className="mb-2 font-semibold">Service Details</h3>
          <p className="capitalize">{service_name}</p>
          <Muted className="mt-1 capitalize">Added by: {added_by}</Muted>
        </div>
        <div className="flex items-center space-x-2 text-gray-600">
          <CalendarIcon className="size-4" />
          <Muted>Created: {format(new Date(created_at), "PPP")}</Muted>
        </div>

        <div className="flex items-center justify-between">
          <Select
            defaultValue={is_active ? "active" : "closed"}
            onValueChange={(value) =>
              updateMutation.mutate({
                is_active: value === "active" ? true : false,
                treatemnt_id: id,
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="close">Close</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
