// lib/socket-server.ts
import { Server as HTTPServer } from 'http';
import { Socket, Server } from 'socket.io';
import { authenticateSocket } from './socket-middleware';
import { initAnalyticsTracking } from './analytics-events';
import { EventEmitter } from 'events';

// Socket Server class with EventEmitter for analytics tracking
export class SocketServer extends EventEmitter {
  io: Server;
  
  constructor(io: Server) {
    super();
    this.io = io;
  }
}

// Setup function for initializing the socket server
export function setupSocketServer(io: Server): SocketServer {
  const socketServer = new SocketServer(io);
  
  // Initialize analytics tracking
  initAnalyticsTracking(socketServer);
  
  return socketServer;
}

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AssessmentUser {
  userId: string;
  email: string;
  name?: string;
  avatarUrl?: string;
  lastActive: Date;
  status: 'active' | 'idle' | 'offline';
  cursor?: { x: number; y: number; section?: string };
}

// Track active users by assessment
const activeAssessments = new Map<string, Map<string, AssessmentUser>>();

// Track socket to user mapping
const socketToUser = new Map<string, { userId: string, assessmentId: string }>();

// Global instance
let socketServer: SocketServer;

export function initSocketServer(server: HTTPServer) {
  const io = new Server(server, {
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL || 'https://app.northpathstrategies.org',
      methods: ['GET', 'POST'],
      credentials: true,
    },
    path: '/api/socket',
  });

  // Authentication middleware
  io.use(authenticateSocket);

  io.on('connection', (socket: Socket) => {
    console.log('New client connected:', socket.id);
    
    // Handle user joining an assessment
    socket.on('join-assessment', ({ assessmentId, user }: { assessmentId: string, user: User }) => {
      console.log(`User ${user.email} joined assessment ${assessmentId}`);
      
      // Add socket to room for this assessment
      socket.join(`assessment:${assessmentId}`);
      
      // Track user in this assessment
      if (!activeAssessments.has(assessmentId)) {
        activeAssessments.set(assessmentId, new Map());
      }
      
      const assessmentUsers = activeAssessments.get(assessmentId)!;
      assessmentUsers.set(user.id, {
        userId: user.id,
        email: user.email,
        name: user.name,
        lastActive: new Date(),
        status: 'active',
      });
      
      // Store socket to user mapping for disconnect handling
      socketToUser.set(socket.id, { userId: user.id, assessmentId });
      
      // Notify all users in the assessment about the new user
      io.to(`assessment:${assessmentId}`).emit('user-joined', {
        userId: user.id,
        email: user.email,
        name: user.name,
        status: 'active',
      });
      
      // Send the current active users list to the newly joined user
      const activeUsers = Array.from(assessmentUsers.values());
      socket.emit('active-users', activeUsers);
    });
    
    // Handle user leaving an assessment
    socket.on('leave-assessment', ({ assessmentId, userId }: { assessmentId: string, userId: string }) => {
      handleUserLeaving(socket.id, assessmentId, userId);
    });
    
    // Handle cursor movement for collaborative editing
    socket.on('cursor-move', ({ assessmentId, position, section }: { 
      assessmentId: string, 
      position: { x: number, y: number }, 
      section?: string 
    }) => {
      const userInfo = socketToUser.get(socket.id);
      if (!userInfo) return;
      
      const { userId } = userInfo;
      const users = activeAssessments.get(assessmentId);
      if (!users) return;
      
      const user = users.get(userId);
      if (!user) return;
      
      // Update user cursor position
      user.cursor = { x: position.x, y: position.y, section };
      user.lastActive = new Date();
      users.set(userId, user);
      
      // Broadcast cursor position to other users in the assessment
      socket.to(`assessment:${assessmentId}`).emit('cursor-update', {
        userId,
        email: user.email,
        name: user.name,
        cursor: user.cursor,
      });
    });
    
    // Handle user status updates
    socket.on('status-change', ({ assessmentId, status }: { assessmentId: string, status: 'active' | 'idle' }) => {
      const userInfo = socketToUser.get(socket.id);
      if (!userInfo) return;
      
      const { userId } = userInfo;
      const users = activeAssessments.get(assessmentId);
      if (!users) return;
      
      const user = users.get(userId);
      if (!user) return;
      
      // Update user status
      user.status = status;
      user.lastActive = new Date();
      users.set(userId, user);
      
      // Broadcast status update to other users in the assessment
      socket.to(`assessment:${assessmentId}`).emit('user-status-change', {
        userId,
        status,
      });
    });
    
    // Handle real-time comment creation
    socket.on('comment-add', ({ assessmentId, comment }: { assessmentId: string, comment: any }) => {
      // Broadcast the new comment to all users in the assessment
      io.to(`assessment:${assessmentId}`).emit('comment-added', comment);
    });
    
    // Handle real-time assessment edits
    socket.on('assessment-edit', async ({ assessmentId, section, data, version }: { 
      assessmentId: string, 
      section: string, 
      data: any,
      version: number
    }) => {
      const userInfo = socketToUser.get(socket.id);
      if (!userInfo) return;
      
      const { userId } = userInfo;
      
      try {
        // Store the edit in the database for persistence
        // This is a simplified version - in production you'd want to handle conflicts
        const timestamp = new Date().toISOString();
        
        // Update the assessment version in the database
        // This would typically be done through a database transaction
        // to ensure data consistency
        
        // Broadcast the edit to all users in the assessment
        io.to(`assessment:${assessmentId}`).emit('assessment-edited', {
          userId,
          section,
          data,
          version,
          timestamp,
          editor: socket.data.user ? {
            id: socket.data.user.id,
            email: socket.data.user.email,
            name: socket.data.user.user_metadata?.name
          } : undefined
        });
      } catch (error) {
        console.error('Error saving assessment edit:', error);
        socket.emit('edit-error', { 
          message: 'Failed to save edit',
          section,
          timestamp: new Date().toISOString()
        });
      }
    });
    
    // Handle disconnections
    socket.on('disconnect', () => {
      const userInfo = socketToUser.get(socket.id);
      if (userInfo) {
        const { userId, assessmentId } = userInfo;
        handleUserLeaving(socket.id, assessmentId, userId);
      }
      console.log('Client disconnected:', socket.id);
    });
  });
  
  // Store globally for access in other parts of the app
  global.io = io;
  
  // Create socket server event emitter
  socketServer = new SocketServer(io);
  
  // Initialize analytics tracking
  initAnalyticsTracking(socketServer);

  console.log('Socket server initialized with analytics tracking');
  return io;
}

// Helper function to handle a user leaving
function handleUserLeaving(socketId: string, assessmentId: string, userId: string) {
  const users = activeAssessments.get(assessmentId);
  if (users) {
    users.delete(userId);
    if (users.size === 0) {
      activeAssessments.delete(assessmentId);
    }
  }
  
  socketToUser.delete(socketId);
  
  // Notify others that user has left
  const io = global.io;
  if (io) {
    io.to(`assessment:${assessmentId}`).emit('user-left', { userId });
  }
}

// For scheduled cleanups of idle users
setInterval(() => {
  const now = new Date();
  activeAssessments.forEach((users, assessmentId) => {
    users.forEach((user, userId) => {
      const idleTimeMs = now.getTime() - user.lastActive.getTime();
      
      // If user has been idle for more than 30 minutes, set them as offline
      if (idleTimeMs > 30 * 60 * 1000 && user.status !== 'offline') {
        user.status = 'offline';
        users.set(userId, user);
        
        // Notify users about status change
        const io = global.io;
        if (io) {
          io.to(`assessment:${assessmentId}`).emit('user-status-change', {
            userId,
            status: 'offline',
          });
        }
      } 
      // If idle for more than 5 minutes, set as idle
      else if (idleTimeMs > 5 * 60 * 1000 && user.status === 'active') {
        user.status = 'idle';
        users.set(userId, user);
        
        // Notify users about status change
        const io = global.io;
        if (io) {
          io.to(`assessment:${assessmentId}`).emit('user-status-change', {
            userId,
            status: 'idle',
          });
        }
      }
    });
  });
}, 60 * 1000); // Check every minute
