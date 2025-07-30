'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Menu, X, Building } from 'lucide-react'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
              <Building className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">NorthPath</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/assessment/tier-based" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Assessment
            </Link>
            <Link href="/pricing" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Pricing
            </Link>
            <Link href="/demo" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Demo
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Contact
            </Link>
            <Link href="/assessment/tier-based">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg shadow-lg">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <Link 
                href="/assessment/tier-based" 
                className="text-gray-700 hover:text-blue-600 font-medium py-2 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Assessment
              </Link>
              <Link 
                href="/pricing" 
                className="text-gray-700 hover:text-blue-600 font-medium py-2 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Pricing
              </Link>
              <Link 
                href="/demo" 
                className="text-gray-700 hover:text-blue-600 font-medium py-2 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Demo
              </Link>
              <Link 
                href="/about" 
                className="text-gray-700 hover:text-blue-600 font-medium py-2 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                About
              </Link>
              <Link 
                href="/contact" 
                className="text-gray-700 hover:text-blue-600 font-medium py-2 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Contact
              </Link>
              <Link href="/assessment/tier-based" onClick={() => setIsOpen(false)}>
                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-lg shadow-lg mt-4">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
