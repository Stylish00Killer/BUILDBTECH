import { useAuth } from "@/hooks/use-auth";
import { SidebarNav, studentNavItems } from "@/components/dashboard/sidebar-nav";
import { NoteSummarizer } from "@/components/ai/note-summarizer";
import { useQuery } from "@tanstack/react-query";
import { Note } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CalendarCheck, BookOpen } from "lucide-react";
import { format } from "date-fns";

export default function StudentDashboard() {
  const { user } = useAuth();
  const { data: notes = [] } = useQuery<Note[]>({
    queryKey: ["/api/notes"],
  });

  return (
    <div className="flex min-h-screen">
      <SidebarNav items={studentNavItems} className="w-64 flex-shrink-0" />

      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome, {user?.fullName}</h1>
          <p className="text-muted-foreground">
            Access your learning tools and track your progress
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarCheck className="h-5 w-5 text-primary" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative w-full h-[200px] bg-primary/5 rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">
                    Start by creating some notes or taking quizzes!
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Recent Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px] pr-4">
                  {notes.map((note) => (
                    <div key={note.id} className="mb-4 p-4 border rounded-lg">
                      <p className="text-sm text-muted-foreground mb-2">
                        {note.createdAt && format(new Date(note.createdAt), 'PPP')}
                      </p>
                      <p className="mb-2">{note.content}</p>
                      {note.summary && (
                        <div className="bg-muted p-3 rounded-md">
                          <p className="text-sm font-medium">AI Summary:</p>
                          <p className="text-sm">{note.summary}</p>
                        </div>
                      )}
                    </div>
                  ))}
                  {notes.length === 0 && (
                    <p className="text-center text-muted-foreground">
                      No notes yet. Start creating some!
                    </p>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          <div>
            <NoteSummarizer />
          </div>
        </div>
      </main>
    </div>
  );
}