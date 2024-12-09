import { Suspense } from "react";
import { serialize, searchParamsCache } from "@/lib/searchparams";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";
import { Heading } from "@/components/ui/heading";
import PageContainer from "@/components/layout/page-container";
import ClinicTableActions from "./_components/treatment-plan-table-actions";
import Link from "next/link";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import TreatmentPlanListing from "./_components/treatment-plan-listing";

export const metadata = {
  title: "Treatment plans",
};

export default async function TreatmentPlan({ searchParams, params: { id } }) {
  searchParamsCache.parse(searchParams);
  const key = serialize({ ...searchParams });
  return (
    <PageContainer>
      <Heading
        title={"Treatment plans"}
        description={"Manage treatment plans (Create, Update, Delete)."}
      />

      <ClinicTableActions />

      <Suspense
        key={key}
        fallback={<DataTableSkeleton columnCount={4} rowCount={10} />}
      >
        <TreatmentPlanListing treatmentId={id} />
      </Suspense>
    </PageContainer>
  );
}
