"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface PatientActivityChartProps {
  data: { month: string; patients: number; referrals: number }[];
}

export function PatientActivityChart({ data }: PatientActivityChartProps) {
  return (
    <Card className="shadow-[0_8px_24px_rgba(16,24,40,0.08)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.45)] dark:border-white/[0.06]">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold">Patient Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--border)"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
                labelStyle={{ color: "var(--foreground)", fontWeight: 600 }}
              />
              <Legend
                wrapperStyle={{ paddingTop: "20px" }}
                formatter={(value) => (
                  <span style={{ color: "var(--foreground)", fontSize: "12px" }}>
                    {value}
                  </span>
                )}
              />
              <Line
                type="monotone"
                dataKey="patients"
                name="New Patients"
                stroke="#7C3AED"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6, fill: "#7C3AED" }}
              />
              <Line
                type="monotone"
                dataKey="referrals"
                name="Referrals"
                stroke="#F97316"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6, fill: "#F97316" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
