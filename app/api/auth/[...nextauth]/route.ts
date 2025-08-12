import NextAuth, { NextAuthOptions } from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import { sendEmail } from '@/lib/email/postmark';
import { prisma } from '@/lib/prisma';

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000';

export const authOptions: NextAuthOptions = {
  providers: [
    EmailProvider({
      async sendVerificationRequest({ identifier, url }) {
        const signInUrl = url;
        await sendEmail({
          to: identifier,
          subject: 'Your secure sign-in link',
          html: `
            <p style="font:14px/1.5 -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">Click the button to sign in:</p>
            <p><a href="${signInUrl}" style="display:inline-block;padding:10px 16px;border-radius:6px;background:#1f2937;color:#ffffff;font-weight:600;text-decoration:none;">Sign in</a></p>
            <p style="font:13px/1.5 -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">Or paste this URL in your browser:<br><span style="word-break:break-all;">${signInUrl}</span></p>
            <p style="font:12px/1.5 -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#555;">If you did not request this email you can safely ignore it.</p>
          `,
          text: `Sign in: ${signInUrl}\n\nIf you did not request this email you can ignore it.`,
          tag: 'magic-link',
        });
      },
      from: process.env.FROM_EMAIL,
      maxAge: 60 * 30,
    })
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user }) {
      if (user && (user as any).id) token.id = (user as any).id;
      // Enrich tier & features from database if missing on token
      if (!token.tier && token.id) {
        try {
          const dbUser: any = await prisma.user.findUnique({ where: { id: token.id as string } });
          if (dbUser) {
            token.tier = dbUser.tier || 'basic';
            token.features = dbUser.features || {};
          }
        } catch (e) {
          console.error('Tier enrichment failed', e);
        }
      }
      if (user) {
        token.tier = (user as any).tier || token.tier || 'basic';
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id as string;
        if (token.tier) (session.user as any).tier = token.tier;
        if ((token as any).features) (session.user as any).features = (token as any).features;
      }
      return session;
    }
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
