import { Suspense } from "react";
import { serialize, searchParamsCache } from "@/lib/searchparams";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";
import { Heading } from "@/components/ui/heading";
import PageContainer from "@/components/layout/page-container";
import ClinicsListing from "./_components/clinics-listing";
import ClinicTableActions from "./_components/clinic-table-actions";
import Link from "next/link";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export const metadata = {
  title: "Clinics",
};

export default async function ClinicsPage({ searchParams }) {
  searchParamsCache.parse(searchParams);
  const key = serialize({ ...searchParams });

  return (
    <PageContainer>
      <div className="flex items-center justify-between">
        <Heading
          title={"Clinics"}
          description={"Manage clinics (Create, Update, Delete)."}
        />
        <Link
          href={"/clinics/create"}
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          <Plus className="mr-1" /> Create clinic
        </Link>
      </div>

      <ClinicTableActions />

      <Suspense
        key={key}
        fallback={<DataTableSkeleton columnCount={4} rowCount={10} />}
      >
        <ClinicsListing />
      </Suspense>
    </PageContainer>
  );
}
