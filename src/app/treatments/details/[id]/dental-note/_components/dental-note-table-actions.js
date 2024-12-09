"use client";
import { DataTableSearch } from "@/components/ui/table/data-table-search";
import { useDentalNoteTableFilters } from "./use-dental-note-table-filters";
import { DataTableResetFilter } from "@/components/ui/table/data-table-reset-filter";

export default function DentalNoteTableActions() {
  const {
    isAnyFilterActive,
    resetFilters,
    searchQuery,
    setPage,
    setSearchQuery,
  } = useDentalNoteTableFilters();

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
