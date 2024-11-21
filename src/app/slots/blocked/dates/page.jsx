import { Suspense } from "react";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";
import { searchParamsCache, serialize } from "@/lib/searchparams";
import { Heading } from "@/components/ui/heading";
import PageContainer from "@/components/layout/page-container";
import BlockDateListing from "./_component/block-date-listing";
import BlockDateActions from "./_component/block-date-table-actions";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

export const metadata = {
  title: "Blocked dates",
};

export default async function Users({ searchParams }) {
  searchParamsCache.parse(searchParams);
  const key = serialize({ ...searchParams });

  return (
    <PageContainer>
      <div className="flex items-start justify-between">
        <Heading
          title="Blocked Dates"
          description="Manage Blocked dates (Create, Update, Delete)."
        />
      </div>
      <div className="flex items-center justify-between">
        <BlockDateActions />
        <Link
          className={buttonVariants({ variant: "outline" })}
          href={"create/date"}
        >
          <PlusIcon /> Block date
        </Link>
      </div>
      <Suspense
        key={key}
        fallback={<DataTableSkeleton columnCount={2} rowCount={10} />}
      >
        <BlockDateListing />
      </Suspense>
    </PageContainer>
  );
}
