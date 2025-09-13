import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, Search, Eye, EyeOff, Copy, Edit, Trash2, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { PasswordVerificationDialog } from "@/components/auth/PasswordVerificationDialog";
import { AddPasswordDialog } from "@/components/password/AddPasswordDialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

// --- SafeStudy Theme CSS ---
const styles = `
.safestudy-bg {
  background: linear-gradient(90deg, #0a1a47 0%, #1d2a6f 100%);
  min-height: 100vh;
}
.safestudy-card {
  background: rgba(30, 41, 100, 0.85);
  border-radius: 1.5rem;
  box-shadow: 0 4px 32px rgba(59,130,246,0.14);
  border: 1px solid rgba(59,130,246,0.14);
  color: #e0eaff;
  backdrop-filter: blur(8px);
  position: relative;
  overflow: hidden;
  animation: fadeInUp 1s;
}
.safestudy-card::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 1.5rem;
  pointer-events: none;
  background: linear-gradient(120deg, #3b82f6 0%, #1e293b 100%);
  opacity: 0.08;
  z-index: 0;
}
.safestudy-title {
  font-size: 2.2rem;
  font-weight: 800;
  color: #5a7bd6;
  margin-bottom: 1rem;
  letter-spacing: -1px;
  text-align: left;
  background: linear-gradient(90deg, #3b82f6 0%, #60a5fa 100%);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent !important;
  animation: gradientTextMove 3s infinite alternate;
}
@keyframes gradientTextMove {
  0% { background-position: 0%;}
  100% { background-position: 100%;}
}
.safestudy-label {
  font-weight: 600;
  color: #93c5fd;
  margin-bottom: 0.5rem;
  display: block;
}
.safestudy-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 1rem;
  border: 1.5px solid #3b82f6;
  background: rgba(20, 30, 70, 0.7);
  color: #e0eaff;
  margin-bottom: 1.5rem;
  font-size: 1rem;
  transition: border 0.2s;
  outline: none;
}
.safestudy-input:focus {
  border-color: #60a5fa;
  box-shadow: 0 0 0 2px #60a5fa44;
}
.safestudy-btn {
  background: linear-gradient(90deg, #3b82f6 60%, #60a5fa 100%);
  color: #fff;
  font-weight: bold;
  padding: 1rem 2.5rem;
  border-radius: 2rem;
  box-shadow: 0 4px 24px rgba(59,130,246,0.18);
  transition: box-shadow 0.2s, transform 0.2s;
  display: inline-flex;
  align-items: center;
  font-size: 1.15rem;
  border: none;
  cursor: pointer;
  width: 100%;
  justify-content: center;
  margin-bottom: 0.5rem;
  position: relative;
  overflow: hidden;
  z-index: 1;
}
.safestudy-btn:hover {
  box-shadow: 0 0 32px 0 #3b82f6, 0 8px 32px rgba(59,130,246,0.28);
  transform: scale(1.05);
}
.safestudy-btn:active {
  transform: scale(1.08);
  box-shadow: 0 0 48px 0 #3b82f6, 0 12px 48px rgba(59,130,246,0.28);
}
.safestudy-section {
  padding: 2.5rem 1.5rem;
}
.safestudy-badge {
  font-weight: bold;
  border-radius: 1rem;
  padding: 0.4rem 1.2rem;
  font-size: 1rem;
  letter-spacing: 0.02em;
}
.safestudy-badge.strong {
  background: linear-gradient(90deg, #22c55e 0%, #3b82f6 100%);
  color: #fff;
}
.safestudy-badge.medium {
  background: linear-gradient(90deg, #fbbf24 0%, #3b82f6 100%);
  color: #fff;
}
.safestudy-badge.weak {
  background: linear-gradient(90deg, #ef4444 0%, #3b82f6 100%);
  color: #fff;
}
.safestudy-badge.breached {
  background: linear-gradient(90deg, #ef4444 0%, #3b82f6 100%);
  color: #fff;
}
.safestudy-overview-row {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}
.safestudy-overview-card {
  background: rgba(30, 41, 100, 0.85);
  border-radius: 1.2rem;
  box-shadow: 0 2px 16px rgba(59,130,246,0.10);
  border: 1px solid rgba(59,130,246,0.10);
  color: #e0eaff;
  backdrop-filter: blur(6px);
  position: relative;
  overflow: hidden;
  animation: fadeInUp 1s;
  min-width: 220px;
  flex: 1 1 220px;
  display: flex;
  align-items: center;
  padding: 1.5rem 2rem;
  justify-content: space-between;
}
.safestudy-overview-card .overview-label {
  color: #93c5fd;
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 0.2rem;
}
.safestudy-overview-card .overview-value {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 0.2rem;
}
.safestudy-overview-card .overview-icon {
  margin-left: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
.safestudy-search-wrap {
  position: relative;
  margin-bottom: 2rem;
  max-width: 400px;
}
.safestudy-search {
  background: rgba(20, 30, 70, 0.7);
  border-radius: 1rem;
  border: 1.5px solid #3b82f6;
  color: #e0eaff;
  padding-left: 2.5rem;
  font-size: 1rem;
  height: 2.8rem;
  width: 100%;
  transition: border 0.2s;
}
.safestudy-search:focus {
  border-color: #60a5fa;
  box-shadow: 0 0 0 2px #60a5fa44;
}
.safestudy-search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #93c5fd;
  pointer-events: none;
}
.safestudy-list-label {
  color: #93c5fd;
  font-weight: 600;
  font-size: 1.1rem;
}
.safestudy-password-mono {
  font-family: 'Fira Mono', 'Menlo', 'Monaco', 'Consolas', monospace;
  color: #e0eaff;
  font-size: 1rem;
}
.safestudy-password-dot {
  letter-spacing: 0.2em;
  color: #b7c5ff;
}
.safestudy-age {
  color: #b7c5ff;
}
.safestudy-empty {
  background: rgba(30, 41, 100, 0.85);
  border-radius: 1.5rem;
  color: #b7c5ff;
  padding: 2.5rem 1.5rem;
  text-align: center;
  margin-top: 2rem;
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(2rem);}
  to { opacity: 1; transform: none;}
}
`;

interface PasswordEntry {
  id: string;
  service: string;
  username: string;
  password: string;
  created_at: string;
  updated_at: string;
  strength: "weak" | "medium" | "strong";
  breached: boolean;
}

export default function Dashboard() {
  useEffect(() => {
    const styleTag = document.createElement("style");
    styleTag.textContent = styles;
    document.head.appendChild(styleTag);
    return () => {
      document.head.removeChild(styleTag);
    };
  }, []);

  const [passwords, setPasswords] = useState<PasswordEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [visiblePasswords, setVisiblePasswords] = useState<Set<string>>(new Set());
  const [pendingPasswordId, setPendingPasswordId] = useState<string | null>(null);
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();

  // Load passwords from database
  const loadPasswords = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('passwords')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) {
        toast({
          title: "Error Loading Passwords",
          description: "Failed to load your passwords. Please try again.",
          variant: "destructive",
        });
      } else {
        // Transform database format to component format
        const transformedPasswords: PasswordEntry[] = data.map(password => ({
          id: password.id,
          service: password.service,
          username: password.username,
          password: password.encrypted_password,
          created_at: password.created_at,
          updated_at: password.updated_at,
          strength: password.strength as "weak" | "medium" | "strong",
          breached: password.breached
        }));
        setPasswords(transformedPasswords);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred while loading passwords.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPasswords();
  }, [user?.id]);

  const filteredPasswords = passwords.filter(
    (p) =>
      p.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const togglePasswordVisibility = (id: string) => {
    const newVisible = new Set(visiblePasswords);
    if (newVisible.has(id)) {
      // If password is visible, hide it without verification
      newVisible.delete(id);
      setVisiblePasswords(newVisible);
    } else {
      // If password is hidden, require verification to show it
      setPendingPasswordId(id);
      setShowVerificationDialog(true);
    }
  };

  const handlePasswordVerified = () => {
    if (pendingPasswordId) {
      const newVisible = new Set(visiblePasswords);
      newVisible.add(pendingPasswordId);
      setVisiblePasswords(newVisible);
      setPendingPasswordId(null);
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${type} copied to clipboard`,
    });
  };

  const getStrengthBadge = (strength: string) => {
    switch (strength) {
      case "strong":
        return <span className="safestudy-badge strong">Strong</span>;
      case "medium":
        return <span className="safestudy-badge medium">Medium</span>;
      case "weak":
        return <span className="safestudy-badge weak">Weak</span>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getPasswordAge = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const securityScore = passwords.length
    ? Math.round(
        (passwords.filter(p => p.strength === "strong").length / passwords.length) * 100
      )
    : 0;

  return (
    <div className="safestudy-bg safestudy-section">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        <div>
          <h1 className="safestudy-title">Password Vault</h1>
          <p className="text-[#b7c5ff]">Manage your secure passwords</p>
        </div>
        <Button 
          onClick={() => setShowAddDialog(true)}
          className="safestudy-btn w-auto px-6 py-3"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Password
        </Button>
      </div>

      {/* Security Overview */}
      <div className="safestudy-overview-row">
        <div className="safestudy-overview-card">
          <div>
            <div className="overview-label">Security Score</div>
            <div className="overview-value text-[#60a5fa]">{securityScore}%</div>
          </div>
          <div className="overview-icon">
            <CheckCircle className="w-8 h-8 text-success" />
          </div>
        </div>
        <div className="safestudy-overview-card">
          <div>
            <div className="overview-label">Total Passwords</div>
            <div className="overview-value text-[#e0eaff]">{passwords.length}</div>
          </div>
          <div className="overview-icon">
            <span className="text-white font-bold text-2xl">🔐</span>
          </div>
        </div>
        <div className="safestudy-overview-card">
          <div>
            <div className="overview-label">Weak Passwords</div>
            <div className="overview-value text-[#ef4444]">
              {passwords.filter(p => p.strength === "weak").length}
            </div>
          </div>
          <div className="overview-icon">
            <AlertTriangle className="w-8 h-8 text-danger" />
          </div>
        </div>
        <div className="safestudy-overview-card">
          <div>
            <div className="overview-label">Breached</div>
            <div className="overview-value text-[#ef4444]">
              {passwords.filter(p => p.breached).length}
            </div>
          </div>
          <div className="overview-icon">
            <AlertTriangle className="w-8 h-8 text-danger" />
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="safestudy-search-wrap">
        <Search className="safestudy-search-icon w-4 h-4" />
        <input
          placeholder="Search passwords..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="safestudy-search"
        />
      </div>

      {/* Password List */}
      <div className="grid gap-4">
        {filteredPasswords.map((password) => (
          <div key={password.id} className="safestudy-card hover:shadow-card transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-lg safestudy-list-label">{password.service}</h3>
                    {getStrengthBadge(password.strength)}
                    {password.breached && (
                      <span className="safestudy-badge breached flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Breached
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-[#93c5fd]">Username:</span>
                      <span className="safestudy-password-mono">{password.username}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(password.username, "Username")}
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[#93c5fd]">Password:</span>
                      <span className={visiblePasswords.has(password.id) ? "safestudy-password-mono" : "safestudy-password-dot"}>
                        {visiblePasswords.has(password.id) 
                          ? password.password 
                          : "•".repeat(password.password.length)
                        }
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => togglePasswordVisibility(password.id)}
                      >
                        {visiblePasswords.has(password.id) ? (
                          <EyeOff className="w-3 h-3" />
                        ) : (
                          <Eye className="w-3 h-3" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(password.password, "Password")}
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs safestudy-age">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Updated {getPasswordAge(password.updated_at)} days ago
                    </div>
                    {getPasswordAge(password.updated_at) > 90 && (
                      <Badge variant="outline" className="text-xs">
                        Consider updating
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-danger hover:text-danger">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </div>
        ))}
      </div>

      {filteredPasswords.length === 0 && (
        <div className="safestudy-empty">
          <Search className="w-12 h-12 text-[#93c5fd] mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No passwords found</h3>
          <p>
            {searchTerm ? "Try adjusting your search term" : "Add your first password to get started"}
          </p>
        </div>
      )}

      <PasswordVerificationDialog
        isOpen={showVerificationDialog}
        onClose={() => {
          setShowVerificationDialog(false);
          setPendingPasswordId(null);
        }}
        onVerified={handlePasswordVerified}
      />

      <AddPasswordDialog
        isOpen={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        onPasswordAdded={loadPasswords}
      />
    </div>
  );
}
