import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  User, Settings, Sword, History, CreditCard, Shield, LogOut, ChevronRight,
  Key, Mail, Bell, Lock, UserCircle, Loader2
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useUserData } from "@/hooks/useUserData";
import { useToast } from "@/hooks/use-toast";

const sidebarLinks = [
  { icon: UserCircle, label: "Account Overview", tab: "overview" },
  { icon: Sword, label: "Characters", tab: "characters" },
  { icon: History, label: "Donation History", tab: "donations" },
  { icon: Settings, label: "Settings", tab: "settings" },
  { icon: Shield, label: "Security", tab: "security" },
];

// Mock donations - TODO: Fetch from database when donation system is implemented
const donations = [
  { id: "#12345", date: "2024-01-20", amount: 30, coins: 3500, status: "Completed" },
  { id: "#12298", date: "2024-01-10", amount: 15, coins: 1600, status: "Completed" },
  { id: "#12150", date: "2023-12-25", amount: 50, coins: 6000, status: "Completed" },
];

export default function UCP() {
  const [activeTab, setActiveTab] = useState("overview");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [manualLogin, setManualLogin] = useState<string>("");
  const [linkedLogin, setLinkedLogin] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Get the current user session and check for saved linked account
  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
        return;
      }
      setUserEmail(session.user.email || null);
      
      // Check if user has a saved linked L2 account in localStorage
      const savedLogin = localStorage.getItem(`l2_linked_account_${session.user.id}`);
      if (savedLogin) {
        setLinkedLogin(savedLogin);
      }
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/login");
      } else {
        setUserEmail(session.user.email || null);
        const savedLogin = localStorage.getItem(`l2_linked_account_${session.user.id}`);
        if (savedLogin) {
          setLinkedLogin(savedLogin);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Fetch user data - try email first, then use linked login
  const { data: userData, isLoading, error, refetch } = useUserData(
    linkedLogin || undefined, 
    linkedLogin ? undefined : userEmail
  );

  // Check if error is "not linked" error
  const notLinkedError = error && (error as any).notLinked;

  const handleLinkAccount = async () => {
    if (!manualLogin.trim()) {
      toast({
        title: "Error",
        description: "Please enter your L2 account name",
        variant: "destructive",
      });
      return;
    }

    // Try to fetch data with this login
    const { data, error } = await supabase.functions.invoke("user-data", {
      body: { login: manualLogin.trim() },
    });

    if (error || data?.error) {
      toast({
        title: "Account not found",
        description: "No L2 account found with this name. Please check and try again.",
        variant: "destructive",
      });
      return;
    }

    // Save the linked account
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      localStorage.setItem(`l2_linked_account_${session.user.id}`, manualLogin.trim());
      setLinkedLogin(manualLogin.trim());
      toast({
        title: "Account Linked!",
        description: `Successfully linked to L2 account: ${manualLogin.trim()}`,
      });
      refetch();
    }
  };

  const handleUnlinkAccount = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      localStorage.removeItem(`l2_linked_account_${session.user.id}`);
      setLinkedLogin(null);
      setManualLogin("");
      toast({
        title: "Account Unlinked",
        description: "Your L2 account has been unlinked.",
      });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate("/login");
  };

  if (!userEmail) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

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
                    <h3 className="font-semibold">{userData?.login || userEmail?.split("@")[0]}</h3>
                    <p className="text-xs text-muted-foreground">
                      {userData?.characterCount || 0} Characters
                    </p>
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
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-muted-foreground hover:text-destructive"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
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
              {/* Loading State */}
              {isLoading && (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  <span className="ml-2 text-muted-foreground">Loading account data...</span>
                </div>
              )}

              {/* Error State */}
              {error && !isLoading && !notLinkedError && (
                <div className="gaming-card rounded-xl p-6 text-center">
                  <p className="text-destructive mb-2">Failed to load account data</p>
                  <p className="text-sm text-muted-foreground">{error.message}</p>
                </div>
              )}

              {/* Not Linked Error State - Show Link Form */}
              {notLinkedError && !isLoading && !linkedLogin && (
                <div className="space-y-6">
                  <div className="gaming-card rounded-xl p-8">
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                        <Key className="w-8 h-8 text-primary" />
                      </div>
                      <h2 className="font-display text-xl font-bold mb-2">Link Your L2 Account</h2>
                      <p className="text-muted-foreground">
                        Enter your L2 game account name to link it with your web account.
                      </p>
                    </div>
                    
                    <div className="max-w-sm mx-auto space-y-4">
                      <div>
                        <Label htmlFor="l2-login">L2 Account Name</Label>
                        <Input
                          id="l2-login"
                          placeholder="Enter your L2 login name"
                          value={manualLogin}
                          onChange={(e) => setManualLogin(e.target.value)}
                          className="bg-muted/50 mt-1"
                        />
                      </div>
                      <Button onClick={handleLinkAccount} className="w-full btn-glow">
                        Link Account
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Overview Tab */}
              {activeTab === "overview" && !isLoading && !notLinkedError && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h1 className="font-display text-2xl font-bold text-gradient-gold">Account Overview</h1>
                    {linkedLogin && (
                      <Button variant="outline" size="sm" onClick={handleUnlinkAccount}>
                        Unlink Account
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="gaming-card rounded-xl p-6">
                      <div className="text-sm text-muted-foreground mb-1">Donation Coins</div>
                      <div className="text-3xl font-bold text-gradient-gold">
                        {userData?.donationCoins?.toLocaleString() || "0"}
                      </div>
                    </div>
                    <div className="gaming-card rounded-xl p-6">
                      <div className="text-sm text-muted-foreground mb-1">Characters</div>
                      <div className="text-3xl font-bold">{userData?.characterCount || 0}</div>
                    </div>
                    <div className="gaming-card rounded-xl p-6">
                      <div className="text-sm text-muted-foreground mb-1">Account Status</div>
                      <div className="text-lg font-semibold text-primary">
                        {userData?.characters?.some(c => c.online) ? "Online" : "Offline"}
                      </div>
                    </div>
                  </div>

                  <div className="gaming-card rounded-xl p-6">
                    <h2 className="font-display text-lg font-semibold mb-4">Your Characters</h2>
                    {userData?.characters && userData.characters.length > 0 ? (
                      <div className="space-y-3">
                        {userData.characters.slice(0, 5).map((char) => (
                          <div key={char.name} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                            <div className="flex items-center gap-3">
                              <Sword className="w-5 h-5 text-primary" />
                              <div>
                                <span className="font-medium flex items-center gap-2">
                                  {char.name}
                                  {char.online && <span className="w-2 h-2 rounded-full bg-green-500" />}
                                </span>
                                <span className="text-xs text-muted-foreground block">{char.class}</span>
                              </div>
                            </div>
                            <span className="text-sm font-semibold text-primary">Lv. {char.level}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-sm">No characters found for this account.</p>
                    )}
                  </div>
                </div>
              )}

              {/* Characters Tab */}
              {activeTab === "characters" && !isLoading && !notLinkedError && (
                <div className="space-y-6">
                  <h1 className="font-display text-2xl font-bold text-gradient-gold">My Characters</h1>
                  
                  {userData?.characters && userData.characters.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {userData.characters.map((char) => (
                        <div key={char.name} className="gaming-card rounded-xl p-6">
                          <div className="flex items-center gap-4 mb-4">
                            <div className="w-14 h-14 rounded-lg bg-primary/20 flex items-center justify-center">
                              <Sword className="w-7 h-7 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-semibold flex items-center gap-2">
                                {char.name}
                                {char.online && <span className="w-2 h-2 rounded-full bg-green-500" />}
                              </h3>
                              <p className="text-sm text-muted-foreground">{char.class}</p>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">Level</span>
                              <span className="font-bold text-primary">{char.level}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">PvP Kills</span>
                              <span className="font-semibold">{char.pvpkills}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">PK Kills</span>
                              <span className="font-semibold text-destructive">{char.pkkills}</span>
                            </div>
                          </div>
                          <div className="mt-4 flex gap-2">
                            <Button size="sm" variant="outline" className="flex-1">Teleport</Button>
                            <Button size="sm" variant="outline" className="flex-1">Unstuck</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="gaming-card rounded-xl p-6 text-center">
                      <p className="text-muted-foreground">No characters found for this account.</p>
                    </div>
                  )}
                </div>
              )}

              {/* Donations Tab */}
              {activeTab === "donations" && !isLoading && !notLinkedError && (
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
              {activeTab === "settings" && !isLoading && !notLinkedError && (
                <div className="space-y-6">
                  <h1 className="font-display text-2xl font-bold text-gradient-gold">Account Settings</h1>
                  
                  <div className="gaming-card rounded-xl p-6 space-y-6">
                    <div className="space-y-4">
                      <h2 className="font-semibold flex items-center gap-2">
                        <Mail className="w-4 h-4 text-primary" />
                        Email Address
                      </h2>
                      <div className="flex gap-4">
                        <Input defaultValue={userEmail || ""} className="bg-muted/50" disabled />
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
              {activeTab === "security" && !isLoading && !notLinkedError && (
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
