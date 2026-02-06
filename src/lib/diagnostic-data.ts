export interface Question {
  id: number;
  text: string;
}

export interface Dimension {
  id: string;
  name: string;
  subtitle: string;
  questions: Question[];
  threshold: number; // score at or below this = show reflection
  reflection: string;
  reflectionPrompt: string;
}

export type Status = "green" | "amber" | "red";

export interface DimensionResult {
  dimension: Dimension;
  score: number;
  maxScore: number;
  status: Status;
  percentage: number;
}

export interface PatternInterpretation {
  id: string;
  label: string;
  description: string;
  condition: (results: DimensionResult[]) => boolean;
}

export const DIMENSIONS: Dimension[] = [
  {
    id: "problem-economics",
    name: "Problem Economics",
    subtitle:
      "Is this problem worth solving — for the client, not for you?",
    questions: [
      {
        id: 1,
        text: "I can state the client's financial cost of this problem in concrete numbers — not estimates, not assumptions.",
      },
      {
        id: 2,
        text: "The client has independently confirmed this problem is worth solving. Not because I told them. Because they feel it.",
      },
      {
        id: 3,
        text: "Someone at the client has committed internal resources — people, time, or budget — to address this problem. Not \"expressed interest.\" Committed.",
      },
    ],
    threshold: 1,
    reflection:
      "You may be solving a problem the client finds interesting but not urgent. The most common POC failure mode: the technology works, but the client's internal cost of change exceeds their pain.",
    reflectionPrompt:
      "Ask yourself: If I removed my solution tomorrow, what would the client actually lose?",
  },
  {
    id: "stakeholder-alignment",
    name: "Stakeholder Alignment",
    subtitle:
      "Have you mapped the people who matter — and the ones who don't want this to succeed?",
    questions: [
      {
        id: 4,
        text: "I can name the person who feels this problem daily — by name and title.",
      },
      {
        id: 5,
        text: "I can name the person who will decide whether the solution works — by name and title.",
      },
      {
        id: 6,
        text: "I can name the person who will sign the contract — by name and title.",
      },
      {
        id: 7,
        text: "I have identified anyone who benefits from this problem remaining unsolved.",
      },
    ],
    threshold: 2,
    reflection:
      "You're likely engaging with the wrong people. Complex organisations distribute pain, evaluation authority, and purchasing power across different roles — and the person championing your POC may control none of these.",
    reflectionPrompt:
      "If you can't name all three, your POC is a technical demonstration, not a commercial validation.",
  },
  {
    id: "governance-readiness",
    name: "Governance Readiness",
    subtitle:
      "Does this POC have structural support inside the client organisation?",
    questions: [
      {
        id: 8,
        text: "An executive sponsor is actively engaged in this project — not just aware of it.",
      },
      {
        id: 9,
        text: "A business owner from the affected unit (not IT, not innovation) is championing this.",
      },
      {
        id: 10,
        text: "The client has assigned someone with dedicated, protected time to work on this engagement.",
      },
      {
        id: 11,
        text: "I have access to the domain experts needed to validate the solution's outputs.",
      },
    ],
    threshold: 2,
    reflection:
      "Your POC has no structural support. Without an active sponsor, a business champion, and dedicated resources, even successful pilots stall. This is the most common invisible killer of enterprise POCs.",
    reflectionPrompt:
      "Miss two or more of these roles? Seriously reconsider whether this engagement is worth your time — or address the gaps before you start.",
  },
  {
    id: "commercial-conversion",
    name: "Commercial Conversion",
    subtitle:
      "Will this pilot actually become a contract — or just a good story?",
    questions: [
      {
        id: 12,
        text: "I can state a simple ROI — three metrics or fewer — that the client has agreed to.",
      },
      {
        id: 13,
        text: "I know which specific budget line will fund the full solution after the POC.",
      },
      {
        id: 14,
        text: "I have directly engaged the people who will sign the contract — not just the people who use the product.",
      },
      {
        id: 15,
        text: "The client and I have agreed on explicit go/no-go criteria for moving from pilot to contract.",
      },
    ],
    threshold: 2,
    reflection:
      'You\'re at risk of the "successful pilot that goes nowhere." Users love it. Buyers haven\'t been engaged. ROI hasn\'t been agreed. There are no explicit criteria for what triggers a contract. This is where most POCs die.',
    reflectionPrompt:
      "The people who use your product are not the people who sign your contract. Have you engaged both?",
  },
  {
    id: "delivery-viability",
    name: "Delivery Viability",
    subtitle:
      "Can you actually deliver what you're promising — within the constraints you've agreed to?",
    questions: [
      {
        id: 16,
        text: "There is a clear scope boundary — what is in and what is explicitly out.",
      },
      {
        id: 17,
        text: "All technical integration requirements and compliance gates have been identified.",
      },
      {
        id: 18,
        text: "I can deliver the core value proposition with my current team within the agreed timeline.",
      },
    ],
    threshold: 1,
    reflection:
      "Scope creep or capacity constraints will undermine your POC's credibility. If you can't deliver within agreed boundaries, the client's confidence erodes — regardless of how promising the technology.",
    reflectionPrompt:
      "What have you explicitly excluded from this POC? If you can't answer immediately, scope is already creeping.",
  },
];

export const PATTERN_INTERPRETATIONS: PatternInterpretation[] = [
  {
    id: "strong-problem-weak-rest",
    label: "Strong Problem Economics, weak everywhere else",
    description:
      "You've validated the problem but haven't built the structure to convert. Common for technical founders who lead with product capability. The gap is commercial and organisational, not technical.",
    condition: (results) => {
      const pe = results.find((r) => r.dimension.id === "problem-economics");
      const others = results.filter(
        (r) => r.dimension.id !== "problem-economics"
      );
      return (
        pe !== undefined &&
        pe.status === "green" &&
        others.filter((r) => r.status === "red").length >= 2
      );
    },
  },
  {
    id: "strong-governance-weak-commercial",
    label: "Strong Governance, weak Commercial Conversion",
    description:
      "Structural support exists but no commercial viability proof. The sponsor and team are engaged, but there's no agreed ROI, no identified budget, no go/no-go criteria. The structure exists. The commercial logic doesn't.",
    condition: (results) => {
      const gov = results.find(
        (r) => r.dimension.id === "governance-readiness"
      );
      const com = results.find(
        (r) => r.dimension.id === "commercial-conversion"
      );
      return (
        gov !== undefined &&
        com !== undefined &&
        gov.status === "green" &&
        com.status === "red"
      );
    },
  },
  {
    id: "strong-overall-weak-stakeholder",
    label: "Strong across the board, weak Stakeholder Alignment",
    description:
      "Well-positioned but vulnerable to a single point of failure. If your champion leaves, gets reorganised, or loses influence, your POC loses its internal advocacy.",
    condition: (results) => {
      const sa = results.find(
        (r) => r.dimension.id === "stakeholder-alignment"
      );
      const others = results.filter(
        (r) => r.dimension.id !== "stakeholder-alignment"
      );
      return (
        sa !== undefined &&
        sa.status === "red" &&
        others.every((r) => r.status === "green")
      );
    },
  },
  {
    id: "weak-problem-strong-rest",
    label: "Weak Problem Economics, strong everything else",
    description:
      "Everything in place except evidence the problem is worth solving. The Diagnostic Trap: you may be about to reveal a truth the client can't act on.",
    condition: (results) => {
      const pe = results.find((r) => r.dimension.id === "problem-economics");
      const others = results.filter(
        (r) => r.dimension.id !== "problem-economics"
      );
      return (
        pe !== undefined &&
        pe.status === "red" &&
        others.filter((r) => r.status === "green").length >= 3
      );
    },
  },
  {
    id: "universally-low",
    label: "Universally low",
    description:
      "High risk across multiple dimensions. This isn't a coaching problem — it's a qualification problem. Consider whether this engagement is worth pursuing in its current form.",
    condition: (results) => {
      const totalScore = results.reduce((sum, r) => sum + r.score, 0);
      return totalScore <= 8;
    },
  },
];

export const COI_COPY = {
  heading: "The Cost of Ignoring",
  intro:
    "Most founders calculate the return on their investment. Few calculate the COI — the Cost of Ignoring — what each unaddressed gap is quietly costing them.",
  body: 'Every "no" in this diagnostic is a compounding risk: one that gets more expensive the longer it goes unaddressed.',
};

export const CTA_COPY = {
  heading: "What This Diagnostic Doesn't Tell You",
  body: `This tool reveals where your POC is at risk. It doesn't tell you how to address those risks — because the answer depends on your specific context, your client, and where you are in the lifecycle.

Each stage of the POC journey requires a different capability. Technical proof. Commercial proof. Operational proof. Founders who are good at one stage are often stuck at the next — because it requires a completely different muscle.`,
  callout:
    "If your profile shows two or more dimensions in the red zone, a structured conversation can help you decide what to prioritise and what to walk away from.",
  contact: {
    name: "Alexandra N.",
    title: "Founder, Aieutics",
    subtitle: "Executive coaching & strategic transformation",
    website: "aieutics.com",
    email: "hello@aieutics.com",
  },
};

export const ATTRIBUTION =
  "Developed by Aieutics from patterns observed across executive coaching, corporate accelerator programmes, and consulting engagements.";
