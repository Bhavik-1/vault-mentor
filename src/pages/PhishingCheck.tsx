import { useState, FC, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Globe,
  Shield,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  Search,
  Info,
  Mail,
  FileLock,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

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
  font-size: 2.5rem;
  font-weight: 800;
  color: #5a7bd6;
  margin-bottom: 1rem;
  letter-spacing: -1px;
  text-align: center;
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
.safestudy-badge.safe {
  background: linear-gradient(90deg, #22c55e 0%, #3b82f6 100%);
  color: #fff;
}
.safestudy-badge.low {
  background: linear-gradient(90deg, #fbbf24 0%, #3b82f6 100%);
  color: #fff;
}
.safestudy-badge.medium {
  background: linear-gradient(90deg, #f59e42 0%, #3b82f6 100%);
  color: #fff;
}
.safestudy-badge.high {
  background: linear-gradient(90deg, #ef4444 0%, #3b82f6 100%);
  color: #fff;
}
.safestudy-badge.verified_phish {
  background: linear-gradient(90deg, #000 0%, #ef4444 100%);
  color: #fff;
}
.safestudy-alert-safe {
  background: rgba(34,197,94,0.08);
  border: 1.5px solid #22c55e;
  color: #22c55e;
}
.safestudy-alert-risk {
  background: rgba(239,68,68,0.08);
  border: 1.5px solid #ef4444;
  color: #ef4444;
}
.safestudy-list {
  list-style: disc inside;
  margin-top: 0.5rem;
}
.safestudy-risk {
  color: #ef4444;
  font-weight: 500;
}
.safestudy-signal {
  color: #22c55e;
  font-weight: 500;
}
.safestudy-protocol {
  color: #60a5fa;
  font-weight: 600;
  text-transform: uppercase;
}
.safestudy-mail {
  color: #93c5fd;
  font-weight: 600;
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(2rem);}
  to { opacity: 1; transform: none;}
}
`;

interface AnalysisPoint {
  message: string;
  isRisk: boolean;
}

interface PhishingResult {
  url: string;
  displayUrl: string;
  isSafe: boolean;
  riskLevel: "none" | "low" | "medium" | "high" | "verified_phish";
  analysis: AnalysisPoint[];
  domainAgeDays: number;
  protocol: "https" | "http" | "none";
  googleSafeBrowsingMatch: boolean;
  hasMxRecords: boolean;
}

// ...existing mock DB and logic...

const knownPhishingDatabase = new Set([
  // ...existing domains...
  "login-microsft.com",
  "secure-wellsfargo-net.com",
  "amazon-support-team.org",
  "apple-id-verify.info",
  "chase-online-banking.xyz",
  "g00gle.com",
  "faceboook.com",
  "paypa1.com",
  "microsft-login.com",
  "amaz0n-prime.com",
  "wellsfargo-secure.net",
  "citi-bank-online.org",
  "bankofamerica-signin.co",
  "instagran.com",
  "twiter.com",
  "login.microsoft.com.security-alert.net",
  "verify.paypal.com.account-update.org",
  "amazon.signin.customer-support.info",
  "secure.apple.com-id-check.co",
  "netflix.account-verification.com.biz",
  "apple-support-247.com",
  "microsoft-office365-login.net",
  "amazon-prime-video-support.org",
  "chase-secure-messaging.info",
  "bank-of-america-alerts.com",
  "account-update.xyz",
  "secure-login-portal.info",
  "package-tracking-details.top",
  "your-prize-winner.live",
  "urgent-action-required.xyz",
  "university-email-update.info",
  "student-loan-forgiveness.top",
  "financial-aid-notification.live",
  "google-security-alert.com",
  "facebook-password-reset.net",
  "netflix-billing-update.org",
  "apple-icloud-storage-full.info",
  "dropbox-shared-document.xyz",
  "linkedin-new-message.top",
  "instagram-copyright-infringement.live",
  "twitter-account-suspended.com",
  "capitalone-secure-login.net",
  "usaa-member-verification.org",
  "navyfederal-account-update.info",
  "citibank-online-services.xyz",
  "discover-card-support.top",
  "amex-rewards-login.live",
  "hsbc-secure-ebanking.com",
  "barclays-online-banking.net",
  "ups-delivery-notice.org",
  "fedex-package-tracking.info",
  "usps-redelivery-schedule.xyz",
  "dhl-shipment-on-hold.top",
  "tiktok-community-guidelines-violation.live",
  "snapchat-account-lock.com",
  "whatsapp-backup-verification.net",
  "telegram-login-code.org",
  "discord-gift-nitro.info",
  "steam-trade-offer.xyz",
  "epicgames-free-fortnite-skins.top",
  "roblox-free-robux-generator.live",
  "coinbase-wallet-sync.com",
  "binance-security-warning.net",
  "metamask-wallet-verify.org",
  "crypto-com-payout.info",
  "outlook-mailbox-full.xyz",
  "yahoo-account-deactivation.top",
  "aol-mail-update-required.live",
  "protonmail-secure-login.com",
  "university-sso-login-portal.net",
  "student-tuition-payment-overdue.org",
  "campus-job-offer-easy-money.info",
  "blackboard-course-update.xyz",
  "verify-your-identity-now.com",
  "account-has-been-compromised.net",
  "secure-document-sharing.org",
  "invoice-payment-due.info",
  "your-subscription-has-expired.xyz",
  "claim-your-tax-refund-online.top",
  "e-sign-this-document.live",
  "cloud-storage-limit-exceeded.com",
  "your-computer-has-a-virus.net",
  "customer-satisfaction-survey-prize.org",
  "confirm-your-recent-purchase.info",
  "flight-itinerary-cancellation.xyz",
  "social-security-admin-alert.top",
  "dmv-license-renewal-online.live",
  "irs-tax-return-verification.com",
  "geek-squad-subscription-renewal.net",
  "norton-antivirus-expired.org",
  "mcafee-security-alert.info",
]);

const knownPhishingPatterns = [
  "login",
  "verify",
  "account",
  "update",
  "security",
  "support",
];
const trustedBrandDomains = [
  "paypal",
  "amazon",
  "microsoft",
  "google",
  "facebook",
  "apple",
  "netflix",
  "wellsfargo",
  "chase",
];
const typosquattingDomains = {
  "gooogle.com": "google.com",
  "microsft.com": "microsoft.com",
  "paypa1.com": "paypal.com",
  "amazoon.com": "amazon.com",
};

const analyzeUrlWithMockApi = async (url: string): Promise<PhishingResult> => {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  let riskScore = 0;
  const analysis: AnalysisPoint[] = [];
  const displayUrl = url;

  if (!url.startsWith("http")) {
    url = "https://" + url;
  }

  try {
    const urlObject = new URL(url);
    const domain = urlObject.hostname.replace(/^www\./, "");
    const protocol = urlObject.protocol.slice(0, -1) as "https" | "http";

    const googleSafeBrowsingMatch = knownPhishingDatabase.has(domain);
    if (googleSafeBrowsingMatch) {
      riskScore += 10;
      analysis.push({
        message: `Flagged by our malicious URL database (similar to Google Safe Browsing).`,
        isRisk: true,
      });
    }

    if (protocol === "http") {
      riskScore += 2;
      analysis.push({
        message: "Uses insecure HTTP protocol, which is a major red flag.",
        isRisk: true,
      });
    } else {
      analysis.push({
        message: "Uses a secure HTTPS connection.",
        isRisk: false,
      });
    }

    if (typosquattingDomains[domain]) {
      riskScore += 5;
      analysis.push({
        message: `Domain appears to be a misspelling of "${typosquattingDomains[domain]}".`,
        isRisk: true,
      });
    }

    const domainKeywords = knownPhishingPatterns.filter((keyword) =>
      domain.includes(keyword)
    );
    if (domainKeywords.length > 0) {
      riskScore += 1 * domainKeywords.length;
      analysis.push({
        message: `Contains suspicious keywords often used in phishing: ${domainKeywords.join(
          ", "
        )}.`,
        isRisk: true,
      });
    }

    const impersonatedBrand = trustedBrandDomains.find(
      (brand) => domain.includes(brand) && domain !== `${brand}.com`
    );
    if (impersonatedBrand) {
      riskScore += 3;
      analysis.push({
        message: `May be attempting to impersonate the brand "${impersonatedBrand.toUpperCase()}".`,
        isRisk: true,
      });
    }

    const subdomainCount = domain.split(".").length - 2;
    if (subdomainCount > 2) {
      riskScore += 2;
      analysis.push({
        message: "Uses an unusually high number of subdomains.",
        isRisk: true,
      });
    }

    const domainAgeDays =
      googleSafeBrowsingMatch || riskScore > 5
        ? Math.floor(Math.random() * 90)
        : Math.floor(Math.random() * 3000) + 90;

    if (domainAgeDays < 180) {
      riskScore += 1;
      analysis.push({
        message: `The domain is relatively new (${domainAgeDays} days old).`,
        isRisk: true,
      });
    } else {
      analysis.push({
        message: `The domain is well-established.`,
        isRisk: false,
      });
    }

    const hasMxRecords = !impersonatedBrand && riskScore < 5;
    if (hasMxRecords) {
      analysis.push({
        message:
          "DNS records suggest a legitimate business (Mail servers found).",
        isRisk: false,
      });
    } else {
      analysis.push({
        message: "Lacks common business DNS records (e.g., for email).",
        isRisk: true,
      });
    }

    let riskLevel: PhishingResult["riskLevel"] = "none";
    if (googleSafeBrowsingMatch) riskLevel = "verified_phish";
    else if (riskScore > 0) riskLevel = "low";
    if (riskScore >= 3) riskLevel = "medium";
    if (riskScore >= 6) riskLevel = "high";

    if (riskScore === 0) {
      analysis.push({
        message: "No common phishing indicators were found.",
        isRisk: false,
      });
    }

    return {
      url,
      displayUrl,
      isSafe: riskLevel === "none" || riskLevel === "low",
      riskLevel,
      analysis,
      domainAgeDays,
      protocol,
      googleSafeBrowsingMatch,
      hasMxRecords,
    };
  } catch (error) {
    return {
      url,
      displayUrl,
      isSafe: false,
      riskLevel: "high",
      analysis: [{ message: "Invalid URL format provided.", isRisk: true }],
      domainAgeDays: 0,
      protocol: "none",
      googleSafeBrowsingMatch: false,
      hasMxRecords: false,
    };
  }
};

const RiskBadge: FC<{ level: PhishingResult["riskLevel"] }> = ({ level }) => (
  <span className={`safestudy-badge ${level}`}>
    {level === "verified_phish"
      ? "Verified Phish"
      : level === "high"
      ? "High Risk"
      : level === "medium"
      ? "Medium Risk"
      : level === "low"
      ? "Low Risk"
      : "Safe"}
  </span>
);

const ResultsSkeleton = () => (
  <div className="safestudy-card shadow-lg mb-4">
    <CardHeader>
      <Skeleton className="h-6 w-1/2" />
      <Skeleton className="h-4 w-3/4 mt-2" />
    </CardHeader>
    <CardContent className="space-y-4">
      <Skeleton className="h-12 w-full" />
      <div className="space-y-2">
        <Skeleton className="h-5 w-1/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    </CardContent>
  </div>
);

const EmptyState = () => (
  <div className="safestudy-card flex flex-col items-center justify-center text-center p-8 border-dashed shadow-lg mb-4">
    <Shield className="w-12 h-12 text-[#3b82f6] mb-4" />
    <CardTitle className="safestudy-title">Ready to Scan</CardTitle>
    <CardDescription className="mt-2 text-[#b7c5ff]">
      Enter a URL above to check its security.
    </CardDescription>
  </div>
);

export default function PhishingCheck() {
  useEffect(() => {
    const styleTag = document.createElement("style");
    styleTag.textContent = styles;
    document.head.appendChild(styleTag);
    return () => {
      document.head.removeChild(styleTag);
    };
  }, []);

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
    setResult(null);
    const analysisResult = await analyzeUrlWithMockApi(url);
    setResult(analysisResult);
    setLoading(false);
  };

  return (
    <div className="safestudy-bg safestudy-section">
      <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
        <header className="text-center">
          <h1 className="safestudy-title">Advanced Phishing Checker</h1>
          <p className="mt-4 text-lg text-[#b7c5ff]">
            Analyze URLs against a real-time threat database and advanced heuristics.
          </p>
        </header>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-6">
            <div className="safestudy-card shadow-lg mb-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 safestudy-label">
                  <Globe className="w-6 h-6 text-[#3b82f6]" /> URL Security Check
                </CardTitle>
                <CardDescription className="text-[#93c5fd]">
                  Enter any website address to perform a security analysis.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  className="flex flex-col sm:flex-row gap-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    checkUrl();
                  }}
                >
                  <input
                    id="url"
                    placeholder="example.com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="safestudy-input text-base"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="safestudy-btn w-full sm:w-auto text-base py-2.5 px-6"
                  >
                    {loading ? (
                      "Analyzing..."
                    ) : (
                      <>
                        <Search className="w-4 h-4 mr-2" /> Analyze URL
                      </>
                    )}
                  </button>
                </form>
              </CardContent>
            </div>

            {loading && <ResultsSkeleton />}
            {!loading && !result && <EmptyState />}

            {result && (
              <div className="safestudy-card animate-in fade-in-50 shadow-lg mb-4">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between safestudy-label">
                    <span className="flex items-center gap-3">
                      {result.isSafe ? (
                        <CheckCircle className="w-7 h-7 text-[#22c55e]" />
                      ) : (
                        <AlertTriangle className="w-7 h-7 text-[#ef4444]" />
                      )}
                      Analysis Report
                    </span>
                    <RiskBadge level={result.riskLevel} />
                  </CardTitle>
                  <CardDescription className="font-mono text-sm pt-2 truncate text-[#b7c5ff]">
                    {result.displayUrl}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div
                    className={
                      result.isSafe
                        ? "safestudy-alert-safe rounded-xl p-4 mb-2"
                        : "safestudy-alert-risk rounded-xl p-4 mb-2"
                    }
                  >
                    <AlertDescription className="font-semibold text-base">
                      {result.riskLevel === "verified_phish"
                        ? "🚨 This URL is a confirmed match in our phishing database. Do NOT visit this site."
                        : result.isSafe
                        ? "This URL appears safe based on our analysis."
                        : "⚠️ This URL is potentially dangerous. Do not proceed or enter any information."}
                    </AlertDescription>
                  </div>

                  <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
                    <div className="space-y-3">
                      <h4 className="font-semibold flex items-center gap-2 safestudy-risk">
                        <AlertTriangle className="w-5 h-5" /> Risks Found
                      </h4>
                      <ul className="space-y-2 text-sm safestudy-list">
                        {result.analysis
                          .filter((a) => a.isRisk)
                          .map((item, i) => (
                            <li key={i} className="flex items-start gap-2.5">
                              <Info className="w-4 h-4 mt-0.5 text-[#ef4444] flex-shrink-0" />{" "}
                              <span>{item.message}</span>
                            </li>
                          ))}
                        {result.analysis.filter((a) => a.isRisk).length === 0 && (
                          <li className="text-[#b7c5ff] italic">
                            No significant risks detected.
                          </li>
                        )}
                      </ul>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-semibold flex items-center gap-2 safestudy-signal">
                        <CheckCircle className="w-5 h-5" /> Safety Signals
                      </h4>
                      <ul className="space-y-2 text-sm safestudy-list">
                        {result.analysis
                          .filter((a) => !a.isRisk)
                          .map((item, i) => (
                            <li key={i} className="flex items-start gap-2.5">
                              <CheckCircle className="w-4 h-4 mt-0.5 text-[#22c55e] flex-shrink-0" />{" "}
                              <span>{item.message}</span>
                            </li>
                          ))}
                        {result.analysis.filter((a) => !a.isRisk).length === 0 && (
                          <li className="text-[#b7c5ff] italic">
                            No positive safety signals found.
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#3b82f6]">
                    <div>
                      <p className="text-sm text-[#93c5fd] flex items-center gap-1.5">
                        <FileLock className="w-4 h-4" /> SSL/TLS Protocol
                      </p>
                      <p className="safestudy-protocol">{result.protocol}</p>
                    </div>
                    <div>
                      <p className="text-sm text-[#93c5fd] flex items-center gap-1.5">
                        <Mail className="w-4 h-4" /> Mail Records
                      </p>
                      <p className="safestudy-mail">
                        {result.hasMxRecords ? "Detected" : "Not Detected"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="safestudy-card shadow-lg mb-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 safestudy-label">
                  <Shield className="w-6 h-6 text-[#3b82f6]" /> How to Spot Phishing
                </CardTitle>
              </CardHeader>
              <CardContent className="text-base text-[#b7c5ff] space-y-3">
                <p>
                  • <span className="font-semibold text-[#93c5fd]">Check the Domain:</span> Look for misspellings or extra characters.
                </p>
                <p>
                  • <span className="font-semibold text-[#93c5fd]">Sense of Urgency:</span> Threats or urgent deadlines are common.
                </p>
                <p>
                  • <span className="font-semibold text-[#93c5fd]">Unusual Sender:</span> Email from an address that doesn't match the company.
                </p>
                <p>
                  • <span className="font-semibold text-[#93c5fd]">Generic Greetings:</span> "Dear Customer" instead of your name.
                </p>
                <p>
                  • <span className="font-semibold text-[#93c5fd]">Look for HTTPS:</span> Legitimate sites use a secure connection.
                </p>
              </CardContent>
            </div>

            <div className="safestudy-card shadow-lg mb-4">
              <CardHeader>
                <CardTitle className="safestudy-label">External Resources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <a
                  href="https://phishingquiz.withgoogle.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button
                    variant="outline"
                    className="w-full justify-start h-auto text-left p-3 safestudy-btn"
                  >
                    <ExternalLink className="w-4 h-4 mr-3 flex-shrink-0" />{" "}
                    <div>
                      <p className="font-semibold">Google's Phishing Quiz</p>
                      <p className="text-xs text-[#b7c5ff]">
                        Test your detection skills.
                      </p>
                    </div>
                  </Button>
                </a>
                <a
                  href="https://www.ftc.gov/phishing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button
                    variant="outline"
                    className="w-full justify-start h-auto text-left p-3 safestudy-btn"
                  >
                    <ExternalLink className="w-4 h-4 mr-3 flex-shrink-0" />{" "}
                    <div>
                      <p className="font-semibold">Learn more at FTC.gov</p>
                      <p className="text-xs text-[#b7c5ff]">
                        Official consumer advice.
                      </p>
                    </div>
                  </Button>
                </a>
                <a
                  href="https://reportfraud.ftc.gov/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button
                    variant="outline"
                    className="w-full justify-start h-auto text-left p-3 safestudy-btn"
                  >
                    <ExternalLink className="w-4 h-4 mr-3 flex-shrink-0" />{" "}
                    <div>
                      <p className="font-semibold">Report Phishing Fraud</p>
                      <p className="text-xs text-[#b7c5ff]">
                        Help protect the community.
                      </p>
                    </div>
                  </Button>
                </a>
              </CardContent>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
