import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { insertLabReportSchema } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { FileText, Plus, Edit, Trash, Download, Loader2 } from "lucide-react";
import { BackToDashboard } from "@/components/back-to-dashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

type LabReport = {
  id: number;
  title: string;
  course: string;
  dueDate: string;
  content: string;
  attachment?: string;
  createdAt: string; // Corrected field name
};

export default function LabReportsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedReport, setSelectedReport] = useState<number | null>(null);
  const [labReports, setLabReports] = useState<LabReport[]>([]);
  const [isCreatingReport, setIsCreatingReport] = useState(false); // Track creation state

  const form = useForm({
    resolver: zodResolver(insertLabReportSchema),
    defaultValues: {
      title: "",
      content: "",
      course: "",
      dueDate: "",
      attachment: null, // Added attachment field
    },
  });

  const { data: reports, isLoading } = useQuery({
    queryKey: ["/api/academic/lab-reports"],
    queryFn: async () => {
      const res = await fetch("/api/academic/lab-reports");
      if (!res.ok) throw new Error("Failed to fetch lab reports");
      return res.json();
    },
    onSuccess: (data) => {
      setLabReports(data); // Update state with fetched data
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: { title: string; content: string; course: string; dueDate: string; attachment: File | null }) => {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('content', data.content);
      formData.append('course', data.course);
      formData.append('dueDate', data.dueDate);
      if (data.attachment) {
        formData.append('attachment', data.attachment);
      }
      const res = await apiRequest("POST", "/api/academic/lab-reports", formData);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/academic/lab-reports"] });
      form.reset();
      setIsCreatingReport(false); // Reset creation state
      toast({
        title: "Success",
        description: "Lab report created successfully",
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
    createMutation.mutate({...data, attachment: data.attachment}); // Include attachment
  });

  if (isLoading && !reports) { //Handle initial loading state.
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
          <h1 className="text-3xl font-bold">Lab Reports</h1>
          <p className="text-muted-foreground">
            Manage your lab reports and experiments
          </p>
        </div>
        <Dialog open={isCreatingReport}> {/* Controlled by state */}
          <DialogTrigger asChild>
            <Button onClick={() => setIsCreatingReport(true)}> {/*Open the dialog*/}
              <Plus className="w-4 h-4 mr-2" />
              New Lab Report
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Lab Report</DialogTitle>
            </DialogHeader>
            <Form {...form} onSubmit={onSubmit}> {/* Integrate form */}
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="title" className="text-right">
                    Title
                  </label>
                  <Input
                    id="title"
                    {...form.register("title")}
                    placeholder="Physics Experiment #1"
                    className="col-span-3"
                  />
                  {form.formState.errors.title && (
                    <p className="text-sm text-destructive mt-1 col-span-3">
                      {form.formState.errors.title.message}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="course" className="text-right">
                    Course
                  </label>
                  <Input
                    id="course"
                    {...form.register("course")}
                    placeholder="PHY101"
                    className="col-span-3"
                  />
                  {form.formState.errors.course && (
                    <p className="text-sm text-destructive mt-1 col-span-3">
                      {form.formState.errors.course.message}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="dueDate" className="text-right">
                    Due Date
                  </label>
                  <Input
                    id="dueDate"
                    type="date"
                    {...form.register("dueDate")}
                    className="col-span-3"
                  />
                  {form.formState.errors.dueDate && (
                    <p className="text-sm text-destructive mt-1 col-span-3">
                      {form.formState.errors.dueDate.message}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="content" className="text-right">
                    Report Content
                  </label>
                  <Textarea
                    id="content"
                    {...form.register("content")}
                    placeholder="Type your lab report content here..."
                    className="col-span-3 h-40"
                  />
                  {form.formState.errors.content && (
                    <p className="text-sm text-destructive mt-1 col-span-3">
                      {form.formState.errors.content.message}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="attachment" className="text-right">
                    Attachment
                  </label>
                  <Input
                    id="attachment"
                    type="file"
                    {...form.register("attachment")}
                    className="col-span-3"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending && (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  Save Lab Report
                </Button>
              </div>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active">Active Reports</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        <TabsContent value="active" className="mt-6">
          {reports?.length === 0 ? (
            <div className="text-center py-10 bg-muted rounded-lg">
              <FileText className="w-10 h-10 mx-auto text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No Lab Reports</h3>
              <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
                You don't have any active lab reports. Create a new lab report to get started.
              </p>
              <Button onClick={() => setIsCreatingReport(true)}> {/*Open the dialog*/}
                <Plus className="w-4 h-4 mr-2" />
                New Lab Report
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {reports.map((report: LabReport) => (
                <Card
                  key={report.id}
                  className={`p-4 cursor-pointer transition-colors ${
                    selectedReport === report.id ? "border-primary" : ""
                  }`}
                  onClick={() => setSelectedReport(report.id)}
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-primary" />
                    <div>
                      <h3 className="font-medium">{report.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        Created on {new Date(report.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {/* {report.analysis && ( // Removed analysis display for simplicity */}
                  {/*   <div className="mt-4 p-3 bg-muted rounded-md"> */}
                  {/*     <p className="text-sm">{report.analysis}</p> */}
                  {/*   </div> */}
                  {/* )} */}
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="completed" className="mt-6">
          {/* Completed lab reports would be displayed here */}
          <div className="text-center py-10 bg-muted rounded-lg">
            <p>No completed lab reports.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}