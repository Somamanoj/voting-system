import {
  MapPin,
  Phone,
  Mail,
  Linkedin,
  Twitter,
  Instagram,
  Shield,
  HelpCircle,
  Clock,
  Info
} from 'lucide-react';

export default function FooterSection() {
  return (
    <footer className="relative py-12 border-t border-gray-200">
      <div className="container mx-auto px-6 relative z-10">
        {/* Main Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Platform Info */}
          <div className="backdrop-blur-sm p-4 rounded-lg">
            <h3 className="text-2xl font-bold mb-6 text-gray-900">VoteSmart</h3>
            <p className="text-gray-800 mb-4">
              Empowering citizens with secure, accessible, and transparent online voting solutions.
            </p>
          </div>

          {/* Voting Resources */}
          <div className="backdrop-blur-sm p-4 rounded-lg">
            <h4 className="text-xl font-bold mb-6 text-gray-900">Voting Resources</h4>
            <ul className="space-y-4">
              <li className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-gray-600" />
                <a href="/voter-guide" className="text-gray-800 hover:text-gray-900 hover:translate-x-2 transition-all duration-300 inline-block">
                  Voter Guide
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <HelpCircle className="w-4 h-4 text-gray-600" />
                <a href="/faq" className="text-gray-800 hover:text-gray-900 hover:translate-x-2 transition-all duration-300 inline-block">
                  Voting FAQs
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <Info className="w-4 h-4 text-gray-600" />
                <a href="/election-info" className="text-gray-800 hover:text-gray-900 hover:translate-x-2 transition-all duration-300 inline-block">
                  Election Information
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="backdrop-blur-sm p-4 rounded-lg">
            <h4 className="text-xl font-bold mb-6 text-gray-900">Quick Links</h4>
            <ul className="space-y-4">
              <li className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-600" />
                <a href="/registration" className="text-gray-800 hover:text-gray-900 hover:translate-x-2 transition-all duration-300 inline-block">
                  Voter Registration
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-gray-600" />
                <a href="/security" className="text-gray-800 hover:text-gray-900 hover:translate-x-2 transition-all duration-300 inline-block">
                  Voting Security
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <Info className="w-4 h-4 text-gray-600" />
                <a href="/research" className="text-gray-800 hover:text-gray-900 hover:translate-x-2 transition-all duration-300 inline-block">
                  Research VoteSmart
                </a>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div className="backdrop-blur-sm p-4 rounded-lg">
            <h4 className="text-xl font-bold mb-6 text-gray-900">Connect With Us</h4>
            <div className="space-y-4">
              <a href="#" className="flex items-center space-x-3 text-gray-800 hover:text-gray-900 hover:translate-x-2 transition-all duration-300">
                <Linkedin className="w-5 h-5" />
                <span>LinkedIn</span>
              </a>
              <a href="#" className="flex items-center space-x-3 text-gray-800 hover:text-gray-900 hover:translate-x-2 transition-all duration-300">
                <Twitter className="w-5 h-5" />
                <span>Twitter</span>
              </a>
              <a href="#" className="flex items-center space-x-3 text-gray-800 hover:text-gray-900 hover:translate-x-2 transition-all duration-300">
                <Instagram className="w-5 h-5" />
                <span>Instagram</span>
              </a>
            </div>
          </div>
        </div>
        <div className="w-full">
          <div className="mt-8 py-6">
            <div className="container mx-auto px-4">
              {/* Desktop: Side by side layout, Mobile: Stacked layout */}
              <div className="flex flex-col lg:flex-row lg:justify-between">
                {/* Contact Info - Uses flex-wrap for mobile */}
                <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-800">National Voting Center</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-800">+1 800-VOTE-NOW</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-800">support@votesmart.gov</span>
                  </div>
                </div>

                {/* Transforming Text - Right side on desktop, below on mobile */}
                <div className="mt-6 lg:mt-0 text-center lg:text-right">
                  <p className="text-gray-800">Ensuring democratic participation through secure digital voting since 2022</p>
                </div>
              </div>
            </div>
          </div>

          {/* Copyright - Always at bottom */}
          <div className="py-4 text-center text-gray-800 border-t border-gray-200">
            <p>&copy; 2025 VoteSmart. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}