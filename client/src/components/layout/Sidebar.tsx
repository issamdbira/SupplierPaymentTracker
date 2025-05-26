import React from "react";
import { Link } from "wouter";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  Building,
  FileText,
  BarChart3,
  CreditCard,
  ArrowDownCircle,
  ArrowUpCircle,
  Wallet,
  Package,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const [location] = useLocation();

  const isActive = (path: string) => {
    return location === path;
  };

  const navItems = [
    {
      title: "Tableau de bord",
      href: "/",
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      title: "Fournisseurs",
      href: "/suppliers",
      icon: <Building className="h-5 w-5" />,
    },
    {
      title: "Clients",
      href: "/customers",
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: "Factures",
      href: "/invoices",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      title: "Décaissements",
      href: "/payments",
      icon: <ArrowDownCircle className="h-5 w-5" />,
    },
    {
      title: "Encaissements",
      href: "/receivables",
      icon: <ArrowUpCircle className="h-5 w-5" />,
    },
    {
      title: "Situation Financière",
      href: "/financial-situation",
      icon: <Wallet className="h-5 w-5" />,
    },
    {
      title: "Paramètres",
      href: "/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center justify-between border-b px-4">
            <Link href="/">
              <a className="flex items-center space-x-2">
                <CreditCard className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">FinancePro</span>
              </a>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="lg:hidden"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 py-4">
            <nav className="space-y-1 px-2">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <a
                    className={cn(
                      "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      isActive(item.href)
                        ? "bg-primary/10 text-primary"
                        : "text-gray-700 hover:bg-gray-100"
                    )}
                    onClick={() => {
                      if (window.innerWidth < 1024) {
                        onClose();
                      }
                    }}
                  >
                    {React.cloneElement(item.icon, {
                      className: cn(
                        "mr-3 h-5 w-5",
                        isActive(item.href)
                          ? "text-primary"
                          : "text-gray-500"
                      ),
                    })}
                    {item.title}
                  </a>
                </Link>
              ))}
            </nav>
          </ScrollArea>

          {/* Footer */}
          <div className="border-t p-4">
            <Button
              variant="outline"
              className="w-full justify-start text-gray-700"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Déconnexion
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
