import React from "react";
import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  LineChart,
  FileText,
  Wallet,
  Users,
  Settings,
  X
} from "lucide-react";

interface SidebarProps {
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const [location] = useLocation();

  const isActive = (path: string) => {
    return location === path;
  };

  const sidebarLinks = [
    {
      name: "Tableau de Bord",
      path: "/",
      icon: <LayoutDashboard className="w-5 h-5 mr-3 text-gray-medium" />,
    },
    {
      name: "Situation Financière",
      path: "/financial-situation",
      icon: <LineChart className="w-5 h-5 mr-3 text-gray-medium" />,
    },
    {
      name: "Factures",
      path: "/invoices",
      icon: <FileText className="w-5 h-5 mr-3 text-gray-medium" />,
    },
    {
      name: "Décaissements",
      path: "/payments",
      icon: <Wallet className="w-5 h-5 mr-3 text-gray-medium" />,
    },
    {
      name: "Fournisseurs",
      path: "/suppliers",
      icon: <Users className="w-5 h-5 mr-3 text-gray-medium" />,
    },
    {
      name: "Paramètres",
      path: "/settings",
      icon: <Settings className="w-5 h-5 mr-3 text-gray-medium" />,
    },
  ];

  return (
    <div className="flex flex-col w-64 bg-sidebar border-r border-gray-light">
      <div className="flex items-center justify-between h-16 px-4 bg-sidebar border-b border-gray-light">
        <h1 className="text-lg font-semibold text-sidebar-foreground">FinancePro</h1>
        <button 
          className="p-1 rounded-full md:hidden text-gray-medium hover:bg-gray-light"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="flex flex-col flex-grow overflow-y-auto">
        <nav className="flex-1 px-2 py-4 space-y-1">
          {sidebarLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              onClick={onClose}
              className={`flex items-center px-2 py-2 text-sm font-medium rounded-md sidebar-link ${
                isActive(link.path)
                  ? "active text-sidebar-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent"
              }`}
            >
              {link.icon}
              {link.name}
            </Link>
          ))}
        </nav>
      </div>
      <div className="p-4 border-t border-gray-light">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-semibold">
            TD
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-sidebar-foreground">Thomas Durand</p>
            <p className="text-xs text-gray-medium">Administrateur</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
