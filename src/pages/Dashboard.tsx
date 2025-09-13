import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, Search, Eye, EyeOff, Copy, Edit, Trash2, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { PasswordVerificationDialog } from "@/components/auth/PasswordVerificationDialog";

interface PasswordEntry {
  id: string;
  service: string;
  username: string;
  password: string;
  lastUpdated: Date;
  strength: "weak" | "medium" | "strong";
  breached: boolean;
}

const mockPasswords: PasswordEntry[] = [
  {
    id: "1",
    service: "Gmail",
    username: "student@university.edu",
    password: "MySecurePassword123!",
    lastUpdated: new Date(2024, 0, 15),
    strength: "strong",
    breached: false,
  },
  {
    id: "2", 
    service: "Canvas LMS",
    username: "student123",
    password: "password123",
    lastUpdated: new Date(2023, 11, 1),
    strength: "weak",
    breached: true,
  },
  {
    id: "3",
    service: "University Portal",
    username: "john.doe",
    password: "UniPortal2024#",
    lastUpdated: new Date(2024, 1, 10),
    strength: "medium",
    breached: false,
  },
  {
    id: "4",
    service: "Netflix",
    username: "student@university.edu",
    password: "StreamingLife456$",
    lastUpdated: new Date(2024, 2, 5),
    strength: "strong",
    breached: false,
  },
];

export default function Dashboard() {
  const [passwords, setPasswords] = useState<PasswordEntry[]>(mockPasswords); 
  const [searchTerm, setSearchTerm] = useState("");
  const [visiblePasswords, setVisiblePasswords] = useState<Set<string>>(new Set());
  const [pendingPasswordId, setPendingPasswordId] = useState<string | null>(null);
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);

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

  const getPasswordAge = (date: Date) => {
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
        <Button className="bg-gradient-hero hover:opacity-90 text-white shadow-soft">
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
                      Updated {getPasswordAge(password.lastUpdated)} days ago
                    </div>
                    {getPasswordAge(password.lastUpdated) > 90 && (
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
    </div>
  );
}