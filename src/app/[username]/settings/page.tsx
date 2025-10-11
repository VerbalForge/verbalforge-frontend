'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { EmailInput } from '@/components/ui/email-input';
import { PhoneInput } from '@/components/ui/phone-input';
import { PasswordInput } from '@/components/ui/password-input';
import { PasswordRequirements } from '@/components/password/PasswordRequirements';
import { PasswordValidationAlert } from '@/components/password/PasswordValidationAlert';
import { usePasswordValidation } from '@/hooks/usePasswordValidation';
import { userService } from '@/lib/services/userService';
import { authService } from '@/lib/services/authService';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, XCircle } from 'lucide-react';
import { formatDateLocal } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Edit } from 'lucide-react';
import timezones from '@/data/timezones.json';

export default function SettingsPage() {
  const { user, validateSession, logout, setUser } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState('');
  const [saveError, setSaveError] = useState('');
  
  // Use password validation hook
  const {
    errors: passwordErrors,
    success: passwordSuccess,
    validatePassword,
    clearValidation,
    setSuccessMessage,
    setErrorMessages,
  } = usePasswordValidation({ requireCurrentPassword: true });

  // Form state
  const [formData, setFormData] = useState({
    name: user?.name || '',
    username: user?.username || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

//   // Notification preferences
//   const [notifications, setNotifications] = useState({
//     emailNotifications: true,
//     practiceReminders: true,
//     weeklyProgress: true,
//     forumReplies: true,
//     achievements: true,
//   });

  // Privacy settings
  const [privacy, setPrivacy] = useState({
    showProfile: user?.preferences?.profile?.visibility ?? true,
    showProgress: user?.preferences?.profile?.progress ?? true,
    showOnLeaderboard: user?.preferences?.profile?.leaderboard ?? true,
  });

  // General preferences
  const [timezone, setTimezone] = useState(
    user?.preferences?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone
  );

  // Fetch and sync preferences when component mounts
  useEffect(() => {
    const fetchPreferences = async () => {
      if (user) {
        try {
          const preferences = await userService.getPreferences();
          
          // Update privacy settings from fetched preferences
          if (preferences?.profile) {
            setPrivacy({
              showProfile: preferences.profile.visibility ?? true,
              showProgress: preferences.profile.progress ?? true,
              showOnLeaderboard: preferences.profile.leaderboard ?? true,
            });
          }

          // Update timezone from fetched preferences
          if (preferences?.timezone) {
            setTimezone(preferences.timezone);
          }
        } catch (error) {
          console.error('Failed to fetch preferences:', error);
          // Fall back to user context preferences if fetch fails
          if (user.preferences?.profile) {
            setPrivacy({
              showProfile: user.preferences.profile.visibility ?? true,
              showProgress: user.preferences.profile.progress ?? true,
              showOnLeaderboard: user.preferences.profile.leaderboard ?? true,
            });
          }
          if (user.preferences?.timezone) {
            setTimezone(user.preferences.timezone);
          }
        }
      }
    };

    fetchPreferences();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]); // Only re-fetch if user ID changes

  // Sync form data when user data changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        username: user.username || '',
        email: user.email || '',
        phone: user.phone || '',
        bio: user.bio || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    
    // Clear errors when user types in password fields
    if (e.target.name.includes('Password')) {
      clearValidation();
    }
  };

  const handleSaveProfile = async () => {
    setSaveSuccess('');
    setSaveError('');
    setIsSaving(true);
    
    try {
      const response = await userService.updateProfile({
        name: formData.name,
        phone: formData.phone,
        bio: formData.bio,
      });
      
      // Update user context with new data
      if (setUser && response.user) {
        setUser(response.user);
      }
      
      setSaveSuccess('Profile updated successfully!');
      setIsEditing(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSaveSuccess(''), 3000);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update profile';
      setSaveError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePrivacyChange = async (field: 'visibility' | 'progress' | 'leaderboard', value: boolean) => {
    // Optimistic update
    const fieldMap = {
      visibility: 'showProfile',
      progress: 'showProgress',
      leaderboard: 'showOnLeaderboard',
    };
    
    setPrivacy(prev => ({
      ...prev,
      [fieldMap[field]]: value,
    }));

    try {
      const response = await userService.updatePreference({ key: field, value });
      
      // Update user context with new preferences
      if (setUser && user) {
        setUser({
          ...user,
          preferences: response.preferences,
        });
      }
    } catch (error) {
      // Revert on error
      setPrivacy(prev => ({
        ...prev,
        [fieldMap[field]]: !value,
      }));
      console.error('Failed to update preference:', error);
    }
  };

  const handleTimezoneChange = async (newTimezone: string) => {
    // Optimistic update
    setTimezone(newTimezone);

    try {
      const response = await userService.updatePreference({ key: 'timezone', value: newTimezone });
      
      // Update user context with new preferences
      if (setUser && user) {
        setUser({
          ...user,
          preferences: response.preferences,
        });
      }
    } catch (error) {
      // Revert on error
      setTimezone(timezone);
      console.error('Failed to update timezone:', error);
    }
  };

  const handleChangePassword = async () => {
    // Validate password
    const isValid = validatePassword(
      formData.newPassword,
      formData.confirmPassword,
      formData.currentPassword
    );
    
    if (!isValid) {
      return;
    }

    setIsSaving(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Check if it's an authentication error
        if (response.status === 401) {
          await validateSession();
          return;
        }
        setErrorMessages([data.error || 'Failed to change password']);
        setIsSaving(false);
        return;
      }

      // Success
      setSuccessMessage('Password changed successfully!');
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch {
      setErrorMessages(['An error occurred. Please try again.']);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      setDeleteError('Password is required');
      return;
    }

    setIsDeleting(true);
    setDeleteError('');

    try {
      await authService.deleteAccount({ password: deletePassword });
      
      // Account deleted successfully
      localStorage.removeItem('token');
      sessionStorage.setItem('intentionalLogout', 'true');
      logout();
      router.push('/');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete account';
      setDeleteError(errorMessage);
      setIsDeleting(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Account Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Profile Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information and profile details
              </CardDescription>
            </div>
            {!isEditing && (
              <Button onClick={() => setIsEditing(true)} variant="outline">
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-start gap-4">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-lg">{user.name}</h3>
                <Badge variant="outline">Level 3</Badge>
              </div>
              <p className="text-sm text-muted-foreground">@{user.username}</p>
              <p className="text-xs text-muted-foreground">Member since {formatDateLocal(user.createdAt)}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <EmailInput
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={true}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <PhoneInput
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              disabled={!isEditing}
              placeholder="Tell us about yourself..."
              rows={4}
            />
          </div>

          {saveSuccess && (
            <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-600">
                {saveSuccess}
              </AlertDescription>
            </Alert>
          )}

          {saveError && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>
                {saveError}
              </AlertDescription>
            </Alert>
          )}

          {isEditing && (
            <div className="flex gap-2">
              <Button onClick={handleSaveProfile} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsEditing(false);
                  setSaveError('');
                  setSaveSuccess('');
                  setFormData({
                    ...formData,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    bio: user.bio || '',
                  });
                }}
                disabled={isSaving}
              >
                Cancel
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>
            Update your password to keep your account secure
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Success/Error Messages */}
          <PasswordValidationAlert errors={passwordErrors} success={passwordSuccess} />

          {/* Password Requirements */}
          <PasswordRequirements 
            password={formData.newPassword} 
            currentPassword={formData.currentPassword}
            showStatus={formData.newPassword.length > 0}
          />

          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <PasswordInput
              id="currentPassword"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleInputChange}
              placeholder="Enter current password"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <PasswordInput
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleInputChange}
              placeholder="Enter new password"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <PasswordInput
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm new password"
            />
          </div>

          <Button onClick={handleChangePassword} disabled={isSaving}>
            {isSaving ? 'Updating...' : 'Update Password'}
          </Button>
        </CardContent>
      </Card>

      {/* Notification Preferences
      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>
            Choose what notifications you want to receive
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="emailNotifications">Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive email updates about your account
              </p>
            </div>
            <Switch
              id="emailNotifications"
              checked={notifications.emailNotifications}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, emailNotifications: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="practiceReminders">Practice Reminders</Label>
              <p className="text-sm text-muted-foreground">
                Get reminded to practice daily
              </p>
            </div>
            <Switch
              id="practiceReminders"
              checked={notifications.practiceReminders}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, practiceReminders: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="weeklyProgress">Weekly Progress Report</Label>
              <p className="text-sm text-muted-foreground">
                Receive weekly summaries of your progress
              </p>
            </div>
            <Switch
              id="weeklyProgress"
              checked={notifications.weeklyProgress}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, weeklyProgress: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="forumReplies">Forum Replies</Label>
              <p className="text-sm text-muted-foreground">
                Get notified when someone replies to your posts
              </p>
            </div>
            <Switch
              id="forumReplies"
              checked={notifications.forumReplies}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, forumReplies: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="achievements">Achievement Unlocked</Label>
              <p className="text-sm text-muted-foreground">
                Be notified when you unlock new achievements
              </p>
            </div>
            <Switch
              id="achievements"
              checked={notifications.achievements}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, achievements: checked })
              }
            />
          </div>
        </CardContent>
      </Card> */}

      {/* Privacy Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Privacy Settings</CardTitle>
          <CardDescription>
            Control your privacy and visibility on the platform
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="showProfile">Show Profile</Label>
              <p className="text-sm text-muted-foreground">
                Allow others to view your profile
              </p>
            </div>
            <Switch
              id="showProfile"
              checked={privacy.showProfile}
              onCheckedChange={(checked) => handlePrivacyChange('visibility', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="showProgress">Show Progress</Label>
              <p className="text-sm text-muted-foreground">
                Display your progress and stats publicly
              </p>
            </div>
            <Switch
              id="showProgress"
              checked={privacy.showProgress}
              onCheckedChange={(checked) => handlePrivacyChange('progress', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="showOnLeaderboard">Show on Leaderboard</Label>
              <p className="text-sm text-muted-foreground">
                Appear in the public leaderboard rankings
              </p>
            </div>
            <Switch
              id="showOnLeaderboard"
              checked={privacy.showOnLeaderboard}
              onCheckedChange={(checked) => handlePrivacyChange('leaderboard', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* General Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>General Preferences</CardTitle>
          <CardDescription>
            Customize your general application settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5 flex-1">
              <Label htmlFor="timezone">Timezone</Label>
              <p className="text-sm text-muted-foreground">
                Your timezone affects when activities are recorded in your calendar
              </p>
            </div>
            <Select value={timezone} onValueChange={handleTimezoneChange}>
              <SelectTrigger className="w-[280px]">
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {timezones.map((tz) => (
                  <SelectItem key={tz.value} value={tz.value}>
                    {tz.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>
            Irreversible and destructive actions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-destructive/50 rounded-lg bg-destructive/10">
            <div>
              <h4 className="font-semibold text-foreground">Delete Account</h4>
              <p className="text-sm text-muted-foreground">
                Permanently delete your account and all associated data
              </p>
            </div>
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  Delete Account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your
                    account and remove all your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="delete-password">Enter your password to confirm</Label>
                    <PasswordInput
                      id="delete-password"
                      name="delete-password"
                      value={deletePassword}
                      onChange={(e) => {
                        setDeletePassword(e.target.value);
                        setDeleteError('');
                      }}
                      placeholder="Enter your password"
                      disabled={isDeleting}
                    />
                  </div>
                  {deleteError && (
                    <p className="text-sm text-destructive">{deleteError}</p>
                  )}
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={(e) => {
                      e.preventDefault();
                      handleDeleteAccount();
                    }}
                    disabled={isDeleting}
                    className="bg-destructive hover:bg-destructive/90"
                  >
                    {isDeleting ? 'Deleting...' : 'Delete Account'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
