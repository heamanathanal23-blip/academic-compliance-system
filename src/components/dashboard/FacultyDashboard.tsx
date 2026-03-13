import { Users, TrendingUp, CalendarCheck, AlertTriangle, ClipboardCheck } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useAuth } from "@/context";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { AiChatbot } from "@/components/dashboard/AiChatbot";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { studentService } from "@/services/studentService";
import { alertService } from "@/services/alertService";

interface StudentData {
  _id: string;
  name: string;
  studentId: string;
  gpa: number;
  attendance: number;
  risk: 'low' | 'medium' | 'high';
}

interface AlertData {
  _id: string;
  studentId: string;
  studentName?: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
}

export function FacultyDashboard() {
  const { user } = useAuth();

  // Fetch faculty's assigned students
  const { data: studentsData, isLoading: studentsLoading } = useQuery<StudentData[]>({
    queryKey: ["students", "assigned", user?.id],
    queryFn: () => studentService.getStudents({ faculty: user?.id }),
    staleTime: 60000,
    enabled: !!user?.id
  });

  // Fetch faculty's student alerts
  const { data: alertsData, isLoading: alertsLoading } = useQuery<AlertData[]>({
    queryKey: ["alerts", "faculty", user?.id],
    queryFn: () => alertService.getAlerts({ faculty: user?.id }),
    staleTime: 30000,
    enabled: !!user?.id
  });

  const students = Array.isArray(studentsData) ? studentsData : [];
  const alerts = Array.isArray(alertsData) ? alertsData : [];

  // Calculate faculty KPIs
  const totalAssignedStudents = students.length;
  const avgGpa = students.length > 0 ? +(students.reduce((sum: number, s: StudentData) => sum + (s.gpa || 0), 0) / students.length).toFixed(2) : 0;
  const avgAttendance = students.length > 0 ? +(students.reduce((sum: number, s: StudentData) => sum + (s.attendance || 0), 0) / students.length).toFixed(1) : 0;
  const atRiskCount = students.filter((s: StudentData) => s.risk === "high").length;

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
        <h1 className="font-heading text-2xl font-bold text-foreground">Faculty Dashboard</h1>
        <p className="text-sm text-muted-foreground">Manage your students and track their progress</p>
      </motion.div>

      {/* Faculty KPI Cards */}
      <motion.div
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <KpiCard title="Assigned Students" value={totalAssignedStudents} subtitle="Under your supervision" icon={Users} variant="primary" index={0} isLoading={studentsLoading} />
        </motion.div>
        <motion.div variants={itemVariants}>
          <KpiCard title="Average GPA" value={avgGpa} subtitle="Your students" icon={TrendingUp} variant="default" index={1} isLoading={studentsLoading} />
        </motion.div>
        <motion.div variants={itemVariants}>
          <KpiCard title="Avg Attendance" value={`${avgAttendance}%`} subtitle="Your students" icon={CalendarCheck} variant="default" index={2} isLoading={studentsLoading} />
        </motion.div>
        <motion.div variants={itemVariants}>
          <KpiCard title="At-Risk Students" value={atRiskCount} subtitle="Needs intervention" icon={AlertTriangle} variant="danger" index={3} isLoading={studentsLoading} />
        </motion.div>
      </motion.div>

      {/* My Students */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.4 }}>
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>My Students</CardTitle>
              <CardDescription>Your assigned students and their current status</CardDescription>
            </div>
            <Button size="sm">Add Student</Button>
          </CardHeader>
          <CardContent>
            {studentsLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-14 bg-muted animate-pulse rounded" />
                ))}
              </div>
            ) : students.length > 0 ? (
              <div className="space-y-2">
                {students.slice(0, 8).map((student: StudentData) => (
                  <div key={student._id} className="flex items-center justify-between border-b border-border/50 py-2 last:border-0">
                    <div>
                      <p className="font-medium text-sm">{student.name}</p>
                      <p className="text-xs text-muted-foreground">{student.studentId}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-mono text-sm">{student.gpa}</p>
                        <p className="text-xs text-muted-foreground">GPA</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded ${
                        student.risk === "high" ? "bg-destructive/20 text-destructive" :
                        student.risk === "medium" ? "bg-yellow-500/20 text-yellow-700" :
                        "bg-green-500/20 text-green-700"
                      }`}>
                        {student.risk}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No students assigned yet</p>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Alerts */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.4 }}>
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Student Alerts</CardTitle>
              <CardDescription>Recent alerts for your students</CardDescription>
            </div>
            <Button size="sm" variant="outline">Log Intervention</Button>
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
                {alerts.slice(0, 5).map((alert: AlertData) => (
                  <div key={alert._id} className="flex items-start justify-between border-b border-border/50 pb-2 last:border-0">
                    <div>
                      <p className="font-medium text-sm">{alert.studentName || alert.studentId}</p>
                      <p className="text-xs text-muted-foreground">{alert.message}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      alert.severity === "high" ? "bg-destructive/20 text-destructive" :
                      alert.severity === "medium" ? "bg-yellow-500/20 text-yellow-700" :
                      "bg-blue-500/20 text-blue-700"
                    }`}>
                      {alert.severity}
                    </span>
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
