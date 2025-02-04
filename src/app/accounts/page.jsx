"use client";
import AccountReports from "@/components/accounts-reports";
import Spinner from "@/components/Spinner";
import { fetchAccounts } from "@/server/treatment";
import { ClinicContext } from "@/store/clinic-context";
import { useQuery } from "@tanstack/react-query";
import React, { useContext } from "react";

export default function AccountsPage() {
  const { clinic } = useContext(ClinicContext);

  const { data, isLoading, isError, error } = useQuery({
    queryFn: () => fetchAccounts(clinic.id),
    queryKey: [`accounts-${clinic.id}`],
    enabled: !!clinic && !!clinic.id,
  });

  if (isLoading) return <Spinner />;
  if (isError) return error?.message ?? error;

  return (
    <>
      <AccountReports data={data ?? []} />
    </>
  );
}
