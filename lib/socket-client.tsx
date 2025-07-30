// lib/socket-client.tsx
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useUser } from '@/hooks/useUser'; // Adjust the import based on your auth setup

// Socket.IO context types
interface SocketContextType {
  socket: Socket | null;
  connected: boolean;
  joinAssessment: (assessmentId: string) => void;
  leaveAssessment: (assessmentId: string) => void;
  sendCursorPosition: (assessmentId: string, position: { x: number; y: number }, section?: string) => void;
  sendStatusUpdate: (assessmentId: string, status: 'active' | 'idle') => void;
  sendComment: (assessmentId: string, comment: any) => void;
  sendEdit: (assessmentId: string, section: string, data: any) => void;
  activeUsers: any[];
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  connected: false,
  joinAssessment: () => {},
  leaveAssessment: () => {},
  sendCursorPosition: () => {},
  sendStatusUpdate: () => {},
  sendComment: () => {},
  sendEdit: () => {},
  activeUsers: [],
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState<boolean>(false);
  const [activeUsers, setActiveUsers] = useState<any[]>([]);
  const { user, session } = useUser(); // Adjust based on your auth setup

  useEffect(() => {
    // Only initialize socket if we have a user and auth token
    if (user && session?.access_token) {
      // First ensure the socket server is initialized
      fetch('/api/socket')
        .then(response => {
          if (!response.ok) {
            console.error('Failed to initialize socket server');
          }
        })
        .catch(error => {
          console.error('Error initializing socket server:', error);
        });
        
      // Connect to socket
      const socketInstance = io(
        window.location.origin,
        {
          path: '/api/socket',
          auth: {
            token: session.access_token,
          },
          withCredentials: true,
          transports: ['websocket', 'polling'],
          autoConnect: true,
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
        }
      );

      // Socket event listeners
      socketInstance.on('connect', () => {
        console.log('Socket connected');
        setConnected(true);
      });

      socketInstance.on('disconnect', () => {
        console.log('Socket disconnected');
        setConnected(false);
      });

      socketInstance.on('active-users', (users: any[]) => {
        setActiveUsers(users);
      });

      socketInstance.on('user-joined', (user: any) => {
        setActiveUsers(prev => [...prev, user]);
      });

      socketInstance.on('user-left', ({ userId }: { userId: string }) => {
        setActiveUsers(prev => prev.filter(user => user.userId !== userId));
      });

      socketInstance.on('user-status-change', ({ userId, status }: { userId: string; status: 'active' | 'idle' | 'offline' }) => {
        setActiveUsers(prev => 
          prev.map(user => 
            user.userId === userId ? { ...user, status } : user
          )
        );
      });

      setSocket(socketInstance);

      // Cleanup on unmount
      return () => {
        socketInstance.disconnect();
        setSocket(null);
        setConnected(false);
      };
    }
  }, [user, session?.access_token]);

  // Join an assessment room
  const joinAssessment = (assessmentId: string) => {
    if (socket && user) {
      socket.emit('join-assessment', { 
        assessmentId, 
        user: {
          id: user.id,
          email: user.email,
          name: user.user_metadata?.name || user.email,
        }
      });
    }
  };

  // Leave an assessment room
  const leaveAssessment = (assessmentId: string) => {
    if (socket && user) {
      socket.emit('leave-assessment', { 
        assessmentId, 
        userId: user.id 
      });
    }
  };

  // Send cursor position for collaborative editing
  const sendCursorPosition = (assessmentId: string, position: { x: number; y: number }, section?: string) => {
    if (socket) {
      socket.emit('cursor-move', { assessmentId, position, section });
    }
  };

  // Send user status update
  const sendStatusUpdate = (assessmentId: string, status: 'active' | 'idle') => {
    if (socket) {
      socket.emit('status-change', { assessmentId, status });
    }
  };

  // Send a new comment
  const sendComment = (assessmentId: string, comment: any) => {
    if (socket) {
      socket.emit('comment-add', { assessmentId, comment });
    }
  };

  // Send an edit to an assessment section
  const sendEdit = (assessmentId: string, section: string, data: any) => {
    if (socket) {
      socket.emit('assessment-edit', { assessmentId, section, data });
    }
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        connected,
        joinAssessment,
        leaveAssessment,
        sendCursorPosition,
        sendStatusUpdate,
        sendComment,
        sendEdit,
        activeUsers,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
