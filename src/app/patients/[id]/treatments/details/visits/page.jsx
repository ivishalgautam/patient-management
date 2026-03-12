import { Suspense } from "react";
import { serialize, searchParamsCache } from "@/lib/searchparams";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";
import { Heading } from "@/components/ui/heading";
import PageContainer from "@/components/layout/page-container";
import Listing from "./_components/listing";
import TableActions from "./_components/table-actions";

export const metadata = {
  title: "Visits",
};

export default async function TreatmentPlan({ searchParams, params: { id } }) {
  searchParamsCache.parse(searchParams);
  const key = serialize({ ...searchParams });
  return (
    <PageContainer>
      <Heading
        title={"Visits"}
        description={"Manage Visits (Create, Update, Delete)."}
      />

      {/* <TableActions /> */}

      <Suspense
        key={key}
        fallback={<DataTableSkeleton columnCount={4} rowCount={10} />}
      >
        <Listing patientId={id} />
      </Suspense>
    </PageContainer>
  );
}
