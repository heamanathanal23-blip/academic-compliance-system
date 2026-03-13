import { motion } from "framer-motion";
import { useAuth } from "@/context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Settings, Lock, Bell, Eye, LogOut } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SettingsPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    department: user?.department || ""
  });

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4 }}
      className="space-y-6 max-w-3xl"
    >
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your account and preferences</p>
      </div>

      {/* Profile Settings */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Profile Settings
          </CardTitle>
          <CardDescription>Update your personal information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Full Name</label>
            <Input
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              disabled={!isEditing}
              className="mt-1 bg-secondary border-border/50"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              disabled={!isEditing}
              className="mt-1 bg-secondary border-border/50"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Department</label>
            <Input
              value={formData.department}
              disabled
              className="mt-1 bg-secondary border-border/50 text-muted-foreground"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Role</label>
            <Input
              value={user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1) || ""}
              disabled
              className="mt-1 bg-secondary border-border/50 text-muted-foreground"
            />
          </div>
          <div className="flex gap-2 pt-2">
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
            ) : (
              <>
                <Button onClick={() => setIsEditing(false)} className="bg-green-600 hover:bg-green-700">
                  Save Changes
                </Button>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Security
          </CardTitle>
          <CardDescription>Manage your security preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Current Password</label>
            <Input
              type="password"
              placeholder="Enter your current password"
              className="mt-1 bg-secondary border-border/50"
            />
          </div>
          <div>
            <label className="text-sm font-medium">New Password</label>
            <Input
              type="password"
              placeholder="Enter new password"
              className="mt-1 bg-secondary border-border/50"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Confirm Password</label>
            <Input
              type="password"
              placeholder="Confirm new password"
              className="mt-1 bg-secondary border-border/50"
            />
          </div>
          <Button className="bg-orange-600 hover:bg-orange-700">Change Password</Button>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
          <CardDescription>Manage notification preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Email Notifications</p>
              <p className="text-sm text-muted-foreground">Receive email updates</p>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Alert Notifications</p>
              <p className="text-sm text-muted-foreground">Get notified about alerts</p>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Report Notifications</p>
              <p className="text-sm text-muted-foreground">Get notified about new reports</p>
            </div>
            <input type="checkbox" className="w-5 h-5" />
          </div>
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Privacy
          </CardTitle>
          <CardDescription>Control your privacy settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Profile Visibility</p>
              <p className="text-sm text-muted-foreground">Allow others to see your profile</p>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Activity Visibility</p>
              <p className="text-sm text-muted-foreground">Show your activity to others</p>
            </div>
            <input type="checkbox" className="w-5 h-5" />
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="glass-card border-destructive/30 bg-destructive/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <LogOut className="h-5 w-5" />
            Session
          </CardTitle>
          <CardDescription>Manage your session</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="destructive" onClick={handleLogout} className="w-full">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
          <p className="text-xs text-muted-foreground">
            You will be logged out and redirected to the login page
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SettingsPage;
