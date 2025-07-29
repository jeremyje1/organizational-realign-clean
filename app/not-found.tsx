// app/not-found.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Not Found - NorthPath Strategies',
  description: 'The page you are looking for does not exist or has been moved.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <main className="flex h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">404 – Page not found</h1>
      <p className="mt-2 text-muted-foreground">
        Sorry, we couldn’t find that page.
      </p>
    </main>
  );
}