
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProposalManager from '@/components/ProposalManager';
import { useJobProposals } from '@/hooks/useProposals';

const MyJobs = () => {
  const { user } = useAuth();

  const { data: myJobs, isLoading } = useQuery({
    queryKey: ['my-jobs'],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('client_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Please sign in to view your jobs.</div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading your jobs...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-8">My Jobs</h1>
        
        {myJobs?.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-foreground mb-2">No jobs posted yet</h3>
            <p className="text-muted-foreground">Start by posting your first job!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {myJobs?.map((job) => (
              <JobWithProposals key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const JobWithProposals = ({ job }: { job: any }) => {
  const { data: proposals = [] } = useJobProposals(job.id);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold">{job.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Budget: ৳{job.budget_min} - ৳{job.budget_max} • {job.location}
            </p>
          </div>
          <div className="text-right">
            <span className="text-sm font-medium">
              {proposals.length} proposal{proposals.length !== 1 ? 's' : ''}
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="proposals" className="w-full">
          <TabsList>
            <TabsTrigger value="proposals">
              Proposals ({proposals.length})
            </TabsTrigger>
            <TabsTrigger value="details">Job Details</TabsTrigger>
          </TabsList>
          
          <TabsContent value="proposals" className="mt-4">
            <ProposalManager 
              proposals={proposals}
              jobTitle={job.title}
              originalBudgetMin={job.budget_min}
              originalBudgetMax={job.budget_max}
            />
          </TabsContent>
          
          <TabsContent value="details" className="mt-4">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold">Description</h4>
                <p className="text-muted-foreground">{job.description}</p>
              </div>
              <div>
                <h4 className="font-semibold">Category</h4>
                <p className="text-muted-foreground">{job.category}</p>
              </div>
              <div>
                <h4 className="font-semibold">Status</h4>
                <p className="text-muted-foreground">{job.status}</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MyJobs;
