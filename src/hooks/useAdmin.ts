import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface DashboardStats {
  totalUsers: number;
  activeSessions: number;
  recentLogins: Array<{
    id: string;
    user_id: string;
    login_time: string;
    ip_address: string;
    is_active: boolean;
    profile?: { full_name: string; email: string };
  }>;
}

interface UserData {
  id: string;
  user_id: string;
  email: string;
  full_name: string;
  is_blocked: boolean;
  is_guest: boolean;
  last_login: string | null;
  created_at: string;
  role: "admin" | "user";
  isOnline: boolean;
  currentSession?: { login_time: string };
}

interface SessionData {
  id: string;
  user_id: string;
  login_time: string;
  ip_address: string;
  user_agent: string;
  is_active: boolean;
  profile?: { full_name: string; email: string };
}

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

export function useAdmin() {
  const { session } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [users, setUsers] = useState<UserData[]>([]);
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);

  const callAdminApi = useCallback(
    async (action: string, data: Record<string, unknown> = {}) => {
      if (!session?.access_token) {
        throw new Error("Not authenticated");
      }

      const { data: response, error } = await supabase.functions.invoke("admin", {
        body: { action, ...data },
      });

      if (error) {
        throw new Error(error.message || "Admin API error");
      }

      if (response?.error) {
        throw new Error(response.error);
      }

      return response;
    },
    [session?.access_token]
  );

  const checkAdminStatus = useCallback(async () => {
    if (!session?.access_token) {
      setIsAdmin(false);
      setIsLoading(false);
      return;
    }

    try {
      const response = await callAdminApi("check_admin");
      setIsAdmin(response?.isAdmin ?? false);
    } catch {
      setIsAdmin(false);
    } finally {
      setIsLoading(false);
    }
  }, [session?.access_token, callAdminApi]);

  const fetchDashboardStats = useCallback(async () => {
    try {
      const response = await callAdminApi("get_dashboard_stats");
      setStats(response);
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
    }
  }, [callAdminApi]);

  const fetchAllUsers = useCallback(async () => {
    try {
      const response = await callAdminApi("get_all_users");
      setUsers(response?.users || []);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  }, [callAdminApi]);

  const fetchActiveSessions = useCallback(async () => {
    try {
      const response = await callAdminApi("get_active_sessions");
      setSessions(response?.sessions || []);
    } catch (error) {
      console.error("Failed to fetch sessions:", error);
    }
  }, [callAdminApi]);

  const fetchActivityLogs = useCallback(async () => {
    try {
      const response = await callAdminApi("get_activity_logs");
      setActivityLogs(response?.logs || []);
    } catch (error) {
      console.error("Failed to fetch activity logs:", error);
    }
  }, [callAdminApi]);

  const changeUserRole = useCallback(
    async (targetUserId: string, newRole: string, oldRole: string) => {
      await callAdminApi("change_user_role", {
        targetUserId,
        newRole,
        details: { oldRole },
      });
      await fetchAllUsers();
      await fetchActivityLogs();
    },
    [callAdminApi, fetchAllUsers, fetchActivityLogs]
  );

  const blockUser = useCallback(
    async (targetUserId: string) => {
      await callAdminApi("block_user", { targetUserId });
      await fetchAllUsers();
      await fetchActiveSessions();
      await fetchActivityLogs();
    },
    [callAdminApi, fetchAllUsers, fetchActiveSessions, fetchActivityLogs]
  );

  const unblockUser = useCallback(
    async (targetUserId: string) => {
      await callAdminApi("unblock_user", { targetUserId });
      await fetchAllUsers();
      await fetchActivityLogs();
    },
    [callAdminApi, fetchAllUsers, fetchActivityLogs]
  );

  const deleteUser = useCallback(
    async (targetUserId: string, userDetails: Record<string, unknown>) => {
      await callAdminApi("delete_user", { targetUserId, details: userDetails });
      await fetchAllUsers();
      await fetchActivityLogs();
    },
    [callAdminApi, fetchAllUsers, fetchActivityLogs]
  );

  useEffect(() => {
    checkAdminStatus();
  }, [checkAdminStatus]);

  return {
    isAdmin,
    isLoading,
    stats,
    users,
    sessions,
    activityLogs,
    fetchDashboardStats,
    fetchAllUsers,
    fetchActiveSessions,
    fetchActivityLogs,
    changeUserRole,
    blockUser,
    unblockUser,
    deleteUser,
  };
}
