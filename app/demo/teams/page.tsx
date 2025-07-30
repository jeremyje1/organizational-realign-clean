'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Mail, UserPlus, Settings, Crown, Eye, Edit, CheckCircle, Clock, AlertCircle, BarChart3, FileText, MessageSquare, Calendar, Download } from 'lucide-react';

const DEMO_TEAM_MEMBERS = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@demo.com',
    role: 'admin',
    status: 'active',
    joinedAt: '2024-01-15',
    lastActive: '2 hours ago',
    completionRate: 100,
    avatar: '👩‍💼'
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael.chen@demo.com',
    role: 'editor',
    status: 'active',
    joinedAt: '2024-01-20',
    lastActive: '1 day ago',
    completionRate: 85,
    avatar: '👨‍💻'
  },
  {
    id: '3',
    name: 'Lisa Rodriguez',
    email: 'lisa.rodriguez@demo.com',
    role: 'viewer',
    status: 'active',
    joinedAt: '2024-02-01',
    lastActive: '3 days ago',
    completionRate: 60,
    avatar: '👩‍🎓'
  },
  {
    id: '4',
    name: 'David Park',
    email: 'david.park@demo.com',
    role: 'editor',
    status: 'invited',
    joinedAt: null,
    lastActive: null,
    completionRate: 0,
    avatar: '👨‍🔬'
  }
];

const DEMO_NOTIFICATIONS = [
  {
    id: '1',
    type: 'completion',
    message: 'Michael Chen completed Section 3: Leadership Assessment',
    timestamp: '2 hours ago',
    icon: '✅'
  },
  {
    id: '2',
    type: 'invitation',
    message: 'Invitation sent to david.park@demo.com',
    timestamp: '1 day ago',
    icon: '📧'
  },
  {
    id: '3',
    type: 'comment',
    message: 'Lisa Rodriguez added a comment on the Strategic Planning section',
    timestamp: '2 days ago',
    icon: '💬'
  },
  {
    id: '4',
    type: 'report',
    message: 'Team AI Report generated and ready for download',
    timestamp: '3 days ago',
    icon: '📊'
  }
];

const DEMO_ACTIVITIES = [
  {
    id: '1',
    user: 'Sarah Johnson',
    action: 'invited',
    target: 'David Park',
    timestamp: '1 day ago'
  },
  {
    id: '2',
    user: 'Michael Chen',
    action: 'completed',
    target: 'Financial Management Assessment',
    timestamp: '2 hours ago'
  },
  {
    id: '3',
    user: 'Lisa Rodriguez',
    action: 'commented on',
    target: 'Strategic Planning Section',
    timestamp: '2 days ago'
  },
  {
    id: '4',
    user: 'Sarah Johnson',
    action: 'generated',
    target: 'Team AI Report',
    timestamp: '3 days ago'
  }
];

export default function TeamDashboardDemo() {
  const [activeTab, setActiveTab] = useState('overview');

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Crown className="h-4 w-4 text-yellow-500" />;
      case 'editor': return <Edit className="h-4 w-4 text-blue-500" />;
      case 'viewer': return <Eye className="h-4 w-4 text-gray-500" />;
      default: return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'invited': return <Badge className="bg-yellow-100 text-yellow-800">Invited</Badge>;
      case 'inactive': return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Demo Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Team Collaboration Dashboard</h1>
              <p className="text-blue-100">
                🎭 <strong>Interactive Demo</strong> - Experience our patent-pending team collaboration features
              </p>
            </div>
            <Badge className="bg-yellow-500 text-yellow-900 px-4 py-2 text-lg font-semibold">
              ✨ LIVE DEMO
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">4</p>
                  <p className="text-gray-600">Team Members</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">78%</p>
                  <p className="text-gray-600">Avg Completion</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <BarChart3 className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">3</p>
                  <p className="text-gray-600">AI Reports</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">5 days</p>
                  <p className="text-gray-600">Time Saved</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="members">Team Members</TabsTrigger>
            <TabsTrigger value="progress">Progress Tracking</TabsTrigger>
            <TabsTrigger value="reports">AI Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {DEMO_ACTIVITIES.map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-xs">👤</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900">
                            <span className="font-medium">{activity.user}</span> {activity.action}{' '}
                            <span className="font-medium">{activity.target}</span>
                          </p>
                          <p className="text-xs text-gray-500">{activity.timestamp}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Notifications */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2" />
                    Smart Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {DEMO_NOTIFICATIONS.map((notification) => (
                      <div key={notification.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                        <span className="text-lg">{notification.icon}</span>
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">{notification.message}</p>
                          <p className="text-xs text-gray-500">{notification.timestamp}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Team Progress Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Team Assessment Progress</CardTitle>
                <CardDescription>
                  Real-time collaboration progress with expert guidance integration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">8/10</div>
                      <div className="text-sm text-green-700">Sections Complete</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">3</div>
                      <div className="text-sm text-blue-700">Expert Reviews</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">12</div>
                      <div className="text-sm text-purple-700">AI Insights</div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Leadership Assessment</span>
                      <span>100%</span>
                    </div>
                    <Progress value={100} className="h-2" />
                    
                    <div className="flex justify-between text-sm">
                      <span>Financial Management</span>
                      <span>85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                    
                    <div className="flex justify-between text-sm">
                      <span>Strategic Planning</span>
                      <span>60%</span>
                    </div>
                    <Progress value={60} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="members" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Team Members</CardTitle>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Invite Member
                  </Button>
                </div>
                <CardDescription>
                  Manage team access, roles, and collaboration permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {DEMO_TEAM_MEMBERS.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-2xl">
                          {member.avatar}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{member.name}</h3>
                          <p className="text-sm text-gray-500">{member.email}</p>
                          {member.joinedAt && (
                            <p className="text-xs text-gray-400">Joined {member.joinedAt}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <div className="text-sm font-medium">{member.completionRate}%</div>
                          <div className="text-xs text-gray-500">Complete</div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {getRoleIcon(member.role)}
                          <span className="text-sm capitalize">{member.role}</span>
                        </div>
                        
                        {getStatusBadge(member.status)}
                        
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Progress Tracking & Analytics</CardTitle>
                <CardDescription>
                  Real-time insights into team collaboration effectiveness
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Individual Progress</h4>
                    {DEMO_TEAM_MEMBERS.filter(m => m.status === 'active').map((member) => (
                      <div key={member.id} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{member.name}</span>
                          <span>{member.completionRate}%</span>
                        </div>
                        <Progress value={member.completionRate} className="h-2" />
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-medium">Collaboration Metrics</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-green-50 rounded-lg text-center">
                        <div className="text-lg font-bold text-green-600">24</div>
                        <div className="text-xs text-green-700">Comments</div>
                      </div>
                      <div className="p-3 bg-blue-50 rounded-lg text-center">
                        <div className="text-lg font-bold text-blue-600">7</div>
                        <div className="text-xs text-blue-700">Discussions</div>
                      </div>
                      <div className="p-3 bg-purple-50 rounded-lg text-center">
                        <div className="text-lg font-bold text-purple-600">5</div>
                        <div className="text-xs text-purple-700">File Shares</div>
                      </div>
                      <div className="p-3 bg-orange-50 rounded-lg text-center">
                        <div className="text-lg font-bold text-orange-600">92%</div>
                        <div className="text-xs text-orange-700">Engagement</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>AI-Powered Team Reports</CardTitle>
                <CardDescription>
                  Comprehensive analysis with patent-pending algorithms and expert guidance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <FileText className="h-8 w-8 text-blue-600" />
                      <Badge className="bg-green-100 text-green-800">Ready</Badge>
                    </div>
                    <h4 className="font-medium mb-2">Team Assessment Report</h4>
                    <p className="text-sm text-gray-600 mb-3">Comprehensive 47-page analysis with AI insights</p>
                    <Button size="sm" className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF
                    </Button>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <BarChart3 className="h-8 w-8 text-purple-600" />
                      <Badge className="bg-green-100 text-green-800">Ready</Badge>
                    </div>
                    <h4 className="font-medium mb-2">Org Chart Analysis</h4>
                    <p className="text-sm text-gray-600 mb-3">Interactive organizational structure with scenarios</p>
                    <Button size="sm" className="w-full" variant="outline">
                      <Eye className="h-4 w-4 mr-2" />
                      View Interactive
                    </Button>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <Users className="h-8 w-8 text-orange-600" />
                      <Badge className="bg-yellow-100 text-yellow-800">Processing</Badge>
                    </div>
                    <h4 className="font-medium mb-2">Collaboration Impact</h4>
                    <p className="text-sm text-gray-600 mb-3">Team dynamics and effectiveness analysis</p>
                    <Button size="sm" className="w-full" variant="outline" disabled>
                      <Clock className="h-4 w-4 mr-2" />
                      Generating...
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
          <CardContent className="p-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">Experience Full Team Collaboration</h3>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                This demo shows just a glimpse of our comprehensive team collaboration features. Get started with your actual team assessment and experience patent-pending algorithms with expert guidance.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                  Start Free Team Assessment
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                  Schedule Team Strategy Call
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
