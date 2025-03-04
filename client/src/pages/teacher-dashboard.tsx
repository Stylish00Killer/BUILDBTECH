import { useAuth } from "@/hooks/use-auth";
import { SidebarNav, teacherNavItems } from "@/components/dashboard/sidebar-nav";
import { QuizGenerator } from "@/components/ai/quiz-generator";
import { useQuery } from "@tanstack/react-query";
import { Quiz } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GraduationCap, BookCheck, Users } from "lucide-react";
import { format } from "date-fns";

export default function TeacherDashboard() {
  const { user } = useAuth();
  const { data: quizzes = [] } = useQuery<Quiz[]>({
    queryKey: ["/api/quizzes"],
  });

  return (
    <div className="flex min-h-screen">
      <SidebarNav items={teacherNavItems} className="w-64 flex-shrink-0" />

      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome, {user?.fullName}</h1>
          <p className="text-muted-foreground">
            Manage your classes and create learning materials
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Class Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative w-full h-[200px] bg-primary/5 rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">
                    Start by creating quizzes for your students!
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookCheck className="h-5 w-5 text-primary" />
                  Recent Quizzes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px] pr-4">
                  {quizzes.map((quiz) => (
                    <div key={quiz.id} className="mb-4 p-4 border rounded-lg">
                      <h3 className="font-medium mb-2">{quiz.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {quiz.createdAt && format(new Date(quiz.createdAt), 'PPP')}
                      </p>
                      <p className="text-sm">{quiz.content}</p>
                    </div>
                  ))}
                  {quizzes.length === 0 && (
                    <p className="text-center text-muted-foreground">
                      No quizzes yet. Start creating some!
                    </p>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          <div>
            <QuizGenerator />
          </div>
        </div>
      </main>
    </div>
  );
}