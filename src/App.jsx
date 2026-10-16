import React, { useState, useEffect, useRef } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import {
  ArrowUpRight,
  Check,
  Calendar,
  Clock,
  ExternalLink,
  ShieldCheck,
  Globe,
  X,
  Layers,
  Terminal,
  Video,
  Zap,
  Copy,
  Mail
} from "lucide-react";

const currentYear = new Date().getFullYear();
const CALENDLY_URL = "https://calendly.com/goyaldivyansh2004";
// Founder section toggle: currently hidden per user request; set to true to re-enable after the event
const SHOW_FOUNDERS = false;
const wordmarkLetters = ["D", "I", "V", "A", "K"];
const manifestoWords =
  "Most software agencies write code that gathers dust. Most creative agencies make noise that gets scrolled past. We build the high-conviction intersection: production-grade systems engineered for operational scale, coupled with creator-led activations and hackathon cultures that command real audience attention.".split(
    " "
  );

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navSolid, setNavSolid] = useState(false);
  const [navHidden, setNavHidden] = useState(false);
  const [activeWorkFilter, setActiveWorkFilter] = useState("all");
  const [activeStep, setActiveStep] = useState(0);
  const [openService, setOpenService] = useState("custom-tech");
  const [openFaq, setOpenFaq] = useState(0);
  const [activeCaseModal, setActiveCaseModal] = useState(null);

  // Form State
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
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

  // Direct Calendly Redirect
  const openCalendly = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    window.open(CALENDLY_URL, "_blank", "noopener,noreferrer");
  };

  // Refs for scroll-driven animations
  const stepsContainerRef = useRef(null);
  const wordmarkRef = useRef(null);
  const manifestoRef = useRef(null);
  const lenisRef = useRef(null);
  const [manifestoProgress, setManifestoProgress] = useState(0);
  const [wordmarkProximity, setWordmarkProximity] = useState(() => [0, 0, 0, 0, 0]);
  const [emailCopied, setEmailCopied] = useState(false);

  // Lenis Smooth Scroll Engine (Matching Arovas Butter-Smooth Kinetic Scroll)
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      lerp: 0.1,
      anchors: { offset: -72 }
    });
    lenisRef.current = lenis;

    let rafId = 0;
    const raf = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Navbar behavior: hide on scroll down, reveal on scroll up
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentY = window.scrollY;
          setNavSolid(currentY > 40);

          if (currentY > 120 && currentY > lastScrollY + 6) {
            setNavHidden(true);
          } else if (currentY < lastScrollY - 6 || currentY <= 60) {
            setNavHidden(false);
          }

          lastScrollY = currentY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Modal body scroll lock & Lenis freeze to ensure internal modal scrolling
  useEffect(() => {
    if (activeCaseModal || mobileMenuOpen) {
      lenisRef.current?.stop();
      document.body.style.overflow = "hidden";
    } else {
      lenisRef.current?.start();
      document.body.style.overflow = "";
    }
    return () => {
      lenisRef.current?.start();
      document.body.style.overflow = "";
    };
  }, [activeCaseModal, mobileMenuOpen]);

  // Automatic Process Counter (01 -> 02 -> 03 -> 04) with IntersectionObserver (matching Arovas)
  useEffect(() => {
    const container = stepsContainerRef.current;
    if (!container) return;
    const stepElements = container.querySelectorAll("[data-step]");
    if (!stepElements || stepElements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveStep(Number(entry.target.dataset.step));
          }
        }
      },
      { rootMargin: "-45% 0px -45% 0px" }
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

  // Manifesto word-by-word illumination on scroll (tuned for a smooth ~1.2 scroll flow)
  useEffect(() => {
    let ticking = false;
    let lastProgress = 0;

    const handleManifestoScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const el = manifestoRef.current;
          if (el) {
            const rect = el.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            // Increased slightly from previous (0.85 -> 0.35) to (0.88 -> 0.22)
            // Provides smooth in-flow illumination without being too long
            const start = windowHeight * 0.88;
            const end = windowHeight * 0.22;
            const progress = Math.min(1, Math.max(0, (start - rect.top) / (start - end)));
            if (Math.abs(progress - lastProgress) > 0.01) {
              setManifestoProgress(progress);
              lastProgress = progress;
            }
          }
          ticking = false;
        });
        ticking = true;
      }
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

  const EMAIL_ADDRESS = "community.divak@gmail.com";

  const openGmail = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const su = encodeURIComponent("Project Inquiry | Divak Technical Studio");
    const body = encodeURIComponent("Hi Divak Team,\n\nWe would like to discuss a project with your team.\n\nBest regards,\n");
    window.open(
      `https://mail.google.com/mail/?view=cm&fs=1&to=${EMAIL_ADDRESS}&su=${su}&body=${body}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const openOutlook = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const su = encodeURIComponent("Project Inquiry | Divak Technical Studio");
    const body = encodeURIComponent("Hi Divak Team,\n\nWe would like to discuss a project with your team.\n\nBest regards,\n");
    window.open(
      `https://outlook.live.com/mail/0/deeplink/compose?to=${EMAIL_ADDRESS}&subject=${su}&body=${body}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const copyEmail = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(EMAIL_ADDRESS);
    }
    setEmailCopied(true);
    setTimeout(() => setEmailCopied(false), 2500);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");

    try {
      const res = await fetch("/api/send-brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          services: selectedServices,
          budget: selectedBudget,
          timeSlot: formData.timeSlot,
          brief: formData.brief
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setFormSubmitted(true);
      } else {
        setSubmitError(
          data.error || "Could not dispatch via email service. Please check your connection or send via Gmail below."
        );
      }
    } catch (err) {
      console.error("Submission failed:", err);
      setSubmitError(
        "Network dispatch error. Please click below to send your details directly via Gmail."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    setBookingConfirmed(true);
  };

  // Case Studies & Work Items (Confidential, high-end agency format matching Arovas)
  const workItems = [
    {
      id: "campusflow-erp",
      category: "products",
      client: "Education institution",
      shortTitle: "CampusFlow ERP",
      title: "A complete school ERP and automated biometric attendance system",
      channels: "CampusFlow ERP + Biometrics + Fee Automation",
      image: "/work/laptop.svg",
      tag: "Products",
      metric: "100% Automated Reconciliation",
      icon: "Layers",
      liveUrl: null,
      overview:
        "A production-grade, multi-tier school management ERP system actively piloted in a live school environment. Replaces physical registers and fragmented apps with a unified, role-based operating system.",
      highlights: [
        "Four dedicated portals: Admin, Teacher, Student, Parent",
        "Biometric device integration and automated parent SMS notifications",
        "Firestore real-time data model for attendance, timetables, and exams",
        "Razorpay fee collection with partial-payment support & auto monthly accrual"
      ],
      techStack: "React, Vite, Firebase Auth, Cloud Firestore, Razorpay API",
      result: "100% automated fee reconciliation and zero attendance discrepancy."
    },
    {
      id: "hackculture-platform",
      category: "campus",
      client: "National student hackathon",
      shortTitle: "HackCulture Engine",
      title: "A pan-India hackathon platform with automated team matching",
      channels: "HackCulture + 40+ Campuses",
      image: "/work/events.svg",
      tag: "Campus",
      metric: "2,500+ Devs Active",
      icon: "Terminal",
      liveUrl: null,
      overview:
        "Our all-in-one platform for hosting and scaling hackathons across universities and tech hubs. Streamlines registration, algorithmic team matching, and multi-criteria radar scoring.",
      highlights: [
        "1-click participant registration with GitHub & LinkedIn verification",
        "Automated team-matching matrix based on complementary developer skills",
        "Multi-criteria judges scoring radar with live submission review",
        "Dynamic real-time leaderboard and automated certificate distribution"
      ],
      techStack: "Next.js, Node.js, WebSockets, Redis, PostgreSQL",
      result: "Powering hackathons with 2,500+ devs and 40+ college chapters."
    },
    {
      id: "studio-production",
      category: "creator",
      client: "Tech founder & studio",
      shortTitle: "4K Studio & Podcasts",
      title: "In-house 4K studio production, podcasts and viral short-form IP",
      channels: "4K Studio + Creator Channels",
      image: "/work/perfume.svg",
      tag: "Creator",
      metric: "18M+ Organic Views",
      icon: "Video",
      liveUrl: null,
      overview:
        "Our dedicated in-house production setup ('khud ka content and production'). We write, shoot on cinema-grade cameras, and engineer viral short-form and long-form intellectual property for founders and creators.",
      highlights: [
        "Full studio acoustically treated with multi-cam 4K cinema cameras",
        "Scriptwriting, hook psychology, and thumbnail engineering",
        "End-to-end multi-platform publishing across YouTube, Reels, and X",
        "Creator profile dealing, brand contracts, and rate protection"
      ],
      techStack: "RED/Sony FX3, DaVinci Resolve Studio, Shure SM7B",
      result: "Over 18M organic views generated across managed creator channels."
    },
    {
      id: "whitelabel-outsourcing",
      category: "software",
      client: "Enterprise software vendor",
      shortTitle: "White-Label Turnkey",
      title: "White-label software outsourcing with turnkey source code licensing",
      channels: "Turnkey SaaS + Source Code",
      image: "/work/laptop.svg",
      tag: "Software",
      metric: "12 Partner Deployments",
      icon: "ShieldCheck",
      liveUrl: null,
      overview:
        "Institutional clients and partner agencies license our battle-tested architectures under their own brand. Complete with multi-tenant isolation, custom domains, and branded mobile apps.",
      highlights: [
        "100% white-labeled source code and customized UI design skinning",
        "Dedicated cloud infrastructure deployment with zero vendor lock-in",
        "Turnkey Razorpay, Stripe, and Cashfree payment gateway setups",
        "SLA-backed engineering support and feature roadmap expansions"
      ],
      techStack: "React, Node.js, Cloud Firestore, Docker, Kubernetes",
      result: "Deployed across 12 partner academies within 3 weeks of agreement."
    },
    {
      id: "campus-ambassador",
      category: "campus",
      client: "Consumer tech brand",
      shortTitle: "Campus Network",
      title: "A campus ambassador programme and experiential on-ground activations",
      channels: "Campus ambassadors + Colleges",
      image: "/work/events.svg",
      tag: "Campus",
      metric: "35,000+ Students Reached",
      icon: "Globe",
      liveUrl: null,
      overview:
        "Activating student communities in tier-1 and tier-2 engineering colleges across India through hands-on hackathons, technical seminars, and student ambassador networks.",
      highlights: [
        "On-ground campus booths, student developer registration drives",
        "Workshops on System Design, Full-Stack Dev, and Open Source",
        "Direct talent pipeline connecting top performers to hiring companies"
      ],
      techStack: "HackCulture Portal, QR Check-in Systems, Ambassador Dashboards",
      result: "Direct engagement with 35,000+ engineering students across India."
    },
    {
      id: "fintech-portal",
      category: "software",
      client: "FinTech startup",
      shortTitle: "Custom Cloud Engine",
      title: "High-performance web applications and custom cloud architecture",
      channels: "Web + Cloud Architecture",
      image: "/work/perfume.svg",
      tag: "Software",
      metric: "<80ms API Latency",
      icon: "Zap",
      liveUrl: null,
      overview:
        "Bespoke technical engineering tailored to exact operational workflows: high-throughput financial microservices, investor dashboards, and bank-grade data security.",
      highlights: [
        "Sub-80ms transaction settlement pipeline with Redis caching",
        "Role-based access control with biometric two-factor verification",
        "Automated reconciliations with Razorpay and bank webhooks"
      ],
      techStack: "Next.js, Go, PostgreSQL, Redis, AWS",
      result: "Handled ₹45 Cr in simulated quarterly transactions at zero downtime."
    },
    {
      id: "creator-representation",
      category: "creator",
      client: "D2C retail brand",
      shortTitle: "Creator Dealmaking",
      title: "Creator profile management, rate negotiation and escrow brand deals",
      channels: "Creator Deals + Commercials",
      image: "/work/jewellery.svg",
      tag: "Creator",
      metric: "₹1.2 Cr Closed",
      icon: "Check",
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
      id: "developer-ranking",
      category: "software",
      client: "Developer talent network",
      shortTitle: "Proof-of-Work OS",
      title: "A verifiable developer proof-of-work ranking platform",
      channels: "Web Platform + Ranking Engine",
      image: "/work/beauty.svg",
      tag: "Software",
      metric: "1,000 Pt DevRank",
      icon: "Clock",
      liveUrl: null,
      overview:
        "Inspired by VickyBytes: a verifiable developer ranking score out of 1,000, aggregated from shipped code, GitHub commits, and published technical tutorials.",
      highlights: [
        "Automated commit analysis and repo quality assessment",
        "Live technical coding sprints and automated test evaluation",
        "Direct recruitment matches for venture-backed engineering teams"
      ],
      techStack: "Python, FastAPI, GitHub GraphQL API, PostgreSQL",
      result: "Screened 1,400+ developers with 92% interview qualification rate."
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
      title: "Practice 1: Tailor-Made Custom Software",
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
      title: "Practice 2: White Label Software Outsourcing",
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

  // Process Steps Data (Multi-Color Palette per user request)
  const processSteps = [
    {
      num: "01",
      tag: "Discovery",
      title: "Listen & Technical Audit",
      desc: "We dissect your operational bottlenecks, product specs, or target creator demographic. We align on measurable success criteria in clear, no-nonsense language.",
      chips: ["Architecture Review", "Operational Scoping", "Audience Blueprint"],
      color: "#C6A75E", // Soft Gold / Warm Amber (from swatch)
      lightBg: "rgba(198, 167, 94, 0.18)",
      glow: "rgba(198, 167, 94, 0.4)"
    },
    {
      num: "02",
      tag: "Architecture",
      title: "Shape Architecture & Strategy",
      desc: "We build database schemas, interface wireframes, or video production storyboards before writing a line of code or setting up lighting. You see the entire plan mapped out.",
      chips: ["System Schema Design", "UI/UX Prototypes", "Production Scripts"],
      color: "#0284C7", // Electric Azure / Tech Blue
      lightBg: "rgba(2, 132, 199, 0.18)",
      glow: "rgba(2, 132, 199, 0.4)"
    },
    {
      num: "03",
      tag: "Sprint Execution",
      title: "Make, Code & Produce",
      desc: "Engineers and video producers work in synchronized weekly sprints. You test live staging builds or review video cuts every week—zero big reveals at the 11th hour.",
      chips: ["Agile Code Sprints", "4K Studio Shoots", "CI/CD Staging Builds"],
      color: "#EA580C", // Vibrant Sunset Coral / Burnt Orange
      lightBg: "rgba(234, 88, 12, 0.18)",
      glow: "rgba(234, 88, 12, 0.4)"
    },
    {
      num: "04",
      tag: "Launch & Scale",
      title: "Launch, Scale & Support",
      desc: "We deploy to production cloud infrastructures, configure Razorpay payments, launch content distribution, and monitor performance daily. You receive clean monthly executive reports.",
      chips: ["Production Rollout", "Razorpay Reconciliation", "SLA Engineering"],
      color: "#10B981", // Emerald Mint / Production Green (restores energetic green vibe)
      lightBg: "rgba(16, 185, 129, 0.18)",
      glow: "rgba(16, 185, 129, 0.4)"
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
      <header className="nav" data-solid={navSolid} data-hidden={navHidden}>
        <div className="wrap nav-inner">
          <a className="logo" href="#top" aria-label="Divak Home">
            <svg className="logo-symbol" viewBox="0 0 64 64" aria-hidden="true">
              <path
                d="M19 13h15c11.6 0 19 8.2 19 19s-7.4 19-19 19H19V13zm8.5 7.5v23h6.5c7 0 11-4.5 11-11.5s-4-11.5-11-11.5h-6.5z"
                fill="currentColor"
              ></path>
              <ellipse
                cx="32"
                cy="36"
                rx="27"
                ry="8"
                fill="none"
                style={{ stroke: "var(--accent)" }}
                strokeWidth="3.5"
                transform="rotate(-14 32 36)"
              ></ellipse>
            </svg>
            <span>Divak</span>
          </a>

          <nav aria-label="Main Navigation">
            <ul className="nav-links">
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
              onClick={openCalendly}
              title="Schedule consultation on Calendly (Weekdays 9-11 PM, All Days 9-12 AM/PM)"
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
                <a href="#tech" onClick={() => setMobileMenuOpen(false)}>
                  01 // Tech Solutions &amp; Engineering
                </a>
              </li>
              <li>
                <a href="#creator" onClick={() => setMobileMenuOpen(false)}>
                  02 // Creator Studio &amp; Production
                </a>
              </li>
              <li>
                <a href="#work" onClick={() => setMobileMenuOpen(false)}>
                  03 // Selected Work &amp; Architecture
                </a>
              </li>
              <li>
                <a href="#process" onClick={() => setMobileMenuOpen(false)}>
                  04 // How We Work
                </a>
              </li>
              <li>
                <a href="#faq" onClick={() => setMobileMenuOpen(false)}>
                  05 // FAQ
                </a>
              </li>
            </ul>
          </div>
          <div style={{ display: "grid", gap: "1rem", marginTop: "2rem" }}>
            <button
              className="btn btn-ghost"
              onClick={() => {
                setMobileMenuOpen(false);
                openCalendly();
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
        {/* HERO SECTION - CLEAN CENTERED AESTHETIC ON WARM LIGHT CLAY CANVAS */}
        <section
          id="top"
          className="hero surface-clay"
          aria-labelledby="hero-title"
        >
          <div className="hero-art-bg" aria-hidden="true">
            <img src="/images/hero_texture.jpg" alt="" />
          </div>
          <div className="wrap">
            <div className="hero-centered">
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
                Divak is a tailor-made technology development studio and activation engine in India.
                We build bespoke software, license battle-tested enterprise architectures like{" "}
                <strong>CampusFlow School ERP</strong>, produce in-house 4K creator content, and run
                nationwide collegiate hackathons.
              </p>
              <div className="hero-actions">
                <a className="btn" href="#work">
                  <span>Explore Work</span>
                  <ArrowUpRight className="btn-icon" size={18} />
                </a>
                <button
                  className="btn btn-ghost"
                  onClick={openCalendly}
                >
                  <Clock size={18} />
                  <span>Book Call (Weekdays 9-11 PM / All Days 9-12)</span>
                </button>
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
                <span>
                  Calendly Open: <strong>Weekdays 9–11 PM</strong> | <strong>All Days 9–12</strong>
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* MARQUEE BANNER */}
        <div className="marquee" aria-label="Divak Services and Capabilities">
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
                <h3>One Team, Code to Campus</h3>
                <p>
                  Software engineering, white-label SaaS, campus activations and 4K production sit at the same table, so the idea survives from code to feed.
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


        {/* WHAT WE DO & SERVICES ACCORDION */}
        <section id="tech" className="surface-paper band" aria-labelledby="services-title">
          <div className="wrap services">
            <div className="section-head">
              <h2 id="services-title">What we do</h2>
              <p>
                From custom architecture and white-label source code to high-converting creator studios and collegiate hackathons.
              </p>
              <div style={{ marginTop: "1.5rem" }}>
                <button
                  className="btn btn-ink"
                  onClick={openCalendly}
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
                          style={{ textDecoration: "underline", textUnderlineOffset: "4px" }}
                          onClick={() => {
                            if (!selectedServices.includes(svc.title)) {
                              setSelectedServices([...selectedServices, svc.title]);
                            }
                          }}
                        >
                          Book this practice <ArrowUpRight className="btn-icon" size={16} />
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
                Work<span className="work-count" aria-hidden="true">08</span>
              </h2>
              <div className="work-head-side">
                <p>
                  Selected work for brands and institutions across India. Real client work. The client’s name is kept confidential. Open any project to inspect the technical architecture and delivery brief.
                </p>
                <div className="filters" role="group" aria-label="Filter work by type">
                  {[
                    { id: "all", label: "All" },
                    { id: "products", label: "Products & ERP" },
                    { id: "software", label: "Software" },
                    { id: "creator", label: "Creator" },
                    { id: "campus", label: "Campus" }
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
                        Architecture Brief <ArrowUpRight className="work-open-icon" size={16} />
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
                <h2 id="process-title">How we work</h2>
                <p>
                  A battle-tested progression from first architectural scoping to live production monitoring and revenue accrual.
                </p>
              </div>

              {/* PROCESS METER */}
              <div className="process-meter" aria-hidden="true">
                <span
                  style={{
                    transform: `scaleX(${(activeStep + 1) / processSteps.length})`,
                    background: processSteps[activeStep].color
                  }}
                ></span>
              </div>

              <div className="process-now" aria-hidden="true">
                <span
                  className="process-now-num"
                  style={{ color: processSteps[activeStep].color }}
                >
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
              {processSteps.map((step, idx) => {
                const isActive = activeStep === idx;
                return (
                  <li
                    key={idx}
                    className="step"
                    data-step={idx}
                    data-active={isActive}
                    style={{
                      borderLeft: isActive ? `5px solid #FFFFFF` : `4px solid ${step.color}`,
                      ...(isActive
                        ? {
                            background: `linear-gradient(135deg, ${step.color} 0%, color-mix(in srgb, ${step.color} 70%, black) 100%)`,
                            boxShadow: `0 20px 48px -12px ${step.glow || "rgba(0,0,0,0.5)"}`
                          }
                        : {})
                    }}
                    onClick={() => handleStepClick(idx)}
                  >
                    <div className="step-top">
                      <span
                        className="step-num"
                        style={{ color: isActive ? "#FFFFFF" : step.color }}
                      >
                        {step.num}
                      </span>
                      <span
                        className="step-badge"
                        style={{
                          background: isActive ? "rgba(255, 255, 255, 0.25)" : step.lightBg,
                          color: isActive ? "#FFFFFF" : step.color,
                          padding: "0.28rem 0.85rem",
                          borderRadius: "999px",
                          fontSize: "0.75rem",
                          fontWeight: "700",
                          letterSpacing: "0.06em",
                          textTransform: "uppercase"
                        }}
                      >
                        {step.tag}
                      </span>
                    </div>
                    <h3 style={{ color: isActive ? "#FFFFFF" : "var(--on-ink)" }}>{step.title}</h3>
                    <p style={{ color: isActive ? "rgba(255, 255, 255, 0.94)" : "var(--on-ink-muted)" }}>
                      {step.desc}
                    </p>
                    <ul className="chips">
                      {step.chips.map((chip, cIdx) => (
                        <li
                          key={cIdx}
                          className="chip"
                          style={{
                            background: isActive
                              ? "rgba(255, 255, 255, 0.22)"
                              : "color-mix(in srgb, var(--on-ink) 8%, transparent)",
                            color: isActive ? "#FFFFFF" : "var(--on-ink)",
                            border: isActive ? "1px solid rgba(255, 255, 255, 0.28)" : "1px solid var(--line-ink)"
                          }}
                        >
                          {chip}
                        </li>
                      ))}
                    </ul>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>

        {/* PROMISES BENTO GRID */}
        <section className="surface-paper band" aria-labelledby="promise-title">
          <div className="wrap">
            <div className="section-head">
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
                  onClick={openCalendly}
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
                <footer>Divyansh &amp; Akshat, Founders</footer>
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

        {/* TEAM SECTION (HIDDEN FOR EVENT - EASY RE-ENABLE) */}
        {SHOW_FOUNDERS && (
          <section id="team" className="surface-paper band" aria-labelledby="team-title">
            <div className="wrap team-layout">
              <div className="founders-head">
                <h2 id="team-title">The people on your account</h2>
                <p>
                  Technical and creative founders on every account. The engineers who architect your system are the ones in your sprint reviews.
                </p>
                <div style={{ marginTop: "1rem" }}>
                  <button
                    className="btn btn-ghost"
                    onClick={openCalendly}
                  >
                    <Calendar size={18} /> Meet the Founders
                  </button>
                </div>
              </div>

              <div className="founders">
                <article className="founder">
                  <div className="founder-photo">
                    <img
                      src="/team/akshat.webp"
                      alt="Akshat - Co-Founder &amp; Technical Architect"
                      loading="lazy"
                    />
                  </div>
                  <div className="founder-meta">
                    <h3>Akshat</h3>
                    <p className="founder-role">Co-Founder &amp; Technical Architect</p>
                    <p className="founder-bio">
                      Architects core enterprise software, CampusFlow school ERP, and white-label SaaS infrastructure. Leads full-stack engineering, databases, and cloud systems from first commit to live production.
                    </p>
                  </div>
                </article>

                <article className="founder">
                  <div className="founder-photo">
                    <img
                      src="/team/divyansh.webp"
                      alt="Divyansh - Co-Founder &amp; Creative Director / Outreach"
                      loading="lazy"
                    />
                  </div>
                  <div className="founder-meta">
                    <h3>Divyansh</h3>
                    <p className="founder-role">Co-Founder &amp; Creative Director / Outreach</p>
                    <p className="founder-bio">
                      Directs creative strategy, brand outreach, in-house 4K cinema studio production ('khud ka production'), creator profile deals, and nationwide HackCulture collegiate hackathon networks across Indian universities.
                    </p>
                  </div>
                </article>
              </div>
            </div>
          </section>
        )}

        {/* FAQ SECTION */}
        <section id="faq" className="surface-paper band" style={{ paddingTop: 0 }} aria-labelledby="faq-title">
          <div className="wrap faq">
            <div className="section-head">
              <h2 id="faq-title">Questions, answered</h2>
              <p>
                Everything you need to know about our services, practices, CampusFlow ERP, white-label licensing, and Calendly availability.
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
              <h2 id="contact-title">Got a product to engineer?</h2>
              <p className="contact-lede">
                Tell us about your technical requirements or creator brief. We review every submission within 1 business day with actionable next steps.
              </p>

              <div className="contact-direct">
                <span>Direct inquiries</span>
                <div className="contact-email-wrap">
                  <a
                    href={`https://mail.google.com/mail/?view=cm&fs=1&to=${EMAIL_ADDRESS}&su=${encodeURIComponent("Project Inquiry | Divak Technical Studio")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={openGmail}
                    className="contact-email-link"
                    title="Click to compose in Gmail"
                  >
                    {EMAIL_ADDRESS}
                  </a>

                  <div className="email-launch-actions">
                    <button
                      type="button"
                      className="email-client-btn"
                      onClick={openGmail}
                      title="Open and compose in Gmail"
                    >
                      <Globe size={13} />
                      <span>Gmail ↗</span>
                    </button>
                    <button
                      type="button"
                      className="email-client-btn"
                      onClick={openOutlook}
                      title="Open and compose in Outlook Web"
                    >
                      <Mail size={13} />
                      <span>Outlook ↗</span>
                    </button>
                    <button
                      type="button"
                      className="email-client-btn"
                      onClick={copyEmail}
                      title="Copy email to clipboard"
                    >
                      {emailCopied ? <Check size={13} /> : <Copy size={13} />}
                      <span>{emailCopied ? "Copied!" : "Copy"}</span>
                    </button>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: "1.5rem" }}>
                <button
                  className="btn btn-ink"
                  onClick={openCalendly}
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
                    <legend>What do you need?</legend>
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

                  {submitError && (
                    <div style={{ marginTop: "1rem", padding: "0.85rem 1rem", borderRadius: "var(--radius-s)", background: "rgba(220, 38, 38, 0.1)", border: "1px solid rgba(220, 38, 38, 0.3)", color: "var(--on-ink)" }}>
                      <div style={{ fontSize: "var(--t-xs)", fontWeight: 700, color: "#e11d48", marginBottom: "0.35rem" }}>
                        Note on Submission:
                      </div>
                      <p style={{ fontSize: "var(--t-xs)", margin: 0, lineHeight: 1.4 }}>
                        {submitError}
                      </p>
                      <button
                        type="button"
                        className="btn btn-sm"
                        style={{ marginTop: "0.75rem", background: "var(--ink)", color: "white" }}
                        onClick={(e) => {
                          const su = encodeURIComponent(`Project Brief from ${formData.name}`);
                          const body = encodeURIComponent(
                            `Name: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nServices: ${selectedServices.join(", ")}\nBudget: ${selectedBudget}\nPreferred Slot: ${formData.timeSlot}\n\nProject Scope:\n${formData.brief}\n`
                          );
                          window.open(
                            `https://mail.google.com/mail/?view=cm&fs=1&to=${EMAIL_ADDRESS}&su=${su}&body=${body}`,
                            "_blank",
                            "noopener,noreferrer"
                          );
                        }}
                      >
                        <Globe size={13} />
                        <span>Send Prefilled Draft in Gmail ↗</span>
                      </button>
                    </div>
                  )}

                  <div className="brief-foot" style={{ marginTop: "1.5rem" }}>
                    <button type="submit" className="btn" disabled={isSubmitting}>
                      <span>{isSubmitting ? "Dispatching Brief..." : "Submit Project Brief"}</span>
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
                    Thank you, <strong>{formData.name || "there"}</strong>. We’ve logged your selected services:{" "}
                    <em>{selectedServices.join(", ")}</em>. A founding engineer will review and reach out within 1 working day.
                  </p>
                  <button
                    className="btn btn-ghost"
                    onClick={openCalendly}
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
                  <path
                    d="M19 13h15c11.6 0 19 8.2 19 19s-7.4 19-19 19H19V13zm8.5 7.5v23h6.5c7 0 11-4.5 11-11.5s-4-11.5-11-11.5h-6.5z"
                    fill="currentColor"
                  ></path>
                  <ellipse
                    cx="32"
                    cy="36"
                    rx="27"
                    ry="8"
                    fill="none"
                    style={{ stroke: "var(--accent)" }}
                    strokeWidth="3.5"
                    transform="rotate(-14 32 36)"
                  ></ellipse>
                </svg>
                <span>Divak</span>
              </a>
              <p style={{ marginTop: "1rem" }}>
                Hybrid Technical Development Studio &bull; White-Label SaaS &bull; Creator Management &bull; HackCulture.
              </p>
              <div style={{ marginTop: "1.25rem" }}>
                <span className="availability-pill">
                  Calendly: Weekdays 9-11 PM &bull; All Days 9-12
                </span>
              </div>
            </div>

            <div>
              <h4>Products</h4>
              <ul>
                <li>
                  <a href="#work">CampusFlow School ERP</a>
                </li>
                <li>
                  <a href="#work">HackCulture Hackathon OS</a>
                </li>
                <li>
                  <a href="#work">DevRank Talent Cloud</a>
                </li>
                <li>
                  <a href="#tech">White-Label SaaS Licensing</a>
                </li>
              </ul>
            </div>

            <div>
              <h4>What We Do</h4>
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
              <a href="#work">Confidential Portfolio</a>
            </div>
          </div>
        </div>
      </footer>

      {/* CASE STUDY DETAIL MODAL */}
      {activeCaseModal && (
        <div
          className="modal-backdrop"
          data-lenis-prevent="true"
          onClick={() => setActiveCaseModal(null)}
        >
          <div
            className="modal-sheet"
            data-lenis-prevent="true"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <span className="work-tag" style={{ position: "static" }}>{activeCaseModal.tag}</span>
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

                  <div className="confidential-badge-card" style={{ marginTop: "1.5rem", padding: "1.15rem 1.25rem", borderRadius: "var(--radius-s)", background: "color-mix(in srgb, var(--accent) 12%, transparent)", border: "1px solid color-mix(in srgb, var(--accent) 35%, transparent)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--accent)", fontWeight: 700, fontSize: "var(--t-xs)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                      <ShieldCheck size={16} /> Confidential Engagement
                    </div>
                    <p style={{ marginTop: "0.4rem", fontSize: "var(--t-sm)", color: "var(--on-ink)", lineHeight: 1.5 }}>
                      Real client work. The client’s name is kept confidential.
                    </p>
                  </div>

                  <div style={{ marginTop: "1rem" }}>
                    <button
                      className="btn"
                      onClick={() => {
                        setActiveCaseModal(null);
                        openCalendly();
                      }}
                      style={{ width: "100%", justifyContent: "center" }}
                    >
                      <Calendar size={16} />
                      <span>Book Architecture Walkthrough</span>
                    </button>
                  </div>
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
                        openCalendly();
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
    </div>
  );
}
