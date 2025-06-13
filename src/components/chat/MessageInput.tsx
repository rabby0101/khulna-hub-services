import React, { useState, KeyboardEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MessageCircle, DollarSign } from 'lucide-react';
import ImageUpload from './ImageUpload';
import CounterOfferDialog from './CounterOfferDialog';

interface MessageInputProps {
  onSendMessage: (content: string, messageType?: string, attachmentUrl?: string, negotiationData?: any) => void;
  onSendNegotiation?: (amount: number, message: string, type: string, proposalId?: string) => void;
  disabled?: boolean;
  showNegotiationOptions?: boolean;
  conversationId?: string;
}

const MessageInput: React.FC<MessageInputProps> = ({ 
  onSendMessage, 
  onSendNegotiation,
  disabled,
  showNegotiationOptions = false 
}) => {
  const [message, setMessage] = useState('');
  const [showCounterDialog, setShowCounterDialog] = useState(false);

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim(), 'text');
      setMessage('');
    }
  };

  const handleImageUpload = (imageUrl: string) => {
    onSendMessage(message.trim() || 'Image', 'image', imageUrl);
    setMessage('');
  };

  const handleSendProposal = (amount: number, proposalMessage: string) => {
    if (onSendNegotiation) {
      onSendNegotiation(amount, proposalMessage, 'proposal');
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <div className="space-y-2">
        <div className="flex gap-2">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 resize-none min-h-[40px] max-h-[120px]"
            disabled={disabled}
            rows={1}
          />
          <div className="flex flex-col gap-2">
            <ImageUpload
              onImageUploaded={handleImageUpload}
              disabled={disabled}
            />
            <Button 
              onClick={handleSend}
              disabled={!message.trim() || disabled}
              size="sm"
            >
              <MessageCircle className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {showNegotiationOptions && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCounterDialog(true)}
              disabled={disabled}
              className="flex-1"
            >
              <DollarSign className="h-4 w-4 mr-1" />
              Make Proposal
            </Button>
          </div>
        )}
      </div>

      <CounterOfferDialog
        open={showCounterDialog}
        onOpenChange={setShowCounterDialog}
        currentAmount={0}
        onSubmit={handleSendProposal}
        isLoading={disabled}
      />
    </>
  );
};

export default MessageInput;