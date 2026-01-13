"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";

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
        <span key={i} className="inline-block overflow-hidden">
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

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = ["About", "Work", "Skills", "Contact"];

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-[#050505]/80 backdrop-blur-xl border-b border-white/5" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-8 py-6 flex justify-between items-center">
        <motion.a
          href="#"
          className="text-2xl font-bold gradient-text"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          DM.
        </motion.a>
        <div className="hidden md:flex items-center gap-12">
          {navItems.map((item, i) => (
            <motion.a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-sm font-medium text-[#888] hover:text-white transition-colors line-animation"
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
      </div>
    </motion.nav>
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
    <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="gradient-bg" />
      <div className="noise-overlay" />
      
      {/* Floating shapes */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-[#00ff88]/5 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, -30, 0],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full bg-[#ff3366]/5 blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          x: [0, -50, 0],
          y: [0, 50, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div style={{ y, opacity }} className="relative z-10 text-center px-8 max-w-6xl">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-[#00ff88] text-sm font-mono mb-6 tracking-[0.3em] uppercase"
        >
          Dhruvit Maniya
        </motion.p>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-8">
          <AnimatedText delay={0.9}>Crafting Digital</AnimatedText>
          <br />
          <span className="gradient-text">
            <AnimatedText delay={1.1}>Experiences</AnimatedText>
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
          className="text-lg md:text-xl text-[#888] max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          I build immersive web experiences that blend cutting-edge technology 
          with stunning design. Let&apos;s create something extraordinary together.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6 }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center"
        >
          <motion.a
            href="#work"
            className="magnetic-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>View My Work</span>
          </motion.a>
          <motion.a
            href="#contact"
            className="text-white border border-white/20 px-10 py-4 rounded-full hover:bg-white/5 transition-all text-sm font-semibold tracking-wider uppercase"
            whileHover={{ scale: 1.05, borderColor: "rgba(0, 255, 136, 0.5)" }}
            whileTap={{ scale: 0.95 }}
          >
            Get In Touch
          </motion.a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
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
  const skills = ["React", "Next.js", "TypeScript", "Three.js", "GSAP", "Tailwind", "Node.js", "Figma"];
  
  return (
    <div className="py-12 border-y border-white/5 overflow-hidden bg-[#080808]">
      <div className="marquee flex whitespace-nowrap">
        {[...skills, ...skills].map((skill, i) => (
          <span key={i} className="text-4xl md:text-5xl font-bold text-white/5 mx-8">
            {skill} <span className="text-[#00ff88]">✦</span>
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
    <section id="about" ref={ref} className="py-32 px-8 relative">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <p className="text-[#00ff88] text-sm font-mono mb-4 tracking-[0.3em] uppercase">About Me</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            <AnimatedText>Blending Code & Creativity</AnimatedText>
          </h2>
          <div className="space-y-6 text-[#888] text-lg leading-relaxed">
            <p>
              I&apos;m a creative developer with 5+ years of experience building 
              immersive digital experiences. I specialize in creating websites 
              that don&apos;t just function—they captivate.
            </p>
            <p>
              From interactive 3D visualizations to smooth scroll animations, 
              I push the boundaries of what&apos;s possible on the web. Every project 
              is an opportunity to blend art with technology.
            </p>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4 }}
            className="mt-10 flex gap-8"
          >
            <div>
              <p className="text-4xl font-bold gradient-text">50+</p>
              <p className="text-[#888] text-sm mt-1">Projects Completed</p>
            </div>
            <div>
              <p className="text-4xl font-bold gradient-text">5+</p>
              <p className="text-[#888] text-sm mt-1">Years Experience</p>
            </div>
            <div>
              <p className="text-4xl font-bold gradient-text">30+</p>
              <p className="text-[#888] text-sm mt-1">Happy Clients</p>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <div className="animated-border p-8 relative z-10">
            <div className="aspect-square bg-gradient-to-br from-[#00ff88]/20 to-[#ff3366]/20 rounded-lg overflow-hidden relative">
              <div className="absolute inset-0 grid-pattern" />
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  className="text-9xl"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  👨‍💻
                </motion.div>
              </div>
            </div>
          </div>
          {/* Decorative elements */}
          <div className="absolute -top-4 -right-4 w-24 h-24 border border-[#00ff88]/30 rounded-lg -z-10" />
          <div className="absolute -bottom-4 -left-4 w-32 h-32 border border-[#ff3366]/30 rounded-lg -z-10" />
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
      title: "E-Commerce Platform",
      category: "Full Stack Development",
      description: "A modern e-commerce experience with 3D product visualization and seamless checkout flow.",
      tech: ["Next.js", "Three.js", "Stripe"],
      color: "#00ff88",
      image: "🛒",
    },
    {
      title: "Portfolio Studio",
      category: "Creative Development",
      description: "An immersive portfolio builder with drag-and-drop functionality and real-time previews.",
      tech: ["React", "Framer Motion", "Firebase"],
      color: "#ff3366",
      image: "🎨",
    },
    {
      title: "AI Dashboard",
      category: "Data Visualization",
      description: "Real-time analytics dashboard with AI-powered insights and interactive charts.",
      tech: ["TypeScript", "D3.js", "OpenAI"],
      color: "#00c3ff",
      image: "📊",
    },
    {
      title: "Music Streaming App",
      category: "Mobile Development",
      description: "A beautifully designed music app with gesture controls and personalized playlists.",
      tech: ["React Native", "Node.js", "AWS"],
      color: "#ff9500",
      image: "🎵",
    },
  ];

  return (
    <section id="work" ref={ref} className="py-32 px-8 relative">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-20"
        >
          <p className="text-[#00ff88] text-sm font-mono mb-4 tracking-[0.3em] uppercase">Selected Work</p>
          <h2 className="text-4xl md:text-6xl font-bold">
            <AnimatedText>Featured Projects</AnimatedText>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, i) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.15 }}
              className="project-card group"
            >
              <div className="p-8">
                <div
                  className="aspect-video rounded-xl mb-8 flex items-center justify-center relative overflow-hidden"
                  style={{ background: `linear-gradient(135deg, ${project.color}15, ${project.color}05)` }}
                >
                  <div className="absolute inset-0 grid-pattern opacity-50" />
                  <motion.span
                    className="text-8xl relative z-10"
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {project.image}
                  </motion.span>
                </div>

                <p className="text-sm font-mono mb-3" style={{ color: project.color }}>
                  {project.category}
                </p>
                <h3 className="text-2xl font-bold mb-4 group-hover:text-[#00ff88] transition-colors">
                  {project.title}
                </h3>
                <p className="text-[#888] mb-6 leading-relaxed">{project.description}</p>

                <div className="flex flex-wrap gap-3 mb-6">
                  {project.tech.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs px-4 py-2 bg-white/5 rounded-full text-[#888] border border-white/10"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <motion.a
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
                </motion.a>
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
      icon: "🎨",
      color: "#00ff88",
      skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Three.js"],
    },
    {
      title: "Backend",
      icon: "⚡",
      color: "#ff3366",
      skills: ["Node.js", "Express", "PostgreSQL", "MongoDB", "GraphQL", "REST APIs"],
    },
    {
      title: "Tools & Design",
      icon: "🛠️",
      color: "#00c3ff",
      skills: ["Figma", "Git", "Docker", "AWS", "Vercel", "Adobe Suite"],
    },
  ];

  return (
    <section id="skills" ref={ref} className="py-32 px-8 bg-[#080808] relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <motion.div
        className="absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl opacity-20"
        style={{ background: "radial-gradient(circle, #00ff88 0%, transparent 70%)" }}
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 30, 0],
          y: [0, -20, 0],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-96 h-96 rounded-full blur-3xl opacity-15"
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
          className="text-center mb-20"
        >
          <motion.p 
            className="text-[#00ff88] text-sm font-mono mb-4 tracking-[0.3em] uppercase"
            initial={{ opacity: 0, letterSpacing: "0.1em" }}
            animate={isInView ? { opacity: 1, letterSpacing: "0.3em" } : {}}
            transition={{ duration: 0.8 }}
          >
            Expertise
          </motion.p>
          <h2 className="text-4xl md:text-6xl font-bold">
            <AnimatedText>Skills & Technologies</AnimatedText>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
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
              
              <div className="relative animated-border p-8 h-full backdrop-blur-sm">
                {/* Floating icon */}
                <motion.div
                  className="text-5xl mb-6"
                  animate={{ 
                    y: [0, -8, 0],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    delay: catIndex * 0.3
                  }}
                >
                  {category.icon}
                </motion.div>

                {/* Category title with animated underline */}
                <div className="relative inline-block mb-8">
                  <h3 
                    className="text-2xl font-bold"
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
                <div className="flex flex-wrap gap-3">
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
                      className="px-4 py-2 text-sm font-medium rounded-full cursor-pointer transition-colors duration-300"
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
    { name: "GitHub", url: "#", icon: "GH" },
    { name: "LinkedIn", url: "#", icon: "LI" },
    { name: "Twitter", url: "#", icon: "TW" },
    { name: "Dribbble", url: "#", icon: "DR" },
  ];

  return (
    <section id="contact" ref={ref} className="py-32 px-8 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#00ff88]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#ff3366]/5 rounded-full blur-3xl" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
        >
          <p className="text-[#00ff88] text-sm font-mono mb-4 tracking-[0.3em] uppercase">Get In Touch</p>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8">
            <AnimatedText>Let&apos;s Work</AnimatedText>
            <br />
            <span className="gradient-text">
              <AnimatedText delay={0.2}>Together</AnimatedText>
            </span>
          </h2>
          <p className="text-lg text-[#888] max-w-xl mx-auto mb-12 leading-relaxed">
            Have a project in mind or just want to say hello? I&apos;d love to hear from you.
            Let&apos;s create something amazing together.
          </p>

          <motion.a
            href="mailto:hello@johndoe.com"
            className="inline-block text-3xl md:text-4xl font-bold text-white hover:text-[#00ff88] transition-colors line-animation pb-2"
            whileHover={{ scale: 1.02 }}
          >
            hello@johndoe.com
          </motion.a>

          <div className="flex justify-center gap-6 mt-16">
            {socialLinks.map((link, i) => (
              <motion.a
                key={link.name}
                href={link.url}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center text-sm font-bold hover:bg-[#00ff88] hover:border-[#00ff88] hover:text-black transition-all"
                whileHover={{ scale: 1.1, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                {link.icon}
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
    <footer className="py-8 px-8 border-t border-white/5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-[#888] text-sm">
          © 2026 John Doe. All rights reserved.
        </p>
        <p className="text-[#888] text-sm">
          Designed & Built with <span className="text-[#ff3366]">♥</span> and lots of ☕
        </p>
      </div>
    </footer>
  );
}

// Loading screen
function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] bg-[#050505] flex items-center justify-center"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div className="text-center">
        <motion.div
          className="text-6xl md:text-8xl font-bold gradient-text mb-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          DM.
        </motion.div>
        <motion.div
          className="h-1 bg-gradient-to-r from-[#00ff88] to-[#ff3366] rounded-full"
          initial={{ width: 0 }}
          animate={{ width: 200 }}
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
