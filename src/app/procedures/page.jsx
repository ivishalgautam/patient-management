import { Suspense } from "react";
import { serialize, searchParamsCache } from "@/lib/searchparams";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";
import { Heading } from "@/components/ui/heading";
import PageContainer from "@/components/layout/page-container";
import ReviewTableActions from "./_components/procedure-table-actions";
import ProcedureListing from "./_components/procedure-listing";

export const metadata = {
  title: "Procedures",
};

export default async function Reviews({ searchParams }) {
  searchParamsCache.parse(searchParams);
  const key = serialize({ ...searchParams });

  return (
    <PageContainer>
      <div className="flex items-center justify-between">
        <Heading
          title={"Procedures"}
          description={"Manage procedures (View, Delete)."}
        />
      </div>
      <ReviewTableActions />

      <Suspense
        key={key}
        fallback={<DataTableSkeleton columnCount={4} rowCount={10} />}
      >
        <ProcedureListing />
      </Suspense>
    </PageContainer>
  );
}
