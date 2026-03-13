import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useAuth } from "@/context";
import { reportsService } from "@/services/reportsService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, BarChart3, FileText, Calendar } from "lucide-react";
import { useState } from "react";

interface Report {
  _id?: string;
  id?: string;
  name: string;
  type: string;
  description: string;
  generatedDate: string;
  generatedBy: string;
}

const ReportsPage = () => {
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState("month");

  // Fetch real reports data from backend
  const { data: reports = [], isLoading } = useQuery<Report[]>({
    queryKey: ["reports", selectedPeriod],
    queryFn: () => reportsService.getAll({ period: selectedPeriod }),
    staleTime: 60000
  });

  const isAdmin = user?.role === "admin";

  const getReportIcon = (type: string) => {
    return <BarChart3 className="h-5 w-5 text-cyan-500" />;
  };

  const handleGenerateReport = async () => {
    try {
      await reportsService.generate({
        period: selectedPeriod,
        type: "general"
      });
      // Refetch reports after generation
      window.location.reload();
    } catch (error) {
      console.error("Error generating report:", error);
    }
  };

  const handleDownloadReport = async (reportId: string) => {
    try {
      await reportsService.download(reportId);
    } catch (error) {
      console.error("Error downloading report:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4 }}
      className="space-y-6"
    >
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Reports</h1>
        <p className="text-sm text-muted-foreground">Generate and download institutional reports</p>
      </div>

      {isAdmin && (
        <Card className="glass-card border-cyan-500/30 bg-cyan-50/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-cyan-500" />
              Generate New Report
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select
                value={selectedPeriod}
                onChange={e => setSelectedPeriod(e.target.value)}
                className="px-3 py-2 rounded-md border border-border/50 bg-secondary text-sm"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
                <option value="year">This Year</option>
              </select>
              <select
                defaultValue="all"
                className="px-3 py-2 rounded-md border border-border/50 bg-secondary text-sm"
              >
                <option value="all">All Departments</option>
                <option value="cs">Computer Science</option>
                <option value="ee">Electrical Engineering</option>
              </select>
              <Button className="gap-2" onClick={handleGenerateReport}>
                <Download className="h-4 w-4" />
                Generate Report
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="glass-card">
        <CardHeader>
          <div>
            <CardTitle>Available Reports</CardTitle>
            <CardDescription>Previously generated reports</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-24 bg-muted animate-pulse rounded" />
              ))}
            </div>
          ) : reports.length > 0 ? (
            <div className="space-y-3">
              {reports.map((report, i) => (
                <motion.div
                  key={report._id || report.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="border border-border/50 rounded-lg p-4 hover:bg-secondary/30 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      {getReportIcon(report.type)}
                      <div className="flex-1">
                        <h3 className="font-semibold">{report.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{report.description}</p>
                        <div className="flex gap-4 text-xs text-muted-foreground mt-2">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(report.generatedDate).toLocaleDateString()}
                          </span>
                          <span>by {report.generatedBy}</span>
                        </div>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="ml-2"
                      onClick={() => handleDownloadReport(report._id || report.id || "")}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No reports available</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ReportsPage;
