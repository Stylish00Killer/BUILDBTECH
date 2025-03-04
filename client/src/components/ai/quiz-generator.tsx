import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, BookCheck } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export function QuizGenerator() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const generateQuizMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/quizzes", { title, content });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/quizzes"] });
      toast({
        title: "Quiz generated",
        description: "Your quiz has been created successfully.",
      });
      setTitle("");
      setContent("");
    },
    onError: (error) => {
      toast({
        title: "Failed to generate quiz",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookCheck className="h-5 w-5 text-primary" />
          AI Quiz Generator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Input
              placeholder="Quiz title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <Textarea
              placeholder="Enter the content to generate questions from..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[200px]"
            />
          </div>
          <Button
            className="w-full"
            onClick={() => generateQuizMutation.mutate()}
            disabled={!title || !content || generateQuizMutation.isPending}
          >
            {generateQuizMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Quiz...
              </>
            ) : (
              "Generate Quiz"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
