
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Clock, DollarSign, User, MessageSquare, ArrowRight } from 'lucide-react';
import { useAcceptProposal, useRejectProposal, useCounterProposal } from '@/hooks/useProposalActions';
import { formatDistanceToNow } from 'date-fns';

interface ProposalManagerProps {
  proposals: any[];
  jobTitle: string;
  originalBudgetMin: number;
  originalBudgetMax: number;
}

const ProposalManager = ({ proposals, jobTitle, originalBudgetMin, originalBudgetMax }: ProposalManagerProps) => {
  const [counterDialogOpen, setCounterDialogOpen] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<any>(null);
  const [counterAmount, setCounterAmount] = useState('');
  const [counterMessage, setCounterMessage] = useState('');

  const acceptProposal = useAcceptProposal();
  const rejectProposal = useRejectProposal();
  const counterProposal = useCounterProposal();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'countered': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleAccept = (proposalId: string) => {
    acceptProposal.mutate(proposalId);
  };

  const handleReject = (proposalId: string) => {
    rejectProposal.mutate(proposalId);
  };

  const handleCounter = (proposal: any) => {
    setSelectedProposal(proposal);
    setCounterAmount('');
    setCounterMessage('');
    setCounterDialogOpen(true);
  };

  const submitCounter = () => {
    if (!selectedProposal || !counterAmount) return;

    const amount = parseInt(counterAmount);
    if (amount < originalBudgetMin || amount > originalBudgetMax) {
      return;
    }

    counterProposal.mutate({
      proposalId: selectedProposal.id,
      newAmount: amount,
      message: counterMessage
    });

    setCounterDialogOpen(false);
    setSelectedProposal(null);
  };

  // Group proposals by provider to show conversation chains
  const proposalsByProvider = proposals.reduce((acc, proposal) => {
    const providerId = proposal.provider_id;
    if (!acc[providerId]) {
      acc[providerId] = [];
    }
    acc[providerId].push(proposal);
    return acc;
  }, {} as Record<string, any[]>);

  if (proposals.length === 0) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-semibold text-foreground mb-2">No proposals yet</h3>
        <p className="text-muted-foreground">Proposals will appear here once service providers submit them.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-foreground mb-4">
        Proposals for "{jobTitle}" ({proposals.length})
      </h3>
      
      {Object.entries(proposalsByProvider).map(([providerId, providerProposals]) => {
        const latestProposal = providerProposals[providerProposals.length - 1];
        const hasMultipleProposals = providerProposals.length > 1;
        
        return (
          <Card key={providerId} className="border">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <CardTitle className="text-lg">
                      {latestProposal.profiles?.full_name || 'Anonymous Provider'}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {latestProposal.profiles?.user_type === 'provider' ? 'Service Provider' : 'Freelancer'}
                    </p>
                    {hasMultipleProposals && (
                      <p className="text-xs text-blue-600">
                        {providerProposals.length} proposals in conversation
                      </p>
                    )}
                  </div>
                </div>
                <Badge className={getStatusColor(latestProposal.status)}>
                  {latestProposal.status.charAt(0).toUpperCase() + latestProposal.status.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                {/* Show proposal conversation chain if multiple proposals */}
                {hasMultipleProposals && (
                  <div className="bg-muted/30 p-3 rounded-lg">
                    <h4 className="text-sm font-semibold mb-2">Proposal History</h4>
                    <div className="space-y-2">
                      {providerProposals.map((proposal, index) => (
                        <div key={proposal.id} className="flex items-center space-x-2 text-sm">
                          <DollarSign className="h-3 w-3 text-muted-foreground" />
                          <span>৳{proposal.amount}</span>
                          <Badge variant="outline" className="text-xs">
                            {proposal.status}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(proposal.created_at), { addSuffix: true })}
                          </span>
                          {index < providerProposals.length - 1 && (
                            <ArrowRight className="h-3 w-3 text-muted-foreground" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Latest proposal details */}
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="font-semibold">৳{latestProposal.amount}</span>
                  <span className="text-sm text-muted-foreground">
                    (Latest {hasMultipleProposals ? 'counter ' : ''}proposal)
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(latestProposal.created_at), { addSuffix: true })}
                  </span>
                </div>
                
                {latestProposal.message && (
                  <div className="flex items-start space-x-2">
                    <MessageSquare className="h-4 w-4 text-muted-foreground mt-1" />
                    <p className="text-sm">{latestProposal.message}</p>
                  </div>
                )}
                
                {latestProposal.status === 'pending' && (
                  <div className="flex space-x-2 pt-3">
                    <Button 
                      size="sm" 
                      onClick={() => handleAccept(latestProposal.id)}
                      disabled={acceptProposal.isPending}
                    >
                      Accept Deal
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleCounter(latestProposal)}
                    >
                      Counter Offer
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => handleReject(latestProposal.id)}
                      disabled={rejectProposal.isPending}
                    >
                      Reject
                    </Button>
                  </div>
                )}

                {latestProposal.status === 'accepted' && (
                  <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
                    <p className="text-green-800 font-medium">
                      ✅ Deal Accepted! A project deal has been created for ৳{latestProposal.amount}
                    </p>
                    <p className="text-green-600 text-sm mt-1">
                      You can manage this project in the "Active Deals" tab.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}

      <Dialog open={counterDialogOpen} onOpenChange={setCounterDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Counter Proposal</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Current Proposal</Label>
              <p className="text-sm">৳{selectedProposal?.amount}</p>
            </div>
            
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Your Budget Range</Label>
              <p className="text-sm">৳{originalBudgetMin} - ৳{originalBudgetMax}</p>
            </div>

            <div>
              <Label htmlFor="counter-amount">Your Counter Offer (৳)</Label>
              <Input
                id="counter-amount"
                type="number"
                value={counterAmount}
                onChange={(e) => setCounterAmount(e.target.value)}
                placeholder={`Enter amount between ${originalBudgetMin} - ${originalBudgetMax}`}
                min={originalBudgetMin}
                max={originalBudgetMax}
              />
            </div>

            <div>
              <Label htmlFor="counter-message">Message (Optional)</Label>
              <Textarea
                id="counter-message"
                value={counterMessage}
                onChange={(e) => setCounterMessage(e.target.value)}
                placeholder="Explain your counter offer..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCounterDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={submitCounter}
              disabled={!counterAmount || counterProposal.isPending}
            >
              {counterProposal.isPending ? 'Sending...' : 'Send Counter'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProposalManager;
