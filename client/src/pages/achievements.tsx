import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Medal, Award, Trophy, Star, Shield, BookOpen, Code, FileText, User, Calendar, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

type UserBadge = {
  id: number;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedDate?: string;
};

export default function AchievementsPage() {
  const { data: badges, isLoading: badgesLoading } = useQuery({
    queryKey: ["badges"],
    queryFn: async () => {
      // Mocked data for now
      return [
        { id: 1, name: "First Login", description: "Logged in for the first time", icon: "User", earned: true, earnedDate: "2023-01-15" },
        { id: 2, name: "Study Master", description: "Created 10 study plans", icon: "BookOpen", earned: true, earnedDate: "2023-02-03" },
        { id: 3, name: "Quiz Ace", description: "Scored 100% on 5 quizzes", icon: "Award", earned: false },
        { id: 4, name: "Note Taker", description: "Created 20 notes", icon: "FileText", earned: false },
        { id: 5, name: "Project Manager", description: "Completed 3 projects", icon: "Code", earned: true, earnedDate: "2023-03-10" },
        { id: 6, name: "Consistent Learner", description: "Used the app for 7 consecutive days", icon: "Calendar", earned: false },
        { id: 7, name: "Time Manager", description: "Created 5 study plans with time allocations", icon: "Clock", earned: true, earnedDate: "2023-02-20" },
        { id: 8, name: "Academic Excellence", description: "Created content in all academic features", icon: "Trophy", earned: false },
      ] as UserBadge[];
    },
  });

  const earnedBadges = badges?.filter(badge => badge.earned) || [];
  const unearnedBadges = badges?.filter(badge => !badge.earned) || [];

  // Helper function to render the correct icon
  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case "Medal": return <Medal className="h-6 w-6" />;
      case "Award": return <Award className="h-6 w-6" />;
      case "Trophy": return <Trophy className="h-6 w-6" />;
      case "Star": return <Star className="h-6 w-6" />;
      case "Shield": return <Shield className="h-6 w-6" />;
      case "BookOpen": return <BookOpen className="h-6 w-6" />;
      case "Code": return <Code className="h-6 w-6" />;
      case "FileText": return <FileText className="h-6 w-6" />;
      case "User": return <User className="h-6 w-6" />;
      case "Calendar": return <Calendar className="h-6 w-6" />;
      case "Clock": return <Clock className="h-6 w-6" />;
      default: return <Award className="h-6 w-6" />;
    }
  };

  return (
    <div className="container py-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Achievements</h1>
        <p className="text-muted-foreground">
          Track your progress and earn badges for your accomplishments
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 col-span-1">
          <h2 className="text-xl font-semibold">Your Progress</h2>
          <div className="mt-4 space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Badges Earned</span>
                <span className="text-sm font-medium">{earnedBadges.length}/{badges?.length || 0}</span>
              </div>
              <Progress value={badges ? (earnedBadges.length / badges.length) * 100 : 0} />
            </div>

            <div className="pt-4 border-t">
              <h3 className="font-medium mb-2">Recent Achievements</h3>
              {earnedBadges.length > 0 ? (
                <div className="space-y-2">
                  {earnedBadges.slice(0, 3).map(badge => (
                    <div key={badge.id} className="flex items-center gap-2">
                      <div className="bg-primary/10 p-1.5 rounded-full text-primary">
                        {renderIcon(badge.icon)}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{badge.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(badge.earnedDate!).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No badges earned yet</p>
              )}
            </div>
          </div>
        </Card>

        <div className="col-span-1 md:col-span-3">
          <h2 className="text-xl font-semibold mb-4">Badges</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {badgesLoading ? (
              <p>Loading badges...</p>
            ) : (
              <>
                {badges?.map(badge => (
                  <Card 
                    key={badge.id} 
                    className={`p-4 flex items-center gap-4 ${!badge.earned ? 'opacity-60' : ''}`}
                  >
                    <div className={`p-3 rounded-full ${badge.earned ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                      {renderIcon(badge.icon)}
                    </div>
                    <div>
                      <h3 className="font-medium">{badge.name}</h3>
                      <p className="text-sm text-muted-foreground">{badge.description}</p>
                      {badge.earned && (
                        <Badge variant="outline" className="mt-2">
                          Earned on {new Date(badge.earnedDate!).toLocaleDateString()}
                        </Badge>
                      )}
                    </div>
                  </Card>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}