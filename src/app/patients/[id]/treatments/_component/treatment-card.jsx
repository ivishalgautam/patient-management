import { AlertCircle, Calendar, CheckCircle2, Clock, User } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import moment from "moment";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Small } from "@/components/ui/typography";

export default function TreatmentCard({ treatment, handleStatusChange }) {
  return (
    <Card key={treatment.id} className="h-full w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-primary text-xl font-semibold capitalize">
          {treatment.service_name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-muted-foreground flex items-center text-sm capitalize">
            <User className="mr-2 h-4 w-4" />
            {treatment.added_by}
          </div>
          <div className="text-muted-foreground flex items-center text-sm">
            <Calendar className="mr-2 h-4 w-4" />
            {moment(treatment.created_at).format("DD MMM, YYYY")}
          </div>
          <div className="text-muted-foreground flex items-center text-sm">
            <Clock className="mr-2 h-4 w-4" />
            {moment(treatment.created_at).format("HH:mm:ss A")}
          </div>

          <hr />
          {treatment.status === "close" && (
            <div>
              <Small>Closed On</Small>
              <div className="text-muted-foreground flex items-center text-sm">
                <Clock className="mr-2 h-4 w-4" />
                {moment(treatment.updated_at).format("DD MMM YYYY HH:mm:ss A")}
              </div>
            </div>
          )}
          <div className="mt-4 flex items-center justify-between">
            <Select
              defaultValue={treatment.status}
              onValueChange={(value) => handleStatusChange(treatment.id, value)}
              disabled={treatment.status === "close"}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">
                  <div className="flex items-center">
                    <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                    Active
                  </div>
                </SelectItem>
                <SelectItem value="close">
                  <div className="flex items-center">
                    <AlertCircle className="mr-2 h-4 w-4 text-red-500" />
                    Close
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <Badge
              variant={treatment.status === "close" ? "destructive" : "default"}
              className={cn("text-xs font-semibold", {
                "bg-green-500 hover:bg-green-500/80":
                  treatment.status === "active",
              })}
            >
              {treatment.status.toUpperCase()}{" "}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
