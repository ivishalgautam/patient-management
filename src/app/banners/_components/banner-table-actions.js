"use client";
import { DataTableSearch } from "@/components/ui/table/data-table-search";
import { useBannerTableFilters } from "./use-banner-table-filters";
import { DataTableResetFilter } from "@/components/ui/table/data-table-reset-filter";

export default function BannerTableActions() {
  const {
    isAnyFilterActive,
    resetFilters,
    searchQuery,
    setPage,
    setSearchQuery,
  } = useBannerTableFilters();

  return (
    <div className="my-3 flex flex-wrap items-center gap-4">
      {/* <DataTableSearch
        searchKey="name"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setPage={setPage}
      /> */}
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
