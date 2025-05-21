
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const DiagnosticSkeleton = () => {
  return (
    <div className="space-y-6">
      <div className="h-8 w-64">
        <Skeleton className="h-full w-full" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="pb-2">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-9 w-full mt-4" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
