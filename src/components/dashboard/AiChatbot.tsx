import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { analyticsService } from "@/services/analyticsService";
import { studentService } from "@/services/studentService";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface Student {
  name: string;
  gpa: number;
  department: string;
  attendance: number;
  risk: string;
}

const suggestions = [
  "How many students are at high risk?",
  "Which department has the highest GPA?",
  "Show me the average attendance",
  "Who are the top performers?",
];

export function AiChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hello! I'm your **Academic AI Assistant**. Ask me anything about student performance, risk classifications, or department analytics. 📊" },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Fetch analytics and student data
  const { data: kpiData } = useQuery({
    queryKey: ["analytics", "kpi"],
    queryFn: () => analyticsService.getKPI(),
    staleTime: 120000
  });

  const { data: students = [] } = useQuery<Student[]>({
    queryKey: ["students"],
    queryFn: () => studentService.getStudents(),
    staleTime: 120000
  });

  const { data: departmentData = [] } = useQuery({
    queryKey: ["analytics", "department-performance"],
    queryFn: () => analyticsService.getDepartmentPerformance(),
    staleTime: 120000
  });

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const generateResponse = (query: string): string => {
    const q = query.toLowerCase();

    if (q.includes("high risk") || q.includes("at-risk") || q.includes("at risk")) {
      const highRisk = students.filter(s => s.risk === "high");
      if (highRisk.length === 0) {
        return `Currently, there are **no students** classified as high risk.`;
      }
      return `There are **${highRisk.length} students** classified as high risk. These students require immediate academic intervention and support programs.`;
    }

    if (q.includes("highest gpa") || q.includes("best department")) {
      if (departmentData.length === 0) return "Department data is not available at the moment.";
      const best = [...departmentData].sort((a: any, b: any) => b.avgGpa - a.avgGpa)[0];
      return `**${best?.department || 'Top Department'}** leads with the highest average GPA of **${best?.avgGpa?.toFixed(2) || 'N/A'}**. Their strong performance suggests effective teaching methods worth replicating.`;
    }

    if (q.includes("average attendance") || q.includes("attendance")) {
      const avgAttendance = kpiData?.avgAttendance || 0;
      return `The institution-wide average attendance is **${avgAttendance}%**. Students with attendance below 70% show a strong correlation with high-risk classification.`;
    }

    if (q.includes("top performer") || q.includes("best student")) {
      if (students.length === 0) return "Student data is not available at the moment.";
      const top = [...students].sort((a, b) => b.gpa - a.gpa).slice(0, 5);
      const topList = top.map((s, i) => `${i + 1}. **${s.name}** — GPA: ${s.gpa}, ${s.department}`).join("\n");
      return `**Top Performers:**\n\n${topList}\n\nThese students demonstrate exceptional academic consistency.`;
    }

    if (q.includes("total") || q.includes("how many students")) {
      const totalStudents = kpiData?.totalStudents || students.length;
      const avgGpa = kpiData?.avgGpa || 0;
      return `There are currently **${totalStudents} students** enrolled, with an average GPA of **${avgGpa.toFixed(2)}**.`;
    }

    if (q.includes("low risk") || q.includes("safe")) {
      const lowRisk = students.filter(s => s.risk === "low");
      return `**${lowRisk.length} students** are classified as low risk, maintaining strong academic performance and attendance rates.`;
    }

    return `I can help you analyze student academic data. Try asking about:\n\n- **Risk classifications** (high, medium, low)\n- **Department comparisons**\n- **Top performers**\n- **Attendance trends**\n- **Overall statistics**\n\nWhat would you like to know?`;
  };

  const handleSend = (text?: string) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: msg }]);
    setIsTyping(true);

    setTimeout(() => {
      const response = generateResponse(msg);
      setMessages(prev => [...prev, { role: "assistant", content: response }]);
      setIsTyping(false);
    }, 800 + Math.random() * 600);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.45, duration: 0.4 }}
      className="glass-card flex flex-col h-[500px]"
    >
      <div className="flex items-center gap-2 border-b border-border/50 p-4">
        <div className="rounded-lg bg-primary/15 p-1.5">
          <Sparkles className="h-4 w-4 text-primary" />
        </div>
        <h3 className="font-heading text-sm font-semibold text-foreground">AI Academic Assistant</h3>
        <span className="ml-auto rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-medium text-success">Online</span>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${m.role === "user" ? "justify-end" : ""}`}
            >
              {m.role === "assistant" && (
                <div className="mt-0.5 rounded-lg bg-primary/15 p-1.5 h-fit">
                  <Bot className="h-3.5 w-3.5 text-primary" />
                </div>
              )}
              <div className={`max-w-[80%] rounded-lg px-3.5 py-2.5 text-sm leading-relaxed ${
                m.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground"
              }`}>
                {m.content.split("\n").map((line, li) => (
                  <span key={li}>
                    {line.split(/(\*\*[^*]+\*\*)/).map((part, pi) =>
                      part.startsWith("**") && part.endsWith("**")
                        ? <strong key={pi} className="font-semibold">{part.slice(2, -2)}</strong>
                        : part
                    )}
                    {li < m.content.split("\n").length - 1 && <br />}
                  </span>
                ))}
              </div>
              {m.role === "user" && (
                <div className="mt-0.5 rounded-lg bg-accent/15 p-1.5 h-fit">
                  <User className="h-3.5 w-3.5 text-accent" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        {isTyping && (
          <div className="flex gap-3">
            <div className="mt-0.5 rounded-lg bg-primary/15 p-1.5 h-fit">
              <Bot className="h-3.5 w-3.5 text-primary" />
            </div>
            <div className="rounded-lg bg-secondary px-3.5 py-2.5 text-sm text-muted-foreground">
              <span className="animate-pulse">Analyzing data...</span>
            </div>
          </div>
        )}
      </div>

      {messages.length <= 1 && (
        <div className="flex flex-wrap gap-2 px-4 pb-2">
          {suggestions.map(s => (
            <button
              key={s}
              onClick={() => handleSend(s)}
              className="rounded-full border border-border/50 bg-secondary/50 px-3 py-1 text-xs text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <div className="border-t border-border/50 p-3">
        <form
          onSubmit={e => { e.preventDefault(); handleSend(); }}
          className="flex gap-2"
        >
          <Input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask about student performance..."
            className="bg-secondary border-border/50"
          />
          <Button type="submit" size="icon" disabled={!input.trim() || isTyping} className="shrink-0">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </motion.div>
  );
}
