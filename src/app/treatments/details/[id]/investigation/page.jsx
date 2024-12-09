import { Suspense } from "react";
import { serialize, searchParamsCache } from "@/lib/searchparams";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";
import { Heading } from "@/components/ui/heading";
import PageContainer from "@/components/layout/page-container";
import ClinicTableActions from "./_components/table-actions";
import Listing from "./_components/listing";
import TableActions from "./_components/table-actions";

export const metadata = {
  title: "Investigations",
};

export default async function TreatmentPlan({ searchParams, params: { id } }) {
  searchParamsCache.parse(searchParams);
  const key = serialize({ ...searchParams });
  return (
    <PageContainer>
      <Heading
        title={"Investigations"}
        description={"Manage Investigations (Create, Update, Delete)."}
      />

      <TableActions />

      <Suspense
        key={key}
        fallback={<DataTableSkeleton columnCount={4} rowCount={10} />}
      >
        <Listing treatmentId={id} />
      </Suspense>
    </PageContainer>
  );
}
