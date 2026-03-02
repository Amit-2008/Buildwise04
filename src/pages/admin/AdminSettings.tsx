import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export default function AdminSettings() {
  const handleSaveSettings = () => {
    toast.success("Settings saved successfully");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage admin panel settings</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Registration Settings</CardTitle>
            <CardDescription>Control how new users can register</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="allow-registration">Allow New Registrations</Label>
                <p className="text-sm text-muted-foreground">
                  When disabled, new users cannot create accounts
                </p>
              </div>
              <Switch id="allow-registration" defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="guest-access">Allow Guest Access</Label>
                <p className="text-sm text-muted-foreground">
                  Allow users to continue without creating an account
                </p>
              </div>
              <Switch id="guest-access" defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
            <CardDescription>Configure security options</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="session-logging">Session Logging</Label>
                <p className="text-sm text-muted-foreground">
                  Track user login sessions and IP addresses
                </p>
              </div>
              <Switch id="session-logging" defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="activity-logging">Activity Logging</Label>
                <p className="text-sm text-muted-foreground">
                  Log admin actions for audit purposes
                </p>
              </div>
              <Switch id="activity-logging" defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription>These actions cannot be undone</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Logout All Users</Label>
                <p className="text-sm text-muted-foreground">
                  Force logout all currently logged in users
                </p>
              </div>
              <Button variant="destructive" size="sm">
                Logout All
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSaveSettings}>Save Settings</Button>
        </div>
      </div>
    </div>
  );
}
