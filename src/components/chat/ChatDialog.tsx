import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useCreateConversation, Conversation } from '@/hooks/useConversations';
import { useAuth } from '@/contexts/AuthContext';
import ChatInterface from './ChatInterface';
import { toast } from '@/hooks/use-toast';

interface ChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobId: string;
  jobTitle: string;
  providerId?: string;
  clientId?: string;
  proposalId?: string;
  otherParticipant: {
    id: string;
    name: string;
    avatar_url?: string;
  };
}

const ChatDialog: React.FC<ChatDialogProps> = ({
  open,
  onOpenChange,
  jobId,
  jobTitle,
  providerId,
  clientId,
  proposalId,
  otherParticipant,
}) => {
  const { user } = useAuth();
  const createConversation = useCreateConversation();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (open && !conversation && user) {
      handleCreateOrFindConversation();
    }
  }, [open, user]);

  const handleCreateOrFindConversation = async () => {
    if (!user || !providerId || !clientId) return;

    setIsCreating(true);
    try {
      const result = await createConversation.mutateAsync({
        job_id: jobId,
        client_id: clientId,
        provider_id: providerId,
        proposal_id: proposalId,
      });

      // Create a conversation object with the required participant info
      const conversationData: Conversation = {
        id: result.id,
        job_id: jobId,
        client_id: clientId!,
        provider_id: providerId!,
        proposal_id: proposalId || null,
        deal_id: null,
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        jobs: { title: jobTitle },
        client_profile: user.id === clientId ? { full_name: user.user_metadata?.full_name } : null,
        provider_profile: user.id === providerId ? { full_name: user.user_metadata?.full_name } : null,
      };

      setConversation(conversationData);
    } catch (error) {
      console.error('Error creating conversation:', error);
      toast({
        title: "Error",
        description: "Failed to start conversation",
        variant: "destructive",
      });
      onOpenChange(false);
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    setConversation(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl h-[700px] flex flex-col">
        <DialogHeader>
          <DialogTitle>Chat about "{jobTitle}"</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden">
          {isCreating ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p>Starting conversation...</p>
              </div>
            </div>
          ) : conversation ? (
            <ChatInterface
              conversationId={conversation.id}
              jobTitle={jobTitle}
              otherParticipant={otherParticipant}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p>Failed to load conversation</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChatDialog;