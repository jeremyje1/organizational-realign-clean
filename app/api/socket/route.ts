// app/api/socket/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Server as ServerIO } from "socket.io";
import { authenticateSocket } from '@/lib/socket-middleware';
import { EventEmitter } from 'events';

// For WebSocket support with Vercel
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

// Define class and types in a separate module to avoid Next.js route validation issues
// import { setupSocketServer, SocketServer } from '@/lib/socket-server';

// Define global types
declare global {
  var serverIo: any;
  var socketServer: EventEmitter;
}

export async function GET(_request: NextRequest) {
  if (!global.serverIo) {
    // Create Socket.IO server if it doesn't exist yet
    const io = new ServerIO({
      cors: {
        origin: process.env.NEXT_PUBLIC_APP_URL || 'https://app.northpathstrategies.org',
        methods: ['GET', 'POST'],
        credentials: true,
      },
      path: '/api/socket',
      addTrailingSlash: false,
      connectionStateRecovery: {
        maxDisconnectionDuration: 2 * 60 * 1000, // 2 minutes
      },
    });

    // Use authentication middleware
    io.use(authenticateSocket);

    // Set up socket connection handlers (simplified version)
    io.on('connection', (socket) => {
      console.log('New client connected:', socket.id);
      
      // Set up event handlers
      socket.on('join-assessment', (data) => {
        const { assessmentId, user } = data;
        socket.join(`assessment:${assessmentId}`);
        
        // Notify others
        io.to(`assessment:${assessmentId}`).emit('user-joined', {
          userId: user.id,
          email: user.email,
          name: user.name,
          status: 'active',
        });
      });
      
      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });

    // Store globally
    global.serverIo = io;
    
    // Create socket server event emitter for analytics
    // const socketServer = new SocketServer(io);
    // global.socketServer = socketServer;
    
    // Initialize analytics tracking
    // initAnalyticsTracking(socketServer);
    
    console.log('Socket.IO server initialized');
  }

  return new Response('Socket.IO server running', {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }
  });
}

export async function POST() {
  return NextResponse.json({ status: 'WebSocket server is running' });
}

// Handle preflight requests
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }
  });
}
