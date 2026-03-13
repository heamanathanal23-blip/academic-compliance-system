import { TrendingUp, CalendarCheck, AlertTriangle, Zap, BookOpen } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useAuth } from "@/context";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { AiChatbot } from "@/components/dashboard/AiChatbot";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { analyticsService } from "@/services/analyticsService";

interface StudentDashboardData {
  gpa: number;
  attendance: number;
  risk: 'low' | 'medium' | 'high';
  coursesEnrolled: number;
  courses?: Array<{
    name: string;
    grade?: string;
    progress: number;
  }>;
  recommendations?: string[];
}

export function StudentDashboard() {
  const { user } = useAuth();

  // Fetch student's own data
  const { data: studentData, isLoading: studentLoading } = useQuery<StudentDashboardData>({
    queryKey: ["student", "dashboard", user?.id],
    queryFn: () => analyticsService.getStudentDashboard(user?.id || ""),
    staleTime: 60000,
    enabled: !!user?.id
  });

  // Calculate engagement score (40% attendance, 40% GPA, 20% academic activity)
  const calculateEngagementScore = () => {
    if (!studentData) return 0;
    const attendanceScore = Math.min((studentData.attendance || 0) / 100 * 40, 40);
    const gpaScore = Math.min((studentData.gpa || 0) / 4 * 40, 40);
    const activityScore = Math.min((studentData.coursesEnrolled || 0) / 6 * 20, 20);
    return Math.round(attendanceScore + gpaScore + activityScore);
  };

  const engagementScore = calculateEngagementScore();

  const getRiskColor = (risk: string) => {
    if (risk === "high") return "text-destructive";
    if (risk === "medium") return "text-yellow-600";
    return "text-green-600";
  };

  const getRiskBgColor = (risk: string) => {
    if (risk === "high") return "bg-destructive/10";
    if (risk === "medium") return "bg-yellow-600/10";
    return "bg-green-600/10";
  };

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
        <h1 className="font-heading text-2xl font-bold text-foreground">My Dashboard</h1>
        <p className="text-sm text-muted-foreground">Your academic progress and performance</p>
      </motion.div>

      {/* Student KPI Cards */}
      <motion.div
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <KpiCard 
            title="Current GPA" 
            value={studentData?.gpa || 0} 
            subtitle="Your cumulative GPA" 
            icon={TrendingUp} 
            variant="primary" 
            index={0} 
            isLoading={studentLoading} 
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <KpiCard 
            title="Attendance" 
            value={`${studentData?.attendance || 0}%`} 
            subtitle="Current semester" 
            icon={CalendarCheck} 
            variant="default" 
            index={1} 
            isLoading={studentLoading} 
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <KpiCard 
            title="Risk Status" 
            value={studentData?.risk ? studentData.risk.toUpperCase() : "N/A"} 
            subtitle="Academic risk level" 
            icon={AlertTriangle} 
            variant={studentData?.risk === "high" ? "danger" : studentData?.risk === "medium" ? "warning" : "default"} 
            index={2} 
            isLoading={studentLoading} 
          />
        </motion.div>
      </motion.div>

      {/* Engagement Score Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.4 }}>
        <Card className="glass-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  Engagement Score
                </CardTitle>
                <CardDescription>Based on attendance, GPA, and academic activity</CardDescription>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold">{engagementScore}</p>
                <p className="text-xs text-muted-foreground">out of 100</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Overall Engagement</span>
                <span className="text-xs text-muted-foreground">{engagementScore}%</span>
              </div>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                <Progress value={engagementScore} className="h-2" />
              </motion.div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-xs text-muted-foreground">Attendance</p>
                <p className="text-lg font-semibold">{studentData?.attendance || 0}%</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-xs text-muted-foreground">GPA</p>
                <p className="text-lg font-semibold">{studentData?.gpa || 0}</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-xs text-muted-foreground">Courses</p>
                <p className="text-lg font-semibold">{studentData?.coursesEnrolled || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Academic Progress */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.4 }}>
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Academic Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {studentLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-20 bg-muted animate-pulse rounded" />
                ))}
              </div>
            ) : studentData?.courses && studentData.courses.length > 0 ? (
              <div className="space-y-4">
                {studentData.courses.map((course, idx: number) => (
                  <div key={idx} className="rounded-lg border border-border/50 p-3">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-sm">{course.name}</p>
                      <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">{course.grade || "In Progress"}</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-primary"
                        initial={{ width: 0 }}
                        animate={{ width: `${course.progress || 0}%` }}
                        transition={{ delay: 0.5 + idx * 0.1, duration: 0.8 }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">{course.progress || 0}% complete</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No course data available</p>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Recommendations */}
      {studentData?.recommendations && studentData.recommendations.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.4 }}>
          <Card className="glass-card border-amber-500/30 bg-amber-50/5">
            <CardHeader>
              <CardTitle>Recommendations</CardTitle>
              <CardDescription>Personalized suggestions to improve your performance</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {studentData.recommendations.map((rec: string, idx: number) => (
                  <li key={idx} className="flex gap-3 text-sm">
                    <span className="text-amber-500 font-bold">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* AI Assistant */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7, duration: 0.4 }}>
        <AiChatbot />
      </motion.div>
    </div>
  );
}
