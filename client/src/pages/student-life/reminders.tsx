import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Bell, Calendar, Clock, CheckCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { queryClient, apiRequest } from "@/lib/queryClient";

export default function RemindersPage() {
  const { toast } = useToast();
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all");

  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      dueDate: "",
    },
  });

  const { data: reminders, isLoading } = useQuery({
    queryKey: ["/api/student-life/reminders"],
    queryFn: async () => {
      const res = await fetch("/api/student-life/reminders");
      if (!res.ok) throw new Error("Failed to fetch reminders");
      return res.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: { title: string; description: string; dueDate: string }) => {
      const res = await apiRequest("POST", "/api/student-life/reminders", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/student-life/reminders"] });
      form.reset();
      toast({
        title: "Success",
        description: "Reminder created successfully",
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

  const filteredReminders = reminders?.filter((reminder: any) => {
    if (filter === "all") return true;
    if (filter === "pending") return !reminder.completed;
    return reminder.completed;
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
          <h1 className="text-3xl font-bold">Reminders & Deadlines</h1>
          <p className="text-muted-foreground">Track assignments, exams, and important dates</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Add New Reminder</h2>
          <Form {...form}>
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label htmlFor="title" className="text-sm font-medium">Title</label>
                <Input
                  id="title"
                  {...form.register("title")}
                  placeholder="e.g. Submit Mathematics Assignment"
                />
              </div>
              <div>
                <label htmlFor="description" className="text-sm font-medium">Description</label>
                <Textarea
                  id="description"
                  {...form.register("description")}
                  placeholder="Add details about the task..."
                  rows={3}
                />
              </div>
              <div>
                <label htmlFor="dueDate" className="text-sm font-medium">Due Date</label>
                <Input
                  id="dueDate"
                  type="datetime-local"
                  {...form.register("dueDate")}
                />
              </div>
              <Button
                type="submit"
                disabled={createMutation.isPending}
                className="w-full"
              >
                {createMutation.isPending && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                Add Reminder
              </Button>
            </form>
          </Form>
        </Card>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Your Reminders</h2>
            <div className="flex gap-2">
              <Button
                variant={filter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("all")}
              >
                All
              </Button>
              <Button
                variant={filter === "pending" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("pending")}
              >
                Pending
              </Button>
              <Button
                variant={filter === "completed" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("completed")}
              >
                Completed
              </Button>
            </div>
          </div>

          {filteredReminders?.length === 0 ? (
            <p className="text-muted-foreground">No reminders found.</p>
          ) : (
            filteredReminders?.map((reminder: any) => (
              <Card key={reminder.id} className="p-4">
                <div className="flex items-start gap-3">
                  <Bell className="w-5 h-5 text-primary mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{reminder.title}</h3>
                      <span className={`text-sm ${
                        reminder.completed ? "text-green-600" : "text-yellow-600"
                      }`}>
                        {reminder.completed ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <Clock className="w-4 h-4" />
                        )}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {reminder.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>Due {new Date(reminder.dueDate).toLocaleString()}</span>
                    </div>
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
