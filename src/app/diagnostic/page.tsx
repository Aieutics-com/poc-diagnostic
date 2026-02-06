"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { DIMENSIONS } from "@/lib/diagnostic-data";
import { scoreAll, type Answers } from "@/lib/scoring";
import { decodeAnswers } from "@/lib/share";
import ProgressBar from "@/components/ProgressBar";
import WizardStep from "@/components/WizardStep";
import ResultsPage from "@/components/ResultsPage";
import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";

function DiagnosticContent() {
  const searchParams = useSearchParams();
  const [answers, setAnswers] = useState<Answers>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [showResults, setShowResults] = useState(false);

  // Decode shared results from URL
  useEffect(() => {
    const encoded = searchParams.get("r");
    if (encoded) {
      const decoded = decodeAnswers(encoded);
      if (decoded) {
        setAnswers(decoded);
        setShowResults(true);
      }
    }
  }, [searchParams]);

  const handleAnswer = useCallback((questionId: number, value: boolean) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  }, []);

  const currentDimension = DIMENSIONS[currentStep];

  const allCurrentAnswered = useMemo(() => {
    if (!currentDimension) return false;
    return currentDimension.questions.every(
      (q) => answers[q.id] !== undefined && answers[q.id] !== null
    );
  }, [currentDimension, answers]);

  const allAnswered = useMemo(() => {
    return DIMENSIONS.every((dim) =>
      dim.questions.every(
        (q) => answers[q.id] !== undefined && answers[q.id] !== null
      )
    );
  }, [answers]);

  const goNext = useCallback(() => {
    if (currentStep < DIMENSIONS.length - 1) {
      setDirection(1);
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setShowResults(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentStep]);

  const goBack = useCallback(() => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentStep]);

  const handleRestart = useCallback(() => {
    setAnswers({});
    setCurrentStep(0);
    setShowResults(false);
    setDirection(1);
    // Clear URL params
    window.history.replaceState({}, "", "/diagnostic");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const results = useMemo(() => scoreAll(answers), [answers]);

  return (
    <main className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="px-6 py-4 md:px-12 border-b border-[var(--color-grey-light)]">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="hover:opacity-70 transition-opacity">
            <Image
              src="/aieutics_transparentbg_logo.png"
              alt="Aieutics"
              width={72}
              height={72}
              className="h-[4.5rem] w-auto"
            />
          </Link>
          <span className="font-[family-name:var(--font-heading)] text-xs text-[var(--color-grey)]">
            POC Lifecycle Diagnostic
          </span>
        </div>
      </header>

      <div className="flex-1 px-6 py-8 md:px-12">
        <div className="max-w-3xl mx-auto">
          {!showResults ? (
            <>
              {/* Progress */}
              <div className="mb-10 no-print">
                <ProgressBar currentStep={currentStep} />
              </div>

              {/* Wizard step */}
              <WizardStep
                dimension={currentDimension}
                answers={answers}
                onAnswer={handleAnswer}
                stepIndex={currentStep}
                direction={direction}
              />

              {/* Navigation */}
              <div className="flex items-center justify-between mt-10 pt-6 border-t border-[var(--color-grey-light)] no-print">
                <button
                  onClick={goBack}
                  disabled={currentStep === 0}
                  className={`
                    font-[family-name:var(--font-heading)] text-sm font-bold px-8 py-3 rounded-full
                    transition-all duration-200 cursor-pointer
                    ${
                      currentStep === 0
                        ? "text-[var(--color-grey-light)] cursor-not-allowed"
                        : "bg-[var(--color-white)] border border-[var(--color-grey-light)] text-[var(--color-grey)] shadow-sm hover:border-[var(--color-foreground)] hover:text-[var(--color-foreground)]"
                    }
                  `}
                >
                  Back
                </button>

                {/* Step indicator on mobile */}
                <span className="md:hidden font-[family-name:var(--font-heading)] text-xs text-[var(--color-grey)]">
                  {currentStep + 1} / 5
                </span>

                <button
                  onClick={goNext}
                  disabled={!allCurrentAnswered}
                  className={`
                    font-[family-name:var(--font-heading)] text-sm font-bold px-10 py-3 rounded-full
                    transition-all duration-200 cursor-pointer
                    ${
                      allCurrentAnswered
                        ? "bg-[var(--color-orange)] text-white shadow-[0_0_0_3px_rgba(255,255,255,1),0_0_0_4px_var(--color-grey-light)] hover:shadow-[0_0_0_3px_rgba(255,255,255,1),0_0_0_5px_var(--color-orange)] hover:scale-[1.02]"
                        : "bg-[var(--color-grey-light)] text-[var(--color-grey)] cursor-not-allowed"
                    }
                  `}
                >
                  {currentStep === DIMENSIONS.length - 1
                    ? "See Results"
                    : "Next Dimension"}
                </button>
              </div>
            </>
          ) : (
            <ResultsPage
              results={results}
              answers={answers}
              onRestart={handleRestart}
            />
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="px-6 py-4 border-t border-[var(--color-grey-light)]">
        <div className="max-w-3xl mx-auto flex flex-col items-center gap-2">
          <Image
            src="/aieutics_transparentbg_logo.png"
            alt="Aieutics"
            width={20}
            height={20}
            className="h-5 w-auto opacity-40"
          />
          <p className="font-[family-name:var(--font-body)] text-xs text-[var(--color-grey)]">
            See further. Think deeper. Break through. —{" "}
            <a
              href="https://aieutics.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--color-orange)] transition-colors"
            >
              aieutics.com
            </a>
          </p>
        </div>
      </footer>
    </main>
  );
}

export default function DiagnosticPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p className="font-[family-name:var(--font-heading)] text-[var(--color-grey)]">
            Loading diagnostic...
          </p>
        </div>
      }
    >
      <DiagnosticContent />
    </Suspense>
  );
}
