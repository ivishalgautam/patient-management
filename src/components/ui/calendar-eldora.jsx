"use client";

import * as React from "react";
import {
  RiArrowLeftDoubleLine,
  RiArrowLeftSLine,
  RiArrowRightDoubleLine,
  RiArrowRightSLine,
} from "@remixicon/react";
import {
  addYears,
  format,
  isSameMonth,
  getMonth,
  getYear,
  setMonth,
  setYear,
} from "date-fns";
import {
  DayPicker,
  useDayPicker,
  useDayRender,
  useNavigation,
} from "react-day-picker";
import { cn, focusRing } from "@/lib/utils";

const NavigationButton = React.forwardRef(
  ({ onClick, icon, disabled, ...props }, forwardedRef) => {
    const Icon = icon;
    return (
      <button
        ref={forwardedRef}
        type="button"
        disabled={disabled}
        className={cn(
          "flex size-8 shrink-0 select-none items-center justify-center rounded border p-1 outline-hidden transition sm:size-[30px]",
          // text color
          "text-gray-600 hover:text-gray-800",
          "dark:text-gray-400 dark:hover:text-gray-200",
          // border color
          "border-gray-300 dark:border-gray-800",
          // background color
          "hover:bg-gray-50 active:bg-gray-100",
          "dark:hover:bg-gray-900 dark:active:bg-gray-800",
          // disabled
          "disabled:pointer-events-none",
          "disabled:border-gray-200 dark:disabled:border-gray-800",
          "disabled:text-gray-400 dark:disabled:text-gray-600",
          focusRing,
        )}
        onClick={onClick}
        {...props}
      >
        <Icon className="size-full shrink-0" />
      </button>
    );
  },
);

NavigationButton.displayName = "NavigationButton";

const Calendar = ({
  mode = "single",
  weekStartsOn = 1,
  numberOfMonths = 1,
  enableYearNavigation = false,
  disableNavigation,
  locale,
  className,
  classNames,
  captionLayout = "buttons",
  ...props
}) => {
  return (
    <DayPicker
      mode={mode}
      weekStartsOn={weekStartsOn}
      numberOfMonths={numberOfMonths}
      locale={locale}
      showOutsideDays={numberOfMonths === 1 ? true : false}
      className={cn(className)}
      classNames={{
        months: "flex space-y-0",
        month: "space-y-4 p-3",
        nav: "gap-1 flex items-center rounded-full size-full justify-between p-4",
        table: "w-full border-collapse space-y-1",
        head_cell:
          "w-9 font-medium text-sm sm:text-xs text-center text-gray-400 dark:text-gray-600 pb-2",
        row: "w-full mt-0.5",
        cell: cn(
          "relative p-0 text-center focus-within:relative",
          "text-gray-900 dark:text-gray-50",
        ),
        day: cn(
          "size-9 rounded text-sm text-gray-900 dark:text-gray-50",
          "hover:bg-gray-200 dark:hover:bg-gray-700",
          focusRing,
        ),
        day_today: "font-semibold",
        day_selected: cn(
          "rounded",
          "aria-selected:bg-gray-900 aria-selected:text-gray-50",
          "dark:aria-selected:bg-gray-50 dark:aria-selected:text-gray-900",
        ),
        day_disabled:
          "text-gray-300! dark:text-gray-700! line-through disabled:hover:bg-transparent",
        day_outside: "text-gray-400 dark:text-gray-600",
        day_range_middle: cn(
          "rounded-none!",
          "aria-selected:bg-gray-100! aria-selected:text-gray-900!",
          "dark:aria-selected:bg-gray-900! dark:aria-selected:text-gray-50!",
        ),
        day_range_start: "rounded-r-none rounded-l!",
        day_range_end: "rounded-l-none rounded-r!",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: () => (
          <RiArrowLeftSLine aria-hidden="true" className="size-4" />
        ),
        IconRight: () => (
          <RiArrowRightSLine aria-hidden="true" className="size-4" />
        ),
        Caption: ({ ...props }) => {
          const {
            goToMonth,
            nextMonth,
            previousMonth,
            currentMonth,
            displayMonths,
          } = useNavigation();
          const {
            numberOfMonths,
            fromDate,
            toDate,
            fromYear,
            fromMonth,
            toMonth,
            toYear,
          } = useDayPicker();

          const displayIndex = displayMonths.findIndex((month) =>
            isSameMonth(props.displayMonth, month),
          );
          const isFirst = displayIndex === 0;
          const isLast = displayIndex === displayMonths.length - 1;

          const hideNextButton = numberOfMonths > 1 && (isFirst || !isLast);
          const hidePreviousButton = numberOfMonths > 1 && (isLast || !isFirst);

          const goToPreviousYear = () => {
            const targetMonth = addYears(currentMonth, -1);
            if (
              previousMonth &&
              (!fromDate || targetMonth.getTime() >= fromDate.getTime())
            ) {
              goToMonth(targetMonth);
            }
          };

          const goToNextYear = () => {
            const targetMonth = addYears(currentMonth, 1);
            if (
              nextMonth &&
              (!toDate || targetMonth.getTime() <= toDate.getTime())
            ) {
              goToMonth(targetMonth);
            }
          };

          const handleYearChange = (event) => {
            const newYear = parseInt(event.target.value, 10);
            const updatedMonth = setYear(currentMonth, newYear);
            goToMonth(updatedMonth);
          };

          const handleMonthChange = (event) => {
            const newMonth = parseInt(event.target.value, 10);
            const updatedMonth = setMonth(currentMonth, newMonth);
            goToMonth(updatedMonth);
          };

          const monthsList = Array.from({ length: 12 }, (_, i) => ({
            value: i,
            label: format(setMonth(new Date(), i), "MMM"),
          }));

          const yearFrom =
            fromYear || fromMonth?.getFullYear() || fromDate?.getFullYear();
          const lastYear =
            toYear || toMonth?.getFullYear() || toDate?.getFullYear();

          let selectedItems = [];

          if (yearFrom && lastYear) {
            const yearLength = lastYear - yearFrom + 1;
            selectedItems = Array.from({ length: yearLength }, (_, i) => ({
              label: (yearFrom + i).toString(),
              value: (yearFrom + i).toString(),
            }));
          }

          return (
            <div className="flex items-center justify-between">
              {captionLayout === "dropdown-buttons" ? (
                <>
                  <div className="flex items-center gap-1">
                    {enableYearNavigation && !hidePreviousButton && (
                      <NavigationButton
                        disabled={
                          disableNavigation ||
                          !previousMonth ||
                          (fromDate &&
                            addYears(currentMonth, -1).getTime() <
                              fromDate.getTime())
                        }
                        aria-label="Go to previous year"
                        onClick={goToPreviousYear}
                        icon={RiArrowLeftDoubleLine}
                      />
                    )}
                    {!hidePreviousButton && (
                      <NavigationButton
                        disabled={disableNavigation || !previousMonth}
                        aria-label="Go to previous month"
                        onClick={() =>
                          previousMonth && goToMonth(previousMonth)
                        }
                        icon={RiArrowLeftSLine}
                      />
                    )}
                  </div>

                  <div className="m-2 flex items-center gap-2">
                    <select
                      value={getMonth(currentMonth)}
                      onChange={handleMonthChange}
                      className="rounded border px-2 py-1 text-sm"
                    >
                      {monthsList.map((month) => (
                        <option key={month.value} value={month.value}>
                          {format(setMonth(new Date(), month.value), "MMMM", {
                            locale,
                          })}
                        </option>
                      ))}
                    </select>

                    <select
                      value={getYear(currentMonth)}
                      onChange={handleYearChange}
                      className="rounded border px-2 py-1 text-sm"
                    >
                      {selectedItems.map((year) => (
                        <option key={year.value} value={year.value}>
                          {year.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-1">
                    {!hideNextButton && (
                      <NavigationButton
                        disabled={disableNavigation || !nextMonth}
                        aria-label="Go to next month"
                        onClick={() => nextMonth && goToMonth(nextMonth)}
                        icon={RiArrowRightSLine}
                      />
                    )}
                    {enableYearNavigation && !hideNextButton && (
                      <NavigationButton
                        disabled={
                          disableNavigation ||
                          !nextMonth ||
                          (toDate &&
                            addYears(currentMonth, 1).getTime() >
                              toDate.getTime())
                        }
                        aria-label="Go to next year"
                        onClick={goToNextYear}
                        icon={RiArrowRightDoubleLine}
                      />
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-1">
                    {enableYearNavigation && !hidePreviousButton && (
                      <NavigationButton
                        disabled={
                          disableNavigation ||
                          !previousMonth ||
                          (fromDate &&
                            addYears(currentMonth, -1).getTime() <
                              fromDate.getTime())
                        }
                        aria-label="Go to previous year"
                        onClick={goToPreviousYear}
                        icon={RiArrowLeftDoubleLine}
                      />
                    )}
                    {!hidePreviousButton && (
                      <NavigationButton
                        disabled={disableNavigation || !previousMonth}
                        aria-label="Go to previous month"
                        onClick={() =>
                          previousMonth && goToMonth(previousMonth)
                        }
                        icon={RiArrowLeftSLine}
                      />
                    )}
                  </div>

                  <div
                    role="presentation"
                    aria-live="polite"
                    className="text-sm font-medium capitalize tabular-nums text-gray-900 dark:text-gray-50"
                  >
                    {format(props.displayMonth, "LLLL yyy", { locale })}
                  </div>

                  <div className="flex items-center gap-1">
                    {!hideNextButton && (
                      <NavigationButton
                        disabled={disableNavigation || !nextMonth}
                        aria-label="Go to next month"
                        onClick={() => nextMonth && goToMonth(nextMonth)}
                        icon={RiArrowRightSLine}
                      />
                    )}
                    {enableYearNavigation && !hideNextButton && (
                      <NavigationButton
                        disabled={
                          disableNavigation ||
                          !nextMonth ||
                          (toDate &&
                            addYears(currentMonth, 1).getTime() >
                              toDate.getTime())
                        }
                        aria-label="Go to next year"
                        onClick={goToNextYear}
                        icon={RiArrowRightDoubleLine}
                      />
                    )}
                  </div>
                </>
              )}
            </div>
          );
        },
        Day: ({ date, displayMonth }) => {
          const buttonRef = React.useRef(null);
          const { activeModifiers, buttonProps, divProps, isButton, isHidden } =
            useDayRender(date, displayMonth, buttonRef);

          const { selected, today, disabled, range_middle } = activeModifiers;

          if (isHidden) {
            return <></>;
          }

          if (!isButton) {
            return (
              <div
                {...divProps}
                className={cn(
                  "flex items-center justify-center",
                  divProps.className,
                )}
              />
            );
          }

          const {
            children: buttonChildren,
            className: buttonClassName,
            ...buttonPropsRest
          } = buttonProps;

          return (
            <button
              ref={buttonRef}
              {...buttonPropsRest}
              type="button"
              className={cn("relative", buttonClassName)}
            >
              {buttonChildren}
              {today && (
                <span
                  className={cn(
                    "absolute inset-x-1/2 bottom-1.5 h-0.5 w-4 -translate-x-1/2 rounded-[2px]",
                    {
                      "bg-blue-500 dark:bg-blue-500": !selected,
                      "bg-white! dark:bg-gray-950!": selected,
                      "bg-gray-400! dark:bg-gray-600!":
                        selected && range_middle,
                      "bg-gray-400 text-gray-400 dark:bg-gray-400 dark:text-gray-600":
                        disabled,
                    },
                  )}
                />
              )}
            </button>
          );
        },
      }}
      {...props}
    />
  );
};

Calendar.displayName = "Calendar";

export { Calendar };
