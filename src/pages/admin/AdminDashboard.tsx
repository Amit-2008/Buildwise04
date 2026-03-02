import { useEffect } from "react";
import { useAdmin } from "@/hooks/useAdmin";
import { StatsCard } from "@/components/admin/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Activity, Clock, UserCheck } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminDashboard() {
  const { stats, fetchDashboardStats } = useAdmin();

  useEffect(() => {
    fetchDashboardStats();
  }, [fetchDashboardStats]);

  if (!stats) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to the BuildWise Admin Panel</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to the BuildWise Admin Panel</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Users"
          value={stats.totalUsers}
          description="Registered users"
          icon={Users}
        />
        <StatsCard
          title="Active Sessions"
          value={stats.activeSessions}
          description="Currently online"
          icon={UserCheck}
        />
        <StatsCard
          title="Recent Activity"
          value={stats.recentLogins.length}
          description="Last 10 logins"
          icon={Activity}
        />
        <StatsCard
          title="System Status"
          value="Online"
          description="All systems operational"
          icon={Clock}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Logins</CardTitle>
        </CardHeader>
        <CardContent>
          {stats.recentLogins.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No recent logins</p>
          ) : (
            <div className="space-y-3">
              {stats.recentLogins.map((login) => (
                <div
                  key={login.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-2 w-2 rounded-full ${
                        login.is_active ? "bg-green-500" : "bg-muted-foreground"
                      }`}
                    />
                    <div>
                      <p className="font-medium text-sm">
                        {login.profile?.full_name || "Unknown User"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {login.profile?.email || "—"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(login.login_time), { addSuffix: true })}
                    </p>
                    {login.ip_address && (
                      <p className="text-xs text-muted-foreground font-mono">
                        {login.ip_address}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
