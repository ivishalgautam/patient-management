"use client";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { days } from "@/data/days";
import ReactSelect from "react-select";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import http from "@/utils/http";
import { endpoints } from "@/utils/endpoints";
import Spinner from "../Spinner";

export default function SlotForm({ slotId, type, handleUpdate, handleCreate }) {
  const {
    control,
    register,
    setValue,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm({
    defaultValues: {
      start_time: "",
      end_time: "",
      interval_in_minute: "",
      days_off: [],
    },
  });

  const { data: slot, isLoading } = useQuery({
    queryKey: [`slot-${slotId}`],
    queryFn: async () => {
      const { data } = await http().get(`${endpoints.slots.getAll}/${slotId}`);
      return data;
    },
    enabled: ["edit", "view"].includes(type) && !!slotId,
  });

  useEffect(() => {
    if (slot) {
      setValue("start_time", slot.start_time);
      setValue("end_time", slot.end_time);
      setValue("interval_in_minute", slot.interval_in_minute);
      setValue(
        "days_off",
        days.filter((so) => slot.days_off.includes(so.value)),
      );
    }
  }, [slot, setValue]);
  //   console.log(watch());
  const onSubmit = (data) => {
    const payload = {
      start_time: data.start_time,
      end_time: data.end_time,
      interval_in_minute: data.interval_in_minute,
      days_off: data.days_off.map((d) => d.value),
    };
    if (type === "create") {
      handleCreate(payload);
    } else {
      handleUpdate(payload);
    }
  };

  if (slotId && isLoading) return <Spinner />;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-2 gap-2">
        {/* start time */}
        <div>
          <Label>Start time</Label>
          <Input
            type="time"
            {...register("start_time", {
              required: "required*",
            })}
            placeholder="Select start time"
          />
          {errors.start_time && (
            <span className="text-red-500">{errors.start_time.message}</span>
          )}
        </div>

        {/* end time */}
        <div>
          <Label>End time</Label>
          <Input
            type="time"
            {...register("end_time", {
              required: "required*",
            })}
            placeholder="Select end time"
          />
          {errors.end_time && (
            <span className="text-red-500">{errors.end_time.message}</span>
          )}
        </div>

        {/* interval */}
        <div>
          <Label>Interval (In minutes.)</Label>
          <Input
            type="number"
            {...register("interval_in_minute", {
              required: "required*",
              valueAsNumber: true,
            })}
            placeholder="Enter Interval"
          />
          {errors.interval_in_minute && (
            <span className="text-red-500">
              {errors.interval_in_minute.message}
            </span>
          )}
        </div>

        {/* days off */}
        <div>
          <Label>Days Off</Label>
          <Controller
            control={control}
            name="days_off"
            rules={{ required: "required*" }}
            render={({ field: { value, onChange } }) => (
              <ReactSelect
                value={value}
                options={days}
                onChange={onChange}
                isMulti
                styles={{
                  menuPortal: (base) => ({
                    ...base,
                    zIndex: 9999,
                  }),
                }}
                menuPortalTarget={
                  typeof document !== "undefined" && document.body
                }
                menuPosition="absolute"
              />
            )}
          />

          {errors.days_off && (
            <span className="text-red-500">{errors.days_off.message}</span>
          )}
        </div>
      </div>
      <div className="mt-4 text-end">
        <Button>Submit</Button>
      </div>
    </form>
  );
}
