import React from 'react';

function ProcessTimeline() {
  const steps = [
    {
      number: '01',
      title: 'Start Conversation',
      description: 'Answer questions naturally in plain language, guided by empathetic prompts.',
      tag: 'Voice & Text Intake',
      icon: (
        <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
        </svg>
      )
    },
    {
      number: '02',
      title: 'AI Structures',
      description: 'Key legal entities, family members, and assets are indexed instantaneously.',
      tag: 'Deterministic Schema',
      icon: (
        <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
        </svg>
      )
    },
    {
      number: '03',
      title: 'Clarify Conflicts',
      description: 'Discrepancies are flagged immediately so you retain final authority.',
      tag: 'Zero Assumptions',
      icon: (
        <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286zm0 13.036h.008v.008H12v-.008z" />
        </svg>
      )
    },
    {
      number: '04',
      title: 'Review Document',
      description: 'Inspect a live, formatted legal draft generated directly from confirmed data.',
      tag: 'Executive Preview',
      icon: (
        <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      )
    },
    {
      number: '05',
      title: 'Export & Archive',
      description: 'Download print-ready PDFs and immutable structured records for your records.',
      tag: 'Certified PDF & JSON',
      icon: (
        <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
        </svg>
      )
    }
  ];

  return (
    <section id="about" className="py-24 md:py-32 bg-background relative overflow-hidden scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-20 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-200/60 border border-stone-300/80 text-xs font-mono font-medium text-stone-800 tracking-wider uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
            End-To-End Architecture • Five Key Phases
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-ink tracking-tight">
            Simple process, rigorous precision
          </h2>
          <p className="text-base sm:text-lg text-secondary max-w-2xl mx-auto font-sans leading-relaxed">
            From the first spoken answer to an attorney-ready directive in fifteen minutes.
          </p>
        </div>

        {/* Desktop Phase Cards - Grid */}
        <div className="hidden lg:block relative">
          {/* Subtle connecting guideline behind the cards */}
          <div className="absolute top-1/2 left-4 right-4 h-px bg-stone-200 -translate-y-1/2 z-0" />

          <div className="grid grid-cols-5 gap-4 relative z-10">
            {steps.map((step, index) => (
              <div
                key={index}
                className="bg-white/95 rounded-2xl border border-stone-200/90 p-5 shadow-[0_4px_20px_-4px_rgba(15,20,25,0.05)] hover:shadow-xl hover:border-indigo-400/50 hover:-translate-y-1.5 transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  {/* Top: Monospace Phase Counter + Icon */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-mono font-bold tracking-wider text-stone-400 group-hover:text-indigo-600 transition-colors">
                      {step.number}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-stone-50 border border-stone-200/80 text-stone-700 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all duration-300 shadow-sm">
                      {step.icon}
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-base font-serif font-bold text-ink mb-2 group-hover:text-indigo-950 transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed font-sans mb-4">
                    {step.description}
                  </p>
                </div>

                {/* Bottom Tag */}
                <div className="pt-3 border-t border-stone-100">
                  <span className="inline-block text-[10px] font-mono uppercase tracking-wider text-stone-500 bg-stone-50 px-2 py-0.5 rounded border border-stone-200/60">
                    {step.tag}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile & Tablet Timeline - Vertical */}
        <div className="lg:hidden space-y-4">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-stone-200/90 p-5 shadow-sm flex items-start gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-700 flex-shrink-0 flex items-center justify-center font-mono text-xs font-bold">
                {step.number}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-serif font-bold text-ink">
                    {step.title}
                  </h3>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 bg-stone-50 px-2 py-0.5 rounded border border-stone-200/60">
                    {step.tag}
                  </span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed font-sans">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Metric Pill */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-white border border-stone-200/90 rounded-full shadow-sm text-xs font-sans text-stone-700">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" className="text-amber-600" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Average completion time: <strong className="font-semibold text-ink">10–15 minutes</strong> • No legal jargon required</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProcessTimeline;
