
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { useAcceptProposal, useRejectProposal, useCounterProposal } from '@/hooks/useProposalActions';
import { formatDistanceToNow } from 'date-fns';

interface Proposal {
  id: string;
  job_id: string;
  provider_id: string;
  amount: number;
  message: string | null;
  status: string;
  created_at: string;
  profiles?: {
    full_name: string;
    user_type: string;
  };
}

interface ProposalManagerProps {
  proposals: Proposal[];
  jobTitle: string;
  originalBudgetMin: number;
  originalBudgetMax: number;
}

const ProposalManager: React.FC<ProposalManagerProps> = ({ 
  proposals, 
  jobTitle, 
  originalBudgetMin, 
  originalBudgetMax 
}) => {
  const acceptProposal = useAcceptProposal();
  const rejectProposal = useRejectProposal();
  const counterProposal = useCounterProposal();
  const [counterAmount, setCounterAmount] = useState<number>(0);
  const [counterMessage, setCounterMessage] = useState('');
  const [selectedProposal, setSelectedProposal] = useState<string | null>(null);

  const handleAccept = (proposalId: string) => {
    acceptProposal.mutate(proposalId);
  };

  const handleReject = (proposalId: string) => {
    rejectProposal.mutate(proposalId);
  };

  const handleCounter = (proposalId: string) => {
    if (counterAmount > 0) {
      counterProposal.mutate({
        proposalId,
        newAmount: counterAmount,
        message: counterMessage
      });
      setCounterAmount(0);
      setCounterMessage('');
      setSelectedProposal(null);
    }
  };

  // Group proposals by provider to show chains
  const proposalChains = proposals.reduce((chains: { [key: string]: Proposal[] }, proposal) => {
    const key = proposal.provider_id;
    if (!chains[key]) {
      chains[key] = [];
    }
    chains[key].push(proposal);
    return chains;
  }, {});

  // Sort each chain by creation date
  Object.keys(proposalChains).forEach(providerId => {
    proposalChains[providerId].sort((a, b) => 
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'accepted': return 'default';
      case 'rejected': return 'destructive';
      case 'countered': return 'secondary';
      default: return 'outline';
    }
  };

  const pendingProposalsCount = proposals.filter(p => p.status === 'pending').length;
  const acceptedProposalsCount = proposals.filter(p => p.status === 'accepted').length;

  if (!proposals || proposals.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No proposals received yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Proposals for "{jobTitle}"</h3>
          <p className="text-sm text-muted-foreground">
            Budget Range: ৳{originalBudgetMin} - ৳{originalBudgetMax}
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline">{pendingProposalsCount} Pending</Badge>
          <Badge variant="default">{acceptedProposalsCount} Accepted</Badge>
        </div>
      </div>

      <div className="space-y-4">
        {Object.entries(proposalChains).map(([providerId, chainProposals]) => {
          const latestProposal = chainProposals[chainProposals.length - 1];
          const providerName = latestProposal.profiles?.full_name || 'Unknown Provider';
          
          return (
            <Card key={providerId}>
              <CardHeader>
                <CardTitle className="flex justify-between items-start">
                  <div>
                    <h4 className="text-lg font-semibold">{providerName}</h4>
                    <p className="text-sm text-muted-foreground">
                      {latestProposal.profiles?.user_type || 'Provider'} • 
                      {chainProposals.length > 1 ? ` ${chainProposals.length} proposals` : ' 1 proposal'}
                    </p>
                  </div>
                  <Badge variant={getStatusBadgeVariant(latestProposal.status)}>
                    {latestProposal.status}
                  </Badge>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Show proposal chain */}
                {chainProposals.map((proposal, index) => (
                  <div key={proposal.id} className="space-y-3">
                    {index > 0 && <Separator />}
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl font-bold text-primary">৳{proposal.amount}</span>
                          {index > 0 && (
                            <Badge variant="secondary" className="text-xs">
                              {index === chainProposals.length - 1 ? 'Latest' : `V${index + 1}`}
                            </Badge>
                          )}
                        </div>
                        {proposal.message && (
                          <p className="text-sm text-muted-foreground mb-2">
                            "{proposal.message}"
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(proposal.created_at), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Action buttons for latest proposal */}
                {latestProposal.status === 'pending' && (
                  <div className="flex gap-2 pt-4">
                    <Button 
                      onClick={() => handleAccept(latestProposal.id)}
                      disabled={acceptProposal.isPending}
                      className="flex-1"
                    >
                      Accept ৳{latestProposal.amount}
                    </Button>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          onClick={() => setSelectedProposal(latestProposal.id)}
                          className="flex-1"
                        >
                          Counter Offer
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Counter Proposal</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium">Counter Amount (৳)</label>
                            <Input
                              type="number"
                              placeholder="Enter your counter amount"
                              value={counterAmount || ''}
                              onChange={(e) => setCounterAmount(parseInt(e.target.value) || 0)}
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Message (Optional)</label>
                            <Textarea
                              placeholder="Explain your counter offer..."
                              value={counterMessage}
                              onChange={(e) => setCounterMessage(e.target.value)}
                            />
                          </div>
                          <Button 
                            onClick={() => handleCounter(latestProposal.id)}
                            disabled={counterProposal.isPending || counterAmount <= 0}
                            className="w-full"
                          >
                            Send Counter Proposal
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    <Button 
                      variant="destructive" 
                      onClick={() => handleReject(latestProposal.id)}
                      disabled={rejectProposal.isPending}
                    >
                      Reject
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ProposalManager;
