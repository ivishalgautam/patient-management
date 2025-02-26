"use client";
import { DataTableSearch } from "@/components/ui/table/data-table-search";
import { useUserTableFilters } from "./use-user-table-filters";
import { DataTableResetFilter } from "@/components/ui/table/data-table-reset-filter";
import Link from "next/link";
import { Calendar, UserPlus } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function UserTableActions() {
  const {
    resetFilters,
    searchQuery,
    setPage,
    setSearchQuery,
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
      <Link
        href={"/users/create/patient"}
        className={buttonVariants({ variant: "" })}
      >
        <UserPlus size={20} /> Add Patient
      </Link>
      <Link
        href={"/appointments/create"}
        className={cn(
          buttonVariants({ variant: "primary" }),
          "bg-blue-500 text-white hover:bg-blue-500/90",
        )}
      >
        <Calendar size={20} /> Add Appointment
      </Link>
      <DataTableResetFilter
        isFilterActive={isAnyFilterActive}
        onReset={resetFilters}
      />
    </div>
  );
}
