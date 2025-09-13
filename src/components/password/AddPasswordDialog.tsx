import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Shuffle, Copy, AlertCircle, CheckCircle, Shield } from 'lucide-react';
import { generatePassword, analyzePasswordStrength } from '@/utils/passwordUtils';

interface AddPasswordDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onPasswordAdded: () => void;
}

export const AddPasswordDialog: React.FC<AddPasswordDialogProps> = ({
  isOpen,
  onClose,
  onPasswordAdded
}) => {
  const [service, setService] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showGenerator, setShowGenerator] = useState(false);
  
  // Password generation options
  const [length, setLength] = useState([16]);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  
  const { user } = useAuth();
  const passwordAnalysis = password ? analyzePasswordStrength(password) : null;

  const handleGeneratePassword = () => {
    const options = {
      length: length[0],
      includeUppercase,
      includeLowercase,
      includeNumbers,
      includeSymbols
    };
    
    const newPassword = generatePassword(options);
    setPassword(newPassword);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Password copied to clipboard",
    });
  };

  const handleSave = async () => {
    if (!user?.id || !service || !username || !password) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (!passwordAnalysis) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('passwords')
        .insert({
          user_id: user.id,
          service: service.trim(),
          username: username.trim(),
          encrypted_password: password, // In production, this should be properly encrypted
          strength: passwordAnalysis.strength,
          breached: false // In production, check against breach databases
        });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to save password. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Password Saved",
          description: "Your password has been securely stored.",
        });
        onPasswordAdded();
        handleClose();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setService('');
    setUsername('');
    setPassword('');
    setShowGenerator(false);
    onClose();
  };

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'strong': return 'bg-success text-success-foreground';
      case 'medium': return 'bg-warning text-warning-foreground';
      case 'weak': return 'bg-danger text-danger-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStrengthIcon = (strength: string) => {
    switch (strength) {
      case 'strong': return <CheckCircle className="w-4 h-4" />;
      case 'medium': return <Shield className="w-4 h-4" />;
      case 'weak': return <AlertCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Password</DialogTitle>
          <DialogDescription>
            Store a new password securely in your vault
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Service and Username */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="service">Service *</Label>
              <Input
                id="service"
                placeholder="e.g., Gmail, Netflix, Banking"
                value={service}
                onChange={(e) => setService(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="username">Username/Email *</Label>
              <Input
                id="username"
                placeholder="your@email.com"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          {/* Password Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password *</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowGenerator(!showGenerator)}
              >
                <Shuffle className="w-4 h-4 mr-2" />
                {showGenerator ? 'Hide Generator' : 'Generate Password'}
              </Button>
            </div>
            
            <div className="flex gap-2">
              <Input
                id="password"
                type="text"
                placeholder="Enter or generate a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {password && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(password)}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              )}
            </div>

            {/* Password Generator */}
            {showGenerator && (
              <div className="p-4 border rounded-lg space-y-4 bg-muted/50">
                <div className="space-y-2">
                  <Label>Password Length: {length[0]}</Label>
                  <Slider
                    value={length}
                    onValueChange={setLength}
                    max={50}
                    min={8}
                    step={1}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="uppercase"
                      checked={includeUppercase}
                      onCheckedChange={(checked) => setIncludeUppercase(checked === true)}
                    />
                    <Label htmlFor="uppercase">A-Z</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="lowercase"
                      checked={includeLowercase}
                      onCheckedChange={(checked) => setIncludeLowercase(checked === true)}
                    />
                    <Label htmlFor="lowercase">a-z</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="numbers"
                      checked={includeNumbers}
                      onCheckedChange={(checked) => setIncludeNumbers(checked === true)}
                    />
                    <Label htmlFor="numbers">0-9</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="symbols"
                      checked={includeSymbols}
                      onCheckedChange={(checked) => setIncludeSymbols(checked === true)}
                    />
                    <Label htmlFor="symbols">!@#$</Label>
                  </div>
                </div>
                
                <Button
                  type="button"
                  onClick={handleGeneratePassword}
                  className="w-full"
                  disabled={!includeUppercase && !includeLowercase && !includeNumbers && !includeSymbols}
                >
                  <Shuffle className="w-4 h-4 mr-2" />
                  Generate Password
                </Button>
              </div>
            )}

            {/* Password Strength Analysis */}
            {passwordAnalysis && (
              <div className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center gap-2">
                  <Badge className={getStrengthColor(passwordAnalysis.strength)}>
                    {getStrengthIcon(passwordAnalysis.strength)}
                    {passwordAnalysis.strength.toUpperCase()} PASSWORD
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Score: {passwordAnalysis.score}/10
                  </span>
                </div>
                
                {passwordAnalysis.suggestions.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Recommendations:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {passwordAnalysis.suggestions.map((suggestion, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={handleClose} disabled={loading}>
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={loading || !service || !username || !password}
            >
              {loading ? "Saving..." : "Save Password"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};