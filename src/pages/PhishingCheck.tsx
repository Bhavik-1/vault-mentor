import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Globe, Shield, AlertTriangle, CheckCircle, ExternalLink, Search } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface PhishingResult {
  url: string;
  safe: boolean;
  risk: "low" | "medium" | "high";
  reasons: string[];
  domainAge?: number;
  reputation?: "good" | "suspicious" | "malicious";
}

const commonPhishingDomains = [
  "paypal-security.com",
  "amazon-verification.net", 
  "microsoft-security.org",
  "google-account-verify.com",
  "facebook-security.net",
];

const recentScams = [
  {
    type: "Student Loan Forgiveness",
    description: "Fake government portals asking for SSN and banking info",
    indicators: ["Urgent deadlines", "Upfront fees", "Unsecured websites"],
  },
  {
    type: "University Email Verification",
    description: "Phishing emails mimicking university IT departments",
    indicators: ["Generic greetings", "Suspicious sender", "Password requests"],
  },
  {
    type: "Scholarship Scams",
    description: "Fake scholarship offers requiring personal information",
    indicators: ["Too good to be true", "Application fees", "Poor grammar"],
  },
];

export default function PhishingCheck() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<PhishingResult | null>(null);
  const [loading, setLoading] = useState(false);

  const checkUrl = async () => {
    if (!url.trim()) {
      toast({
        title: "Error",
        description: "Please enter a URL to check",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock phishing detection logic
    const cleanUrl = url.toLowerCase().replace(/^https?:\/\//, "");
    const domain = cleanUrl.split("/")[0];
    
    let safe = true;
    let risk: "low" | "medium" | "high" = "low";
    const reasons: string[] = [];
    
    // Check against known phishing domains
    if (commonPhishingDomains.some(d => domain.includes(d))) {
      safe = false;
      risk = "high";
      reasons.push("Domain matches known phishing patterns");
    }
    
    // Check for suspicious patterns
    if (domain.includes("-") && (domain.includes("paypal") || domain.includes("amazon") || domain.includes("microsoft"))) {
      safe = false;
      risk = "medium";
      reasons.push("Suspicious use of hyphens in trusted brand domain");
    }
    
    if (domain.includes("verify") || domain.includes("security") || domain.includes("update")) {
      if (!safe) risk = "high";
      else risk = "medium";
      reasons.push("Contains security-related keywords often used in phishing");
    }
    
    if (!safe && reasons.length === 0) {
      reasons.push("General suspicious patterns detected");
    }
    
    if (safe && risk === "low") {
      reasons.push("No suspicious patterns detected");
      reasons.push("Domain appears legitimate");
    }

    setResult({
      url: cleanUrl,
      safe,
      risk,
      reasons,
      domainAge: Math.floor(Math.random() * 3000) + 100,
      reputation: safe ? "good" : risk === "high" ? "malicious" : "suspicious",
    });
    
    setLoading(false);
  };

  const getRiskBadge = (risk: string, safe: boolean) => {
    if (safe) return <Badge className="bg-success text-success-foreground">Safe</Badge>;
    
    switch (risk) {
      case "high":
        return <Badge className="bg-danger text-danger-foreground">High Risk</Badge>;
      case "medium":
        return <Badge className="bg-warning text-warning-foreground">Medium Risk</Badge>;
      default:
        return <Badge className="bg-muted text-muted-foreground">Low Risk</Badge>;
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Phishing URL Checker</h1>
        <p className="text-muted-foreground">
          Verify if a website is safe before entering your credentials
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* URL Checker */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                URL Security Check
              </CardTitle>
              <CardDescription>
                Enter a suspicious URL to check if it's safe
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="url">Website URL</Label>
                <div className="flex gap-2">
                  <Input
                    id="url"
                    placeholder="https://suspicious-website.com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && checkUrl()}
                  />
                  <Button onClick={checkUrl} disabled={loading}>
                    {loading ? (
                      "Checking..."
                    ) : (
                      <>
                        <Search className="w-4 h-4 mr-2" />
                        Check
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          {result && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    {result.safe ? (
                      <CheckCircle className="w-5 h-5 text-success" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-danger" />
                    )}
                    Security Analysis
                  </span>
                  {getRiskBadge(result.risk, result.safe)}
                </CardTitle>
                <CardDescription className="font-mono text-sm">
                  {result.url}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert className={result.safe ? "border-success bg-success-light" : "border-danger bg-danger-light"}>
                  <AlertDescription>
                    {result.safe ? (
                      <span className="text-success-foreground">
                        This URL appears to be safe. However, always exercise caution when entering personal information.
                      </span>
                    ) : (
                      <span className="text-danger-foreground">
                        ⚠️ This URL shows signs of being potentially dangerous. Do not enter personal information.
                      </span>
                    )}
                  </AlertDescription>
                </Alert>

                <div className="space-y-3">
                  <h4 className="font-semibold">Analysis Details:</h4>
                  <ul className="space-y-1">
                    {result.reasons.map((reason, index) => (
                      <li key={index} className="text-sm flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${result.safe ? "bg-success" : "bg-danger"}`} />
                        {reason}
                      </li>
                    ))}
                  </ul>
                </div>

                {result.domainAge && (
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div>
                      <p className="text-sm text-muted-foreground">Domain Age</p>
                      <p className="font-semibold">{result.domainAge} days</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Reputation</p>
                      <p className="font-semibold capitalize">{result.reputation}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Security Education */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                How to Spot Phishing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Red Flags:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Urgent action required</li>
                  <li>• Suspicious sender address</li>
                  <li>• Poor grammar/spelling</li>
                  <li>• Requests for personal info</li>
                  <li>• Unfamiliar domains</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Stay Safe:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Verify sender independently</li>
                  <li>• Check URLs carefully</li>
                  <li>• Use 2FA when available</li>
                  <li>• Keep software updated</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Common Student Scams</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentScams.map((scam, index) => (
                <div key={index} className="space-y-2">
                  <h4 className="font-semibold text-sm text-danger">{scam.type}</h4>
                  <p className="text-xs text-muted-foreground">{scam.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {scam.indicators.map((indicator, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {indicator}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Educational Resources */}
      <Card>
        <CardHeader>
          <CardTitle>Learn More About Phishing</CardTitle>
          <CardDescription>
            Expand your knowledge with these resources
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button variant="outline" className="justify-start h-auto p-4">
              <div className="flex items-start gap-3">
                <ExternalLink className="w-4 h-4 mt-1 flex-shrink-0" />
                <div className="text-left">
                  <p className="font-semibold text-sm">Phishing Quiz</p>
                  <p className="text-xs text-muted-foreground">Test your phishing detection skills</p>
                </div>
              </div>
            </Button>
            
            <Button variant="outline" className="justify-start h-auto p-4">
              <div className="flex items-start gap-3">
                <ExternalLink className="w-4 h-4 mt-1 flex-shrink-0" />
                <div className="text-left">
                  <p className="font-semibold text-sm">Security Tips</p>
                  <p className="text-xs text-muted-foreground">Learn advanced security practices</p>
                </div>
              </div>
            </Button>
            
            <Button variant="outline" className="justify-start h-auto p-4">
              <div className="flex items-start gap-3">
                <ExternalLink className="w-4 h-4 mt-1 flex-shrink-0" />
                <div className="text-left">
                  <p className="font-semibold text-sm">Report Phishing</p>
                  <p className="text-xs text-muted-foreground">Help protect other students</p>
                </div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}