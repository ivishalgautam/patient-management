"use client";
import AccountReports from "@/components/accounts-reports";
import Spinner from "@/components/Spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchAccounts } from "@/server/treatment";
import { ClinicContext } from "@/store/clinic-context";
import { useQuery } from "@tanstack/react-query";
import React, { useContext } from "react";
import { getYear } from "date-fns";
import {
  parseAsIsoDateTime,
  parseAsString,
  queryTypes,
  useQueryState,
} from "nuqs";
import { useSearchParams } from "next/navigation";
import { DatePickerWithRange } from "./_component/date-range-selector";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function AccountsPage() {
  const { clinic } = useContext(ClinicContext);
  const searchParams = useSearchParams();
  const searchParamStr = searchParams.toString();
  const currentYear = getYear(new Date());
  const pastYears = Array.from({ length: 50 }, (_, i) => currentYear - i);

  const [year, setYear] = useQueryState(
    "year",
    parseAsString.withDefault(currentYear),
  );

  const [dateFrom, setDateFrom] = useQueryState(
    "from",
    parseAsString.withDefault(""),
  );
  const [dateTo, setDateTo] = useQueryState(
    "to",
    parseAsString.withDefault(""),
  );

  const isAnyFilterActive = !!year || !!dateFrom || !!dateTo;

  const resetFilter = () => {
    setYear("");
    setDateFrom("");
    setDateTo("");
  };

  const { data, isLoading, isError, error } = useQuery({
    queryFn: () => fetchAccounts(clinic.id, searchParamStr),
    queryKey: [`accounts-${clinic.id}`, searchParamStr],
    enabled: !!clinic && !!clinic.id,
  });

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-end gap-4">
        <div>
          <Label>Year</Label>
          <Select
            className="ml-auto"
            defaultValue={year}
            value={year}
            onValueChange={(value) => setYear(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {pastYears.map((year) => {
                return (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
        {/* tander date range */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Bid End Date Range</label>
          <div className="flex space-x-2">
            <DatePickerWithRange
              startDate={dateFrom}
              setStartDate={setDateFrom}
              endDate={dateTo}
              setEndDate={setDateTo}
            />
          </div>
        </div>

        {isAnyFilterActive && (
          <Button type="button" variant="destructive" onClick={resetFilter}>
            Reset
          </Button>
        )}
      </div>
      {isLoading ? (
        <Spinner />
      ) : isError ? (
        error?.message ?? "error"
      ) : (
        <AccountReports data={data ?? []} />
      )}
    </div>
  );
}
