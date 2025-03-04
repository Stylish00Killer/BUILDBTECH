import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { useState } from "react";
import { Plus, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Building, Loader2 } from "lucide-react";
import { BackToDashboard } from "@/components/back-to-dashboard";


const insertProjectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  dueDate: z.string(),
  courseCode: z.string().optional(),
});

type ProjectFormValues = z.infer<typeof insertProjectSchema>;

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const { user } = useAuth();
  const { toast } = useToast();

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(insertProjectSchema),,
    defaultValues: {
      title: "",
      description: "",
      dueDate: new Date().toISOString().split("T")[0],
      courseCode: "",
    },
  });

  const { data: fetchedProjects, isLoading } = useQuery({
    queryKey: ["/api/academic/projects"],
    queryFn: async () => {
      const res = await fetch("/api/academic/projects");
      if (!res.ok) throw new Error("Failed to fetch projects");
      return res.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: ProjectFormValues) => {
      const res = await apiRequest("POST", "/api/academic/projects", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/academic/projects"] });
      form.reset();
      toast({
        title: "Success",
        description: "Project created successfully",
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

  const joinMutation = useMutation({
    mutationFn: async ({ projectId }: { projectId: number }) => {
      const res = await apiRequest("POST", `/api/academic/projects/${projectId}/members`, {
        userId: user!.id,
        role: "member",
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/academic/projects"] });
      toast({
        title: "Success",
        description: "Joined project successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  function onSubmit(data: ProjectFormValues) {
    createMutation.mutate(data);
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-border" />
      </div>
    );
  }

  return (
    <div className="container py-6 space-y-8">
      <BackToDashboard />
      <div>
        <h1 className="text-3xl font-bold">Academic Projects</h1>
        <p className="text-muted-foreground">
          Manage your course projects and assignments
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 col-span-1">
          <h2 className="text-xl font-semibold mb-4">Create New Project</h2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Database Design Project" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Project description and requirements..."
                        className="h-32"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="courseCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course Code</FormLabel>
                    <FormControl>
                      <Input placeholder="CS301" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={createMutation.isPending}>
                {createMutation.isPending && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                Create Project
              </Button>
            </form>
          </Form>
        </Card>

        <div className="col-span-1 md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">My Projects</h2>
          {fetchedProjects?.length === 0 ? (
            <div className="text-center py-8 bg-muted rounded-lg">
              <Users className="w-12 h-12 mx-auto text-muted-foreground" />
              <p className="mt-4">No projects created yet.</p>
              <p className="text-sm text-muted-foreground">
                Create your first project using the form on the left.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {fetchedProjects?.map((project: any) => (
                <Card key={project.id} className="p-4">
                  <div className="flex items-start gap-3">
                    <Building className="w-5 h-5 text-primary mt-1" />
                    <div className="flex-1">
                      <h3 className="font-medium">{project.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {project.description}
                      </p>
                      {project.aiSuggestions && (
                        <div className="mb-3 p-3 bg-muted rounded-md">
                          <p className="text-sm">{project.aiSuggestions}</p>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          <span className="text-sm text-muted-foreground">
                            {project.members?.length || 0} members
                          </span>
                        </div>
                        {!project.members?.some((m: any) => m.userId === user?.id) && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => joinMutation.mutate({ projectId: project.id })}
                            disabled={joinMutation.isPending}
                          >
                            {joinMutation.isPending && (
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            )}
                            Join Project
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}