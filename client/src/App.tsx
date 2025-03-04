import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import DashboardPage from "@/pages/dashboard-page";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";

// Academic Routes
import LabReportsPage from "@/pages/academic/lab-reports";
import ProjectsPage from "@/pages/academic/projects";
import ExamPrepPage from "@/pages/academic/exam-prep";
import CollabPage from "@/pages/academic/collab";

// Career Routes
import ResumePage from "@/pages/career/resume";
import InterviewPage from "@/pages/career/interview";
import ScholarshipPage from "@/pages/career/scholarship";
import ExpensePage from "@/pages/career/expense";

// Student Life Routes
import EventsPage from "@/pages/student-life/events";
import MarketplacePage from "@/pages/student-life/marketplace";
import NotesPage from "@/pages/student-life/notes";
import StudyPlansPage from "@/pages/student-life/study-plans";
import RemindersPage from "@/pages/student-life/reminders";
import TimeManagementPage from "@/pages/student-life/time-management";

// Gamification
import AchievementsPage from "@/pages/achievements";

function Router() {
  return (
    <Switch>
      <Route path="/auth" component={AuthPage} />

      {/* Main Dashboard */}
      <ProtectedRoute path="/" component={DashboardPage} />

      {/* Academic Routes */}
      <ProtectedRoute path="/academic/lab-reports" component={LabReportsPage} />
      <ProtectedRoute path="/academic/projects" component={ProjectsPage} />
      <ProtectedRoute path="/academic/exam-prep" component={ExamPrepPage} />
      <ProtectedRoute path="/academic/collab" component={CollabPage} />

      {/* Career Routes */}
      <ProtectedRoute path="/career/resume" component={ResumePage} />
      <ProtectedRoute path="/career/interview" component={InterviewPage} />
      <ProtectedRoute path="/career/scholarship" component={ScholarshipPage} />
      <ProtectedRoute path="/career/expense" component={ExpensePage} />

      {/* Student Life Routes */}
      <ProtectedRoute path="/student-life/events" component={EventsPage} />
      <ProtectedRoute path="/student-life/marketplace" component={MarketplacePage} />
      <ProtectedRoute path="/student-life/notes" component={NotesPage} />
      <ProtectedRoute path="/student-life/study-plans" component={StudyPlansPage} />
      <ProtectedRoute path="/student-life/reminders" component={RemindersPage} />
      <ProtectedRoute path="/student-life/time-management" component={TimeManagementPage} />

      {/* Gamification */}
      <ProtectedRoute path="/achievements" component={AchievementsPage} />

      <Route component={NotFound} />
    </Switch>
  );
}

import { ThemeProvider } from "@/hooks/use-theme";

function App() {
  return (
    <ThemeProvider defaultTheme="system">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Router />
          <Toaster />
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;