"use client";
import { DataTableSearch } from "@/components/ui/table/data-table-search";
import { useTableFilters } from "./use-table-filters";
import { DataTableResetFilter } from "@/components/ui/table/data-table-reset-filter";
import { DataTableFilterBox } from "@/components/ui/table/data-table-filter-box";

export default function TableActions() {
  const {
    isAnyFilterActive,
    resetFilters,
    searchQuery,
    setPage,
    setSearchQuery,
    typeFilter,
    setTypeFilter,
    methodFilter,
    setMethodFilter,
  } = useTableFilters();

  return (
    <div className="my-3 flex flex-wrap items-center gap-4">
      <DataTableSearch
        searchKey=""
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setPage={setPage}
      />
      <DataTableFilterBox
        filterKey="type"
        title="Payment type"
        options={[
          { label: "Installment", value: "installment" },
          { label: "Full", value: "full" },
        ]}
        setFilterValue={setTypeFilter}
        filterValue={typeFilter}
      />
      <DataTableFilterBox
        filterKey="method"
        title="Payment Method"
        options={[
          { label: "Upi", value: "upi" },
          { label: "Cash", value: "cash" },
          { label: "Other", value: "other" },
        ]}
        setFilterValue={setMethodFilter}
        filterValue={methodFilter}
      />
      <DataTableResetFilter
        isFilterActive={isAnyFilterActive}
        onReset={resetFilters}
      />
    </div>
  );
}
