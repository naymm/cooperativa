import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { MapPin } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const provinceData = [
  { name: "Luanda", count: 45, percentage: 40 },
  { name: "Benguela", count: 28, percentage: 25 },
  { name: "Huíla", count: 20, percentage: 18 },
  { name: "Huambo", count: 12, percentage: 11 },
  { name: "Outras", count: 7, percentage: 6 }
];

export default function ProvinceChart({ loading }) {
  if (loading) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent className="space-y-4">
          {Array(5).fill(0).map((_, i) => (
            <div key={i}>
              <div className="flex justify-between mb-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-8" />
              </div>
              <Skeleton className="h-2 w-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-slate-800 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-slate-600" />
          Cooperados por Província
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {provinceData.map((province, index) => (
          <div key={province.name}>
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-slate-700">{province.name}</span>
              <span className="text-sm text-slate-500">{province.count}</span>
            </div>
            <Progress 
              value={province.percentage} 
              className="h-2"
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}