import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Sparkles } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export function NoteSummarizer() {
  const [content, setContent] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const summarizeMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/notes", { content });
      const note = await res.json();
      
      const summaryRes = await apiRequest("POST", `/api/notes/${note.id}/summarize`, {
        content,
      });
      return await summaryRes.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notes"] });
      toast({
        title: "Note summarized",
        description: "Your note has been saved and summarized.",
      });
      setContent("");
    },
    onError: (error) => {
      toast({
        title: "Failed to summarize",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Note Summarizer
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Textarea
            placeholder="Enter your notes here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[200px]"
          />
          <Button
            className="w-full"
            onClick={() => summarizeMutation.mutate()}
            disabled={!content || summarizeMutation.isPending}
          >
            {summarizeMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Summarizing...
              </>
            ) : (
              "Summarize Notes"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
