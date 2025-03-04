import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Card } from "@/components/ui/card";
import { Link } from "wouter";
import { 
  TestTube, 
  Building, 
  Brain, 
  Users,
  FileText,
  Briefcase,
  Calendar,
  ShoppingBag,
  Book,
  Clock,
  Trophy
} from "lucide-react";
import { SidebarNav, dashboardItems } from "@/components/dashboard/sidebar-nav";

const features = [
  {
    title: "Academic",
    items: [
      { name: "AutoLab", icon: TestTube, href: "/academic/lab-reports", description: "AI-generated lab reports & analysis" },
      { name: "BuildIt", icon: Building, href: "/academic/projects", description: "AI project ideas & mentoring" },
      { name: "ExamAI", icon: Brain, href: "/academic/exam-prep", description: "Personalized exam preparation" },
      { name: "CollabMate", icon: Users, href: "/academic/collab", description: "AI team builder for projects" }
    ]
  },
  {
    title: "Career",
    items: [
      { name: "Resume Builder", icon: FileText, href: "/career/resume", description: "AI-powered resume creation" },
      { name: "Mock Interview", icon: Briefcase, href: "/career/interview", description: "Interview practice with AI" }
    ]
  },
  {
    title: "Student Life",
    items: [
      { name: "Event Finder", icon: Calendar, href: "/student-life/events", description: "Discover opportunities" },
      { name: "Marketplace", icon: ShoppingBag, href: "/student-life/marketplace", description: "Buy & sell essentials" },
      { name: "Notes", icon: Book, href: "/student-life/notes", description: "Organize study materials" },
      { name: "Study Plans", icon: Clock, href: "/student-life/study-plans", description: "AI-generated schedules" }
    ]
  }
];

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <img src="/logo.jpg" alt="BuildBTech Logo" className="h-12" />
          <h1 className="text-3xl font-bold">Dashboard</h1>
        </div>
      </div>

      {/* Dashboard content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Dashboard cards will go here */}
      </div>
    </div>
  );
  const { user } = useAuth();

  return (
    <div className="flex h-screen">
      <SidebarNav items={dashboardItems} />
      <div className="flex-1 overflow-auto">
        <div className="container py-6 space-y-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <img src="/logo.png" alt="BuildBTech Logo" className="h-16 w-auto" />
              <div>
                <h1 className="text-3xl font-bold">Welcome, {user?.fullName}</h1>
                <p className="text-muted-foreground">Your learning assistant powered by AI</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-right">
                <p className="font-medium">Points: {user?.points || 0}</p>
                <Link href="/achievements">
                  <Button variant="link" className="p-0">
                    <Trophy className="w-4 h-4 mr-1" />
                    View Achievements
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="grid gap-6">
            {features.map((section) => (
              <section key={section.title}>
                <h2 className="text-2xl font-semibold mb-4">{section.title}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {section.items.map((item) => (
                    <Link key={item.name} href={item.href}>
                      <Card className="p-4 hover:bg-accent transition-colors cursor-pointer">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <item.icon className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{item.name}</h3>
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}