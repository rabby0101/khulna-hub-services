
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Job {
  id: string;
  title: string;
  description: string;
  category: string;
  budget_min: number;
  budget_max: number;
  location: string;
  status: string;
  urgent: boolean;
  created_at: string;
  client_id: string;
  profiles?: {
    full_name: string;
    location: string;
  };
}

export const useJobs = () => {
  return useQuery({
    queryKey: ['jobs'],
    queryFn: async () => {
      console.log('Fetching jobs...');
      
      // First try to get jobs with profile data
      const { data: jobsWithProfiles, error: profileError } = await supabase
        .from('jobs')
        .select(`
          *,
          profiles!inner(full_name, location)
        `)
        .eq('status', 'open')
        .order('created_at', { ascending: false });

      if (jobsWithProfiles && !profileError) {
        console.log('Jobs with profiles:', jobsWithProfiles);
        return jobsWithProfiles.map(job => ({
          ...job,
          profiles: job.profiles[0] // Take the first profile since it's a join
        })) as Job[];
      }

      // If that fails, get jobs without profile data
      console.log('Profile join failed, fetching jobs without profiles...');
      const { data: jobs, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('status', 'open')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching jobs:', error);
        throw error;
      }
      
      console.log('Jobs fetched:', jobs);
      return jobs as Job[];
    }
  });
};

export const useCreateJob = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (jobData: Omit<Job, 'id' | 'created_at' | 'client_id' | 'profiles'>) => {
      if (!user) throw new Error('Must be logged in to create a job');
      
      console.log('Creating job with data:', jobData);
      
      const { data, error } = await supabase
        .from('jobs')
        .insert([{ ...jobData, client_id: user.id }])
        .select()
        .single();
      
      if (error) {
        console.error('Error creating job:', error);
        throw error;
      }
      
      console.log('Job created successfully:', data);
      return data;
    },
    onSuccess: () => {
      console.log('Invalidating jobs query...');
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    }
  });
};
