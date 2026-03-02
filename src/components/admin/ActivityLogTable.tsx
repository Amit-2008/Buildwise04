import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow, format } from "date-fns";
import {
  LogIn,
  LogOut,
  UserCog,
  Shield,
  Ban,
  Unlock,
  Trash2,
  Activity,
} from "lucide-react";

interface ActivityLog {
  id: string;
  user_id: string;
  action: string;
  target_user_id: string | null;
  details: Record<string, unknown> | null;
  ip_address: string;
  created_at: string;
  actor?: { full_name: string; email: string };
  target?: { full_name: string; email: string };
}

interface ActivityLogTableProps {
  logs: ActivityLog[];
}

const actionConfig: Record<
  string,
  { label: string; icon: React.ElementType; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  login: { label: "Login", icon: LogIn, variant: "outline" },
  logout: { label: "Logout", icon: LogOut, variant: "secondary" },
  role_change: { label: "Role Changed", icon: Shield, variant: "default" },
  user_blocked: { label: "User Blocked", icon: Ban, variant: "destructive" },
  user_unblocked: { label: "User Unblocked", icon: Unlock, variant: "outline" },
  user_deleted: { label: "User Deleted", icon: Trash2, variant: "destructive" },
  settings_changed: { label: "Settings", icon: UserCog, variant: "secondary" },
};

export function ActivityLogTable({ logs }: ActivityLogTableProps) {
  const getActionDisplay = (action: string) => {
    return actionConfig[action] || { label: action, icon: Activity, variant: "secondary" as const };
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Action</TableHead>
            <TableHead>Performed By</TableHead>
            <TableHead>Target User</TableHead>
            <TableHead>Details</TableHead>
            <TableHead>IP Address</TableHead>
            <TableHead>Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                No activity logs found
              </TableCell>
            </TableRow>
          ) : (
            logs.map((log) => {
              const actionDisplay = getActionDisplay(log.action);
              const ActionIcon = actionDisplay.icon;

              return (
                <TableRow key={log.id}>
                  <TableCell>
                    <Badge variant={actionDisplay.variant} className="gap-1">
                      <ActionIcon className="h-3 w-3" />
                      {actionDisplay.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-sm">
                        {log.actor?.full_name || "System"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {log.actor?.email || "—"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {log.target ? (
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">{log.target.full_name}</span>
                        <span className="text-xs text-muted-foreground">{log.target.email}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="max-w-[200px]">
                    {log.details ? (
                      <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
                        {JSON.stringify(log.details)}
                      </code>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm font-mono">
                    {log.ip_address || "—"}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm">
                        {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(log.created_at), "MMM d, HH:mm")}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
