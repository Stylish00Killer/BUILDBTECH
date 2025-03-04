
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { useState } from "react";
import { Briefcase, Video, Calendar, Clock } from "lucide-react";

const insertMockInterviewSchema = z.object({
  company: z.string().min(1, "Company name is required"),
  position: z.string().min(1, "Position is required"),
  date: z.string(),
  notes: z.string().optional(),
});

type MockInterviewFormValues = z.infer<typeof insertMockInterviewSchema>;

export default function MockInterviewPage() {
  const [interviews, setInterviews] = useState([]);
  
  const form = useForm<MockInterviewFormValues>({
    resolver: zodResolver(insertMockInterviewSchema),,
    defaultValues: {
      company: "",
      position: "",
      date: new Date().toISOString().split("T")[0],
      notes: "",
    },
  });

  function onSubmit(data: MockInterviewFormValues) {
    console.log(data);
    // Add implementation
  }

  return (
    <div className="container py-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Mock Interviews</h1>
        <p className="text-muted-foreground">
          Schedule and prepare for your upcoming interviews
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 col-span-1">
          <h2 className="text-xl font-semibold mb-4">Schedule an Interview</h2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company</FormLabel>
                    <FormControl>
                      <Input placeholder="Google" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position</FormLabel>
                    <FormControl>
                      <Input placeholder="Software Engineer" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Interview Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preparation Notes</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Topics to prepare, questions to ask..." 
                        className="h-32"
                        {...field} 
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full">
                Schedule Interview
              </Button>
            </form>
          </Form>
        </Card>
        
        <div className="col-span-1 md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Upcoming Interviews</h2>
          {interviews.length === 0 ? (
            <div className="text-center py-8 bg-muted rounded-lg">
              <Briefcase className="w-12 h-12 mx-auto text-muted-foreground" />
              <p className="mt-4">No interviews scheduled yet.</p>
              <p className="text-sm text-muted-foreground">
                Schedule your first mock interview using the form on the left.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Interview items would be mapped here */}
            </div>
          )}
          
          <h2 className="text-xl font-semibold mt-8 mb-4">Interview Resources</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="p-4">
              <div className="flex items-start gap-3">
                <Video className="w-5 h-5 text-primary mt-1" />
                <div>
                  <h3 className="font-medium">Practice Videos</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Watch example interviews to prepare for common questions
                  </p>
                  <Button variant="link" className="p-0 h-auto mt-2">
                    Browse Videos
                  </Button>
                </div>
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-primary mt-1" />
                <div>
                  <h3 className="font-medium">Peer Practice Sessions</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Schedule practice interviews with other students
                  </p>
                  <Button variant="link" className="p-0 h-auto mt-2">
                    Find Partners
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
