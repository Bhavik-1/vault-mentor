import React, { useState, CSSProperties } from "react";

// --- TYPE DEFINITIONS ---
type GameMode =
  | "menu"
  | "phishing"
  | "databreach"
  | "cipher"
  | "digitalfootprint";

// --- PHISHING GAME TYPES ---
type PhishingDifficulty = "Easy" | "Medium" | "Hard";
type PhishingGameState =
  | "difficulty_selection"
  | "in_game"
  | "feedback"
  | "completed";
interface PhishingScenario {
  id: number;
  difficulty: PhishingDifficulty;
  senderName: string;
  senderEmail: string;
  subject: string;
  body: React.ReactNode;
  isPhishing: boolean;
  redFlags: string[];
}

// --- DATA BREACH GAME TYPES ---
interface Choice {
  text: string;
  next?: string;
  explanation?: string;
}
interface QuestionNode {
  text: string;
  choices: Choice[];
  end?: never;
}
interface EndNode {
  end: true;
  success: boolean;
  title: string;
  text: string;
  choices?: never;
}
type ScenarioNode = QuestionNode | EndNode;
interface DataBreachScenario {
  id: number;
  title: string;
  startNode: string;
  nodes: Record<string, ScenarioNode>;
}

// --- CIPHER GAME TYPES ---
type CipherType = "Caesar" | "Atbash" | "A1Z26";
interface CipherLevel {
  encrypted: string;
  decrypted: string;
  clue: string;
  cipherType: CipherType;
}
interface CipherExplanation {
  title: string;
  explanation: string;
  example: string;
  weakness: string;
}

// --- DIGITAL FOOTPRINT GAME TYPES ---
type DigitalFootprintClueType =
  | "petName"
  | "birthYear"
  | "motherMaidenName"
  | "hometown";
interface DigitalFootprintPost {
  id: number;
  author: string;
  avatar: string;
  content: React.ReactNode;
  date: string;
  clueType?: DigitalFootprintClueType;
  clueDetail?: string;
}
interface DigitalFootprintClue {
  label: string;
  answer: string;
  found: boolean;
  attackVector: string;
}

// --- SCENARIO & GAME DATA ---

const PHISHING_SCENARIOS: PhishingScenario[] = [
  // Easy
  {
    id: 1,
    difficulty: "Easy",
    senderName: "Your Bank Security",
    senderEmail: "secure-alert@login-bank.com",
    subject: "URGENT: Your Acount is locked!!",
    body: (
      <>
        <p>Dear Valued Customer,</p>
        <p>
          We detect unusual activity on your acount. Your acount is temporary
          locked.
        </p>
        <p>
          Please click here to verify your identity and unlock: <br />
          <a href="#/" onClick={(e) => e.preventDefault()}>
            http://your-bank-security-update.info/login
          </a>
        </p>
        <p>
          Thank you, <br /> The Security Team
        </p>
      </>
    ),
    isPhishing: true,
    redFlags: [
      "Obvious spelling mistakes ('acount', 'temporary').",
      "Generic greeting ('Dear Valued Customer').",
      "Sense of urgency ('URGENT', 'locked!!').",
      "The link goes to a suspicious domain.",
    ],
  },
  {
    id: 2,
    difficulty: "Easy",
    senderName: "Free Netflix",
    senderEmail: "promos@free-stuff.biz",
    subject: "You WON a free year of Netflix!",
    body: (
      <>
        <p>Congratulations!!!</p>
        <p>You have been selected for a FREE 1-year subscription to Netflix!</p>
        <p>
          To claim your prize, simply click the link below and enter your
          details.
        </p>
        <p>
          <a href="#/" onClick={(e) => e.preventDefault()}>
            Click Here to Claim
          </a>
        </p>
        <p>Hurry, offer expires in 24 hours!</p>
      </>
    ),
    isPhishing: true,
    redFlags: [
      "Too good to be true offer.",
      "The sender's email ('free-stuff.biz') is not an official Netflix domain.",
      "Creates a false sense of urgency.",
      "Asks for personal details for an unsolicited prize.",
    ],
  },
  // Medium
  {
    id: 3,
    difficulty: "Medium",
    senderName: "Microsoft 365 Admin",
    senderEmail: "no-reply@microsftsupport.com",
    subject: "Action Required: Unusual sign-in activity",
    body: (
      <>
        <p>Hi,</p>
        <p>
          We detected a sign-in to your Microsoft 365 account from an
          unrecognized device in Russia.
        </p>
        <p>
          If this was not you, please use the link below to review your account
          activity and secure your account.
        </p>
        <p>
          <a href="#/" onClick={(e) => e.preventDefault()}>
            Review Activity
          </a>
        </p>
        <p>
          Thanks,
          <br />
          The Microsoft Account Team
        </p>
      </>
    ),
    isPhishing: true,
    redFlags: [
      "Subtle misspelling in the sender's domain: 'microsftsupport.com'.",
      "Generic greeting ('Hi,') instead of your name.",
      "Uses fear (unauthorized sign-in) to provoke a quick reaction.",
    ],
  },
  // Hard
  {
    id: 5,
    difficulty: "Hard",
    senderName: "DocuSign",
    senderEmail: "dse@docusign.net",
    subject: 'Completed: "Q3 Financial Projections" is ready for signature',
    body: (
      <>
        <p>Hello,</p>
        <p>
          Your colleague, Bob Smith, has sent you the document "Q3 Financial
          Projections" to sign.
        </p>
        <p>
          <a href="#/" onClick={(e) => e.preventDefault()}>
            REVIEW DOCUMENT
          </a>
        </p>
        <p>This link will expire in 48 hours.</p>
        <p>
          Thank you,
          <br />
          DocuSign
        </p>
      </>
    ),
    isPhishing: true,
    redFlags: [
      "The sender's domain 'docusign.net' is legitimate, making it tricky.",
      "The primary red flag is context: Were you expecting this document? Always verify unexpected requests directly.",
      "Attackers can 'spoof' legitimate email addresses.",
    ],
  },
  {
    id: 6,
    difficulty: "Hard",
    senderName: "Google Workspace",
    senderEmail: "no-reply@google.com",
    subject: "Security alert: Your account password was changed",
    body: (
      <>
        <p>Hi [Your Name],</p>
        <p>
          The password for your Google Account was changed on Sat, 13 September
          2025 at 11:15 AM (IST).
        </p>
        <p>If you did this, you can safely disregard this email.</p>
        <p>
          If you didn't change your password, your account may have been
          compromised.
        </p>
        <p>
          <a href="#/" onClick={(e) => e.preventDefault()}>
            Check activity
          </a>
        </p>
        <p>
          Thank you,
          <br />
          The Google Accounts team
        </p>
      </>
    ),
    isPhishing: false,
    redFlags: [
      "This email is legitimate.",
      "The sender is from the official '@google.com' domain.",
      "It provides specific, accurate details.",
      "A real link would point to 'myaccount.google.com'. Not all security alerts are phishing!",
    ],
  },
];

const DATA_BREACH_SCENARIOS: DataBreachScenario[] = [
  {
    id: 1,
    title: "University Portal Breach",
    startNode: "start",
    nodes: {
      start: {
        text: "You receive an official-looking email notifying you that the university's student portal has been breached. What is your FIRST action?",
        choices: [
          {
            text: "Go to the official portal website and change my password.",
            next: "changedPassword",
          },
          {
            text: "Click the link in the email to see if it's real.",
            explanation:
              "Incorrect. Never click links in unexpected security alerts. The email itself could be a phishing attempt to steal your credentials. Always navigate to the official website by typing the URL yourself.",
          },
          {
            text: "Ignore the email, it's probably spam.",
            explanation:
              "Risky. While it could be spam, ignoring a potential breach notice could leave your account vulnerable. The best first step is to verify and act through official channels.",
          },
        ],
      },
      changedPassword: {
        text: "Good. You've secured the portal account. Now, you remember you used that same password for your personal email and a social media account. What's the priority?",
        choices: [
          {
            text: "Immediately change the passwords on all accounts that shared the breached password.",
            next: "remediated",
          },
          {
            text: "Only change the social media password. My email is probably fine.",
            explanation:
              "Incorrect. Your email account is the most critical. If attackers get access to it, they can reset passwords for almost all your other services. It should be your top priority.",
          },
          {
            text: "I'll get to it later this week.",
            explanation:
              "Wrong. Attackers use automated scripts to test stolen credentials on other popular websites almost immediately. You must act fast.",
          },
        ],
      },
      remediated: {
        text: "Excellent. You've contained the immediate threat by changing all reused passwords. What's the final, crucial step to dramatically improve your accounts' security for the future?",
        choices: [
          {
            text: "Enable Multi-Factor Authentication (MFA/2FA) on all important accounts.",
            next: "win",
          },
          {
            text: "Create a new, very complex password and use it everywhere.",
            explanation:
              "Not ideal. While a strong password is good, reusing it everywhere means one breach will compromise all your accounts again. The goal is to isolate the damage.",
          },
          {
            text: "Write my new passwords on a sticky note on my monitor.",
            explanation:
              "Very unsafe! This makes your accounts vulnerable to anyone with physical access to your computer. Use a password manager instead.",
          },
        ],
      },
      win: {
        end: true,
        success: true,
        title: "Threat Neutralized!",
        text: "You expertly handled the data breach. By acting quickly, remediating other accounts, and enabling MFA, you have secured your digital identity. Well done, agent!",
      },
    },
  },
];

const CIPHER_CHALLENGE = {
  title: "MISSION: DECRYPT",
  levels: [
    {
      encrypted: "KHOOR, ZRUOG!",
      decrypted: "HELLO, WORLD!",
      clue: "Each letter is shifted by a fixed number. Julius Caesar was a fan of this one.",
      cipherType: "Caesar",
    },
    {
      encrypted: "IVLLO, DLIOW!",
      decrypted: "HELLO, WORLD!",
      clue: "Think backwards. A is Z, B is Y, and so on.",
      cipherType: "Atbash",
    },
    {
      encrypted: "8-5-12-12-15, 23-15-18-12-4!",
      decrypted: "HELLO, WORLD!",
      clue: "Every letter is represented by its position in the alphabet. A=1, B=2, etc.",
      cipherType: "A1Z26",
    },
  ] as CipherLevel[],
};

const CIPHER_EXPLANATIONS: Record<CipherType, CipherExplanation> = {
  Caesar: {
    title: "The Caesar Cipher",
    explanation:
      "The Caesar cipher is one of the simplest and most widely known encryption techniques. It is a type of substitution cipher in which each letter in the plaintext is replaced by a letter some fixed number of positions down the alphabet.",
    example:
      "For example, with a left shift of 3, D would be replaced by A, E would become B, and so on. The message 'HELLO' becomes 'EBIIL'.",
    weakness:
      "Its primary weakness is that it can be easily broken using frequency analysis. Since each letter is always replaced by the same other letter, an attacker can analyze the frequency of letters in the ciphertext to guess the shift.",
  },
  Atbash: {
    title: "The Atbash Cipher",
    explanation:
      "The Atbash cipher is a simple substitution cipher originally for the Hebrew alphabet. It works by substituting each letter with its reverse in the alphabet; so, A becomes Z, B becomes Y, and so on.",
    example: "For example, the message 'HELLO' would be encrypted as 'SVOOL'.",
    weakness:
      "Like the Caesar cipher, the Atbash cipher is very weak. It has a fixed, single key for all messages, making it trivial to break once the method is known. Frequency analysis is also effective against it.",
  },
  A1Z26: {
    title: "The A1Z26 Cipher",
    explanation:
      "The A1Z26 cipher is another simple substitution cipher where each letter of the alphabet is replaced by its corresponding number. A becomes 1, B becomes 2, C becomes 3, and so on, up to Z which is 26.",
    example: "The message 'HELLO' would be encrypted as '8-5-12-12-15'.",
    weakness:
      "This cipher offers no real security. The relationship between letters and numbers is fixed and universally known. It's more of an encoding than a true cipher and can be decoded instantly by anyone who recognizes the pattern.",
  },
};

const getInitialDigitalFootprintClues = (): Record<
  DigitalFootprintClueType,
  DigitalFootprintClue
> => ({
  petName: {
    label: "Pet's Name",
    answer: "Sparky",
    found: false,
    attackVector:
      "Commonly used as a security question for password resets. Can also be used to build rapport in social engineering attacks.",
  },
  birthYear: {
    label: "Birth Year",
    answer: "1998",
    found: false,
    attackVector:
      "Part of your date of birth, a key piece of PII used for identity verification. Can be combined with other data to guess passwords (e.g., Sparky1998).",
  },
  motherMaidenName: {
    label: "Mother's Maiden Name",
    answer: "Johnson",
    found: false,
    attackVector:
      "The most classic security question. A huge risk if exposed, giving attackers a direct way to compromise accounts.",
  },
  hometown: {
    label: "Hometown",
    answer: "Maple Creek",
    found: false,
    attackVector:
      "Another common security question. Also used in phishing attacks to make messages seem more personal and legitimate (e.g., 'A message for residents of Maple Creek').",
  },
});

const DIGITAL_FOOTPRINT_SCENARIO = {
  title: "Digital Footprint Investigation",
  posts: [
    {
      id: 1,
      author: "InfoSecFan",
      avatar: "🧑‍💻",
      date: "August 5, 2025",
      content: (
        <p>
          Just attended a great cybersecurity conference! Learned so much about
          protecting your data online. #InfoSec #Privacy
        </p>
      ),
    },
    {
      id: 2,
      author: "AlexTheTarget",
      avatar: "🎯",
      date: "August 15, 2025",
      content: (
        <p>
          Happy birthday to me! Can't believe I'm another year older. Time
          flies! 🎂 #Birthday
        </p>
      ),
      clueType: "birthYear",
      clueDetail:
        "This post doesn't state the year, but people often post on their actual birthday. An attacker could check this profile on this date next year to determine the full DOB.",
    },
    {
      id: 3,
      author: "Alexs_Mom",
      avatar: "👩‍👧‍👦",
      date: "August 28, 2025",
      content: (
        <p>
          So proud of my child, Alex! It seems like just yesterday I was a young
          Johnson girl getting married, and now look at my family!
        </p>
      ),
      clueType: "motherMaidenName",
      clueDetail:
        "People often forget their family members' posts are public. Alex's mom just revealed her maiden name.",
    },
    {
      id: 4,
      author: "AlexTheTarget",
      avatar: "🎯",
      date: "September 4, 2025",
      content: (
        <p>
          Throwback to my high school graduation at Maple Creek High! Good
          times. #TBT #GoBadgers
        </p>
      ),
      clueType: "hometown",
      clueDetail:
        "Tagging or mentioning a specific high school is a direct link to a hometown.",
    },
    {
      id: 5,
      author: "LocalNews",
      avatar: "📰",
      date: "September 10, 2025",
      content: (
        <p>
          The annual Maple Creek pet parade was a huge success! Pictured here is
          Alex and their prize-winning dog, Sparky.
        </p>
      ),
      clueType: "petName",
      clueDetail:
        "Even being tagged in a local news post can reveal information you didn't intend to share.",
    },
    {
      id: 6,
      author: "AlexTheTarget",
      avatar: "🎯",
      date: "September 12, 2025",
      content: <p>Just chilling with my best buddy. He's the best boy! ❤️🐶</p>,
    },
  ] as DigitalFootprintPost[],
};

// --- STYLES & SHARED COMPONENTS ---
const GlobalStyles = () => (
  <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;700&family=Space+Grotesk:wght@400;700&display=swap');
        
        .animated-button {
            transition: all 0.2s ease-in-out;
        }
        .animated-button:hover:not(:disabled) {
            transform: translateY(-3px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }
        .animated-button:disabled {
            cursor: not-allowed;
            opacity: 0.7;
        }
        .feedback-card, .scenario-card {
            animation: fadeIn 0.5s ease-out;
        }
        .feedback-item {
            animation: slideInUp 0.5s ease-out;
        }
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        @keyframes slideInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    `}</style>
);

const styles: { [key: string]: CSSProperties } = {
  container: {
    fontFamily: "'Space Grotesk', sans-serif",
    maxWidth: "900px",
    margin: "2rem auto",
    padding: "2rem",
    borderRadius: "12px",
    backgroundColor: "#1a1d2e",
    color: "#e0e0e0",
    border: "1px solid #3a3f61",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
    position: "relative",
  },
  header: {
    textAlign: "center",
    paddingBottom: "1rem",
    borderBottom: "1px solid #3a3f61",
  },
  headerIcon: { fontSize: "3rem", marginBottom: "0.5rem" },
  headerTitle: {
    margin: 0,
    color: "#50fa7b",
    fontFamily: "'Roboto Mono', monospace",
  },
  headerSubtitle: { margin: "0.5rem 0 0 0", color: "#bd93f9" },
  buttonGroup: {
    display: "flex",
    justifyContent: "center",
    gap: "1rem",
    flexWrap: "wrap",
  },
  button: {
    padding: "12px 24px",
    fontSize: "1rem",
    cursor: "pointer",
    border: "2px solid transparent",
    borderRadius: "8px",
    fontWeight: "bold",
    fontFamily: "'Roboto Mono', monospace",
  },
  gameHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1.5rem",
  },
  progressBarContainer: {
    flexGrow: 1,
    height: "12px",
    backgroundColor: "#3a3f61",
    borderRadius: "6px",
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#50fa7b",
    borderRadius: "6px",
    transition: "width 0.3s ease-out",
  },
  scoreTracker: {
    marginLeft: "1rem",
    fontSize: "1rem",
    color: "#bd93f9",
    fontFamily: "'Roboto Mono', monospace",
  },
  emailContainer: {
    backgroundColor: "#282a36",
    border: "1px solid #44475a",
    padding: "1.5rem",
    borderRadius: "8px",
    lineHeight: "1.6",
    color: "#f8f8f2",
  },
  emailHeader: {
    borderBottom: "1px solid #44475a",
    paddingBottom: "1rem",
    marginBottom: "1rem",
    fontFamily: "'Roboto Mono', monospace",
  },
  feedbackCard: {
    textAlign: "center",
    padding: "2rem",
    borderRadius: "12px",
    marginTop: "1rem",
  },
  feedbackIcon: { fontSize: "4rem" },
  feedbackTitle: { marginTop: "1rem", fontSize: "2rem" },
  redFlagSection: {
    marginTop: "2rem",
    padding: "1.5rem",
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: "8px",
    textAlign: "left",
  },
  redFlagList: {
    paddingLeft: "20px",
    margin: 0,
    listStyleType: "'🚩 '",
    listStylePosition: "outside",
  },
  redFlagItem: { paddingLeft: "10px", marginBottom: "0.5rem" },
  scenarioContainer: {
    backgroundColor: "#282a36",
    border: "1px solid #44475a",
    padding: "2rem",
    borderRadius: "8px",
    textAlign: "center",
  },
  scenarioText: {
    fontSize: "1.2rem",
    minHeight: "60px",
    color: "#f8f8f2",
  },
  choicesContainer: { marginTop: "2rem" },
  choiceButton: {
    display: "block",
    width: "100%",
    textAlign: "left",
    backgroundColor: "#44475a",
    color: "#f8f8f2",
    margin: "0.5rem 0",
    padding: "1rem",
    fontSize: "1rem",
    cursor: "pointer",
    borderRadius: "8px",
    border: "1px solid #6272a4",
    fontFamily: "'Space Grotesk', sans-serif",
  },
  feedbackBox: {
    padding: "1rem",
    marginTop: "1.5rem",
    borderRadius: "8px",
    backgroundColor: "rgba(255, 85, 85, 0.1)",
    border: "1px solid #ff5555",
    color: "#ffb86c",
    textAlign: "left",
  },
  correctFeedbackBox: {
    padding: "1rem",
    marginTop: "1.5rem",
    borderRadius: "8px",
    backgroundColor: "rgba(80, 250, 123, 0.1)",
    border: "1px solid #50fa7b",
    color: "#50fa7b",
    textAlign: "center",
    fontWeight: "bold",
  },
  controlButton: {
    padding: "12px 24px",
    fontSize: "1rem",
    cursor: "pointer",
    borderRadius: "8px",
    fontWeight: "bold",
    fontFamily: "'Roboto Mono', monospace",
    marginTop: "2rem",
    backgroundColor: "#50fa7b",
    color: "#282a36",
    border: "none",
  },
  backButton: {
    backgroundColor: "transparent",
    color: "#6272a4",
    border: "1px solid #6272a4",
    padding: "8px 16px",
    cursor: "pointer",
    borderRadius: "8px",
    fontFamily: "'Roboto Mono', monospace",
    position: "absolute",
    top: "1rem",
    left: "1rem",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: "#282a36",
    padding: "2rem",
    borderRadius: "12px",
    maxWidth: "600px",
    width: "90%",
    border: "1px solid #44475a",
    color: "#f8f8f2",
    position: "relative",
  },
  modalCloseButton: {
    position: "absolute",
    top: "1rem",
    right: "1rem",
    background: "none",
    border: "none",
    color: "#f8f8f2",
    fontSize: "1.5rem",
    cursor: "pointer",
  },
};

const Modal = ({
  isVisible,
  onClose,
  title,
  children,
}: {
  isVisible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) => {
  if (!isVisible) return null;

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button style={styles.modalCloseButton} onClick={onClose}>
          &times;
        </button>
        <h2
          style={{
            ...styles.headerTitle,
            color: "#bd93f9",
            textAlign: "center",
            marginBottom: "1.5rem",
          }}
        >
          {title}
        </h2>
        {children}
      </div>
    </div>
  );
};

// --- GAME: PHISHING DRILL ---
const PhishingDrill = ({ onBackToMenu }: { onBackToMenu: () => void }) => {
  const [gameState, setGameState] = useState<PhishingGameState>(
    "difficulty_selection"
  );
  const [activeScenarios, setActiveScenarios] = useState<PhishingScenario[]>(
    []
  );
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [userChoice, setUserChoice] = useState<
    "Legitimate" | "Phishing" | null
  >(null);
  const [score, setScore] = useState(0);

  const handleSelectDifficulty = (difficulty: PhishingDifficulty) => {
    setActiveScenarios(
      PHISHING_SCENARIOS.filter((s) => s.difficulty === difficulty)
    );
    setGameState("in_game");
    setScenarioIndex(0);
    setScore(0);
  };

  const handleUserChoice = (choice: "Legitimate" | "Phishing") => {
    const isCorrect =
      (choice === "Phishing" && activeScenarios[scenarioIndex].isPhishing) ||
      (choice === "Legitimate" && !activeScenarios[scenarioIndex].isPhishing);
    if (isCorrect) setScore((prev) => prev + 1);
    setUserChoice(choice);
    setGameState("feedback");
  };

  const handleNext = () => {
    if (scenarioIndex < activeScenarios.length - 1) {
      setScenarioIndex((prev) => prev + 1);
      setGameState("in_game");
    } else {
      setGameState("completed");
    }
  };

  const handleRestart = () => setGameState("difficulty_selection");

  const getCompletionTitle = () => {
    if (activeScenarios.length === 0)
      return { title: "Error", icon: "❓", color: "#fff" };
    const percentage = score / activeScenarios.length;
    if (percentage === 1)
      return { title: "Cyber Grandmaster", icon: "👑", color: "#50fa7b" };
    if (percentage >= 0.7)
      return { title: "Expert Analyst", icon: "🕵️", color: "#8be9fd" };
    if (percentage >= 0.4)
      return { title: "Digital Apprentice", icon: "🧐", color: "#ffb86c" };
    return { title: "Phish Bait", icon: "🎣", color: "#ff5555" };
  };

  const renderDifficultySelector = () => (
    <div style={styles.header}>
      <div style={styles.headerIcon}>🛡️</div>
      <h1 style={styles.headerTitle}>Phishing Drill v2.0</h1>
      <p style={styles.headerSubtitle}>
        Select your mission difficulty, agent.
      </p>
      <div style={{ ...styles.buttonGroup, marginTop: "2rem" }}>
        <button
          className="animated-button"
          style={{
            ...styles.button,
            backgroundColor: "#4caf50",
            color: "white",
          }}
          onClick={() => handleSelectDifficulty("Easy")}
        >
          EASY
        </button>
        <button
          className="animated-button"
          style={{
            ...styles.button,
            backgroundColor: "#ffb86c",
            color: "#282a36",
          }}
          onClick={() => handleSelectDifficulty("Medium")}
        >
          MEDIUM
        </button>
        <button
          className="animated-button"
          style={{
            ...styles.button,
            backgroundColor: "#ff5555",
            color: "white",
          }}
          onClick={() => handleSelectDifficulty("Hard")}
        >
          HARD
        </button>
      </div>
    </div>
  );

  const renderGame = () => {
    const scenario = activeScenarios[scenarioIndex];
    if (!scenario) return null;
    const progressPercent =
      ((scenarioIndex + 1) / activeScenarios.length) * 100;

    return (
      <div>
        <div style={styles.gameHeader}>
          <div style={styles.progressBarContainer}>
            <div
              style={{
                ...styles.progressBarFill,
                width: `${progressPercent}%`,
              }}
            />
          </div>
          <div style={styles.scoreTracker}>Score: {score}</div>
        </div>
        <div style={styles.emailContainer}>
          <div style={styles.emailHeader}>
            <p style={{ margin: 0 }}>
              <strong>From:</strong> {scenario.senderName} &lt;
              {scenario.senderEmail}&gt;
            </p>
            <p style={{ margin: "0.5rem 0 0 0" }}>
              <strong>Subject:</strong> {scenario.subject}
            </p>
          </div>
          <div>{scenario.body}</div>
        </div>
        <div style={{ ...styles.buttonGroup, marginTop: "2rem" }}>
          <button
            className="animated-button"
            style={{
              ...styles.button,
              backgroundColor: "#8be9fd",
              color: "#282a36",
            }}
            onClick={() => handleUserChoice("Legitimate")}
          >
            ✔️ Legitimate
          </button>
          <button
            className="animated-button"
            style={{
              ...styles.button,
              backgroundColor: "#ff79c6",
              color: "#282a36",
            }}
            onClick={() => handleUserChoice("Phishing")}
          >
            🎣 Phishing
          </button>
        </div>
      </div>
    );
  };

  const renderFeedback = () => {
    const scenario = activeScenarios[scenarioIndex];
    const correctChoice = scenario.isPhishing ? "Phishing" : "Legitimate";
    const isCorrect = userChoice === correctChoice;
    const feedbackStyle = {
      backgroundColor: isCorrect
        ? "rgba(80, 250, 123, 0.1)"
        : "rgba(255, 85, 85, 0.1)",
      border: `2px solid ${isCorrect ? "#50fa7b" : "#ff5555"}`,
    };

    return (
      <div
        className="feedback-card"
        style={{ ...styles.feedbackCard, ...feedbackStyle }}
      >
        <div style={styles.feedbackIcon}>{isCorrect ? "✅" : "❌"}</div>
        <h2
          style={{
            ...styles.feedbackTitle,
            color: isCorrect ? "#50fa7b" : "#ff5555",
          }}
        >
          {isCorrect ? "ACCESS GRANTED" : "THREAT DETECTED"}
        </h2>
        <p>
          You chose <strong>{userChoice}</strong>. The correct analysis was{" "}
          <strong>{correctChoice}</strong>.
        </p>
        <div style={styles.redFlagSection}>
          <h4 style={{ margin: "0 0 1rem 0", color: "#bd93f9" }}>
            // DEBRIEFING_
          </h4>
          <ul style={styles.redFlagList}>
            {scenario.redFlags.map((flag, index) => (
              <li style={styles.redFlagItem} key={index}>
                {flag}
              </li>
            ))}
          </ul>
        </div>
        <button
          className="animated-button"
          style={{
            ...styles.controlButton,
            backgroundColor: "#bd93f9",
          }}
          onClick={handleNext}
        >
          {scenarioIndex === activeScenarios.length - 1
            ? "FINISH MISSION"
            : "NEXT SCENARIO"}
        </button>
      </div>
    );
  };

  const renderCompleted = () => {
    const { title, icon, color } = getCompletionTitle();
    return (
      <div style={styles.header}>
        <div style={{ ...styles.headerIcon, transform: "scale(1.5)" }}>
          {icon}
        </div>
        <h1 style={{ ...styles.headerTitle, color }}>Mission Complete!</h1>
        <p style={styles.headerSubtitle}>
          Final Score: {score} / {activeScenarios.length}
        </p>
        <h2 style={{ marginTop: "2rem", color }}>Your Rank: {title}</h2>
        <button
          className="animated-button"
          style={styles.controlButton}
          onClick={handleRestart}
        >
          RESTART TRAINING
        </button>
      </div>
    );
  };

  return (
    <>
      <button
        className="animated-button"
        style={styles.backButton}
        onClick={onBackToMenu}
      >
        &lt; Menu
      </button>
      <div style={{ paddingTop: "2rem" }}>
        {gameState === "difficulty_selection" && renderDifficultySelector()}
        {gameState === "in_game" && renderGame()}
        {gameState === "feedback" && renderFeedback()}
        {gameState === "completed" && renderCompleted()}
      </div>
    </>
  );
};

// --- GAME: DATA BREACH SCENARIO ---
const DataBreachGame = ({ onBackToMenu }: { onBackToMenu: () => void }) => {
  const scenario = DATA_BREACH_SCENARIOS[0];
  const [currentNodeId, setCurrentNodeId] = useState(scenario.startNode);
  const [feedback, setFeedback] = useState<{
    text: string;
    explanation: string;
  } | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleChoice = (choice: Choice) => {
    if (isTransitioning) return; // Prevent clicks during transition

    setFeedback(null);
    if (choice.next) {
      // Correct choice
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentNodeId(choice.next as string);
        setIsTransitioning(false);
      }, 1500); // Wait 1.5 seconds before moving on
    } else if (choice.explanation) {
      // Incorrect choice
      setFeedback({ text: choice.text, explanation: choice.explanation });
    }
  };

  const restartScenario = () => {
    setCurrentNodeId(scenario.startNode);
    setFeedback(null);
  };

  const currentNode = scenario.nodes[currentNodeId];

  return (
    <div className="scenario-card">
      <button
        className="animated-button"
        style={styles.backButton}
        onClick={onBackToMenu}
      >
        &lt; Menu
      </button>
      <div style={{ paddingTop: "2rem" }}>
        <div style={styles.header}>
          <div style={styles.headerIcon}>
            {"end" in currentNode ? "✅" : "🚨"}
          </div>
          <h1 style={styles.headerTitle}>
            {"end" in currentNode && currentNode.end
              ? currentNode.title
              : scenario.title}
          </h1>
        </div>
        <div style={styles.scenarioContainer}>
          <p style={styles.scenarioText}>{currentNode.text}</p>
          {"choices" in currentNode && (
            <div style={styles.choicesContainer}>
              {currentNode.choices.map((choice, index) => (
                <button
                  key={index}
                  className="animated-button"
                  style={styles.choiceButton}
                  onClick={() => handleChoice(choice)}
                  disabled={isTransitioning}
                >
                  {choice.text}
                </button>
              ))}
            </div>
          )}
          {feedback && (
            <div className="feedback-item" style={styles.feedbackBox}>
              <strong>Incorrect:</strong> {feedback.explanation}
            </div>
          )}
          {isTransitioning && (
            <div className="feedback-item" style={styles.correctFeedbackBox}>
              Correct! Securing the next step...
            </div>
          )}
          {"end" in currentNode && (
            <button
              className="animated-button"
              style={styles.controlButton}
              onClick={restartScenario}
            >
              REPLAY SCENARIO
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// --- GAME: CIPHER CHALLENGE ---
const CipherChallenge = ({ onBackToMenu }: { onBackToMenu: () => void }) => {
  const [levelIndex, setLevelIndex] = useState(0);
  const [score, setScore] = useState(100);
  const [userInput, setUserInput] = useState("");
  const [feedback, setFeedback] = useState<{
    type: string;
    message: string;
  } | null>(null);
  const [isAnswerShown, setIsAnswerShown] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [gameState, setGameState] = useState<"in_game" | "completed">(
    "in_game"
  );

  const currentLevel = CIPHER_CHALLENGE.levels[levelIndex];

  const resetForNextLevel = () => {
    setUserInput("");
    setFeedback(null);
    setIsAnswerShown(false);
  };

  const handleNextLevel = () => {
    if (levelIndex < CIPHER_CHALLENGE.levels.length - 1) {
      setLevelIndex((prev) => prev + 1);
      resetForNextLevel();
    } else {
      setGameState("completed");
    }
  };

  const handleCheckAnswer = () => {
    const formattedUserInput = userInput
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9,!\s-]/g, "");
    const formattedAnswer = currentLevel.decrypted.toUpperCase();

    if (formattedUserInput === formattedAnswer) {
      setFeedback({
        type: "correct",
        message: "Decryption successful! Well done, agent.",
      });
      setScore((prev) => prev + 50);
      setIsAnswerShown(true); // To show 'Next Level' button
    } else {
      setFeedback({
        type: "error",
        message:
          "Incorrect decryption. Check your method and try again. (-5 pts)",
      });
      setScore((prev) => Math.max(0, prev - 5));
    }
  };

  const handleShowClue = () => {
    setFeedback({ type: "clue", message: `HINT: ${currentLevel.clue}` });
    setScore((prev) => Math.max(0, prev - 10));
  };

  const handleShowAnswer = () => {
    setUserInput(currentLevel.decrypted);
    setFeedback({
      type: "answer",
      message: "Answer revealed. The correct decryption is shown above.",
    });
    setScore((prev) => Math.max(0, prev - 20));
    setIsAnswerShown(true);
  };

  const handleRestart = () => {
    setLevelIndex(0);
    setScore(100);
    resetForNextLevel();
    setGameState("in_game");
  };

  const getFeedbackBoxStyle = (): CSSProperties => {
    if (!feedback) return { display: "none" };
    switch (feedback.type) {
      case "correct":
        return {
          ...styles.correctFeedbackBox,
          color: "#50fa7b",
          borderColor: "#50fa7b",
        };
      case "error":
        return {
          ...styles.feedbackBox,
          color: "#ffb86c",
          borderColor: "#ff5555",
        };
      case "clue":
        return {
          ...styles.feedbackBox,
          backgroundColor: "rgba(255, 184, 108, 0.1)",
          color: "#ffb86c",
          borderColor: "#ffb86c",
        };
      case "answer":
        return {
          ...styles.feedbackBox,
          backgroundColor: "rgba(139, 233, 253, 0.1)",
          color: "#8be9fd",
          borderColor: "#8be9fd",
        };
      default:
        return { display: "none" };
    }
  };

  if (gameState === "completed") {
    return (
      <div style={{ ...styles.header, paddingTop: "2rem" }}>
        <div style={{ ...styles.headerIcon, transform: "scale(1.5)" }}>🏆</div>
        <h1 style={{ ...styles.headerTitle, color: "#8be9fd" }}>
          Mission Accomplished!
        </h1>
        <p style={styles.headerSubtitle}>
          You decrypted all messages and thwarted the enemy agents.
        </p>
        <h2 style={{ marginTop: "2rem", color: "#f1fa8c" }}>
          Final Score: {score}
        </h2>
        <button
          className="animated-button"
          style={{ ...styles.controlButton, backgroundColor: "#bd93f9" }}
          onClick={handleRestart}
        >
          REPLAY MISSION
        </button>
        <button
          className="animated-button"
          style={{
            ...styles.backButton,
            position: "relative",
            display: "block",
            margin: "1rem auto 0",
          }}
          onClick={onBackToMenu}
        >
          &lt; Main Menu
        </button>
      </div>
    );
  }

  const explanation = CIPHER_EXPLANATIONS[currentLevel.cipherType];

  return (
    <>
      <button
        className="animated-button"
        style={styles.backButton}
        onClick={onBackToMenu}
      >
        &lt; Menu
      </button>
      <div style={{ paddingTop: "2rem" }}>
        <div style={styles.header}>
          <div style={styles.headerIcon}>🔒</div>
          <h1 style={styles.headerTitle}>{CIPHER_CHALLENGE.title}</h1>
          <p style={styles.headerSubtitle}>
            Level {levelIndex + 1} of {CIPHER_CHALLENGE.levels.length} | Score:{" "}
            {score}
          </p>
        </div>

        <div style={{ ...styles.scenarioContainer, marginTop: "1.5rem" }}>
          <div
            style={{
              ...styles.emailContainer,
              backgroundColor: "#111320",
              fontFamily: "'Roboto Mono', monospace",
            }}
          >
            <p style={{ color: "#6272a4" }}>&gt; Incoming Transmission...</p>
            <p
              style={{
                color: "#50fa7b",
                fontSize: "1.5rem",
                wordBreak: "break-all",
              }}
            >
              {currentLevel.encrypted}
            </p>
          </div>

          {feedback && (
            <div style={getFeedbackBoxStyle()}>{feedback.message}</div>
          )}

          <div style={{ marginTop: "1.5rem", textAlign: "left" }}>
            <label
              htmlFor="decrypted-text"
              style={{
                color: "#50fa7b",
                marginBottom: "0.5rem",
                display: "block",
              }}
            >
              &gt; Enter Decrypted Message:
            </label>
            <textarea
              id="decrypted-text"
              rows={3}
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              disabled={isAnswerShown}
              style={{
                width: "100%",
                backgroundColor: "#1a1d2e",
                color: "#f8f8f2",
                padding: "0.75rem",
                borderRadius: "8px",
                border: "1px solid #44475a",
                fontFamily: "'Roboto Mono', monospace",
                fontSize: "1rem",
              }}
            />
          </div>

          {isAnswerShown ? (
            <button
              className="animated-button"
              style={{
                ...styles.controlButton,
                width: "100%",
                backgroundColor: "#bd93f9",
              }}
              onClick={handleNextLevel}
            >
              {levelIndex === CIPHER_CHALLENGE.levels.length - 1
                ? "FINISH MISSION"
                : "NEXT LEVEL"}
            </button>
          ) : (
            <div
              style={{
                ...styles.buttonGroup,
                justifyContent: "space-between",
                marginTop: "1.5rem",
              }}
            >
              <div>
                <button
                  className="animated-button"
                  style={{
                    ...styles.button,
                    backgroundColor: "#ffb86c",
                    color: "#282a36",
                    fontSize: "0.9rem",
                    padding: "10px 16px",
                  }}
                  onClick={handleShowClue}
                >
                  Get Clue
                </button>
                <button
                  className="animated-button"
                  style={{
                    ...styles.button,
                    backgroundColor: "#6272a4",
                    color: "#f8f8f2",
                    fontSize: "0.9rem",
                    padding: "10px 16px",
                    marginLeft: "0.5rem",
                  }}
                  onClick={() => setIsModalVisible(true)}
                >
                  Learn Cipher
                </button>
              </div>
              <div>
                <button
                  className="animated-button"
                  style={{
                    ...styles.button,
                    backgroundColor: "#8be9fd",
                    color: "#282a36",
                    fontSize: "0.9rem",
                    padding: "10px 16px",
                  }}
                  onClick={handleShowAnswer}
                >
                  Show Answer
                </button>
                <button
                  className="animated-button"
                  style={{
                    ...styles.button,
                    backgroundColor: "#50fa7b",
                    color: "#282a36",
                    fontSize: "0.9rem",
                    padding: "10px 20px",
                    marginLeft: "0.5rem",
                  }}
                  onClick={handleCheckAnswer}
                >
                  Decrypt
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Modal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        title={explanation.title}
      >
        <p style={{ color: "#f8f8f2", lineHeight: 1.6 }}>
          {explanation.explanation}
        </p>
        <div
          style={{
            ...styles.feedbackBox,
            backgroundColor: "rgba(0,0,0,0.2)",
            borderColor: "#6272a4",
            marginTop: "1rem",
          }}
        >
          <strong>Example:</strong> {explanation.example}
        </div>
        <div
          style={{
            ...styles.feedbackBox,
            backgroundColor: "rgba(0,0,0,0.2)",
            borderColor: "#6272a4",
            marginTop: "1rem",
          }}
        >
          <strong>Weakness:</strong> {explanation.weakness}
        </div>
      </Modal>
    </>
  );
};

// --- GAME: DIGITAL FOOTPRINT CHALLENGE ---
const DigitalFootprintChallenge = ({
  onBackToMenu,
}: {
  onBackToMenu: () => void;
}) => {
  const [clues, setClues] = useState(getInitialDigitalFootprintClues());
  const [gameState, setGameState] = useState<"investigating" | "reveal">(
    "investigating"
  );
  const [feedback, setFeedback] = useState<string | null>(null);

  const handlePostClick = (post: DigitalFootprintPost) => {
    if (post.clueType && !clues[post.clueType].found) {
      setClues((prevClues) => ({
        ...prevClues,
        [post.clueType as DigitalFootprintClueType]: {
          ...prevClues[post.clueType as DigitalFootprintClueType],
          found: true,
        },
      }));
      setFeedback(post.clueDetail || "Clue found!");
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  const handleRestart = () => {
    setClues(getInitialDigitalFootprintClues());
    setGameState("investigating");
    setFeedback(null);
  };

  const allCluesFound = Object.values(clues).every((clue) => clue.found);

  if (gameState === "reveal") {
    return (
      <div style={{ paddingTop: "2rem" }}>
        <div style={{ ...styles.header, borderBottom: "1px solid #ff5555" }}>
          <div style={styles.headerIcon}>👺</div>
          <h1 style={{ ...styles.headerTitle, color: "#ff5555" }}>
            Attacker's Playbook
          </h1>
          <p style={styles.headerSubtitle}>
            Here’s how a real attacker would use the info against you.
          </p>
        </div>
        <div
          style={{
            marginTop: "2rem",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          {Object.values(clues).map((clue) => (
            <div
              key={clue.label}
              style={{
                ...styles.emailContainer,
                borderLeft: "4px solid #ff79c6",
              }}
            >
              <h3 style={{ margin: 0, color: "#ff79c6" }}>
                {clue.label}:{" "}
                <span
                  style={{
                    color: "#f1fa8c",
                    fontFamily: "'Roboto Mono', monospace",
                  }}
                >
                  {clue.answer}
                </span>
              </h3>
              <p style={{ marginTop: "0.5rem", color: "#f8f8f2" }}>
                {clue.attackVector}
              </p>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <button
            className="animated-button"
            style={{ ...styles.controlButton, backgroundColor: "#bd93f9" }}
            onClick={handleRestart}
          >
            REPLAY MISSION
          </button>
          <button
            className="animated-button"
            style={{
              ...styles.backButton,
              position: "relative",
              display: "block",
              margin: "1rem auto 0",
            }}
            onClick={onBackToMenu}
          >
            &lt; Main Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <button
        className="animated-button"
        style={styles.backButton}
        onClick={onBackToMenu}
      >
        &lt; Menu
      </button>
      <div style={{ paddingTop: "2rem" }}>
        <div style={styles.header}>
          <div style={styles.headerIcon}>👣</div>
          <h1 style={styles.headerTitle}>{DIGITAL_FOOTPRINT_SCENARIO.title}</h1>
          <p style={styles.headerSubtitle}>
            Examine the social media posts to find key personal info.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: "2rem",
            marginTop: "2rem",
          }}
        >
          {/* Social Media Feed */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            {DIGITAL_FOOTPRINT_SCENARIO.posts
              .slice()
              .reverse()
              .map((post) => {
                const isClue = !!post.clueType;
                const isFound = isClue && clues[post.clueType].found;
                return (
                  <div
                    key={post.id}
                    onClick={() => handlePostClick(post)}
                    style={{
                      ...styles.emailContainer,
                      cursor: isClue && !isFound ? "pointer" : "default",
                      opacity: isClue && isFound ? 0.6 : 1,
                      border:
                        isClue && !isFound
                          ? "1px solid #8be9fd"
                          : "1px solid #44475a",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "1rem",
                      }}
                    >
                      <div style={{ fontSize: "2rem", marginRight: "1rem" }}>
                        {post.avatar}
                      </div>
                      <div>
                        <h4 style={{ margin: 0, color: "#f8f8f2" }}>
                          {post.author}
                        </h4>
                        <p
                          style={{
                            margin: "0.25rem 0 0 0",
                            fontSize: "0.8rem",
                            color: "#6272a4",
                          }}
                        >
                          {post.date}
                        </p>
                      </div>
                    </div>
                    <div style={{ color: "#f8f8f2" }}>{post.content}</div>
                  </div>
                );
              })}
          </div>

          {/* Detective's Notepad */}
          <div>
            <div style={{ ...styles.scenarioContainer, padding: "1.5rem" }}>
              <h3
                style={{
                  margin: 0,
                  color: "#bd93f9",
                  fontFamily: "'Roboto Mono', monospace",
                }}
              >
                // DETECTIVE'S NOTEPAD
              </h3>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.5rem",
                  marginTop: "1.5rem",
                  textAlign: "left",
                }}
              >
                {Object.values(clues).map((clue) => (
                  <div
                    key={clue.label}
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <div
                      style={{
                        fontSize: "1.5rem",
                        marginRight: "1rem",
                        color: clue.found ? "#50fa7b" : "#6272a4",
                      }}
                    >
                      {clue.found ? "✅" : "❓"}
                    </div>
                    <div>
                      <p style={{ margin: 0, color: "#f8f8f2" }}>
                        {clue.label}
                      </p>
                      <p
                        style={{
                          margin: "0.25rem 0 0 0",
                          fontFamily: "'Roboto Mono', monospace",
                          color: clue.found ? "#f1fa8c" : "#6272a4",
                        }}
                      >
                        {clue.found ? clue.answer : "???"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {feedback && (
              <div
                className="feedback-item"
                style={{
                  ...styles.correctFeedbackBox,
                  marginTop: "1rem",
                  textAlign: "left",
                }}
              >
                {feedback}
              </div>
            )}
            {allCluesFound && (
              <button
                className="animated-button"
                style={{
                  ...styles.controlButton,
                  width: "100%",
                  backgroundColor: "#ff5555",
                  color: "#f8f8f2",
                }}
                onClick={() => setGameState("reveal")}
              >
                Reveal Attack Plan
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

// --- COMPONENT: GAME SELECTION MENU ---
const GameSelectionMenu = ({
  onSelectGame,
}: {
  onSelectGame: (game: GameMode) => void;
}) => (
  <div style={styles.header}>
    <div style={styles.headerIcon}>👾</div>
    <h1 style={styles.headerTitle}>Cyber Security Trainer</h1>
    <p style={styles.headerSubtitle}>Choose your training module.</p>
    <div
      style={{
        ...styles.buttonGroup,
        marginTop: "2rem",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <button
        className="animated-button"
        style={{
          ...styles.button,
          backgroundColor: "#ff79c6",
          color: "#282a36",
          width: "80%",
          marginBottom: "1rem",
        }}
        onClick={() => onSelectGame("phishing")}
      >
        🛡️ Phishing Drill
      </button>
      <button
        className="animated-button"
        style={{
          ...styles.button,
          backgroundColor: "#8be9fd",
          color: "#282a36",
          width: "80%",
          marginBottom: "1rem",
        }}
        onClick={() => onSelectGame("databreach")}
      >
        🚨 Data Breach Scenario
      </button>
      <button
        className="animated-button"
        style={{
          ...styles.button,
          backgroundColor: "#f1fa8c",
          color: "#282a36",
          width: "80%",
          marginBottom: "1rem",
        }}
        onClick={() => onSelectGame("cipher")}
      >
        🔒 Cipher Challenge
      </button>
      <button
        className="animated-button"
        style={{
          ...styles.button,
          backgroundColor: "#ffb86c",
          color: "#282a36",
          width: "80%",
        }}
        onClick={() => onSelectGame("digitalfootprint")}
      >
        👣 Digital Footprint
      </button>
    </div>
  </div>
);

// --- MAIN APP COMPONENT ---
export default function CyberSecurityTrainer() {
  const [currentGame, setCurrentGame] = useState<GameMode>("menu");

  const renderGame = () => {
    switch (currentGame) {
      case "phishing":
        return <PhishingDrill onBackToMenu={() => setCurrentGame("menu")} />;
      case "databreach":
        return <DataBreachGame onBackToMenu={() => setCurrentGame("menu")} />;
      case "cipher":
        return <CipherChallenge onBackToMenu={() => setCurrentGame("menu")} />;
      case "digitalfootprint":
        return (
          <DigitalFootprintChallenge
            onBackToMenu={() => setCurrentGame("menu")}
          />
        );
      case "menu":
      default:
        return <GameSelectionMenu onSelectGame={setCurrentGame} />;
    }
  };

  return (
    <div style={styles.container}>
      <GlobalStyles />
      {renderGame()}
    </div>
  );
}
