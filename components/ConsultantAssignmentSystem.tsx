/**
 * Consultant Assignment System for Premium Tiers
 * Monthly Subscription ($2,995/mo) and Comprehensive Package ($9,900)
 * 
 * @version 1.0.0
 * @author NorthPath Strategies
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, Star, Award, MapPin, Video, Phone, MessageSquare } from 'lucide-react';

interface Consultant {
  id: string;
  name: string;
  title: string;
  tier: 'senior' | 'principal' | 'executive';
  avatar?: string;
  expertise: string[];
  industries: string[];
  rating: number;
  reviews: number;
  location: string;
  timezone: string;
  languages: string[];
  availability: {
    nextAvailable: string;
    slots: string[];
  };
  specialties: string[];
  certifications: string[];
  experience: string;
}

interface ConsultantAssignmentProps {
  userTier: 'monthly-subscription' | 'comprehensive-package' | 'enterprise-transformation';
  institutionType?: 'higher-ed' | 'healthcare' | 'nonprofit' | 'enterprise';
  assessmentId?: string;
  onConsultantAssigned: (consultant: Consultant, sessionType: string, scheduledTime: string) => void;
}

const CONSULTANT_DATABASE: Consultant[] = [
  {
    id: 'consultant-001',
    name: 'Dr. Sarah Chen',
    title: 'Senior Organizational Strategist',
    tier: 'executive',
    avatar: '/api/placeholder/consultant-sarah.jpg',
    expertise: ['Higher Education', 'AI Integration', 'Change Management'],
    industries: ['Education', 'Healthcare', 'Nonprofit'],
    rating: 4.9,
    reviews: 127,
    location: 'San Francisco, CA',
    timezone: 'PST',
    languages: ['English', 'Mandarin'],
    availability: {
      nextAvailable: '2025-07-21T14:00:00Z',
      slots: ['2025-07-21T14:00:00Z', '2025-07-22T16:00:00Z', '2025-07-23T10:00:00Z']
    },
    specialties: ['University Restructuring', 'Academic AI Implementation', 'Board Strategy'],
    certifications: ['PMP', 'Change Management Institute', 'AI Strategy Certified'],
    experience: '15+ years leading organizational transformations for universities and medical centers'
  },
  {
    id: 'consultant-002',
    name: 'Michael Rodriguez',
    title: 'Principal Healthcare Consultant',
    tier: 'principal',
    avatar: '/api/placeholder/consultant-michael.jpg',
    expertise: ['Healthcare Systems', 'Process Optimization', 'Regulatory Compliance'],
    industries: ['Healthcare', 'Life Sciences'],
    rating: 4.8,
    reviews: 89,
    location: 'Chicago, IL',
    timezone: 'CST',
    languages: ['English', 'Spanish'],
    availability: {
      nextAvailable: '2025-07-22T13:00:00Z',
      slots: ['2025-07-22T13:00:00Z', '2025-07-23T15:00:00Z', '2025-07-24T09:00:00Z']
    },
    specialties: ['Hospital Optimization', 'Clinical Workflow', 'HIPAA Compliance'],
    certifications: ['HIMSS', 'Lean Healthcare', 'Six Sigma Black Belt'],
    experience: '12+ years optimizing healthcare delivery systems and reducing operational costs'
  },
  {
    id: 'consultant-003',
    name: 'Jennifer Park',
    title: 'Senior Strategy Consultant',
    tier: 'senior',
    avatar: '/api/placeholder/consultant-jennifer.jpg',
    expertise: ['Nonprofit Management', 'Financial Optimization', 'Board Governance'],
    industries: ['Nonprofit', 'Government', 'Education'],
    rating: 4.7,
    reviews: 156,
    location: 'Washington, DC',
    timezone: 'EST',
    languages: ['English', 'Korean'],
    availability: {
      nextAvailable: '2025-07-21T11:00:00Z',
      slots: ['2025-07-21T11:00:00Z', '2025-07-22T14:00:00Z', '2025-07-24T16:00:00Z']
    },
    specialties: ['Nonprofit Restructuring', 'Grant Optimization', 'Volunteer Management'],
    certifications: ['CFP', 'Nonprofit Management', 'Governance Expert'],
    experience: '10+ years helping nonprofits maximize impact while reducing operational overhead'
  }
];

export function ConsultantAssignmentSystem({ 
  userTier, 
  institutionType = 'higher-ed',
  assessmentId,
  onConsultantAssigned 
}: ConsultantAssignmentProps) {
  const [selectedConsultant, setSelectedConsultant] = useState<Consultant | null>(null);
  const [sessionType, setSessionType] = useState('strategy-session');
  const [availableConsultants, setAvailableConsultants] = useState<Consultant[]>([]);

  useEffect(() => {
    // Filter consultants based on user tier and institution type
    const filtered = CONSULTANT_DATABASE.filter(consultant => {
      // Tier filtering
      if (userTier === 'enterprise-transformation' && consultant.tier === 'senior') return false;
      if (userTier === 'comprehensive-package' && consultant.tier === 'senior') return false;
      
      // Industry filtering
      const industryMap = {
        'higher-ed': 'Education',
        'healthcare': 'Healthcare', 
        'nonprofit': 'Nonprofit',
        'enterprise': 'Enterprise'
      };
      
      return consultant.industries.includes(industryMap[institutionType]);
    });

    setAvailableConsultants(filtered);
  }, [userTier, institutionType]);

  const getSessionTypes = () => {
    const baseTypes = [
      { id: 'strategy-session', name: 'Strategy Session', duration: '60 min', description: 'Review results and develop action plan' },
      { id: 'implementation-planning', name: 'Implementation Planning', duration: '90 min', description: 'Detailed roadmap creation' }
    ];

    if (userTier === 'comprehensive-package' || userTier === 'enterprise-transformation') {
      baseTypes.push(
        { id: 'board-presentation', name: 'Board Presentation Prep', duration: '45 min', description: 'Prepare executive presentation' },
        { id: 'stakeholder-alignment', name: 'Stakeholder Alignment', duration: '2 hours', description: 'Multi-stakeholder planning session' }
      );
    }

    if (userTier === 'enterprise-transformation') {
      baseTypes.push(
        { id: 'onsite-facilitation', name: 'On-Site Facilitation', duration: '1-2 days', description: 'In-person transformation workshop' }
      );
    }

    return baseTypes;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const getTierBadge = (tier: string) => {
    const styles = {
      'executive': 'bg-purple-100 text-purple-800 border-purple-200',
      'principal': 'bg-blue-100 text-blue-800 border-blue-200',
      'senior': 'bg-green-100 text-green-800 border-green-200'
    };
    
    return (
      <Badge className={`${styles[tier as keyof typeof styles]} border`}>
        {tier.charAt(0).toUpperCase() + tier.slice(1)} Consultant
      </Badge>
    );
  };

  const handleScheduleSession = (consultant: Consultant, sessionType: string, timeSlot: string) => {
    onConsultantAssigned(consultant, sessionType, timeSlot);
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center space-x-2">
            <Award className="h-6 w-6 text-purple-600" />
            <span>Consultant Assignment</span>
          </CardTitle>
          <CardDescription className="text-lg">
            Connect with a dedicated consultant for your {userTier.replace('-', ' ')} tier. 
            Our experts will help you implement your organizational recommendations.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="consultants" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="consultants">Select Consultant</TabsTrigger>
              <TabsTrigger value="schedule" disabled={!selectedConsultant}>
                Schedule Session
              </TabsTrigger>
            </TabsList>

            <TabsContent value="consultants" className="mt-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {availableConsultants.map((consultant) => (
                    <Card 
                      key={consultant.id} 
                      className={`cursor-pointer transition-all hover:shadow-lg ${
                        selectedConsultant?.id === consultant.id ? 'ring-2 ring-purple-500 bg-purple-50' : ''
                      }`}
                      onClick={() => setSelectedConsultant(consultant)}
                    >
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          {/* Avatar and Basic Info */}
                          <div className="flex items-start space-x-4">
                            <Avatar className="h-16 w-16">
                              <AvatarImage src={consultant.avatar} />
                              <AvatarFallback className="bg-purple-100 text-purple-700 font-semibold">
                                {consultant.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg">{consultant.name}</h3>
                              <p className="text-sm text-gray-600">{consultant.title}</p>
                              {getTierBadge(consultant.tier)}
                            </div>
                          </div>

                          {/* Rating and Reviews */}
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="ml-1 font-semibold">{consultant.rating}</span>
                            </div>
                            <span className="text-sm text-gray-500">({consultant.reviews} reviews)</span>
                          </div>

                          {/* Location and Availability */}
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center space-x-2">
                              <MapPin className="h-4 w-4 text-gray-400" />
                              <span>{consultant.location}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4 text-gray-400" />
                              <span>Next available: {formatDate(consultant.availability.nextAvailable)}</span>
                            </div>
                          </div>

                          {/* Expertise Tags */}
                          <div className="space-y-2">
                            <p className="text-sm font-medium">Expertise:</p>
                            <div className="flex flex-wrap gap-1">
                              {consultant.expertise.slice(0, 3).map((skill) => (
                                <Badge key={skill} variant="outline" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {/* Experience */}
                          <p className="text-sm text-gray-600 line-clamp-3">
                            {consultant.experience}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {selectedConsultant && (
                  <Card className="mt-6 border-purple-200 bg-purple-50">
                    <CardContent className="p-6">
                      <h4 className="font-semibold text-lg mb-4">Selected: {selectedConsultant.name}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h5 className="font-medium mb-2">Specialties</h5>
                          <div className="flex flex-wrap gap-1">
                            {selectedConsultant.specialties.map((specialty) => (
                              <Badge key={specialty} variant="outline">
                                {specialty}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h5 className="font-medium mb-2">Certifications</h5>
                          <div className="flex flex-wrap gap-1">
                            {selectedConsultant.certifications.map((cert) => (
                              <Badge key={cert} className="bg-blue-100 text-blue-800">
                                {cert}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="schedule" className="mt-6">
              {selectedConsultant && (
                <div className="space-y-6">
                  {/* Session Type Selection */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Select Session Type</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {getSessionTypes().map((type) => (
                          <Card 
                            key={type.id}
                            className={`cursor-pointer transition-all hover:shadow-md ${
                              sessionType === type.id ? 'ring-2 ring-purple-500 bg-purple-50' : ''
                            }`}
                            onClick={() => setSessionType(type.id)}
                          >
                            <CardContent className="p-4">
                              <h4 className="font-medium">{type.name}</h4>
                              <p className="text-sm text-gray-600 mt-1">{type.description}</p>
                              <Badge variant="outline" className="mt-2">
                                <Clock className="h-3 w-3 mr-1" />
                                {type.duration}
                              </Badge>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Time Slot Selection */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Available Time Slots</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {selectedConsultant.availability.slots.map((slot) => (
                          <Button
                            key={slot}
                            variant="outline"
                            className="p-4 h-auto flex flex-col items-center space-y-2 hover:bg-purple-50 hover:border-purple-300"
                            onClick={() => handleScheduleSession(selectedConsultant, sessionType, slot)}
                          >
                            <Calendar className="h-5 w-5" />
                            <div className="text-center">
                              <div className="font-medium">
                                {formatDate(slot).split(',')[0]}
                              </div>
                              <div className="text-sm text-gray-600">
                                {formatDate(slot).split(' ').slice(-2).join(' ')}
                              </div>
                            </div>
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Communication Preferences */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Session Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h5 className="font-medium mb-2">Communication Options</h5>
                          <div className="flex flex-wrap gap-2">
                            <Badge className="bg-green-100 text-green-800 flex items-center space-x-1">
                              <Video className="h-3 w-3" />
                              <span>Video Call</span>
                            </Badge>
                            <Badge className="bg-blue-100 text-blue-800 flex items-center space-x-1">
                              <Phone className="h-3 w-3" />
                              <span>Phone Call</span>
                            </Badge>
                            {(userTier === 'comprehensive-package' || userTier === 'enterprise-transformation') && (
                              <Badge className="bg-purple-100 text-purple-800 flex items-center space-x-1">
                                <MapPin className="h-3 w-3" />
                                <span>In-Person</span>
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-lg">
                          <div className="flex items-start space-x-2">
                            <MessageSquare className="h-5 w-5 text-blue-600 mt-0.5" />
                            <div>
                              <h6 className="font-medium text-blue-900">What to Expect</h6>
                              <p className="text-sm text-blue-800 mt-1">
                                Your consultant will review your assessment results, discuss key findings, 
                                and work with you to create a customized implementation roadmap.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

export default ConsultantAssignmentSystem;
