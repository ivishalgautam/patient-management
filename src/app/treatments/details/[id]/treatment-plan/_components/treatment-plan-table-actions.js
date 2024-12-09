"use client";
import { DataTableSearch } from "@/components/ui/table/data-table-search";
import { useTreatmentPlanTableFilters } from "./use-treatment-plan-table-filters";
import { DataTableResetFilter } from "@/components/ui/table/data-table-reset-filter";

export default function TreatmentPlanTableActions() {
  const {
    isAnyFilterActive,
    resetFilters,
    searchQuery,
    setPage,
    setSearchQuery,
  } = useTreatmentPlanTableFilters();

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
