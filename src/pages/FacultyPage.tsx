import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useAuth } from "@/context";
import { facultyService } from "@/services/facultyService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Trash2, Edit } from "lucide-react";
import { useState } from "react";

interface Faculty {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  department: string;
  studentCount?: number;
  students?: number;
}

const FacultyPage = () => {
  const { user } = useAuth();
  const [search, setSearch] = useState("");

  // Fetch real faculty data from backend
  const { data: facultyList = [], isLoading } = useQuery<Faculty[]>({
    queryKey: ["faculty"],
    queryFn: () => facultyService.getAll(),
    staleTime: 60000
  });

  // Transform data to ensure consistent field names
  const facultyData = facultyList.map(f => ({
    id: f._id || f.id,
    name: f.name,
    email: f.email,
    department: f.department,
    students: f.studentCount || f.students || 0
  }));

  const filtered = facultyData.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.id?.toLowerCase().includes(search.toLowerCase())
  );

  const isAdminOrFaculty = user?.role === "admin" || user?.role === "faculty";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4 }}
      className="space-y-6"
    >
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Faculty Management</h1>
        <p className="text-sm text-muted-foreground">View and manage faculty members and their assigned students</p>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Faculty Directory</CardTitle>
              <CardDescription>All faculty members and their departments</CardDescription>
            </div>
            {isAdminOrFaculty && (
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Add Faculty
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name or ID..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 bg-secondary border-border/50"
            />
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-20 bg-muted animate-pulse rounded" />
              ))}
            </div>
          ) : filtered.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">ID</th>
                    <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Name</th>
                    <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Department</th>
                    <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Students</th>
                    {isAdminOrFaculty && <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((faculty, i) => (
                    <motion.tr
                      key={faculty.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="border-b border-border/30 hover:bg-secondary/50 transition-colors"
                    >
                      <td className="py-3 font-mono text-xs text-muted-foreground">{faculty.id}</td>
                      <td className="py-3">
                        <div>
                          <p className="font-medium text-foreground">{faculty.name}</p>
                          <p className="text-xs text-muted-foreground">{faculty.email}</p>
                        </div>
                      </td>
                      <td className="py-3 text-muted-foreground">{faculty.department}</td>
                      <td className="py-3 font-semibold">{faculty.students}</td>
                      {isAdminOrFaculty && (
                        <td className="py-3 flex gap-2">
                          <button className="p-1 hover:bg-secondary rounded">
                            <Edit className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                          </button>
                          <button className="p-1 hover:bg-secondary rounded">
                            <Trash2 className="h-4 w-4 text-destructive/70 hover:text-destructive" />
                          </button>
                        </td>
                      )}
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No faculty members found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default FacultyPage;
