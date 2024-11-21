"use client";
import Spinner from "@/components/Spinner";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { days } from "@/data/days";
import { getByClinicId } from "@/server/slot";
import { ClinicContext } from "@/store/clinic-context";
import { useQuery } from "@tanstack/react-query";
import { Edit } from "lucide-react";
import Link from "next/link";
import { useContext } from "react";

export default function Page() {
  const { clinic, isClinicLoading } = useContext(ClinicContext);
  const { data: slot, isLoading } = useQuery({
    queryKey: [`slots-${clinic.id}`],
    queryFn: () => getByClinicId(clinic.id),
    enabled: !!clinic.id,
  });

  if (isLoading) return <Spinner />;

  return (
    <div className="rounded-lg bg-white p-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Start Time</TableHead>
            <TableHead>End Time</TableHead>
            <TableHead>Interval</TableHead>
            <TableHead>Slots</TableHead>
            <TableHead>Days off</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        {!slot?.id && <TableCaption>No slot found!</TableCaption>}
        <TableBody>
          {slot?.id && (
            <TableRow>
              <TableCell className="font-medium">{slot.start_time}</TableCell>
              <TableCell>{slot.end_time}</TableCell>
              <TableCell>{slot.interval_in_minute} minutes</TableCell>
              <TableCell className="flex w-[500px] flex-wrap items-center justify-start gap-1">
                {slot.slots.map((slot) => (
                  <Badge key={slot}>{slot}</Badge>
                ))}
              </TableCell>
              <TableCell className="space-x-1">
                {slot?.days_off?.map((day) => (
                  <Badge key={day}>
                    {days.find((d) => d.value === day).label}
                  </Badge>
                ))}
              </TableCell>
              <TableCell>
                <Link href={`/slots/edit/${slot.id}`}>
                  <Edit size={20} />
                </Link>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
