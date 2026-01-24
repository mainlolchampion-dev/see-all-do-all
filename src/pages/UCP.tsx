import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  User, Settings, Sword, History, CreditCard, Shield, LogOut, ChevronRight,
  Key, Mail, Bell, Lock, UserCircle
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const sidebarLinks = [
  { icon: UserCircle, label: "Account Overview", tab: "overview" },
  { icon: Sword, label: "Characters", tab: "characters" },
  { icon: History, label: "Donation History", tab: "donations" },
  { icon: Settings, label: "Settings", tab: "settings" },
  { icon: Shield, label: "Security", tab: "security" },
];

const characters = [
  { name: "DarkElf", class: "Ghost Hunter", level: 85, online: true },
  { name: "Mage01", class: "Archmage", level: 78, online: false },
  { name: "Tank123", class: "Phoenix Knight", level: 72, online: false },
];

const donations = [
  { id: "#12345", date: "2024-01-20", amount: 30, coins: 3500, status: "Completed" },
  { id: "#12298", date: "2024-01-10", amount: 15, coins: 1600, status: "Completed" },
  { id: "#12150", date: "2023-12-25", amount: 50, coins: 6000, status: "Completed" },
];

export default function UCP() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="flex-1 pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <motion.aside
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:w-64 shrink-0"
            >
              <div className="gaming-card rounded-xl p-4">
                {/* User Info */}
                <div className="flex items-center gap-3 p-4 mb-4 bg-muted/50 rounded-lg">
                  <div className="w-12 h-12 rounded-full bg-gradient-gold flex items-center justify-center">
                    <User className="w-6 h-6 text-background" />
                  </div>
                  <div>
                    <h3 className="font-semibold">DarkElf</h3>
                    <p className="text-xs text-muted-foreground">VIP Member</p>
                  </div>
                </div>

                {/* Navigation */}
                <nav className="space-y-1">
                  {sidebarLinks.map((link) => (
                    <button
                      key={link.tab}
                      onClick={() => setActiveTab(link.tab)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                        activeTab === link.tab
                          ? "bg-primary/20 text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      }`}
                    >
                      <link.icon className="w-5 h-5" />
                      {link.label}
                      <ChevronRight className={`w-4 h-4 ml-auto transition-transform ${activeTab === link.tab ? "rotate-90" : ""}`} />
                    </button>
                  ))}
                </nav>

                <div className="mt-4 pt-4 border-t border-border">
                  <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-destructive" asChild>
                    <Link to="/login">
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.aside>

            {/* Main Content */}
            <motion.main
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1"
            >
              {/* Overview Tab */}
              {activeTab === "overview" && (
                <div className="space-y-6">
                  <h1 className="font-display text-2xl font-bold text-gradient-gold">Account Overview</h1>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="gaming-card rounded-xl p-6">
                      <div className="text-sm text-muted-foreground mb-1">Donation Coins</div>
                      <div className="text-3xl font-bold text-gradient-gold">4,250</div>
                    </div>
                    <div className="gaming-card rounded-xl p-6">
                      <div className="text-sm text-muted-foreground mb-1">Characters</div>
                      <div className="text-3xl font-bold">3</div>
                    </div>
                    <div className="gaming-card rounded-xl p-6">
                      <div className="text-sm text-muted-foreground mb-1">Account Status</div>
                      <div className="text-lg font-semibold text-primary">VIP Active</div>
                    </div>
                  </div>

                  <div className="gaming-card rounded-xl p-6">
                    <h2 className="font-display text-lg font-semibold mb-4">Recent Activity</h2>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between py-2 border-b border-border">
                        <span className="text-sm">Logged in from new device</span>
                        <span className="text-xs text-muted-foreground">2 hours ago</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-border">
                        <span className="text-sm">Password changed</span>
                        <span className="text-xs text-muted-foreground">3 days ago</span>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <span className="text-sm">Donation: $30 (Champion)</span>
                        <span className="text-xs text-muted-foreground">5 days ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Characters Tab */}
              {activeTab === "characters" && (
                <div className="space-y-6">
                  <h1 className="font-display text-2xl font-bold text-gradient-gold">My Characters</h1>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {characters.map((char) => (
                      <div key={char.name} className="gaming-card rounded-xl p-6">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-14 h-14 rounded-lg bg-primary/20 flex items-center justify-center">
                            <Sword className="w-7 h-7 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold flex items-center gap-2">
                              {char.name}
                              {char.online && <span className="w-2 h-2 rounded-full status-online" />}
                            </h3>
                            <p className="text-sm text-muted-foreground">{char.class}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Level</span>
                          <span className="font-bold text-primary">{char.level}</span>
                        </div>
                        <div className="mt-4 flex gap-2">
                          <Button size="sm" variant="outline" className="flex-1">Teleport</Button>
                          <Button size="sm" variant="outline" className="flex-1">Unstuck</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Donations Tab */}
              {activeTab === "donations" && (
                <div className="space-y-6">
                  <h1 className="font-display text-2xl font-bold text-gradient-gold">Donation History</h1>
                  
                  <div className="gaming-card rounded-xl overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-muted/50 border-b border-border">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-semibold">Order ID</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold">Date</th>
                          <th className="px-6 py-4 text-center text-sm font-semibold">Amount</th>
                          <th className="px-6 py-4 text-center text-sm font-semibold">Coins</th>
                          <th className="px-6 py-4 text-right text-sm font-semibold">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {donations.map((donation) => (
                          <tr key={donation.id} className="hover:bg-muted/30 transition-colors">
                            <td className="px-6 py-4 font-medium">{donation.id}</td>
                            <td className="px-6 py-4 text-muted-foreground">{donation.date}</td>
                            <td className="px-6 py-4 text-center">${donation.amount}</td>
                            <td className="px-6 py-4 text-center text-gradient-gold font-semibold">{donation.coins.toLocaleString()}</td>
                            <td className="px-6 py-4 text-right">
                              <span className="px-2 py-1 rounded text-xs font-medium bg-primary/20 text-primary">
                                {donation.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === "settings" && (
                <div className="space-y-6">
                  <h1 className="font-display text-2xl font-bold text-gradient-gold">Account Settings</h1>
                  
                  <div className="gaming-card rounded-xl p-6 space-y-6">
                    <div className="space-y-4">
                      <h2 className="font-semibold flex items-center gap-2">
                        <Mail className="w-4 h-4 text-primary" />
                        Email Address
                      </h2>
                      <div className="flex gap-4">
                        <Input defaultValue="user@example.com" className="bg-muted/50" />
                        <Button variant="outline">Update</Button>
                      </div>
                    </div>

                    <div className="ornament-divider" />

                    <div className="space-y-4">
                      <h2 className="font-semibold flex items-center gap-2">
                        <Bell className="w-4 h-4 text-primary" />
                        Notifications
                      </h2>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label>Email notifications</Label>
                          <Switch />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label>Newsletter</Label>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label>Event reminders</Label>
                          <Switch defaultChecked />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === "security" && (
                <div className="space-y-6">
                  <h1 className="font-display text-2xl font-bold text-gradient-gold">Security</h1>
                  
                  <div className="gaming-card rounded-xl p-6 space-y-6">
                    <div className="space-y-4">
                      <h2 className="font-semibold flex items-center gap-2">
                        <Lock className="w-4 h-4 text-primary" />
                        Change Password
                      </h2>
                      <div className="space-y-3 max-w-md">
                        <div>
                          <Label>Current Password</Label>
                          <Input type="password" className="bg-muted/50 mt-1" />
                        </div>
                        <div>
                          <Label>New Password</Label>
                          <Input type="password" className="bg-muted/50 mt-1" />
                        </div>
                        <div>
                          <Label>Confirm New Password</Label>
                          <Input type="password" className="bg-muted/50 mt-1" />
                        </div>
                        <Button className="btn-glow">Update Password</Button>
                      </div>
                    </div>

                    <div className="ornament-divider" />

                    <div className="space-y-4">
                      <h2 className="font-semibold flex items-center gap-2">
                        <Key className="w-4 h-4 text-primary" />
                        Two-Factor Authentication
                      </h2>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                      <Button variant="outline">Enable 2FA</Button>
                    </div>
                  </div>
                </div>
              )}
            </motion.main>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
