"use client";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import CustomCalendar from "../ui/custom-calendar";
import { format, isSameDay, isToday, startOfToday } from "date-fns";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import { getByClinicId, getSlotByDateAndClinic } from "@/server/slot";
import { fetchBlockSlotsByClinicId } from "@/server/block-slot";
import Spinner from "../Spinner";
import { toast } from "sonner";
import { useQueryState } from "nuqs";
import { Badge } from "../ui/badge";
import { Label } from "../ui/label";

export default function BlockSlotForm({ type, slots, clinic, handleCreate }) {
  const {
    register,
    control,
    formState: { errors },
    watch,
    setValue,
    handleSubmit,
    trigger,
  } = useForm({
    defaultValues: {
      date: new Date(),
      slots: [],
    },
  });
  const [d, setD] = useQueryState("d");
  let today = startOfToday();
  let [selectedDay, setSelectedDay] = useState(d ? moment(d).format() : today);
  const formattedSelectedDay = moment(selectedDay).format("YYYY-MM-DD");

  const { data: blockedSlots, isLoading } = useQuery({
    queryKey: [`block-slots-${clinic.id}`, selectedDay],
    queryFn: () => getSlotByDateAndClinic(clinic.id, formattedSelectedDay),
    enabled: !!clinic.id,
  });

  const { data: allBlockSlots, isLoading: isBlockSlotsLoading } = useQuery({
    queryFn: () => fetchBlockSlotsByClinicId("", "", clinic.id),
    queryKey: [`all-block-slots-${clinic.id}`, clinic?.id],
    enabled: !!clinic?.id,
  });
  const formattedAllBlockSlots = useMemo(() => {
    return allBlockSlots?.blocked?.map((d) => ({ date: d.date, type: d.type }));
  }, [allBlockSlots]);

  const { data: clinicSlot, isLoading: isClinicSlotLoading } = useQuery({
    queryFn: () => getByClinicId(clinic.id),
    queryKey: [`clinic-slots-${clinic.id}`, clinic?.id],
    enabled: !!clinic?.id,
  });
  useEffect(() => {
    if (blockedSlots) {
      setValue("slots", blockedSlots?.slots ?? []);
    }
  }, [blockedSlots, setValue]);

  const onSubmit = async (data) => {
    if (type === "slot" && !data.slots.length) {
      return toast.warning("Please select atleast 1 slot.");
    }

    const payload = {
      date: formattedSelectedDay,
      slots: type === "slot" ? data.slots : clinicSlot?.slots ?? [],
      clinic_id: clinic.id,
      type: type,
    };

    handleCreate(payload);
  };

  const selectedBlockedSlots = watch("slots") ?? [];
  const isDateBlocked = useCallback(() => {
    return formattedAllBlockSlots.some(
      (bs) => isSameDay(bs.date, selectedDay) && bs.type === "date",
    );
  }, [selectedDay, formattedAllBlockSlots]);

  if (isBlockSlotsLoading) return <Spinner />;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="md:grid md:grid-cols-2">
        <div className="">
          <CustomCalendar
            selectedDay={selectedDay}
            setSelectedDay={setSelectedDay}
            slots={slots}
            today={today}
            blockedDates={formattedAllBlockSlots}
            daysOff={clinicSlot?.days_off ?? []}
          />
        </div>

        <div>
          {type === "slot" && !isDateBlocked() && (
            <div className="mt-12 md:mt-0 md:pl-14">
              <h2 className="font-semibold text-gray-900">
                <span>Block slots for </span>
                <time dateTime={format(selectedDay, "yyyy-MM-dd")}>
                  {format(selectedDay, "MMM dd, yyy")}
                </time>
              </h2>
              <div className="mt-4 space-y-2 text-sm leading-6 text-gray-500">
                {/* available slots */}
                <div>
                  <Label>Available Slots</Label>
                  {slots.length ? (
                    <div className="flex flex-wrap items-center justify-start gap-1">
                      {slots.map((slot) => (
                        <Badge
                          key={slot.toString()}
                          variant={
                            selectedBlockedSlots.includes(slot)
                              ? "destructive"
                              : "outline"
                          }
                          className={"cursor-pointer px-4 py-2"}
                          onClick={() =>
                            setValue("slots", [
                              ...new Set([...selectedBlockedSlots, slot]),
                            ])
                          }
                        >
                          {slot}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p>No Available slots.</p>
                  )}
                </div>

                {/* blocked slots */}
                <div>
                  <Label>Blocked Slots</Label>
                  {selectedBlockedSlots.length ? (
                    <div>
                      <div className="flex flex-wrap items-center justify-start gap-1">
                        {selectedBlockedSlots.map((slot) => (
                          <Badge
                            key={slot}
                            variant={"outline"}
                            className={"cursor-pointer px-4 py-2"}
                            onClick={() =>
                              setValue(
                                "slots",
                                selectedBlockedSlots.filter((s) => s !== slot),
                              )
                            }
                          >
                            {slot}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p>No blocked slots.</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {!isDateBlocked() && (
        <div className="text-end">
          <Button>Submit</Button>
        </div>
      )}
    </form>
  );
}
