import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import {
  Check,
  Plus,
  Wallet,
  AlertTriangle,
} from "lucide-react";

interface Activity {
  id: number;
  userId: number;
  action: string;
  resourceType: string;
  resourceId: number | null;
  timestamp: string;
  details: string;
}

interface User {
  id: number;
  username: string;
  fullName: string;
  role: string;
}

const RecentActivities: React.FC = () => {
  const { data: activities, isLoading } = useQuery({
    queryKey: ["/api/activities"],
    queryFn: async ({ queryKey }) => {
      const res = await fetch(`${queryKey[0]}?limit=4`, {
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error("Failed to fetch activities");
      }
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <div className="mt-8 overflow-hidden bg-white shadow sm:rounded-lg animate-pulse">
        <div className="px-6 py-5 border-b border-gray-light">
          <div className="h-6 w-1/3 bg-gray-200 rounded"></div>
        </div>
        <div className="p-6">
          <ul className="space-y-4">
            {[...Array(4)].map((_, index) => (
              <li key={index} className="flex space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                </div>
                <div className="w-full">
                  <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                  <div className="h-3 w-1/4 bg-gray-200 rounded mt-2"></div>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-6 text-center">
            <div className="h-4 w-1/3 bg-gray-200 rounded mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  const getActivityIcon = (action: string, resourceType: string) => {
    if (action === "validate" || action === "payment") {
      return (
        <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
          <Check className="w-5 h-5 text-green-600" />
        </div>
      );
    } else if (action === "create") {
      return (
        <div className="flex items-center justify-center w-8 h-8 bg-primary-light rounded-full">
          <Plus className="w-5 h-5 text-primary-dark" />
        </div>
      );
    } else if (action === "payment") {
      return (
        <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
          <Wallet className="w-5 h-5 text-blue-600" />
        </div>
      );
    } else {
      return (
        <div className="flex items-center justify-center w-8 h-8 bg-yellow-100 rounded-full">
          <AlertTriangle className="w-5 h-5 text-yellow-600" />
        </div>
      );
    }
  };

  const formatRelativeTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return "Il y a quelques secondes";
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `Il y a ${minutes} minute${minutes > 1 ? "s" : ""}`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `Il y a ${hours} heure${hours > 1 ? "s" : ""}`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `Il y a ${days} jour${days > 1 ? "s" : ""}`;
    }
  };

  return (
    <div className="mt-8 overflow-hidden bg-white shadow sm:rounded-lg">
      <div className="px-6 py-5 border-b border-gray-light">
        <h3 className="text-lg font-medium leading-6 text-gray-dark">
          Activités récentes
        </h3>
      </div>
      <div className="p-6">
        <ul className="space-y-4">
          {activities.map((activity: Activity) => (
            <li key={activity.id} className="flex space-x-3">
              <div className="flex-shrink-0">
                {getActivityIcon(activity.action, activity.resourceType)}
              </div>
              <div>
                <p className="text-sm text-gray-dark">
                  <span className="font-medium">Thomas Durand</span>{" "}
                  {activity.details}
                </p>
                <p className="text-xs text-gray-medium">
                  {formatRelativeTime(activity.timestamp)}
                </p>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-6 text-center">
          <Link
            href="/activities"
            className="text-sm font-medium text-primary hover:text-primary-dark"
          >
            Voir toutes les activités →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RecentActivities;
