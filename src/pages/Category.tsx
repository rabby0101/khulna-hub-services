
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, DollarSign, ArrowLeft } from 'lucide-react';
import { useJobs } from '@/hooks/useJobs';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import JobCard from '@/components/JobCard';
import ProposalDialog from '@/components/ProposalDialog';
import { supabase } from '@/integrations/supabase/client';

// Category mapping to match the ServiceCategories component
const categoryMapping: { [key: string]: string } = {
  'home-repair-maintenance': 'Home Repair & Maintenance',
  'home-services': 'Home Services', 
  'education-tutoring': 'Education & Tutoring',
  'technology-it': 'Technology & IT',
  'automotive': 'Automotive',
  'personal-services': 'Personal Services',
  'construction-renovation': 'Construction & Renovation',
  'food-catering': 'Food & Catering',
  'mobile-electronics': 'Mobile & Electronics',
  'events-entertainment': 'Events & Entertainment'
};

const Category = () => {
  const { category } = useParams<{ category: string }>();
  const { data: jobs, isLoading } = useJobs();
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

    // Check if user is trying to send proposal on their own job
    const job = jobs?.find(j => j.id === jobId);
    if (job && job.client_id === user.id) {
      toast({
        title: "Cannot Send Proposal",
        description: "You cannot send a proposal on your own job posting",
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

    if (job) {
      setSelectedJob(job);
      setProposalDialogOpen(true);
    }
  };

  // Use the category mapping to get the correct category name
  const categoryName = category ? categoryMapping[category] || category : '';
  
  const categoryJobs = jobs?.filter(job => 
    job.category === categoryName && job.status === 'open'
  ) || [];

  const displayCategoryName = categoryName.replace(/&/g, 'and');

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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button variant="outline" asChild className="mb-4">
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-foreground mb-4">{displayCategoryName} Jobs</h1>
          <p className="text-xl text-muted-foreground">
            {categoryJobs.length} job{categoryJobs.length !== 1 ? 's' : ''} available
          </p>
        </div>

        {categoryJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryJobs.map((job) => (
              <JobCard 
                key={job.id} 
                job={job} 
                onStartChat={handleSendProposal}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No jobs in {displayCategoryName}
            </h3>
            <p className="text-muted-foreground mb-4">
              Be the first to post a job in this category!
            </p>
            <Button asChild>
              <Link to="/post-job">Post a Job</Link>
            </Button>
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

export default Category;
