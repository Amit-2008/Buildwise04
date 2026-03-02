import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AdminRequest {
  action: string;
  targetUserId?: string;
  newRole?: string;
  details?: Record<string, unknown>;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    // Get authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      console.error("No authorization header provided");
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create client with user's token to verify their identity
    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    // Get the authenticated user
    const { data: { user }, error: userError } = await userClient.auth.getUser();
    if (userError || !user) {
      console.error("Failed to get user:", userError?.message);
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("User authenticated:", user.id, user.email);

    // Create service role client for admin operations
    const adminClient = createClient(supabaseUrl, supabaseServiceKey);

    // Check if user is admin using the has_role function
    const { data: isAdmin, error: roleError } = await adminClient.rpc("has_role", {
      _user_id: user.id,
      _role: "admin",
    });

    if (roleError) {
      console.error("Error checking admin role:", roleError.message);
      return new Response(
        JSON.stringify({ error: "Failed to verify admin status" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!isAdmin) {
      console.warn("Non-admin user attempted admin action:", user.email);
      return new Response(
        JSON.stringify({ error: "Forbidden - Admin access required" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Admin access verified for:", user.email);

    const body: AdminRequest = await req.json();
    const { action, targetUserId, newRole, details } = body;

    console.log("Processing admin action:", action, "target:", targetUserId);

    // Get client IP for logging
    const clientIp = req.headers.get("x-forwarded-for") || req.headers.get("cf-connecting-ip") || "unknown";

    switch (action) {
      case "get_dashboard_stats": {
        // Get total users count
        const { count: totalUsers } = await adminClient
          .from("profiles")
          .select("*", { count: "exact", head: true })
          .eq("is_guest", false);

        // Get active sessions count
        const { count: activeSessions } = await adminClient
          .from("login_sessions")
          .select("*", { count: "exact", head: true })
          .eq("is_active", true);

        // Get recent logins
        const { data: recentLogins } = await adminClient
          .from("login_sessions")
          .select(`
            id,
            user_id,
            login_time,
            ip_address,
            is_active
          `)
          .order("login_time", { ascending: false })
          .limit(10);

        // Get profiles for recent logins
        const userIds = recentLogins?.map(l => l.user_id) || [];
        const { data: profiles } = await adminClient
          .from("profiles")
          .select("user_id, full_name, email")
          .in("user_id", userIds);

        const recentLoginsWithProfiles = recentLogins?.map(login => ({
          ...login,
          profile: profiles?.find(p => p.user_id === login.user_id),
        }));

        return new Response(
          JSON.stringify({
            totalUsers: totalUsers || 0,
            activeSessions: activeSessions || 0,
            recentLogins: recentLoginsWithProfiles || [],
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "get_all_users": {
        // Get all non-guest profiles with their roles
        const { data: profiles, error: profilesError } = await adminClient
          .from("profiles")
          .select("*")
          .eq("is_guest", false)
          .order("created_at", { ascending: false });

        if (profilesError) {
          console.error("Error fetching profiles:", profilesError.message);
          throw profilesError;
        }

        // Get all user roles
        const { data: roles } = await adminClient
          .from("user_roles")
          .select("user_id, role");

        // Get active sessions
        const { data: sessions } = await adminClient
          .from("login_sessions")
          .select("user_id, is_active, login_time")
          .eq("is_active", true);

        // Combine data
        const usersWithRoles = profiles?.map(profile => ({
          ...profile,
          role: roles?.find(r => r.user_id === profile.user_id)?.role || "user",
          isOnline: sessions?.some(s => s.user_id === profile.user_id) || false,
          currentSession: sessions?.find(s => s.user_id === profile.user_id),
        }));

        return new Response(
          JSON.stringify({ users: usersWithRoles }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "get_active_sessions": {
        const { data: sessions, error } = await adminClient
          .from("login_sessions")
          .select(`
            id,
            user_id,
            login_time,
            ip_address,
            user_agent,
            is_active
          `)
          .eq("is_active", true)
          .order("login_time", { ascending: false });

        if (error) throw error;

        // Get profiles for active sessions
        const userIds = sessions?.map(s => s.user_id) || [];
        const { data: profiles } = await adminClient
          .from("profiles")
          .select("user_id, full_name, email")
          .in("user_id", userIds);

        const sessionsWithProfiles = sessions?.map(session => ({
          ...session,
          profile: profiles?.find(p => p.user_id === session.user_id),
        }));

        return new Response(
          JSON.stringify({ sessions: sessionsWithProfiles }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "change_user_role": {
        if (!targetUserId || !newRole) {
          return new Response(
            JSON.stringify({ error: "Missing targetUserId or newRole" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // Prevent admin from changing their own role
        if (targetUserId === user.id) {
          return new Response(
            JSON.stringify({ error: "Cannot change your own role" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // Delete existing role
        await adminClient
          .from("user_roles")
          .delete()
          .eq("user_id", targetUserId);

        // Insert new role
        const { error: insertError } = await adminClient
          .from("user_roles")
          .insert({ user_id: targetUserId, role: newRole });

        if (insertError) throw insertError;

        // Log activity
        await adminClient.from("activity_logs").insert({
          user_id: user.id,
          action: "role_change",
          target_user_id: targetUserId,
          details: { old_role: details?.oldRole, new_role: newRole },
          ip_address: clientIp,
        });

        console.log("Role changed for user:", targetUserId, "to:", newRole);

        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "block_user": {
        if (!targetUserId) {
          return new Response(
            JSON.stringify({ error: "Missing targetUserId" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // Prevent admin from blocking themselves
        if (targetUserId === user.id) {
          return new Response(
            JSON.stringify({ error: "Cannot block yourself" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const { error: blockError } = await adminClient
          .from("profiles")
          .update({ is_blocked: true })
          .eq("user_id", targetUserId);

        if (blockError) throw blockError;

        // End all active sessions for blocked user
        await adminClient
          .from("login_sessions")
          .update({ is_active: false, logout_time: new Date().toISOString() })
          .eq("user_id", targetUserId)
          .eq("is_active", true);

        // Log activity
        await adminClient.from("activity_logs").insert({
          user_id: user.id,
          action: "user_blocked",
          target_user_id: targetUserId,
          ip_address: clientIp,
        });

        console.log("User blocked:", targetUserId);

        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "unblock_user": {
        if (!targetUserId) {
          return new Response(
            JSON.stringify({ error: "Missing targetUserId" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const { error: unblockError } = await adminClient
          .from("profiles")
          .update({ is_blocked: false })
          .eq("user_id", targetUserId);

        if (unblockError) throw unblockError;

        // Log activity
        await adminClient.from("activity_logs").insert({
          user_id: user.id,
          action: "user_unblocked",
          target_user_id: targetUserId,
          ip_address: clientIp,
        });

        console.log("User unblocked:", targetUserId);

        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "delete_user": {
        if (!targetUserId) {
          return new Response(
            JSON.stringify({ error: "Missing targetUserId" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // Prevent admin from deleting themselves
        if (targetUserId === user.id) {
          return new Response(
            JSON.stringify({ error: "Cannot delete yourself" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // Log activity before deletion
        await adminClient.from("activity_logs").insert({
          user_id: user.id,
          action: "user_deleted",
          target_user_id: targetUserId,
          details: details,
          ip_address: clientIp,
        });

        // Delete user from auth (cascades to profiles, roles, etc.)
        const { error: deleteError } = await adminClient.auth.admin.deleteUser(targetUserId);

        if (deleteError) throw deleteError;

        console.log("User deleted:", targetUserId);

        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "get_activity_logs": {
        const { data: logs, error } = await adminClient
          .from("activity_logs")
          .select(`
            id,
            user_id,
            action,
            target_user_id,
            details,
            ip_address,
            created_at
          `)
          .order("created_at", { ascending: false })
          .limit(100);

        if (error) throw error;

        // Get profiles for actors and targets
        const userIds = [...new Set([
          ...logs?.map(l => l.user_id).filter(Boolean) || [],
          ...logs?.map(l => l.target_user_id).filter(Boolean) || [],
        ])];

        const { data: profiles } = await adminClient
          .from("profiles")
          .select("user_id, full_name, email")
          .in("user_id", userIds);

        const logsWithProfiles = logs?.map(log => ({
          ...log,
          actor: profiles?.find(p => p.user_id === log.user_id),
          target: profiles?.find(p => p.user_id === log.target_user_id),
        }));

        return new Response(
          JSON.stringify({ logs: logsWithProfiles }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "check_admin": {
        return new Response(
          JSON.stringify({ isAdmin: true }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      default:
        return new Response(
          JSON.stringify({ error: "Unknown action" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
  } catch (error: unknown) {
    console.error("Admin function error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
