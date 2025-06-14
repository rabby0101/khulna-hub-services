import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useMessages, useSendMessage } from '@/hooks/useChat';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { MessageCircle } from 'lucide-react';

interface ChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  conversationId: string;
  jobTitle: string;
  otherParticipant: {
    id: string;
    name: string;
  };
}

const ChatDialog: React.FC<ChatDialogProps> = ({ 
  open, 
  onOpenChange, 
  conversationId,
  jobTitle,
  otherParticipant
}) => {
  const { user } = useAuth();
  const { data: messages = [], isLoading } = useMessages(conversationId);
  const sendMessage = useSendMessage();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get conversation details for negotiation
  const { data: conversation } = useQuery({
    queryKey: ['conversation', conversationId],
    queryFn: async () => {
      if (!conversationId) return null;
      
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('id', conversationId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!conversationId
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages.length]);

  const handleSendMessage = async (
    content: string, 
    messageType: string = 'text', 
    attachmentUrl?: string, 
    negotiationData?: any
  ) => {
    try {
      await sendMessage.mutateAsync({
        conversationId,
        content,
        messageType,
        attachmentUrl,
        negotiationData
      });
    } catch (error) {
      console.error('Failed to send message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSendNegotiation = async (
    amount: number, 
    message: string, 
    type: string, 
    negotiationProposalId?: string
  ) => {
    try {
      // Create negotiation data
      const negotiationData = {
        type,
        amount,
        proposalId: negotiationProposalId,
        status: 'pending'
      };

      await handleSendMessage(message, 'negotiation', undefined, negotiationData);
      
      toast({
        title: "Proposal Sent!",
        description: "Your proposal has been sent successfully.",
      });
    } catch (error) {
      console.error('Failed to send negotiation message:', error);
      toast({
        title: "Error",
        description: "Failed to send negotiation message. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] h-[600px] flex flex-col">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="flex items-center gap-3">
            <MessageCircle className="h-5 w-5" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span>{otherParticipant.name}</span>
                <Badge variant="outline" className="text-xs">
                  Chat
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground font-normal">
                {jobTitle}
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto p-4">
            {isLoading ? (
              <div className="text-center text-muted-foreground">
                Loading messages...
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <MessageCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No messages yet. Start the conversation!</p>
              </div>
            ) : (
              <MessageList 
                messages={messages} 
                currentUserId={user?.id || ''} 
                onSendNegotiation={handleSendNegotiation}
                jobId={conversation?.job_id}
                clientId={conversation?.client_id}
                providerId={conversation?.provider_id}
              />
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="border-t p-4">
            <MessageInput 
              onSendMessage={handleSendMessage}
              onSendNegotiation={handleSendNegotiation}
              disabled={sendMessage.isPending}
              showNegotiationOptions={true}
              conversationId={conversationId}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChatDialog;