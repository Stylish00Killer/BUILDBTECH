import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Search,
  Plus,
  DollarSign,
  Package,
  BookOpen,
  Laptop,
  Tag,
} from "lucide-react";
import { useState } from "react";
import { Marketplace } from "@shared/schema";
import { queryClient } from "@/lib/queryClient";

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);

  const { data: listings, isLoading } = useQuery({
    queryKey: ["/api/student-life/marketplace"],
    queryFn: async () => {
      const res = await fetch("/api/student-life/marketplace");
      if (!res.ok) throw new Error("Failed to fetch marketplace listings");
      return res.json() as Promise<Marketplace[]>;
    },
  });

  const filteredListings = listings?.filter(
    (listing) =>
      (!category || listing.category === category) &&
      (listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const categories = [
    { id: "books", label: "Books", icon: BookOpen },
    { id: "electronics", label: "Electronics", icon: Laptop },
    { id: "other", label: "Other", icon: Package },
  ];

  return (
    <div className="container py-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Student Marketplace</h1>
          <p className="text-muted-foreground">
            Buy and sell second-hand college essentials
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          List Item
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search items..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        <Button
          variant={category === null ? "default" : "outline"}
          onClick={() => setCategory(null)}
        >
          All Items
        </Button>
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <Button
              key={cat.id}
              variant={category === cat.id ? "default" : "outline"}
              onClick={() => setCategory(cat.id)}
            >
              <Icon className="w-4 h-4 mr-2" />
              {cat.label}
            </Button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredListings?.map((listing) => (
          <Card key={listing.id} className="overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium">{listing.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {listing.description}
                  </p>
                </div>
                <span className="flex items-center text-lg font-semibold text-green-600">
                  <DollarSign className="h-4 w-4" />
                  {listing.price.toFixed(2)}
                </span>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="flex items-center text-sm text-muted-foreground">
                  <Tag className="h-4 w-4 mr-1" />
                  {listing.category}
                </span>
                <Button variant="outline" size="sm">
                  Contact Seller
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
