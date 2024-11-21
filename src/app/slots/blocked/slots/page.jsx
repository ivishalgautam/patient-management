import { Suspense } from "react";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";
import { searchParamsCache, serialize } from "@/lib/searchparams";
import { Heading } from "@/components/ui/heading";
import PageContainer from "@/components/layout/page-container";
import BlockDateListing from "./_component/block-date-listing";
import BlockDateActions from "./_component/block-date-table-actions";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export const metadata = {
  title: "Blocked slots",
};

export default async function Users({ searchParams }) {
  searchParamsCache.parse(searchParams);
  const key = serialize({ ...searchParams });

  return (
    <PageContainer>
      <div className="flex items-start justify-between">
        <Heading
          title="Blocked Slots"
          description="Manage Blocked slots (Create, Update, Delete)."
        />
      </div>
      <div className="flex items-center justify-between">
        <BlockDateActions />
        <Link
          className={buttonVariants({ variant: "outline" })}
          href={"create/slot"}
        >
          <PlusIcon /> Block slot
        </Link>
      </div>
      <Suspense
        key={key}
        fallback={<DataTableSkeleton columnCount={3} rowCount={10} />}
      >
        <BlockDateListing />
      </Suspense>
    </PageContainer>
  );
}
