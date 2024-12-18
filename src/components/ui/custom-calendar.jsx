import { MainContext } from "@/store/context";
import { Menu, Transition } from "@headlessui/react";
import { DotsVerticalIcon } from "@heroicons/react/outline";
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isBefore,
  isEqual,
  isSameDay,
  isSameMonth,
  isToday,
  parse,
  parseISO,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import moment from "moment";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function CustomCalendar({
  slots = [],
  today,
  selectedDay,
  setSelectedDay,
  blockedDates,
  daysOff = [],
}) {
  let [currentMonth, setCurrentMonth] = useState(format(today, "MMM-yyyy"));
  let firstDayCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date());

  let days = eachDayOfInterval({
    start: firstDayCurrentMonth,
    end: endOfMonth(firstDayCurrentMonth),
  });

  function previousMonth() {
    let firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
  }

  function nextMonth() {
    let firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
  }

  const isDateBlocked = (day) => {
    return blockedDates.some(
      (d) => isEqual(format(day, "yyyy-MM-dd"), d.date) && d.type === "date",
    );
  };

  const isDayOff = (day) => {
    return daysOff.includes(getDay(day));
  };

  const isSlotExpired = useCallback(
    (slot) => {
      const formatDate = `${format(selectedDay, "yyyy-MM-dd")}T${slot}`;
      return isBefore(formatDate, moment().format());
    },
    [selectedDay],
  );

  const isSlotsBlock = useCallback(
    (day) => {
      return blockedDates.some((d) =>
        isEqual(format(day, "yyyy-MM-dd"), d.date),
      );
    },
    [blockedDates],
  );

  return (
    <div className="rounded-lg bg-white p-8 md:divide-x md:divide-gray-200">
      <div className="md:pr-14">
        <div className="flex items-center">
          <h2 className="flex-auto font-semibold text-gray-900">
            {format(firstDayCurrentMonth, "MMMM yyyy")}
          </h2>
          <button
            type="button"
            onClick={previousMonth}
            className="-my-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
          >
            <span className="sr-only">Previous month</span>
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            onClick={nextMonth}
            type="button"
            className="-my-1.5 -mr-1.5 ml-2 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
          >
            <span className="sr-only">Next month</span>
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <div className="mt-10 grid grid-cols-7 text-center text-xs leading-6 text-gray-500">
          <div>S</div>
          <div>M</div>
          <div>T</div>
          <div>W</div>
          <div>T</div>
          <div>F</div>
          <div>S</div>
        </div>

        <div className="mt-2 grid grid-cols-7 text-sm">
          {days.map((day, dayIdx) => (
            <div
              key={day.toString()}
              className={classNames(
                dayIdx === 0 && colStartClasses[getDay(day)],
                "py-1.5",
              )}
            >
              <button
                type="button"
                onClick={() => setSelectedDay(day)}
                disabled={isDateBlocked(day)}
                className={classNames(
                  isEqual(day, selectedDay) && "text-white",
                  !isEqual(day, selectedDay) && isToday(day) && "text-primary",
                  !isEqual(day, selectedDay) &&
                    !isToday(day) &&
                    isSameMonth(day, firstDayCurrentMonth) &&
                    "text-gray-900",
                  !isEqual(day, selectedDay) &&
                    !isToday(day) &&
                    !isSameMonth(day, firstDayCurrentMonth) &&
                    "text-gray-400",
                  isEqual(day, selectedDay) && isToday(day) && "bg-primary",
                  isEqual(day, selectedDay) && !isToday(day) && "bg-gray-900",
                  !isEqual(day, selectedDay) && "hover:bg-gray-200",
                  (isEqual(day, selectedDay) || isToday(day)) &&
                    "font-semibold",
                  slots?.some((slot) => isSameDay(parseISO(slot), day)) &&
                    !isEqual(day, selectedDay) &&
                    "bg-primary",
                  isSlotsBlock(day) && "bg-gray-200",
                  isDateBlocked(day) &&
                    "pointer-events-none cursor-not-allowed bg-red-200",
                  isDayOff(day) &&
                    "pointer-events-none cursor-not-allowed !text-red-500",
                  isBefore(day, today) && "pointer-events-none !text-gray-300",
                  "relative mx-auto flex h-8 w-8 items-center justify-center rounded-full",
                )}
              >
                <time dateTime={format(day, "yyyy-MM-dd")}>
                  {format(day, "d")}
                </time>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

let colStartClasses = [
  "",
  "col-start-2",
  "col-start-3",
  "col-start-4",
  "col-start-5",
  "col-start-6",
  "col-start-7",
];
