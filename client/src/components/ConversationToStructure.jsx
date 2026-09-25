import React, { useState, useEffect } from 'react';

function ConversationToStructure() {
  const [activeStep, setActiveStep] = useState(0);

  const conversationText = "My name is Rahul Sharma. I live in Nagpur and have two children, Priya and Arjun. My brother Amit should be my executor.";
  
  const extractedFields = [
    { 
      key: 'FULL_NAME', 
      label: 'Declarant Name', 
      value: 'Rahul Sharma', 
      tag: 'Identity', 
      type: 'String',
      delay: 0.2 
    },
    { 
      key: 'RESIDENCE', 
      label: 'Legal Domicile', 
      value: 'Nagpur, Maharashtra', 
      tag: 'Jurisdiction', 
      type: 'Geo',
      delay: 0.4 
    },
    { 
      key: 'BENEFICIARIES', 
      label: 'Designated Heirs', 
      value: ['Priya Sharma (Daughter)', 'Arjun Sharma (Son)'], 
      tag: 'Family', 
      type: 'List<Person>',
      delay: 0.6 
    },
    { 
      key: 'EXECUTOR', 
      label: 'Primary Fiduciary', 
      value: 'Amit Sharma', 
      relation: 'Brother', 
      tag: 'Fiduciary', 
      type: 'Appointee',
      delay: 0.8 
    },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      if (activeStep < extractedFields.length) {
        setActiveStep(activeStep + 1);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [activeStep]);

  return (
    <section id="how-it-works" className="py-24 sm:py-32 bg-gradient-to-b from-background via-background-subtle to-background scroll-mt-16 border-t border-primary/[0.06] relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[450px] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-indigo-50 border border-indigo-100/80 rounded-full text-indigo-700 font-semibold text-xs font-mono uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
            Conversational Compiler • Zero Form Fatigue
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-ink font-serif tracking-tight leading-tight">
            From conversation to clarity
          </h2>
          <p className="text-base sm:text-lg text-secondary font-sans leading-relaxed">
            Your natural, spoken dialogue progressively compiles into an immutable, structured legal record in real time.
          </p>
        </div>

        {/* Interactive Dual-Panel Workbench */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-10 items-stretch mb-20">
          {/* Panel 1: Conversational Source Input (Left) */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-[0_15px_35px_-10px_rgba(15,20,25,0.07)] border border-stone-200/90 flex flex-col justify-between relative group">
            <div>
              {/* Header Bar */}
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-stone-200/80">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-ink text-white flex items-center justify-center font-mono font-bold text-xs shadow-sm">
                    RS
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-ink font-sans">Rahul Sharma</p>
                      <span className="w-2 h-2 rounded-full bg-emerald-500" title="Session Active" />
                    </div>
                    <p className="text-[11px] text-stone-500 font-mono">Audio & Text Intake • Turn #01</p>
                  </div>
                </div>
                <span className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-stone-100 border border-stone-200/80 text-stone-600 uppercase tracking-wide">
                  Natural Language
                </span>
              </div>

              {/* Message Body with Fixed Word Spacing & Entity Highlighting */}
              <div className="p-5 rounded-xl bg-stone-50/80 border border-stone-200/80 mb-6">
                <p className="text-stone-800 text-base sm:text-lg leading-relaxed font-serif italic">
                  "
                  {conversationText.split(' ').map((word, idx) => {
                    const cleanWord = word.replace(/[.,]/g, '');
                    const isName = ['Rahul', 'Sharma'].includes(cleanWord);
                    const isCity = cleanWord === 'Nagpur';
                    const isChildren = ['Priya', 'Arjun'].includes(cleanWord);
                    const isExecutor = cleanWord === 'Amit';

                    const isHighlighted = 
                      (activeStep >= 1 && isName) ||
                      (activeStep >= 2 && isCity) ||
                      (activeStep >= 3 && isChildren) ||
                      (activeStep >= 4 && isExecutor);
                    
                    return (
                      <React.Fragment key={idx}>
                        <span
                          className={`transition-all duration-300 ${
                            isHighlighted 
                              ? 'bg-indigo-100/90 text-indigo-900 font-semibold px-1.5 py-0.5 rounded border border-indigo-200/90 shadow-2xs font-sans not-italic' 
                              : 'text-stone-800'
                          }`}
                        >
                          {word}
                        </span>
                        {' '}
                      </React.Fragment>
                    );
                  })}
                  "
                </p>
              </div>
            </div>

            {/* Parser Status & Progress Meter */}
            <div className="pt-4 border-t border-stone-200/80 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2 text-indigo-700">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-bounce" style={{ animationDelay: '0.15s' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-bounce" style={{ animationDelay: '0.3s' }} />
                  </div>
                  <span className="font-semibold tracking-wide">
                    {activeStep < 4 ? 'Parsing entities & relations...' : 'Compilation verified & locked'}
                  </span>
                </div>
                <span className="text-stone-600 font-bold">
                  {Math.min(activeStep * 25, 100)}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="h-1.5 w-full bg-stone-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-600 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${Math.min(activeStep * 25, 100)}%` }}
                />
              </div>

              {/* Pipeline Tag Strip */}
              <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-stone-500">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  Tokenized Stream
                </span>
                <span className="text-stone-300">•</span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Schema Validated
                </span>
                <span className="text-stone-300">•</span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                  Directive Bound
                </span>
              </div>
            </div>
          </div>

          {/* Panel 2: Structured Entity Output (Right) */}
          <div className="bg-[#FAF9F5] rounded-2xl p-6 sm:p-8 shadow-[0_15px_35px_-10px_rgba(15,20,25,0.07)] border border-stone-200/90 flex flex-col justify-between">
            <div>
              {/* Header Bar */}
              <div className="flex items-center justify-between pb-4 mb-5 border-b border-stone-200/80">
                <div className="flex items-center gap-2 font-mono text-xs text-stone-600">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="font-semibold text-ink">lexora.schema_state</span>
                  <span className="text-stone-400">/</span>
                  <span>entity_register</span>
                </div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-100/70 text-emerald-800 border border-emerald-200 font-semibold">
                  {activeStep} of 4 Resolved
                </span>
              </div>

              {/* 4 Structured Property Registers */}
              <div className="space-y-3">
                {extractedFields.map((field, index) => {
                  const isResolved = activeStep > index;
                  return (
                    <div
                      key={field.key}
                      className={`p-3.5 sm:p-4 rounded-xl transition-all duration-300 border ${
                        isResolved
                          ? 'bg-white shadow-sm border-stone-200/90 hover:border-indigo-300'
                          : 'bg-white/40 border-dashed border-stone-300/70 opacity-40'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-stone-600 bg-stone-100 px-2 py-0.5 rounded border border-stone-200/70">
                            {field.key}
                          </span>
                          <span className="text-xs font-sans text-stone-500 font-medium">
                            {field.label}
                          </span>
                        </div>
                        {isResolved ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                            Verified
                          </span>
                        ) : (
                          <span className="text-[11px] font-mono text-stone-400">
                            Extracting...
                          </span>
                        )}
                      </div>

                      <div className="pl-0.5">
                        {Array.isArray(field.value) ? (
                          <div className="flex flex-wrap gap-2 pt-0.5">
                            {field.value.map((item, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-stone-50 border border-stone-200/80 text-xs font-semibold text-ink font-sans"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                                {item}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <div className="flex items-baseline justify-between">
                            <span className="text-ink font-serif font-bold text-base">
                              {field.value}
                            </span>
                            {field.relation && (
                              <span className="text-xs font-sans text-stone-500 font-normal">
                                Relation: <strong className="text-ink font-medium">{field.relation}</strong>
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Footer Note */}
            <div className="pt-4 border-t border-stone-200/80 flex items-center justify-between text-[11px] font-mono text-stone-500">
              <span>STORAGE: IMMUTABLE DRAFT DOCK</span>
              <span className="text-indigo-700 font-semibold">100% Deterministic</span>
            </div>
          </div>
        </div>

        {/* Narrative Feature Pillars (3 Columns) */}
        <div className="pt-12 border-t border-stone-200/80">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-stone-200/90 shadow-sm hover:shadow-md transition-shadow">
              <span className="text-xs font-mono font-bold text-indigo-600 tracking-wider uppercase mb-2 block">
                01 / Input Modality
              </span>
              <h3 className="text-lg font-bold text-ink font-serif mb-2">Natural Narrative</h3>
              <p className="text-sm text-secondary leading-relaxed font-sans">
                Describe your intentions conversationally. Speak freely about your assets, family, and choices without filling tedious form grids.
              </p>
            </div>
            
            <div className="p-6 rounded-2xl bg-white border border-stone-200/90 shadow-sm hover:shadow-md transition-shadow">
              <span className="text-xs font-mono font-bold text-indigo-600 tracking-wider uppercase mb-2 block">
                02 / Extraction Engine
              </span>
              <h3 className="text-lg font-bold text-ink font-serif mb-2">Real-Time Synthesis</h3>
              <p className="text-sm text-secondary leading-relaxed font-sans">
                The engine isolates confirmed entities, dates, and relationships, mapping them directly into validated data schemas.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-stone-200/90 shadow-sm hover:shadow-md transition-shadow">
              <span className="text-xs font-mono font-bold text-indigo-600 tracking-wider uppercase mb-2 block">
                03 / State Authority
              </span>
              <h3 className="text-lg font-bold text-ink font-serif mb-2">Immutable Source of Truth</h3>
              <p className="text-sm text-secondary leading-relaxed font-sans">
                Your draft document is generated strictly from verified state fields, ensuring reliable legal clarity with zero AI hallucinations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ConversationToStructure;
