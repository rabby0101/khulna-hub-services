
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  DollarSign, 
  User, 
  CheckCircle, 
  AlertCircle,
  MessageSquare,
  Calendar
} from 'lucide-react';
import { useMyDeals } from '@/hooks/useDeals';
import { useMarkDealCompleted } from '@/hooks/useProposalActions';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';

const DealManager = () => {
  const { user } = useAuth();
  const { data: deals = [], isLoading } = useMyDeals();
  const markCompleted = useMarkDealCompleted();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleMarkCompleted = (dealId: string) => {
    markCompleted.mutate(dealId);
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading deals...</div>;
  }

  if (deals.length === 0) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-semibold text-foreground mb-2">No active deals</h3>
        <p className="text-muted-foreground">Deals will appear here once proposals are accepted.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-foreground mb-6">My Deals</h2>
      
      {deals.map((deal) => {
        const isClient = deal.client_id === user?.id;
        const otherParty = isClient ? deal.profiles : null;
        
        return (
          <Card key={deal.id} className="border">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <DollarSign className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">
                      {deal.jobs?.title}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {isClient ? 'Service Provider' : 'Client'}: {
                        isClient 
                          ? (otherParty?.full_name || 'Service Provider')
                          : 'You are the provider'
                      }
                    </p>
                  </div>
                </div>
                <Badge className={getStatusColor(deal.status)}>
                  {deal.status.charAt(0).toUpperCase() + deal.status.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold">৳{deal.agreed_amount}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Started {formatDistanceToNow(new Date(deal.created_at), { addSuffix: true })}
                    </span>
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <MessageSquare className="h-4 w-4 text-muted-foreground mt-1" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Project Details</p>
                    <p className="text-sm text-muted-foreground">{deal.jobs?.description}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    Location: {deal.jobs?.location}
                  </span>
                </div>

                {deal.status === 'active' && (
                  <div className="flex space-x-2 pt-3 border-t">
                    {isClient ? (
                      <Button 
                        size="sm" 
                        onClick={() => handleMarkCompleted(deal.id)}
                        disabled={markCompleted.isPending}
                        className="flex items-center space-x-2"
                      >
                        <CheckCircle className="h-4 w-4" />
                        <span>Mark as Completed</span>
                      </Button>
                    ) : (
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <AlertCircle className="h-4 w-4" />
                        <span>Waiting for client to mark as completed</span>
                      </div>
                    )}
                    
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="flex items-center space-x-2"
                    >
                      <MessageSquare className="h-4 w-4" />
                      <span>Message</span>
                    </Button>
                  </div>
                )}

                {deal.status === 'completed' && (
                  <div className="flex items-center justify-between pt-3 border-t">
                    <div className="flex items-center space-x-2 text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">Project Completed</span>
                    </div>
                    <Button 
                      size="sm"
                      className="flex items-center space-x-2"
                    >
                      <DollarSign className="h-4 w-4" />
                      <span>Process Payment</span>
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default DealManager;
