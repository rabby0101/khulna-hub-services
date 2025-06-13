import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useMessages, useSendMessage, Conversation } from '@/hooks/useChat';
import { useAuth } from '@/contexts/AuthContext';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { MessageCircle } from 'lucide-react';

interface ChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobId: string;
  jobTitle: string;
  providerId: string;
  clientId: string;
  proposalId: string;
  otherParticipant: {
    id: string;
    name: string;
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
  otherParticipant
}) => {
  const { user } = useAuth();
  const [conversationId, setConversationId] = useState<string>('');
  const { data: messages = [], isLoading } = useMessages(conversationId);
  const sendMessage = useSendMessage();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isClient = user?.id === clientId;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages.length]);

  const handleSendMessage = async (content: string) => {
    try {
      await sendMessage.mutateAsync({
        conversationId,
        content
      });
    } catch (error) {
      console.error('Failed to send message:', error);
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
                  {isClient ? 'Provider' : 'Client'}
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
              <MessageList messages={messages} currentUserId={user?.id || ''} />
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="border-t p-4">
            <MessageInput 
              onSendMessage={handleSendMessage}
              disabled={sendMessage.isPending}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChatDialog;