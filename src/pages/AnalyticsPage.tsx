import { GpaTrendChart } from "@/components/dashboard/GpaTrendChart";
import { DepartmentChart } from "@/components/dashboard/DepartmentChart";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { analyticsService } from "@/services/analyticsService";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface RiskDistribution {
  low: number;
  medium: number;
  high: number;
}

const AnalyticsPage = () => {
  const { data: riskDistribution, isLoading } = useQuery<RiskDistribution>({
    queryKey: ["analytics", "risk-distribution"],
    queryFn: () => analyticsService.getRiskDistribution(),
    staleTime: 60000
  });

  const riskData = [
    { name: "Low Risk", value: riskDistribution?.low || 0, color: "hsl(152, 60%, 48%)" },
    { name: "Medium Risk", value: riskDistribution?.medium || 0, color: "hsl(38, 92%, 55%)" },
    { name: "High Risk", value: riskDistribution?.high || 0, color: "hsl(0, 72%, 55%)" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Analytics</h1>
        <p className="text-sm text-muted-foreground">Deep dive into academic performance data</p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <GpaTrendChart />
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.4 }}
          className="glass-card p-5"
        >
          <h3 className="mb-4 font-heading text-sm font-semibold text-foreground">Risk Distribution</h3>
          {isLoading ? (
            <div className="h-56 bg-muted animate-pulse rounded" />
          ) : (
            <>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={riskData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" stroke="none">
                    {riskData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(220, 18%, 10%)",
                      border: "1px solid hsl(220, 14%, 16%)",
                      borderRadius: "8px",
                      fontSize: "12px",
                      color: "hsl(210, 20%, 92%)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-4 mt-2">
                {riskData.map(d => (
                  <div key={d.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                    {d.name} ({d.value})
                  </div>
                ))}
              </div>
            </>
          )}
        </motion.div>
      </div>

      <DepartmentChart />
    </div>
  );
};

export default AnalyticsPage;
