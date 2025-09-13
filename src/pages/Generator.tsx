import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Copy, RefreshCw, Shield, AlertTriangle, CheckCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function Generator() {
  // Inject custom styles for deep blue theme and colored password cards
  useEffect(() => {
    const styleTag = document.createElement("style");
    styleTag.textContent = `
      .generator-bg {
        background: linear-gradient(135deg, #16204a 0%, #23306a 100%);
        min-height: 100vh;
      }
      .glass-card {
        background: rgba(28, 38, 74, 0.85);
        border-radius: 1.25rem;
        box-shadow: 0 4px 32px rgba(59,130,246,0.10);
        border: 1px solid #23306a;
      }
      .text-white { color: #fff !important; }
      .text-blue-accent { color: #60a5fa !important; }
      .text-danger { color: #ef4444 !important; }
      .text-warning { color: #f59e42 !important; }
      .text-success { color: #22c55e !important; }
      .bg-danger-light { background: #fee2e2 !important; color: #ef4444 !important; }
      .bg-warning-light { background: #fef3c7 !important; color: #f59e42 !important; }
      .bg-success-light { background: #dcfce7 !important; color: #22c55e !important; }
      .bg-muted { background: #23306a !important; }
      .text-muted-foreground { color: #b6c2e1 !important; }
      .rounded { border-radius: 0.5rem; }
      .input-bg {
        background: rgba(59,130,246,0.08) !important;
        color: #fff !important;
        border: 1px solid #3b82f6 !important;
      }
      .strength-bar {
        background: #23306a;
        border-radius: 1rem;
        height: 8px;
        width: 100%;
        margin-top: 4px;
        overflow: hidden;
      }
      .strength-fill-danger { background: #ef4444; }
      .strength-fill-warning { background: #f59e42; }
      .strength-fill-success { background: #22c55e; }
      .strength-fill-muted { background: #3b82f6; }
      .examples-section {
        background: none !important;
        box-shadow: none !important;
        border: none !important;
        padding: 0 !important;
      }
    `;
    document.head.appendChild(styleTag);
    return () => {
      document.head.removeChild(styleTag);
    };
  }, []);

  const [password, setPassword] = useState("");
  const [length, setLength] = useState([16]);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [excludeSimilar, setExcludeSimilar] = useState(false);

  const generatePassword = () => {
    let charset = "";
    if (includeUppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (includeLowercase) charset += "abcdefghijklmnopqrstuvwxyz";
    if (includeNumbers) charset += "0123456789";
    if (includeSymbols) charset += "!@#$%^&*()_+-=[]{}|;:,.<>?";
    if (excludeSimilar) {
      charset = charset.replace(/[0O1lI]/g, "");
    }
    if (!charset) {
      toast({
        title: "Error",
        description: "Please select at least one character type",
        variant: "destructive",
      });
      return;
    }
    let result = "";
    for (let i = 0; i < length[0]; i++) {
      result += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setPassword(result);
  };

  const copyPassword = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    toast({
      title: "Copied!",
      description: "Password copied to clipboard",
    });
  };

  const getPasswordStrength = () => {
    if (!password) return { level: "none", score: 0, color: "muted" };
    let score = 0;
    if (password.length >= 12) score += 20;
    if (password.length >= 16) score += 10;
    if (/[A-Z]/.test(password)) score += 20;
    if (/[a-z]/.test(password)) score += 20;
    if (/[0-9]/.test(password)) score += 15;
    if (/[^A-Za-z0-9]/.test(password)) score += 15;
    if (score < 40) return { level: "Weak", score, color: "danger" };
    if (score < 70) return { level: "Medium", score, color: "warning" };
    return { level: "Strong", score, color: "success" };
  };

  const strength = getPasswordStrength();

  return (
    <div className="generator-bg p-6 max-w-4xl mx-auto space-y-6 text-white">
      <div>
        <h1 className="text-3xl font-bold mb-2 text-blue-accent drop-shadow">Password Generator</h1>
        <p className="text-muted-foreground text-lg">
          Generate strong, secure passwords with customizable options
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Generator Settings */}
        <Card className="glass-card text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Shield className="w-5 h-5" />
              Generator Settings
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Customize your password requirements
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 text-white">
            {/* Length Slider */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label htmlFor="length" className="text-white">Password Length</Label>
                <span className="text-sm font-mono bg-muted px-2 py-1 rounded text-white">
                  {length[0]} characters
                </span>
              </div>
              <Slider
                id="length"
                value={length}
                onValueChange={setLength}
                max={64}
                min={8}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-white">
                <span>8</span>
                <span>64</span>
              </div>
            </div>

            {/* Character Options */}
            <div className="space-y-4">
              <Label className="text-white">Character Types</Label>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="uppercase"
                    checked={includeUppercase}
                    onCheckedChange={(checked) => setIncludeUppercase(!!checked)}
                  />
                  <Label htmlFor="uppercase" className="text-sm text-white">
                    Uppercase Letters (A-Z)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="lowercase"
                    checked={includeLowercase}
                    onCheckedChange={(checked) => setIncludeLowercase(!!checked)}
                  />
                  <Label htmlFor="lowercase" className="text-sm text-white">
                    Lowercase Letters (a-z)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="numbers"
                    checked={includeNumbers}
                    onCheckedChange={(checked) => setIncludeNumbers(!!checked)}
                  />
                  <Label htmlFor="numbers" className="text-sm text-white">
                    Numbers (0-9)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="symbols"
                    checked={includeSymbols}
                    onCheckedChange={(checked) => setIncludeSymbols(!!checked)}
                  />
                  <Label htmlFor="symbols" className="text-sm text-white">
                    Symbols (!@#$%^&*)
                  </Label>
                </div>
              </div>
            </div>

            {/* Advanced Options */}
            <div className="space-y-4">
              <Label className="text-white">Advanced Options</Label>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="exclude-similar"
                  checked={excludeSimilar}
                  onCheckedChange={(checked) => setExcludeSimilar(!!checked)}
                />
                <Label htmlFor="exclude-similar" className="text-sm text-white">
                  Exclude similar characters (0, O, 1, l, I)
                </Label>
              </div>
            </div>

            <Button 
              onClick={generatePassword}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white"
              size="lg"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Generate Password
            </Button>
          </CardContent>
        </Card>

        {/* Generated Password */}
        <Card className="glass-card text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <RefreshCw className="w-5 h-5" />
              Generated Password
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Your secure password is ready to use
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 text-white">
            {/* Password Display */}
            <div className="space-y-3">
              <Label htmlFor="password-output" className="text-white">Generated Password</Label>
              <div className="relative">
                <Input
                  id="password-output"
                  value={password}
                  readOnly
                  className="font-mono text-lg pr-12 text-white input-bg"
                  placeholder="Click 'Generate Password' to create a secure password"
                />
                {password && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-white"
                    onClick={copyPassword}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Strength Indicator */}
            {password && (
              <div className="space-y-3">
                <Label className="text-white">Password Strength</Label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {strength.color === "success" && <CheckCircle className="w-4 h-4 text-success" />}
                      {strength.color === "warning" && <AlertTriangle className="w-4 h-4 text-warning" />}
                      {strength.color === "danger" && <AlertTriangle className="w-4 h-4 text-danger" />}
                      <span className={`font-medium text-${strength.color} text-white`}>
                        {strength.level}
                      </span>
                    </div>
                    <span className="text-sm text-white">
                      {strength.score}/100
                    </span>
                  </div>
                  <div className="strength-bar">
                    <div
                      className={
                        `h-full transition-all duration-300 ` +
                        (strength.color === "success"
                          ? "strength-fill-success"
                          : strength.color === "warning"
                          ? "strength-fill-warning"
                          : strength.color === "danger"
                          ? "strength-fill-danger"
                          : "strength-fill-muted")
                      }
                      style={{ width: `${strength.score}%` }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Security Tips */}
            <Card className="bg-muted/50 border-0 text-white">
              <CardContent className="p-4 text-white">
                <h4 className="font-semibold mb-2 flex items-center gap-2 text-white">
                  <Shield className="w-4 h-4 text-blue-accent" />
                  Security Tips
                </h4>
                <ul className="text-sm text-white space-y-1">
                  <li>• Use unique passwords for each account</li>
                  <li>• Store passwords in a secure password manager</li>
                  <li>• Enable two-factor authentication when available</li>
                  <li>• Never share passwords via email or text</li>
                </ul>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>

      {/* Password Examples */}
      <div className="examples-section mt-8">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-white">Password Examples & Guidelines</h2>
          <p className="text-white">Learn what makes a password secure</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <h4 className="font-semibold flex items-center gap-2 text-danger">
              <AlertTriangle className="w-4 h-4" />
              Weak Passwords
            </h4>
            <div className="space-y-1 text-sm">
              <div className="font-mono bg-danger-light p-2 rounded">password123</div>
              <div className="font-mono bg-danger-light p-2 rounded">123456789</div>
              <div className="font-mono bg-danger-light p-2 rounded">qwerty</div>
            </div>
            <p className="text-xs text-danger">
              Too short, common patterns, easily guessed
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold flex items-center gap-2 text-warning">
              <AlertTriangle className="w-4 h-4" />
              Medium Passwords
            </h4>
            <div className="space-y-1 text-sm">
              <div className="font-mono bg-warning-light p-2 rounded">MyPassword2024</div>
              <div className="font-mono bg-warning-light p-2 rounded">Student@Uni</div>
              <div className="font-mono bg-warning-light p-2 rounded">Summer2024!</div>
            </div>
            <p className="text-xs text-warning">
              Better but still predictable patterns
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold flex items-center gap-2 text-success">
              <CheckCircle className="w-4 h-4" />
              Strong Passwords
            </h4>
            <div className="space-y-1 text-sm">
              <div className="font-mono bg-success-light p-2 rounded">X9k$mP2vN&qR7w!</div>
              <div className="font-mono bg-success-light p-2 rounded">Tr3e-House-Blue$8</div>
              <div className="font-mono bg-success-light p-2 rounded">4$kL9#nB2@xV6!</div>
            </div>
            <p className="text-xs text-success">
              Long, random, mixed characters
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
