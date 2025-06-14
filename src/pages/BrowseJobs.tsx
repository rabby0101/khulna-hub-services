
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, DollarSign, User } from 'lucide-react';
import { useJobs } from '@/hooks/useJobs';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import JobCard from '@/components/JobCard';
import ProposalDialog from '@/components/ProposalDialog';
import { supabase } from '@/integrations/supabase/client';

const BrowseJobs = () => {
  const { data: jobs, isLoading, error } = useJobs();
  const { user } = useAuth();
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [proposalDialogOpen, setProposalDialogOpen] = useState(false);

  const handleSendProposal = async (jobId: string) => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be logged in to send proposals",
        variant: "destructive",
      });
      return;
    }

    // Check if user is a service provider
    const { data: profile } = await supabase
      .from('profiles')
      .select('user_type')
      .eq('id', user.id)
      .single();

    if (!profile || (profile.user_type !== 'provider' && profile.user_type !== 'both')) {
      toast({
        title: "Service Provider Required",
        description: "You need to be a service provider to send proposals. Enable it in your profile.",
        variant: "destructive",
      });
      return;
    }

    const job = jobs?.find(j => j.id === jobId);
    if (job) {
      setSelectedJob(job);
      setProposalDialogOpen(true);
    }
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
          {jobs?.filter(job => job.status === 'open').map((job) => (
            <JobCard 
              key={job.id} 
              job={job} 
              onStartChat={handleSendProposal}
            />
          ))}
        </div>

        {jobs?.filter(job => job.status === 'open').length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-foreground mb-2">No jobs available</h3>
            <p className="text-muted-foreground">Check back later for new opportunities!</p>
          </div>
        )}

        {selectedJob && (
          <ProposalDialog
            open={proposalDialogOpen}
            onOpenChange={setProposalDialogOpen}
            jobId={selectedJob.id}
            jobTitle={selectedJob.title}
            budget={selectedJob.budget}
          />
        )}
      </div>
    </div>
  );
};

export default BrowseJobs;
