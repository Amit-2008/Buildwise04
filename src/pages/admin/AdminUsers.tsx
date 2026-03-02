import { useEffect } from "react";
import { useAdmin } from "@/hooks/useAdmin";
import { UsersTable } from "@/components/admin/UsersTable";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function AdminUsers() {
  const { users, fetchAllUsers, changeUserRole, blockUser, unblockUser, deleteUser } = useAdmin();
  const { user } = useAuth();

  useEffect(() => {
    fetchAllUsers();
  }, [fetchAllUsers]);

  const handleChangeRole = async (userId: string, newRole: string, oldRole: string) => {
    try {
      await changeUserRole(userId, newRole, oldRole);
      toast.success(`User role changed to ${newRole}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to change role");
    }
  };

  const handleBlockUser = async (userId: string) => {
    try {
      await blockUser(userId);
      toast.success("User has been blocked");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to block user");
    }
  };

  const handleUnblockUser = async (userId: string) => {
    try {
      await unblockUser(userId);
      toast.success("User has been unblocked");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to unblock user");
    }
  };

  const handleDeleteUser = async (userId: string, details: Record<string, unknown>) => {
    try {
      await deleteUser(userId, details);
      toast.success("User has been deleted");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete user");
    }
  };

  if (users.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">View and manage all registered users</p>
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
      <div>
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-muted-foreground">View and manage all registered users</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>
            {users.length} registered user{users.length !== 1 ? "s" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UsersTable
            users={users}
            onChangeRole={handleChangeRole}
            onBlockUser={handleBlockUser}
            onUnblockUser={handleUnblockUser}
            onDeleteUser={handleDeleteUser}
            currentUserId={user?.id}
          />
        </CardContent>
      </Card>
    </div>
  );
}
