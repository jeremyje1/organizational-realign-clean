'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Mail, Phone, MapPin, CheckCircle } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    phone: '',
    organizationType: 'enterprise',
    organizationSize: '201-1000',
    message: '',
    consent: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        throw new Error('Failed to submit form');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      alert('Failed to submit contact form. Please try again or email us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleScheduleConsultation = () => {
    window.open('https://calendly.com/northpath-strategies/consultation', '_blank');
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 flex items-center justify-center p-4">
        <Card className="max-w-md w-full bg-slate-800/90 border-slate-700/50">
          <CardContent className="pt-6 text-center">
            <CheckCircle className="h-16 w-16 text-emerald-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-slate-100 mb-2">Thank You!</h2>
            <p className="text-slate-300 mb-6">
              Your message has been sent successfully. We'll get back to you within 24 hours.
            </p>
            <Button 
              onClick={() => window.location.href = '/'}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              Return to Homepage
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center py-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-100 mb-4">
            Schedule Your Consultation
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Ready to transform your organization? Let's discuss your assessment results and create a customized implementation strategy.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <Card className="bg-slate-800/90 border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-slate-100">Get in Touch</CardTitle>
              <CardDescription className="text-slate-300">
                Fill out the form below or schedule a direct consultation call.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className="text-slate-200">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="bg-slate-700/50 border-slate-600/50 text-slate-100"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-slate-200">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="bg-slate-700/50 border-slate-600/50 text-slate-100"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email" className="text-slate-200">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="bg-slate-700/50 border-slate-600/50 text-slate-100"
                  />
                </div>

                <div>
                  <Label htmlFor="company" className="text-slate-200">Organization</Label>
                  <Input
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    required
                    className="bg-slate-700/50 border-slate-600/50 text-slate-100"
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="text-slate-200">Phone (Optional)</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="bg-slate-700/50 border-slate-600/50 text-slate-100"
                  />
                </div>

                <div>
                  <Label htmlFor="message" className="text-slate-200">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="bg-slate-700/50 border-slate-600/50 text-slate-100"
                    placeholder="Tell us about your organization and what you'd like to discuss..."
                  />
                </div>

                <div className="flex items-start space-x-2">
                  <input
                    id="consent"
                    name="consent"
                    type="checkbox"
                    checked={formData.consent}
                    onChange={handleInputChange}
                    required
                    className="mt-1"
                  />
                  <Label htmlFor="consent" className="text-sm text-slate-300">
                    I agree to be contacted by NorthPath Strategies regarding my inquiry
                  </Label>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Info & Quick Actions */}
          <div className="space-y-6">
            {/* Quick Consultation Booking */}
            <Card className="bg-slate-800/90 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-slate-100 flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Schedule Directly
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 mb-4">
                  Prefer to schedule immediately? Book a consultation call directly through our calendar.
                </p>
                <Button
                  onClick={handleScheduleConsultation}
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Book Consultation Call
                </Button>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="bg-slate-800/90 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-slate-100">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-purple-400" />
                  <span className="text-slate-300">info@northpathstrategies.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-purple-400" />
                  <span className="text-slate-300">Available by appointment</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-purple-400" />
                  <span className="text-slate-300">Virtual consultations available</span>
                </div>
              </CardContent>
            </Card>

            {/* What to Expect */}
            <Card className="bg-slate-800/90 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-slate-100">What to Expect</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-slate-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span>Review of your assessment results</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span>Customized implementation roadmap</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span>Q&A about recommendations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span>Discussion of next steps</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
