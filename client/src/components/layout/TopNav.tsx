import React from "react";
import { Menu, Bell } from "lucide-react";
import { Input } from "@/components/ui/input";

interface TopNavProps {
  onMenuClick: () => void;
}

const TopNav: React.FC<TopNavProps> = ({ onMenuClick }) => {
  return (
    <div className="relative z-10 flex flex-shrink-0 h-16 bg-white shadow">
      <button
        type="button"
        className="px-4 text-gray-medium border-r border-gray-light md:hidden"
        onClick={onMenuClick}
      >
        <Menu className="w-6 h-6" />
      </button>
      <div className="flex justify-between flex-1 px-4">
        <div className="flex flex-1">
          <div className="flex w-full md:ml-0">
            <div className="relative w-full text-gray-medium focus-within:text-gray-dark">
              <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                <svg
                  className="w-5 h-5 ml-3"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <Input
                id="search"
                className="block w-full h-full py-2 pl-10 pr-3 text-gray-dark bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white"
                placeholder="Rechercher..."
                type="search"
              />
            </div>
          </div>
        </div>
        <div className="flex items-center ml-4 md:ml-6">
          <button className="p-1 text-gray-medium rounded-full hover:text-gray-dark focus:outline-none focus:ring-2 focus:ring-primary">
            <Bell className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopNav;
