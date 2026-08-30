"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import TeamAuth from "@/components/TeamAuth";
import TeamDashboard from "@/components/TeamDashboard";
import Footer from "@/components/Footer";
import type { TeamMember } from "@/lib/mongodb";
import { Loader2 } from "lucide-react";

interface AuthenticatedTeam {
  teamId: string;
  teamName: string;
  members: TeamMember[];
  createdAt?: string;
}

export default function PortalPage() {
  const [team, setTeam] = useState<AuthenticatedTeam | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadAuth() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (isMounted) {
          if (res.ok && data.success && data.authenticated && data.team) {
            setTeam(data.team);
          } else {
            setTeam(null);
          }
        }
      } catch {
        if (isMounted) setTeam(null);
      } finally {
        if (isMounted) setIsCheckingAuth(false);
      }
    }

    loadAuth();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // Ignore
    } finally {
      setTeam(null);
    }
  };

  const handleAuthSuccess = (authenticatedTeam: {
    teamId: string;
    teamName: string;
    members: TeamMember[];
  }) => {
    setTeam(authenticatedTeam);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar
        isAuthenticated={Boolean(team)}
        teamName={team?.teamName}
        onLogout={handleLogout}
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {isCheckingAuth ? (
          <div className="py-24 flex flex-col items-center justify-center gap-4 text-center">
            <Loader2 className="w-8 h-8 text-[#A855F7] animate-spin" />
            <div className="text-xs font-mono text-[#A7AFBC]">
              Verifying team session credentials...
            </div>
          </div>
        ) : team ? (
          <TeamDashboard team={team} onLogout={handleLogout} />
        ) : (
          <div className="py-4 sm:py-8">
            <TeamAuth onAuthSuccess={handleAuthSuccess} />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
