"use client";

import * as React from "react";
import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import moment from "moment";

export function DatePickerWithRange({
  className,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}) {
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild className="w-full">
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "min-w-[245px] justify-start text-left font-normal",
              !startDate && !!endDate && "text-muted-foreground",
            )}
          >
            <CalendarIcon />
            {startDate ? (
              endDate ? (
                <>
                  {format(startDate, "LLL dd, y")} -{" "}
                  {format(endDate, "LLL dd, y")}
                </>
              ) : (
                format(startDate, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={new Date()}
            defaultYear={2024}
            selected={{ from: startDate, to: endDate }}
            onSelect={(date) => {
              date?.from
                ? setStartDate(moment(date.from).format("YYYY-MM-DD"))
                : null;
              date?.to
                ? setEndDate(moment(date.to).format("YYYY-MM-DD"))
                : null;
            }}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
