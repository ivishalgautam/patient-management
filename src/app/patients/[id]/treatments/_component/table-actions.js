"use client";
import { DataTableSearch } from "@/components/ui/table/data-table-search";
import { useTableFilters } from "./use-table-filters";
import { DataTableResetFilter } from "@/components/ui/table/data-table-reset-filter";
import { CreateDialog } from "./create-dialog";
import { useState } from "react";
import { useParams } from "next/navigation";

export default function TableActions() {
  const {
    resetFilters,
    searchQuery,
    setSearchQuery,
    setPage,
    isAnyFilterActive,
  } = useTableFilters();

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
