"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Lightbulb, Mic, Globe, Paperclip, Send } from "lucide-react";
import clsx from "clsx";

const PLACEHOLDERS = [
  "Ask the assistant about today\'s variance…",
  "Summarise Luis\' support queue for me",
  "Where are we over capacity this week?",
  "Draft an update for the Northwind rollout",
  "How many follow-ups are still pending?",
];

interface AIChatInputProps {
  onSubmit?: (value: string, opts: { think: boolean; deepSearch: boolean }) => void;
}

export function AIChatInput({ onSubmit }: AIChatInputProps) {
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [cycleVisible, setCycleVisible] = useState(true);
  const [isActive, setIsActive] = useState(false);
  const [thinkActive, setThinkActive] = useState(false);
  const [deepSearchActive, setDeepSearchActive] = useState(false);
  const [value, setValue] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isActive || value) return;

    const interval = window.setInterval(() => {
      setCycleVisible(false);
      window.setTimeout(() => {
        setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDERS.length);
        setCycleVisible(true);
      }, 220);
    }, 3200);

    return () => window.clearInterval(interval);
  }, [isActive, value]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(event.target as Node) && !value) {
        setIsActive(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [value]);

  const placeholder = useMemo(() => PLACEHOLDERS[placeholderIndex], [placeholderIndex]);

  const handleSubmit = () => {
    if (!value.trim()) return;
    onSubmit?.(value.trim(), {
      think: thinkActive,
      deepSearch: deepSearchActive,
    });
    setValue("");
    setThinkActive(false);
    setDeepSearchActive(false);
  };

  const containerHeight = isActive || value ? 168 : 110;

  return (
    <div className="relative w-full max-w-3xl">
      <div
        ref={wrapperRef}
        className={clsx(
          "group relative flex w-full flex-col gap-3 rounded-[28px] border border-white/50 bg-white/80 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.12)] transition-all duration-300 backdrop-blur-xl dark:border-slate-700/60 dark:bg-slate-900/70",
          isActive || value ? "shadow-[0_22px_60px_rgba(15,23,42,0.16)]" : "shadow-[0_12px_32px_rgba(15,23,42,0.08)]"
        )}
        style={{ height: containerHeight }}
        onClick={() => setIsActive(true)}
      >
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-slate-900/10 text-slate-600 dark:bg-slate-800/80 dark:text-slate-200">
            <Lightbulb className={clsx("transition", thinkActive ? "text-blue-600" : "")} size={18} />
          </div>
          <div className="flex-1">
            <div className="relative">
              <input
                value={value}
                onChange={(event) => setValue(event.target.value)}
                placeholder=""
                className="w-full border-none bg-transparent text-base text-slate-800 outline-none placeholder:text-slate-400 dark:text-slate-100"
              />
              {!value && (
                <span
                  className={clsx(
                    "pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 text-base text-slate-400 transition-opacity duration-200",
                    cycleVisible ? "opacity-100" : "opacity-0"
                  )}
                >
                  {placeholder}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              title="Attach"
              className="flex size-9 items-center justify-center rounded-xl border border-white/60 bg-white/80 text-slate-500 transition hover:bg-white dark:border-slate-700/60 dark:bg-slate-800/70 dark:text-slate-200"
            >
              <Paperclip size={18} />
            </button>
            <button
              type="button"
              title="Microphone"
              className="flex size-9 items-center justify-center rounded-xl border border-white/60 bg-white/80 text-slate-500 transition hover:bg-white dark:border-slate-700/60 dark:bg-slate-800/70 dark:text-slate-200"
            >
              <Mic size={18} />
            </button>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                handleSubmit();
              }}
              className="flex size-10 items-center justify-center rounded-xl bg-slate-900 text-white shadow-lg transition hover:bg-slate-800 dark:bg-white dark:text-slate-900"
            >
              <Send size={18} />
            </button>
          </div>
        </div>

        <div
          className={clsx(
            "flex items-center gap-3 overflow-hidden transition-all duration-300",
            isActive || value ? "max-h-16 opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              setThinkActive((prev) => !prev);
            }}
            className={clsx(
              "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition",
              thinkActive
                ? "bg-blue-600/10 text-blue-600 outline outline-1 outline-blue-500/40"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800/70 dark:text-slate-200 dark:hover:bg-slate-800"
            )}
          >
            <Lightbulb size={18} />
            Think
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              setDeepSearchActive((prev) => !prev);
            }}
            className={clsx(
              "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition",
              deepSearchActive
                ? "bg-blue-600/10 text-blue-600 outline outline-1 outline-blue-500/40"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800/70 dark:text-slate-200 dark:hover:bg-slate-800"
            )}
          >
            <Globe size={18} />
            Deep search
          </button>
        </div>
      </div>
    </div>
  );
}

export default AIChatInput;
