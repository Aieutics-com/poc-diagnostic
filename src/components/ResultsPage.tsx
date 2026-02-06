"use client";

import { motion } from "framer-motion";
import type { DimensionResult } from "@/lib/diagnostic-data";
import {
  getMatchingPatterns,
  getTotalScore,
  getTotalMax,
  getRedCount,
  shouldShowReflection,
} from "@/lib/scoring";
import type { Answers } from "@/lib/scoring";
import { encodeAnswers } from "@/lib/share";
import RadarChart from "./RadarChart";
import DimensionBar from "./DimensionBar";
import ReflectionBox from "./ReflectionBox";
import PatternInsight from "./PatternInsight";
import COISection from "./COISection";
import CTASection from "./CTASection";
import { useCallback, useState } from "react";

interface ResultsPageProps {
  results: DimensionResult[];
  answers: Answers;
  onRestart: () => void;
}

export default function ResultsPage({
  results,
  answers,
  onRestart,
}: ResultsPageProps) {
  const patterns = getMatchingPatterns(results);
  const totalScore = getTotalScore(results);
  const totalMax = getTotalMax(results);
  const redCount = getRedCount(results);
  const reflections = results.filter(shouldShowReflection);
  const [copied, setCopied] = useState(false);

  const handleShare = useCallback(() => {
    const encoded = encodeAnswers(answers);
    const url = `${window.location.origin}/diagnostic?r=${encoded}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [answers]);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="mb-8">
        <p className="font-[family-name:var(--font-heading)] text-xs font-bold uppercase tracking-widest text-[var(--color-orange)] mb-2">
          Your Results
        </p>
        <h2 className="font-[family-name:var(--font-heading)] text-2xl md:text-3xl font-bold mb-2">
          POC Lifecycle Profile
        </h2>
        <p className="font-[family-name:var(--font-body)] text-[var(--color-grey)]">
          {totalScore}/{totalMax} — This is a profile, not a grade. The pattern
          of your scores matters more than the total.
        </p>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 mb-8 no-print flex-wrap">
        <button
          onClick={handleShare}
          className="px-6 py-2.5 text-sm font-bold font-[family-name:var(--font-heading)] bg-[var(--color-white)] border border-[var(--color-grey-light)] rounded-full shadow-sm hover:border-[var(--color-orange)] hover:text-[var(--color-orange)] transition-all duration-200 cursor-pointer"
        >
          {copied ? "Link copied" : "Share results"}
        </button>
        <button
          onClick={handlePrint}
          className="px-6 py-2.5 text-sm font-bold font-[family-name:var(--font-heading)] bg-[var(--color-white)] border border-[var(--color-grey-light)] rounded-full shadow-sm hover:border-[var(--color-foreground)] transition-all duration-200 cursor-pointer"
        >
          Print / PDF
        </button>
        <button
          onClick={onRestart}
          className="px-6 py-2.5 text-sm font-bold font-[family-name:var(--font-heading)] text-[var(--color-grey)] rounded-full hover:text-[var(--color-foreground)] hover:bg-[var(--color-grey-light)] transition-all duration-200 cursor-pointer"
        >
          Retake
        </button>
      </div>

      {/* Radar chart */}
      <div className="border border-[var(--color-grey-light)] rounded-sm p-4 mb-8">
        <RadarChart results={results} />
      </div>

      {/* Dimension bars */}
      <div className="mb-8">
        <h3 className="font-[family-name:var(--font-heading)] text-lg font-bold mb-4">
          Dimension Scores
        </h3>
        {results.map((result, i) => (
          <DimensionBar key={result.dimension.id} result={result} index={i} />
        ))}
      </div>

      {/* Conditional reflections */}
      {reflections.length > 0 && (
        <div className="mb-8">
          <h3 className="font-[family-name:var(--font-heading)] text-lg font-bold mb-4">
            Areas Requiring Attention
          </h3>
          {reflections.map((result, i) => (
            <ReflectionBox
              key={result.dimension.id}
              result={result}
              index={i}
            />
          ))}
        </div>
      )}

      {/* Pattern interpretation */}
      <PatternInsight patterns={patterns} />

      {/* COI section */}
      <COISection results={results} />

      {/* CTA */}
      <CTASection redCount={redCount} />
    </motion.div>
  );
}
