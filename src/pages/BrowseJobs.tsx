
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, DollarSign, User } from 'lucide-react';
import { useJobs } from '@/hooks/useJobs';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import Header from '@/components/Header';

const BrowseJobs = () => {
  const { data: jobs, isLoading, error } = useJobs();
  const { user } = useAuth();

  const handleSendProposal = (jobId: string) => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be logged in to send proposals",
        variant: "destructive",
      });
      return;
    }
    
    // For now, just show a toast - this would open a proposal modal
    toast({
      title: "Feature coming soon!",
      description: "Proposal system will be implemented next",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading jobs...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-red-500">Error loading jobs</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">Browse Jobs</h1>
          <p className="text-xl text-muted-foreground">Find opportunities to showcase your skills</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs?.map((job) => (
            <Card key={job.id} className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <Badge variant={job.urgent ? "destructive" : "secondary"}>
                    {job.category}
                  </Badge>
                  {job.urgent && (
                    <Badge variant="destructive" className="text-xs">
                      Urgent
                    </Badge>
                  )}
                </div>

                <h3 className="font-semibold text-lg text-foreground mb-3 line-clamp-2">
                  {job.title}
                </h3>

                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  {job.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <DollarSign className="w-4 h-4 mr-2" />
                    <span>৳{job.budget_min}{job.budget_max > job.budget_min ? ` - ৳${job.budget_max}` : ''}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <User className="w-4 h-4 mr-2" />
                    <span>{job.profiles?.full_name || 'Anonymous'}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>{new Date(job.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                <Button 
                  className="w-full" 
                  onClick={() => handleSendProposal(job.id)}
                >
                  Send Proposal
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {jobs?.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-foreground mb-2">No jobs available</h3>
            <p className="text-muted-foreground">Check back later for new opportunities!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseJobs;
