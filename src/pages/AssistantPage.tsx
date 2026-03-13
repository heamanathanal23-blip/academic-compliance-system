import { AiChatbot } from "@/components/dashboard/AiChatbot";

const AssistantPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">AI Assistant</h1>
        <p className="text-sm text-muted-foreground">Ask questions about student academic data</p>
      </div>
      <AiChatbot />
    </div>
  );
};

export default AssistantPage;
