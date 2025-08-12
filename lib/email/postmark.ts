// lib/email/postmark.ts
import { ServerClient } from 'postmark';

const pmToken = process.env.POSTMARK_API_TOKEN!;
const FROM = process.env.FROM_EMAIL!;
const REPLY_TO = process.env.REPLY_TO_EMAIL || process.env.FROM_EMAIL!;

// Optional: per-app stream; set in env: POSTMARK_MESSAGE_STREAM=realign-transactional|mapmystandards-transactional|aiblueprint-transactional
const MESSAGE_STREAM = process.env.POSTMARK_MESSAGE_STREAM;

if (!pmToken || !FROM) {
  // Don’t hard crash at import-time in serverless, but do log loudly
  console.warn('Postmark env vars missing: POSTMARK_API_TOKEN and/or FROM_EMAIL');
}

const pm = pmToken ? new ServerClient(pmToken) : null;

export async function sendEmail({
  to,
  subject,
  html,
  text,
  tag,
}: {
  to: string;
  subject: string;
  html: string;
  text?: string;
  tag?: string;
}) {
  if (!pm) throw new Error('Postmark not configured');
  return pm.sendEmail({
    From: FROM,
    To: to,
    ReplyTo: REPLY_TO,
    Subject: subject,
    HtmlBody: html,
    TextBody: text,
    Tag: tag, // helpful for per-app analytics if you use one server token
    MessageStream: MESSAGE_STREAM, // set per-app for clean stream analytics
  });
}
