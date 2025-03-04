import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Calendar, MapPin, Users } from "lucide-react";
import { useState } from "react";
import { Event } from "@shared/schema";
import { toast } from "@/components/ui/use-toast";

export default function EventsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: events, isLoading, isError } = useQuery({
    queryKey: ["/api/student-life/events"],
    queryFn: async () => {
      const res = await fetch("/api/student-life/events");
      if (!res.ok) throw new Error("Failed to fetch events");
      return res.json() as Promise<Event[]>;
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const filteredEvents = events?.filter(
    (event) =>
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container py-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Events & Opportunities</h1>
          <p className="text-muted-foreground">
            Discover hackathons, workshops, and internship opportunities
          </p>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search events..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <Button variant="outline">Filter</Button>
      </div>

      <div className="grid gap-6">
        {filteredEvents?.map((event) => (
          <Card key={event.id} className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">{event.title}</h3>
                <p className="text-muted-foreground">{event.description}</p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(event.startDate).toLocaleDateString()} -{" "}
                    {new Date(event.endDate).toLocaleDateString()}
                  </span>
                  {event.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {event.location}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    20 registered
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button>Register Now</Button>
                <Button variant="outline">Learn More</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
