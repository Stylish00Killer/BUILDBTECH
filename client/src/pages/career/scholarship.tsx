import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, GraduationCap, DollarSign, CalendarDays } from "lucide-react";
import { useState } from "react";

// Mock scholarship data (to be replaced with actual API integration)
const scholarships = [
  {
    id: 1,
    title: "Tech Innovation Scholarship",
    amount: 5000,
    deadline: "2025-05-01",
    criteria: "Computer Science students with GPA > 3.5",
    description: "For students pursuing innovation in technology",
  },
  {
    id: 2,
    title: "Future Leaders Grant",
    amount: 3000,
    deadline: "2025-06-15",
    criteria: "Leadership experience, community service",
    description: "Supporting tomorrow's community leaders",
  },
  {
    id: 3,
    title: "STEM Excellence Award",
    amount: 7500,
    deadline: "2025-04-30",
    criteria: "STEM majors, research experience",
    description: "Supporting excellence in STEM fields",
  },
];

export default function ScholarshipPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredScholarships = scholarships.filter(
    (scholarship) =>
      scholarship.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scholarship.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container py-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Scholarship Finder</h1>
          <p className="text-muted-foreground">
            Discover and apply for scholarships matched to your profile
          </p>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search scholarships..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <Button variant="outline">
          Filter
        </Button>
      </div>

      <div className="grid gap-6">
        {filteredScholarships.map((scholarship) => (
          <Card key={scholarship.id} className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  <h3 className="text-xl font-semibold">{scholarship.title}</h3>
                </div>
                <p className="text-muted-foreground">{scholarship.description}</p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    ${scholarship.amount.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <CalendarDays className="h-4 w-4" />
                    Due {new Date(scholarship.deadline).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Button>Apply Now</Button>
                <Button variant="outline">Save for Later</Button>
              </div>
            </div>
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">Eligibility Criteria</h4>
              <p className="text-sm">{scholarship.criteria}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
