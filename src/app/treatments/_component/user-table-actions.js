"use client";
import { DataTableSearch } from "@/components/ui/table/data-table-search";
import { useUserTableFilters } from "./use-user-table-filters";
import { DataTableResetFilter } from "@/components/ui/table/data-table-reset-filter";
import { DataTableFilterBox } from "@/components/ui/table/data-table-filter-box";

export default function UserTableActions() {
  const {
    resetFilters,
    searchQuery,
    setSearchQuery,
    username,
    setUsername,
    setPage,
    isAnyFilterActive,
  } = useUserTableFilters();

  return (
    <div className="my-3 flex flex-wrap items-center gap-4">
      <DataTableSearch
        searchKey="name"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setPage={setPage}
      />
      {/* <DataTableSearch
        searchKey="username"
        searchQuery={username}
        setSearchQuery={setUsername}
        setPage={setPage}
      /> */}
      <DataTableResetFilter
        isFilterActive={isAnyFilterActive}
        onReset={resetFilters}
      />
    </div>
  );
}
