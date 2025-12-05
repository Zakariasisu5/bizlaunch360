import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ThemeToggle } from '@/components/ThemeToggle';
import { 
  Settings as SettingsIcon, 
  User, 
  Building, 
  Bell, 
  CreditCard,
  Shield,
  Upload,
  Save,
  Eye,
  LogIn
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Settings = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('profile');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    bio: ''
  });

  const [businessData, setBusinessData] = useState({
    businessName: '',
    businessType: '',
    website: '',
    address: '',
    description: ''
  });

  const [invoiceSettings, setInvoiceSettings] = useState({
    companyName: '',
    address: '',
    phone: '',
    email: '',
    taxId: '',
    paymentTerms: '30',
    notes: 'Thank you for your business!'
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
    appointmentReminders: true,
    invoiceUpdates: true,
    marketingEmails: false
  });

  // Check authentication status and load user data
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
      setUser(user);
      
      if (user) {
        await loadUserSettings(user.id);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserSettings = async (userId: string) => {
    try {
      // Load settings from localStorage as fallback
      const savedSettings = localStorage.getItem(`user_settings_${userId}`);
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        setProfileData(settings.profile || profileData);
        setBusinessData(settings.business || businessData);
        setInvoiceSettings(settings.invoice || invoiceSettings);
        setNotifications(settings.notifications || notifications);
      }

      // Set initial values from user data
      if (user) {
        setProfileData(prev => ({
          ...prev,
          name: user.user_metadata?.full_name || user.email?.split('@')[0] || '',
          email: user.email || ''
        }));
      }
    } catch (error) {
      console.error('Error loading user settings:', error);
    }
  };

  const saveUserSettings = async () => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      const settings = {
        profile: profileData,
        business: businessData,
        invoice: invoiceSettings,
        notifications: notifications,
        updatedAt: new Date().toISOString()
      };

      // Save to localStorage
      localStorage.setItem(`user_settings_${user.id}`, JSON.stringify(settings));
      
      toast({
        title: "Success",
        description: "Settings saved successfully!",
        variant: "default"
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveProfile = async () => {
    await saveUserSettings();
  };

  const handleSaveBusiness = async () => {
    await saveUserSettings();
  };

  const handleSaveInvoice = async () => {
    await saveUserSettings();
  };

  const handleSaveNotifications = async () => {
    await saveUserSettings();
  };

  const businessTypes = [
    'Technology',
    'Retail',
    'Healthcare',
    'Education',
    'Food & Beverage',
    'Professional Services',
    'Manufacturing',
    'Real Estate',
    'Other'
  ];

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading settings...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center space-y-4">
            <LogIn className="h-12 w-12 mx-auto text-muted-foreground" />
            <h2 className="text-2xl font-bold">Authentication Required</h2>
            <p className="text-muted-foreground">Please sign in to access settings</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Settings</h1>
            <p className="text-muted-foreground mt-2">Manage your account, business, and application preferences</p>
          </div>
          <ThemeToggle />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
            <TabsList className="inline-flex w-max min-w-full sm:w-full sm:grid sm:grid-cols-3 lg:grid-cols-5 gap-1">
              <TabsTrigger value="profile" className="text-xs sm:text-sm px-3 sm:px-4">Profile</TabsTrigger>
              <TabsTrigger value="business" className="text-xs sm:text-sm px-3 sm:px-4">Business</TabsTrigger>
              <TabsTrigger value="invoicing" className="text-xs sm:text-sm px-3 sm:px-4">Invoicing</TabsTrigger>
              <TabsTrigger value="notifications" className="text-xs sm:text-sm px-3 sm:px-4">Notif.</TabsTrigger>
              <TabsTrigger value="security" className="text-xs sm:text-sm px-3 sm:px-4">Security</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Personal Information
                </CardTitle>
                <CardDescription>Update your personal details and contact information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                  <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                    <User className="h-10 w-10 text-primary" />
                  </div>
                  <div>
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Photo
                    </Button>
                    <p className="text-sm text-muted-foreground mt-1">JPG, PNG up to 2MB</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="profile-name">Full Name</Label>
                    <Input
                      id="profile-name"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="profile-email">Email Address</Label>
                    <Input
                      id="profile-email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      disabled
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="profile-phone">Phone Number</Label>
                    <Input
                      id="profile-phone"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="profile-timezone">Timezone</Label>
                    <Select defaultValue="America/New_York">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                        <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                        <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                        <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="profile-bio">Bio</Label>
                  <Textarea
                    id="profile-bio"
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    placeholder="Tell us a bit about yourself..."
                    rows={4}
                  />
                </div>

                <Button onClick={handleSaveProfile} disabled={isSaving} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="business" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building className="h-5 w-5 mr-2" />
                  Business Information
                </CardTitle>
                <CardDescription>Manage your business profile and branding</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                  <div className="h-20 w-20 bg-indigo-500/10 rounded-full flex items-center justify-center shrink-0">
                    <Building className="h-10 w-10 text-indigo-500" />
                  </div>
                  <div>
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Logo
                    </Button>
                    <p className="text-sm text-muted-foreground mt-1">SVG, PNG up to 2MB</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="business-name">Business Name</Label>
                    <Input
                      id="business-name"
                      value={businessData.businessName}
                      onChange={(e) => setBusinessData({ ...businessData, businessName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="business-type">Business Type</Label>
                    <Select 
                      value={businessData.businessType} 
                      onValueChange={(value) => setBusinessData({ ...businessData, businessType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {businessTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="business-website">Website</Label>
                    <Input
                      id="business-website"
                      value={businessData.website}
                      onChange={(e) => setBusinessData({ ...businessData, website: e.target.value })}
                      placeholder="https://your-website.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="business-phone">Business Phone</Label>
                    <Input
                      id="business-phone"
                      placeholder="+1 (555) 987-6543"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="business-address">Business Address</Label>
                  <Textarea
                    id="business-address"
                    value={businessData.address}
                    onChange={(e) => setBusinessData({ ...businessData, address: e.target.value })}
                    placeholder="123 Business St, City, State, ZIP"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="business-description">Business Description</Label>
                  <Textarea
                    id="business-description"
                    value={businessData.description}
                    onChange={(e) => setBusinessData({ ...businessData, description: e.target.value })}
                    placeholder="Describe your business and what you do..."
                    rows={4}
                  />
                </div>

                <Button onClick={handleSaveBusiness} disabled={isSaving} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="invoicing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Invoice Settings
                </CardTitle>
                <CardDescription>Configure your invoice templates and payment settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="invoice-company">Company Name</Label>
                    <Input
                      id="invoice-company"
                      value={invoiceSettings.companyName}
                      onChange={(e) => setInvoiceSettings({ ...invoiceSettings, companyName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="invoice-email">Invoice Email</Label>
                    <Input
                      id="invoice-email"
                      type="email"
                      value={invoiceSettings.email}
                      onChange={(e) => setInvoiceSettings({ ...invoiceSettings, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="invoice-phone">Phone Number</Label>
                    <Input
                      id="invoice-phone"
                      value={invoiceSettings.phone}
                      onChange={(e) => setInvoiceSettings({ ...invoiceSettings, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="invoice-tax-id">Tax ID / EIN</Label>
                    <Input
                      id="invoice-tax-id"
                      value={invoiceSettings.taxId}
                      onChange={(e) => setInvoiceSettings({ ...invoiceSettings, taxId: e.target.value })}
                      placeholder="12-3456789"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="invoice-address">Invoice Address</Label>
                  <Textarea
                    id="invoice-address"
                    value={invoiceSettings.address}
                    onChange={(e) => setInvoiceSettings({ ...invoiceSettings, address: e.target.value })}
                    placeholder="123 Business St, City, State, ZIP"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="payment-terms">Default Payment Terms</Label>
                    <Select 
                      value={invoiceSettings.paymentTerms} 
                      onValueChange={(value) => setInvoiceSettings({ ...invoiceSettings, paymentTerms: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Due on Receipt</SelectItem>
                        <SelectItem value="15">Net 15 Days</SelectItem>
                        <SelectItem value="30">Net 30 Days</SelectItem>
                        <SelectItem value="60">Net 60 Days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="invoice-currency">Currency</Label>
                    <Select defaultValue="USD">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                        <SelectItem value="GBP">GBP (£)</SelectItem>
                        <SelectItem value="CAD">CAD ($)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="invoice-notes">Default Invoice Notes</Label>
                  <Textarea
                    id="invoice-notes"
                    value={invoiceSettings.notes}
                    onChange={(e) => setInvoiceSettings({ ...invoiceSettings, notes: e.target.value })}
                    placeholder="Thank you for your business!"
                    rows={3}
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                  <Button onClick={handleSaveInvoice} disabled={isSaving} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Save className="h-4 w-4 mr-2" />
                    {isSaving ? 'Saving...' : 'Save Settings'}
                  </Button>
                  <Button variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview Invoice
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="h-5 w-5 mr-2" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>Choose how you want to be notified about important events</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="text-sm font-medium">Email Notifications</div>
                      <div className="text-sm text-muted-foreground">Receive notifications via email</div>
                    </div>
                    <Switch
                      checked={notifications.emailNotifications}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, emailNotifications: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="text-sm font-medium">SMS Notifications</div>
                      <div className="text-sm text-muted-foreground">Receive notifications via text message</div>
                    </div>
                    <Switch
                      checked={notifications.smsNotifications}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, smsNotifications: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="text-sm font-medium">Appointment Reminders</div>
                      <div className="text-sm text-muted-foreground">Get reminded about upcoming appointments</div>
                    </div>
                    <Switch
                      checked={notifications.appointmentReminders}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, appointmentReminders: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="text-sm font-medium">Invoice Updates</div>
                      <div className="text-sm text-muted-foreground">Notifications about invoice payments and overdue amounts</div>
                    </div>
                    <Switch
                      checked={notifications.invoiceUpdates}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, invoiceUpdates: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="text-sm font-medium">Marketing Emails</div>
                      <div className="text-sm text-muted-foreground">Tips, tutorials, and product updates</div>
                    </div>
                    <Switch
                      checked={notifications.marketingEmails}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, marketingEmails: checked })}
                    />
                  </div>
                </div>

                <Button onClick={handleSaveNotifications} disabled={isSaving} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save Preferences'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Security Settings
                </CardTitle>
                <CardDescription>Manage your account security and privacy</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-2">Change Password</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="current-password">Current Password</Label>
                        <Input id="current-password" type="password" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input id="new-password" type="password" />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                        <Input id="confirm-password" type="password" />
                      </div>
                    </div>
                    <Button className="mt-4" variant="outline">
                      Update Password
                    </Button>
                  </div>

                  <div className="border-t border-border pt-4">
                    <h4 className="text-sm font-medium text-foreground mb-4">Two-Factor Authentication</h4>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="text-sm font-medium">Enable 2FA</div>
                        <div className="text-sm text-muted-foreground">Add an extra layer of security to your account</div>
                      </div>
                      <Button variant="outline" size="sm">
                        Enable
                      </Button>
                    </div>
                  </div>

                  <div className="border-t border-border pt-4">
                    <h4 className="text-sm font-medium text-foreground mb-4">Login Activity</h4>
                    <div className="space-y-2">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 text-sm">
                        <span>Last login: Jan 24, 2024 at 2:30 PM</span>
                        <span className="text-muted-foreground">Chrome on Windows</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 text-sm">
                        <span>Previous login: Jan 23, 2024 at 9:15 AM</span>
                        <span className="text-muted-foreground">Safari on iPhone</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="mt-2">
                      View All Activity
                    </Button>
                  </div>

                  <div className="border-t border-border pt-4">
                    <h4 className="text-sm font-medium text-destructive mb-4">Danger Zone</h4>
                    <div className="space-y-2">
                      <Button variant="outline" className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground">
                        Delete Account
                      </Button>
                      <p className="text-xs text-muted-foreground">
                        This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Settings;
