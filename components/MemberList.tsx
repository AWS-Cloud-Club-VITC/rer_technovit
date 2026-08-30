import { Users, User, ShieldCheck, Lock } from "lucide-react";
import type { TeamMember } from "@/lib/mongodb";

interface MemberListProps {
  members: TeamMember[];
}

export default function MemberList({ members }: MemberListProps) {
  return (
    <div className="cyber-card rounded-2xl p-6 sm:p-8 transition-colors duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border-subtle)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--accent-surface)] border border-[var(--accent-border)] flex items-center justify-center">
            <Users className="w-5 h-5 text-[var(--accent-text)]" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[var(--foreground)]">Registered Team Members</h3>
            <p className="text-xs text-[var(--foreground-muted)]">
              Official roster locked at registration ({members.length} {members.length === 1 ? "member" : "members"})
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--surface-secondary)] border border-[var(--border)] text-xs font-mono text-[var(--foreground-muted)] self-start sm:self-auto font-medium">
          <Lock className="w-3.5 h-3.5 text-[var(--accent-text)]" />
          <span>READ-ONLY ROSTER</span>
        </div>
      </div>

      {/* Members Grid */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {members.map((member, index) => (
          <div
            key={index}
            className="p-4 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border)] flex items-center justify-between group hover:border-[var(--accent)] transition-colors"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-full bg-[var(--surface)] border border-[var(--border)] shadow-2xs flex items-center justify-center group-hover:border-[var(--accent)] transition-colors">
                <User className="w-4 h-4 text-[var(--accent-text)]" />
              </div>
              <div>
                <div className="text-xs font-mono text-[var(--accent-text)] font-bold">MEMBER 0{index + 1}</div>
                <div className="text-sm font-bold text-[var(--foreground)]">{member.name}</div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-1">
              <span className="px-2.5 py-1 rounded-md bg-[var(--surface)] border border-[var(--border)] shadow-2xs text-xs font-mono font-semibold text-[var(--accent-text)]">
                {member.regNo}
              </span>
              <div className="flex items-center gap-1 text-[10px] font-mono text-[var(--status-ready-text)] font-medium">
                <ShieldCheck className="w-3 h-3" />
                <span>Verified</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Advisory Banner */}
      <div className="mt-6 p-3.5 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border)] flex items-center gap-2.5 text-xs font-mono text-[var(--foreground-muted)]">
        <Lock className="w-3.5 h-3.5 text-[var(--accent-text)] shrink-0" />
        <span>
          Member profiles are locked for the duration of the event. Returning teams submit new project revisions below.
        </span>
      </div>
    </div>
  );
}
