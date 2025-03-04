import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema, type InsertUser } from "@shared/schema";
import { Redirect } from "wouter";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";

type LoginFormData = Pick<InsertUser, "username" | "password">;

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();
  const [isLogin, setIsLogin] = useState(true);

  const form = useForm<LoginFormData | InsertUser>({
    resolver: zodResolver(
      isLogin
        ? insertUserSchema.pick({ username: true, password: true })
        : insertUserSchema
    ),
    defaultValues: isLogin 
      ? { username: "", password: "" }
      : { username: "", password: "", fullName: "", role: "student" }
  });

  if (user) {
    return <Redirect to={user.role === "teacher" ? "/teacher" : "/student"} />;
  }

  const onSubmit = async (data: FormData) => {
    try {
      await apiRequest("POST", "/api/auth", data);
      toast({
        title: "Success",
        description: "You are now logged in.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit form.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      <div className="flex items-center justify-center p-8">
        <Card className="w-full max-w-md">
          <CardHeader className="flex flex-col items-center space-y-2">
            <img src="/logo.png" alt="BuildBTech Logo" className="h-16 w-auto mb-2" />
            <CardTitle>{isLogin ? "Login" : "Register"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  {...form.register("username")}
                />
                {form.formState.errors.username && (
                  <p className="text-sm text-destructive">{form.formState.errors.username.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  {...form.register("password")}
                />
                {form.formState.errors.password && (
                  <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
                )}
              </div>

              {!isLogin && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      {...form.register("fullName")}
                    />
                    {form.formState.errors.fullName && (
                      <p className="text-sm text-destructive">{form.formState.errors.fullName.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select onValueChange={(value) => form.setValue("role", value as "student" | "teacher")}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="teacher">Teacher</SelectItem>
                      </SelectContent>
                    </Select>
                    {form.formState.errors.role && (
                      <p className="text-sm text-destructive">{form.formState.errors.role.message}</p>
                    )}
                  </div>
                </>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={loginMutation.isPending || registerMutation.isPending}
              >
                {isLogin ? "Login" : "Register"}
              </Button>

              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => {
                  setIsLogin(!isLogin);
                  form.reset();
                }}
              >
                {isLogin ? "Need an account? Register" : "Have an account? Login"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <div className="hidden md:block bg-primary/5">
        <div className="h-full w-full p-12 flex items-center">
          <div>
            <div className="flex flex-col items-center mb-6">
              <img src="/logo.jpg" alt="BuildBTech Logo" className="h-24 mb-4" />
              <h1 className="text-4xl font-bold mb-4">Welcome to BuildBTech</h1>
              <p className="text-xl text-muted-foreground">
                Your AI-powered educational platform for enhanced learning and teaching.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}