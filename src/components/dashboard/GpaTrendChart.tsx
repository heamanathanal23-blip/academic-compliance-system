import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { analyticsService } from "@/services/analyticsService";
import { Card } from "@/components/ui/card";

export function GpaTrendChart() {
  const { data: trendData = [], isLoading } = useQuery({
    queryKey: ["analytics", "gpa-trend"],
    queryFn: () => analyticsService.getGpaTrend(),
    staleTime: 60000
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4 }}
      className="glass-card p-5"
    >
      <h3 className="mb-4 font-heading text-sm font-semibold text-foreground">GPA Trend Analysis</h3>
      {isLoading ? (
        <div className="h-80 bg-muted animate-pulse rounded" />
      ) : trendData.length > 0 ? (
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={trendData}>
            <defs>
              <linearGradient id="avgGpaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(174, 72%, 52%)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="hsl(174, 72%, 52%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="topGpaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(260, 60%, 60%)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="hsl(260, 60%, 60%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 16%)" />
            <XAxis dataKey="semester" tick={{ fontSize: 11, fill: "hsl(215, 12%, 50%)" }} axisLine={false} tickLine={false} />
            <YAxis domain={[2.5, 4.0]} tick={{ fontSize: 11, fill: "hsl(215, 12%, 50%)" }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(220, 18%, 10%)",
                border: "1px solid hsl(220, 14%, 16%)",
                borderRadius: "8px",
                fontSize: "12px",
                color: "hsl(210, 20%, 92%)",
              }}
            />
            <Area type="monotone" dataKey="avgGpa" name="Avg GPA" stroke="hsl(174, 72%, 52%)" fill="url(#avgGpaGrad)" strokeWidth={2} dot={{ r: 3, fill: "hsl(174, 72%, 52%)" }} />
            <Area type="monotone" dataKey="topPerformer" name="Top Performer" stroke="hsl(260, 60%, 60%)" fill="url(#topGpaGrad)" strokeWidth={2} dot={{ r: 3, fill: "hsl(260, 60%, 60%)" }} />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-80 text-muted-foreground">
          <p>No data available</p>
        </div>
      )}
    </motion.div>
  );
}
