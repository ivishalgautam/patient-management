"use client";
import PageContainer from "@/components/layout/page-container";
import { Heading } from "@/components/ui/heading";
import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarDays, IndianRupee, User } from "lucide-react";
import { Suspense, useContext } from "react";
import { MainContext } from "@/store/context";
import { ClinicContext } from "@/store/clinic-context";
import { rupee } from "@/lib/Intl";
import { cn } from "@/lib/utils";
import UserTableActions from "./_component/user-table-actions";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";
import UserListing from "./_component/user-listing";
import Link from "next/link";
import moment from "moment";
import Table from "./_component/table";
import Spinner from "@/components/Spinner";

const getReports = async (clinicId) => {
  const { data } = await http().get(`${endpoints.reports.getAll}/${clinicId}`);
  return data ?? {};
};

const getAdminReports = async () => {
  const { data } = await http().get(`${endpoints.reports.getAll}`);
  return data ?? {};
};

export default function Home() {
  const { clinic } = useContext(ClinicContext);
  const { user } = useContext(MainContext);
  const {
    data: doctorReport = {},
    isLoading: isDoctorReportLoading,
    isError: isDoctorReportError,
    error: doctorReportError,
  } = useQuery({
    queryKey: ["reports", clinic?.id],
    queryFn: () => getReports(clinic.id),
    enabled: !!clinic.id,
  });
  const {
    data: adminReport = {},
    isLoading: isAdminReportLoading,
    isError: isAdminReportError,
    error: adminReportError,
  } = useQuery({
    queryKey: ["admin-reports"],
    queryFn: getAdminReports,
    enabled: !!(user?.role === "admin"),
  });

  return (
    <div className="space-y-6">
      <PageContainer className={"space-y-4 border bg-white shadow-none"}>
        <Heading title={"Dashboard"} description={"Dashboard reports"} />
        {user?.role === "doctor" && (
          <Reports
            {...{
              data: doctorReport,
              isError: isDoctorReportError,
              isLoading: isDoctorReportLoading,
              error: doctorReportError,
            }}
          />
        )}
        {user?.role === "admin" && (
          <Reports
            {...{
              data: adminReport,
              isError: isAdminReportError,
              isLoading: isAdminReportLoading,
              error: adminReportError,
            }}
          />
        )}
      </PageContainer>

      <PageContainer>
        <div className="flex items-start justify-between">
          <Heading title="Patients" />
        </div>
        <Suspense
          fallback={<DataTableSkeleton columnCount={4} rowCount={10} />}
        >
          <Table />
        </Suspense>
      </PageContainer>
    </div>
  );
}

function Reports({ data, isError, isLoading, error }) {
  const { user, isUserLoading } = useContext(MainContext);
  if (isLoading || isUserLoading) return <Skelotons length={5} />;
  if (isError) return error?.message ?? "Error fetching reports";

  return (
    <GridContainer>
      <Link
        href={`/appointments?page=1&limit=10&start_date=${moment().format("YYYY-MM-DD")}&end_date=${moment().format("YYYY-MM-DD")}`}
      >
        <Card
          count={data?.today_appointments}
          title={"Today Appointments"}
          icon={CalendarDays}
        />
      </Link>
      <Card
        count={data?.today_patients}
        title={"New Patients Today"}
        icon={User}
      />
      <Card
        count={data?.today_visited_patients}
        title={"Patients Visited Today"}
        icon={User}
      />
      <Card
        count={rupee.format(data?.today_collection)}
        title={"Today's Collection"}
        icon={IndianRupee}
      />
      <Card
        count={rupee.format(data?.total_collection)}
        title={"Total Collection"}
        icon={IndianRupee}
      />
    </GridContainer>
  );
}

function GridContainer({ children, className }) {
  return (
    <div
      className={cn(
        "grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4",
        className,
      )}
    >
      {children}
    </div>
  );
}

function Card(item) {
  const size = 25;

  return (
    <div className="flex items-center justify-start gap-2 rounded-lg border bg-gray-100 p-4 py-3">
      <div className="rounded-full border bg-white p-3">
        {<item.icon size={size} className="text-primary" />}
      </div>
      <div className="flex flex-col items-start justify-start">
        <span className="text-xs font-medium tracking-wide">{item?.title}</span>
        <span className="text-primary text-xl font-semibold">
          {item?.count}
        </span>
      </div>
    </div>
  );
}

function Skelotons({ length = 3 }) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
      {Array.from({ length }).map((_, key) => (
        <Skeleton className={"h-[74.6px] bg-gray-200"} key={key} />
      ))}
    </div>
  );
}
