import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { LeftSidebar } from '../components/LeftSidebar';
import { RightSidebar } from '../components/RightSidebar';
import { DemoModeBanner } from '../components/DemoModeBanner';
import { X } from 'lucide-react';

export const MainLayout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFBFA] dark:bg-[#121316] text-[#191C21] dark:text-[#F1F3F7] transition-colors">
      <DemoModeBanner />
      <Navbar onToggleMobileMenu={() => setMobileMenuOpen(prev => !prev)} />

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-72 max-w-[80vw] bg-white dark:bg-card-dark h-full shadow-2xl flex flex-col z-10 animate-slideRight">
            <div className="p-4 border-b border-border-light dark:border-border-dark flex items-center justify-between">
              <span className="font-serif font-bold text-lg">Menu</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-lg text-charcoal-muted hover:text-charcoal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <LeftSidebar onCloseMobile={() => setMobileMenuOpen(false)} />
            </div>
          </div>
        </div>
      )}

      {/* 3-Column Desktop Layout */}
      <div className="max-w-7xl mx-auto w-full flex-1 flex px-0 sm:px-4 lg:px-8">
        {/* Left Sidebar */}
        <div className="hidden lg:block flex-shrink-0">
          <LeftSidebar />
        </div>

        {/* Center Main Content Area */}
        <main className="flex-1 min-w-0 py-6 px-4 sm:px-6 lg:px-8">
          <Outlet />
        </main>

        {/* Right Sidebar */}
        <div className="flex-shrink-0">
          <RightSidebar />
        </div>
      </div>
    </div>
  );
};
