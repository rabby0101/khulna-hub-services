import React, { useState } from 'react';
import { Message } from '@/hooks/useConversations';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import ImageMessage from './ImageMessage';
import NegotiationMessage from './NegotiationMessage';
import CounterOfferDialog from './CounterOfferDialog';

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
  onSendNegotiation?: (amount: number, message: string, type: string, proposalId?: string) => void;
}

const MessageList: React.FC<MessageListProps> = ({ 
  messages, 
  currentUserId, 
  onSendNegotiation 
}) => {
  const [counterOfferDialog, setCounterOfferDialog] = useState<{
    open: boolean;
    proposalId: string;
    amount: number;
  }>({ open: false, proposalId: '', amount: 0 });

  const handleCounterOffer = (proposalId: string, amount: number) => {
    setCounterOfferDialog({ open: true, proposalId, amount });
  };

  const handleSendCounterOffer = (amount: number, message: string) => {
    if (onSendNegotiation && counterOfferDialog.proposalId) {
      onSendNegotiation(amount, message, 'counter_offer', counterOfferDialog.proposalId);
    }
    setCounterOfferDialog({ open: false, proposalId: '', amount: 0 });
  };

  return (
    <>
      <div className="space-y-4">
        {messages.map((message) => {
          const isOwnMessage = message.sender_id === currentUserId;
          
          // Handle different message types
          if (message.message_type === 'image') {
            return (
              <ImageMessage
                key={message.id}
                message={message}
                isOwnMessage={isOwnMessage}
              />
            );
          }
          
          if (message.negotiation_data) {
            return (
              <NegotiationMessage
                key={message.id}
                message={message}
                isOwnMessage={isOwnMessage}
                onCounterOffer={handleCounterOffer}
              />
            );
          }
          
          // Default text message
          return (
            <div
              key={message.id}
              className={`flex gap-3 ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarImage src={message.sender_profile?.avatar_url} />
                <AvatarFallback>
                  {message.sender_profile?.full_name?.charAt(0)?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              
              <div className={`flex flex-col max-w-[70%] ${isOwnMessage ? 'items-end' : 'items-start'}`}>
                <div
                  className={`rounded-lg px-3 py-2 ${
                    isOwnMessage
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
                
                <span className="text-xs text-muted-foreground mt-1">
                  {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <CounterOfferDialog
        open={counterOfferDialog.open}
        onOpenChange={(open) => setCounterOfferDialog(prev => ({ ...prev, open }))}
        currentAmount={counterOfferDialog.amount}
        onSubmit={handleSendCounterOffer}
      />
    </>
  );
};

export default MessageList;