"use client";
import { DataTableSearch } from "@/components/ui/table/data-table-search";
import { useServiceTableFilters } from "./use-service-table-filters";
import { DataTableResetFilter } from "@/components/ui/table/data-table-reset-filter";
import { DataTableFilterBox } from "@/components/ui/table/data-table-filter-box";

export default function ServiceTableActions() {
  const {
    isAnyFilterActive,
    resetFilters,
    searchQuery,
    setPage,
    setSearchQuery,
  } = useServiceTableFilters();

  return (
    <div className="my-3 flex flex-wrap items-center gap-4">
      <DataTableSearch
        searchKey="name"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setPage={setPage}
      />
      {/* <DataTableFilterBox
        filterKey="Procedure"
        title="Role"
        options={[
          { label: "Patient", value: "patient" },
          { label: "Doctor", value: "doctor" },
        ]}
        setFilterValue={setRoleFilter}
        filterValue={roleFilter}
      /> */}
      <DataTableResetFilter
        isFilterActive={isAnyFilterActive}
        onReset={resetFilters}
      />
    </div>
  );
}
