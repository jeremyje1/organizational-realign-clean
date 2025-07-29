import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const bookingSchema = z.object({
  assessmentId: z.string().uuid(),
  consultationType: z.enum(['strategic', 'implementation', 'follow-up']),
  preferredDate: z.string(),
  preferredTime: z.string(),
  timezone: z.string(),
  message: z.string().optional(),
  organizationSize: z.enum(['small', 'medium', 'large', 'enterprise']),
  urgency: z.enum(['low', 'medium', 'high', 'urgent']),
});

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      assessmentId,
      consultationType,
      preferredDate,
      preferredTime,
      timezone,
      message,
      organizationSize,
      urgency
    } = bookingSchema.parse(body);

    // Verify user owns the assessment
    const { data: assessment, error: assessmentError } = await supabase
      .from('assessments')
      .select('user_id')
      .eq('id', assessmentId)
      .single();

    if (assessmentError || assessment.user_id !== user.id) {
      return NextResponse.json({ error: 'Assessment not found or access denied' }, { status: 403 });
    }

    // Get user profile information - commenting out unused profile for now
    // const { data: profile, error: profileError } = await supabase
    //   .from('profiles')
    //   .select('email, full_name, organization_name')
    //   .eq('id', user.id)
    //   .single();

    // if (profileError) {
    //   return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    // }

    // Create consultation booking
    const { data: booking, error: bookingError } = await supabase
      .from('consultation_bookings')
      .insert({
        user_id: user.id,
        assessment_id: assessmentId,
        consultation_type: consultationType,
        preferred_date: preferredDate,
        preferred_time: preferredTime,
        timezone,
        message,
        organization_size: organizationSize,
        urgency,
        status: 'pending',
      })
      .select()
      .single();

    if (bookingError) {
      console.error('Booking creation error:', bookingError);
      return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
    }

    // TODO: Send confirmation email to user
    // TODO: Send notification to team

    return NextResponse.json({ 
      booking,
      message: 'Consultation booking created successfully. Our team will contact you within 24 hours.' 
    });
  } catch (error) {
    console.error('Booking error:', error);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's consultation bookings
    const { data: bookings, error: bookingsError } = await supabase
      .from('consultation_bookings')
      .select(`
        *,
        assessments (
          tier,
          organization_type,
          created_at
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (bookingsError) {
      console.error('Bookings fetch error:', bookingsError);
      return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
    }

    return NextResponse.json({ bookings });
  } catch (error) {
    console.error('Get bookings error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
