import React, { useState, useEffect } from "react";

interface StrengthResult {
  label: string;
  class: string;
  score: number;
}

interface PwnedResult {
  pwned: boolean;
  count: number;
  error?: boolean;
}

// --- Enhanced CSS for SafeStudy theme ---
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
.safestudy-bar-bg {
  background: #1e293b;
  border-radius: 1rem;
  height: 1.2rem;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  overflow: hidden;
}
.safestudy-bar {
  height: 1.2rem;
  border-radius: 1rem;
  transition: width 0.7s cubic-bezier(0.4,0,0.2,1), background 0.3s;
}
.safestudy-bar.weak {
  background: linear-gradient(90deg, #ef4444 0%, #f87171 100%);
}
.safestudy-bar.medium {
  background: linear-gradient(90deg, #fbbf24 0%, #f59e42 100%);
}
.safestudy-bar.strong {
  background: linear-gradient(90deg, #22c55e 0%, #3b82f6 100%);
}
.safestudy-section {
  padding: 2.5rem 1.5rem;
}
.safestudy-suggestion {
  background: rgba(59,130,246,0.08);
  color: #a5b4fc;
  border-radius: 1rem;
  padding: 0.5rem 1rem;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: 'Fira Mono', 'Menlo', 'Monaco', 'Consolas', monospace;
  font-size: 1rem;
  transition: background 0.2s;
}
.safestudy-suggestion:hover {
  background: rgba(59,130,246,0.18);
}
.safestudy-copy-btn {
  margin-left: 1rem;
  background: none;
  border: none;
  color: #60a5fa;
  cursor: pointer;
  border-radius: 0.5rem;
  padding: 0.2rem 0.5rem;
  transition: background 0.2s;
}
.safestudy-copy-btn:hover {
  background: #1e293b;
  color: #fff;
}
.safestudy-recommendations {
  color: #b7c5ff;
  font-size: 0.95rem;
}
.safestudy-list {
  list-style: disc inside;
  margin-top: 0.5rem;
}
.safestudy-status {
  font-weight: bold;
  font-size: 1.1rem;
}
.safestudy-status.weak {
  color: #ef4444;
}
.safestudy-status.medium {
  color: #fbbf24;
}
.safestudy-status.strong {
  color: #22c55e;
}
.safestudy-status.breach {
  color: #ef4444;
}
.safestudy-status.safe {
  color: #22c55e;
}
.safestudy-status.common {
  color: #ef4444;
}
.safestudy-status.uncommon {
  color: #22c55e;
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(2rem);}
  to { opacity: 1; transform: none;}
}
`;

function getPasswordStrength(password: string): StrengthResult {
  if (!password) return { label: "", class: "", score: 0 };
  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  const percent = Math.min(100, Math.round((score / 6) * 100));
  const label = percent < 40 ? "Weak" : percent < 75 ? "Medium" : "Strong";
  const cssClass = percent < 40 ? "weak" : percent < 75 ? "medium" : "strong";
  return { label, class: cssClass, score: percent };
}

function generatePasswordSuggestions(password: string): string[] {
  if (!password || password.length < 4) return [];
  const suggestions = new Set<string>();
  const year = new Date().getFullYear();

  const leetMap: Record<string, string> = {
    a: "@",
    e: "3",
    i: "!",
    o: "0",
    s: "$",
  };
  const leetPass = password
    .split("")
    .map((c) => leetMap[c.toLowerCase()] || c)
    .join("");
  if (leetPass !== password) suggestions.add(leetPass + (year % 100));

  let capPass = password.charAt(0).toUpperCase() + password.slice(1);
  if (!/\d/.test(capPass)) capPass += "1";
  if (!/[^A-Za-z0-9]/.test(capPass)) capPass += "!";
  if (capPass !== password) suggestions.add(capPass);

  suggestions.add(password + `_${year}!`);

  if (!password.includes(" ")) suggestions.add(`My_${password}_Key#${year}`);

  return Array.from(suggestions).slice(0, 3);
}

async function sha1Hex(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest("SHA-1", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();
}

async function checkPwnedPassword(password: string): Promise<PwnedResult> {
  const hashHex = await sha1Hex(password);
  const prefix = hashHex.substring(0, 5);
  const suffix = hashHex.substring(5);
  const res = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
  if (!res.ok) throw new Error("HIBP API request failed");
  const text = await res.text();
  const lines = text.split("\n");
  for (const line of lines) {
    const [hashSuffix, count] = line.split(":");
    if (hashSuffix.trim() === suffix) {
      return { pwned: true, count: parseInt(count, 10) };
    }
  }
  return { pwned: false, count: 0 };
}

const PasswordSecurityCheck: React.FC = () => {
  const [password, setPassword] = useState<string>("");
  const [loadingBreach, setLoadingBreach] = useState<boolean>(false);
  const [pwnedInfo, setPwnedInfo] = useState<PwnedResult | null>(null);

  useEffect(() => {
    // Inject theme CSS once
    const styleTag = document.createElement("style");
    styleTag.textContent = styles;
    document.head.appendChild(styleTag);
    return () => {
      document.head.removeChild(styleTag);
    };
  }, []);

  const strength = getPasswordStrength(password);
  const suggestions = generatePasswordSuggestions(password);

  async function handleAnalyze(e: React.FormEvent) {
    e.preventDefault();
    setPwnedInfo(null);
    setLoadingBreach(true);
    try {
      const pwned = await checkPwnedPassword(password);
      setPwnedInfo(pwned);
    } catch (err) {
      console.error(err);
      setPwnedInfo({ pwned: false, count: 0, error: true });
    } finally {
      setLoadingBreach(false);
    }
  }

  async function copyToClipboard(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      alert("Copied to clipboard");
    } catch (err) {
      console.error("Copy failed", err);
      alert("Failed to copy");
    }
  }

  // Treat as "common" if pwned count is very high
  const isCommon = pwnedInfo?.pwned && pwnedInfo.count > 1000;

  return (
    <section className="safestudy-bg safestudy-section">
      <h2 className="safestudy-title">Password Security Check</h2>
      <div className="safestudy-card max-w-2xl mx-auto p-8 shadow-xl">
        <p className="mb-4 text-[#b7c5ff]">
          Enter a password to check its strength and whether it appears in known data breaches.
        </p>
        <form onSubmit={handleAnalyze} className="space-y-4">
          <label className="safestudy-label" htmlFor="password-to-check">
            Password
          </label>
          <input
            id="password-to-check"
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password..."
            className="safestudy-input"
          />
          <button
            id="check-password-btn"
            type="submit"
            className="safestudy-btn"
          >
            Analyze Password
          </button>
        </form>

        <div id="security-check-results" className="mt-8">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span>Strength:</span>
              <span
                id="strength-label"
                className={`safestudy-status ${strength.class}`}
              >
                {strength.label || "-"}
              </span>
            </div>
            <div className="safestudy-bar-bg">
              <div
                id="strength-bar"
                className={`safestudy-bar ${strength.class}`}
                style={{ width: `${strength.score}%` }}
              />
            </div>
            <div className="flex items-center justify-between">
              <span>Found in Breaches:</span>
              <span
                id="breach-status"
                className={`safestudy-status ${
                  loadingBreach
                    ? ""
                    : pwnedInfo && pwnedInfo.pwned
                    ? "breach"
                    : "safe"
                }`}
                style={loadingBreach ? { opacity: 0.7, fontStyle: "italic" } : {}}
              >
                {loadingBreach
                  ? "Checking..."
                  : pwnedInfo
                  ? pwnedInfo.error
                    ? "Error"
                    : pwnedInfo.pwned
                    ? `Yes (${pwnedInfo.count.toLocaleString()} times)`
                    : "No"
                  : "-"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Common Password:</span>
              <span
                id="common-status"
                className={`safestudy-status ${
                  isCommon ? "common" : "uncommon"
                }`}
              >
                {isCommon ? "Yes" : "No"}
              </span>
            </div>
          </div>

          <div className="mt-4 safestudy-recommendations">
            <h5 className="font-semibold mt-2">Recommendations:</h5>
            <ul className="safestudy-list">
              {pwnedInfo?.pwned && (
                <li>
                  This password has appeared in a data breach. Do not use it!
                </li>
              )}
              {password.length > 0 && password.length < 12 && (
                <li>Use at least 12 characters.</li>
              )}
              {password.length > 0 && !/[A-Z]/.test(password) && (
                <li>Include uppercase letters.</li>
              )}
              {password.length > 0 && !/[a-z]/.test(password) && (
                <li>Include lowercase letters.</li>
              )}
              {password.length > 0 && !/[0-9]/.test(password) && (
                <li>Include numbers.</li>
              )}
              {password.length > 0 && !/[^A-Za-z0-9]/.test(password) && (
                <li>Include symbols.</li>
              )}
              {isCommon && (
                <li>Avoid common passwords seen in many breaches.</li>
              )}
            </ul>
          </div>

          {suggestions.length > 0 && (
            <div className="pt-4 mt-4 border-t border-[#3b82f6]">
              <h5 className="font-semibold text-lg mb-2 text-[#93c5fd]">Smart Suggestions:</h5>
              <p className="text-sm mb-3 text-[#b7c5ff]">
                Here are some stronger alternatives you can use:
              </p>
              <div className="space-y-2">
                {suggestions.map((sugg) => (
                  <div key={sugg} className="safestudy-suggestion">
                    <span className="break-all">{sugg}</span>
                    <button
                      onClick={() => copyToClipboard(sugg)}
                      className="safestudy-copy-btn"
                      title="Copy to clipboard"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        className="w-5 h-5"
                      >
                        <path
                          fill="currentColor"
                          d="M16 1H4a2 2 0 0 0-2 2v12h2V3h12V1z"
                        />
                        <path
                          fill="currentColor"
                          d="M20 5H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm0 16H8V7h12v14z"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PasswordSecurityCheck;
