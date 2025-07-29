/* app/(secure)/workspaces/page.tsx */
'use client';
export const dynamic = 'force-dynamic';

import React from 'react';

// Placeholder component for removed TeamCollaboration
const TeamCollaboration = () => <div className="p-4 border rounded">Team Collaboration Component (Placeholder)</div>;

export default function WorkspacesPage() {
  return (
    <div className="container mx-auto py-8">
      <TeamCollaboration />
    </div>
  );
}
