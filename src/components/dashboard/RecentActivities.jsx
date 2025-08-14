import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { UserCheck, CreditCard, Home, Clock } from "lucide-react";

const activityIcons = {
  inscricao: UserCheck,
  pagamento: CreditCard,
  projeto: Home
};

const activityColors = {
  inscricao: "text-blue-600 bg-blue-50",
  pagamento: "text-green-600 bg-green-50", 
  projeto: "text-purple-600 bg-purple-50"
};

export default function RecentActivities({ activities, loading }) {
  if (loading) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Atividades Recentes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="flex items-center space-x-3">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-4 w-40 mb-1" />
                <Skeleton className="h-3 w-20" />
              </div>
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
          <Clock className="w-5 h-5 text-slate-600" />
          Atividades Recentes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity, index) => {
          const Icon = activityIcons[activity.type];
          return (
            <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
              <div className={`p-2 rounded-full ${activityColors[activity.type]}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-slate-800">{activity.message}</p>
                <p className="text-sm text-slate-500">{activity.time} atrás</p>
              </div>
            </div>
          );
        })}
        
        {activities.length === 0 && (
          <div className="text-center py-8 text-slate-500">
            <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>Nenhuma atividade recente</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}