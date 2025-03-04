
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { useState } from "react";
import { FileText, Download, Upload, Edit } from "lucide-react";

const insertResumeSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  targetRole: z.string().optional(),
});

type ResumeFormValues = z.infer<typeof insertResumeSchema>;

type Resume = {
  id: number;
  title: string;
  content: string;
  targetRole?: string;
  created: string;
  updated: string;
  aiSuggestions?: string;
};

export default function ResumePage() {
  const [resume, setResume] = useState<Resume | null>(null);
  
  const form = useForm<ResumeFormValues>({
    resolver: zodResolver(insertResumeSchema),,
    defaultValues: {
      title: "",
      content: "",
      targetRole: "",
    },
  });

  function onSubmit(data: ResumeFormValues) {
    console.log(data);
    // Add implementation
  }

  return (
    <div className="container py-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Resume Builder</h1>
        <p className="text-muted-foreground">
          Create and manage your professional resume
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Resume Editor</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Upload className="w-4 h-4 mr-2" />
                Import
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Resume Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Software Engineer Resume" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="targetRole"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Role</FormLabel>
                    <FormControl>
                      <Input placeholder="Frontend Developer" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Resume Content</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter your resume content..." 
                        className="h-64 font-mono"
                        {...field} 
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <div className="flex gap-2">
                <Button type="submit">
                  Save Resume
                </Button>
                <Button variant="outline" type="button">
                  Get AI Suggestions
                </Button>
              </div>
            </form>
          </Form>
        </Card>
        
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">AI Suggestions</h2>
          {resume?.aiSuggestions ? (
            <Card className="p-4">
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-primary mt-1" />
                <div>
                  <h3 className="font-medium">Improvement Recommendations</h3>
                  <p className="text-sm whitespace-pre-line mt-2">
                    {resume.aiSuggestions}
                  </p>
                </div>
              </div>
            </Card>
          ) : (
            <p className="text-muted-foreground">
              Submit your resume content to get AI-powered suggestions for improvement.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
