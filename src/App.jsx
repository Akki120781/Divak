import React, { useState, useEffect, useRef } from "react";
import {
  ArrowUpRight,
  Check,
  Calendar,
  Clock,
  ExternalLink,
  ShieldCheck,
  Globe,
  X
} from "lucide-react";

const currentYear = new Date().getFullYear();
const wordmarkLetters = ["D", "I", "V", "A", "K"];
const manifestoWords =
  "Most software agencies write code that gathers dust. Most creative agencies make noise that gets scrolled past. We build the high-conviction intersection: production-grade systems engineered for operational scale, coupled with creator-led activations and hackathon cultures that command real audience attention.".split(
    " "
  );

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navSolid, setNavSolid] = useState(false);
  const [activeWorkFilter, setActiveWorkFilter] = useState("all");
  const [activeStep, setActiveStep] = useState(0);
  const [openService, setOpenService] = useState("custom-tech");
  const [openFaq, setOpenFaq] = useState(0);
  const [activeCaseModal, setActiveCaseModal] = useState(null);
  const [calendlyModalOpen, setCalendlyModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  // Form State
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [selectedServices, setSelectedServices] = useState([
    "Tailor-Made Custom Software",
    "CampusFlow School ERP"
  ]);
  const [selectedBudget, setSelectedBudget] = useState("₹15L – ₹50L");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    brief: "",
    timeSlot: "Weekdays (9:00 PM – 11:00 PM)"
  });

  // Refs for scroll-driven animations
  const stepsContainerRef = useRef(null);
  const wordmarkRef = useRef(null);
  const manifestoRef = useRef(null);
  const [manifestoProgress, setManifestoProgress] = useState(0);
  const [wordmarkProximity, setWordmarkProximity] = useState(() => [0, 0, 0, 0, 0]);

  // Non-blocking, passive scroll listener for navbar
  useEffect(() => {
    const handleScroll = () => {
      const isSolid = window.scrollY > 40;
      setNavSolid((prev) => (prev !== isSolid ? isSolid : prev));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Modal body scroll lock to prevent scroll conflicts
  useEffect(() => {
    if (activeCaseModal || calendlyModalOpen || mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [activeCaseModal, calendlyModalOpen, mobileMenuOpen]);

  // Automatic Process Counter (1-2-3-4) on scroll via IntersectionObserver
  useEffect(() => {
    const container = stepsContainerRef.current;
    if (!container) return;
    const stepElements = container.querySelectorAll("[data-step]");
    if (!stepElements || stepElements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const stepIndex = Number(entry.target.dataset.step);
            if (!isNaN(stepIndex)) {
              setActiveStep(stepIndex);
            }
          }
        });
      },
      {
        rootMargin: "-40% 0px -40% 0px",
        threshold: 0
      }
    );

    stepElements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Smooth scroll and step activation on click
  const handleStepClick = (idx) => {
    setActiveStep(idx);
    const el = stepsContainerRef.current?.querySelector(`[data-step="${idx}"]`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  // Manifesto word-by-word illumination on scroll
  useEffect(() => {
    const handleManifestoScroll = () => {
      const el = manifestoRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const start = windowHeight * 0.85;
      const end = windowHeight * 0.35;
      const current = rect.top;
      const progress = Math.min(1, Math.max(0, (start - current) / (start - end)));
      setManifestoProgress(progress);
    };

    window.addEventListener("scroll", handleManifestoScroll, { passive: true });
    handleManifestoScroll();
    return () => window.removeEventListener("scroll", handleManifestoScroll);
  }, []);

  // Interactive Wordmark pointer tracking matching Arovas physics
  const handleWordmarkPointerMove = (e) => {
    if (!wordmarkRef.current) return;
    const spans = wordmarkRef.current.querySelectorAll("span");
    const factors = Array.from(spans).map((span) => {
      const rect = span.getBoundingClientRect();
      const spanCenterX = rect.left + rect.width / 2;
      const dist = Math.abs(e.clientX - spanCenterX);
      return Math.max(0, 1 - dist / (rect.width * 1.6));
    });
    setWordmarkProximity(factors);
  };

  const handleWordmarkPointerLeave = () => {
    setWordmarkProximity([0, 0, 0, 0, 0]);
  };

  const toggleServicePill = (service) => {
    if (selectedServices.includes(service)) {
      setSelectedServices(selectedServices.filter((s) => s !== service));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    setBookingConfirmed(true);
  };

  // Case Studies & Work Items
  const workItems = [
    {
      id: "campusflow",
      category: "tech",
      client: "CampusFlow – Flagship School ERP",
      title: "Production School Management ERP with Role-Based Dashboards & Razorpay",
      channels: "React + Vite + Firebase + Razorpay",
      image: "/images/campusflow.jpg",
      tag: "Live ERP Demo",
      liveUrl: "https://campusflow.smrpublicschool.in/",
      overview:
        "CampusFlow is a production-grade, multi-tier school management ERP system actively piloted in a live school environment. It replaces scattered physical registers and fragmented apps with a unified, role-based operating system.",
      highlights: [
        "Four dedicated portals: Admin, Teacher, Student, Parent",
        "Firebase Authentication with custom school registration IDs",
        "Firestore real-time data model for attendance, timetables, assignments & exams",
        "Razorpay fee collection with partial-payment support & auto monthly accrual",
        "Attendance-linked staff payroll engine with admin approval workflows"
      ],
      techStack: "React, Vite, Firebase Auth, Cloud Firestore, Razorpay API, TailwindCSS",
      result: "100% automated fee reconciliation and zero attendance discrepancy."
    },
    {
      id: "hackculture",
      category: "hackathons",
      client: "HackCulture – Devnovate Model",
      title: "Collegiate Hackathon & Sprint Engine with Auto-Matching & Radar Scoring",
      channels: "Hackathons + Sprints + Communities",
      image: "/images/hackculture.jpg",
      tag: "Hackathon Platform",
      liveUrl: "https://devnovate.co/",
      overview:
        "Inspired by Devnovate, HackCulture is our all-in-one platform for hosting and scaling hackathons across colleges and tech hubs. It streamlines the chaotic logistics of 500+ participant events.",
      highlights: [
        "One-click participant registration with GitHub & LinkedIn verification",
        "Automated AI team-matching matrix based on complementary skills",
        "Multi-criteria judges scoring radar with live fraud/plagiarism checks",
        "Dynamic real-time leaderboard and automated certificate distribution"
      ],
      techStack: "Next.js, Node.js, WebSockets, Redis, PostgreSQL, AWS",
      result: "Powering hackathons with 2,500+ devs and 40+ college chapters."
    },
    {
      id: "creator-studio",
      category: "creator",
      client: "Divak Creator Lab",
      title: "In-House 4K Studio & Production for High-Retention Podcasting & Reels",
      channels: "In-House Production + Viral Content",
      image: "/images/creator_studio.jpg",
      tag: "Creator & Production",
      liveUrl: null,
      overview:
        "Our dedicated in-house production setup ('khud ka content and production'). We write, shoot on cinema-grade cameras, and engineer viral short-form and long-form intellectual property for tech founders and creators.",
      highlights: [
        "Full studio acoustically treated with multi-cam 4K cinema cameras",
        "Scriptwriting, hook psychology, and thumbnail engineering",
        "End-to-end multi-platform publishing across YouTube, Reels, and X",
        "Creator profile dealing, brand contracts, and rate protection"
      ],
      techStack: "RED/Sony FX3, DaVinci Resolve Studio, Shure SM7B, Final Cut Pro",
      result: "Over 18M organic views generated across managed creator channels."
    },
    {
      id: "whitelabel-erp",
      category: "tech",
      client: "EdTech & Academy Partners",
      title: "Turnkey White-Label Software Outsourcing for Institutions & Agencies",
      channels: "White-Label + Source Code Licensing",
      image: "/images/campusflow.jpg",
      tag: "White-Label Outsourcing",
      liveUrl: "https://campusflow.smrpublicschool.in/",
      overview:
        "Institutional clients and partner agencies license our tested architectures under their own brand. Complete with multi-tenant isolation, custom domains, and branded mobile apps.",
      highlights: [
        "100% white-labeled source code and customized UI design skinning",
        "Dedicated cloud infrastructure deployment with zero vendor lock-in",
        "Turnkey Razorpay, Stripe, and Cashfree gateway setups",
        "SLA-backed engineering support and feature roadmap expansions"
      ],
      techStack: "React, Node.js, Cloud Firestore, Docker, Kubernetes",
      result: "Deployed across 12 partner academies within 3 weeks of agreement."
    },
    {
      id: "creator-brand-deal",
      category: "creator",
      client: "Top D2C & Tech Brands",
      title: "Creator Profile Management, Endorsements & Brand Commercials",
      channels: "Creator Deals + Brand Commercials",
      image: "/images/creator_studio.jpg",
      tag: "Creator Management",
      liveUrl: null,
      overview:
        "We represent creators with high-affinity tech audiences, structuring high-value brand deals, multi-video campaigns, and ROI-driven product sponsorships.",
      highlights: [
        "Direct negotiation of deliverables, usage rights, and exclusivity clauses",
        "Escrow-protected payment contracts and timeline enforcement",
        "Casting, creative direction, and high-impact commercial production"
      ],
      techStack: "Brand Partnership CRM, Creator Metrics Analytics, Escrow Systems",
      result: "Over ₹1.2 Cr in creator brand sponsorships closed in 2024."
    },
    {
      id: "campus-activations",
      category: "hackathons",
      client: "HackCulture Campus League",
      title: "On-Ground College Activations, Workshops & Ambassador Networks",
      channels: "150+ Colleges + Campus Ambassadorships",
      image: "/images/hackculture.jpg",
      tag: "Events & Campaigns",
      liveUrl: null,
      overview:
        "Activating student communities in tier-1 and tier-2 engineering colleges across India through hands-on hackathons, technical seminars, and student ambassador networks.",
      highlights: [
        "On-ground campus booths, student developer registration drives",
        "Workshops on System Design, Full-Stack Dev, and Open Source",
        "Direct talent pipeline connecting top performers to hiring companies"
      ],
      techStack: "HackCulture Portal, QR Check-in Systems, Student Ambassador Dashboards",
      result: "Direct engagement with 35,000+ engineering students across India."
    }
  ];

  const filteredWork =
    activeWorkFilter === "all"
      ? workItems
      : workItems.filter((item) => item.category === activeWorkFilter);

  // Services Accordion Data
  const servicesData = [
    {
      id: "custom-tech",
      glyph: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="16 18 22 12 16 6"></polyline>
          <polyline points="8 6 2 12 8 18"></polyline>
        </svg>
      ),
      title: "Vertical 1: Tailor-Made Custom Software",
      desc: "Bespoke engineering tailored to your exact operational workflows. We build web applications, high-throughput microservices, mobile apps, and AI automations that scale without breaking.",
      chips: ["Web Applications", "Mobile Apps (iOS & Android)", "API & Microservices", "AI Automation Pipelines", "Enterprise DB Design", "100% IP Ownership"],
      bestFor: "Startups and enterprises needing proprietary software with zero compromises on performance or security."
    },
    {
      id: "whitelabel-tech",
      glyph: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
          <line x1="8" y1="21" x2="16" y2="21"></line>
          <line x1="12" y1="17" x2="12" y2="21"></line>
        </svg>
      ),
      title: "Vertical 2: White Label Software Outsourcing",
      desc: "Battle-tested, turnkey platforms ready to be re-branded and deployed under your company or client name. We handle core engineering, maintenance, and multi-tenant hosting while you retain the customer relationship.",
      chips: ["CampusFlow ERP Licensing", "Agency Software Outsourcing", "Turnkey SaaS Products", "Dedicated Dev Pods", "Custom Domain Skinning", "SLA Support"],
      bestFor: "Agencies wanting to sell software products and institutions looking for instant production-ready solutions."
    },
    {
      id: "creator-management",
      glyph: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      ),
      title: "Creator Management & Profile Dealing",
      desc: "We handle the business side of creator careers: negotiating brand contracts, rate cards, exclusivity rights, and multi-platform monetization so creators focus purely on making content.",
      chips: ["Creator Representation", "Brand Deal Matchmaking", "Rate Negotiation", "Contract & Escrow Protection", "Long-term Ambassadorships", "Sponsorship Packaging"],
      bestFor: "Creators wanting higher-paying, hassle-free brand sponsorships and brands seeking vetted talent."
    },
    {
      id: "inhouse-production",
      glyph: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="23 7 16 12 23 17 23 7"></polygon>
          <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
        </svg>
      ),
      title: "In-House & Brand Content Production",
      desc: "Own content production ('khud ka content') and commercial film production. We operate state-of-the-art studio facilities for recording podcasts, high-retention short-form videos, and commercial product demos.",
      chips: ["4K Cinema Studio", "Podcast Production", "High-Retention Reels & Shorts", "D2C Brand Commercials", "Scriptwriting & Hooks", "Thumbnail Engineering"],
      bestFor: "Founders, tech brands, and creators looking for studio-grade video production that actually converts."
    },
    {
      id: "hackculture-events",
      glyph: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
      ),
      title: "Events, HackCulture & Campus Activations",
      desc: "We run end-to-end technical hackathons, collegiate fests, and on-ground activations. Powered by our proprietary HackCulture platform (Devnovate-style), connecting student developers directly with sponsors.",
      chips: ["Nationwide Hackathons", "Campus Ambassador Programs", "Technical Seminars", "Corporate Innovation Days", "Judging & Leaderboard Platform", "Talent Sourcing"],
      bestFor: "Universities, tech communities, and corporate sponsors wanting real on-ground tech culture."
    }
  ];

  // Process Steps Data
  const processSteps = [
    {
      num: "01",
      title: "Listen & Technical Audit",
      desc: "We dissect your operational bottlenecks, product specs, or target creator demographic. We align on measurable success criteria in clear, no-nonsense language.",
      chips: ["Architecture Review", "Operational Scoping", "Audience Blueprint"]
    },
    {
      num: "02",
      title: "Shape Architecture & Strategy",
      desc: "We build database schemas, interface wireframes, or video production storyboards before writing a line of code or setting up lighting. You see the entire plan mapped out.",
      chips: ["System Schema Design", "UI/UX Prototypes", "Production Scripts"]
    },
    {
      num: "03",
      title: "Make, Code & Produce",
      desc: "Engineers and video producers work in synchronized weekly sprints. You test live staging builds or review video cuts every week—zero big reveals at the 11th hour.",
      chips: ["Agile Code Sprints", "4K Studio Shoots", "CI/CD Staging Builds"]
    },
    {
      num: "04",
      title: "Launch, Scale & Support",
      desc: "We deploy to production cloud infrastructures, configure Razorpay payments, launch content distribution, and monitor performance daily. You receive clean monthly executive reports.",
      chips: ["Production Rollout", "Razorpay Reconciliation", "SLA Engineering"]
    }
  ];

  // FAQ Items Data
  const faqItems = [
    {
      q: "Can we license CampusFlow ERP as a white-label solution for our school or agency?",
      a: "Yes, absolutely! CampusFlow is available as a complete white-label solution. You can deploy it with your custom domain, custom school branding, and configure your own Razorpay payment credentials. We provide both turnkey hosted deployments and source code licensing options."
    },
    {
      q: "How does the Calendly software integration and availability work?",
      a: "We have dedicated, guaranteed availability windows for technical consultations, founder syncs, and architecture reviews: Weekdays from 9:00 PM to 11:00 PM IST (perfect for evening syncs after office hours) and All Days / Weekends from 9:00 AM to 12:00 PM IST. You can click 'Schedule Call' anywhere on this page to pick your slot with automated Google Meet calendar invites."
    },
    {
      q: "What is the difference between Tailor-Made Custom Software and White Label Outsourcing?",
      a: "Tailor-Made Custom Software is built 100% from scratch to fit your exact bespoke workflow, with custom architecture, custom designs, and full IP ownership transfer. White Label Outsourcing lets you take our pre-built, production-tested software platforms (like CampusFlow School ERP or HackCulture) and launch them rapidly under your own branding at a fraction of custom dev cost."
    },
    {
      q: "What does 'Khud ka content and production' and Creator Management include?",
      a: "We operate a fully equipped, acoustically treated 4K video & podcast studio in-house. We produce our own intellectual properties, manage high-retention video production for clients, and handle creator representation—negotiating high-ticket brand deals, sponsor contracts, rate cards, and escrow settlements."
    },
    {
      q: "How does the HackCulture platform compare to Devnovate?",
      a: "HackCulture is our high-octane hackathon and developer event engine inspired by Devnovate. It provides one-click registrations, algorithmic team auto-matching, real-time code submission reviews, multi-criteria judge radar scoring, and live leaderboards to power college hackathons and corporate developer sprints."
    },
    {
      q: "How quickly can we kick off a project with Divak?",
      a: "Usually within 3 to 5 business days after agreeing on the fixed-price proposal. For urgent launches or white-label ERP setups, we can deploy a dedicated staging environment within 48 hours."
    }
  ];

  return (
    <div className="surface-paper" style={{ minHeight: "100vh" }}>
      {/* HEADER NAVIGATION */}
      <header className="nav" data-solid={navSolid}>
        <div className="wrap nav-inner">
          <a className="logo" href="#top" aria-label="Divak Home">
            <svg className="logo-symbol" viewBox="0 0 64 64" aria-hidden="true">
              <path d="M32 10 51 54h-10L32 32 23 54H13Z" fill="currentColor"></path>
              <ellipse
                cx="32"
                cy="39"
                rx="27"
                ry="8"
                fill="none"
                style={{ stroke: "var(--accent)" }}
                strokeWidth="3.5"
                transform="rotate(-14 32 39)"
              ></ellipse>
            </svg>
            <span>Divak</span>
          </a>

          <nav aria-label="Main Navigation">
            <ul className="nav-links">
              <li>
                <a href="#products">Products &amp; ERP</a>
              </li>
              <li>
                <a href="#tech">Tech Solutions</a>
              </li>
              <li>
                <a href="#creator">Creator &amp; Media</a>
              </li>
              <li>
                <a href="#work">Work</a>
              </li>
              <li>
                <a href="#process">How We Work</a>
              </li>
              <li>
                <a href="#faq">FAQ</a>
              </li>
            </ul>
          </nav>

          <div className="nav-actions">
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setCalendlyModalOpen(true)}
              title="Schedule consultation (Weekdays 9-11 PM, All Days 9-12 AM/PM)"
            >
              <Calendar className="btn-icon" size={16} />
              <span>Schedule Call</span>
            </button>
            <a className="btn btn-sm" href="#contact">
              <span>Start a Project</span>
              <ArrowUpRight className="btn-icon" size={16} />
            </a>
            <button
              className="nav-toggle"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle Navigation"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="mobile-menu">
          <div>
            <ul>
              <li>
                <a href="#products" onClick={() => setMobileMenuOpen(false)}>
                  01 // Products &amp; CampusFlow ERP
                </a>
              </li>
              <li>
                <a href="#tech" onClick={() => setMobileMenuOpen(false)}>
                  02 // Two Technical Verticals
                </a>
              </li>
              <li>
                <a href="#creator" onClick={() => setMobileMenuOpen(false)}>
                  03 // Creator &amp; In-House Production
                </a>
              </li>
              <li>
                <a href="#work" onClick={() => setMobileMenuOpen(false)}>
                  04 // Selected Work
                </a>
              </li>
              <li>
                <a href="#process" onClick={() => setMobileMenuOpen(false)}>
                  05 // How We Work
                </a>
              </li>
              <li>
                <a href="#faq" onClick={() => setMobileMenuOpen(false)}>
                  06 // FAQ
                </a>
              </li>
            </ul>
          </div>
          <div style={{ display: "grid", gap: "1rem", marginTop: "2rem" }}>
            <button
              className="btn btn-ghost"
              onClick={() => {
                setMobileMenuOpen(false);
                setCalendlyModalOpen(true);
              }}
            >
              <Calendar size={18} /> Book Call (9-11 PM / 9-12)
            </button>
            <a
              className="btn"
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
            >
              Start a Project <ArrowUpRight size={18} />
            </a>
          </div>
        </div>
      )}

      <main id="main">
        {/* HERO SECTION */}
        <section id="top" className="hero surface-ink" aria-labelledby="hero-title">
          <div className="wrap">
            <div className="hero-grid">
              <div className="hero-copy">
                <div className="badge-tag">
                  <span className="badge-dot"></span>
                  Engineering &bull; White-Label SaaS &bull; Creator Activations
                </div>
                <h1 id="hero-title">
                  <span className="hero-line">
                    <span>Engineering tech</span>
                  </span>
                  <span className="hero-line">
                    <span>that scales, content</span>
                  </span>
                  <span className="hero-line">
                    <span style={{ color: "var(--accent)" }}>that converts.</span>
                  </span>
                </h1>
                <p className="hero-sub">
                  Divak is a hybrid technology development studio and activation engine in India.
                  We build custom tailor-made software, license battle-tested white-label SaaS like{" "}
                  <strong>CampusFlow School ERP</strong>, produce viral creator content, and run
                  nationwide hackathon cultures.
                </p>
                <div className="hero-actions">
                  <a className="btn" href="#products">
                    <span>Explore Products</span>
                    <ArrowUpRight className="btn-icon" size={18} />
                  </a>
                  <button
                    className="btn btn-ghost"
                    onClick={() => setCalendlyModalOpen(true)}
                  >
                    <Clock size={18} />
                    <span>Book Call (Weekdays 9-11 PM / All Days 9-12)</span>
                  </button>
                </div>
              </div>

              {/* HERO STAGE / ORBITAL GRAPHIC MATCHING AROVAS */}
              <div className="hero-stage">
                <div className="hero-poster-wrap">
                  <svg className="hero-poster" viewBox="0 0 100 100" aria-hidden="true">
                    <defs>
                      <radialGradient id="poster-sun">
                        <stop offset="0" style={{ stopColor: "var(--accent-glow)" }}></stop>
                        <stop offset="0.38" style={{ stopColor: "var(--accent)" }}></stop>
                        <stop offset="0.62" style={{ stopColor: "var(--accent)", stopOpacity: 0.4 }}></stop>
                        <stop offset="1" style={{ stopColor: "var(--accent)", stopOpacity: 0 }}></stop>
                      </radialGradient>
                      <radialGradient id="poster-blue">
                        <stop offset="0" style={{ stopColor: "var(--primary-glow)" }}></stop>
                        <stop offset="0.4" style={{ stopColor: "var(--primary)" }}></stop>
                        <stop offset="1" style={{ stopColor: "var(--primary)", stopOpacity: 0 }}></stop>
                      </radialGradient>
                      <linearGradient id="poster-glass" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0" style={{ stopColor: "var(--glass)", stopOpacity: 0.55 }}></stop>
                        <stop offset="0.5" style={{ stopColor: "var(--secondary)", stopOpacity: 0.18 }}></stop>
                        <stop offset="1" style={{ stopColor: "var(--primary)", stopOpacity: 0.5 }}></stop>
                      </linearGradient>
                    </defs>

                    {/* Glowing Sun and Blue orbs */}
                    <circle cx="58" cy="42" r="28" fill="url(#poster-sun)"></circle>
                    <circle cx="36" cy="62" r="24" fill="url(#poster-blue)"></circle>

                    {/* Geometric Divak Center Glyph (Monogram D for Divak) */}
                    <path
                      className="hero-poster-mark"
                      d="M 36 22 H 55 C 68 22 78 32 78 49 C 78 66 68 78 55 78 H 36 Z M 46 34 H 54 C 61 34 66 40 66 49 C 66 58 61 66 54 66 H 46 Z"
                      fill="url(#poster-glass)"
                      fillRule="evenodd"
                      style={{ stroke: "var(--glass)", strokeOpacity: 0.5, strokeWidth: "0.4" }}
                    ></path>

                    {/* Elliptical Satellite Orbit Path */}
                    <path
                      d="M 8 58 A 42 12 -12 1 1 92 40 A 42 12 -12 1 1 8 58"
                      fill="none"
                      style={{ stroke: "var(--secondary)", strokeOpacity: 0.45, strokeWidth: "0.3" }}
                    ></path>

                    {/* Outer Orbit Path */}
                    <ellipse
                      cx="50"
                      cy="50"
                      rx="38"
                      ry="38"
                      fill="none"
                      stroke="var(--line-ink)"
                      strokeWidth="0.25"
                      strokeDasharray="2 2"
                    ></ellipse>

                    {/* Animated Moving Satellites */}
                    <circle r="1.8" style={{ fill: "var(--accent)" }}>
                      <animateMotion
                        dur="20s"
                        repeatCount="indefinite"
                        path="M 8 58 A 42 12 -12 1 1 92 40 A 42 12 -12 1 1 8 58"
                        begin="-0s"
                      ></animateMotion>
                    </circle>
                    <circle r="1.6" style={{ fill: "var(--secondary)" }}>
                      <animateMotion
                        dur="20s"
                        repeatCount="indefinite"
                        path="M 8 58 A 42 12 -12 1 1 92 40 A 42 12 -12 1 1 8 58"
                        begin="-4s"
                      ></animateMotion>
                    </circle>
                    <circle r="1.8" style={{ fill: "var(--paper)" }}>
                      <animateMotion
                        dur="20s"
                        repeatCount="indefinite"
                        path="M 8 58 A 42 12 -12 1 1 92 40 A 42 12 -12 1 1 8 58"
                        begin="-8s"
                      ></animateMotion>
                    </circle>
                    <circle r="1.6" style={{ fill: "var(--tertiary)" }}>
                      <animateMotion
                        dur="20s"
                        repeatCount="indefinite"
                        path="M 8 58 A 42 12 -12 1 1 92 40 A 42 12 -12 1 1 8 58"
                        begin="-12s"
                      ></animateMotion>
                    </circle>
                    <circle r="1.8" style={{ fill: "var(--accent)" }}>
                      <animateMotion
                        dur="20s"
                        repeatCount="indefinite"
                        path="M 8 58 A 42 12 -12 1 1 92 40 A 42 12 -12 1 1 8 58"
                        begin="-16s"
                      ></animateMotion>
                    </circle>
                  </svg>
                </div>
              </div>
            </div>

            {/* HERO FOOT */}
            <div className="hero-foot">
              <div>
                <p>
                  <strong>Custom Engineering &bull; White-Label SaaS &bull; Creator Studio &bull; HackCulture</strong>
                </p>
                <p style={{ marginTop: "0.25rem" }}>
                  Active production systems deployed &bull; Headquartered in India, serving global partners.
                </p>
              </div>
              <div className="availability-pill">
                <span className="badge-dot"></span>
                <span>
                  Calendly Open: <strong>Weekdays 9–11 PM</strong> | <strong>All Days 9–12</strong>
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* MARQUEE BANNER */}
        <div className="marquee" aria-label="Divak Core Verticals and Capabilities">
          <div className="marquee-track" aria-hidden="true">
            {[1, 2].map((group) => (
              <React.Fragment key={group}>
                <span className="marquee-item">
                  Tailor-Made Custom Software
                  <svg viewBox="0 0 24 24"><path d="M12 0c1 7 5 11 12 12-7 1-11 5-12 12-1-7-5-11-12-12 7-1 11-5 12-12Z" fill="currentColor"></path></svg>
                </span>
                <span className="marquee-item">
                  White Label Outsourcing
                  <svg viewBox="0 0 24 24"><path d="M12 0c1 7 5 11 12 12-7 1-11 5-12 12-1-7-5-11-12-12 7-1 11-5 12-12Z" fill="currentColor"></path></svg>
                </span>
                <span className="marquee-item">
                  CampusFlow School ERP
                  <svg viewBox="0 0 24 24"><path d="M12 0c1 7 5 11 12 12-7 1-11 5-12 12-1-7-5-11-12-12 7-1 11-5 12-12Z" fill="currentColor"></path></svg>
                </span>
                <span className="marquee-item">
                  Khud Ka Content &amp; Production
                  <svg viewBox="0 0 24 24"><path d="M12 0c1 7 5 11 12 12-7 1-11 5-12 12-1-7-5-11-12-12 7-1 11-5 12-12Z" fill="currentColor"></path></svg>
                </span>
                <span className="marquee-item">
                  Creator Profile Dealing
                  <svg viewBox="0 0 24 24"><path d="M12 0c1 7 5 11 12 12-7 1-11 5-12 12-1-7-5-11-12-12 7-1 11-5 12-12Z" fill="currentColor"></path></svg>
                </span>
                <span className="marquee-item">
                  HackCulture Events
                  <svg viewBox="0 0 24 24"><path d="M12 0c1 7 5 11 12 12-7 1-11 5-12 12-1-7-5-11-12-12 7-1 11-5 12-12Z" fill="currentColor"></path></svg>
                </span>
                <span className="marquee-item">
                  Devnovate Model Hackathons
                  <svg viewBox="0 0 24 24"><path d="M12 0c1 7 5 11 12 12-7 1-11 5-12 12-1-7-5-11-12-12 7-1 11-5 12-12Z" fill="currentColor"></path></svg>
                </span>
                <span className="marquee-item">
                  Razorpay Auto-Reconciliation
                  <svg viewBox="0 0 24 24"><path d="M12 0c1 7 5 11 12 12-7 1-11 5-12 12-1-7-5-11-12-12 7-1 11-5 12-12Z" fill="currentColor"></path></svg>
                </span>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* MANIFESTO / PHILOSOPHY */}
        <section className="surface-paper band" aria-labelledby="about-title">
          <div className="wrap">
            <h2 id="about-title" className="sr-only">About Divak</h2>
            <p ref={manifestoRef} className="manifesto-text">
              {manifestoWords.map((word, wIdx) => {
                const wordProgressStart = wIdx / manifestoWords.length;
                const isLit = manifestoProgress >= wordProgressStart;
                return (
                  <span
                    key={wIdx}
                    className="manifesto-word"
                    style={{
                      opacity: isLit ? 1 : 0.18,
                      color: isLit ? "var(--on-paper)" : "var(--on-paper-muted)",
                      transition: "opacity 0.25s ease, color 0.25s ease"
                    }}
                  >
                    {word}{" "}
                  </span>
                );
              })}
            </p>
            <div className="manifesto-foot">
              <div>
                <h3>Two Technical Verticals</h3>
                <p>
                  Bespoke tailor-made software engineered to exact specs, alongside proven white-label turnkey products (like CampusFlow ERP) ready for instant branded deployment.
                </p>
              </div>
              <div>
                <h3>In-House Production &amp; Creator Management</h3>
                <p>
                  We run our own 4K cinema studio ('khud ka content'), produce viral commercial campaigns, and manage creator dealmaking with escrow protection.
                </p>
              </div>
              <div>
                <h3>Battle-Tested in Live Production</h3>
                <p>
                  Zero mockups or vaporware. Our products are piloted in active schools and colleges, processing real-time attendance, timetables, and Razorpay fee accruals.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FLAGSHIP PRODUCTS SECTION */}
        <section id="products" className="surface-ink band" aria-labelledby="products-title">
          <div className="wrap">
            <div className="section-head">
              <div className="badge-tag">
                <span className="badge-dot"></span>
                Flagship Products Ecosystem
              </div>
              <h2 id="products-title">Our Products</h2>
              <p>
                Proven, production-deployed software products you can license, white-label, or customize for your enterprise.
              </p>
            </div>

            {/* FEATURED: CAMPUSFLOW SCHOOL MANAGEMENT ERP */}
            <div className="products-grid">
              <div className="featured-product-card">
                <div className="featured-product-content">
                  <div>
                    <div className="badge-tag" style={{ background: "rgba(91, 107, 42, 0.4)", color: "var(--secondary)" }}>
                      Flagship Production ERP &bull; Live Demo Active
                    </div>
                    <div className="featured-product-head">
                      <h3>CampusFlow – School Management ERP</h3>
                      <p className="featured-product-desc">
                        Built and deployed in a live production school environment. A complete institutional operating system replacing paper registers, manual fees calculation, and fragmented communications with four unified role-based dashboards.
                      </p>
                    </div>

                    <ul className="product-features-list">
                      <li>
                        <Check size={18} />
                        <span><strong>Role-Based Portals:</strong> Dedicated, permission-governed interfaces for Admin, Teacher, Student, and Parent users.</span>
                      </li>
                      <li>
                        <Check size={18} />
                        <span><strong>Firebase Authentication &amp; Custom School IDs:</strong> Cryptographic role validation with custom school registration IDs.</span>
                      </li>
                      <li>
                        <Check size={18} />
                        <span><strong>Real-time Firestore Engine:</strong> Sub-second synchronization for daily attendance, timetable generation, assignments &amp; exams.</span>
                      </li>
                      <li>
                        <Check size={18} />
                        <span><strong>Integrated Razorpay Fee Accrual:</strong> Online payment collection with partial-payment support, automated monthly accrual, and instant receipt generation.</span>
                      </li>
                      <li>
                        <Check size={18} />
                        <span><strong>Attendance-Linked Payroll:</strong> Automated teacher and staff payroll calculations mapped directly to biometric and daily attendance records with admin approval workflows.</span>
                      </li>
                      <li>
                        <Check size={18} />
                        <span><strong>Modern Tech Stack:</strong> Engineered with React, Vite, Firebase Auth, Cloud Firestore, Razorpay API, and TailwindCSS.</span>
                      </li>
                    </ul>
                  </div>

                  <div className="featured-product-actions">
                    <a
                      className="btn"
                      href="https://campusflow.smrpublicschool.in/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span>Launch Live Demo</span>
                      <ExternalLink className="btn-icon" size={16} />
                    </a>
                    <button
                      className="btn btn-ghost"
                      onClick={() => setActiveCaseModal(workItems[0])}
                    >
                      <span>View ERP Architecture</span>
                      <ArrowUpRight className="btn-icon" size={16} />
                    </button>
                    <button
                      className="btn btn-ghost"
                      onClick={() => {
                        setSelectedServices(["CampusFlow School ERP", "White Label Software Outsourcing"]);
                        window.location.href = "#contact";
                      }}
                    >
                      <span>Get White-Label License</span>
                    </button>
                  </div>
                </div>

                <div className="featured-product-visual">
                  <img
                    src="/images/campusflow.jpg"
                    alt="CampusFlow School Management ERP Admin Dashboard"
                    loading="lazy"
                  />
                  <div className="live-badge-overlay">
                    <span className="badge-dot"></span>
                    <span>LIVE PILOT ACTIVE</span>
                  </div>
                </div>
              </div>

              {/* SECONDARY PRODUCTS: DEVNOVATE REPLICA (HACKCULTURE) & DEVRANK ECOSYSTEM */}
              <div className="secondary-products-grid">
                {/* HACKCULTURE / DEVNOVATE REPLICA */}
                <div className="secondary-product-card">
                  <div className="secondary-product-visual">
                    <img
                      src="/images/hackculture.jpg"
                      alt="HackCulture Collegiate Hackathon Platform"
                      loading="lazy"
                    />
                    <div className="live-badge-overlay">
                      <span>DEVNOVATE MODEL</span>
                    </div>
                  </div>
                  <div className="secondary-product-content">
                    <div>
                      <div className="badge-tag">Hackathon OS</div>
                      <h4>HackCulture – Hackathon &amp; Sprints Engine</h4>
                      <p>
                        Our complete Devnovate replica and hackathon operating system. Features 1-click registration, algorithmic team auto-matching matrix, real-time code submission review, judges scoring radar, and live dynamic leaderboards.
                      </p>
                      <div style={{ marginTop: "1rem" }} className="chips">
                        <span className="chip">1-Click Signup</span>
                        <span className="chip">Auto-Team Match</span>
                        <span className="chip">Judges Radar</span>
                        <span className="chip">Live Leaderboard</span>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                      <button
                        className="btn btn-sm btn-ghost"
                        onClick={() => setActiveCaseModal(workItems[1])}
                      >
                        Explore Platform <ArrowUpRight size={14} />
                      </button>
                      <button
                        className="btn btn-sm"
                        onClick={() => {
                          setSelectedServices(["HackCulture Events & Hackathons"]);
                          window.location.href = "#contact";
                        }}
                      >
                        Host a Hackathon
                      </button>
                    </div>
                  </div>
                </div>

                {/* VICKYBYTES MODEL DEVRANK & TALENT ECOSYSTEM */}
                <div className="secondary-product-card">
                  <div className="secondary-product-visual">
                    <img
                      src="/images/creator_studio.jpg"
                      alt="Creator Studio & Dev Talent Ecosystem"
                      loading="lazy"
                    />
                    <div className="live-badge-overlay">
                      <span>VICKYBYTES ECOSYSTEM</span>
                    </div>
                  </div>
                  <div className="secondary-product-content">
                    <div>
                      <div className="badge-tag">Dev Talent Cloud</div>
                      <h4>DevRank &amp; Developer Proof-of-Work</h4>
                      <p>
                        Inspired by VickyBytes: a verifiable developer ranking score out of 1,000, aggregated from shipped code, GitHub commits, and published technical tutorials. Replaces resume screening for companies hiring top engineers.
                      </p>
                      <div style={{ marginTop: "1rem" }} className="chips">
                        <span className="chip">Proof-of-Work</span>
                        <span className="chip">DevRank Score</span>
                        <span className="chip">Machine Challenges</span>
                        <span className="chip">Vetted Hires</span>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                      <button
                        className="btn btn-sm btn-ghost"
                        onClick={() => setCalendlyModalOpen(true)}
                      >
                        Hire Ranked Talent <ArrowUpRight size={14} />
                      </button>
                      <a className="btn btn-sm" href="#contact">
                        Get Started
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TWO TECHNICAL VERTICALS & SERVICES ACCORDION */}
        <section id="tech" className="surface-paper band" aria-labelledby="services-title">
          <div className="wrap services">
            <div className="section-head">
              <div className="badge-tag">
                <span className="badge-dot"></span>
                Two Core Verticals &amp; Creative Engine
              </div>
              <h2 id="services-title">What we do</h2>
              <p>
                From custom architecture and white-label source code to high-converting creator studios and collegiate hackathons.
              </p>
              <div style={{ marginTop: "1.5rem" }}>
                <button
                  className="btn btn-ink"
                  onClick={() => setCalendlyModalOpen(true)}
                >
                  <Calendar size={18} /> Schedule Technical Consultation
                </button>
              </div>
            </div>

            <ul className="cap-list">
              {servicesData.map((svc) => (
                <li
                  key={svc.id}
                  id={`cap-${svc.id}`}
                  className="cap-item"
                  data-open={openService === svc.id}
                >
                  <h3>
                    <button
                      className="cap-trigger"
                      aria-expanded={openService === svc.id}
                      onClick={() =>
                        setOpenService(openService === svc.id ? null : svc.id)
                      }
                    >
                      <span className="cap-glyph">{svc.glyph}</span>
                      <span className="cap-title">{svc.title}</span>
                      <span className="cap-plus" aria-hidden="true"></span>
                    </button>
                  </h3>
                  <div
                    className="cap-body"
                    style={{
                      maxHeight: openService === svc.id ? "600px" : "0px",
                      opacity: openService === svc.id ? 1 : 0
                    }}
                  >
                    <div className="cap-body-inner">
                      <p>{svc.desc}</p>
                      <div>
                        <h4>What you get</h4>
                        <ul className="chips">
                          {svc.chips.map((chip, idx) => (
                            <li key={idx} className="chip">
                              {chip}
                            </li>
                          ))}
                        </ul>
                        <h4 style={{ marginTop: "1.5rem" }}>Best for</h4>
                        <p>{svc.bestFor}</p>
                        <a
                          className="cap-more"
                          href="#contact"
                          onClick={() => {
                            if (!selectedServices.includes(svc.title)) {
                              setSelectedServices([...selectedServices, svc.title]);
                            }
                          }}
                        >
                          Book this vertical <ArrowUpRight className="btn-icon" size={16} />
                        </a>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* WORK & CASE STUDIES */}
        <section id="work" className="surface-ink band" aria-labelledby="work-title">
          <div className="wrap">
            <div className="work-head">
              <h2 id="work-title" className="work-title">
                Work<span className="work-count" aria-hidden="true">06</span>
              </h2>
              <div className="work-head-side">
                <p>
                  Selected software deployments, white-label platforms, and creator activations. Click any card to inspect architecture, metrics, and live demos.
                </p>
                <div className="filters" role="group" aria-label="Filter work by type">
                  {[
                    { id: "all", label: "All" },
                    { id: "tech", label: "Tech & ERP" },
                    { id: "hackathons", label: "Hackathons" },
                    { id: "creator", label: "Creator & Media" }
                  ].map((filter) => (
                    <button
                      key={filter.id}
                      className="filter"
                      aria-pressed={activeWorkFilter === filter.id}
                      onClick={() => setActiveWorkFilter(filter.id)}
                    >
                      {activeWorkFilter === filter.id && <span className="filter-pill"></span>}
                      <span>{filter.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* WORK GRID */}
            <div className="work-grid">
              {filteredWork.map((item) => (
                <article key={item.id} className="work-card">
                  <div
                    className="work-link"
                    onClick={() => setActiveCaseModal(item)}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="work-media">
                      <img src={item.image} alt={item.title} loading="lazy" />
                      <span className="work-tag">{item.tag}</span>
                      <span className="work-open" aria-hidden="true">
                        Explore Case <ArrowUpRight className="work-open-icon" size={16} />
                      </span>
                    </div>
                    <div className="work-meta">
                      <div>
                        <p className="work-client">{item.client}</p>
                        <h3>{item.title}</h3>
                      </div>
                      <p className="work-channels">{item.channels}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* HOW WE WORK / PROCESS */}
        <section id="process" className="surface-ink band" aria-labelledby="process-title">
          <div className="wrap process">
            <div className="process-aside">
              <div className="section-head">
                <div className="badge-tag">
                  <span className="badge-dot"></span>
                  Agile Delivery Architecture
                </div>
                <h2 id="process-title">How we work</h2>
                <p>
                  A battle-tested progression from first architectural scoping to live production monitoring and revenue accrual.
                </p>
              </div>

              {/* PROCESS METER */}
              <div className="process-meter" aria-hidden="true">
                <span style={{ transform: `scaleX(${(activeStep + 1) / processSteps.length})` }}></span>
              </div>

              <div className="process-now" aria-hidden="true">
                <span className="process-now-num">
                  <span key={activeStep} className="process-num-anim">
                    {processSteps[activeStep].num}
                  </span>
                </span>
                <span className="process-now-of">/ 04</span>
                <strong className="process-now-title">{processSteps[activeStep].title}</strong>
              </div>
            </div>

            {/* STEPS LIST */}
            <ol ref={stepsContainerRef} className="steps">
              {processSteps.map((step, idx) => (
                <li
                  key={idx}
                  className="step"
                  data-step={idx}
                  data-active={activeStep === idx}
                  onClick={() => handleStepClick(idx)}
                >
                  <div className="step-top">
                    <span className="step-num">{step.num}</span>
                    {activeStep === idx && (
                      <span className="badge-tag" style={{ background: "var(--accent)", color: "var(--on-accent)" }}>
                        Current Stage
                      </span>
                    )}
                  </div>
                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>
                  <ul className="chips">
                    {step.chips.map((chip, cIdx) => (
                      <li key={cIdx} className="chip">
                        {chip}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* PROMISES BENTO GRID */}
        <section className="surface-paper band" aria-labelledby="promise-title">
          <div className="wrap">
            <div className="section-head">
              <div className="badge-tag">
                <span className="badge-dot"></span>
                Institutional Integrity
              </div>
              <h2 id="promise-title">What you can count on</h2>
              <p>Engineering discipline and creative accountability written into every contract.</p>
            </div>

            <div className="promise">
              <article className="promise-item promise-lead">
                <svg viewBox="0 0 24 24" aria-hidden="true" className="promise-glyph" style={{ color: "var(--accent)" }}>
                  <path d="M12 0c1 7 5 11 12 12-7 1-11 5-12 12-1-7-5-11-12-12 7-1 11-5 12-12Z" fill="currentColor"></path>
                </svg>
                <div>
                  <h3>A dedicated engineering roster, on purpose</h3>
                  <p style={{ marginTop: "1rem" }}>
                    We cap active enterprise and school deployments simultaneously so our founding engineers stay directly on your codebase and production pipeline. No junior hand-offs or outsourced tickets.
                  </p>
                </div>
              </article>

              <article className="promise-item promise-a">
                <h3>Reply within 1 business day</h3>
                <p>
                  Direct Slack/WhatsApp connect with technical founders. You always know who owns each commit and feature release.
                </p>
              </article>

              <article className="promise-item promise-b">
                <h3>You own 100% of everything</h3>
                <p>
                  Source code, Firebase keys, Razorpay webhooks, 4K camera raw footage, and Figma files belong entirely to you from day one.
                </p>
              </article>

              <article className="promise-item promise-c">
                <div>
                  <h3>Fixed fees, zero surprise billing</h3>
                  <p>
                    Every custom module and white-label rollout has transparent, pre-agreed milestone pricing with clear SLAs.
                  </p>
                </div>
                <button
                  className="btn btn-ink"
                  onClick={() => setCalendlyModalOpen(true)}
                >
                  Book Alignment Call
                </button>
              </article>
            </div>
          </div>
        </section>

        {/* STORY / FOUNDING ETHOS */}
        <section id="creator" className="surface-ink band" aria-labelledby="story-title">
          <div className="wrap story">
            <div className="story-lead">
              <h2 id="story-title" className="sr-only">Why Divak Exists</h2>
              <blockquote className="story-quote">
                <p>
                  Great code without distribution sits empty. Great marketing without solid engineering collapses under load. Divak was built to fuse both.
                </p>
                <footer>Divak Founding Team</footer>
              </blockquote>
            </div>

            <div className="story-beats">
              <div className="story-beat">
                <h3>The Dual Thesis</h3>
                <p>
                  Software needs distribution; creator brands need proprietary technology. By housing tailor-made software, white-label ERPs, a 4K creator production studio, and college hackathon networks under one roof, we eliminate the friction between shipping code and finding users.
                </p>
              </div>
              <div className="story-beat">
                <h3>Where We Come From</h3>
                <p>
                  We grew out of active campus hackathons, full-stack systems engineering, and on-ground student activations. We learned what holds up under real school operations by deploying CampusFlow ERP in live academic terms.
                </p>
              </div>
              <div className="story-beat">
                <h3>Why White-Label Outsourcing?</h3>
                <p>
                  Institutions shouldn't spend two years reinventing attendance and fee engines. With our white-label solutions, schools and partner agencies deploy production-grade software in days, not quarters.
                </p>
              </div>
              <div className="story-close">
                <p>Let's build your software or produce your next viral campaign.</p>
                <a className="btn" href="#contact">
                  Start a Project <ArrowUpRight className="btn-icon" size={18} />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* TEAM SECTION */}
        <section id="team" className="surface-paper band" aria-labelledby="team-title">
          <div className="wrap team-layout">
            <div className="founders-head">
              <div className="badge-tag">
                <span className="badge-dot"></span>
                Accountability
              </div>
              <h2 id="team-title">The people on your account</h2>
              <p>
                Technical and creative founders on every account. The engineers who architect your system are the ones in your sprint reviews.
              </p>
              <div style={{ marginTop: "1rem" }}>
                <button
                  className="btn btn-ghost"
                  onClick={() => setCalendlyModalOpen(true)}
                >
                  <Calendar size={18} /> Meet the Founders
                </button>
              </div>
            </div>

            <div className="founders">
              <article className="founder">
                <div className="founder-photo">
                  <img
                    src="/images/creator_studio.jpg"
                    alt="Technical &amp; ERP Architecture Lead"
                    loading="lazy"
                  />
                </div>
                <div className="founder-meta">
                  <h3>Lead Product &amp; Systems Architect</h3>
                  <p className="founder-role">Head of Technical Development &amp; ERP</p>
                  <p className="founder-bio">
                    Architected CampusFlow ERP, Firebase multi-tier data structures, and Razorpay automated fee reconciliations. Specializes in custom enterprise apps and white-label SaaS infrastructure.
                  </p>
                </div>
              </article>

              <article className="founder">
                <div className="founder-photo">
                  <img
                    src="/images/hackculture.jpg"
                    alt="Creative &amp; HackCulture Lead"
                    loading="lazy"
                  />
                </div>
                <div className="founder-meta">
                  <h3>Lead Creative Director &amp; Activations</h3>
                  <p className="founder-role">Head of Creator Management &amp; HackCulture</p>
                  <p className="founder-bio">
                    Oversees our in-house 4K studio ('khud ka production'), creator profile negotiations, and 150+ college hackathon networks across India.
                  </p>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section id="faq" className="surface-paper band" style={{ paddingTop: 0 }} aria-labelledby="faq-title">
          <div className="wrap faq">
            <div className="section-head">
              <div className="badge-tag">
                <span className="badge-dot"></span>
                Clarity First
              </div>
              <h2 id="faq-title">Questions, answered</h2>
              <p>
                Everything you need to know about our technical verticals, CampusFlow ERP, white-label licensing, and Calendly availability.
              </p>
            </div>

            <div className="faq-list">
              {faqItems.map((faq, idx) => (
                <div key={idx} className="faq-item" data-open={openFaq === idx}>
                  <h3 style={{ fontSize: "inherit" }}>
                    <button
                      className="faq-q"
                      aria-expanded={openFaq === idx}
                      onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    >
                      <span>{faq.q}</span>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                      </svg>
                    </button>
                  </h3>
                  <div
                    className="faq-a"
                    style={{
                      maxHeight: openFaq === idx ? "300px" : "0px",
                      opacity: openFaq === idx ? 1 : 0
                    }}
                  >
                    <p>{faq.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* INTERACTIVE BRIEF / CONTACT SECTION */}
        <section id="contact" className="surface-accent band" aria-labelledby="contact-title">
          <div className="wrap contact">
            <div>
              <div className="badge-tag" style={{ background: "rgba(30, 35, 20, 0.25)", color: "var(--ink)" }}>
                Start an Engagement
              </div>
              <h2 id="contact-title">Got a product to engineer?</h2>
              <p className="contact-lede">
                Tell us about your technical requirements or creator brief. We review every submission within 1 business day with actionable next steps.
              </p>

              <div className="contact-direct">
                <span>Direct inquiries</span>
                <a href="mailto:hello@divak.co">hello@divak.co</a>
              </div>

              <div style={{ marginTop: "1.5rem" }}>
                <button
                  className="btn btn-ink"
                  onClick={() => setCalendlyModalOpen(true)}
                >
                  <Calendar size={18} /> Schedule 30-Min Calendly Call
                </button>
                <div style={{ marginTop: "0.75rem", fontSize: "var(--t-xs)", color: "rgba(30, 35, 20, 0.8)", fontWeight: 600 }}>
                  Guaranteed Availability: Weekdays 9:00 PM – 11:00 PM | All Days 9:00 AM – 12:00 PM
                </div>
              </div>

              <ol className="next-steps" aria-label="What happens next">
                <li>
                  <span aria-hidden="true">01</span>
                  <div>
                    <strong>Reply within 1 business day</strong>
                    <p>A technical founder reviews your brief with initial architecture or timeline insights.</p>
                  </div>
                </li>
                <li>
                  <span aria-hidden="true">02</span>
                  <div>
                    <strong>30-Minute Architecture &amp; Alignment Call</strong>
                    <p>We review data requirements, Razorpay flows, or content deliverables. Zero fluffy sales pitch.</p>
                  </div>
                </li>
                <li>
                  <span aria-hidden="true">03</span>
                  <div>
                    <strong>Fixed-Price Milestone Proposal</strong>
                    <p>Written technical scope, team allocation, and transparent pricing you can execute on.</p>
                  </div>
                </li>
              </ol>
            </div>

            {/* BRIEF FORM */}
            <div className="brief">
              {!formSubmitted ? (
                <form onSubmit={handleFormSubmit}>
                  <fieldset>
                    <legend>What verticals do you need?</legend>
                    <div className="pick">
                      {[
                        "Tailor-Made Custom Software",
                        "White Label Software Outsourcing",
                        "CampusFlow School ERP",
                        "In-House Content & Production",
                        "Creator Profile Dealing",
                        "HackCulture Events & Hackathons"
                      ].map((service) => (
                        <label key={service}>
                          <input
                            type="checkbox"
                            checked={selectedServices.includes(service)}
                            onChange={() => toggleServicePill(service)}
                          />
                          <span>{service}</span>
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  <fieldset style={{ marginTop: "1.5rem" }}>
                    <legend>Estimated Budget Range</legend>
                    <div className="pick">
                      {["Under ₹5L", "₹5L – ₹15L", "₹15L – ₹50L", "₹50L+", "Not sure yet"].map((budget) => (
                        <label key={budget}>
                          <input
                            type="radio"
                            name="budget"
                            value={budget}
                            checked={selectedBudget === budget}
                            onChange={() => setSelectedBudget(budget)}
                          />
                          <span>{budget}</span>
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  <div className="field-row" style={{ marginTop: "1.5rem" }}>
                    <div className="field">
                      <label htmlFor="f-name">Your Name</label>
                      <input
                        id="f-name"
                        type="text"
                        required
                        placeholder="e.g. Sahil Verma"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div className="field">
                      <label htmlFor="f-email">Work Email</label>
                      <input
                        id="f-email"
                        type="email"
                        required
                        placeholder="sahil@company.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="field-row" style={{ marginTop: "1rem" }}>
                    <div className="field">
                      <label htmlFor="f-phone">Phone / WhatsApp</label>
                      <input
                        id="f-phone"
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                    <div className="field">
                      <label htmlFor="f-timeslot">Preferred Consultation Slot</label>
                      <select
                        id="f-timeslot"
                        className="field"
                        style={{
                          width: "100%",
                          padding: "0.85rem 1rem",
                          borderRadius: "var(--radius-s)",
                          background: "color-mix(in srgb, var(--on-ink) 7%, transparent)",
                          color: "var(--on-ink)",
                          border: "none",
                          boxShadow: "inset 0 0 0 1px var(--line-ink)"
                        }}
                        value={formData.timeSlot}
                        onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                      >
                        <option value="Weekdays (9:00 PM – 11:00 PM)" style={{ background: "var(--ink)", color: "white" }}>
                          Weekdays: 9:00 PM – 11:00 PM IST
                        </option>
                        <option value="All Days (9:00 AM – 12:00 PM)" style={{ background: "var(--ink)", color: "white" }}>
                          All Days: 9:00 AM – 12:00 PM IST
                        </option>
                        <option value="Flexible / As soon as possible" style={{ background: "var(--ink)", color: "white" }}>
                          Flexible / ASAP
                        </option>
                      </select>
                    </div>
                  </div>

                  <div className="field" style={{ marginTop: "1rem" }}>
                    <label htmlFor="f-brief">Project Overview or Questions</label>
                    <textarea
                      id="f-brief"
                      placeholder="Tell us about the software you want to build, school ERP licensing interest, creator management, or event..."
                      value={formData.brief}
                      onChange={(e) => setFormData({ ...formData, brief: e.target.value })}
                    ></textarea>
                  </div>

                  <div className="brief-foot" style={{ marginTop: "1.5rem" }}>
                    <button type="submit" className="btn">
                      <span>Submit Project Brief</span>
                      <ArrowUpRight className="btn-icon" size={16} />
                    </button>
                    <p>Protected by mutual NDA. Zero spam, ever.</p>
                  </div>
                </form>
              ) : (
                <div className="brief-done">
                  <div
                    style={{
                      width: "3.5rem",
                      height: "3.5rem",
                      borderRadius: "50%",
                      background: "var(--accent)",
                      color: "var(--on-accent)",
                      display: "grid",
                      placeItems: "center"
                    }}
                  >
                    <Check size={28} />
                  </div>
                  <h3>Brief Received!</h3>
                  <p>
                    Thank you, <strong>{formData.name || "there"}</strong>. We’ve logged your selected verticals:{" "}
                    <em>{selectedServices.join(", ")}</em>. A founding engineer will review and reach out within 1 working day.
                  </p>
                  <button
                    className="btn btn-ghost"
                    onClick={() => setCalendlyModalOpen(true)}
                  >
                    Lock Your Slot on Calendly Directly <ArrowUpRight size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="footer surface-ink">
        <div className="wrap">
          <div className="footer-top">
            <div>
              <a className="logo" href="#top" style={{ color: "var(--on-ink)" }}>
                <svg className="logo-symbol" viewBox="0 0 64 64" aria-hidden="true">
                  <path d="M32 10 51 54h-10L32 32 23 54H13Z" fill="currentColor"></path>
                  <ellipse
                    cx="32"
                    cy="39"
                    rx="27"
                    ry="8"
                    fill="none"
                    style={{ stroke: "var(--accent)" }}
                    strokeWidth="3.5"
                    transform="rotate(-14 32 39)"
                  ></ellipse>
                </svg>
                <span>Divak</span>
              </a>
              <p style={{ marginTop: "1rem" }}>
                Hybrid Technical Development Studio &bull; White-Label SaaS &bull; Creator Management &bull; HackCulture.
              </p>
              <div style={{ marginTop: "1.25rem" }}>
                <span className="availability-pill">
                  <span className="badge-dot"></span>
                  Calendly: Weekdays 9-11 PM &bull; All Days 9-12
                </span>
              </div>
            </div>

            <div>
              <h4>Products</h4>
              <ul>
                <li>
                  <a href="https://campusflow.smrpublicschool.in/" target="_blank" rel="noreferrer">
                    CampusFlow School ERP ↗
                  </a>
                </li>
                <li>
                  <a href="#products">HackCulture Hackathon OS</a>
                </li>
                <li>
                  <a href="#products">DevRank Talent Cloud</a>
                </li>
                <li>
                  <a href="#tech">White-Label SaaS Licensing</a>
                </li>
              </ul>
            </div>

            <div>
              <h4>Technical Verticals</h4>
              <ul>
                <li>
                  <a href="#tech">Tailor-Made Custom Software</a>
                </li>
                <li>
                  <a href="#tech">White Label Outsourcing</a>
                </li>
                <li>
                  <a href="#tech">Cloud Microservices &amp; APIs</a>
                </li>
                <li>
                  <a href="#tech">Razorpay Payment Integration</a>
                </li>
              </ul>
            </div>

            <div>
              <h4>Creator &amp; Events</h4>
              <ul>
                <li>
                  <a href="#creator">In-House 4K Studio ('Khud Ka')</a>
                </li>
                <li>
                  <a href="#creator">Creator Profile Dealing</a>
                </li>
                <li>
                  <a href="#creator">Brand Commercials &amp; Films</a>
                </li>
                <li>
                  <a href="#work">College Hackathons &amp; Fests</a>
                </li>
              </ul>
            </div>
          </div>

          {/* GIANT INTERACTIVE WORDMARK MATCHING AROVAS */}
          <div
            ref={wordmarkRef}
            className="wordmark"
            aria-hidden="true"
            onPointerMove={handleWordmarkPointerMove}
            onPointerLeave={handleWordmarkPointerLeave}
          >
            {wordmarkLetters.map((letter, i) => {
              const p = wordmarkProximity[i] || 0;
              return (
                <span
                  key={i}
                  data-near={p > 0.6}
                  style={{
                    "--wght": Math.round(750 - p * 550),
                    "--wdth": Math.round(100 - p * 25),
                    transform: p > 0.6 ? "translateY(-8px)" : "translateY(0)"
                  }}
                >
                  {letter}
                </span>
              );
            })}
          </div>

          <div className="footer-bottom">
            <div>
              &copy; {currentYear} Divak Technologies &amp; Media Private Limited. All rights reserved.
            </div>
            <div style={{ display: "flex", gap: "1.5rem" }}>
              <a href="#contact">Privacy Policy</a>
              <a href="#contact">Terms of Service</a>
              <a href="https://campusflow.smrpublicschool.in/" target="_blank" rel="noreferrer">
                CampusFlow Live Demo
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* CASE STUDY DETAIL MODAL */}
      {activeCaseModal && (
        <div className="modal-backdrop" onClick={() => setActiveCaseModal(null)}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <span className="badge-tag">{activeCaseModal.tag}</span>
                <span style={{ fontSize: "var(--t-sm)", color: "var(--on-ink-muted)" }}>
                  {activeCaseModal.channels}
                </span>
              </div>
              <button
                className="modal-close-btn"
                onClick={() => setActiveCaseModal(null)}
              >
                <X size={16} /> Close
              </button>
            </div>

            <div className="modal-body">
              <h2>{activeCaseModal.title}</h2>
              <p style={{ marginTop: "0.5rem", color: "var(--accent)", fontWeight: 600 }}>
                {activeCaseModal.client}
              </p>

              <img
                src={activeCaseModal.image}
                alt={activeCaseModal.title}
                className="modal-cover-img"
              />

              <div className="modal-grid">
                <div>
                  <dl className="modal-facts">
                    <div>
                      <dt>Tech Stack</dt>
                      <dd>{activeCaseModal.techStack}</dd>
                    </div>
                    <div>
                      <dt>Status &amp; Verification</dt>
                      <dd>{activeCaseModal.result}</dd>
                    </div>
                    <div>
                      <dt>Delivery Model</dt>
                      <dd>Production &amp; White-Label Available</dd>
                    </div>
                  </dl>

                  {activeCaseModal.liveUrl && (
                    <div style={{ marginTop: "2rem" }}>
                      <a
                        className="btn"
                        href={activeCaseModal.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ width: "100%", justifyContent: "center" }}
                      >
                        <span>Launch Live Demo</span>
                        <ExternalLink size={16} />
                      </a>
                    </div>
                  )}
                </div>

                <div>
                  <h3 style={{ fontSize: "var(--t-lg)", marginBottom: "1rem" }}>
                    System Architecture &amp; Overview
                  </h3>
                  <p style={{ color: "var(--on-ink-muted)", lineHeight: 1.6 }}>
                    {activeCaseModal.overview}
                  </p>

                  <h4 style={{ marginTop: "1.5rem", marginBottom: "0.75rem", fontSize: "var(--t-base)" }}>
                    Key Architectural Capabilities:
                  </h4>
                  <ul className="product-features-list">
                    {activeCaseModal.highlights.map((h, i) => (
                      <li key={i}>
                        <Check size={16} />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>

                  <div style={{ marginTop: "2rem", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                    <button
                      className="btn btn-ghost"
                      onClick={() => {
                        setActiveCaseModal(null);
                        setCalendlyModalOpen(true);
                      }}
                    >
                      <Calendar size={16} /> Discuss Technical Deployment
                    </button>
                    <a
                      className="btn"
                      href="#contact"
                      onClick={() => {
                        setActiveCaseModal(null);
                        if (!selectedServices.includes(activeCaseModal.title)) {
                          setSelectedServices([...selectedServices, activeCaseModal.title]);
                        }
                      }}
                    >
                      Request Licensing
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CALENDLY SCHEDULING MODAL WITH USER SPECIFIED AVAILABILITY */}
      {calendlyModalOpen && (
        <div className="modal-backdrop" onClick={() => setCalendlyModalOpen(false)}>
          <div className="calendly-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <span className="badge-tag">
                  <span className="badge-dot"></span> Calendly Integration
                </span>
                <span style={{ fontSize: "var(--t-xs)", color: "var(--on-ink-muted)" }}>
                  Verified Availability
                </span>
              </div>
              <button
                className="modal-close-btn"
                onClick={() => setCalendlyModalOpen(false)}
              >
                <X size={16} /> Close
              </button>
            </div>

            <div className="calendly-grid">
              <div className="calendly-info">
                <div>
                  <div className="badge-tag" style={{ background: "rgba(255, 161, 46, 0.2)", color: "var(--accent)" }}>
                    30-Min Technical &amp; Strategy Sync
                  </div>
                  <h3 style={{ fontSize: "var(--t-xl)", marginTop: "1rem" }}>
                    Book a Call with Divak Founders
                  </h3>
                  <p style={{ fontSize: "var(--t-sm)", color: "var(--on-ink-muted)", marginTop: "0.75rem", lineHeight: 1.5 }}>
                    Discuss tailor-made software architecture, CampusFlow School ERP licensing, creator representation, or HackCulture collegiate hackathons.
                  </p>

                  <div style={{ marginTop: "1.5rem", display: "grid", gap: "0.75rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", fontSize: "var(--t-sm)" }}>
                      <Clock size={16} style={{ color: "var(--accent)" }} />
                      <span>30 Minutes &bull; Google Meet video link</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", fontSize: "var(--t-sm)" }}>
                      <Globe size={16} style={{ color: "var(--secondary)" }} />
                      <span>India Standard Time (IST)</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", fontSize: "var(--t-sm)" }}>
                      <ShieldCheck size={16} style={{ color: "var(--accent)" }} />
                      <span>Direct technical review with founders</span>
                    </div>
                  </div>
                </div>

                <div style={{ borderTop: "1px solid var(--line-ink)", paddingTop: "1rem" }}>
                  <div style={{ fontSize: "var(--t-xs)", color: "var(--accent)", fontWeight: 700, marginBottom: "0.25rem" }}>
                    OFFICIAL AVAILABILITY WINDOWS:
                  </div>
                  <div style={{ fontSize: "var(--t-sm)", color: "var(--on-ink)" }}>
                    &bull; <strong>Weekdays:</strong> 9:00 PM – 11:00 PM IST<br />
                    &bull; <strong>All Days / Weekends:</strong> 9:00 AM – 12:00 PM IST
                  </div>
                </div>
              </div>

              <div className="calendly-schedule-box">
                {!bookingConfirmed ? (
                  <form onSubmit={handleBookingSubmit} style={{ display: "grid", gap: "1rem" }}>
                    <div>
                      <label style={{ fontSize: "var(--t-xs)", fontWeight: 600, color: "var(--on-ink-muted)" }}>
                        1. Select Preferred Time Window
                      </label>
                      <div style={{ display: "grid", gap: "0.5rem", marginTop: "0.5rem" }}>
                        {[
                          { id: "wd-1", label: "Weekday Evening: 9:00 PM – 9:30 PM IST" },
                          { id: "wd-2", label: "Weekday Evening: 9:30 PM – 10:00 PM IST" },
                          { id: "wd-3", label: "Weekday Night: 10:00 PM – 10:30 PM IST" },
                          { id: "wd-4", label: "Weekday Night: 10:30 PM – 11:00 PM IST" },
                          { id: "ad-1", label: "Morning Strategy: 9:00 AM – 9:30 AM IST" },
                          { id: "ad-2", label: "Morning Strategy: 9:30 AM – 10:00 AM IST" },
                          { id: "ad-3", label: "Midday Deep-Dive: 10:30 AM – 11:00 AM IST" },
                          { id: "ad-4", label: "Midday Deep-Dive: 11:30 AM – 12:00 PM IST" }
                        ].map((slot) => (
                          <div
                            key={slot.id}
                            className="time-slot-pill"
                            data-selected={selectedSlot === slot.id}
                            onClick={() => setSelectedSlot(slot.id)}
                          >
                            {slot.label}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="field">
                      <label style={{ fontSize: "var(--t-xs)", fontWeight: 600, color: "var(--on-ink-muted)" }}>
                        2. Your Name &amp; Email
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Your Full Name"
                        style={{ marginBottom: "0.5rem" }}
                      />
                      <input
                        type="email"
                        required
                        placeholder="Work Email Address"
                      />
                    </div>

                    <div className="field">
                      <label style={{ fontSize: "var(--t-xs)", fontWeight: 600, color: "var(--on-ink-muted)" }}>
                        3. Topic of Discussion
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. CampusFlow ERP licensing or Custom Software"
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn"
                      style={{ justifyContent: "center", marginTop: "0.5rem" }}
                      disabled={!selectedSlot}
                    >
                      <Check size={18} />
                      <span>Confirm &amp; Generate Calendar Invite</span>
                    </button>
                  </form>
                ) : (
                  <div style={{ textAlign: "center", padding: "2rem 1rem" }}>
                    <div
                      style={{
                        width: "3.5rem",
                        height: "3.5rem",
                        borderRadius: "50%",
                        background: "var(--accent)",
                        color: "var(--on-accent)",
                        display: "grid",
                        placeItems: "center",
                        margin: "0 auto 1.5rem"
                      }}
                    >
                      <Check size={28} />
                    </div>
                    <h3>Meeting Scheduled!</h3>
                    <p style={{ fontSize: "var(--t-sm)", color: "var(--on-ink-muted)", marginTop: "0.75rem" }}>
                      We have reserved your slot. A calendar invitation with Google Meet details has been queued. You will receive a direct reminder beforehand.
                    </p>
                    <div style={{ marginTop: "1.5rem" }}>
                      <button
                        className="btn btn-ghost"
                        onClick={() => {
                          setBookingConfirmed(false);
                          setCalendlyModalOpen(false);
                        }}
                      >
                        Back to Website
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
