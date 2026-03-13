import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { analyticsService } from "@/services/analyticsService";

export function DepartmentChart() {
  const { data: departmentData = [], isLoading } = useQuery({
    queryKey: ["analytics", "department-performance"],
    queryFn: () => analyticsService.getDepartmentPerformance(),
    staleTime: 60000
  });

  const data = [...departmentData].sort((a: any, b: any) => b.avgGpa - a.avgGpa);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35, duration: 0.4 }}
      className="glass-card p-5"
    >
      <h3 className="mb-4 font-heading text-sm font-semibold text-foreground">Department Comparison</h3>
      {isLoading ? (
        <div className="h-80 bg-muted animate-pulse rounded" />
      ) : data.length > 0 ? (
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 16%)" horizontal={false} />
            <XAxis type="number" domain={[0, 4]} tick={{ fontSize: 11, fill: "hsl(215, 12%, 50%)" }} axisLine={false} tickLine={false} />
            <YAxis dataKey="department" type="category" tick={{ fontSize: 11, fill: "hsl(215, 12%, 50%)" }} axisLine={false} tickLine={false} width={140} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(220, 18%, 10%)",
                border: "1px solid hsl(220, 14%, 16%)",
                borderRadius: "8px",
                fontSize: "12px",
                color: "hsl(210, 20%, 92%)",
              }}
              formatter={(value: number) => [value.toFixed(2), "Avg GPA"]}
            />
            <Bar dataKey="avgGpa" fill="hsl(174, 72%, 52%)" radius={[0, 6, 6, 0]} barSize={24} />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-80 text-muted-foreground">
          <p>No data available</p>
        </div>
      )}
    </motion.div>
  );
}
