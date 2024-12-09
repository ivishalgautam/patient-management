import { Suspense } from "react";
import { serialize, searchParamsCache } from "@/lib/searchparams";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";
import { Heading } from "@/components/ui/heading";
import PageContainer from "@/components/layout/page-container";
import ClinicTableActions from "./_components/dental-note-table-actions";
import DentalNoteListing from "./_components/dental-note-listing";

export const metadata = {
  title: "Dental Notes",
};

export default async function TreatmentPlan({ searchParams, params: { id } }) {
  searchParamsCache.parse(searchParams);
  const key = serialize({ ...searchParams });
  return (
    <PageContainer>
      <Heading
        title={"Dental Notes"}
        description={"Manage Dental Notes (Create, Update, Delete)."}
      />

      <ClinicTableActions />

      <Suspense
        key={key}
        fallback={<DataTableSkeleton columnCount={4} rowCount={10} />}
      >
        <DentalNoteListing treatmentId={id} />
      </Suspense>
    </PageContainer>
  );
}
