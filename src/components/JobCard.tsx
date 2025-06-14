
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, DollarSign } from 'lucide-react';
import { Job } from '@/hooks/useJobs';

interface JobCardProps {
  job: Job;
  onSendProposal?: (jobId: string) => void;
  showProposalButton?: boolean;
}

const JobCard: React.FC<JobCardProps> = ({ job, onSendProposal, showProposalButton = true }) => {
  return (
    <Card className="hover-scale cursor-pointer group border border-border hover:shadow-lg transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-3">
          <Badge variant={job.urgent ? "destructive" : "secondary"} className="text-xs">
            {job.category}
          </Badge>
          {job.urgent && (
            <Badge variant="destructive" className="text-xs">
              Urgent
            </Badge>
          )}
        </div>

        <h3 className="font-semibold text-lg text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
          {job.title}
        </h3>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <DollarSign className="w-4 h-4 mr-2" />
            <span>৳{job.budget}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 mr-2" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="w-4 h-4 mr-2" />
            <span>{new Date(job.created_at).toLocaleDateString()}</span>
          </div>
        </div>

        {onSendProposal && showProposalButton && (
          <Button 
            className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90 transition-colors text-sm font-medium"
            onClick={() => onSendProposal(job.id)}
          >
            Send Proposal
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default JobCard;
