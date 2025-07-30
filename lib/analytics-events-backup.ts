// lib/analytics-events.ts
import { trackCollaborationEvent } from './collaboration-tracker';
import { SocketServer } from './socket-server';

/**
 * Initializes analytics tracking for real-time collaboration events
 */
export function initAnalyticsTracking(socketServer: SocketServer) {
  // Track user presence changes
  socketServer.on('userJoined', async (data) => {
    if (!data.userId) return;
    
    await trackCollaborationEvent(
      data.userId,
      'VIEW',
      data.section || 'General'
    );
  });

  // Track document edits
  socketServer.on('documentEdit', async (data) => {
    if (!data.userId) return;
    
    await trackCollaborationEvent(
      data.userId,
      'EDIT',
      data.section || 'General'
    );
  });

  // Track comments
  socketServer.on('commentAdded', async (data) => {
    if (!data.userId) return;
    
    await trackCollaborationEvent(
      data.userId,
      'COMMENT',
      data.section || 'General'
    );
  });

  // Track active viewing time
  socketServer.on('userActivity', async (data) => {
    if (!data.userId || data.type !== 'active') return;
    
    await trackCollaborationEvent(
      data.userId,
      'VIEW',
      data.section || 'General'
    );
  });

  console.log('Analytics tracking initialized for real-time collaboration events');
}
