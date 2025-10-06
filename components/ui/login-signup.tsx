"use client";

import * as React from "react";
import { useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface AuthScreenProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  headerAction?: React.ReactNode;
}

export function AuthScreen({
  title,
  description,
  children,
  footer,
  headerAction,
}: AuthScreenProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const setSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    type Particle = { x: number; y: number; velocity: number; opacity: number };
    let particles: Particle[] = [];
    let animationFrame = 0;

    const createParticle = (): Particle => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      velocity: Math.random() * 0.25 + 0.05,
      opacity: Math.random() * 0.35 + 0.15,
    });

    const initParticles = () => {
      particles = [];
      const count = Math.floor((canvas.width * canvas.height) / 9000);
      for (let index = 0; index < count; index++) {
        particles.push(createParticle());
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((particle) => {
        particle.y -= particle.velocity;
        if (particle.y < 0) {
          particle.x = Math.random() * canvas.width;
          particle.y = canvas.height + Math.random() * 40;
          particle.velocity = Math.random() * 0.25 + 0.05;
          particle.opacity = Math.random() * 0.35 + 0.15;
        }
        ctx.fillStyle = `rgba(250,250,250,${particle.opacity})`;
        ctx.fillRect(particle.x, particle.y, 0.7, 2.2);
      });
      animationFrame = requestAnimationFrame(draw);
    };

    const handleResize = () => {
      setSize();
      initParticles();
    };

    setSize();
    initParticles();
    draw();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden bg-zinc-950 text-zinc-50">
      <style>{`
        .accent-lines{position:absolute;inset:0;pointer-events:none;opacity:.7}
        .hline,.vline{position:absolute;background:#27272a;will-change:transform,opacity}
        .hline{left:0;right:0;height:1px;transform:scaleX(0);transform-origin:50% 50%;animation:drawX .8s cubic-bezier(.22,.61,.36,1) forwards}
        .vline{top:0;bottom:0;width:1px;transform:scaleY(0);transform-origin:50% 0%;animation:drawY .9s cubic-bezier(.22,.61,.36,1) forwards}
        .hline:nth-child(1){top:18%;animation-delay:.12s}
        .hline:nth-child(2){top:50%;animation-delay:.22s}
        .hline:nth-child(3){top:82%;animation-delay:.32s}
        .vline:nth-child(4){left:22%;animation-delay:.42s}
        .vline:nth-child(5){left:50%;animation-delay:.54s}
        .vline:nth-child(6){left:78%;animation-delay:.66s}
        .hline::after,.vline::after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgba(250,250,250,.24),transparent);opacity:0;animation:shimmer .9s ease-out forwards}
        .hline:nth-child(1)::after{animation-delay:.12s}
        .hline:nth-child(2)::after{animation-delay:.22s}
        .hline:nth-child(3)::after{animation-delay:.32s}
        .vline:nth-child(4)::after{animation-delay:.42s}
        .vline:nth-child(5)::after{animation-delay:.54s}
        .vline:nth-child(6)::after{animation-delay:.66s}
        @keyframes drawX{0%{transform:scaleX(0);opacity:0}60%{opacity:.95}100%{transform:scaleX(1);opacity:.7}}
        @keyframes drawY{0%{transform:scaleY(0);opacity:0}60%{opacity:.95}100%{transform:scaleY(1);opacity:.7}}
        @keyframes shimmer{0%{opacity:0}35%{opacity:.25}100%{opacity:0}}
        .card-animate{opacity:0;transform:translateY(12px);animation:fadeUp .7s ease forwards .35s}
        @keyframes fadeUp{to{opacity:1;transform:translateY(0)}}
      `}</style>

      <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 h-full w-full opacity-40" />

      <div className="accent-lines">
        <span className="hline" />
        <span className="hline" />
        <span className="hline" />
        <span className="vline" />
        <span className="vline" />
        <span className="vline" />
      </div>

      <header className="absolute inset-x-0 top-0 flex items-center justify-between border-b border-zinc-800/80 px-6 py-4">
        <span className="text-xs uppercase tracking-[0.14em] text-zinc-500">
          Worker Tracker
        </span>
        {headerAction ? (
          headerAction
        ) : (
          <Button
            asChild
            variant="outline"
            className="h-9 rounded-lg border-zinc-800 bg-zinc-900 text-zinc-100 hover:bg-zinc-900/80"
          >
            <a href="mailto:support@workertracker.app">
              <span className="sr-only">Contact support</span>
              Support
            </a>
          </Button>
        )}
      </header>

      <div className="grid h-full w-full place-items-center px-4 py-24">
        <Card className="card-animate relative w-full max-w-md border-zinc-800 bg-zinc-900/70 backdrop-blur supports-[backdrop-filter]:bg-zinc-900/60">
          <div className="space-y-1 px-6 pt-6">
            <h1 className="text-2xl font-semibold text-zinc-50">{title}</h1>
            {description ? (
              <p className="text-sm text-zinc-400">{description}</p>
            ) : null}
          </div>
          <div className="px-6 py-6">{children}</div>
          {footer ? (
            <div className="border-t border-zinc-800/70 px-6 py-4 text-sm text-zinc-400">
              {footer}
            </div>
          ) : null}
        </Card>
      </div>
    </section>
  );
}

export default AuthScreen;
