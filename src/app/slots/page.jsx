import { Suspense } from "react";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";
import { searchParamsCache, serialize } from "@/lib/searchparams";
import { Heading } from "@/components/ui/heading";
import PageContainer from "@/components/layout/page-container";
import BlockDateActions from "./_component/slot-table-actions";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import SlotsListing from "./_component/slot-listing";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Slots",
};

export default async function Users({ searchParams }) {
  searchParamsCache.parse(searchParams);
  const key = serialize({ ...searchParams });

  return (
    <PageContainer>
      <div className="flex items-start justify-between">
        <Heading
          title="Slot"
          description="Manage Slot (Create, Update, Delete)."
        />
      </div>
      <div className="my-3.5 text-end">
        <Link
          className={cn(buttonVariants({ variant: "outline" }))}
          href={"/slots/create"}
        >
          <PlusIcon /> Create slot
        </Link>
      </div>
      <Suspense
        key={key}
        fallback={<DataTableSkeleton columnCount={2} rowCount={10} />}
      >
        <SlotsListing />
      </Suspense>
    </PageContainer>
  );
}
