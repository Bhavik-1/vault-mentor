import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { QrCode, Shield, CheckCircle, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const TwoFactorSetup: React.FC = () => {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [isEnabled, setIsEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'setup' | 'verify' | 'enabled'>('setup');
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    checkTwoFactorStatus();
  }, [user]);

  const checkTwoFactorStatus = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('two_factor_enabled')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error checking 2FA status:', error);
        return;
      }

      if (data?.two_factor_enabled) {
        setIsEnabled(true);
        setStep('enabled');
      }
    } catch (error) {
      console.error('Error checking 2FA status:', error);
    }
  };

  const generateTwoFactorSecret = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: 'totp',
        friendlyName: 'SafeStudy 2FA'
      });

      if (error) {
        toast({
          title: "Setup Failed",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setQrCode(data.totp.qr_code);
      setSecret(data.totp.secret);
      setStep('verify');
    } catch (error: any) {
      toast({
        title: "Setup Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const verifyTwoFactor = async () => {
    if (!user || !verificationCode) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.mfa.challengeAndVerify({
        factorId: user.factors?.[0]?.id || '',
        code: verificationCode
      });

      if (error) {
        toast({
          title: "Verification Failed",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      // Update profile to mark 2FA as enabled
      await supabase
        .from('profiles')
        .update({ two_factor_enabled: true })
        .eq('user_id', user.id);

      setIsEnabled(true);
      setStep('enabled');
      toast({
        title: "2FA Enabled!",
        description: "Two-factor authentication has been successfully enabled.",
      });
    } catch (error: any) {
      toast({
        title: "Verification Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const disableTwoFactor = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Note: In a real implementation, you'd need to properly handle MFA unenrollment
      // This is a simplified version
      await supabase
        .from('profiles')
        .update({ two_factor_enabled: false })
        .eq('user_id', user.id);

      setIsEnabled(false);
      setStep('setup');
      setQrCode(null);
      setSecret(null);
      setVerificationCode('');
      
      toast({
        title: "2FA Disabled",
        description: "Two-factor authentication has been disabled.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (step === 'enabled') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Two-Factor Authentication
            <Badge variant="secondary" className="bg-green-100 text-green-800">Enabled</Badge>
          </CardTitle>
          <CardDescription>
            Your account is protected with two-factor authentication.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              2FA is active. You'll need your authenticator app to sign in.
            </AlertDescription>
          </Alert>
          <Button 
            variant="destructive" 
            onClick={disableTwoFactor}
            disabled={loading}
            className="mt-4"
          >
            {loading ? "Disabling..." : "Disable 2FA"}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Set Up Two-Factor Authentication
          {!isEnabled && <Badge variant="outline">Recommended</Badge>}
        </CardTitle>
        <CardDescription>
          Add an extra layer of security to your password manager account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {step === 'setup' && (
          <div className="space-y-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                You'll need an authenticator app like Google Authenticator, Authy, or 1Password.
              </AlertDescription>
            </Alert>
            <Button onClick={generateTwoFactorSecret} disabled={loading}>
              {loading ? "Setting up..." : "Set up 2FA"}
            </Button>
          </div>
        )}

        {step === 'verify' && qrCode && secret && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="bg-white p-4 rounded-lg inline-block">
                <img src={qrCode} alt="2FA QR Code" className="w-48 h-48" />
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Scan this QR code with your authenticator app
              </p>
            </div>

            <div className="space-y-2">
              <Label>Manual Entry Key</Label>
              <div className="bg-muted p-3 rounded font-mono text-sm break-all">
                {secret}
              </div>
              <p className="text-xs text-muted-foreground">
                Use this key if you can't scan the QR code
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="verification-code">Verification Code</Label>
              <Input
                id="verification-code"
                type="text"
                placeholder="Enter 6-digit code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                maxLength={6}
              />
            </div>

            <Button 
              onClick={verifyTwoFactor} 
              disabled={loading || verificationCode.length !== 6}
              className="w-full"
            >
              {loading ? "Verifying..." : "Verify and Enable 2FA"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TwoFactorSetup;