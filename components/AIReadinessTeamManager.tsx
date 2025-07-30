"use client";

import React, { useState } from 'react';
import { Users, Plus, X, Mail, User, Shield, Clock, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Team member interface for AI readiness assessments
 */
interface AIReadinessTeamMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'contributor' | 'viewer';
  status: 'invited' | 'active' | 'completed';
  progress: number;
  joinedAt: Date;
  lastActive?: Date;
}

/**
 * Props for AI Readiness Team Manager
 */
interface AIReadinessTeamManagerProps {
  teamMembers: AIReadinessTeamMember[];
  onAddMember: (member: Omit<AIReadinessTeamMember, 'id' | 'joinedAt' | 'status' | 'progress'>) => void;
  onRemoveMember: (memberId: string) => void;
  onUpdateMemberRole: (memberId: string, role: AIReadinessTeamMember['role']) => void;
  currentUserId?: string;
  maxMembers?: number;
  isTeamMode: boolean;
  onToggleTeamMode: (enabled: boolean) => void;
}

export function AIReadinessTeamManager({
  teamMembers,
  onAddMember,
  onRemoveMember,
  onUpdateMemberRole,
  currentUserId,
  maxMembers = 10,
  isTeamMode,
  onToggleTeamMode
}: AIReadinessTeamManagerProps) {
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState<AIReadinessTeamMember['role']>('contributor');

  const handleAddMember = () => {
    if (newMemberName.trim() && newMemberEmail.trim()) {
      onAddMember({
        name: newMemberName.trim(),
        email: newMemberEmail.trim(),
        role: newMemberRole,
        lastActive: new Date()
      });
      
      // Reset form
      setNewMemberName('');
      setNewMemberEmail('');
      setNewMemberRole('contributor');
      setShowAddMember(false);
    }
  };

  const getRoleIcon = (role: AIReadinessTeamMember['role']) => {
    switch (role) {
      case 'admin':
        return <Shield className="h-4 w-4 text-purple-400" />;
      case 'contributor':
        return <User className="h-4 w-4 text-blue-400" />;
      case 'viewer':
        return <User className="h-4 w-4 text-gray-400" />;
    }
  };

  const getRoleColor = (role: AIReadinessTeamMember['role']) => {
    switch (role) {
      case 'admin':
        return 'text-purple-300 bg-purple-500/20 border-purple-400/30';
      case 'contributor':
        return 'text-blue-300 bg-blue-500/20 border-blue-400/30';
      case 'viewer':
        return 'text-gray-300 bg-gray-500/20 border-gray-400/30';
    }
  };

  const getStatusIcon = (status: AIReadinessTeamMember['status']) => {
    switch (status) {
      case 'invited':
        return <Clock className="h-4 w-4 text-yellow-400" />;
      case 'active':
        return <User className="h-4 w-4 text-green-400" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-emerald-400" />;
    }
  };

  const getStatusColor = (status: AIReadinessTeamMember['status']) => {
    switch (status) {
      case 'invited':
        return 'text-yellow-300 bg-yellow-500/20';
      case 'active':
        return 'text-green-300 bg-green-500/20';
      case 'completed':
        return 'text-emerald-300 bg-emerald-500/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Team Mode Toggle */}
      <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg border border-slate-600/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
            <Users className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-100">Team Assessment</h3>
            <p className="text-sm text-slate-400">
              {isTeamMode ? 'Collaborative assessment enabled' : 'Individual assessment mode'}
            </p>
          </div>
        </div>
        <button
          onClick={() => onToggleTeamMode(!isTeamMode)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            isTeamMode ? 'bg-blue-600' : 'bg-slate-600'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              isTeamMode ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {/* Team Members List */}
      {isTeamMode && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold text-slate-100">
              Team Members ({teamMembers.length}/{maxMembers})
            </h4>
            {teamMembers.length < maxMembers && (
              <button
                onClick={() => setShowAddMember(true)}
                className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
              >
                <Plus className="h-4 w-4" />
                Add Member
              </button>
            )}
          </div>

          {/* Add Member Form */}
          <AnimatePresence>
            {showAddMember && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-4 bg-slate-700/50 rounded-lg border border-slate-600/50"
              >
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        value={newMemberName}
                        onChange={(e) => setNewMemberName(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Enter member name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={newMemberEmail}
                        onChange={(e) => setNewMemberEmail(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Enter email address"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Role
                    </label>
                    <select
                      value={newMemberRole}
                      onChange={(e) => setNewMemberRole(e.target.value as AIReadinessTeamMember['role'])}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                      <option value="contributor">Contributor - Can answer questions</option>
                      <option value="viewer">Viewer - Can view progress only</option>
                      <option value="admin">Admin - Full access and management</option>
                    </select>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={handleAddMember}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
                    >
                      Add Member
                    </button>
                    <button
                      onClick={() => setShowAddMember(false)}
                      className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Team Members */}
          <div className="space-y-3">
            {teamMembers.map((member) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/50 hover:bg-slate-700/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-600 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-slate-300" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-slate-100">{member.name}</p>
                        {member.id === currentUserId && (
                          <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full">
                            You
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <Mail className="h-3 w-3" />
                        {member.email}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Progress */}
                    <div className="text-right">
                      <p className="text-sm font-medium text-slate-200">
                        {Math.round(member.progress)}% complete
                      </p>
                      <div className="w-20 bg-slate-600/50 rounded-full h-2">
                        <div
                          className="bg-blue-400 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${member.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Status */}
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${getStatusColor(member.status)}`}>
                      {getStatusIcon(member.status)}
                      {member.status}
                    </div>

                    {/* Role */}
                    <select
                      value={member.role}
                      onChange={(e) => onUpdateMemberRole(member.id, e.target.value as AIReadinessTeamMember['role'])}
                      className={`px-2 py-1 rounded border text-xs ${getRoleColor(member.role)}`}
                      disabled={member.id === currentUserId}
                    >
                      <option value="admin">Admin</option>
                      <option value="contributor">Contributor</option>
                      <option value="viewer">Viewer</option>
                    </select>

                    {/* Remove Member */}
                    {member.id !== currentUserId && (
                      <button
                        onClick={() => onRemoveMember(member.id)}
                        className="p-1 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Last Active */}
                {member.lastActive && (
                  <div className="mt-2 text-xs text-slate-500">
                    Last active: {member.lastActive.toLocaleString()}
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Team Progress Summary */}
          {teamMembers.length > 0 && (
            <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/50">
              <h5 className="font-medium text-slate-200 mb-3">Team Progress Summary</h5>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-emerald-400">
                    {teamMembers.filter(m => m.status === 'completed').length}
                  </p>
                  <p className="text-sm text-slate-400">Completed</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-400">
                    {teamMembers.filter(m => m.status === 'active').length}
                  </p>
                  <p className="text-sm text-slate-400">In Progress</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-yellow-400">
                    {teamMembers.filter(m => m.status === 'invited').length}
                  </p>
                  <p className="text-sm text-slate-400">Pending</p>
                </div>
              </div>
              
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-300">Average Progress</span>
                  <span className="text-sm font-medium text-slate-200">
                    {Math.round(teamMembers.reduce((acc, m) => acc + m.progress, 0) / teamMembers.length)}%
                  </span>
                </div>
                <div className="bg-slate-600/30 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-400 to-indigo-500 h-2 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${teamMembers.reduce((acc, m) => acc + m.progress, 0) / teamMembers.length}%` 
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {teamMembers.length === 0 && (
            <div className="text-center p-8 bg-slate-700/20 rounded-lg border border-slate-600/30">
              <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-300 mb-2">No team members added yet</p>
              <p className="text-sm text-slate-400 mb-4">
                Add team members to collaborate on this AI readiness assessment
              </p>
              <button
                onClick={() => setShowAddMember(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Add Your First Member
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
