
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  related_job_id: string | null;
  related_proposal_id: string | null;
  created_at: string;
}

export const useNotifications = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Set up real-time subscription
  useEffect(() => {
    if (!user) return;

    console.log('Setting up notifications realtime subscription...');
    
    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('New notification received:', payload);
          queryClient.invalidateQueries({ queryKey: ['notifications'] });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Notification updated:', payload);
          queryClient.invalidateQueries({ queryKey: ['notifications'] });
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up notifications subscription...');
      supabase.removeChannel(channel);
    };
  }, [user, queryClient]);

  return useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      if (!user) return [];
      
      console.log('Fetching notifications...');
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching notifications:', error);
        throw error;
      }
      
      console.log('Notifications fetched:', data);
      return data as Notification[];
    },
    enabled: !!user
  });
};

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      console.log('Marking notification as read:', notificationId);
      
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);
      
      if (error) {
        console.error('Error marking notification as read:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });
};

export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('Must be logged in');
      
      console.log('Marking all notifications as read...');
      
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id)
        .eq('read', false);
      
      if (error) {
        console.error('Error marking all notifications as read:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });
};
