import { NextRequest, NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';

// Initialize SendGrid with your API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { email, name, results } = await request.json();

    // Check if SendGrid is properly configured
    if (!process.env.SENDGRID_API_KEY) {
      console.error('SENDGRID_API_KEY not configured');
      return NextResponse.json({ success: false, error: 'Email service not configured' }, { status: 500 });
    }

    // Use FROM_EMAIL from environment or default
    const fromEmail = process.env.FROM_EMAIL || process.env.SENDGRID_SENDER || 'info@northpathstrategies.org';

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
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .header { background: #1654A3; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .result-category { background: #f8f9fa; border-left: 4px solid #1654A3; padding: 15px; margin: 15px 0; }
          .category-title { color: #1654A3; font-weight: bold; font-size: 18px; }
          .recommendations { margin-top: 10px; }
          .cta { background: #D4AF37; color: white; padding: 20px; text-align: center; margin: 20px 0; border-radius: 5px; }
          .cta a { color: white; text-decoration: none; font-weight: bold; }
          .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 14px; color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Your Quick Wins Assessment Results</h1>
          <p>Immediate opportunities to improve your organization</p>
        </div>
        
        <div class="content">
          <p>Hi ${name},</p>
          <p>Thank you for completing the Quick Wins Assessment! Based on your responses, we've identified several immediate opportunities to save money and improve efficiency in your organization.</p>
          
          <h3>Your Assessment Results:</h3>
          ${results.map((r: any) => `
            <div class="result-category">
              <div class="category-title">${r.category} - ${r.percentage}% Efficiency</div>
              <div class="recommendations">
                <strong>Immediate Action Items:</strong>
                <ul>
                  ${r.recommendations.map((rec: string) => `<li>${rec}</li>`).join('')}
                </ul>
              </div>
            </div>
          `).join('')}
          
          <div class="cta">
            <h3>Ready to Implement These Changes?</h3>
            <p>Let's schedule a 30-minute consultation to discuss how these recommendations can be tailored specifically to your organization.</p>
            <a href="https://calendly.com/jeremyestrella/30min" target="_blank">Schedule Your Free Consultation</a>
          </div>
          
          <p>These recommendations are just the beginning. Our comprehensive organizational alignment process can help you achieve even greater efficiencies and cost savings.</p>
          
          <p><strong>Next Steps:</strong></p>
          <ul>
            <li>Review the recommendations above</li>
            <li>Identify which quick wins you can implement immediately</li>
            <li>Schedule a consultation to discuss a comprehensive assessment</li>
          </ul>
          
          <p>Best regards,<br/>
          <strong>Jeremy Estrella</strong><br/>
          NorthPath Strategies<br/>
          info@northpathstrategies.org</p>
        </div>
        
        <div class="footer">
          <p>NorthPath Strategies - Organizational Alignment & Process Optimization</p>
          <p>If you no longer wish to receive these emails, please reply with "UNSUBSCRIBE"</p>
        </div>
      </body>
      </html>
    `;

    // Prepare email
    const msg = {
      to: email,
      from: fromEmail,
      subject: 'Your Quick Wins Assessment Results',
      html: htmlContent,
    };

    // Send email
    await sgMail.send(msg);

    console.log(`Quick Wins report sent successfully to ${email}`);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending Quick Wins report:', error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
