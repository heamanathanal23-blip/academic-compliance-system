import { Users, TrendingUp, CalendarCheck, AlertTriangle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { GpaTrendChart } from "@/components/dashboard/GpaTrendChart";
import { DepartmentChart } from "@/components/dashboard/DepartmentChart";
import { AiChatbot } from "@/components/dashboard/AiChatbot";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { analyticsService } from "@/services/analyticsService";
import { alertService } from "@/services/alertService";

interface KpiData {
  totalStudents: number;
  avgGpa: number;
  avgAttendance: number;
  atRiskCount: number;
}

interface AlertData {
  _id: string;
  studentId: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
}

export function AdminDashboard() {
  // Fetch KPI data from backend
  const { data: kpiData, isLoading: kpiLoading } = useQuery<KpiData>({
    queryKey: ["analytics", "kpi"],
    queryFn: () => analyticsService.getKPI(),
    staleTime: 60000
  });

  // Fetch recent alerts
  const { data: alertsData, isLoading: alertsLoading } = useQuery<AlertData[]>({
    queryKey: ["alerts"],
    queryFn: () => alertService.getAlerts(),
    staleTime: 30000
  });

  const kpis = kpiData || {
    totalStudents: 0,
    avgGpa: 0,
    avgAttendance: 0,
    atRiskCount: 0,
  };

  const alerts = Array.isArray(alertsData) ? alertsData : [];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="font-heading text-2xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground">Complete institutional analytics and management</p>
      </motion.div>

      {/* KPI Cards */}
      <motion.div
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <KpiCard title="Total Students" value={kpis.totalStudents} subtitle="Across all departments" icon={Users} variant="primary" index={0} isLoading={kpiLoading} />
        </motion.div>
        <motion.div variants={itemVariants}>
          <KpiCard title="Average GPA" value={kpis.avgGpa} subtitle="Institution-wide" icon={TrendingUp} variant="default" index={1} isLoading={kpiLoading} />
        </motion.div>
        <motion.div variants={itemVariants}>
          <KpiCard title="Avg Attendance" value={`${kpis.avgAttendance}%`} subtitle="Current semester" icon={CalendarCheck} variant="default" index={2} isLoading={kpiLoading} />
        </motion.div>
        <motion.div variants={itemVariants}>
          <KpiCard title="At-Risk Students" value={kpis.atRiskCount} subtitle="Requires intervention" icon={AlertTriangle} variant="danger" index={3} isLoading={kpiLoading} />
        </motion.div>
      </motion.div>

      {/* Charts */}
      <motion.div
        className="grid grid-cols-1 gap-4 lg:grid-cols-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.4 }}
      >
        <GpaTrendChart />
        <DepartmentChart />
      </motion.div>

      {/* Recent Alerts */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.4 }}>
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Recent Alerts</CardTitle>
            <CardDescription>Latest student risk alerts across institution</CardDescription>
          </CardHeader>
          <CardContent>
            {alertsLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-12 bg-muted animate-pulse rounded" />
                ))}
              </div>
            ) : alerts.length > 0 ? (
              <div className="space-y-3">
                {alerts.slice(0, 5).map((alert) => (
                  <div key={alert._id} className="flex items-start justify-between border-b border-border/50 pb-2 last:border-0">
                    <div>
                      <p className="font-medium text-sm">{alert.studentId}</p>
                      <p className="text-xs text-muted-foreground">{alert.message}</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs px-2 py-1 rounded ${
                        alert.severity === "high" ? "bg-destructive/20 text-destructive" :
                        alert.severity === "medium" ? "bg-yellow-500/20 text-yellow-700" :
                        "bg-blue-500/20 text-blue-700"
                      }`}>
                        {alert.severity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No alerts at this time</p>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* AI Assistant */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.4 }}>
        <AiChatbot />
      </motion.div>
    </div>
  );
}
