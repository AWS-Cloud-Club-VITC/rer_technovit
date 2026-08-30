"use client";

import Link from "next/link";
import { Terminal, Shield, ArrowUpRight } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

interface NavbarProps {
  isAuthenticated?: boolean;
  teamName?: string;
  onLogout?: () => void;
}

export default function Navbar({ isAuthenticated, teamName, onLogout }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--border)] glass-header transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-lg bg-[var(--surface-secondary)] border border-[var(--border)] flex items-center justify-center group-hover:border-[var(--accent)] group-hover:bg-[var(--accent-surface)] transition-all shadow-sm">
            <Terminal className="w-5 h-5 text-[var(--accent-text)] group-hover:text-[var(--accent-hover)] transition-colors" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold tracking-wider text-sm sm:text-base text-[var(--foreground)] group-hover:text-[var(--accent-text)] transition-colors">
                RER <span className="text-[var(--accent-text)]">2026</span>
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--status-ready-dot)] animate-pulse hidden sm:inline-block" />
            </div>
            <span className="text-[10px] uppercase font-mono tracking-widest text-[var(--foreground-muted)]">
              Reverse Engineering Roulette
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[var(--foreground-muted)]">
          <Link
            href="/#about"
            className="hover:text-[var(--foreground)] transition-colors relative py-1 hover:after:w-full after:w-0 after:h-[2px] after:bg-[var(--accent)] after:absolute after:bottom-0 after:left-0 after:transition-all"
          >
            Concept
          </Link>
          <Link
            href="/#event-flow"
            className="hover:text-[var(--foreground)] transition-colors relative py-1 hover:after:w-full after:w-0 after:h-[2px] after:bg-[var(--accent)] after:absolute after:bottom-0 after:left-0 after:transition-all"
          >
            Event Flow
          </Link>
          <Link
            href="/#rounds"
            className="hover:text-[var(--foreground)] transition-colors relative py-1 hover:after:w-full after:w-0 after:h-[2px] after:bg-[var(--accent)] after:absolute after:bottom-0 after:left-0 after:transition-all"
          >
            Three Rounds
          </Link>
          <Link
            href="/#rules"
            className="hover:text-[var(--foreground)] transition-colors relative py-1 hover:after:w-full after:w-0 after:h-[2px] after:bg-[var(--accent)] after:absolute after:bottom-0 after:left-0 after:transition-all"
          >
            Rules & Scoring
          </Link>
        </nav>

        {/* Action Controls & Theme Toggle */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Theme Toggle Button */}
          <ThemeToggle />

          {isAuthenticated ? (
            <div className="flex items-center gap-2.5">
              <Link
                href="/portal"
                className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[var(--surface-secondary)] border border-[var(--border)] text-xs font-mono text-[var(--foreground)] hover:border-[var(--accent)] transition-all"
              >
                <Shield className="w-3.5 h-3.5 text-[var(--accent-text)]" />
                <span>{teamName || "Team Portal"}</span>
              </Link>
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="px-3 py-1.5 text-xs rounded-lg bg-[var(--surface-secondary)] border border-[var(--border)] text-[var(--foreground-muted)] hover:text-[var(--status-error-text)] hover:border-[var(--status-error-border)] transition-colors"
                >
                  Logout
                </button>
              )}
            </div>
          ) : (
            <Link
              href="/portal"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-semibold text-xs sm:text-sm tracking-wide transition-all shadow-md hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>ENTER PORTAL</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
