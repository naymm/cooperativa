import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const colorVariants = {
  blue: "from-blue-500 to-blue-600",
  green: "from-green-500 to-green-600", 
  purple: "from-purple-500 to-purple-600",
  red: "from-red-500 to-red-600",
  teal: "from-teal-500 to-teal-600" // Nova cor
};

const iconTextColors = {
    blue: "text-blue-600",
    green: "text-green-600",
    purple: "text-purple-600",
    red: "text-red-600",
    teal: "text-teal-600"
}

export default function StatsCard({ title, value, subtitle, icon: Icon, color, loading }) {
  if (loading) {
    return (
      <Card className="relative overflow-hidden">
        <CardHeader className="pb-3">
          <Skeleton className="h-4 w-24" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-16 mb-2" />
          <Skeleton className="h-3 w-20" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-white to-slate-50">
      <div className={`absolute top-0 right-0 w-24 h-24 opacity-10 transform translate-x-6 -translate-y-6 rounded-full bg-gradient-to-r ${colorVariants[color]}`} />
      
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-slate-600 flex items-center justify-between">
          {title}
          <div className={`p-2 rounded-lg bg-gradient-to-r ${colorVariants[color]} bg-opacity-10`}>
            <Icon className={`w-4 h-4 ${iconTextColors[color]}`} />
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="text-2xl font-bold text-slate-800 mb-1">{value}</div>
        <p className="text-sm text-slate-500">{subtitle}</p>
      </CardContent>
    </Card>
  );
}