import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Calendar, 
  Key, 
  LogOut, 
  Edit2, 
  Save, 
  X,
  Shield,
  Activity,
  FileText,
  MessageSquare
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface User {
  uid: string;
  email: string;
  displayName?: string;
}

type Page = 'dashboard' | 'upload' | 'analysis' | 'chat' | 'profile';

interface RouteParams {
  id?: string;
}

interface ProfilePageProps {
  user: User;
  onUpdateUser: (updates: { displayName?: string }) => Promise<void>;
  onLogout: () => void;
  onNavigate?: (page: Page, params?: RouteParams) => void;
}

interface UserStats {
  documentsUploaded: number;
  analysesCompleted: number;
  chatSessions: number;
  accountCreated: string;
  lastLogin: string;
}

// Mock user stats
const mockStats: UserStats = {
  documentsUploaded: 12,
  analysesCompleted: 11,
  chatSessions: 8,
  accountCreated: '2024-01-01',
  lastLogin: '2024-01-15'
};

export function ProfilePage({ user, onUpdateUser, onLogout, onNavigate }: ProfilePageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user.displayName || '');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSaveProfile = async () => {
    if (!displayName.trim()) {
      toast.error('Display name cannot be empty');
      return;
    }

    setIsUpdating(true);
    try {
      await onUpdateUser({ displayName: displayName.trim() });
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelEdit = () => {
    setDisplayName(user.displayName || '');
    setIsEditing(false);
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      onLogout();
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-6">
        {onNavigate && (
          <Button variant="ghost" onClick={() => onNavigate('dashboard')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        )}
      </div>

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Profile Settings</h1>
          <p className="text-muted-foreground">
            Manage your account information and preferences
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <User className="w-5 h-5" />
                      <span>Profile Information</span>
                    </CardTitle>
                    <CardDescription>
                      Update your personal information
                    </CardDescription>
                  </div>
                  {!isEditing && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Display Name</Label>
                    {isEditing ? (
                      <Input
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="Enter your display name"
                      />
                    ) : (
                      <p className="text-sm font-medium">
                        {user.displayName || 'Not set'}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Email Address</Label>
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <p className="text-sm font-medium">{user.email}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>User ID</Label>
                  <div className="flex items-center space-x-2">
                    <Key className="w-4 h-4 text-muted-foreground" />
                    <code className="text-sm bg-muted px-2 py-1 rounded">
                      {user.uid}
                    </code>
                  </div>
                </div>

                {isEditing && (
                  <div className="flex space-x-2 pt-4">
                    <Button 
                      onClick={handleSaveProfile}
                      disabled={isUpdating}
                    >
                      {isUpdating ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={handleCancelEdit}
                      disabled={isUpdating}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Account Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="w-5 h-5" />
                  <span>Account Activity</span>
                </CardTitle>
                <CardDescription>
                  Your usage statistics and activity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                      {mockStats.documentsUploaded}
                    </div>
                    <div className="text-sm text-blue-600 dark:text-blue-400">
                      Documents
                    </div>
                  </div>

                  <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                    <Shield className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                      {mockStats.analysesCompleted}
                    </div>
                    <div className="text-sm text-green-600 dark:text-green-400">
                      Analyses
                    </div>
                  </div>

                  <div className="text-center p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                    <MessageSquare className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                      {mockStats.chatSessions}
                    </div>
                    <div className="text-sm text-purple-600 dark:text-purple-400">
                      Chat Sessions
                    </div>
                  </div>

                  <div className="text-center p-4 bg-orange-50 dark:bg-orange-950 rounded-lg">
                    <Calendar className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                      {Math.floor((new Date().getTime() - new Date(mockStats.accountCreated).getTime()) / (1000 * 60 * 60 * 24))}
                    </div>
                    <div className="text-sm text-orange-600 dark:text-orange-400">
                      Days Active
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5" />
                  <span>Security & Authentication</span>
                </CardTitle>
                <CardDescription>
                  Manage your account security settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Password</h4>
                    <p className="text-sm text-muted-foreground">
                      Change your account password
                    </p>
                  </div>
                  <Button variant="outline" size="sm" disabled>
                    Change Password
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Two-Factor Authentication</h4>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Badge variant="secondary">Not Available</Badge>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Login Sessions</h4>
                    <p className="text-sm text-muted-foreground">
                      View and manage your active sessions
                    </p>
                  </div>
                  <Button variant="outline" size="sm" disabled>
                    Manage Sessions
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Account Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Account Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-xl font-bold text-white">
                      {user.displayName 
                        ? user.displayName.split(' ').map(n => n[0]).join('').toUpperCase()
                        : user.email.substring(0, 2).toUpperCase()
                      }
                    </span>
                  </div>
                  <h3 className="font-semibold">
                    {user.displayName || user.email.split('@')[0]}
                  </h3>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Member since:</span>
                    <span>{new Date(mockStats.accountCreated).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Last login:</span>
                    <span>{new Date(mockStats.lastLogin).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {onNavigate && (
                  <>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => onNavigate('upload')}
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Upload Document
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => onNavigate('dashboard')}
                    >
                      <Activity className="w-4 h-4 mr-2" />
                      View Dashboard
                    </Button>
                  </>
                )}
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  disabled
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Export Data
                </Button>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-red-200 dark:border-red-800">
              <CardHeader>
                <CardTitle className="text-red-600 dark:text-red-400">
                  Account Actions
                </CardTitle>
                <CardDescription>
                  Irreversible account actions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  variant="outline"
                  className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-950"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
                <Button 
                  variant="outline"
                  className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-950"
                  disabled
                >
                  <X className="w-4 h-4 mr-2" />
                  Delete Account
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}