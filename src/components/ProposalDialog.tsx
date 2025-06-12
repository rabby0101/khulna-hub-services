
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCreateProposal } from '@/hooks/useProposals';
import { toast } from '@/hooks/use-toast';

interface ProposalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobId: string;
  jobTitle: string;
  budgetMin: number;
  budgetMax: number;
}

const ProposalDialog = ({ 
  open, 
  onOpenChange, 
  jobId, 
  jobTitle, 
  budgetMin, 
  budgetMax 
}: ProposalDialogProps) => {
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const createProposal = useCreateProposal();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const proposalAmount = parseInt(amount);
    if (!proposalAmount || proposalAmount < budgetMin || proposalAmount > budgetMax) {
      toast({
        title: "Invalid Amount",
        description: `Please enter an amount between ৳${budgetMin} and ৳${budgetMax}`,
        variant: "destructive",
      });
      return;
    }

    try {
      await createProposal.mutateAsync({
        job_id: jobId,
        amount: proposalAmount,
        message: message.trim() || undefined,
      });

      toast({
        title: "Proposal Sent!",
        description: "Your proposal has been submitted successfully",
      });

      setAmount('');
      setMessage('');
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send proposal",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Send Proposal</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Job</Label>
            <p className="text-sm font-semibold">{jobTitle}</p>
          </div>
          
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Budget Range</Label>
            <p className="text-sm">৳{budgetMin} - ৳{budgetMax}</p>
          </div>

          <div>
            <Label htmlFor="amount">Your Bid Amount (৳)</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={`Enter amount between ${budgetMin} - ${budgetMax}`}
              min={budgetMin}
              max={budgetMax}
              required
            />
          </div>

          <div>
            <Label htmlFor="message">Cover Letter (Optional)</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell the client why you're the best fit for this job..."
              rows={4}
            />
          </div>

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={createProposal.isPending}
            >
              {createProposal.isPending ? 'Sending...' : 'Send Proposal'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProposalDialog;
