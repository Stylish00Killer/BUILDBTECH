
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { useState } from "react";
import { FileText, Search, Trash, Edit, Plus } from "lucide-react";

type Note = {
  id: number;
  title: string;
  content: string;
  created: string;
  tags?: string[];
};

const insertNoteSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  tags: z.string().optional(),
});

type NoteFormValues = z.infer<typeof insertNoteSchema>;

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  
  const form = useForm<NoteFormValues>({
    defaultValues: {
      title: "",
      content: "",
      tags: "",
    },
  });

  function onSubmit(data: NoteFormValues) {
    console.log(data);
    // Add implementation
  }

  return (
    <div className="container py-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Study Notes</h1>
          <p className="text-muted-foreground">
            Create and organize your academic notes
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Input 
            placeholder="Search notes..." 
            className="w-64"
            startIcon={<Search className="w-4 h-4" />}
          />
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Note
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1">
          <h2 className="text-xl font-semibold mb-4">All Notes</h2>
          {notes.length === 0 ? (
            <div className="text-center py-8 bg-muted rounded-lg">
              <FileText className="w-12 h-12 mx-auto text-muted-foreground" />
              <p className="mt-4">No notes created yet.</p>
              <p className="text-sm text-muted-foreground">
                Create your first note to get started.
              </p>
              <Button className="mt-4">
                <Plus className="w-4 h-4 mr-2" />
                Create Note
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {/* Note items would be mapped here */}
            </div>
          )}
        </div>
        
        <div className="col-span-1 md:col-span-2">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">
              {selectedNote ? "Edit Note" : "Create New Note"}
            </h2>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Note Title" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Write your note here..." 
                          className="h-64"
                          {...field} 
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags (comma separated)</FormLabel>
                      <FormControl>
                        <Input placeholder="math, science, homework" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <div className="flex gap-2">
                  <Button type="submit">
                    {selectedNote ? "Update Note" : "Save Note"}
                  </Button>
                  {selectedNote && (
                    <Button variant="destructive" type="button">
                      <Trash className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </Card>
        </div>
      </div>
    </div>
  );
}
