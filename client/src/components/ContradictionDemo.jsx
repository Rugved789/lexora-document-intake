import React, { useState } from 'react';

function ContradictionDemo() {
  const [step, setStep] = useState(0);

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleReset = () => {
    setStep(0);
  };

  return (
    <section id="product" className="py-16 sm:py-24 md:py-32 bg-background relative overflow-hidden scroll-mt-20">
      {/* Subtle background ambient blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-3.5 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-14 space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[11px] sm:text-xs font-mono font-medium text-amber-900 tracking-wider uppercase max-w-full">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
            <span className="truncate">Integrity Engine • Contradiction Detection</span>
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif font-bold text-ink tracking-tight break-words">
            Lexora doesn't guess
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-secondary max-w-2xl mx-auto font-sans leading-relaxed">
            When answers conflict across different parts of the interview, Lexora pauses to clarify instead of fabricating assumptions.
          </p>
        </div>

        {/* Dual-Pane Interactive Audit Inspector */}
        <div className="bg-white rounded-2xl shadow-[0_20px_50px_-12px_rgba(15,20,25,0.08)] border border-stone-200/90 overflow-hidden">
          {/* Console Header Bar */}
          <div className="bg-[#FAF9F5] px-4 sm:px-6 py-3 border-b border-stone-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2 text-stone-600 min-w-0">
              <span className="w-2 h-2 rounded-full bg-stone-400 shrink-0" />
              <span className="font-semibold text-ink truncate">lexora.audit-stream</span>
              <span className="text-stone-400 shrink-0">/</span>
              <span className="truncate">session_verification.log</span>
            </div>

            {/* Step Selection Tabs with Horizontal Scroll & Responsive Labels */}
            <div className="w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 scrollbar-thin">
              <div className="flex items-center gap-1 sm:gap-1.5 bg-stone-200/60 p-1 rounded-lg min-w-max">
                {[
                  { short: '1. Statement', full: '1. Initial Statement' },
                  { short: '2. Conflict', full: '2. Contradicting Input' },
                  { short: '3. Flagged', full: '3. Conflict Raised' },
                  { short: '4. Resolved', full: '4. Reconciled' }
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => setStep(idx)}
                    className={`px-2 sm:px-2.5 py-1 rounded text-[10px] sm:text-[11px] font-mono transition-all whitespace-nowrap shrink-0 ${
                      step === idx
                        ? 'bg-white text-ink font-semibold shadow-xs'
                        : 'text-stone-600 hover:text-ink'
                    }`}
                  >
                    <span className="hidden sm:inline">{item.full}</span>
                    <span className="sm:hidden">{item.short}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Dual-Column Body */}
          <div className="grid lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-stone-200/80">
            {/* Left Column (5 cols): Dialogue Transcript Timeline */}
            <div className="lg:col-span-5 p-4 sm:p-6 lg:p-7 bg-[#FAF9F5]/40 flex flex-col justify-between space-y-6 min-w-0">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-1 pb-3 mb-4 border-b border-stone-200/80">
                  <span className="text-xs font-mono uppercase tracking-wider text-stone-500 font-semibold shrink-0">
                    Input Timeline
                  </span>
                  <span className="text-[11px] font-mono text-stone-400 shrink-0">
                    Declarant: Rahul Sharma
                  </span>
                </div>

                {/* Turn 02 Card */}
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-1 text-[11px] font-mono">
                    <span className="text-stone-500 font-medium">Turn #02 • 14:02:10</span>
                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/80 shrink-0">
                      Logged
                    </span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white border border-stone-200/90 shadow-2xs">
                    <p className="text-sm font-serif italic text-ink break-words">
                      "I don't have children."
                    </p>
                  </div>
                  <div className="text-[11px] font-mono text-stone-500 pl-1 break-all">
                    ↳ Extracted: <code className="text-stone-700 font-semibold bg-stone-100 px-1.5 py-0.5 rounded break-all">has_children = false</code>
                  </div>
                </div>

                {/* Dotted Timeline Bridge */}
                <div className="py-4 pl-4 relative">
                  <div className="w-px h-8 border-l-2 border-dashed border-stone-300" />
                  <span className="inline-block text-[10px] font-mono uppercase text-stone-400 bg-stone-100 px-2 py-0.5 rounded mt-1">
                    +6 mins • Turn #08
                  </span>
                </div>

                {/* Turn 08 Card (Responsive to Step) */}
                <div className={`space-y-2 transition-all duration-300 ${step >= 1 ? 'opacity-100' : 'opacity-40'}`}>
                  <div className="flex flex-wrap items-center justify-between gap-1 text-[11px] font-mono">
                    <span className="text-stone-500 font-medium">Turn #08 • 14:08:32</span>
                    {step >= 1 ? (
                      <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/80 shrink-0">
                        Evaluated
                      </span>
                    ) : (
                      <span className="text-stone-400 bg-stone-100 px-2 py-0.5 rounded shrink-0">
                        Pending
                      </span>
                    )}
                  </div>
                  <div className="p-3.5 rounded-xl bg-white border border-stone-200/90 shadow-2xs">
                    <p className="text-sm font-serif italic text-ink break-words">
                      "My daughter Priya should receive my car."
                    </p>
                  </div>
                  <div className="text-[11px] font-mono text-stone-500 pl-1 break-all">
                    ↳ Candidate: <code className="text-stone-700 font-semibold bg-stone-100 px-1.5 py-0.5 rounded break-all">daughter: "Priya"</code>
                  </div>
                </div>
              </div>

              {/* Left Column Footnote */}
              <div className="pt-3 border-t border-stone-200/70 text-[10px] sm:text-[11px] font-mono text-stone-500 flex flex-wrap items-center justify-between gap-2">
                <span>INTAKE STREAM: 2 TRANSCRIPTS</span>
                <span>STATUS: MONITORED</span>
              </div>
            </div>

            {/* Right Column (7 cols): Engine Live State & Resolution */}
            <div className="lg:col-span-7 p-4 sm:p-6 lg:p-8 flex flex-col justify-between space-y-6 min-w-0">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-5 border-b border-stone-200/80">
                  <span className="text-xs font-mono uppercase tracking-wider text-stone-500 font-semibold shrink-0">
                    Validation & Reconciler
                  </span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {step === 0 && (
                      <span className="text-[10px] sm:text-[11px] font-mono font-medium text-stone-600 bg-stone-100 px-2 py-0.5 rounded">
                        STATE: CONSISTENT
                      </span>
                    )}
                    {step === 1 && (
                      <span className="text-[10px] sm:text-[11px] font-mono font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                        SCANNING DEPENDENCY
                      </span>
                    )}
                    {step === 2 && (
                      <span className="text-[10px] sm:text-[11px] font-mono font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-ping" />
                        FLAG: CONFLICT_DETECTED
                      </span>
                    )}
                    {step >= 3 && (
                      <span className="text-[10px] sm:text-[11px] font-mono font-bold text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded">
                        STATE: RESOLVED & LOCKED
                      </span>
                    )}
                  </div>
                </div>

                {/* State Card Displayed based on step */}
                {step === 0 && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="p-3.5 sm:p-4 rounded-xl bg-stone-50 border border-stone-200/80 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                        <h4 className="text-sm font-semibold font-serif text-ink break-words">Turn #02 Entity Validated</h4>
                      </div>
                      <p className="text-xs text-stone-600 font-sans leading-relaxed break-words">
                        Declarant confirmed having no children. Field <code className="font-mono bg-white px-1 py-0.5 rounded border border-stone-200 break-all">family.has_children = false</code> registered to draft document.
                      </p>
                    </div>

                    <div className="p-3.5 sm:p-4 rounded-xl border border-dashed border-stone-200 text-xs font-mono text-stone-500 space-y-1">
                      <p className="text-stone-400 font-semibold">ENGINE MONITORING:</p>
                      <p className="break-words">Watching for dependent clauses (e.g. child heirs, guardianship, minor trust triggers).</p>
                    </div>
                  </div>
                )}

                {step === 1 && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="p-3.5 sm:p-4 rounded-xl bg-blue-50/70 border border-blue-200/80 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse shrink-0" />
                        <h4 className="text-sm font-semibold font-serif text-blue-950 break-words">Dependency Check Triggered</h4>
                      </div>
                      <p className="text-xs text-blue-900 font-sans leading-relaxed break-words">
                        User mentioned daughter "Priya" for car bequest at Turn #08. Re-evaluating against existing state field <code className="font-mono bg-white px-1 py-0.5 rounded border border-blue-200 break-all">family.has_children = false</code>.
                      </p>
                    </div>

                    <div className="p-3.5 sm:p-4 rounded-xl bg-stone-50 border border-stone-200/80 text-xs font-mono space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-1 text-stone-600">
                        <span>CROSS-FIELD DEPENDENCY:</span>
                        <span className="text-amber-700 font-bold shrink-0">MISMATCH FOUND</span>
                      </div>
                      <div className="text-stone-500 text-[11px] break-words">
                        Assertion: Declarant has no children vs. Declarant names a daughter.
                      </div>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="p-3.5 sm:p-4.5 rounded-xl bg-amber-50/80 border border-amber-300/90 space-y-3 shadow-xs">
                      <div className="flex items-start gap-2.5 sm:gap-3">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0 font-bold text-xs sm:text-sm shadow-xs">
                          ⚠
                        </div>
                        <div className="space-y-1 min-w-0">
                          <h4 className="text-xs sm:text-sm font-bold font-serif text-amber-950 break-words">
                            Discrepancy Flag • Clarification Required
                          </h4>
                          <p className="text-xs text-amber-900 font-sans leading-relaxed break-words">
                            You previously noted having no children, but subsequently designated daughter <strong>Priya</strong>. Would you like to register Priya as your child?
                          </p>
                        </div>
                      </div>

                      {/* Conflict Diff Box */}
                      <div className="bg-white/90 p-2.5 sm:p-3 rounded-lg border border-amber-200 text-xs font-mono space-y-1.5">
                        <div className="flex flex-wrap items-center justify-between gap-1 text-red-700">
                          <span className="font-semibold shrink-0">[Prior Turn 02]:</span>
                          <span className="break-all font-mono">has_children = false</span>
                        </div>
                        <div className="flex flex-wrap items-center justify-between gap-1 text-amber-800">
                          <span className="font-semibold shrink-0">[New Turn 08]:</span>
                          <span className="break-all font-mono">beneficiary.relation = "daughter"</span>
                        </div>
                      </div>

                      <button
                        onClick={handleNext}
                        className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 active:scale-[0.99] text-white rounded-lg text-xs font-semibold shadow-sm transition-all flex items-center justify-center gap-2 font-mono uppercase tracking-wider"
                      >
                        <span>Resolve & Update State</span>
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}

                {step >= 3 && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="p-3.5 sm:p-4.5 rounded-xl bg-emerald-50/80 border border-emerald-200/90 space-y-3 shadow-xs">
                      <div className="flex items-start gap-2.5 sm:gap-3">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 font-bold text-xs sm:text-sm shadow-xs">
                          ✓
                        </div>
                        <div className="space-y-1 min-w-0">
                          <h4 className="text-xs sm:text-sm font-bold font-serif text-emerald-950 break-words">
                            State Reconciled Deterministically
                          </h4>
                          <p className="text-xs text-emerald-900 font-sans leading-relaxed break-words">
                            Priya Sharma has been confirmed as your daughter and recorded under legal descendants. No assumptions or hallucinations permitted.
                          </p>
                        </div>
                      </div>

                      {/* Reconciled Diff */}
                      <div className="bg-white/90 p-2.5 sm:p-3 rounded-lg border border-emerald-200 text-xs font-mono space-y-1.5 text-emerald-900">
                        <div className="flex flex-wrap items-center justify-between gap-1">
                          <span className="text-stone-600 shrink-0">family.has_children:</span>
                          <strong className="text-emerald-700 break-all">true (Reconciled)</strong>
                        </div>
                        <div className="flex flex-wrap items-center justify-between gap-1">
                          <span className="text-stone-600 shrink-0">descendants:</span>
                          <span className="break-all font-semibold">["Priya Sharma"]</span>
                        </div>
                        <div className="flex flex-wrap items-center justify-between gap-1">
                          <span className="text-stone-600 shrink-0">specific_bequest:</span>
                          <span className="break-all font-semibold">Vehicle → Priya Sharma</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column Footnote */}
              <div className="pt-3 border-t border-stone-200/70 text-[10px] sm:text-[11px] font-mono text-stone-500 flex flex-wrap items-center justify-between gap-2">
                <span>DETERMINISTIC INTEGRITY GATE</span>
                <span className="text-emerald-700 font-semibold">ZERO-ASSUMPTION POLICY</span>
              </div>
            </div>
          </div>

          {/* Bottom Interactive Control Footer */}
          <div className="bg-[#FAF9F5] px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3 border-t border-stone-200/80">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <span className="text-xs font-mono text-stone-500 uppercase shrink-0">
                Phase 0{step + 1} of 04
              </span>
              <div className="flex gap-1.5">
                {[0, 1, 2, 3].map((s) => (
                  <button
                    key={s}
                    onClick={() => setStep(s)}
                    aria-label={`Jump to phase ${s + 1}`}
                    className={`h-1.5 rounded-full transition-all ${
                      step === s
                        ? 'w-6 bg-indigo-600'
                        : step > s
                        ? 'w-2 bg-stone-400'
                        : 'w-2 bg-stone-200'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              {step < 3 ? (
                <button
                  onClick={handleNext}
                  className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-indigo-600 hover:text-indigo-800 transition-colors uppercase tracking-wider"
                >
                  <span>Advance State</span>
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </button>
              ) : (
                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-stone-600 hover:text-ink transition-colors uppercase tracking-wider"
                >
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                  </svg>
                  <span>Replay Inspection</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Key Insight */}
        <div className="mt-10 sm:mt-12 text-center max-w-2xl mx-auto px-2">
          <p className="text-sm sm:text-base text-secondary leading-relaxed font-sans">
            Unlike generic generative models, <strong className="text-ink font-semibold">Lexora maintains deterministic state constraints</strong> and proactively flags contradictory input so your final output is legally sound and unambiguous.
          </p>
        </div>
      </div>
    </section>
  );
}

export default ContradictionDemo;
