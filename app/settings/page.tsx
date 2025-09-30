"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  return (
    <div className="min-h-screen bg-[#0F1115]">
      <Navbar 
        title="Settings" 
        subtitle="Manage your account preferences and billing"
      />
      
      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger 
              value="profile" 
              isActive={activeTab === "profile"}
            >
              Profile
            </TabsTrigger>
            <TabsTrigger 
              value="billing" 
              isActive={activeTab === "billing"}
            >
              Billing
            </TabsTrigger>
            <TabsTrigger 
              value="preferences" 
              isActive={activeTab === "preferences"}
            >
              Preferences
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-6">
            <Card className="bg-[#1A1D23] border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarFallback className="text-lg">JD</AvatarFallback>
                  </Avatar>
                  <div>
                    <Button variant="outline" size="sm">
                      Change Avatar
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Username
                    </label>
                    <div className="p-3 bg-gray-800 rounded-lg text-white">
                      john.doe
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Email
                    </label>
                    <div className="p-3 bg-gray-800 rounded-lg text-white">
                      john.doe@example.com
                    </div>
                  </div>
                </div>
                
                <Button className="w-full md:w-auto">
                  Update Profile
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing" className="mt-6">
            <Card className="bg-[#1A1D23] border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Subscription</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
                  <div>
                    <h3 className="text-white font-medium">Pro Plan</h3>
                    <p className="text-gray-400 text-sm">Unlimited AI generations</p>
                  </div>
                  <Badge variant="default">Active</Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Billing Cycle
                    </label>
                    <div className="p-3 bg-gray-800 rounded-lg text-white">
                      Monthly
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Next Payment
                    </label>
                    <div className="p-3 bg-gray-800 rounded-lg text-white">
                      Jan 15, 2024
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-4">
                  <Button variant="outline">
                    Change Plan
                  </Button>
                  <Button variant="destructive">
                    Cancel Subscription
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences" className="mt-6">
            <Card className="bg-[#1A1D23] border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-medium">Email Notifications</h3>
                    <p className="text-gray-400 text-sm">Receive updates about your generations</p>
                  </div>
                  <Switch 
                    checked={notifications}
                    onCheckedChange={setNotifications}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-medium">Dark Mode</h3>
                    <p className="text-gray-400 text-sm">Use dark theme across the application</p>
                  </div>
                  <Switch 
                    checked={darkMode}
                    onCheckedChange={setDarkMode}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-medium">Auto-save Generations</h3>
                    <p className="text-gray-400 text-sm">Automatically save your AI generations</p>
                  </div>
                  <Switch checked={true} />
                </div>
                
                <Button className="w-full md:w-auto">
                  Save Preferences
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
