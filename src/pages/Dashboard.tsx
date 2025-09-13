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
        return <Badge className="bg-success text-success-foreground">Strong</Badge>;
      case "medium":
        return <Badge className="bg-warning text-warning-foreground">Medium</Badge>;
      case "weak":
        return <Badge className="bg-danger text-danger-foreground">Weak</Badge>;
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

  const securityScore = Math.round(
    (passwords.filter(p => p.strength === "strong").length / passwords.length) * 100
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Password Vault</h1>
          <p className="text-muted-foreground">Manage your secure passwords</p>
        </div>
        <Button 
          onClick={() => setShowAddDialog(true)}
          className="bg-gradient-hero hover:opacity-90 text-white shadow-soft"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Password
        </Button>
      </div>

      {/* Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Security Score</p>
                <p className="text-2xl font-bold text-primary">{securityScore}%</p>
              </div>
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Passwords</p>
                <p className="text-2xl font-bold">{passwords.length}</p>
              </div>
              <div className="w-8 h-8 bg-gradient-hero rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">🔐</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Weak Passwords</p>
                <p className="text-2xl font-bold text-danger">
                  {passwords.filter(p => p.strength === "weak").length}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-danger" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Breached</p>
                <p className="text-2xl font-bold text-danger">
                  {passwords.filter(p => p.breached).length}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-danger" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Search passwords..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Password List */}
      <div className="grid gap-4">
        {filteredPasswords.map((password) => (
          <Card key={password.id} className="hover:shadow-card transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-lg">{password.service}</h3>
                    {getStrengthBadge(password.strength)}
                    {password.breached && (
                      <Badge className="bg-danger text-danger-foreground">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Breached
                      </Badge>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Username:</span>
                      <span className="font-mono">{password.username}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(password.username, "Username")}
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Password:</span>
                      <span className="font-mono">
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

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
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
          </Card>
        ))}
      </div>

      {filteredPasswords.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No passwords found</h3>
            <p className="text-muted-foreground">
              {searchTerm ? "Try adjusting your search term" : "Add your first password to get started"}
            </p>
          </CardContent>
        </Card>
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