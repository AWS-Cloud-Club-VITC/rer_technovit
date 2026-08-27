import { Users, User, ShieldCheck, Lock } from "lucide-react";
import type { TeamMember } from "@/lib/mongodb";

interface MemberListProps {
  members: TeamMember[];
}

export default function MemberList({ members }: MemberListProps) {
  return (
    <div className="cyber-card rounded-xl p-6 sm:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#343B47]/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#151A23] border border-[#343B47] flex items-center justify-center">
            <Users className="w-5 h-5 text-[#A855F7]" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#F5F5F5]">Registered Team Members</h3>
            <p className="text-xs text-[#A7AFBC]">
              Official roster locked at registration ({members.length} {members.length === 1 ? "member" : "members"})
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#151A23] border border-[#343B47] text-xs font-mono text-[#A7AFBC] self-start sm:self-auto">
          <Lock className="w-3.5 h-3.5 text-[#A855F7]" />
          <span>READ-ONLY ROSTER</span>
        </div>
      </div>

      {/* Members Grid */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {members.map((member, index) => (
          <div
            key={index}
            className="p-4 rounded-lg bg-[#151A23]/90 border border-[#343B47] flex items-center justify-between group hover:border-[#A855F7]/40 transition-colors"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-full bg-[#1C222C] border border-[#343B47] flex items-center justify-center group-hover:border-[#A855F7] transition-colors">
                <User className="w-4 h-4 text-[#A855F7]" />
              </div>
              <div>
                <div className="text-xs font-mono text-[#A855F7]">MEMBER 0{index + 1}</div>
                <div className="text-sm font-bold text-[#F5F5F5]">{member.name}</div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-1">
              <span className="px-2.5 py-1 rounded bg-[#1C222C] border border-[#343B47] text-xs font-mono font-semibold text-[#B45CFF]">
                {member.regNo}
              </span>
              <div className="flex items-center gap-1 text-[10px] font-mono text-[#22C55E]">
                <ShieldCheck className="w-3 h-3" />
                <span>Verified</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Advisory Banner */}
      <div className="mt-6 p-3 rounded-lg bg-[#151A23]/50 border border-[#343B47]/50 flex items-center gap-2 text-xs font-mono text-[#A7AFBC]">
        <Lock className="w-3.5 h-3.5 text-[#A7AFBC] shrink-0" />
        <span>
          Member profiles are locked for the duration of the event. Returning teams submit new project revisions below.
        </span>
      </div>
    </div>
  );
}
