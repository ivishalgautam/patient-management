import React, { Suspense } from "react";
import UserTableActions from "./user-table-actions";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";
import UserListing from "./user-listing";

export default function Table() {
  return (
    <>
      <UserTableActions />
      <Suspense fallback={<DataTableSkeleton columnCount={4} rowCount={10} />}>
        <UserListing />
      </Suspense>
    </>
  );
}
