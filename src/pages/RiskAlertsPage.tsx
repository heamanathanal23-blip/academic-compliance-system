import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useAuth } from "@/context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertTriangle, CheckCircle, Search, Filter } from "lucide-react";
import { useState } from "react";
import { alertService } from "@/services/alertService";

interface Alert {
  _id: string;
  studentId: string;
  studentName?: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
  resolved?: boolean;
  createdAt?: string;
  category?: string;
}

const RiskAlertsPage = () => {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");

  const { data: alerts = [], isLoading } = useQuery<Alert[]>({
    queryKey: ["alerts", "all"],
    queryFn: () => alertService.getAlerts(),
    staleTime: 30000
  });

  const filtered = alerts.filter(alert => {
    const matchSearch = alert.studentId.toLowerCase().includes(search.toLowerCase()) ||
      alert.message.toLowerCase().includes(search.toLowerCase());
    const matchSeverity = severityFilter === "all" || alert.severity === severityFilter;
    return matchSearch && matchSeverity;
  });

  const isAdminOrFaculty = user?.role === "admin" || user?.role === "faculty";

  const getSeverityColor = (severity: string) => {
    if (severity === "high") return "bg-destructive/20 text-destructive border-destructive/50";
    if (severity === "medium") return "bg-yellow-500/20 text-yellow-700 border-yellow-500/50";
    return "bg-blue-500/20 text-blue-700 border-blue-500/50";
  };

  const getSeverityIcon = (severity: string) => {
    return <AlertTriangle className={`h-4 w-4 ${severity === "high" ? "text-destructive" : "text-yellow-600"}`} />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4 }}
      className="space-y-6"
    >
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Risk Alerts</h1>
        <p className="text-sm text-muted-foreground">Monitor and manage student academic risk alerts</p>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Active Alerts</CardTitle>
              <CardDescription>Student alerts requiring attention</CardDescription>
            </div>
            {isAdminOrFaculty && (
              <Button size="sm" variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by student ID or alert message..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 bg-secondary border-border/50"
              />
            </div>
            <select
              value={severityFilter}
              onChange={e => setSeverityFilter(e.target.value)}
              className="px-3 py-2 rounded-md border border-border/50 bg-secondary text-sm"
            >
              <option value="all">All Severity</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-20 bg-muted animate-pulse rounded" />
              ))}
            </div>
          ) : filtered.length > 0 ? (
            <div className="space-y-3">
              {filtered.map((alert, i) => (
                <motion.div
                  key={alert._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`border rounded-lg p-4 ${getSeverityColor(alert.severity)}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      {getSeverityIcon(alert.severity)}
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm">{alert.studentId}</h3>
                        <p className="text-xs mt-1">{alert.message}</p>
                        {alert.createdAt && (
                          <p className="text-xs opacity-75 mt-2">
                            {new Date(alert.createdAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                    {isAdminOrFaculty && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="ml-2"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              <AlertTriangle className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No alerts matching your filters</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default RiskAlertsPage;
