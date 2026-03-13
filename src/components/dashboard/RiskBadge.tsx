type RiskLevel = 'low' | 'medium' | 'high';

const styles: Record<RiskLevel, string> = {
  low: "bg-success/15 text-success border-success/30",
  medium: "bg-warning/15 text-warning border-warning/30",
  high: "bg-destructive/15 text-destructive border-destructive/30",
};

export function RiskBadge({ risk }: { risk: RiskLevel }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${styles[risk]}`}>
      {risk} risk
    </span>
  );
}
