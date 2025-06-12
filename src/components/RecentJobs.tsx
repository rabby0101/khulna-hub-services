
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, DollarSign } from "lucide-react";

const recentJobs = [
  {
    id: 1,
    title: "Need Electrician for Ceiling Fan Installation",
    category: "Home Repair",
    budget: "৳500 - ৳800",
    location: "Sonadanga",
    timeAgo: "2 hours ago",
    urgent: false
  },
  {
    id: 2,
    title: "Math Tutor Required for Class 10 Student",
    category: "Education",
    budget: "৳3000/month",
    location: "Daulatpur",
    timeAgo: "4 hours ago",
    urgent: true
  },
  {
    id: 3,
    title: "AC Repair Service Needed",
    category: "Home Repair",
    budget: "৳1000 - ৳1500",
    location: "Khalishpur",
    timeAgo: "6 hours ago",
    urgent: false
  },
  {
    id: 4,
    title: "House Cleaning Service",
    category: "Home Services",
    budget: "৳800 - ৳1200",
    location: "Khan Jahan Ali",
    timeAgo: "8 hours ago",
    urgent: false
  },
  {
    id: 5,
    title: "Laptop Repair - Screen Replacement",
    category: "Technology",
    budget: "৳2000 - ৳3000",
    location: "Boyra",
    timeAgo: "1 day ago",
    urgent: false
  },
  {
    id: 6,
    title: "Wedding Photography Service",
    category: "Events",
    budget: "৳15000 - ৳25000",
    location: "Rupsha",
    timeAgo: "1 day ago",
    urgent: true
  }
];

const RecentJobs = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Recent Job Postings
            </h2>
            <p className="text-xl text-muted-foreground">
              Latest opportunities from people in Khulna
            </p>
          </div>
          <button className="mt-4 md:mt-0 text-primary hover:text-primary/80 font-medium">
            View All Jobs →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentJobs.map((job) => (
            <Card
              key={job.id}
              className="hover-scale cursor-pointer group border border-border hover:shadow-lg transition-all duration-300"
            >
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <Badge variant={job.urgent ? "destructive" : "secondary"} className="text-xs">
                    {job.category}
                  </Badge>
                  {job.urgent && (
                    <Badge variant="destructive" className="text-xs">
                      Urgent
                    </Badge>
                  )}
                </div>

                <h3 className="font-semibold text-lg text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                  {job.title}
                </h3>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <DollarSign className="w-4 h-4 mr-2" />
                    <span>{job.budget}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>{job.timeAgo}</span>
                  </div>
                </div>

                <button className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90 transition-colors text-sm font-medium">
                  Send Proposal
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecentJobs;
