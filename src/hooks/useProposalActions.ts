
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useAcceptProposal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (proposalId: string) => {
      console.log('Accepting proposal:', proposalId);
      
      const { error } = await supabase
        .from('proposals')
        .update({ status: 'accepted' })
        .eq('id', proposalId);
      
      if (error) {
        console.error('Error accepting proposal:', error);
        throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: "Proposal Accepted!",
        description: "You have successfully accepted the proposal",
      });
      queryClient.invalidateQueries({ queryKey: ['proposals'] });
    }
  });
};

export const useRejectProposal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (proposalId: string) => {
      console.log('Rejecting proposal:', proposalId);
      
      const { error } = await supabase
        .from('proposals')
        .update({ status: 'rejected' })
        .eq('id', proposalId);
      
      if (error) {
        console.error('Error rejecting proposal:', error);
        throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: "Proposal Rejected",
        description: "The proposal has been rejected",
      });
      queryClient.invalidateQueries({ queryKey: ['proposals'] });
    }
  });
};

export const useCounterProposal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ proposalId, newAmount, message }: { 
      proposalId: string; 
      newAmount: number; 
      message?: string 
    }) => {
      console.log('Creating counter proposal:', { proposalId, newAmount, message });
      
      // First, get the original proposal to get job_id and provider_id
      const { data: originalProposal, error: fetchError } = await supabase
        .from('proposals')
        .select('job_id, provider_id')
        .eq('id', proposalId)
        .single();
      
      if (fetchError) {
        console.error('Error fetching original proposal:', fetchError);
        throw fetchError;
      }
      
      // Update the original proposal status to 'countered'
      const { error: updateError } = await supabase
        .from('proposals')
        .update({ status: 'countered' })
        .eq('id', proposalId);
      
      if (updateError) {
        console.error('Error updating original proposal:', updateError);
        throw updateError;
      }
      
      // Create a new proposal with the counter offer
      const { data, error } = await supabase
        .from('proposals')
        .insert([{
          job_id: originalProposal.job_id,
          provider_id: originalProposal.provider_id,
          amount: newAmount,
          message: message ? `Counter offer: ${message}` : 'Counter offer',
          status: 'pending'
        }])
        .select()
        .single();
      
      if (error) {
        console.error('Error creating counter proposal:', error);
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Counter Proposal Sent!",
        description: "Your counter proposal has been sent to the provider",
      });
      queryClient.invalidateQueries({ queryKey: ['proposals'] });
    }
  });
};
