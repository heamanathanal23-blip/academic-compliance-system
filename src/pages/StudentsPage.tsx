import { StudentDirectory } from "@/components/dashboard/StudentDirectory";

const StudentsPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Students</h1>
        <p className="text-sm text-muted-foreground">Search and manage student records</p>
      </div>
      <StudentDirectory />
    </div>
  );
};

export default StudentsPage;
