'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { CheckCircle, XCircle, Clock, Users } from 'lucide-react';

interface InvitationData {
  id: string;
  email: string;
  role: string;
  expires_at: string;
  team: {
    id: string;
    name: string;
    description: string;
  };
  inviter: {
    full_name: string;
    email: string;
  };
}

function AcceptInvitationContent() {
  const [invitation, setInvitation] = useState<InvitationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [accepted, setAccepted] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const { toast } = useToast();

  useEffect(() => {
    if (!token) {
      setError('Invalid invitation link');
      setLoading(false);
      return;
    }

    fetchInvitationDetails();
  }, [token]);

  const fetchInvitationDetails = async () => {
    try {
      const response = await fetch(`/api/teams/invitations/verify?token=${token}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Invalid invitation');
      }

      setInvitation(data.invitation);
    } catch (_err) {
      setError(err instanceof Error ? err.message : 'Failed to load invitation');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptInvitation = async () => {
    if (!invitation || !token) return;

    setAccepting(true);
    try {
      const response = await fetch('/api/teams/invitations/accept', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to accept invitation');
      }

      setAccepted(true);
      toast({
        title: "Success",
        description: `You've joined the ${invitation.team.name} team!`,
      });

      // Redirect to teams dashboard after a short delay
      setTimeout(() => {
        router.push('/teams');
      }, 2000);

    } catch (_err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to accept invitation",
        variant: "destructive",
      });
    } finally {
      setAccepting(false);
    }
  };

  const handleDeclineInvitation = async () => {
    if (!token) return;

    try {
      const response = await fetch('/api/teams/invitations/decline', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      if (response.ok) {
        toast({
          title: "Invitation Declined",
          description: "You have declined the team invitation.",
        });
        router.push('/');
      }
    } catch (_err) {
      toast({
        title: "Error",
        description: "Failed to decline invitation",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !invitation) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <XCircle className="w-16 h-16 text-red-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Invalid Invitation</h3>
            <p className="text-gray-600 text-center mb-4">
              {error || 'This invitation link is invalid or has expired.'}
            </p>
            <Button onClick={() => router.push('/')}>
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (accepted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Welcome to the Team!</h3>
            <p className="text-gray-600 text-center mb-4">
              You've successfully joined <strong>{invitation.team.name}</strong>
            </p>
            <p className="text-sm text-gray-500 text-center">
              Redirecting to your teams dashboard...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isExpired = new Date(invitation.expires_at) < new Date();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Users className="mx-auto h-12 w-12 text-blue-600" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Team Invitation
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            You've been invited to join a team
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Join {invitation.team.name}</CardTitle>
            <CardDescription>
              {invitation.inviter.full_name || invitation.inviter.email} has invited you to join their team
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {invitation.team.description && (
              <div>
                <h4 className="font-medium text-gray-900">About this team:</h4>
                <p className="text-gray-600 text-sm">{invitation.team.description}</p>
              </div>
            )}

            <div>
              <h4 className="font-medium text-gray-900">Your Role:</h4>
              <p className="text-gray-600 text-sm capitalize">
                {invitation.role} - 
                {invitation.role === 'admin' && ' Full team management access'}
                {invitation.role === 'member' && ' Can collaborate on assessments'}
                {invitation.role === 'viewer' && ' Can view team assessments and reports'}
              </p>
            </div>

            {isExpired ? (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex items-center">
                  <XCircle className="w-5 h-5 text-red-500 mr-2" />
                  <p className="text-red-800 text-sm font-medium">
                    This invitation has expired
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-yellow-500 mr-2" />
                  <p className="text-yellow-800 text-sm">
                    Expires on {new Date(invitation.expires_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}

            {!isExpired && (
              <div className="flex space-x-3">
                <Button 
                  onClick={handleAcceptInvitation} 
                  disabled={accepting}
                  className="flex-1"
                >
                  {accepting ? 'Accepting...' : 'Accept Invitation'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleDeclineInvitation}
                  disabled={accepting}
                  className="flex-1"
                >
                  Decline
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function AcceptInvitationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    }>
      <AcceptInvitationContent />
    </Suspense>
  );
}
