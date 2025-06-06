"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { rupee } from "@/lib/Intl";
import Link from "next/link";

// const data = [
//   {
//     payment_received_this_month: "4000",
//     total_payment_received: "4000",
//     payment_cost_this_month: "20000",
//     total_cost: "20000",
//     graph: [
//       { month: "Apr 2024", total_amount: 0, received_amount: 0 },
//       { month: "Aug 2024", total_amount: 0, received_amount: 0 },
//       { month: "Dec 2024", total_amount: 0, received_amount: 0 },
//       { month: "Feb 2025", total_amount: 20000, received_amount: 2000 },
//       { month: "Jan 2025", total_amount: 0, received_amount: 0 },
//       { month: "Jul 2024", total_amount: 0, received_amount: 0 },
//       { month: "Jun 2024", total_amount: 0, received_amount: 0 },
//       { month: "Mar 2024", total_amount: 0, received_amount: 0 },
//       { month: "May 2024", total_amount: 0, received_amount: 0 },
//       { month: "Nov 2024", total_amount: 0, received_amount: 0 },
//       { month: "Oct 2024", total_amount: 0, received_amount: 0 },
//       { month: "Sep 2024", total_amount: 0, received_amount: 0 },
//     ],
//   },
// ];

const chartConfig = {
  total_amount: {
    label: "Total Amount",
    color: "hsl(var(--chart-1))",
  },
  received_amount: {
    label: "Received Amount",
    color: "hsl(var(--chart-2))",
  },
};

export default function AccountReports({ data = [] }) {
  const monthOrder = data?.[0]?.graph.map((item) => item.month);

  const sortedGraphData = [...data[0].graph].sort(
    (a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month),
  );

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Payment Received This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {rupee.format(data[0].payment_received_this_month)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Payment Cost This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {rupee.format(data[0].payment_cost_this_month)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Payment Received
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {rupee.format(data[0].total_payment_received)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {rupee.format(data[0].total_cost)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <Link href={"/clinic-patients?payment_status=pending"}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {rupee.format(data[0].balance_amount)}
              </div>
            </CardContent>
          </Link>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Today&apos;s Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {rupee.format(data[0].total_cost_today)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Today&apos;s Collection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {rupee.format(data[0].total_payment_received_today)}
            </div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Account Overview</CardTitle>
        </CardHeader>
        <CardContent className="pb-4">
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <AreaChart
              accessibilityLayer
              data={sortedGraphData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <defs>
                <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ccaca" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#ffffff" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ccaca" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#ffffff" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <Area
                dataKey="total_amount"
                type="natural"
                fill="url(#fillMobile)"
                fillOpacity={0.4}
                stroke="#0ccaca"
                stackId="a"
              />
              <Area
                dataKey="received_amount"
                type="natural"
                fill="url(#fillDesktop)"
                fillOpacity={0.4}
                stroke="#0ccaca"
                stackId="a"
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
