import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email/postmark';

// Support contact endpoint acknowledges receipt to user and notifies internal team
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { name, email, message } = body as { name?: string; email?: string; message?: string };

    if (!email || !message) {
      return NextResponse.json({ error: 'Missing required fields: email, message' }, { status: 400 });
    }

    const safeName = (name || email.split('@')[0]).trim().slice(0, 120);
    const safeMessage = String(message).trim().slice(0, 8000);

    await sendEmail({
      to: email,
      subject: 'We received your message',
      html: `<p>Thanks ${safeName}, we received your request and will get back shortly.</p>`,
      text: `Thanks ${safeName}, we received your request and will get back shortly.`,
      tag: 'support-auto'
    });

    await sendEmail({
      to: process.env.FROM_EMAIL!,
      subject: 'New support request',
      html: `<p><strong>From:</strong> ${safeName} (${email})</p><p>${safeMessage.replace(/</g, '&lt;')}</p>`,
      text: `From: ${safeName} (${email})\n\n${safeMessage}`,
      tag: 'support-internal'
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Support contact error', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
