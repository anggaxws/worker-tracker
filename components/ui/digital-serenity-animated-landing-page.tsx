"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Timer } from "lucide-react";

import { AuthButtons } from "@/components/auth-buttons";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

interface Ripple {
  id: number;
  x: number;
  y: number;
}

export function DigitalSerenityLanding() {
  const [mouseGradientStyle, setMouseGradientStyle] = useState({
    left: "0px",
    top: "0px",
    opacity: 0,
  });
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [scrolled, setScrolled] = useState(false);
  const floatingElementsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const animateWords = () => {
      const wordElements = document.querySelectorAll<HTMLElement>(".word-animate");
      wordElements.forEach((word) => {
        const delay = parseInt(word.getAttribute("data-delay") ?? "0", 10) || 0;
        window.setTimeout(() => {
          word.style.animation = "word-appear 0.8s ease-out forwards";
        }, delay);
      });
    };

    const timeoutId = window.setTimeout(animateWords, 500);
    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMouseGradientStyle({
        left: `${event.clientX}px`,
        top: `${event.clientY}px`,
        opacity: 1,
      });
    };
    const handleMouseLeave = () => {
      setMouseGradientStyle((prev) => ({ ...prev, opacity: 0 }));
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const newRipple: Ripple = { id: Date.now(), x: event.clientX, y: event.clientY };
      setRipples((prev) => [...prev, newRipple]);
      window.setTimeout(
        () => setRipples((prev) => prev.filter((ripple) => ripple.id !== newRipple.id)),
        1000,
      );
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  useEffect(() => {
    const wordElements = document.querySelectorAll<HTMLElement>(".word-animate");
    const handleMouseEnter = (event: Event) => {
      const target = event.target as HTMLElement | null;
      if (target) target.style.textShadow = "0 0 20px rgba(203, 213, 225, 0.5)";
    };
    const handleMouseLeave = (event: Event) => {
      const target = event.target as HTMLElement | null;
      if (target) target.style.textShadow = "none";
    };

    wordElements.forEach((word) => {
      word.addEventListener("mouseenter", handleMouseEnter);
      word.addEventListener("mouseleave", handleMouseLeave);
    });

    return () => {
      wordElements.forEach((word) => {
        word.removeEventListener("mouseenter", handleMouseEnter);
        word.removeEventListener("mouseleave", handleMouseLeave);
      });
    };
  }, []);

  useEffect(() => {
    const floatingElements = document.querySelectorAll<HTMLDivElement>(".floating-element-animate");
    floatingElementsRef.current = Array.from(floatingElements);

    const handleScroll = () => {
      if (!scrolled) {
        setScrolled(true);
        floatingElementsRef.current.forEach((element, index) => {
          const delay = parseFloat(element.style.animationDelay || "0") * 1000;
          window.setTimeout(() => {
            element.style.animationPlayState = "running";
            element.style.opacity = "";
          }, delay + index * 100);
        });
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

  const pageStyles = useMemo(
    () => `
    #mouse-gradient-react {
      position: fixed;
      pointer-events: none;
      border-radius: 9999px;
      background-image: radial-gradient(circle, rgba(156, 163, 175, 0.05), rgba(107, 114, 128, 0.05), transparent 70%);
      transform: translate(-50%, -50%);
      will-change: left, top, opacity;
      transition: left 70ms linear, top 70ms linear, opacity 300ms ease-out;
    }
    @keyframes word-appear { 0% { opacity: 0; transform: translateY(30px) scale(0.8); filter: blur(10px); } 50% { opacity: 0.8; transform: translateY(10px) scale(0.95); filter: blur(2px); } 100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); } }
    @keyframes grid-draw { 0% { stroke-dashoffset: 1000; opacity: 0; } 50% { opacity: 0.3; } 100% { stroke-dashoffset: 0; opacity: 0.15; } }
    @keyframes pulse-glow { 0%, 100% { opacity: 0.1; transform: scale(1); } 50% { opacity: 0.3; transform: scale(1.1); } }
    .word-animate { display: inline-block; opacity: 0; margin: 0 0.1em; transition: color 0.3s ease, transform 0.3s ease; }
    .word-animate:hover { color: #cbd5e1; transform: translateY(-2px); }
    .grid-line { stroke: #94a3b8; stroke-width: 0.5; opacity: 0; stroke-dasharray: 5 5; stroke-dashoffset: 1000; animation: grid-draw 2s ease-out forwards; }
    .detail-dot { fill: #cbd5e1; opacity: 0; animation: pulse-glow 3s ease-in-out infinite; }
    .corner-element-animate { position: absolute; width: 40px; height: 40px; border: 1px solid rgba(203, 213, 225, 0.2); opacity: 0; animation: word-appear 1s ease-out forwards; }
    .text-decoration-animate { position: relative; }
    .text-decoration-animate::after { content: ''; position: absolute; bottom: -4px; left: 0; width: 0; height: 1px; background: linear-gradient(90deg, transparent, #cbd5e1, transparent); animation: underline-grow 2s ease-out forwards; animation-delay: 2s; }
    @keyframes underline-grow { to { width: 100%; } }
    .floating-element-animate { position: absolute; width: 2px; height: 2px; background: #cbd5e1; border-radius: 50%; opacity: 0; animation: float 4s ease-in-out infinite; animation-play-state: paused; }
    @keyframes float { 0%, 100% { transform: translateY(0) translateX(0); opacity: 0.2; } 25% { transform: translateY(-10px) translateX(5px); opacity: 0.6; } 50% { transform: translateY(-5px) translateX(-3px); opacity: 0.4; } 75% { transform: translateY(-15px) translateX(7px); opacity: 0.8; } }
    .ripple-effect { position: fixed; width: 4px; height: 4px; background: rgba(203, 213, 225, 0.6); border-radius: 50%; transform: translate(-50%, -50%); pointer-events: none; animation: pulse-glow 1s ease-out forwards; z-index: 9999; }
  `,
    [],
  );

  return (
    <>
      <style>{pageStyles}</style>
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-slate-100">
        <header className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-center justify-between px-6 py-6 sm:px-10">
          <div className="pointer-events-auto">
            <Link href="/" className="flex items-center gap-3 text-sm font-semibold tracking-wide text-slate-200">
              <span className="inline-flex size-8 items-center justify-center rounded-full bg-slate-800/80 shadow-lg shadow-slate-950/40 ring-1 ring-slate-700/60">
                <Timer className="size-4" />
              </span>
              Worker Tracker
            </Link>
          </div>
          <div className="pointer-events-auto flex items-center gap-3">
            <ThemeToggle />
            <AuthButtons />
          </div>
        </header>

        <svg className="pointer-events-none absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <defs>
            <pattern id="gridReactDarkResponsive" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(100, 116, 139, 0.1)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#gridReactDarkResponsive)" />
          <line x1="0" y1="20%" x2="100%" y2="20%" className="grid-line" style={{ animationDelay: "0.5s" }} />
          <line x1="0" y1="80%" x2="100%" y2="80%" className="grid-line" style={{ animationDelay: "1s" }} />
          <line x1="20%" y1="0" x2="20%" y2="100%" className="grid-line" style={{ animationDelay: "1.5s" }} />
          <line x1="80%" y1="0" x2="80%" y2="100%" className="grid-line" style={{ animationDelay: "2s" }} />
          <line x1="50%" y1="0" x2="50%" y2="100%" className="grid-line" style={{ animationDelay: "2.5s", opacity: "0.05" }} />
          <line x1="0" y1="50%" x2="100%" y2="50%" className="grid-line" style={{ animationDelay: "3s", opacity: "0.05" }} />
          <circle cx="20%" cy="20%" r="2" className="detail-dot" style={{ animationDelay: "3s" }} />
          <circle cx="80%" cy="20%" r="2" className="detail-dot" style={{ animationDelay: "3.2s" }} />
          <circle cx="20%" cy="80%" r="2" className="detail-dot" style={{ animationDelay: "3.4s" }} />
          <circle cx="80%" cy="80%" r="2" className="detail-dot" style={{ animationDelay: "3.6s" }} />
          <circle cx="50%" cy="50%" r="1.5" className="detail-dot" style={{ animationDelay: "4s" }} />
        </svg>

        <div className="corner-element-animate top-4 left-4 sm:top-6 sm:left-6 md:top-10 md:left-10" style={{ animationDelay: "4s" }}>
          <div className="absolute top-0 left-0 size-2 rounded-full bg-slate-300 opacity-30"></div>
        </div>
        <div className="corner-element-animate top-4 right-4 sm:top-6 sm:right-6 md:top-10 md:right-10" style={{ animationDelay: "4.2s" }}>
          <div className="absolute top-0 right-0 size-2 rounded-full bg-slate-300 opacity-30"></div>
        </div>
        <div className="corner-element-animate bottom-4 left-4 sm:bottom-6 sm:left-6 md:bottom-10 md:left-10" style={{ animationDelay: "4.4s" }}>
          <div className="absolute bottom-0 left-0 size-2 rounded-full bg-slate-300 opacity-30"></div>
        </div>
        <div className="corner-element-animate bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-10 md:right-10" style={{ animationDelay: "4.6s" }}>
          <div className="absolute bottom-0 right-0 size-2 rounded-full bg-slate-300 opacity-30"></div>
        </div>

        <div className="floating-element-animate" style={{ top: "25%", left: "15%", animationDelay: "0.5s" }} />
        <div className="floating-element-animate" style={{ top: "60%", left: "85%", animationDelay: "1s" }} />
        <div className="floating-element-animate" style={{ top: "40%", left: "10%", animationDelay: "1.5s" }} />
        <div className="floating-element-animate" style={{ top: "75%", left: "90%", animationDelay: "2s" }} />

        <main className="relative z-10 flex min-h-screen flex-col items-center justify-between px-6 py-10 sm:px-10 sm:py-16 md:px-16 md:py-24">
          <div className="text-center">
            <h2 className="text-xs font-mono font-light uppercase tracking-[0.2em] text-slate-300 opacity-80 sm:text-sm">
              <span className="word-animate" data-delay="0">
                Calm
              </span>
              <span className="word-animate" data-delay="300">
                clarity
              </span>
              <span className="word-animate" data-delay="550">
                for
              </span>
              <span className="word-animate" data-delay="800">
                busy
              </span>
              <span className="word-animate" data-delay="1050">
                teams.
              </span>
            </h2>
            <div className="mx-auto mt-4 h-px w-12 bg-gradient-to-r from-transparent via-slate-300 to-transparent opacity-30 sm:w-16"></div>
          </div>

          <div className="relative mx-auto max-w-5xl text-center">
            <h1 className="text-3xl font-extralight leading-tight tracking-tight text-slate-50 text-decoration-animate sm:text-4xl md:text-5xl lg:text-6xl">
              <div className="mb-6 sm:mb-8">
                <span className="word-animate" data-delay="700">
                  Track
                </span>
                <span className="word-animate" data-delay="900">
                  work
                </span>
                <span className="word-animate" data-delay="1100">
                  without
                </span>
                <span className="word-animate" data-delay="1300">
                  the
                </span>
                <span className="word-animate" data-delay="1500">
                  chaos.
                </span>
              </div>
              <div className="text-xl font-thin leading-relaxed tracking-wide text-slate-300 sm:text-2xl md:text-3xl lg:text-4xl">
                <span className="word-animate" data-delay="1700">
                  Worker
                </span>
                <span className="word-animate" data-delay="1900">
                  Tracker
                </span>
                <span className="word-animate" data-delay="2100">
                  unifies
                </span>
                <span className="word-animate" data-delay="2300">
                  time
                </span>
                <span className="word-animate" data-delay="2500">
                  logs,
                </span>
                <span className="word-animate" data-delay="2700">
                  tasks,
                </span>
                <span className="word-animate" data-delay="2900">
                  and
                </span>
                <span className="word-animate" data-delay="3100">
                  AI
                </span>
                <span className="word-animate" data-delay="3300">
                  insight
                </span>
                <span className="word-animate" data-delay="3500">
                  in
                </span>
                <span className="word-animate" data-delay="3700">
                  one
                </span>
                <span className="word-animate" data-delay="3900">
                  serene
                </span>
                <span className="word-animate" data-delay="4100">
                  hub.
                </span>
              </div>
            </h1>
            <div
              className="absolute -left-6 top-1/2 h-px w-3 transform -translate-y-1/2 bg-slate-300 opacity-0 sm:-left-8 sm:w-4"
              style={{ animation: "word-appear 1s ease-out forwards", animationDelay: "4.2s" }}
            />
            <div
              className="absolute -right-6 top-1/2 h-px w-3 transform -translate-y-1/2 bg-slate-300 opacity-0 sm:-right-8 sm:w-4"
              style={{ animation: "word-appear 1s ease-out forwards", animationDelay: "4.4s" }}
            />
          </div>

          <div className="flex flex-col items-center gap-6 text-center">
            <div className="mx-auto h-px w-12 bg-gradient-to-r from-transparent via-slate-300 to-transparent opacity-30 sm:w-16" />
            <h2 className="text-xs font-mono font-light uppercase tracking-[0.2em] text-slate-300 opacity-80 sm:text-sm">
              <span className="word-animate" data-delay="4300">
                Align.
              </span>
              <span className="word-animate" data-delay="4500">
                Focus.
              </span>
              <span className="word-animate" data-delay="4700">
                Deliver.
              </span>
            </h2>
            <div className="flex flex-col items-center gap-3 opacity-0 sm:flex-row" style={{ animation: "word-appear 1s ease-out forwards", animationDelay: "5s" }}>
              <Button asChild size="lg" className="group">
                <Link href="/sign-up">
                  Start tracking
                  <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-slate-700/80 bg-slate-900/40 text-slate-200 hover:bg-slate-800/60">
                <Link href="/admin/dashboard">
                  Explore admin view
                </Link>
              </Button>
            </div>
          </div>
        </main>

        <div
          id="mouse-gradient-react"
          className="size-60 blur-xl sm:size-80 sm:blur-2xl md:size-96 md:blur-3xl"
          style={{
            left: mouseGradientStyle.left,
            top: mouseGradientStyle.top,
            opacity: mouseGradientStyle.opacity,
          }}
        />

        {ripples.map((ripple) => (
          <div key={ripple.id} className="ripple-effect" style={{ left: `${ripple.x}px`, top: `${ripple.y}px` }} />
        ))}
      </div>
    </>
  );
}

export default DigitalSerenityLanding;
