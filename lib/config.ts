export const EVENT_CONFIG = {
  name: "Reverse Engineering Roulette",
  tagline: "See it. Remember it. Reverse it.",
  date: "31 August 2026",
  venue: "AB3 713",
  flow: ["Observe", "Explore", "Remember", "Reconstruct", "Evaluate"],
  rounds: [
    {
      number: 1,
      name: "Visual Recall",
      description:
        "Observe the target interface closely, retain key visual hierarchy and layout elements, and reconstruct the aesthetic structure accurately.",
      focus: "Observation & UI/UX Structure",
    },
    {
      number: 2,
      name: "Functionality Hunt",
      description:
        "Inspect interactive behaviors, state transitions, and responsive mechanics to engineer functional parity with precision.",
      focus: "Logic, Mechanics & Interactions",
    },
  ],
} as const;

export const APP_CONFIG = {
  minTeamMembers: 1,
  maxTeamMembers: 3,
  cookieName: "rer_session_token",
  sessionExpirySeconds: 60 * 60 * 24 * 7, // 7 days
} as const;
