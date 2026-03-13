import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useAuth } from "@/context";
import { analyticsService } from "@/services/analyticsService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, TrendingDown, Award } from "lucide-react";

interface Department {
  _id?: string;
  id?: string;
  department: string;
  name?: string;
  studentCount?: number;
  students?: number;
  avgGpa: number;
  avgAttendance?: number;
  attendance?: number;
  atRisk?: number;
}

const DepartmentPage = () => {
  const { user } = useAuth();

  // Fetch real department data from backend
  const { data: departmentData = [], isLoading } = useQuery<Department[]>({
    queryKey: ["analytics", "department-performance"],
    queryFn: () => analyticsService.getDepartmentPerformance(),
    staleTime: 60000
  });

  // Transform data to ensure consistent field names
  const departments = departmentData.map(dept => ({
    id: dept._id || dept.id || dept.department,
    name: dept.department || dept.name,
    students: dept.studentCount || dept.students || 0,
    avgGpa: dept.avgGpa || 0,
    avgAttendance: dept.avgAttendance || dept.attendance || 0,
    atRisk: dept.atRisk || 0
  }));

  const isAdmin = user?.role === "admin";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4 }}
      className="space-y-6"
    >
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Departments</h1>
        <p className="text-sm text-muted-foreground">View department performance and statistics</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-40 bg-muted animate-pulse rounded" />
          ))}
        </div>
      ) : departments.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {departments.map((dept, i) => (
            <motion.div key={dept.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-lg">{dept.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Students</p>
                      <p className="text-2xl font-bold flex items-center gap-2">
                        <Users className="h-5 w-5 text-cyan-500" />
                        {dept.students}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Avg GPA</p>
                      <p className="text-2xl font-bold">{dept.avgGpa.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Attendance</p>
                      <p className="text-2xl font-bold">{dept.avgAttendance}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">At Risk</p>
                      <p className="text-2xl font-bold flex items-center gap-2 text-destructive">
                        <TrendingDown className="h-5 w-5" />
                        {dept.atRisk}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No department data available</p>
        </div>
      )}
    </motion.div>
  );
};

export default DepartmentPage;
