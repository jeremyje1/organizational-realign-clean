import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About - NorthPath Strategies',
  description: 'Learn about NorthPath Strategies and our mission to transform organizations through AI-powered insights and strategic realignment.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            About NorthPath Strategies
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Transforming organizations through AI-powered insights and strategic realignment
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed">
              We help organizations navigate complex transformations by providing data-driven insights, 
              strategic guidance, and innovative solutions that align teams, processes, and technology 
              for sustainable growth and success.
            </p>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Approach</h2>
            <p className="text-gray-600 leading-relaxed">
              Using proprietary algorithms and AI-powered analytics, we deliver personalized 
              assessments and actionable recommendations that drive real organizational change 
              and measurable results.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-8 shadow-lg mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Why Choose NorthPath?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Data-Driven</h3>
              <p className="text-gray-600">Advanced analytics and AI insights</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Targeted</h3>
              <p className="text-gray-600">Industry-specific solutions</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Proven</h3>
              <p className="text-gray-600">Measurable results and ROI</p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to Transform?</h2>
          <p className="text-lg text-gray-600 mb-8">
            Start your organizational realignment journey today
          </p>
          <div className="space-x-4">
            <a 
              href="/assessment/start" 
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-block"
            >
              Start Assessment
            </a>
            <a 
              href="/contact" 
              className="bg-gray-100 text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors inline-block"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
