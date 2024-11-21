import { Suspense } from "react";
import UserTableActions from "./_component/user-table-actions";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";
import UserListing from "./_component/user-listing";
import { searchParamsCache, serialize } from "@/lib/searchparams";
import { Heading } from "@/components/ui/heading";
import PageContainer from "@/components/layout/page-container";

export const metadata = {
  title: "Users",
};

export default async function Users({ searchParams }) {
  searchParamsCache.parse(searchParams);
  const key = serialize({ ...searchParams });

  return (
    <PageContainer>
      <div className="flex items-start justify-between">
        <Heading
          title="Users"
          description="Manage users (Create, Update, Delete)."
        />
      </div>
      <UserTableActions />
      <Suspense
        key={key}
        fallback={<DataTableSkeleton columnCount={4} rowCount={10} />}
      >
        <UserListing />
      </Suspense>
    </PageContainer>
  );
}
