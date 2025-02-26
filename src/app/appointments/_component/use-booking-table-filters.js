import { searchParams } from "@/lib/searchparams";
import { addDays } from "date-fns";
import moment from "moment";
import { useQueryState } from "nuqs";
import { useCallback, useMemo } from "react";

export function useBookingTableFilters() {
  const [searchQuery, setSearchQuery] = useQueryState(
    "q",
    searchParams.q
      .withOptions({ shallow: false, throttleMs: 1000 })
      .withDefault(""),
  );

  const [page, setPage] = useQueryState(
    "page",
    searchParams.page.withDefault(1),
  );

  const [startDate, setStartDate] = useQueryState(
    "start_date",
    searchParams.start_date.withDefault(""),
  );

  const [endDate, setEndDate] = useQueryState(
    "end_date",
    searchParams.end_date.withDefault(""),
  );

  const resetFilters = useCallback(() => {
    setSearchQuery(null);
    setStartDate(null);
    setEndDate(null);

    setPage(1);
  }, [setSearchQuery, setPage, setStartDate, setEndDate]);

  const isAnyFilterActive = useMemo(() => {
    return !!searchQuery || !!startDate || !endDate;
  }, [searchQuery, startDate, endDate]);

  return {
    searchQuery,
    setSearchQuery,
    page,
    setPage,
    resetFilters,
    isAnyFilterActive,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
  };
}
