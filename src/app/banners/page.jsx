import { Suspense } from "react";
import { serialize, searchParamsCache } from "@/lib/searchparams";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";
import { Heading } from "@/components/ui/heading";
import PageContainer from "@/components/layout/page-container";
import BannerListing from "./_components/banner-listing";
import BannerTableActions from "./_components/banner-table-actions";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export const metadata = {
  title: "Banners",
};

export default async function BannersPage({ searchParams }) {
  searchParamsCache.parse(searchParams);
  const key = serialize({ ...searchParams });

  return (
    <PageContainer>
      <div className="flex items-center justify-between">
        <Heading
          title={"Banners"}
          description={"Manage Banners (Create, Update, Delete)."}
        />
        <Link
          href={"/banners/create"}
          className={buttonVariants({ variant: "outline" })}
        >
          Create
        </Link>
      </div>
      <BannerTableActions />

      <Suspense
        key={key}
        fallback={<DataTableSkeleton columnCount={4} rowCount={10} />}
      >
        <BannerListing />
      </Suspense>
    </PageContainer>
  );
}
