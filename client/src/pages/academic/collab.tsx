import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Users, UserPlus, BookOpen, Loader2, CheckCircle } from "lucide-react";

export default function CollabPage() {
  const { toast } = useToast();

  const { data: projects, isLoading } = useQuery({
    queryKey: ["/api/academic/projects"],
    queryFn: async () => {
      const res = await fetch("/api/academic/projects");
      if (!res.ok) throw new Error("Failed to fetch projects");
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-border" />
      </div>
    );
  }

  // Filter projects that are looking for team members
  const openProjects = projects?.filter((project: any) => 
    project.members?.length < 4 // Assuming max team size is 4
  );

  return (
    <div className="container py-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Team Collaboration</h1>
          <p className="text-muted-foreground">Find the perfect team for your projects</p>
        </div>
        <Button>
          <UserPlus className="w-4 h-4 mr-2" />
          Create Team
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {openProjects?.length === 0 ? (
          <p className="text-muted-foreground col-span-full">No projects looking for team members.</p>
        ) : (
          openProjects?.map((project: any) => (
            <Card key={project.id} className="p-4">
              <div className="flex flex-col h-full">
                <div className="flex items-center gap-3 mb-4">
                  <Users className="w-5 h-5 text-primary" />
                  <div>
                    <h3 className="font-medium">{project.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {project.members?.length || 0} / 4 members
                    </p>
                  </div>
                </div>

                <div className="flex-1">
                  <p className="text-sm mb-4">{project.description}</p>

                  <div className="space-y-3">
                    <h4 className="text-sm font-medium">Required Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {["Programming", "Design", "Research"].map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Team Members</h4>
                    <div className="space-y-2">
                      {project.members?.map((member: any) => (
                        <div key={member.id} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-primary" />
                          <span className="text-sm">{member.user?.fullName}</span>
                          {member.role === "leader" && (
                            <span className="text-xs text-muted-foreground">(Leader)</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t">
                  <Button className="w-full" variant="outline">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Request to Join
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
