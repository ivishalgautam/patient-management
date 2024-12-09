"use client";
import { Controller, useForm } from "react-hook-form";
import { Button } from "../ui/button";
import CustomCalendar from "../ui/custom-calendar";
import { format, isSameDay, startOfToday } from "date-fns";
import { useCallback, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import { getByClinicId, getSlotByDateAndClinic } from "@/server/slot";
import { fetchBlockSlotsByClinicId } from "@/server/block-slot";
import Spinner from "../Spinner";
import { toast } from "sonner";
import { Badge } from "../ui/badge";
import { Label } from "../ui/label";
import ReactSelect from "react-select";
import ReactAsyncSelect from "react-select/async";
import { fetchFormattedServices } from "@/server/service";
import { cn } from "@/lib/utils";
import { searchPatients } from "@/server/users";

export default function BookSlotForm({ slots, clinic, handleCreate }) {
  const {
    register,
    control,
    formState: { errors },
    watch,
    setValue,
    handleSubmit,
  } = useForm({
    defaultValues: {
      date: new Date(),
      blockedSlots: [],
    },
  });
  let today = startOfToday();
  let [selectedDay, setSelectedDay] = useState(today);
  const formattedSelectedDay = moment(selectedDay).format("YYYY-MM-DD");
  const debounceTimeoutRef = useRef(null);

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
  const handleInputChange = useCallback((inputValue) => {
    return new Promise((resolve) => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      debounceTimeoutRef.current = setTimeout(async () => {
        if (!inputValue.trim()) return resolve([]);

        try {
          const formattedInput = inputValue.replace(/\s+/g, "-");
          const options = await searchPatients(formattedInput);
          resolve(options);
        } catch (error) {
          console.error("Error fetching categories:", error);
          resolve([]);
        }
      }, 300);
    });
  }, []);

  const { data: services, isLoading: isServiceLoading } = useQuery({
    queryKey: [`services`],
    queryFn: fetchFormattedServices,
  });

  const handleSelectDate = (date) => {
    setValue("slot", "");
    setSelectedDay(date);
  };

  const onSubmit = async (data) => {
    if (!data.slot) {
      return toast.warning("Please select atleast 1 slot.");
    }

    const payload = {
      clinic_id: clinic.id,
      date: formattedSelectedDay,
      slot: data.slot,
      patient_id: data.patient.value,
      service_id: data.service.value,
    };

    handleCreate(payload);
  };

  const selectedSlot = watch("slot");
  const isDateBlocked = useCallback(() => {
    return formattedAllBlockSlots.some(
      (bs) => isSameDay(bs.date, selectedDay) && bs.type === "date",
    );
  }, [selectedDay, formattedAllBlockSlots]);

  if (isBlockSlotsLoading) return <Spinner />;
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="gap-4 md:grid md:grid-cols-2">
        {/* patients */}
        <div>
          <Label>Patient</Label>
          <Controller
            control={control}
            name="patient"
            rules={{ required: "required*" }}
            render={({ field }) => (
              <ReactAsyncSelect
                loadOptions={handleInputChange}
                placeholder={"Search @username..."}
                value={field.value}
                onChange={field.onChange}
                menuPortalTarget={
                  typeof document !== "undefined" && document.body
                }
              />
            )}
          />
          {errors.patient && (
            <span className="text-red-500">{errors.patient.message}</span>
          )}
        </div>

        {/* services */}
        <div>
          <Label>Service</Label>
          <Controller
            control={control}
            name="service"
            rules={{ required: "required*" }}
            render={({ field }) => (
              <ReactSelect
                options={services}
                value={field.value}
                onChange={field.onChange}
                isLoading={isServiceLoading}
                menuPortalTarget={
                  typeof document !== "undefined" && document.body
                }
              />
            )}
          />
          {errors.service && (
            <span className="text-red-500">{errors.service.message}</span>
          )}
        </div>

        {/* calendar */}
        <div className="">
          <CustomCalendar
            selectedDay={selectedDay}
            setSelectedDay={handleSelectDate}
            slots={slots}
            today={today}
            blockedDates={formattedAllBlockSlots}
            daysOff={clinicSlot?.days_off ?? []}
          />
        </div>

        {/* slots */}
        {!isDateBlocked() && (
          <div className="mt-12 md:mt-0 md:pl-14">
            <h2 className="font-semibold text-gray-900">
              <span>Available slots for </span>
              <time dateTime={format(selectedDay, "yyyy-MM-dd")}>
                {format(selectedDay, "MMM dd, yyy")}
              </time>
            </h2>
            <div className="mt-4 space-y-2 text-sm leading-6 text-gray-500">
              {/* available slots */}
              <div>
                <Label>Slots</Label>
                {slots.length ? (
                  <div className="flex flex-wrap items-center justify-start gap-1">
                    {slots.map((slot) => (
                      <Badge
                        key={slot.toString()}
                        variant={
                          selectedSlot === slot
                            ? "default"
                            : blockedSlots?.slots?.includes(slot)
                              ? "destructive"
                              : "outline"
                        }
                        className={cn("cursor-pointer px-4 py-2", {
                          "pointer-events-none":
                            blockedSlots?.slots?.includes(slot),
                        })}
                        onClick={() => setValue("slot", slot)}
                      >
                        {slot}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p>No Available slots.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      {!isDateBlocked() && (
        <div className="text-end">
          <Button>Submit</Button>
        </div>
      )}
    </form>
  );
}
