
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { useState } from "react";
import { Calendar, Clock, BookOpen, CheckCircle, Plus } from "lucide-react";

const insertStudyPlanSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  date: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  subject: z.string().min(1, "Subject is required"),
});

type StudyPlanFormValues = z.infer<typeof insertStudyPlanSchema>;

export default function StudyPlansPage() {
  const [studyPlans, setStudyPlans] = useState([]);
  
  const form = useForm<StudyPlanFormValues>({
    resolver: zodResolver(insertStudyPlanSchema),,
    defaultValues: {
      title: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
      startTime: "",
      endTime: "",
      subject: "",
    },
  });

  function onSubmit(data: StudyPlanFormValues) {
    console.log(data);
    // Add implementation
  }

  return (
    <div className="container py-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Study Planner</h1>
        <p className="text-muted-foreground">
          Plan and organize your study sessions effectively
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 col-span-1">
          <h2 className="text-xl font-semibold mb-4">Create Study Plan</h2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Calculus Review" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <FormControl>
                      <Input placeholder="Mathematics" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Time</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="endTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Time</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="What will you study in this session?" 
                        className="h-24"
                        {...field} 
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full">
                Create Study Plan
              </Button>
            </form>
          </Form>
        </Card>
        
        <div className="col-span-1 md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Upcoming Study Sessions</h2>
          {studyPlans.length === 0 ? (
            <div className="text-center py-8 bg-muted rounded-lg">
              <BookOpen className="w-12 h-12 mx-auto text-muted-foreground" />
              <p className="mt-4">No study plans created yet.</p>
              <p className="text-sm text-muted-foreground">
                Create your first study plan using the form on the left.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Study plan items would be mapped here */}
            </div>
          )}
          
          <h2 className="text-xl font-semibold mt-8 mb-4">Study Tips</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="p-4">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-primary mt-1" />
                <div>
                  <h3 className="font-medium">Pomodoro Technique</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Study for 25 minutes, then take a 5-minute break. Repeat.
                  </p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary mt-1" />
                <div>
                  <h3 className="font-medium">Active Recall</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Quiz yourself on key concepts to improve retention.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
