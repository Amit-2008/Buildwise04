import { useEffect } from "react";
import { useAdmin } from "@/hooks/useAdmin";
import { ActivityLogTable } from "@/components/admin/ActivityLogTable";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

export default function AdminActivity() {
  const { activityLogs, fetchActivityLogs } = useAdmin();

  useEffect(() => {
    fetchActivityLogs();
  }, [fetchActivityLogs]);

  if (activityLogs.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Activity Logs</h1>
            <p className="text-muted-foreground">Track admin and user activity</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => fetchActivityLogs()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Activity Logs</h1>
          <p className="text-muted-foreground">Track admin and user activity</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => fetchActivityLogs()}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Last 100 activity entries</CardDescription>
        </CardHeader>
        <CardContent>
          <ActivityLogTable logs={activityLogs} />
        </CardContent>
      </Card>
    </div>
  );
}
