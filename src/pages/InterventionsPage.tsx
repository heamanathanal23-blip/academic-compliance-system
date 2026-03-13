import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useAuth } from "@/context";
import { interventionService } from "@/services/interventionService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, CheckCircle, Clock } from "lucide-react";
import { useState } from "react";

interface Intervention {
  _id?: string;
  id?: string;
  studentId: string;
  studentName: string;
  type: string;
  description: string;
  status: 'planned' | 'ongoing' | 'completed';
  startDate: string;
  endDate?: string;
  faculty?: string;
  facultyId?: string;
}

const InterventionsPage = () => {
  const { user } = useAuth();
  const [search, setSearch] = useState("");

  // Fetch real interventions data from backend
  const { data: interventions = [], isLoading } = useQuery<Intervention[]>({
    queryKey: ["interventions"],
    queryFn: () => interventionService.getAll(),
    staleTime: 60000
  });

  const filtered = interventions.filter(i =>
    i.studentId.toLowerCase().includes(search.toLowerCase()) ||
    i.studentName.toLowerCase().includes(search.toLowerCase())
  );

  const isAdminOrFaculty = user?.role === "admin" || user?.role === "faculty";

  const getStatusColor = (status: string) => {
    if (status === "completed") return "bg-green-500/20 text-green-700 border-green-500/50";
    if (status === "ongoing") return "bg-blue-500/20 text-blue-700 border-blue-500/50";
    return "bg-yellow-500/20 text-yellow-700 border-yellow-500/50";
  };

  const getStatusIcon = (status: string) => {
    if (status === "completed") return <CheckCircle className="h-4 w-4" />;
    return <Clock className="h-4 w-4" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4 }}
      className="space-y-6"
    >
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Interventions</h1>
        <p className="text-sm text-muted-foreground">Track and manage student intervention programs</p>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Active Interventions</CardTitle>
              <CardDescription>Student support and intervention programs</CardDescription>
            </div>
            {isAdminOrFaculty && (
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                New Intervention
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by student name or ID..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 bg-secondary border-border/50"
            />
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-24 bg-muted animate-pulse rounded" />
              ))}
            </div>
          ) : filtered.length > 0 ? (
            <div className="space-y-3">
              {filtered.map((intervention, i) => (
                <motion.div
                  key={intervention._id || intervention.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="border border-border/50 rounded-lg p-4 hover:bg-secondary/30 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">{intervention.studentName}</h3>
                        <span className="text-xs text-muted-foreground font-mono">{intervention.studentId}</span>
                        <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(intervention.status)} flex items-center gap-1`}>
                          {getStatusIcon(intervention.status)}
                          {intervention.status.charAt(0).toUpperCase() + intervention.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{intervention.type}: {intervention.description}</p>
                      <div className="flex gap-4 text-xs text-muted-foreground">
                        {intervention.faculty && <span>Faculty: {intervention.faculty}</span>}
                        <span>Start: {new Date(intervention.startDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              <p>No interventions found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default InterventionsPage;
