
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Settings as SettingsIcon, 
  User, 
  Building, 
  Bell, 
  CreditCard,
  Shield,
  Palette,
  Upload,
  Save,
  Eye,
  Mail,
  Phone
} from 'lucide-react';
import { toast } from 'sonner';

const Settings = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    bio: ''
  });

  const [businessData, setBusinessData] = useState({
    businessName: user?.businessName || '',
    businessType: user?.businessType || '',
    website: '',
    address: '',
    description: '',
    logo: null as File | null
  });

  const [invoiceSettings, setInvoiceSettings] = useState({
    companyName: user?.businessName || '',
    address: '',
    phone: '',
    email: user?.email || '',
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

  const handleSaveProfile = () => {
    updateUser({
      name: profileData.name,
      email: profileData.email
    });
    toast.success('Profile updated successfully!');
  };

  const handleSaveBusiness = () => {
    updateUser({
      businessName: businessData.businessName,
      businessType: businessData.businessType
    });
    toast.success('Business information updated successfully!');
  };

  const handleSaveInvoice = () => {
    // Save invoice settings to localStorage or backend
    localStorage.setItem('invoiceSettings', JSON.stringify(invoiceSettings));
    toast.success('Invoice settings saved successfully!');
  };

  const handleSaveNotifications = () => {
    // Save notification preferences
    localStorage.setItem('notificationSettings', JSON.stringify(notifications));
    toast.success('Notification preferences updated successfully!');
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

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-bizNeutral-900">Settings</h1>
          <p className="text-bizNeutral-600 mt-2">Manage your account, business, and application preferences</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="business">Business</TabsTrigger>
            <TabsTrigger value="invoicing">Invoicing</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

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
                <div className="flex items-center space-x-6">
                  <div className="h-20 w-20 bg-bizPrimary/10 rounded-full flex items-center justify-center">
                    <User className="h-10 w-10 text-bizPrimary" />
                  </div>
                  <div>
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Photo
                    </Button>
                    <p className="text-sm text-bizNeutral-500 mt-1">JPG, PNG up to 2MB</p>
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

                <Button onClick={handleSaveProfile} className="btn-primary">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
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
                <div className="flex items-center space-x-6">
                  <div className="h-20 w-20 bg-bizAccent/10 rounded-full flex items-center justify-center">
                    <Building className="h-10 w-10 text-bizAccent" />
                  </div>
                  <div>
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Logo
                    </Button>
                    <p className="text-sm text-bizNeutral-500 mt-1">SVG, PNG up to 2MB</p>
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

                <Button onClick={handleSaveBusiness} className="btn-primary">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
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

                <div className="flex items-center space-x-4">
                  <Button onClick={handleSaveInvoice} className="btn-primary">
                    <Save className="h-4 w-4 mr-2" />
                    Save Settings
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
                      <div className="text-sm text-bizNeutral-500">Receive notifications via email</div>
                    </div>
                    <Switch
                      checked={notifications.emailNotifications}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, emailNotifications: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="text-sm font-medium">SMS Notifications</div>
                      <div className="text-sm text-bizNeutral-500">Receive notifications via text message</div>
                    </div>
                    <Switch
                      checked={notifications.smsNotifications}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, smsNotifications: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="text-sm font-medium">Appointment Reminders</div>
                      <div className="text-sm text-bizNeutral-500">Get reminded about upcoming appointments</div>
                    </div>
                    <Switch
                      checked={notifications.appointmentReminders}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, appointmentReminders: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="text-sm font-medium">Invoice Updates</div>
                      <div className="text-sm text-bizNeutral-500">Notifications about invoice payments and overdue amounts</div>
                    </div>
                    <Switch
                      checked={notifications.invoiceUpdates}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, invoiceUpdates: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="text-sm font-medium">Marketing Emails</div>
                      <div className="text-sm text-bizNeutral-500">Tips, tutorials, and product updates</div>
                    </div>
                    <Switch
                      checked={notifications.marketingEmails}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, marketingEmails: checked })}
                    />
                  </div>
                </div>

                <Button onClick={handleSaveNotifications} className="btn-primary">
                  <Save className="h-4 w-4 mr-2" />
                  Save Preferences
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
                    <h4 className="text-sm font-medium text-bizNeutral-900 mb-2">Change Password</h4>
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

                  <div className="border-t border-bizNeutral-200 pt-4">
                    <h4 className="text-sm font-medium text-bizNeutral-900 mb-4">Two-Factor Authentication</h4>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="text-sm font-medium">Enable 2FA</div>
                        <div className="text-sm text-bizNeutral-500">Add an extra layer of security to your account</div>
                      </div>
                      <Button variant="outline" size="sm">
                        Enable
                      </Button>
                    </div>
                  </div>

                  <div className="border-t border-bizNeutral-200 pt-4">
                    <h4 className="text-sm font-medium text-bizNeutral-900 mb-4">Login Activity</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span>Last login: Jan 24, 2024 at 2:30 PM</span>
                        <span className="text-bizNeutral-500">Chrome on Windows</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span>Previous login: Jan 23, 2024 at 9:15 AM</span>
                        <span className="text-bizNeutral-500">Safari on iPhone</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="mt-2">
                      View All Activity
                    </Button>
                  </div>

                  <div className="border-t border-bizNeutral-200 pt-4">
                    <h4 className="text-sm font-medium text-bizError mb-4">Danger Zone</h4>
                    <div className="space-y-2">
                      <Button variant="outline" className="text-bizError border-bizError hover:bg-bizError hover:text-white">
                        Delete Account
                      </Button>
                      <p className="text-xs text-bizNeutral-500">
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
