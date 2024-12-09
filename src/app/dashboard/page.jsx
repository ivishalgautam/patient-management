"use client";
import PageContainer from "@/components/layout/page-container";
import { Heading } from "@/components/ui/heading";
import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarDays, IndianRupee, User } from "lucide-react";
import { useContext } from "react";
import { MainContext } from "@/store/context";
import { ClinicContext } from "@/store/clinic-context";
import { rupee } from "@/lib/Intl";

const getReports = async (clinicId) => {
  const { data } = await http().get(`${endpoints.reports.getAll}/${clinicId}`);
  return data ?? {};
};

export default function Home() {
  const { clinic } = useContext(ClinicContext);
  const {
    data: report = {},
    isLoading: isReportLoading,
    isError: isReportError,
    error: reportError,
  } = useQuery({
    queryKey: ["reports", clinic?.id],
    queryFn: () => getReports(clinic.id),
    enabled: !!clinic?.id,
  });

  return (
    <PageContainer className={"space-y-4 bg-white"}>
      <Heading title={"Dashboard"} description={"Dashboard reports"} />
      <Reports
        {...{
          data: report,
          isError: isReportError,
          isLoading: isReportLoading,
          error: reportError,
        }}
      />
    </PageContainer>
  );
}

function Reports({ data, isError, isLoading, error }) {
  const { user, isUserLoading } = useContext(MainContext);

  if (isLoading || isUserLoading) return <Skelotons />;
  if (isError) return error?.message ?? "Error fetching reports";

  return (
    <GridContainer>
      <Card
        count={data?.today_appointments}
        title={"Today Appointments"}
        icon={CalendarDays}
      />
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
        count={rupee.format(data?.today_collection)}
        title={"Total Collection"}
        icon={IndianRupee}
      />
    </GridContainer>
  );
}

function GridContainer({ children }) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,_minmax(300px,1fr))] gap-4">
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
        <span className="text-xl font-semibold text-primary">
          {item?.count}
        </span>
      </div>
    </div>
  );
}

function Skelotons({ length = 3 }) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,_minmax(300px,1fr))] gap-4">
      {Array.from({ length }).map((_, key) => (
        <Skeleton className={"h-[74.6px] bg-gray-200"} key={key} />
      ))}
    </div>
  );
}
