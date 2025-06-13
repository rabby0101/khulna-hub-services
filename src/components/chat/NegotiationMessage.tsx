import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Message } from '@/hooks/useConversations';
import { formatDistanceToNow } from 'date-fns';
import { useAcceptProposal, useRejectProposal, useCounterProposal } from '@/hooks/useProposalActions';
import { CheckCircle, XCircle, RefreshCw } from 'lucide-react';

interface NegotiationMessageProps {
  message: Message;
  isOwnMessage: boolean;
  onCounterOffer?: (proposalId: string, amount: number) => void;
}

const NegotiationMessage: React.FC<NegotiationMessageProps> = ({ 
  message, 
  isOwnMessage,
  onCounterOffer 
}) => {
  const acceptProposal = useAcceptProposal();
  const rejectProposal = useRejectProposal();
  
  const negotiationData = message.negotiation_data as any;
  
  if (!negotiationData) return null;

  const { type, amount, proposalId, status, originalAmount } = negotiationData;

  console.log('Negotiation data:', negotiationData);
  console.log('Proposal ID:', proposalId);

  const handleAccept = () => {
    console.log('Accept clicked, proposalId:', proposalId);
    if (proposalId) {
      acceptProposal.mutate(proposalId);
    } else {
      console.error('No proposalId available for accept');
    }
  };

  const handleReject = () => {
    console.log('Reject clicked, proposalId:', proposalId);
    if (proposalId) {
      rejectProposal.mutate(proposalId);
    } else {
      console.error('No proposalId available for reject');
    }
  };

  const getStatusBadge = () => {
    switch (status) {
      case 'accepted':
        return <Badge variant="default" className="bg-green-100 text-green-800">Accepted</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      case 'countered':
        return <Badge variant="secondary">Countered</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  const getTypeDisplay = () => {
    switch (type) {
      case 'proposal':
        return 'Proposal';
      case 'counter_offer':
        return 'Counter Offer';
      case 'acceptance':
        return 'Accepted';
      case 'rejection':
        return 'Rejected';
      default:
        return 'Negotiation';
    }
  };

  return (
    <Card className={`max-w-sm ${isOwnMessage ? 'ml-auto' : 'mr-auto'}`}>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{getTypeDisplay()}</span>
            {getStatusBadge()}
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-primary">৳{amount}</span>
            </div>
            
            {originalAmount && originalAmount !== amount && (
              <div className="text-sm text-muted-foreground">
                Original: ৳{originalAmount}
              </div>
            )}
            
            {message.content && (
              <>
                <Separator />
                <p className="text-sm text-muted-foreground">"{message.content}"</p>
              </>
            )}
          </div>

          {/* Action buttons for received proposals/counter-offers */}
          {!isOwnMessage && status === 'pending' && (type === 'proposal' || type === 'counter_offer') && (
            <div className="flex gap-2 pt-2">
              <Button
                size="sm"
                onClick={handleAccept}
                disabled={acceptProposal.isPending}
                className="flex-1"
              >
                <CheckCircle className="h-3 w-3 mr-1" />
                Accept
              </Button>
              
              <Button
                size="sm"
                variant="outline"
                onClick={() => onCounterOffer?.(proposalId, amount)}
                className="flex-1"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Counter
              </Button>
              
              <Button
                size="sm"
                variant="destructive"
                onClick={handleReject}
                disabled={rejectProposal.isPending}
              >
                <XCircle className="h-3 w-3" />
              </Button>
            </div>
          )}
          
          <div className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NegotiationMessage;