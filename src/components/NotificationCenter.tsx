
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Bell, CheckCheck, Clock } from 'lucide-react';
import { useNotifications, useMarkNotificationAsRead, useMarkAllNotificationsAsRead } from '@/hooks/useNotifications';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import ChatDialog from '@/components/chat/ChatDialog';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const NotificationCenter = () => {
  const { user } = useAuth();
  const { data: notifications = [], isLoading } = useNotifications();
  const markAsRead = useMarkNotificationAsRead();
  const markAllAsRead = useMarkAllNotificationsAsRead();
  const navigate = useNavigate();
  const [chatDialogOpen, setChatDialogOpen] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<any>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNotificationClick = async (notification: any) => {
    // Mark as read if not already read
    if (!notification.read) {
      markAsRead.mutate(notification.id);
    }

    // Handle message notifications specially - open chat dialog
    if (notification.type === 'message_received' && notification.related_proposal_id) {
      try {
        // Get conversation details using the conversation_id stored in related_proposal_id
        const { data: conversation } = await supabase
          .from('conversations')
          .select(`
            *,
            jobs(title),
            client_profile:profiles!conversations_client_id_fkey(id, full_name),
            provider_profile:profiles!conversations_provider_id_fkey(id, full_name)
          `)
          .eq('id', notification.related_proposal_id)
          .single();

        if (conversation) {
          setSelectedConversation(conversation);
          setChatDialogOpen(true);
          return;
        }
      } catch (error) {
        console.error('Error fetching conversation:', error);
      }
    }

    // Navigate based on notification type and related data
    if (notification.related_job_id) {
      if (notification.type === 'proposal_received' || 
          notification.type === 'proposal_accepted' || 
          notification.type === 'proposal_rejected' ||
          notification.type === 'deal_created' ||
          notification.type === 'deal_completed') {
        // Navigate to My Jobs page where they can manage proposals and deals
        navigate('/my-jobs');
      }
    }
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead.mutate();
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'proposal_received':
        return '📝';
      case 'proposal_accepted':
        return '✅';
      case 'proposal_rejected':
        return '❌';
      case 'deal_created':
        return '🤝';
      case 'deal_completed':
        return '🎉';
      case 'counter_proposal':
        return '🔄';
      case 'message_received':
        return '💬';
      default:
        return '📢';
    }
  };

  if (isLoading) {
    return (
      <Button variant="ghost" size="icon" disabled>
        <Bell className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs p-0"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              className="h-auto p-1 text-xs"
            >
              <CheckCheck className="h-3 w-3 mr-1" />
              Mark all read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            No notifications yet
          </div>
        ) : (
          <div className="max-h-96 overflow-y-auto">
            {notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={`flex flex-col items-start p-3 cursor-pointer ${
                  !notification.read ? 'bg-muted/50' : ''
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex items-start justify-between w-full">
                  <div className="flex items-start space-x-2 flex-1">
                    <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">{notification.title}</div>
                      <div className="text-xs text-muted-foreground mt-1 break-words">
                        {notification.message}
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground mt-2">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                      </div>
                    </div>
                  </div>
                  {!notification.read && (
                    <div className="h-2 w-2 bg-blue-500 rounded-full mt-1 flex-shrink-0" />
                  )}
                </div>
              </DropdownMenuItem>
            ))}
          </div>
        )}
      </DropdownMenuContent>
      
      {/* Chat Dialog for message notifications */}
      {selectedConversation && (
        <ChatDialog
          open={chatDialogOpen}
          onOpenChange={setChatDialogOpen}
          conversationId={selectedConversation.id}
          jobTitle={selectedConversation.jobs?.title || 'Unknown Job'}
          otherParticipant={{
            id: user?.id === selectedConversation.client_id 
              ? selectedConversation.provider_id 
              : selectedConversation.client_id,
            name: user?.id === selectedConversation.client_id
              ? selectedConversation.provider_profile?.full_name || 'Unknown Provider'
              : selectedConversation.client_profile?.full_name || 'Unknown Client'
          }}
        />
      )}
    </DropdownMenu>
  );
};

export default NotificationCenter;
