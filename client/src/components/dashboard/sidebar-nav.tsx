import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import {
  BookOpen,
  GraduationCap,
  Layout,
  BookCheck,
  LogOut,
  Brain,
  PanelLeftClose,
  Trophy,
  Calendar,
  ShoppingBag,
  Clock,
  FileText,
  TestTube,
  Building,
  Users,
  Briefcase
} from "lucide-react";
import { useState } from "react";

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string;
    title: string;
    icon: React.ReactNode;
  }[];
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const [location] = useLocation();
  const { logoutMutation } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <nav
      className={cn(
        `flex flex-col h-screen bg-sidebar border-r px-4 py-8 transition-all duration-300`,
        isCollapsed ? "w-20" : "w-64",
        className
      )}
      {...props}
    >
      <div className="mb-8 flex items-center justify-between">
        <div className={cn("flex items-center", isCollapsed ? "justify-center w-full" : "")}>
          <img src="/logo.png" alt="Logo" className="h-8 w-8" />
          {!isCollapsed && (
            <h2 className="text-2xl font-bold text-sidebar-foreground ml-2">BuildBTech</h2>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="ml-2"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <PanelLeftClose className={cn("h-4 w-4 transition-transform", isCollapsed && "rotate-180")} />
        </Button>
      </div>

      <div className="space-y-2">
        {items.map((item) => (
          <Button
            key={item.href}
            variant={location === item.href ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-start gap-2",
              location === item.href ? "bg-sidebar-accent" : "",
              isCollapsed && "px-2"
            )}
            asChild
          >
            <a href={item.href} className="flex items-center">
              {item.icon}
              {!isCollapsed && item.title}
            </a>
          </Button>
        ))}
      </div>

      <div className="mt-auto">
        <Button
          variant="ghost"
          className={cn("w-full justify-start gap-2", isCollapsed && "px-2")}
          onClick={() => logoutMutation.mutate()}
        >
          <LogOut className="h-4 w-4" />
          {!isCollapsed && "Logout"}
        </Button>
      </div>
    </nav>
  );
}

export const dashboardItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: <Layout className="h-4 w-4" />,
  },
  {
    title: "Lab Reports",
    href: "/academic/lab-reports",
    icon: <TestTube className="h-4 w-4" />,
  },
  {
    title: "Projects",
    href: "/academic/projects",
    icon: <Building className="h-4 w-4" />,
  },
  {
    title: "Exam Prep",
    href: "/academic/exam-prep",
    icon: <Brain className="h-4 w-4" />,
  },
  {
    title: "Collaboration",
    href: "/academic/collab",
    icon: <Users className="h-4 w-4" />,
  },
  {
    title: "Resume",
    href: "/career/resume",
    icon: <FileText className="h-4 w-4" />,
  },
  {
    title: "Interview Prep",
    href: "/career/interview",
    icon: <Briefcase className="h-4 w-4" />,
  },
  {
    title: "Events",
    href: "/student-life/events",
    icon: <Calendar className="h-4 w-4" />,
  },
  {
    title: "Marketplace",
    href: "/student-life/marketplace",
    icon: <ShoppingBag className="h-4 w-4" />,
  },
  {
    title: "Notes",
    href: "/student-life/notes",
    icon: <BookOpen className="h-4 w-4" />,
  },
  {
    title: "Time Management",
    href: "/student-life/time-management",
    icon: <Clock className="h-4 w-4" />,
  },
  {
    title: "Achievements",
    href: "/achievements",
    icon: <Trophy className="h-4 w-4" />,
  },
];