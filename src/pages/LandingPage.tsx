import React, { useEffect, useState, useRef } from "react";
import heroImage from "./assets/Picture1.jpg";
import stanfordLogo from "./assets/Stanford-Emblem.png";
import harvardLogo from "./assets/harvard.jpeg";
import iitLogo from "./assets/iit.png";
import studentsLaptop from "./assets/students_laptop.jpg";
import authImg from "./assets/undraw_authentication_tbfc.png";
import appDataImg from "./assets/undraw_app-data_vo0p.png";
import onlineLearningImg from "./assets/undraw_online-learning_tgmv.png";
import { FaShieldAlt, FaRocket, FaLock, FaMagic, FaShieldVirus, FaUserShield, FaCloud, FaLaptopCode, FaUserSecret, FaFish, FaExclamationTriangle, FaShoePrints, FaCheckCircle, FaUserPlus } from "react-icons/fa";
import { Link } from "react-router-dom";

// --- Inline CSS for animations and effects ---
const styles = `
.fade-in {
  opacity: 1 !important;
  transform: none !important;
  transition: opacity 0.8s, transform 0.8s;
}
.opacity-0 {
  opacity: 0;
}
.translate-y-8 {
  transform: translateY(2rem);
}
.card-pop, .btn-pop {
  transition: transform 0.2s, box-shadow 0.2s;
  border-radius: 1.5rem;
  background: rgba(20, 30, 70, 0.7);
  box-shadow: 0 2px 24px rgba(59,130,246,0.08);
  border: 1px solid rgba(59,130,246,0.08);
  cursor: pointer;
}
.pop-animate, .btn-animate {
  transform: scale(1.05);
  box-shadow: 0 0 32px 0 #3b82f6, 0 8px 32px rgba(59,130,246,0.18);
}
.card-pop:active, .btn-pop:active {
  transform: scale(1.08);
  box-shadow: 0 0 48px 0 #3b82f6, 0 12px 48px rgba(59,130,246,0.28);
}
.glass-card {
  background: rgba(30, 41, 100, 0.7);
  backdrop-filter: blur(8px);
  border-radius: 1.5rem;
  box-shadow: 0 2px 24px rgba(59,130,246,0.10);
  border: 1px solid rgba(59,130,246,0.10);
}
.hero-gradient {
  background: radial-gradient(circle at 30% 40%, #1a2250 0%, #0a112b 100%);
}
.img-glow {
  box-shadow: 0 0 32px 0 #3b82f6, 0 2px 24px rgba(59,130,246,0.10);
  border-radius: 1.5rem;
}
.floating-cta, .cta-btn {
  background: linear-gradient(90deg, #3b82f6 60%, #60a5fa 100%);
  color: #fff;
  font-weight: bold;
  padding: 1rem 2.5rem;
  border-radius: 2rem;
  box-shadow: 0 4px 24px rgba(59,130,246,0.18);
  transition: box-shadow 0.2s, transform 0.2s;
  display: inline-flex;
  align-items: center;
  font-size: 1.25rem;
  border: none;
  cursor: pointer;
}
.floating-cta:hover, .cta-btn:hover, .btn-pop:hover {
  box-shadow: 0 0 32px 0 #3b82f6, 0 8px 32px rgba(59,130,246,0.28);
  transform: scale(1.05);
}
.floating-cta:active, .cta-btn:active, .btn-pop:active {
  transform: scale(1.08);
  box-shadow: 0 0 48px 0 #3b82f6, 0 12px 48px rgba(59,130,246,0.28);
}
.card-glow {
  box-shadow: 0 0 32px 0 #3b82f6, 0 2px 24px rgba(59,130,246,0.10);
  border: 1px solid #3b82f6;
  background: linear-gradient(135deg, #1e293b 60%, #3b82f6 100%);
  color: #fff;
}
.card-gradient {
  background: linear-gradient(135deg, #3b82f6 0%, #1e293b 100%);
  color: #fff;
}
.card-gradient-light {
  background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
  color: #fff;
}
.card-gradient-dark {
  background: linear-gradient(135deg, #1e293b 0%, #3b82f6 100%);
  color: #fff;
}
.card-gradient-blue {
  background: linear-gradient(135deg, #3b82f6 0%, #1e293b 100%);
  color: #fff;
}
.card-gradient-deep {
  background: linear-gradient(135deg, #192a5d 0%, #3b59cc 100%);
  color: #fff;
}
.icon-bg {
  background: linear-gradient(135deg, #3b82f6 0%, #1e293b 100%);
  border-radius: 1rem;
  padding: 1rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 16px #3b82f644;
  margin-bottom: 1rem;
}
.trusted-logos {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 3rem;
  margin-top: 2rem;
}
.trusted-logo-img {
  height: 60px;
  width: 120px;
  object-fit: contain;
  background: #fff;
  border-radius: 1rem;
  box-shadow: 0 2px 16px rgba(59,130,246,0.10);
  padding: 0.5rem 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
.trusted-logo-img.harvard {
  background: #f5f5f5;
}
.trusted-logo-img.iit {
  background: #fff;
}
.trusted-logo-img.mit {
  background: #fff;
}
.trusted-logo-img.stanford {
  background: #fff;
}
.how-card-img {
  border-radius: 1rem;
  box-shadow: 0 0 16px #3b82f644;
  background: #fff;
  padding: 0.5rem;
  margin-bottom: 1rem;
}
`;

function useInjectStyles(css: string) {
  useEffect(() => {
    const styleTag = document.createElement("style");
    styleTag.textContent = css;
    document.head.appendChild(styleTag);
    return () => {
      document.head.removeChild(styleTag);
    };
  }, [css]);
}

// --- Animated Counter Hook ---
function useAnimatedCounter(target: number, duration = 2000, isPercent = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = target;
    if (start === end) return;
    let increment = end / (duration / 16);
    let current = start;
    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        current = end;
        clearInterval(timer);
      }
      setCount(isPercent ? Math.round(current * 10) / 10 : Math.floor(current));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration, isPercent]);
  return isPercent ? `${count}%` : count.toLocaleString();
}

// --- Fade-in Animation Hook ---
function useFadeInOnScroll(ref: React.RefObject<HTMLElement>) {
  useEffect(() => {
    if (!ref.current) return;
    const node = ref.current;
    node.classList.add("opacity-0", "translate-y-8");
    const observer = new window.IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            node.classList.add("fade-in");
            observer.unobserve(node);
          }
        });
      },
      { threshold: 0.2 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [ref]);
}

// --- Hover/Click Pop Animation ---
function useHoverPop(ref: React.RefObject<HTMLElement>) {
  useEffect(() => {
    if (!ref.current) return;
    const node = ref.current;
    const handleMouseEnter = () => node.classList.add("pop-animate");
    const handleMouseLeave = () => node.classList.remove("pop-animate");
    const handleMouseDown = () => node.classList.add("pop-animate");
    const handleMouseUp = () => node.classList.remove("pop-animate");
    node.addEventListener("mouseenter", handleMouseEnter);
    node.addEventListener("mouseleave", handleMouseLeave);
    node.addEventListener("mousedown", handleMouseDown);
    node.addEventListener("mouseup", handleMouseUp);
    return () => {
      node.removeEventListener("mouseenter", handleMouseEnter);
      node.removeEventListener("mouseleave", handleMouseLeave);
      node.removeEventListener("mousedown", handleMouseDown);
      node.removeEventListener("mouseup", handleMouseUp);
    };
  }, [ref]);
}

function useButtonPop(ref: React.RefObject<HTMLElement>) {
  useEffect(() => {
    if (!ref.current) return;
    const node = ref.current;
    const handleMouseEnter = () => node.classList.add("btn-animate");
    const handleMouseLeave = () => node.classList.remove("btn-animate");
    const handleMouseDown = () => node.classList.add("btn-animate");
    const handleMouseUp = () => node.classList.remove("btn-animate");
    node.addEventListener("mouseenter", handleMouseEnter);
    node.addEventListener("mouseleave", handleMouseLeave);
    node.addEventListener("mousedown", handleMouseDown);
    node.addEventListener("mouseup", handleMouseUp);
    return () => {
      node.removeEventListener("mouseenter", handleMouseEnter);
      node.removeEventListener("mouseleave", handleMouseLeave);
      node.removeEventListener("mousedown", handleMouseDown);
      node.removeEventListener("mouseup", handleMouseUp);
    };
  }, [ref]);
}

export default function LandingPage() {
  useInjectStyles(styles);

  // Counter Animations
  const activeUsers = useAnimatedCounter(50000, 2000);
  const passwordsSecured = useAnimatedCounter(12000, 2000);
  const uptime = useAnimatedCounter(99.9, 2000, true);

  // Fade-in refs
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const moreFeaturesRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const simulationsRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const whyRef = useRef<HTMLDivElement>(null);
  const howRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  useFadeInOnScroll(heroRef);
  useFadeInOnScroll(featuresRef);
  useFadeInOnScroll(moreFeaturesRef);
  useFadeInOnScroll(statsRef);
  useFadeInOnScroll(simulationsRef);
  useFadeInOnScroll(testimonialsRef);
  useFadeInOnScroll(whyRef);
  useFadeInOnScroll(howRef);
  useFadeInOnScroll(ctaRef);
  useFadeInOnScroll(footerRef);

  // Hover pop refs for cards
  const cardRefs = Array.from({ length: 15 }, () => useRef<HTMLDivElement>(null));
  cardRefs.forEach(ref => useHoverPop(ref));

  // Button pop refs
  const btnRefs = Array.from({ length: 3 }, () => useRef<HTMLAnchorElement>(null));
  btnRefs.forEach(ref => useButtonPop(ref));

  return (
    <div className="font-inter text-[#a5b4fc] bg-gradient-to-r from-black via-[#0a1a47] to-[#1d2a6f] animate-gradient">
      {/* Header */}
      <header className="sticky top-0 z-50 rounded-b-3xl py-4 px-6 flex justify-between items-center bg-gradient-to-r from-[#00040f] to-[#1e293b] shadow-lg fade-in">
        <div className="flex items-center space-x-3">
          <FaShieldAlt className="text-[#3b82f6] text-2xl" />
          <span className="font-extrabold text-2xl tracking-tight text-[#93c5fd]">SafeStudy</span>
        </div>
        <nav className="hidden md:flex space-x-8 text-[#93c5fd] font-semibold">
          <a href="#features" className="nav-link">Features</a>
          <a href="#simulations" className="nav-link">Simulations</a>
          <a href="#stats" className="nav-link">Stats</a>
          <a href="#why" className="nav-link">Why Us?</a>
        </nav>
      </header>

      {/* Hero Section */}
      <section ref={heroRef} className="px-6 py-20 text-center shadow-xl mb-16 hero-gradient fade-in">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 text-left">
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6 animate-gradient-text" style={{ color: "#5a7bd6" }}>
              Level Up Your Cybersecurity
            </h1>
            <p className="text-xl md:text-2xl mb-6" style={{ color: "#b7c5ff" }}>Password manager + gamified security labs, built just for students.</p>
            <Link ref={btnRefs[1]} to="/dashboard" className="floating-cta btn-pop">
              <FaRocket className="mr-2" /> Secure Now!
            </Link>
            <p className="mt-4 text-sm text-[#bbd1ff]">No credit card required. Ever.</p>
          </div>
          <div className="flex-1">
            <img src={heroImage} alt="Cybersecurity Illustration" className="img-glow" style={{ border: "4px solid #3b82f6" }}/>
          </div>
        </div>
      </section>

      {/* Trusted By */}
      <section className="py-12 bg-gradient-to-r from-[#0b0f29] to-[#1c2a5e] text-center fade-in">
        <h3 className="text-2xl font-bold text-[#93c5fd] mb-6">Trusted by Students from</h3>
        <div className="trusted-logos">
          <div className="trusted-logo-img mit">
            <img src="https://upload.wikimedia.org/wikipedia/commons/0/0c/MIT_logo.svg" alt="MIT" style={{ height: "40px", width: "auto" }}/>
          </div>
          <div className="trusted-logo-img stanford">
            <img src={stanfordLogo} alt="Stanford" style={{ height: "40px", width: "auto" }}/>
          </div>
          <div className="trusted-logo-img harvard">
            <img src={harvardLogo} alt="Harvard" style={{ height: "40px", width: "auto" }}/>
          </div>
          <div className="trusted-logo-img iit">
            <img src={iitLogo} alt="IIT" style={{ height: "40px", width: "auto" }}/>
          </div>
        </div>
      </section>

      {/* Features */}
      <section ref={featuresRef} id="features" className="mx-auto max-w-6xl px-6 py-20 grid grid-cols-1 md:grid-cols-3 gap-12 fade-in">
        <div ref={cardRefs[0]} className="card-pop card-glow text-center p-8">
          <div className="icon-bg"><FaLock className="text-6xl" /></div>
          <h3 className="text-2xl font-bold mb-3">Zero-Knowledge Vault</h3>
          <p>Passwords encrypted end-to-end. You control your data.</p>
        </div>
        <div ref={cardRefs[1]} className="card-pop card-gradient-light text-center p-8">
          <div className="icon-bg"><FaMagic className="text-6xl" /></div>
          <h3 className="text-2xl font-bold mb-3">Smart Generator</h3>
          <p>Create strong, unique passwords instantly for every service.</p>
        </div>
        <div ref={cardRefs[2]} className="card-pop card-gradient-dark text-center p-8">
          <div className="icon-bg"><FaShieldVirus className="text-6xl" /></div>
          <h3 className="text-2xl font-bold mb-3">Proactive Audits</h3>
          <p>Real-time checks, breach alerts, and actionable safety tips.</p>
        </div>
      </section>

      {/* More Features */}
      <section ref={moreFeaturesRef} id="more-features" className="max-w-6xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-3 gap-12 fade-in">
        <div ref={cardRefs[3]} className="card-pop card-gradient-blue text-center p-8">
          <div className="icon-bg"><FaUserShield className="text-6xl" /></div>
          <h3 className="text-2xl font-bold mb-3">Two-Factor Authentication</h3>
          <p>Protect your vault with 2FA for maximum security.</p>
        </div>
        <div ref={cardRefs[4]} className="card-pop card-glow text-center p-8">
          <div className="icon-bg"><FaCloud className="text-6xl" /></div>
          <h3 className="text-2xl font-bold mb-3">Cloud Sync</h3>
          <p>Access your passwords securely across all devices.</p>
        </div>
        <div ref={cardRefs[5]} className="card-pop card-gradient-dark text-center p-8">
          <div className="icon-bg"><FaLaptopCode className="text-6xl" /></div>
          <h3 className="text-2xl font-bold mb-3">Developer Friendly</h3>
          <p>Open-source project with community contributions.</p>
        </div>
      </section>

      {/* Stats Section with Animated Counters */}
      <section ref={statsRef} id="stats" className="py-20 bg-gray-900 text-white text-center fade-in">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h3 className="counter text-5xl font-extrabold text-[#3b82f6]" data-target="50000">{activeUsers}</h3>
            <p className="mt-3 text-lg">Active Users</p>
          </div>
          <div>
            <h3 className="counter text-5xl font-extrabold text-[#3b82f6]" data-target="12000">{passwordsSecured}</h3>
            <p className="mt-3 text-lg">Passwords Secured</p>
          </div>
          <div>
            <h3 className="counter text-5xl font-extrabold text-[#3b82f6]" data-target="99.9">{uptime}</h3>
            <p className="mt-3 text-lg">Uptime Guarantee</p>
          </div>
        </div>
      </section>

      {/* Simulations */}
      <section ref={simulationsRef} id="simulations" className="mx-auto max-w-6xl px-6 mb-20 rounded-3xl card-gradient-deep shadow-2xl p-12 fade-in">
        <div className="text-center mb-10">
          <span className="text-sm tracking-wide text-[#b7c5ff] font-semibold">LEARN BY PLAYING</span>
          <h2 className="text-4xl font-extrabold mb-4 text-[#e0eaff]">Interactive Security Labs</h2>
          <p className="text-[#a2b7ff] max-w-2xl mx-auto">Practice password safety, spot phishing, and respond to threats with hands-on mini-games.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-[#d0d9ff]">
          <div ref={cardRefs[6]} className="card-pop card-gradient text-center p-8">
            <div className="icon-bg"><FaUserSecret className="text-5xl" /></div>
            <h4 className="text-xl font-semibold mb-2">Cipher Challenge</h4>
          </div>
          <div ref={cardRefs[7]} className="card-pop card-gradient-light text-center p-8">
            <div className="icon-bg"><FaFish className="text-5xl" /></div>
            <h4 className="text-xl font-semibold mb-2">Phishing Drill</h4>
          </div>
          <div ref={cardRefs[8]} className="card-pop card-gradient-dark text-center p-8">
            <div className="icon-bg"><FaExclamationTriangle className="text-5xl" /></div>
            <h4 className="text-xl font-semibold mb-2">Data Breach Response</h4>
          </div>
          <div ref={cardRefs[9]} className="card-pop card-gradient-blue text-center p-8">
            <div className="icon-bg"><FaShoePrints className="text-5xl" /></div>
            <h4 className="text-xl font-semibold mb-2">Digital Footprint</h4>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section ref={howRef} id="how-it-works" className="max-w-6xl mx-auto px-6 py-20 fade-in">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-[#e0eaff]">How SafeStudy Works</h2>
          <p className="text-[#a5b4fc] mt-4 max-w-2xl mx-auto">From sign-up to securing your first password, everything is seamless.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div ref={cardRefs[12]} className="card-pop glass-card">
            <img src={authImg} className="how-card-img w-40 mx-auto mb-6" alt="Sign Up"/>
            <h3 className="text-xl font-bold mb-3">1. Sign Up</h3>
            <p>Create your free student account in seconds.</p>
          </div>
          <div ref={cardRefs[13]} className="card-pop glass-card">
            <img src={appDataImg} className="how-card-img w-40 mx-auto mb-6" alt="Store"/>
            <h3 className="text-xl font-bold mb-3">2. Store</h3>
            <p>Add your first password to the secure vault.</p>
          </div>
          <div ref={cardRefs[14]} className="card-pop glass-card">
            <img src={onlineLearningImg} className="how-card-img w-40 mx-auto mb-6" alt="Learn"/>
            <h3 className="text-xl font-bold mb-3">3. Learn</h3>
            <p>Play cybersecurity games & improve your skills.</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section ref={testimonialsRef} id="testimonials" className="py-20 bg-gradient-to-r from-[#0f172a] to-[#1e293b] fade-in">
        <div className="max-w-6xl mx-auto text-center mb-12">
          <h2 className="text-4xl font-extrabold text-[#e0eaff] mb-4">What Students Say</h2>
          <p className="text-[#a5b4fc] max-w-3xl mx-auto">Trusted by thousands of students worldwide who love our security labs and easy-to-use vault.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-6">
          <div className="glass-card p-6 shadow-lg rounded-2xl card-pop">
            <img src="https://randomuser.me/api/portraits/women/44.jpg" className="w-16 h-16 rounded-full mx-auto mb-4" alt="Sarah"/>
            <p className="italic text-[#ccd9ff]">"Finally, a password manager that feels fun and keeps me safe during uni projects!"</p>
            <h4 className="mt-4 font-bold text-[#93c5fd]">— Sarah, MIT</h4>
          </div>
          <div className="glass-card p-6 shadow-lg rounded-2xl card-pop">
            <img src="https://randomuser.me/api/portraits/men/32.jpg" className="w-16 h-16 rounded-full mx-auto mb-4" alt="Raj"/>
            <p className="italic text-[#ccd9ff]">"The gamified labs helped me understand phishing in minutes. Brilliant!"</p>
            <h4 className="mt-4 font-bold text-[#93c5fd]">— Raj, IIT Bombay</h4>
          </div>
          <div className="glass-card p-6 shadow-lg rounded-2xl card-pop">
            <img src="https://randomuser.me/api/portraits/men/50.jpg" className="w-16 h-16 rounded-full mx-auto mb-4" alt="Daniel"/>
            <p className="italic text-[#ccd9ff]">"I’ve ditched my old password habits thanks to SafeStudy."</p>
            <h4 className="mt-4 font-bold text-[#93c5fd]">— Daniel, Stanford</h4>
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section ref={whyRef} id="why" className="mx-auto max-w-6xl px-6 mb-20 fade-in">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-extrabold mb-6 text-[#ccd9ff]">Built for Students, Secure for All</h2>
            <p className="mb-8 text-[#9cafff]">Campus, clubs, socials—and now cybersecurity, all stress-free.</p>
            <ul className="space-y-4 text-[#a7baff] font-semibold">
              <li><FaCheckCircle className="text-[#3b82f6] mr-2 inline" /> 100% Free</li>
              <li><FaCheckCircle className="text-[#3b82f6] mr-2 inline" /> Privacy First</li>
              <li><FaCheckCircle className="text-[#3b82f6] mr-2 inline" /> Gamified & Fun</li>
            </ul>
          </div>
          <div>
            <img src={studentsLaptop} alt="Students with Laptop" className="img-glow" style={{ border: "4px solid #3b82f6", borderRadius: "1.5rem" }}/>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section ref={ctaRef} className="rounded-t-3xl shadow-lg py-20 text-center bg-gradient-to-r from-[#1c2260] to-[#3a54e8] mb-16 fade-in">
        <h2 className="text-4xl font-extrabold mb-6 text-[#e0eaff] drop-shadow-lg">Ready to Defend Your Digital Life?</h2>
        <p className="text-xl text-[#acc1ff] mb-10 max-w-3xl mx-auto">SafeStudy helps students build their cyber fortress in minutes.</p>
        <Link ref={btnRefs[2]} to="/dashboard" className="inline-block bg-[#3b82f6] text-white font-bold py-4 px-10 rounded-3xl shadow-xl btn-pop hover:bg-[#577efe] transition">
          <FaUserPlus className="mr-3 inline" /> Get Started Free
        </Link>
      </section>

      {/* Footer */}
      <footer ref={footerRef} className="bg-gradient-to-r from-[#111628] to-[#1e2a74] text-[#95aaff] rounded-t-3xl shadow-inner py-8 text-center fade-in">
        <p>&copy; 2025 SafeStudy. All Rights Reserved.</p>
        <p className="text-sm text-[#3b82f6] mt-2">Open source, cybersecurity style.</p>
      </footer>
    </div>
  );
}
