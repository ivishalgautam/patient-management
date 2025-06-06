import Spinner from "@/components/Spinner";
import React, { Suspense } from "react";
import Accounts from "./_component/acounts-data";

export default function AcountsPage() {
  return (
    <Suspense fallback={<Spinner />}>
      <Accounts />
    </Suspense>
  );
}
