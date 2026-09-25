import React from 'react';

function PremiumFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0A0D10] text-stone-300 border-t border-white/10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              {/* Lexora Brand Emblem */}
              <div className="w-8 h-8 rounded-lg bg-white/10 text-white flex items-center justify-center border border-white/15 shadow-sm">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M6 4.5V18.5H19"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M10 8.5V14.5H16"
                    stroke="#B8860B"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.9"
                  />
                </svg>
              </div>
              <span className="text-xl font-bold font-serif text-white tracking-tight">Lexora</span>
            </div>
            
            <p className="text-stone-400 text-sm leading-relaxed max-w-md font-sans">
              Transforming natural conversations into structured, attorney-ready directives. Engineered for precision, built for peace of mind.
            </p>

            <div className="flex gap-3 pt-2">
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 flex items-center justify-center transition-colors text-stone-400 hover:text-white"
                aria-label="Twitter"
              >
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
                </svg>
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 flex items-center justify-center transition-colors text-stone-400 hover:text-white"
                aria-label="LinkedIn"
              >
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
                  <circle cx="4" cy="4" r="2"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Product Column */}
          <div>
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-white mb-4">Product</h3>
            <ul className="space-y-2.5 text-sm font-sans">
              <li>
                <button
                  onClick={() => {
                    const element = document.getElementById('how-it-works');
                    element?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-stone-400 hover:text-white transition-colors text-left"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    const element = document.getElementById('product');
                    element?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-stone-400 hover:text-white transition-colors text-left"
                >
                  Integrity Engine
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    const element = document.getElementById('about');
                    element?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-stone-400 hover:text-white transition-colors text-left"
                >
                  Process Cadence
                </button>
              </li>
              <li>
                <span className="text-stone-600 text-xs font-mono">Pricing (Early Access)</span>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-white mb-4">Legal & Trust</h3>
            <ul className="space-y-2.5 text-sm font-sans">
              <li>
                <a href="#privacy" className="text-stone-400 hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#terms" className="text-stone-400 hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#disclaimer" className="text-stone-400 hover:text-white transition-colors">
                  Regulatory Scope
                </a>
              </li>
              <li>
                <a href="#contact" className="text-stone-400 hover:text-white transition-colors">
                  Support & Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-mono text-stone-500">
          <p>
            © {currentYear} Lexora Systems Inc. All rights reserved.
          </p>
          <p>
            Crafted for legal precision & quiet confidence.
          </p>
        </div>

        {/* Legal Disclaimer Box */}
        <div className="mt-8 p-5 bg-white/[0.03] rounded-xl border border-white/10">
          <p className="text-[11px] text-stone-400 leading-relaxed font-sans">
            <strong className="text-stone-200">Legal Notice:</strong> Lexora assists individuals in organizing, structuring, and clarifying their personal wishes into structured drafts, but does not offer formal legal representation or statutory legal counsel. Always review finalized documents with qualified legal counsel in your state or jurisdiction.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default PremiumFooter;
