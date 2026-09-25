import React from 'react';

function PremiumDocumentPreview() {
  return (
    <section className="py-24 md:py-32 bg-background-subtle relative overflow-hidden">
      {/* Decorative ambient lighting */}
      <div className="absolute inset-0 opacity-25 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-amber-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-200/70 border border-stone-300 text-xs font-mono font-medium text-stone-800 tracking-wider uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-700" />
            Real-Time Synthesis • Executive Preview
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-ink tracking-tight">
            Your document, ready to review
          </h2>
          <p className="text-base sm:text-lg text-secondary max-w-2xl mx-auto font-sans leading-relaxed">
            Your spoken intentions are synthesized directly into an attorney-grade draft, organized according to rigorous statutory structure.
          </p>
        </div>

        {/* Realistic Stacked Paper Document Preview */}
        <div className="relative mx-auto max-w-3xl">
          {/* Deckle Paper Layer 2 (Bottom layer) */}
          <div className="absolute -bottom-3 -right-2 inset-0 bg-[#E8E4DC] rounded-xl border border-stone-300/80 -z-20 transform rotate-1" />
          
          {/* Deckle Paper Layer 1 (Middle layer) */}
          <div className="absolute -bottom-1.5 -left-1.5 inset-0 bg-[#F2EFE9] rounded-xl border border-stone-200/90 -z-10 transform -rotate-[0.6deg]" />
          
          {/* Main Top Sheet */}
          <div className="relative bg-[#FDFCFA] rounded-xl shadow-[0_25px_60px_-15px_rgba(15,20,25,0.12)] border border-stone-200/90 overflow-hidden transform hover:scale-[1.008] transition-transform duration-500">
            {/* Document Executive Header Bar */}
            <div className="bg-[#0F1419] text-white px-8 md:px-12 py-7 border-b-2 border-amber-600/70 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-amber-400 uppercase font-semibold block mb-1">
                  OFFICIAL INSTRUMENT DRAFT • REF: LEX-2026-984
                </span>
                <h1 className="text-xl md:text-2xl font-serif font-bold tracking-tight text-white">
                  Personal Wishes Directive
                </h1>
                <p className="text-stone-400 text-xs font-sans mt-0.5">
                  Generated via Lexora Deterministic Intake Engine
                </p>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded border border-white/15">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px] font-mono font-medium text-white tracking-wider">
                  VERIFIED STATE
                </span>
              </div>
            </div>

            {/* Document Content */}
            <div className="p-8 md:p-12 space-y-7 font-serif text-ink">
              {/* Formal Preamble */}
              <div className="p-3.5 bg-stone-50 border border-stone-200/70 rounded-lg text-xs font-serif italic text-stone-600 leading-relaxed">
                "I, Rahul Sharma, residing in Nagpur, Maharashtra, declare this document to represent my current wishes regarding the distribution of specific personal property and the appointment of fiduciary representatives."
              </div>

              {/* Section 1 */}
              <div className="group p-3 -mx-3 rounded-lg hover:bg-stone-50/70 transition-colors">
                <div className="flex items-center justify-between border-b border-stone-200 pb-1.5 mb-3">
                  <h2 className="text-sm font-bold font-mono uppercase tracking-wider text-ink">
                    § 1.0 Declarant Identity & Residence
                  </h2>
                  <span className="text-[10px] font-mono text-stone-400 group-hover:text-indigo-600 transition-colors">
                    LOCKED & VERIFIED
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-sans">
                  <div className="flex flex-col">
                    <span className="text-stone-500 font-mono text-[11px]">Full Legal Name</span>
                    <span className="font-semibold text-ink text-sm font-serif">Rahul Sharma</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-stone-500 font-mono text-[11px]">Primary Domicile</span>
                    <span className="font-semibold text-ink text-sm font-serif">Nagpur, Maharashtra, India</span>
                  </div>
                </div>
              </div>

              {/* Section 2 */}
              <div className="group p-3 -mx-3 rounded-lg hover:bg-stone-50/70 transition-colors">
                <div className="flex items-center justify-between border-b border-stone-200 pb-1.5 mb-3">
                  <h2 className="text-sm font-bold font-mono uppercase tracking-wider text-ink">
                    § 2.0 Territorial Scope
                  </h2>
                  <span className="text-[10px] font-mono text-stone-400 group-hover:text-indigo-600 transition-colors">
                    CONFIRMED
                  </span>
                </div>
                <p className="text-xs font-sans text-stone-700">
                  This directive encompasses worldwide movable and immovable estate: <strong className="text-ink">Affirmative (Worldwide)</strong>.
                </p>
              </div>

              {/* Section 3 */}
              <div className="group p-3 -mx-3 rounded-lg hover:bg-stone-50/70 transition-colors">
                <div className="flex items-center justify-between border-b border-stone-200 pb-1.5 mb-3">
                  <h2 className="text-sm font-bold font-mono uppercase tracking-wider text-ink">
                    § 3.0 Descendants & Children
                  </h2>
                  <span className="text-[10px] font-mono text-stone-400 group-hover:text-indigo-600 transition-colors">
                    RECONCILED
                  </span>
                </div>
                <ul className="text-xs font-sans text-stone-700 space-y-1.5 list-disc list-inside">
                  <li><span className="font-medium text-ink">Priya Sharma</span> (Daughter)</li>
                  <li><span className="font-medium text-ink">Arjun Sharma</span> (Son)</li>
                </ul>
              </div>

              {/* Section 4 */}
              <div className="group p-3 -mx-3 rounded-lg hover:bg-stone-50/70 transition-colors">
                <div className="flex items-center justify-between border-b border-stone-200 pb-1.5 mb-3">
                  <h2 className="text-sm font-bold font-mono uppercase tracking-wider text-ink">
                    § 4.0 Designated Executor & Alternate
                  </h2>
                  <span className="text-[10px] font-mono text-stone-400 group-hover:text-indigo-600 transition-colors">
                    FIDUCIARY RECORDED
                  </span>
                </div>
                <div className="text-xs font-sans text-stone-700 grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div>Primary Executor: <strong className="text-ink">Amit Sharma</strong> (Brother)</div>
                  <div>Alternate: <strong className="text-ink">Designation Deferred</strong></div>
                </div>
              </div>

              {/* Section 5 */}
              <div className="group p-3 -mx-3 rounded-lg hover:bg-stone-50/70 transition-colors">
                <div className="flex items-center justify-between border-b border-stone-200 pb-1.5 mb-3">
                  <h2 className="text-sm font-bold font-mono uppercase tracking-wider text-ink">
                    § 5.0 Specific Bequest
                  </h2>
                  <span className="text-[10px] font-mono text-stone-400 group-hover:text-indigo-600 transition-colors">
                    ITEM ALLOCATED
                  </span>
                </div>
                <div className="p-3 bg-amber-500/5 border border-amber-500/20 rounded-lg text-xs font-sans flex items-center justify-between">
                  <div>
                    <span className="text-stone-500 block text-[11px] font-mono">SPECIFIED ASSET</span>
                    <strong className="text-ink text-sm font-serif">Family Motor Vehicle (Sedan)</strong>
                  </div>
                  <div className="text-right">
                    <span className="text-stone-500 block text-[11px] font-mono">BENEFICIARY</span>
                    <strong className="text-indigo-900 font-semibold">Priya Sharma (Daughter)</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Document Formal Footer */}
            <div className="bg-[#FAF9F5] px-8 md:px-12 py-4 border-t border-stone-200 flex flex-wrap items-center justify-between text-[11px] font-mono text-stone-500 gap-2">
              <span>DOC REF: LEX-2026-NAGPUR-01</span>
              <span>SHA-256 INTEGRITY STAMP: 8f4e...9b21</span>
              <span className="text-ink font-semibold">Powered by Lexora</span>
            </div>

            {/* Fictional Disclaimer Banner */}
            <div className="bg-stone-100 border-t border-stone-200 px-8 py-2.5 text-center">
              <p className="text-[11px] font-sans text-stone-500">
                Fictional demonstration draft for platform preview purposes only.
              </p>
            </div>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-white p-6 rounded-xl border border-stone-200/80 shadow-sm text-center">
            <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
              </svg>
            </div>
            <h3 className="font-serif font-bold text-ink mb-1">Audited Data State</h3>
            <p className="text-xs text-secondary leading-relaxed font-sans">
              Every clause maps deterministically to a verified fact in your conversation timeline.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-stone-200/80 shadow-sm text-center">
            <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
            </div>
            <h3 className="font-serif font-bold text-ink mb-1">Live Reactive Sync</h3>
            <p className="text-xs text-secondary leading-relaxed font-sans">
              As clarifications are accepted, the document updates immediately without full-page reloads.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-stone-200/80 shadow-sm text-center">
            <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.25 2.25L15 6" />
              </svg>
            </div>
            <h3 className="font-serif font-bold text-ink mb-1">Attorney-Ready Export</h3>
            <p className="text-xs text-secondary leading-relaxed font-sans">
              Formatted with standard legal conventions for direct sharing with legal counsel.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PremiumDocumentPreview;
