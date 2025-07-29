/**
 * Enterprise Facilitation Scheduling System
 * Enterprise Transformation ($24,000) - On-site facilitation and quarterly audits
 * 
 * @version 1.0.0
 * @author NorthPath Strategies
 */

'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  Briefcase,
  Plane,
  Hotel,
  Car,
  CheckCircle2,
  AlertCircle,
  Star
} from 'lucide-react';

interface FacilitationSession {
  id: string;
  type: 'onsite-workshop' | 'quarterly-audit' | 'transformation-planning' | 'stakeholder-alignment';
  title: string;
  description: string;
  duration: string;
  location: 'onsite' | 'virtual' | 'hybrid';
  facilitators: string[];
  estimatedCost: string;
  travelRequired: boolean;
  prerequisites: string[];
}

interface EnterpriseFacilitationProps {
  organizationName: string;
  organizationLocation: string;
  assessmentId: string;
  onSessionScheduled: (session: FacilitationSession, selectedDate: string) => void;
  className?: string;
}

const FACILITATION_SESSIONS: FacilitationSession[] = [
  {
    id: 'onsite-transformation-workshop',
    type: 'onsite-workshop',
    title: 'On-Site Transformation Workshop',
    description: 'Full-day intensive workshop with your leadership team to implement organizational changes and align stakeholders around the transformation roadmap.',
    duration: '2 days',
    location: 'onsite',
    facilitators: ['Dr. Sarah Chen - Executive Strategist', 'Michael Rodriguez - Change Management Expert'],
    estimatedCost: 'Included in Enterprise package',
    travelRequired: true,
    prerequisites: ['Assessment completed', 'Leadership team availability', 'Conference room for 8-12 people']
  },
  {
    id: 'quarterly-strategic-audit',
    type: 'quarterly-audit',
    title: 'Quarterly Strategic Audit',
    description: 'Comprehensive review of transformation progress, ROI validation, and strategic adjustments. Includes detailed analysis and board-ready reporting.',
    duration: '1 day',
    location: 'hybrid',
    facilitators: ['Jennifer Park - Strategy Consultant', 'Data Analytics Team'],
    estimatedCost: 'Included in Enterprise package',
    travelRequired: false,
    prerequisites: ['90 days post-implementation', 'Access to organizational data', 'Key stakeholder interviews']
  },
  {
    id: 'transformation-planning-intensive',
    type: 'transformation-planning',
    title: 'Transformation Planning Intensive',
    description: 'Multi-day strategic planning session to design detailed implementation roadmap, resource allocation, and change management strategy.',
    duration: '3 days',
    location: 'onsite',
    facilitators: ['Dr. Sarah Chen - Executive Strategist', 'Michael Rodriguez - Implementation Expert', 'Jennifer Park - Strategy Consultant'],
    estimatedCost: 'Included in Enterprise package',
    travelRequired: true,
    prerequisites: ['Executive sponsorship', 'Cross-functional team assembly', 'Current state documentation']
  },
  {
    id: 'stakeholder-alignment-summit',
    type: 'stakeholder-alignment',
    title: 'Stakeholder Alignment Summit',
    description: 'Strategic alignment session bringing together board members, executives, and key stakeholders to ensure unified vision and commitment.',
    duration: '1 day',
    location: 'onsite',
    facilitators: ['Dr. Sarah Chen - Executive Strategist', 'Board Relations Expert'],
    estimatedCost: 'Included in Enterprise package',
    travelRequired: true,
    prerequisites: ['Board calendar coordination', 'Executive presentations prepared', 'Strategic materials reviewed']
  }
];

export function EnterpriseFacilitationScheduling({ 
  organizationName,
  organizationLocation,
  assessmentId,
  onSessionScheduled,
  className 
}: EnterpriseFacilitationProps) {
  const [selectedSession, setSelectedSession] = useState<FacilitationSession | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [activeTab, setActiveTab] = useState('sessions');

  const getSessionTypeIcon = (type: string) => {
    switch (type) {
      case 'onsite-workshop':
        return Users;
      case 'quarterly-audit':
        return CheckCircle2;
      case 'transformation-planning':
        return Briefcase;
      case 'stakeholder-alignment':
        return Star;
      default:
        return Calendar;
    }
  };

  const getLocationBadge = (location: string) => {
    const styles = {
      'onsite': 'bg-blue-100 text-blue-800 border-blue-200',
      'virtual': 'bg-green-100 text-green-800 border-green-200',
      'hybrid': 'bg-purple-100 text-purple-800 border-purple-200'
    };
    
    const icons = {
      'onsite': MapPin,
      'virtual': Calendar,
      'hybrid': Users
    };

    const Icon = icons[location as keyof typeof icons];
    
    return (
      <Badge className={`${styles[location as keyof typeof styles]} border flex items-center space-x-1`}>
        <Icon className="h-3 w-3" />
        <span>{location.charAt(0).toUpperCase() + location.slice(1)}</span>
      </Badge>
    );
  };

  const handleScheduleSession = () => {
    if (selectedSession && selectedDate) {
      onSessionScheduled(selectedSession, selectedDate);
    }
  };

  const generateAvailableDates = () => {
    const dates = [];
    const now = new Date();
    
    for (let i = 14; i <= 90; i += 7) { // Start 2 weeks out, weekly slots for 3 months
      const date = new Date(now.getTime() + i * 24 * 60 * 60 * 1000);
      dates.push({
        value: date.toISOString().split('T')[0],
        label: date.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      });
    }
    
    return dates;
  };

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center space-x-2">
            <Briefcase className="h-6 w-6 text-purple-600" />
            <span>Enterprise Facilitation Services</span>
          </CardTitle>
          <CardDescription className="text-base">
            Premium on-site facilitation and strategic planning services for {organizationName}. 
            Our senior consultants will work directly with your team to ensure successful transformation.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="sessions">Available Sessions</TabsTrigger>
              <TabsTrigger value="schedule" disabled={!selectedSession}>
                Schedule Session
              </TabsTrigger>
              <TabsTrigger value="logistics">Travel & Logistics</TabsTrigger>
            </TabsList>

            <TabsContent value="sessions" className="mt-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {FACILITATION_SESSIONS.map((session) => {
                    const IconComponent = getSessionTypeIcon(session.type);
                    
                    return (
                      <Card 
                        key={session.id}
                        className={`cursor-pointer transition-all hover:shadow-lg ${
                          selectedSession?.id === session.id ? 'ring-2 ring-purple-500 bg-purple-50' : ''
                        }`}
                        onClick={() => setSelectedSession(session)}
                      >
                        <CardContent className="p-6">
                          <div className="space-y-4">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start space-x-3">
                                <div className="bg-purple-100 p-2 rounded-lg">
                                  <IconComponent className="h-5 w-5 text-purple-600" />
                                </div>
                                <div className="flex-1">
                                  <h3 className="font-semibold text-lg">{session.title}</h3>
                                  <p className="text-sm text-gray-600 mt-1">{session.description}</p>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-2">
                                <Clock className="h-4 w-4 text-gray-400" />
                                <span className="text-sm">{session.duration}</span>
                              </div>
                              {getLocationBadge(session.location)}
                            </div>

                            <div className="space-y-2">
                              <h4 className="text-sm font-medium">Facilitators:</h4>
                              <div className="space-y-1">
                                {session.facilitators.map((facilitator) => (
                                  <div key={facilitator} className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                                    <span className="text-sm text-gray-700">{facilitator}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="space-y-2">
                              <h4 className="text-sm font-medium">Prerequisites:</h4>
                              <ul className="space-y-1">
                                {session.prerequisites.map((prereq, index) => (
                                  <li key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                                    <CheckCircle2 className="h-3 w-3 text-green-500" />
                                    <span>{prereq}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {session.travelRequired && (
                              <div className="bg-blue-50 p-3 rounded-lg">
                                <div className="flex items-center space-x-2">
                                  <Plane className="h-4 w-4 text-blue-600" />
                                  <span className="text-sm font-medium text-blue-900">
                                    Travel to {organizationLocation} included
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {selectedSession && (
                  <Card className="border-purple-200 bg-purple-50">
                    <CardContent className="p-6">
                      <h4 className="font-semibold text-lg mb-4">
                        Selected: {selectedSession.title}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Duration:</span> {selectedSession.duration}
                        </div>
                        <div>
                          <span className="font-medium">Location:</span> {selectedSession.location}
                        </div>
                        <div>
                          <span className="font-medium">Cost:</span> {selectedSession.estimatedCost}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="schedule" className="mt-6">
              {selectedSession && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Schedule {selectedSession.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Preferred Date</label>
                          <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                          >
                            <option value="">Select a date...</option>
                            {generateAvailableDates().map((date) => (
                              <option key={date.value} value={date.value}>
                                {date.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        {selectedDate && (
                          <div className="bg-green-50 p-4 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <CheckCircle2 className="h-5 w-5 text-green-600" />
                              <div>
                                <h4 className="font-medium text-green-900">Session Details Confirmed</h4>
                                <p className="text-sm text-green-700">
                                  {selectedSession.title} scheduled for {new Date(selectedDate).toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  })}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="flex justify-end">
                          <Button 
                            onClick={handleScheduleSession}
                            disabled={!selectedDate}
                            className="bg-purple-600 hover:bg-purple-700"
                          >
                            Confirm Scheduling Request
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>

            <TabsContent value="logistics" className="mt-6">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <Plane className="h-5 w-5" />
                      <span>Travel & Accommodation</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-3">
                        <h4 className="font-medium flex items-center space-x-2">
                          <Plane className="h-4 w-4 text-blue-500" />
                          <span>Travel Arrangements</span>
                        </h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                          <li>• Flights for consulting team</li>
                          <li>• Ground transportation</li>
                          <li>• Airport transfers included</li>
                          <li>• Travel insurance covered</li>
                        </ul>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-medium flex items-center space-x-2">
                          <Hotel className="h-4 w-4 text-green-500" />
                          <span>Accommodation</span>
                        </h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                          <li>• Business-class hotel near your location</li>
                          <li>• Extended stay for multi-day sessions</li>
                          <li>• Meeting room setup assistance</li>
                          <li>• Catering coordination</li>
                        </ul>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-medium flex items-center space-x-2">
                          <Car className="h-4 w-4 text-purple-500" />
                          <span>Local Support</span>
                        </h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                          <li>• Rental car if needed</li>
                          <li>• Local venue coordination</li>
                          <li>• Equipment setup and support</li>
                          <li>• Emergency contact 24/7</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-amber-50 border-amber-200">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-amber-900">Planning Timeline</h4>
                        <p className="text-sm text-amber-700 mt-1">
                          On-site facilitation requires 2-3 weeks advance notice for travel arrangements 
                          and venue coordination. Emergency sessions can be accommodated with 48-hour notice 
                          for an additional expedite fee.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

export default EnterpriseFacilitationScheduling;
