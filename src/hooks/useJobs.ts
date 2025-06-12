
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
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
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
      const { data, error } = await supabase
        .from('jobs')
        .select(`
          *,
          profiles (full_name, location)
        `)
        .eq('status', 'open')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Job[];
    }
  });
};

export const useCreateJob = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (jobData: Omit<Job, 'id' | 'created_at' | 'client_id' | 'profiles'>) => {
      if (!user) throw new Error('Must be logged in to create a job');
      
      const { data, error } = await supabase
        .from('jobs')
        .insert([{ ...jobData, client_id: user.id }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    }
  });
};
