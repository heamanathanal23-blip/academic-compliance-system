import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { studentService } from "@/services/studentService";
import { useAuth } from "@/context";
import { RiskBadge } from "./RiskBadge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Trash2, Edit } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface Student {
  _id: string;
  studentId?: string;
  name: string;
  email?: string;
  department: string;
  gpa: number;
  attendance: number;
  risk: 'low' | 'medium' | 'high';
}

export function StudentDirectory() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState<string>("all");
  const [deptFilter, setDeptFilter] = useState<string>("all");

  // Fetch students from API
  const { data: students = [], isLoading, refetch } = useQuery<Student[]>({
    queryKey: ["students"],
    queryFn: () => studentService.getStudents(),
    staleTime: 60000
  });

  const departments = useMemo(() => [...new Set(students.map(s => s.department))], [students]);

  const filtered = useMemo(() => {
    return students.filter(s => {
      const studentId = s.studentId || s._id;
      const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || studentId.toLowerCase().includes(search.toLowerCase());
      const matchRisk = riskFilter === "all" || s.risk === riskFilter;
      const matchDept = deptFilter === "all" || s.department === deptFilter;
      return matchSearch && matchRisk && matchDept;
    });
  }, [search, riskFilter, deptFilter, students]);

  const isAdminOrFaculty = user?.role === "admin" || user?.role === "faculty";

  const handleDelete = (studentId: string) => {
    if (confirm("Are you sure you want to remove this student?")) {
      // TODO: Call API to delete student
      console.log("Delete student:", studentId);
      refetch();
    }
  };

  const handleEdit = (studentId: string) => {
    // TODO: Open edit modal or navigate to edit page
    console.log("Edit student:", studentId);
  };

  const handleAddStudent = () => {
    // TODO: Open add student modal
    console.log("Add new student");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.4 }}
      className="glass-card p-5"
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-heading text-sm font-semibold text-foreground">Student Directory</h3>
        {isAdminOrFaculty && (
          <Button size="sm" className="gap-2" onClick={handleAddStudent}>
            <Plus className="h-4 w-4" />
            Add Student
          </Button>
        )}
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 bg-secondary border-border/50"
          />
        </div>
        <Select value={riskFilter} onValueChange={setRiskFilter}>
          <SelectTrigger className="w-full sm:w-36 bg-secondary border-border/50">
            <SelectValue placeholder="Risk Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Risks</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
        <Select value={deptFilter} onValueChange={setDeptFilter}>
          <SelectTrigger className="w-full sm:w-52 bg-secondary border-border/50">
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {departments.map(d => (
              <SelectItem key={d} value={d}>{d}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-12 bg-muted animate-pulse rounded" />
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50">
                <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">ID</th>
                <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Name</th>
                <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground hidden sm:table-cell">Department</th>
                <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">GPA</th>
                <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground hidden md:table-cell">Attendance</th>
                <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Risk</th>
                {isAdminOrFaculty && <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, i) => (
                <motion.tr
                  key={s._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                  className="border-b border-border/30 hover:bg-secondary/50 transition-colors"
                >
                  <td className="py-3 font-mono text-xs text-muted-foreground">{s.studentId || s._id}</td>
                  <td className="py-3 font-medium text-foreground">{s.name}</td>
                  <td className="py-3 text-muted-foreground hidden sm:table-cell">{s.department}</td>
                  <td className="py-3 font-mono font-semibold text-foreground">{s.gpa.toFixed(2)}</td>
                  <td className="py-3 text-muted-foreground hidden md:table-cell">{s.attendance}%</td>
                  <td className="py-3"><RiskBadge risk={s.risk} /></td>
                  {isAdminOrFaculty && (
                    <td className="py-3 flex gap-2">
                      <button 
                        className="p-1 hover:bg-secondary rounded"
                        onClick={() => handleEdit(s._id)}
                      >
                        <Edit className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                      </button>
                      <button 
                        className="p-1 hover:bg-secondary rounded"
                        onClick={() => handleDelete(s._id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive/70 hover:text-destructive" />
                      </button>
                    </td>
                  )}
                </motion.tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={isAdminOrFaculty ? 7 : 6} className="py-8 text-center text-muted-foreground">No students found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
}
