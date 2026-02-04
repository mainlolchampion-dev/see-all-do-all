import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  User, Settings, Sword, History, CreditCard, LogOut, ChevronRight,
  Key, Mail, Lock, UserCircle, Loader2, Package, Gift, Check
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useUserData } from "@/hooks/useUserData";
import { useDonationHistory } from "@/hooks/useDonationHistory";
import { useToast } from "@/hooks/use-toast";
import { DonateTab } from "@/components/ucp/DonateTab";
import { StarterPacksTab } from "@/components/ucp/StarterPacksTab";
import donateCoinIcon from "@/assets/donate/donate-coin-icon.png";
import premiumIcon from "@/assets/donate/premium-icon.png";
import antharasTreasureIcon from "@/assets/donate/antharas-treasure-icon.png";
import randomSkinBoxIcon from "@/assets/donate/random-skin-box.gif";

const sidebarLinks = [
  { icon: UserCircle, label: "Account Overview", tab: "overview" },
  { icon: CreditCard, label: "Buy Coins", tab: "donate" },
  { icon: Package, label: "Starter Packs", tab: "starter-packs" },
  { icon: History, label: "Donation History", tab: "donations" },
  { icon: Settings, label: "Settings", tab: "settings" },
];

export default function UCP() {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") || "overview";
  const [activeTab, setActiveTab] = useState(initialTab);
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
      const metadataLogin = (session.user.user_metadata as any)?.l2_login;
      if (metadataLogin) {
        setLinkedLogin(metadataLogin);
      }
      
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
        const metadataLogin = (session.user.user_metadata as any)?.l2_login;
        if (metadataLogin) {
          setLinkedLogin(metadataLogin);
        }
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

  // Fetch donation history
  const { data: donations, isLoading: donationsLoading } = useDonationHistory(linkedLogin || undefined);

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
      const isForbidden = (error as any)?.status === 403;
      toast({
        title: "Linking failed",
        description: isForbidden
          ? "This account is not linked to your email. Please use the email associated with the L2 account."
          : "No L2 account found with this name. Please check and try again.",
        variant: "destructive",
      });
      return;
    }

    // Save the linked account
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const trimmedLogin = manualLogin.trim();
      const { error: updateError } = await supabase.auth.updateUser({
        data: { l2_login: trimmedLogin },
      });

      if (updateError) {
        toast({
          title: "Error",
          description: updateError.message || "Failed to link account.",
          variant: "destructive",
        });
        return;
      }

      localStorage.setItem(`l2_linked_account_${session.user.id}`, trimmedLogin);
      setLinkedLogin(trimmedLogin);
      toast({
        title: "Account Linked!",
        description: `Successfully linked to L2 account: ${trimmedLogin}`,
      });
      refetch();
    }
  };

  const handleUnlinkAccount = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      await supabase.auth.updateUser({ data: { l2_login: null } });
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
      <div className="flex-1 pt-20 md:pt-24">
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

              {/* Donate Tab */}
              {activeTab === "donate" && !isLoading && !notLinkedError && (
                <DonateTab 
                  linkedLogin={linkedLogin} 
                  characters={userData?.characters}
                />
              )}

              {/* Starter Packs Tab */}
              {activeTab === "starter-packs" && !isLoading && !notLinkedError && (
                <StarterPacksTab 
                  linkedLogin={linkedLogin} 
                  characters={userData?.characters}
                />
              )}

              {/* Donations Tab */}
              {activeTab === "donations" && !isLoading && !notLinkedError && (
                <div className="space-y-6">
                  <h1 className="font-display text-2xl font-bold text-gradient-gold">Donation History</h1>
                  
                  <div className="gaming-card rounded-xl overflow-hidden">
                    {donationsLoading ? (
                      <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-6 h-6 animate-spin text-primary" />
                        <span className="ml-2 text-muted-foreground">Loading donations...</span>
                      </div>
                    ) : donations && donations.length > 0 ? (
                      <div className="space-y-4 p-4">
                        {donations.map((donation) => {
                          const coins = donation.coins;
                          const bonusCoins = Math.floor(coins * 0.1);
                          const hasPremium = coins >= 1500;
                          const premiumDays = coins >= 25000 ? 21 : coins >= 15000 ? 7 : coins >= 10000 ? 5 : coins >= 5000 ? 3 : coins >= 3000 ? 2 : coins >= 1500 ? 1 : 0;
                          const hasTreasure = coins >= 10000;
                          const treasureCount = coins >= 25000 ? 15 : coins >= 15000 ? 9 : coins >= 10000 ? 6 : 0;
                          
                          return (
                            <div key={donation.id} className="border border-border/50 rounded-lg p-4 bg-muted/20 hover:bg-muted/30 transition-colors">
                              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center p-2">
                                    <img src={donateCoinIcon} alt="Coins" className="w-full h-full object-contain" />
                                  </div>
                                  <div>
                                    <div className="font-semibold">Order {donation.id}</div>
                                    <div className="text-sm text-muted-foreground">{donation.date}</div>
                                  </div>
                                </div>
                                
                                <div className="flex items-center gap-6">
                                  <div className="text-center">
                                    <div className="text-xs text-muted-foreground">Amount</div>
                                    <div className="font-semibold">€{donation.amount}</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="text-xs text-muted-foreground">Coins</div>
                                    <div className="font-bold text-gradient-gold">{coins.toLocaleString()}</div>
                                  </div>
                                  <div>
                                    <span className="px-2 py-1 rounded text-xs font-medium bg-green-500/20 text-green-400 flex items-center gap-1">
                                      <Check className="w-3 h-3" />
                                      {donation.status}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Bonuses Received */}
                              <div className="mt-4 pt-4 border-t border-border/50">
                                <div className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                                  <Gift className="w-3 h-3" />
                                  Bonuses Received
                                </div>
                                <div className="flex flex-wrap gap-3">
                                  {/* +10% Bonus Coins */}
                                  <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-lg text-sm">
                                    <img src={donateCoinIcon} alt="Bonus" className="w-5 h-5" />
                                    <span>+{bonusCoins.toLocaleString()} Bonus Coins</span>
                                  </div>
                                  
                                  {/* Random Skin Box */}
                                  <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-lg text-sm">
                                    <img src={randomSkinBoxIcon} alt="Skin Box" className="w-5 h-5" />
                                    <span>1x Random Skin Box</span>
                                  </div>
                                  
                                  {/* Premium Account */}
                                  {hasPremium && (
                                    <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-lg text-sm">
                                      <img src={premiumIcon} alt="Premium" className="w-5 h-5" />
                                      <span>Premium Account ({premiumDays} days)</span>
                                    </div>
                                  )}
                                  
                                  {/* Treasures Antharas */}
                                  {hasTreasure && (
                                    <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-lg text-sm">
                                      <img src={antharasTreasureIcon} alt="Treasure" className="w-5 h-5" />
                                      <span>{treasureCount}x Treasures Antharas</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-12 text-muted-foreground">
                        <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No donation history found</p>
                        <p className="text-sm mt-2">Your donations will appear here after you make a purchase.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === "settings" && !isLoading && !notLinkedError && (
                <SettingsTab userEmail={userEmail} />
              )}
            </motion.main>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

// Settings Tab Component with Email Change and Security (Password Change)
function SettingsTab({ userEmail }: { userEmail: string | null }) {
  const [newEmail, setNewEmail] = useState("");
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const { toast } = useToast();

  const handleEmailUpdate = async () => {
    if (!newEmail.trim()) {
      toast({
        title: "Error",
        description: "Please enter a new email address",
        variant: "destructive",
      });
      return;
    }

    setIsUpdatingEmail(true);
    try {
      const { error } = await supabase.auth.updateUser({ email: newEmail });
      if (error) throw error;

      toast({
        title: "Verification Email Sent",
        description: "Please check your new email to confirm the change.",
      });
      setIsEditingEmail(false);
      setNewEmail("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update email",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingEmail(false);
    }
  };

  const handlePasswordUpdate = async () => {
    if (!newPassword || !confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill in all password fields",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      });
      return;
    }

    setIsUpdatingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;

      toast({
        title: "Password Updated",
        description: "Your password has been successfully changed.",
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update password",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-gradient-gold">Account Settings</h1>
      
      {/* Email Address Section */}
      <div className="gaming-card rounded-xl p-6 space-y-6">
        <div className="space-y-4">
          <h2 className="font-semibold flex items-center gap-2">
            <Mail className="w-4 h-4 text-primary" />
            Email Address
          </h2>
          
          {!isEditingEmail ? (
            <div className="flex gap-4 items-center">
              <Input value={userEmail || ""} className="bg-muted/50" disabled />
              <Button variant="outline" onClick={() => setIsEditingEmail(true)}>
                Change Email
              </Button>
            </div>
          ) : (
            <div className="space-y-3 max-w-md">
              <div>
                <Label>Current Email</Label>
                <Input value={userEmail || ""} className="bg-muted/50 mt-1" disabled />
              </div>
              <div>
                <Label>New Email Address</Label>
                <Input 
                  type="email" 
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="Enter new email address"
                  className="bg-muted/50 mt-1" 
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={handleEmailUpdate} 
                  disabled={isUpdatingEmail}
                  className="btn-glow"
                >
                  {isUpdatingEmail ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Email"
                  )}
                </Button>
                <Button variant="outline" onClick={() => { setIsEditingEmail(false); setNewEmail(""); }}>
                  Cancel
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                A verification email will be sent to your new address.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Security Section - Password Change */}
      <div className="gaming-card rounded-xl p-6 space-y-6">
        <div className="space-y-4">
          <h2 className="font-semibold flex items-center gap-2">
            <Lock className="w-4 h-4 text-primary" />
            Security - Change Password
          </h2>
          <div className="space-y-3 max-w-md">
            <div>
              <Label>Current Password</Label>
              <Input 
                type="password" 
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="bg-muted/50 mt-1" 
                placeholder="Enter current password"
              />
            </div>
            <div>
              <Label>New Password</Label>
              <Input 
                type="password" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="bg-muted/50 mt-1" 
                placeholder="Enter new password"
              />
            </div>
            <div>
              <Label>Confirm New Password</Label>
              <Input 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-muted/50 mt-1" 
                placeholder="Confirm new password"
              />
            </div>
            <Button 
              onClick={handlePasswordUpdate} 
              disabled={isUpdatingPassword}
              className="btn-glow"
            >
              {isUpdatingPassword ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Password"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
