import { Suspense } from "react";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";
import { searchParamsCache, serialize } from "@/lib/searchparams";
import { Heading } from "@/components/ui/heading";
import PageContainer from "@/components/layout/page-container";
import TableActions from "./_component/table-actions";
import Listing from "./_component/listing";
import Spinner from "@/components/Spinner";

export const metadata = {
  title: "Treatments",
};

export default async function Users({ searchParams, params: { id } }) {
  searchParamsCache.parse(searchParams);
  const key = serialize({ ...searchParams });

  return (
    <PageContainer>
      <div className="flex items-start justify-between">
        <Heading title="Treatments" description="Manage treatments." />
      </div>
      <TableActions />
      <Suspense key={key} fallback={<Spinner />}>
        <Listing patientId={id} />
      </Suspense>
    </PageContainer>
  );
}
