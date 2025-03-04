import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { useState } from "react";

const insertExamPrepSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subject: z.string().min(1, "Subject is required"),
  date: z.string(),
  notes: z.string().optional(),
});

type ExamPrepFormValues = z.infer<typeof insertExamPrepSchema>;

export default function ExamPrepPage() {
  const [examPreps, setExamPreps] = useState([]);

  const form = useForm<ExamPrepFormValues>({
    resolver: zodResolver(insertExamPrepSchema),,
    defaultValues: {
      title: "",
      subject: "",
      date: new Date().toISOString().split("T")[0],
      notes: "",
    },
  });

  function onSubmit(data: ExamPrepFormValues) {
    console.log(data);
    // Add implementation to persist data
    setExamPreps([...examPreps, data]); //Temporary; replace with actual API call
    form.reset();
  }

  return (
    <div className="container py-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Exam Preparation</h1>
        <p className="text-muted-foreground">
          Track your exam preparation and study materials
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 col-span-1">
          <h2 className="text-xl font-semibold mb-4">Add New Exam Prep</h2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Midterm Exam" {...field} />
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
                      <Input placeholder="Computer Science" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Exam Date</FormLabel>
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
                    <FormLabel>Study Notes</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter your notes here..." 
                        className="h-32"
                        {...field} 
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Save Exam Prep
              </Button>
            </form>
          </Form>
        </Card>

        <div className="col-span-1 md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">My Exam Preparations</h2>
          {examPreps.length === 0 ? (
            <div className="text-center py-8 bg-muted rounded-lg">
              <p>No exam preparations added yet.</p>
              <p className="text-sm text-muted-foreground">
                Add your first exam preparation using the form on the left.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {examPreps.map((prep, index) => (
                <Card key={index} className="p-4"> {/*Using index as key temporarily*/}
                  <div>
                    <h3>{prep.title}</h3>
                    <p>Subject: {prep.subject}</p>
                    <p>Date: {prep.date}</p>
                    {prep.notes && <p>Notes: {prep.notes}</p>}
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