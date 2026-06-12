"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import { Code2, Server, Shield, Cloud, Puzzle, Github, Linkedin } from "lucide-react";
// Custom cursor component
function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "A" || target.tagName === "BUTTON" || target.closest("a") || target.closest("button")) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener("mousemove", updatePosition);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", updatePosition);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  return (
    <>
      <motion.div
        className={`cursor ${isHovered ? "hovered" : ""}`}
        animate={{ x: position.x - 10, y: position.y - 10 }}
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
      />
      <motion.div
        className="cursor-follower"
        animate={{ x: position.x - 4, y: position.y - 4 }}
        transition={{ type: "spring", stiffness: 800, damping: 35 }}
      />
    </>
  );
}

// Animated text reveal
function AnimatedText({ children, className = "", delay = 0 }: { children: string; className?: string; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const words = children.split(" ");

  return (
    <motion.span ref={ref} className={className}>
      {words.map((word, i) => (
        <span key={i} className="inline-block  pb-1 sm:pb-2">
          <motion.span
            className="inline-block"
            initial={{ y: "100%" }}
            animate={isInView ? { y: 0 } : { y: "100%" }}
            transition={{
              duration: 0.6,
              ease: [0.33, 1, 0.68, 1],
              delay: delay + i * 0.05,
            }}
          >
            {word}&nbsp;
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

// Navigation
function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMobileMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const navItems = ["About", "Work", "Skills", "Contact"];

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled || mobileMenuOpen ? "bg-[#050505]/95 backdrop-blur-xl border-b border-white/5" : ""
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6 flex justify-between items-center">
          <motion.a
            href="#"
            className="text-xl md:text-2xl font-bold gradient-text relative z-50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            DM.
          </motion.a>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8 lg:gap-12">
            {navItems.map((item, i) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-sm font-medium text-[#e1e1e1] hover:text-white transition-colors line-animation"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
              >
                {item}
              </motion.a>
            ))}
          </div>
          <motion.a
            href="#contact"
            className="magnetic-btn hidden md:flex"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>Let&apos;s Talk</span>
          </motion.a>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden relative z-50 w-10 h-10 flex flex-col justify-center items-center gap-1.5"
            aria-label="Toggle menu"
          >
            <motion.span
              className="w-6 h-0.5 bg-white block"
              animate={mobileMenuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.3 }}
            />
            <motion.span
              className="w-6 h-0.5 bg-white block"
              animate={mobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
            <motion.span
              className="w-6 h-0.5 bg-white block"
              animate={mobileMenuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.3 }}
            />
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-[#050505]/98 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col items-center justify-center h-full gap-8">
              {navItems.map((item, i) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-3xl font-bold text-white hover:text-[#00ff88] transition-colors"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 30 }}
                  transition={{ delay: i * 0.1 }}
                >
                  {item}
                </motion.a>
              ))}
              <motion.a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="magnetic-btn mt-4"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ delay: 0.4 }}
              >
                <span>Let&apos;s Talk</span>
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Hero section
function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section ref={ref} className="relative -z-[1] min-h-[100vh] flex items-center justify-center overflow-hidden pt-20 md:pt-0">
      <div className="gradient-bg" />
      <div className="noise-overlay" />
      
      {/* Floating shapes - smaller on mobile */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-32 md:w-64 h-32 md:h-64 rounded-full bg-[#00ff88]/20 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, -30, 0],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/3 right-1/4 w-48 md:w-96 h-48 md:h-96 rounded-full bg-[#ff3366]/20 blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          x: [0, -50, 0],
          y: [0, 50, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div style={{ y, opacity }} className="relative z-10 text-center px-4 sm:px-6 md:px-8 w-full max-w-6xl mx-auto flex flex-col items-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-[#00ff88] text-xs sm:text-sm font-mono mb-4 sm:mb-6 tracking-[0.2em] sm:tracking-[0.3em] uppercase"
        >
          Dhruvit Maniya
        </motion.p>

        <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight mb-6 sm:mb-8">
          <AnimatedText delay={0.9}>Crafting Scalable</AnimatedText>
          <br />
          <span className="gradient-text whitespace-nowrap">
            <AnimatedText delay={1.1}>Web & Mobile Systems</AnimatedText>
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
          className="text-base sm:text-lg md:text-xl text-[#e1e1e1] max-w-2xl mx-auto mb-8 sm:mb-12 leading-relaxed px-2"
        >
          I design and build scalable web and mobile products using <b className="text-[#00ff88]">React</b> and <b className="text-[#00ff88]">React Native</b>, engineered for performance, clean architecture, and real-world reliability.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6 }}
          className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center w-full sm:w-auto"
        >
          <motion.a
            href="#work"
            className="magnetic-btn w-full sm:w-auto text-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>View My Work</span>
          </motion.a>
          <motion.a
            href="#contact"
            className="text-white border border-white/20 px-8 sm:px-10 py-3 sm:py-4 rounded-full hover:bg-white/5 transition-all text-sm font-semibold tracking-wider uppercase w-full sm:w-auto text-center"
            whileHover={{ scale: 1.05, borderColor: "rgba(0, 255, 136, 0.5)" }}
            whileTap={{ scale: 0.95 }}
          >
            Get In Touch
          </motion.a>
        </motion.div>

        {/* Scroll indicator - hidden on small mobile */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute -bottom-[100px]  left-[51%] -translate-x-1/2 hidden sm:block"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center pt-2"
          >
            <motion.div className="w-1 h-2 bg-[#00ff88] rounded-full" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}

// Marquee section
function Marquee() {
  const skills = ["React", "Next.js", "JavaScript", "TypeScript", "React Native", "Tailwind", "AWS", "Figma"];
  
  return (
    <div className="py-6 sm:py-8 md:py-12 border-y border-white/5 overflow-hidden  relative z-10">
      <div className="marquee flex whitespace-nowrap">
        {[...skills, ...skills].map((skill, i) => (
          <span key={i} className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mx-4 sm:mx-6 md:mx-8">
            {skill} <span className="text-[#00ff88]"> ✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// About section
function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" ref={ref} className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-8 relative">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="order-2 md:order-1"
        >
          <p className="text-[#00ff88] text-xs sm:text-sm font-mono mb-3 sm:mb-4 tracking-[0.2em] sm:tracking-[0.3em] uppercase">About Me</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 sm:mb-8">
            <AnimatedText>Blending Engineering & Results</AnimatedText>
          </h2>
          <div className="space-y-4 sm:space-y-6 text-[#e1e1e1] text-base sm:text-lg leading-relaxed">
            <p>
            I help startups and businesses turn ideas into scalable, production-ready web and mobile applications. With <b className="text-[#00ff88]">5+ years</b> of experience, I specialize in <b className="text-[#00ff88]">React and React Native</b>, delivering reliable, high-performance solutions that are built to scale.
            </p>
            <p>
            I’ve partnered with clients across industries to build <b className="text-[#00ff88]">B2B platforms</b>, <b className="text-[#00ff88]">consumer apps</b>, and custom tools, including applications with <b className="text-[#00ff88]">millions of users</b>, complex integrations, and cloud-optimized infrastructure. My approach is simple: clean architecture, fast execution, and long-term reliability.
            </p>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4 }}
            className="mt-8 sm:mt-10 flex gap-6 sm:gap-8 justify-center "
          >
            <div className="text-center">
              <p className="text-3xl sm:text-4xl font-bold gradient-text">10+</p>
              <p className="text-[#e1e1e1] text-xs sm:text-sm mt-1">Projects Completed</p>
            </div>
            <div className="text-center">
              <p className="text-3xl sm:text-4xl font-bold gradient-text">5+</p>
              <p className="text-[#e1e1e1] text-xs sm:text-sm mt-1">Years Experience</p>
            </div>
            
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative order-1 md:order-2 max-w-sm mx-auto md:max-w-none"
        >
          <div className="animated-border p-4 sm:p-6 md:p-8 relative z-10">
            <div className="aspect-square bg-gradient-to-br from-[#00ff88]/20 to-[#ff3366]/20 rounded-lg overflow-hidden relative">
              <div className="absolute inset-0 grid-pattern" />
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 bg-[#1a1a2e] rounded-2xl flex items-center justify-center shadow-2xl"
                  animate={{ scale: [1, 1.03, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20">
                    <path d="M8 7L3 12L8 17" stroke="#a78bfa" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 7L21 12L16 17" stroke="#a78bfa" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M14 4L10 20" stroke="#c4b5fd" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </motion.div>
              </div>
            </div>
          </div>
          {/* Decorative elements - hidden on mobile */}
          <div className="absolute -top-4 -right-4 w-16 sm:w-24 h-16 sm:h-24 border border-[#00ff88]/30 rounded-lg -z-10 hidden sm:block" />
          <div className="absolute -bottom-4 -left-4 w-20 sm:w-32 h-20 sm:h-32 border border-[#ff3366]/30 rounded-lg -z-10 hidden sm:block" />
        </motion.div>
      </div>
    </section>
  );
}

// Projects section
function Projects() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const projects = [
    {
      title: "Growder",
      category: "B2B E-Commerce Platform",
      description: "Built multiple front-end sub-products (System Admin, Retailers, OEM, Channel Partners) using React JS and Tailwind. Created Retailer and OEM mobile apps with React Native. Integrated PayGol, Razorpay, and Stripe for payments.",
      tech: ["React", "React Native", "Tailwind", "Stripe", "AWS"],
      color: "#ff6600",
      image: './growder.png',
      textLogo: "Growder",
    },
    {
      title: "InPackaging",
      category: "Marketplace Platform",
      description: "Contributed to multiple front-end applications including Raw Material Marketplace, Packaging Service Marketplace, Forum, and Pride Lab websites. Built micro-frontend architecture enabling independent communication across websites.",
      tech: ["React", "React Native CLI", "Micro-frontend", "ICICI Banking"],
      color: "#ff3366",
      image: "./inpackaging.png",
      textLogo: "Inpackaging",
    },
    {
      title: "MoodMe",
      category: "Mobile App Development",
      description: "Relationship Mood App with Firebase in-app notifications and messaging. Fixed cross-device compatibility issues. Reached more than 100k downloads across iOS and Android.",
      tech: ["React Native", "Firebase", "iOS", "Android"],
      color: "#00c3ff",
      image: "./moodme.webp",
      textLogo: "MoodMe",
    },
    {
      title: "VRSist",
      category: "Hotel Management System",
      description: "Kiosk-based hotel booking management system including Kiosk Desktop Integration, System Admin interfaces, and Audio/Video real-time projection features.",
      tech: ["React", "Kiosk Integration", "Real-time A/V"],
      color: "#ff9500",
      image: "./vrsist.png",
      textLogo: "VRSist",
    },
    {
      title: "Trace Bust",
      category: "Mobile App Development",
      description: "Redesigned UI and implemented light/dark theme switching. Upgraded the app to latest versions for new device support. Implemented In-App Purchase with react-native-iap.",
      tech: ["React Native", "In-App Purchase", "Theme Switching"],
      color: "#9b59b6",
      image: "./tracebust.png",
      textLogo: "TraceBust",
    },
    {
      title: "Prank Caller",
      category: "Mobile App Development",
      description: "Phone Dial App featuring a unique drawer animation with 60 fps smoothness. Implemented Prank Chat messaging functionality for an engaging user experience.",
      tech: ["React Native", "Animations", "Chat Messaging"],
      color: "#e74c3c",
      image: "./prankcaller.webp",
      textLogo: "Prank Caller",
    },
    {
      title: "OpiGo",
      category: "FinTech Mobile App",
      description: "Built from scratch a stock market app with 50K+ downloads. Features include stock predictions, community scoring, expert advisory marketplace, gamified rewards system, and real-time market updates for 70K+ active users.",
      tech: ["React Native", "Firebase", "Real-time Data", "In-App Purchases"],
      color: "#2ecc71",
      image: "./opigo.png",
      textLogo: "OpiGo",
    },
    {
      title: "FeedHive",
      category: "SaaS Platform",
      description: "Contributed to a leading AI-powered social media management platform trusted by 30K+ businesses. Features include multi-platform scheduling, AI writing assistant, automation workflows, social inbox, and team collaboration tools.",
      tech: ["React", "Next.js", "AI Integration", "SaaS"],
      color: "#8b5cf6",
      image: "./feedhive.png",
      textLogo: "FeedHive",
    },
  ];

  return (
    <section id="work" ref={ref} className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-8 relative">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12 sm:mb-16 md:mb-20"
        >
          <p className="text-[#00ff88] text-xs sm:text-sm font-mono mb-3 sm:mb-4 tracking-[0.2em] sm:tracking-[0.3em] uppercase">Selected Work</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">
            <AnimatedText>Featured Projects</AnimatedText>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {projects.map((project, i) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.15 }}
              className="project-card group"
            >
              <div className="p-4 sm:p-6 md:p-8">
                <div
                  className="aspect-video rounded-lg sm:rounded-xl mb-4 sm:mb-6 md:mb-8 flex items-center justify-center relative overflow-hidden"
                  style={{ background: `linear-gradient(135deg, ${project.color}15, ${project.color}05)` }}
                >
                  <div className="absolute inset-0 grid-pattern opacity-50" />
                  { (
                    <motion.span
                      className="text-4xl sm:text-5xl md:text-6xl font-bold italic relative z-10"
                      style={{ color: project.color }}
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <img src={project.image} alt={project.title} className="w-full h-full object-contain" />
                    </motion.span>
                  ) }
                </div>

                <p className="text-xs sm:text-sm font-mono mb-2 sm:mb-3" style={{ color: project.color }}>
                  {project.category}
                </p>
                <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 group-hover:text-[#00ff88] transition-colors">
                  {project.title}
                </h3>
                <p className="text-[#e1e1e1] text-sm sm:text-base mb-4 sm:mb-6 leading-relaxed">{project.description}</p>

                <div className="flex flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-6">
                  {project.tech.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs px-3 sm:px-4 py-1.5 sm:py-2 bg-white/5 rounded-full text-[#e1e1e1] border border-white/10"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* <motion.a
                  href="#"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-white group/link"
                  whileHover={{ x: 10 }}
                >
                  View Project
                  <svg
                    className="w-4 h-4 transition-transform group-hover/link:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </motion.a> */}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Skills section
function Skills() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const skillCategories = [
    {
      title: "Frontend",
      icon: Code2,
      color: "#00ff88",
      skills: ["React Native", "React", "Next.js", "Redux", "TypeScript", "JavaScript", "Tailwind CSS"],
    },
    {
      title: "Backend",
      icon: Server,
      color: "#6366f1",
      skills: ["Spring Boot", "Firebase", "PostgreSQL", "MongoDB", "REST APIs"],
    },
    {
      title: "Cloud & DevOps",
      icon: Cloud,
      color: "#00c3ff",
      skills: ["AWS (EC2, RDS, S3)", "Docker", "CI/CD", "Git"],
    },
    {
      title: "Security",
      icon: Shield,
      color: "#9b59b6",
      skills: ["Auth/Session Tokens", "SSL Pinning", "Encryption", "Nonce Validation"],
    },
    {
      title: "Integrations",
      icon: Puzzle,
      color: "#ff9500",
      skills: ["Stripe", "Razorpay", "PayGol", "RevenueCat", "Google Maps", "Mapbox"],
    },
  ];

  return (
    <section id="skills" ref={ref} className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-8 bg-[#080808] relative overflow-hidden">
      {/* Animated background elements - smaller on mobile */}
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <motion.div
        className="absolute top-10 sm:top-20 left-5 sm:left-10 w-48 sm:w-72 h-48 sm:h-72 rounded-full blur-3xl opacity-20"
        style={{ background: "radial-gradient(circle, #00ff88 0%, transparent 70%)" }}
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 30, 0],
          y: [0, -20, 0],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-10 sm:bottom-20 right-5 sm:right-10 w-64 sm:w-96 h-64 sm:h-96 rounded-full blur-3xl opacity-15"
        style={{ background: "radial-gradient(circle, #ff3366 0%, transparent 70%)" }}
        animate={{
          scale: [1.2, 1, 1.2],
          x: [0, -40, 0],
          y: [0, 30, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12 sm:mb-16 md:mb-20"
        >
          <motion.p 
            className="text-[#00ff88] text-xs sm:text-sm font-mono mb-3 sm:mb-4 tracking-[0.2em] sm:tracking-[0.3em] uppercase"
            initial={{ opacity: 0, letterSpacing: "0.1em" }}
            animate={isInView ? { opacity: 1, letterSpacing: "0.3em" } : {}}
            transition={{ duration: 0.8 }}
          >
            Expertise
          </motion.p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">
            <AnimatedText>Skills & Technologies</AnimatedText>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {skillCategories.map((category, catIndex) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 50, rotateX: -15 }}
              animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
              transition={{ 
                delay: catIndex * 0.2,
                duration: 0.6,
                type: "spring",
                stiffness: 100
              }}
              whileHover={{ 
                y: -10,
                transition: { duration: 0.3 }
              }}
              className="group relative"
            >
              {/* Card glow effect on hover */}
              <motion.div
                className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"
                style={{ background: `linear-gradient(135deg, ${category.color}40, transparent)` }}
              />
              
              <div className="relative animated-border p-4 sm:p-6 md:p-8 h-full backdrop-blur-sm">
                {/* Floating icon */}
                
                <motion.div
                  // className="text-4xl sm:text-5xl mb-4 sm:mb-6"
                  className="mb-4 sm:mb-4 rounded-lg bg-secondary/10 group-hover:bg-secondary/20 transition-colors"
                 
                >
                  <category.icon className="w-10 h-10 text-secondary" color={category.color} />
                  {/* {category.icon} */}
                </motion.div>

                {/* Category title with animated underline */}
                <div className="relative inline-block mb-6 sm:mb-8">
                  <h3 
                    className="text-xl sm:text-2xl font-bold"
                    style={{ color: category.color }}
                  >
                    {category.title}
                  </h3>
                  <motion.div
                    className="absolute -bottom-2 left-0 h-0.5 rounded-full"
                    style={{ background: category.color }}
                    initial={{ width: 0 }}
                    animate={isInView ? { width: "100%" } : { width: 0 }}
                    transition={{ delay: catIndex * 0.2 + 0.5, duration: 0.6 }}
                  />
                </div>

                {/* Skills as animated pills */}
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {category.skills.map((skill, skillIndex) => (
                    <motion.span
                      key={skill}
                      initial={{ opacity: 0, scale: 0.5, y: 20 }}
                      animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
                      transition={{ 
                        delay: catIndex * 0.2 + skillIndex * 0.08,
                        duration: 0.4,
                        type: "spring",
                        stiffness: 200
                      }}
                      whileHover={{ 
                        scale: 1.1,
                        y: -5,
                        boxShadow: `0 10px 30px ${category.color}30`,
                      }}
                      whileTap={{ scale: 0.95 }}
                      className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-full cursor-pointer transition-colors duration-300"
                      style={{
                        background: `${category.color}15`,
                        border: `1px solid ${category.color}40`,
                        color: category.color,
                      }}
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>

                {/* Decorative corner elements */}
                <motion.div
                  className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 rounded-tr-lg opacity-20 group-hover:opacity-60 transition-opacity"
                  style={{ borderColor: category.color }}
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.div
                  className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 rounded-bl-lg opacity-20 group-hover:opacity-60 transition-opacity"
                  style={{ borderColor: category.color }}
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Contact section
function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const socialLinks = [
    { name: "GitHub", url: "https://github.com/dhruvitmaniya12", icon: Github },
    { name: "LinkedIn", url: "https://www.linkedin.com/in/dhruvitmaniya1/", icon: Linkedin },


  ];

  return (
    <section id="contact" ref={ref} className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-8 relative overflow-hidden">
      {/* Background elements - smaller on mobile */}
      <div className="absolute top-0 left-1/4 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 bg-[#00ff88]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 bg-[#ff3366]/5 rounded-full blur-3xl" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
        >
          <p className="text-[#00ff88] text-xs sm:text-sm font-mono mb-3 sm:mb-4 tracking-[0.2em] sm:tracking-[0.3em] uppercase">Get In Touch</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 sm:mb-8">
            <AnimatedText>Let&apos;s Work</AnimatedText>
            <br />
            <span className="gradient-text">
              <AnimatedText delay={0.2}>Together</AnimatedText>
            </span>
          </h2>
          <p className="text-base sm:text-lg text-[#e1e1e1] max-w-xl mx-auto mb-8 sm:mb-12 leading-relaxed px-2">
            Have a project in mind or just want to say hello? I&apos;d love to hear from you.
            Let&apos;s create something amazing together.
          </p>

          <motion.a
            href="mailto:dhruvitmaniya@gmail.com"
            className="inline-block text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-white hover:text-[#00ff88] transition-colors line-animation pb-2 break-all sm:break-normal"
            whileHover={{ scale: 1.02 }}
          >
            dhruvitmaniya@gmail.com
          </motion.a>

          <div className="flex justify-center gap-4 sm:gap-6 mt-10 sm:mt-16">
            {socialLinks.map((link, i) => (
              <motion.a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-white/20 flex items-center justify-center text-xs sm:text-sm font-bold hover:bg-[#00ff88] hover:border-[#00ff88] hover:text-black transition-all"
                whileHover={{ scale: 1.1, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <link.icon className="w-6 h-6 text-secondary" />
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Footer
function Footer() {
  return (
    <footer className="py-6 sm:py-8 px-4 sm:px-6 md:px-8 border-t border-white/5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4">
        <p className="text-[#e1e1e1] text-xs sm:text-sm text-center md:text-left">
          © 2026 Dhruvit Maniya. All rights reserved.
        </p>
        <p className="text-[#e1e1e1] text-xs sm:text-sm text-center md:text-right">
          Designed & Built with <span className="text-[#ff3366]">♥</span> and lots of ☕
        </p>
      </div>
    </footer>
  );
}

// Loading screen
function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 1500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] bg-[#050505] flex items-center justify-center px-4"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div className="text-center">
        <motion.div
          className="text-5xl sm:text-6xl md:text-8xl font-bold gradient-text mb-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          DM.
        </motion.div>
        <motion.div
          className="h-1 bg-gradient-to-r from-[#00ff88] to-[#ff3366] rounded-full mx-auto"
          initial={{ width: 0 }}
          animate={{ width: "min(200px, 80vw)" }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
      </motion.div>
    </motion.div>
  );
}

// Main component
export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>

      <AnimatePresence>
        {!isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <CustomCursor />
            <div className="noise-overlay" />
            <Navigation />
            <Hero />
            <Marquee />
            <About />
            <Projects />
            <Skills />
            <Contact />
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
