'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { Users, Mail, UserPlus, Settings, Crown, Eye, Edit, Trash2, Clock, CheckCircle } from 'lucide-react';

interface TeamMember {
  id: string;
  role: 'admin' | 'member' | 'viewer';
  joined_at: string;
  profiles: {
    email: string;
    full_name: string;
  };
}

interface Team {
  id: string;
  name: string;
  description: string;
  created_at: string;
  team_members: {
    role: string;
    joined_at: string;
  }[];
}

interface TeamInvitation {
  id: string;
  email: string;
  role: string;
  expires_at: string;
  created_at: string;
}

interface TeamDashboardProps {
  userId: string;
}

export function TeamDashboard({ userId }: TeamDashboardProps) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [pendingInvitations, setPendingInvitations] = useState<TeamInvitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [showCreateTeamDialog, setShowCreateTeamDialog] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'admin' | 'member' | 'viewer'>('member');
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamDescription, setNewTeamDescription] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchTeams();
  }, []);

  useEffect(() => {
    if (selectedTeam) {
      fetchTeamMembers(selectedTeam.id);
      fetchPendingInvitations(selectedTeam.id);
    }
  }, [selectedTeam]);

  const fetchTeams = async () => {
    try {
      const response = await fetch('/api/teams');
      const data = await response.json();
      if (data.teams) {
        setTeams(data.teams);
        if (data.teams.length > 0 && !selectedTeam) {
          setSelectedTeam(data.teams[0]);
        }
      }
    } catch (error) {
      console.error('Failed to fetch teams:', error);
      toast({
        title: "Error",
        description: "Failed to load teams",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchTeamMembers = async (teamId: string) => {
    try {
      const response = await fetch(`/api/teams/${teamId}/members`);
      const data = await response.json();
      if (data.members) {
        setTeamMembers(data.members);
      }
    } catch (error) {
      console.error('Failed to fetch team members:', error);
    }
  };

  const fetchPendingInvitations = async (teamId: string) => {
    try {
      const response = await fetch(`/api/teams/${teamId}/invitations`);
      if (response.ok) {
        const data = await response.json();
        if (data.invitations) {
          setPendingInvitations(data.invitations);
        }
      }
    } catch (error) {
      console.error('Failed to fetch pending invitations:', error);
    }
  };

  const handleCreateTeam = async () => {
    try {
      const response = await fetch('/api/teams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newTeamName,
          description: newTeamDescription,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Success",
          description: "Team created successfully",
        });
        setShowCreateTeamDialog(false);
        setNewTeamName('');
        setNewTeamDescription('');
        fetchTeams();
      } else {
        throw new Error('Failed to create team');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create team",
        variant: "destructive",
      });
    }
  };

  const handleInviteMember = async () => {
    if (!selectedTeam) return;

    try {
      const response = await fetch(`/api/teams/${selectedTeam.id}/members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: inviteEmail,
          role: inviteRole,
        }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Team member invited successfully",
        });
        setShowInviteDialog(false);
        setInviteEmail('');
        setInviteRole('member');
        fetchTeamMembers(selectedTeam.id);
        fetchPendingInvitations(selectedTeam.id);
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to invite member');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to invite member",
        variant: "destructive",
      });
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Crown className="w-4 h-4 text-yellow-500" />;
      case 'member':
        return <Edit className="w-4 h-4 text-blue-500" />;
      case 'viewer':
        return <Eye className="w-4 h-4 text-gray-500" />;
      default:
        return <Users className="w-4 h-4 text-gray-400" />;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-yellow-100 text-yellow-800';
      case 'member':
        return 'bg-blue-100 text-blue-800';
      case 'viewer':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Team Collaboration</h1>
          <p className="text-gray-600">Manage your teams and collaborate on assessments</p>
        </div>
        <Dialog open={showCreateTeamDialog} onOpenChange={setShowCreateTeamDialog}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="w-4 h-4 mr-2" />
              Create Team
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Team</DialogTitle>
              <DialogDescription>
                Create a new team to collaborate with colleagues on organizational assessments.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="team-name">Team Name</Label>
                <Input
                  id="team-name"
                  placeholder="Enter team name"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="team-description">Description (Optional)</Label>
                <Input
                  id="team-description"
                  placeholder="Brief description of the team"
                  value={newTeamDescription}
                  onChange={(e) => setNewTeamDescription(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateTeamDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateTeam} disabled={!newTeamName.trim()}>
                Create Team
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {teams.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="w-16 h-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Teams Yet</h3>
            <p className="text-gray-600 text-center mb-4">
              Create your first team to start collaborating with colleagues on organizational assessments.
            </p>
            <Button onClick={() => setShowCreateTeamDialog(true)}>
              <UserPlus className="w-4 h-4 mr-2" />
              Create Your First Team
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Team Selection */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Your Teams
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {teams.map((team) => (
                  <div
                    key={team.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedTeam?.id === team.id
                        ? 'border-blue-200 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedTeam(team)}
                  >
                    <h4 className="font-medium text-gray-900">{team.name}</h4>
                    {team.description && (
                      <p className="text-sm text-gray-600 mt-1">{team.description}</p>
                    )}
                    <div className="flex items-center mt-2 text-xs text-gray-500">
                      <Users className="w-3 h-3 mr-1" />
                      {team.team_members?.length || 0} member{(team.team_members?.length || 0) !== 1 ? 's' : ''}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Team Details */}
          {selectedTeam && (
            <div className="lg:col-span-2 space-y-6">
              {/* Team Info & Actions */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center">
                        {selectedTeam.name}
                      </CardTitle>
                      {selectedTeam.description && (
                        <CardDescription className="mt-1">
                          {selectedTeam.description}
                        </CardDescription>
                      )}
                    </div>
                    <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
                      <DialogTrigger asChild>
                        <Button size="sm">
                          <Mail className="w-4 h-4 mr-2" />
                          Invite Member
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Invite Team Member</DialogTitle>
                          <DialogDescription>
                            Invite a colleague to join {selectedTeam.name}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="invite-email">Email Address</Label>
                            <Input
                              id="invite-email"
                              type="email"
                              placeholder="colleague@organization.com"
                              value={inviteEmail}
                              onChange={(e) => setInviteEmail(e.target.value)}
                            />
                          </div>
                          <div>
                            <Label htmlFor="invite-role">Role</Label>
                            <Select value={inviteRole} onValueChange={(value: 'admin' | 'member' | 'viewer') => setInviteRole(value)}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="viewer">Viewer - Can view assessments and reports</SelectItem>
                                <SelectItem value="member">Member - Can edit assigned sections</SelectItem>
                                <SelectItem value="admin">Admin - Full team management access</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setShowInviteDialog(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleInviteMember} disabled={!inviteEmail.trim()}>
                            Send Invitation
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
              </Card>

              {/* Team Members */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Team Members ({teamMembers.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {teamMembers.length === 0 ? (
                    <p className="text-gray-600 text-center py-4">No team members yet</p>
                  ) : (
                    <div className="space-y-3">
                      {teamMembers.map((member) => (
                        <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-2">
                              {getRoleIcon(member.role)}
                              <div>
                                <p className="font-medium text-gray-900">
                                  {member.profiles.full_name || member.profiles.email}
                                </p>
                                <p className="text-sm text-gray-600">{member.profiles.email}</p>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={getRoleBadgeColor(member.role)}>
                              {member.role}
                            </Badge>
                            <div className="text-xs text-gray-500">
                              Joined {new Date(member.joined_at).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Pending Invitations */}
              {pendingInvitations.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Clock className="w-5 h-5 mr-2" />
                      Pending Invitations ({pendingInvitations.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {pendingInvitations.map((invitation) => (
                        <div key={invitation.id} className="flex items-center justify-between p-3 border border-orange-200 bg-orange-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Clock className="w-4 h-4 text-orange-500" />
                            <div>
                              <p className="font-medium text-gray-900">{invitation.email}</p>
                              <p className="text-sm text-gray-600">
                                Invited as {invitation.role} • Expires {new Date(invitation.expires_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <Badge className="bg-orange-100 text-orange-800">
                            Pending
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
