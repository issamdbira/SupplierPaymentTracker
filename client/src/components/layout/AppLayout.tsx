import React, { useState } from "react";
import Sidebar from "./Sidebar";
import TopNav from "./TopNav";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar for desktop (always visible) and mobile (toggleable) */}
      <div
        className={`${
          isSidebarOpen ? "block" : "hidden"
        } md:flex md:flex-shrink-0 z-20 absolute md:relative w-full md:w-auto h-full`}
      >
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 w-0 overflow-hidden">
        {/* Top Navigation */}
        <TopNav onMenuClick={toggleSidebar} />

        {/* Page Content */}
        <main className="relative flex-1 overflow-y-auto focus:outline-none">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
