import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Clock,
  Calendar,
  BookOpen,
  Brain,
  Coffee,
  Loader2,
  BarChart,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { queryClient, apiRequest } from "@/lib/queryClient";

export default function TimeManagementPage() {
  const { toast } = useToast();
  const [activeSession, setActiveSession] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      subject: "",
      duration: 25, // Default Pomodoro duration
      breakDuration: 5,
    },
  });

  const { data: sessions, isLoading, isError } = useQuery({
    queryKey: ["/api/student-life/time-management"],
    queryFn: async () => {
      const res = await fetch("/api/student-life/time-management");
      if (!res.ok) throw new Error("Failed to fetch study sessions");
      return res.json();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: { subject: string; duration: number; breakDuration: number }) => {
      const res = await apiRequest("POST", "/api/student-life/time-management", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/student-life/time-management"] });
      form.reset();
      toast({
        title: "Success",
        description: "Study session started",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    createMutation.mutate(data);
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-border" />
      </div>
    );
  }

  return (
    <div className="container py-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Time Management Helper</h1>
          <p className="text-muted-foreground">Optimize your study sessions with smart breaks</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Start Study Session</h2>
            <Form {...form}>
              <form onSubmit={onSubmit} className="space-y-4">
                <div>
                  <label htmlFor="subject" className="text-sm font-medium">
                    Subject
                  </label>
                  <Input
                    id="subject"
                    {...form.register("subject")}
                    placeholder="What are you studying?"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="duration" className="text-sm font-medium">
                      Focus Duration (minutes)
                    </label>
                    <Input
                      id="duration"
                      type="number"
                      min="1"
                      max="60"
                      {...form.register("duration")}
                    />
                  </div>
                  <div>
                    <label htmlFor="breakDuration" className="text-sm font-medium">
                      Break Duration (minutes)
                    </label>
                    <Input
                      id="breakDuration"
                      type="number"
                      min="1"
                      max="30"
                      {...form.register("breakDuration")}
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="w-full"
                >
                  {createMutation.isPending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Clock className="w-4 h-4 mr-2" />
                  )}
                  Start Session
                </Button>
              </form>
            </Form>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Study Tips</h2>
              <Brain className="w-5 h-5 text-primary" />
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Start with the most challenging subject when your energy is high
              </li>
              <li className="flex items-center gap-2">
                <Coffee className="w-4 h-4" />
                Take regular breaks to maintain focus and productivity
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Use the Pomodoro Technique: 25 minutes of focus, 5 minutes break
              </li>
              <li className="flex items-center gap-2">
                <Brain className="w-4 h-4" />
                Review material periodically to reinforce learning
              </li>
            </ul>
          </Card>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Study Sessions</h2>
            <BarChart className="w-5 h-5 text-muted-foreground" />
          </div>

          {sessions?.length === 0 ? (
            <p className="text-muted-foreground">No study sessions recorded yet.</p>
          ) : (
            sessions?.map((session: any) => (
              <Card key={session.id} className="p-4">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-primary mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{session.subject}</h3>
                      <span className="text-sm text-muted-foreground">
                        {new Date(session.startTime).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {session.duration} minutes focus
                      </span>
                      <span className="flex items-center gap-1">
                        <Coffee className="w-4 h-4" />
                        {session.breakDuration} minutes break
                      </span>
                    </div>
                    {session.aiSuggestions && (
                      <div className="mt-4 p-3 bg-muted rounded-md">
                        <h4 className="font-medium mb-1">AI Feedback</h4>
                        <p className="text-sm">{session.aiSuggestions}</p>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
