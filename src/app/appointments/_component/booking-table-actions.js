"use client";
import { DataTableSearch } from "@/components/ui/table/data-table-search";
import { useBookingTableFilters } from "./use-booking-table-filters";
import { DataTableResetFilter } from "@/components/ui/table/data-table-reset-filter";
import { DataTableFilterBox } from "@/components/ui/table/data-table-filter-box";
import { DataTableDatePickerWithRange } from "@/components/ui/table/data-table-date-range-selector";

export default function BookingActions() {
  const {
    resetFilters,
    searchQuery,
    setPage,
    setSearchQuery,
    isAnyFilterActive,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
  } = useBookingTableFilters();

  return (
    <div className="my-3 flex flex-wrap items-center gap-4">
      <DataTableSearch
        searchKey=""
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setPage={setPage}
      />
      <DataTableDatePickerWithRange
        {...{ startDate, setStartDate, endDate, setEndDate }}
      />
      <DataTableResetFilter
        isFilterActive={isAnyFilterActive}
        onReset={resetFilters}
      />
    </div>
  );
}
