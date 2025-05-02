import { NextRequest, NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages array' }, { status: 400 });
    }

    const emailMessages = messages.map((msg: any) => ({
      to: msg.email,
      from: 'pruthviraj@techonsy.com',
      subject: msg.subject || 'Job Opportunity',
      text: `Hello,\n\n${msg.draft}`,
      html: `<p>${msg.draft.replace(/\n/g, '<br>')}</p>`
    }));

    await sgMail.send(emailMessages);
    return NextResponse.json({ success: true, message: 'Emails sent successfully' });
  } catch (error: any) {
    console.error('SendGrid Error:', error.response?.body || error.message);
    return NextResponse.json({ error: 'Failed to send emails' }, { status: 500 });
  }
}
