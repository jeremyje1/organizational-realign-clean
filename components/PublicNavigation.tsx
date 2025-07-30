import React from 'react';

// Placeholder PublicNavigation component
// This was referenced in multiple files but the component was missing
export default function PublicNavigation() {
  return (
    <nav className="w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <a href="/" className="text-xl font-bold text-gray-900">
              NorthPath Strategies
            </a>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="/" className="text-gray-700 hover:text-gray-900 transition-colors">
              Home
            </a>
            <a href="/services" className="text-gray-700 hover:text-gray-900 transition-colors">
              Services
            </a>
            <a href="/methodology" className="text-gray-700 hover:text-gray-900 transition-colors">
              Methodology
            </a>
            <a href="/case-studies" className="text-gray-700 hover:text-gray-900 transition-colors">
              Case Studies
            </a>
            <a href="/contact" className="text-gray-700 hover:text-gray-900 transition-colors">
              Contact
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
