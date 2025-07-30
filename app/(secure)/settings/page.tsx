'use client';

import React, { useState } from 'react';
import { 
  UserCircleIcon, 
  BellIcon, 
  ShieldCheckIcon, 
  DocumentTextIcon,
  UserGroupIcon,
  CloudArrowUpIcon,
  TrashIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [settings, setSettings] = useState({
    profile: {
      name: '',
      email: '',
      organization: '',
      role: '',
      phone: '',
      timezone: 'UTC'
    },
    notifications: {
      emailAlerts: true,
      assessmentReminders: true,
      teamUpdates: true,
      reportReady: true,
      marketingEmails: false
    },
    privacy: {
      shareAnalytics: true,
      allowTeamAccess: true,
      dataRetention: '90',
      anonymizeReports: false
    },
    assessment: {
      autoSave: true,
      autoSaveInterval: '30',
      sessionTimeout: '14',
      requireCompletion: false,
      allowPartialSubmission: true
    },
    team: {
      defaultRole: 'viewer',
      approvalRequired: true,
      maxMembers: '10',
      inviteExpiry: '7'
    }
  });

  const tabs = [
    { id: 'profile', name: 'Profile', icon: UserCircleIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'privacy', name: 'Privacy & Security', icon: ShieldCheckIcon },
    { id: 'assessment', name: 'Assessment Settings', icon: DocumentTextIcon },
    { id: 'team', name: 'Team Management', icon: UserGroupIcon },
    { id: 'data', name: 'Data Management', icon: CloudArrowUpIcon }
  ];

  const handleSettingChange = (category, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
  };

  const handleSave = async () => {
    // Implementation would save to backend
    console.log('Saving settings:', settings);
    alert('Settings saved successfully!');
  };

  const handleExportData = () => {
    // Implementation would export user data
    alert('Data export initiated. You will receive an email with your data within 24 hours.');
  };

  const handleDeleteAccount = () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // Implementation would delete account
      alert('Account deletion initiated. You will receive a confirmation email.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-b border-gray-200 pb-6">
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="mt-2 text-sm text-gray-600">
              Manage your account, privacy, and assessment preferences
            </p>
          </div>

          <div className="mt-6 lg:grid lg:grid-cols-12 lg:gap-x-8">
            {/* Navigation */}
            <div className="lg:col-span-3">
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                        activeTab === tab.id
                          ? 'bg-blue-100 text-blue-700 border-blue-500'
                          : 'text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="flex-shrink-0 -ml-1 mr-3 h-5 w-5" />
                      {tab.name}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Content */}
            <div className="mt-6 lg:mt-0 lg:col-span-9">
              <div className="bg-white shadow sm:rounded-lg">
                
                {/* Profile Settings */}
                {activeTab === 'profile' && (
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-6">Profile Information</h3>
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Full Name</label>
                          <input
                            type="text"
                            value={settings.profile.name}
                            onChange={(e) => handleSettingChange('profile', 'name', e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter your full name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Email Address</label>
                          <input
                            type="email"
                            value={settings.profile.email}
                            onChange={(e) => handleSettingChange('profile', 'email', e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            placeholder="your.email@organization.edu"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Organization</label>
                          <input
                            type="text"
                            value={settings.profile.organization}
                            onChange={(e) => handleSettingChange('profile', 'organization', e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            placeholder="University or Organization Name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Role/Title</label>
                          <input
                            type="text"
                            value={settings.profile.role}
                            onChange={(e) => handleSettingChange('profile', 'role', e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            placeholder="e.g., Director of Institutional Research"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                          <input
                            type="tel"
                            value={settings.profile.phone}
                            onChange={(e) => handleSettingChange('profile', 'phone', e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            placeholder="(555) 123-4567"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Timezone</label>
                          <select
                            value={settings.profile.timezone}
                            onChange={(e) => handleSettingChange('profile', 'timezone', e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="UTC">UTC</option>
                            <option value="America/New_York">Eastern Time</option>
                            <option value="America/Chicago">Central Time</option>
                            <option value="America/Denver">Mountain Time</option>
                            <option value="America/Los_Angeles">Pacific Time</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Notification Settings */}
                {activeTab === 'notifications' && (
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-6">Notification Preferences</h3>
                    <div className="space-y-6">
                      {Object.entries(settings.notifications).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="text-sm font-medium text-gray-900 capitalize">
                              {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {key === 'emailAlerts' && 'Receive email notifications for important updates'}
                              {key === 'assessmentReminders' && 'Get reminders about incomplete assessments'}
                              {key === 'teamUpdates' && 'Notifications when team members complete sections'}
                              {key === 'reportReady' && 'Alert when your assessment report is ready'}
                              {key === 'marketingEmails' && 'Receive product updates and feature announcements'}
                            </p>
                          </div>
                          <div className="ml-4">
                            <input
                              type="checkbox"
                              checked={value}
                              onChange={(e) => handleSettingChange('notifications', key, e.target.checked)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Privacy & Security */}
                {activeTab === 'privacy' && (
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-6">Privacy & Security Settings</h3>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-900">Share Anonymous Analytics</h4>
                          <p className="text-sm text-gray-500">Help improve the tool by sharing anonymized usage data</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.privacy.shareAnalytics}
                          onChange={(e) => handleSettingChange('privacy', 'shareAnalytics', e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-900">Allow Team Access</h4>
                          <p className="text-sm text-gray-500">Let team members view and collaborate on assessments</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.privacy.allowTeamAccess}
                          onChange={(e) => handleSettingChange('privacy', 'allowTeamAccess', e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Data Retention (days)</label>
                        <select
                          value={settings.privacy.dataRetention}
                          onChange={(e) => handleSettingChange('privacy', 'dataRetention', e.target.value)}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="30">30 days</option>
                          <option value="90">90 days</option>
                          <option value="180">180 days</option>
                          <option value="365">1 year</option>
                          <option value="indefinite">Indefinite</option>
                        </select>
                        <p className="mt-1 text-sm text-gray-500">How long to keep your assessment data after completion</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Assessment Settings */}
                {activeTab === 'assessment' && (
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-6">Assessment Preferences</h3>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-900">Auto-Save</h4>
                          <p className="text-sm text-gray-500">Automatically save progress as you work</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.assessment.autoSave}
                          onChange={(e) => handleSettingChange('assessment', 'autoSave', e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Auto-Save Interval (seconds)</label>
                        <select
                          value={settings.assessment.autoSaveInterval}
                          onChange={(e) => handleSettingChange('assessment', 'autoSaveInterval', e.target.value)}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="15">15 seconds</option>
                          <option value="30">30 seconds</option>
                          <option value="60">1 minute</option>
                          <option value="120">2 minutes</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Session Timeout (days)</label>
                        <select
                          value={settings.assessment.sessionTimeout}
                          onChange={(e) => handleSettingChange('assessment', 'sessionTimeout', e.target.value)}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="7">7 days</option>
                          <option value="14">14 days</option>
                          <option value="30">30 days</option>
                          <option value="60">60 days</option>
                        </select>
                        <p className="mt-1 text-sm text-gray-500">How long before an assessment session expires</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-900">Allow Partial Submission</h4>
                          <p className="text-sm text-gray-500">Submit assessments even if not all sections are complete</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.assessment.allowPartialSubmission}
                          onChange={(e) => handleSettingChange('assessment', 'allowPartialSubmission', e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Team Management */}
                {activeTab === 'team' && (
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-6">Team Management Settings</h3>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Default Role for New Members</label>
                        <select
                          value={settings.team.defaultRole}
                          onChange={(e) => handleSettingChange('team', 'defaultRole', e.target.value)}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="viewer">Viewer - Can view assessments and reports</option>
                          <option value="contributor">Contributor - Can edit assigned sections</option>
                          <option value="admin">Admin - Full access to all features</option>
                        </select>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-900">Require Approval for New Members</h4>
                          <p className="text-sm text-gray-500">New team members need approval before accessing assessments</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.team.approvalRequired}
                          onChange={(e) => handleSettingChange('team', 'approvalRequired', e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Maximum Team Members</label>
                        <select
                          value={settings.team.maxMembers}
                          onChange={(e) => handleSettingChange('team', 'maxMembers', e.target.value)}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="5">5 members</option>
                          <option value="10">10 members</option>
                          <option value="25">25 members</option>
                          <option value="50">50 members</option>
                          <option value="unlimited">Unlimited</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Invitation Expiry (days)</label>
                        <select
                          value={settings.team.inviteExpiry}
                          onChange={(e) => handleSettingChange('team', 'inviteExpiry', e.target.value)}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="3">3 days</option>
                          <option value="7">7 days</option>
                          <option value="14">14 days</option>
                          <option value="30">30 days</option>
                        </select>
                        <p className="mt-1 text-sm text-gray-500">How long team invitations remain valid</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Data Management */}
                {activeTab === 'data' && (
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-6">Data Management</h3>
                    <div className="space-y-6">
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Export Your Data</h4>
                        <p className="text-sm text-gray-500 mb-4">
                          Download all your assessment data, reports, and profile information in a portable format.
                        </p>
                        <button
                          onClick={handleExportData}
                          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <CloudArrowUpIcon className="-ml-0.5 mr-2 h-4 w-4" />
                          Export Data
                        </button>
                      </div>
                      
                      <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                        <div className="flex">
                          <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
                          <div className="ml-3">
                            <h4 className="text-sm font-medium text-red-800 mb-2">Danger Zone</h4>
                            <p className="text-sm text-red-700 mb-4">
                              Once you delete your account, there is no going back. This action cannot be undone.
                            </p>
                            <button
                              onClick={handleDeleteAccount}
                              className="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                              <TrashIcon className="-ml-0.5 mr-2 h-4 w-4" />
                              Delete Account
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Save Button */}
                <div className="px-4 py-3 bg-gray-50 text-right sm:px-6 rounded-b-lg">
                  <button
                    onClick={handleSave}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}