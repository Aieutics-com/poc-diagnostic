"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="px-6 py-6 md:px-12">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Image
            src="/aieutics_transparentbg_logo.png"
            alt="Aieutics"
            width={80}
            height={80}
            className="h-20 w-auto"
          />
          <span className="font-[family-name:var(--font-body)] text-sm text-[var(--color-grey)] italic hidden sm:inline">
            See further. Think deeper. Break through.
          </span>
        </div>
      </header>

      {/* Hero */}
      <section className="flex-1 flex items-center justify-center px-6 py-16 md:py-24">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-[family-name:var(--font-heading)] text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              POC Lifecycle
              <br />
              <span className="text-[var(--color-orange)]">Diagnostic</span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className="font-[family-name:var(--font-body)] text-lg md:text-xl text-[var(--color-grey)] leading-relaxed mb-4">
              18 binary questions. 5 dimensions. No middle ground.
            </p>
            <p className="font-[family-name:var(--font-body)] text-base md:text-lg text-[var(--color-grey)] leading-relaxed mb-10">
              A self-assessment for founders navigating proof of concept to
              contract. Identify where your POC is at risk — before it costs
              you.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link
              href="/diagnostic"
              className="inline-block bg-[var(--color-orange)] text-white font-[family-name:var(--font-heading)] font-bold text-lg px-12 py-4 rounded-full shadow-[0_0_0_4px_rgba(255,255,255,1),0_0_0_5px_var(--color-grey-light)] hover:shadow-[0_0_0_4px_rgba(255,255,255,1),0_0_0_6px_var(--color-orange)] hover:scale-[1.02] transition-all duration-200"
            >
              Start the Diagnostic
            </Link>
            <p className="font-[family-name:var(--font-body)] text-sm text-[var(--color-grey)] mt-4">
              Takes 3–5 minutes. Only what is concretely true today counts as
              Yes.
            </p>
          </motion.div>

          {/* Dimensions preview */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mt-16 grid grid-cols-1 sm:grid-cols-5 gap-4 text-left"
          >
            {[
              { label: "Problem Economics", desc: "Is it worth solving?" },
              {
                label: "Stakeholder Alignment",
                desc: "Have you mapped the people?",
              },
              {
                label: "Governance Readiness",
                desc: "Is there structural support?",
              },
              {
                label: "Commercial Conversion",
                desc: "Will it become a contract?",
              },
              {
                label: "Delivery Viability",
                desc: "Can you actually deliver?",
              },
            ].map((dim, i) => (
              <div
                key={i}
                className="border border-[var(--color-grey-light)] rounded-sm p-3"
              >
                <p className="font-[family-name:var(--font-heading)] text-xs font-bold uppercase tracking-wider text-[var(--color-orange)] mb-1">
                  {dim.label}
                </p>
                <p className="font-[family-name:var(--font-body)] text-xs text-[var(--color-grey)]">
                  {dim.desc}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-6 border-t border-[var(--color-grey-light)]">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-3">
          <Image
            src="/aieutics_transparentbg_logo.png"
            alt="Aieutics"
            width={24}
            height={24}
            className="h-6 w-auto opacity-40"
          />
          <p className="font-[family-name:var(--font-body)] text-xs text-[var(--color-grey)]">
            Developed by Aieutics from patterns observed across executive
            coaching, corporate accelerator programmes, and consulting
            engagements.
          </p>
        </div>
      </footer>
    </main>
  );
}
