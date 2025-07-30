import { NextRequest, NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';

// Initialize SendGrid with your API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { email, name, results } = await request.json();

    // Build HTML content for email
    const resultsHtml = results
      .map((r: any) => {
        const recs = r.recommendations.map((rec: string) => `<li>${rec}</li>`).join('');
        return `
          <h4>${r.category} - ${r.percentage}%</h4>
          <ul>${recs}</ul>
        `;
      })
      .join('');

    const htmlContent = `
      <p>Hi ${name},</p>
      <p>Thanks for completing the Quick Wins Assessment! Here are your results:</p>
      ${resultsHtml}
      <p>Best regards,<br/>NorthPath Strategies Team</p>
    `;

    // Prepare email
    const msg = {
      to: email,
      from: process.env.SENDGRID_SENDER!, // Define in .env
      subject: 'Your Quick Wins Assessment Results',
      html: htmlContent,
    };

    // Send email
    await sgMail.send(msg);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending Quick Wins report:', error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
