import { useAuth } from "@/context";
import { AdminDashboard } from "@/components/dashboard/AdminDashboard";
import { FacultyDashboard } from "@/components/dashboard/FacultyDashboard";
import { StudentDashboard } from "@/components/dashboard/StudentDashboard";

const DashboardPage = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-12 bg-muted animate-pulse rounded" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-40 bg-muted animate-pulse rounded" />
          ))}
        </div>
      </div>
    );
  }

  // Route to role-specific dashboard
  if (user?.role === "admin") {
    return <AdminDashboard />;
  }

  if (user?.role === "faculty") {
    return <FacultyDashboard />;
  }

  if (user?.role === "student") {
    return <StudentDashboard />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Unable to determine your role</h1>
        <p className="text-muted-foreground">Please log in again</p>
      </div>
    </div>
  );
};

export default DashboardPage;
