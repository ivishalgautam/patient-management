import { Suspense } from "react";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";
import { searchParamsCache, serialize } from "@/lib/searchparams";
import { Heading } from "@/components/ui/heading";
import PageContainer from "@/components/layout/page-container";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import BookingsListing from "./_component/booking-listing";
import BookingActions from "./_component/booking-table-actions";

export const metadata = {
  title: "Appointments",
};

export default async function Users({ searchParams }) {
  searchParamsCache.parse(searchParams);
  const key = serialize({ ...searchParams });

  return (
    <PageContainer>
      <div className="flex items-start justify-between">
        <Heading
          title="My Appointments"
          description="Manage appointments (Create, Update, Delete)."
        />
      </div>
      <div className="flex items-center justify-between">
        <div className="shrink-0">
          <BookingActions />
        </div>
        <Link
          className={cn(buttonVariants({ variant: "outline" }))}
          href={"/appointments/create"}
        >
          <PlusIcon /> Create
        </Link>
      </div>
      <Suspense
        key={key}
        fallback={<DataTableSkeleton columnCount={6} rowCount={10} />}
      >
        <BookingsListing />
      </Suspense>
    </PageContainer>
  );
}
