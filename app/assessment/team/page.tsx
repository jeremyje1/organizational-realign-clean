import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Team Access Management - NorthPath Strategies',
  description: 'Manage team access, roles, and collaboration permissions for your organizational assessments.',
};

export default function TeamAccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Team Access Management
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Manage team access, roles, and collaboration permissions for your organizational assessments
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Team Collaboration Features</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">👥 Team Management</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Invite team members via email</li>
                <li>• Assign roles and permissions</li>
                <li>• Track team progress</li>
                <li>• Real-time collaboration</li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">🔐 Access Control</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Role-based permissions</li>
                <li>• Secure assessment sharing</li>
                <li>• Activity monitoring</li>
                <li>• Data privacy controls</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Team Plans</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="border rounded-lg p-6 text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Individual</h3>
              <p className="text-3xl font-bold text-blue-600 mb-4">Free</p>
              <ul className="text-sm text-gray-600 space-y-2 mb-6">
                <li>• 1 user</li>
                <li>• Basic assessments</li>
                <li>• Standard reports</li>
              </ul>
              <button className="w-full bg-gray-100 text-gray-900 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors">
                Current Plan
              </button>
            </div>
            
            <div className="border-2 border-blue-500 rounded-lg p-6 text-center relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                Popular
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Team</h3>
              <p className="text-3xl font-bold text-blue-600 mb-4">$29/mo</p>
              <ul className="text-sm text-gray-600 space-y-2 mb-6">
                <li>• Up to 10 users</li>
                <li>• Advanced assessments</li>
                <li>• Team collaboration</li>
                <li>• Priority support</li>
              </ul>
              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                Upgrade to Team
              </button>
            </div>
            
            <div className="border rounded-lg p-6 text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Enterprise</h3>
              <p className="text-3xl font-bold text-blue-600 mb-4">Custom</p>
              <ul className="text-sm text-gray-600 space-y-2 mb-6">
                <li>• Unlimited users</li>
                <li>• Custom integrations</li>
                <li>• Advanced analytics</li>
                <li>• Dedicated support</li>
              </ul>
              <button className="w-full bg-gray-900 text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors">
                Contact Sales
              </button>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Enable Team Collaboration?</h2>
          <p className="text-gray-600 mb-6">
            Upgrade your plan to unlock team management features and start collaborating with your organization.
          </p>
          <div className="space-x-4">
            <a 
              href="/teams" 
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-block"
            >
              Manage Teams
            </a>
            <a 
              href="/assessment/start" 
              className="bg-gray-100 text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors inline-block"
            >
              Back to Assessment
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
