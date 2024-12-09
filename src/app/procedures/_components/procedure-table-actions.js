"use client";
import { DataTableSearch } from "@/components/ui/table/data-table-search";
import { useProcedureTableFilters } from "./use-procedure-table-filters";
import { DataTableResetFilter } from "@/components/ui/table/data-table-reset-filter";

export default function ProcedureTableActions() {
  const {
    isAnyFilterActive,
    resetFilters,
    searchQuery,
    setPage,
    setSearchQuery,
  } = useProcedureTableFilters();

  return (
    <div className="my-3 flex flex-wrap items-center gap-4">
      <DataTableSearch
        searchKey="name"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setPage={setPage}
      />
      <DataTableResetFilter
        isFilterActive={isAnyFilterActive}
        onReset={resetFilters}
      />
    </div>
  );
}
