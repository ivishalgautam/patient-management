import { Suspense } from "react";
import { serialize, searchParamsCache } from "@/lib/searchparams";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";
import { Heading } from "@/components/ui/heading";
import PageContainer from "@/components/layout/page-container";
import ReviewTableActions from "./_components/service-table-actions";
import ServicesListing from "./_components/services-listing";
import Link from "next/link";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export const metadata = {
  title: "Services",
};

export default async function Reviews({ searchParams }) {
  searchParamsCache.parse(searchParams);
  const key = serialize({ ...searchParams });

  return (
    <PageContainer>
      <div className="flex items-center justify-between">
        <Heading
          title={"My Services"}
          description={"Manage your services (Create, Update, Delete)."}
        />
        <Link
          className={cn(buttonVariants({ variant: "outline" }))}
          href={"/services/doctor/create"}
        >
          <Plus /> Add Service
        </Link>
      </div>
      <ReviewTableActions />

      <Suspense
        key={key}
        fallback={<DataTableSkeleton columnCount={4} rowCount={10} />}
      >
        <ServicesListing />
      </Suspense>
    </PageContainer>
  );
}
