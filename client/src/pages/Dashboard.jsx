import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, UserButton } from '@clerk/clerk-react';
import { api, setAuthToken } from '../services/api';

function Dashboard() {
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const [intakes, setIntakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [creating, setCreating] = useState(false);
  
  // Modal & Search state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const inputRef = useRef(null);

  const titleSuggestions = [
    'Personal Wishes Directive',
    'Estate & Asset Allocation',
    'Healthcare & Fiduciary Wishes',
    'Family Property Testament'
  ];

  useEffect(() => {
    loadIntakes();
  }, []);

  // Autofocus input when modal opens
  useEffect(() => {
    if (isModalOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isModalOpen]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isModalOpen) {
        setIsModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  async function loadIntakes() {
    try {
      let token = await getToken();
      if (!token) {
        // Allow brief moment for Clerk session to sync if app just mounted/restarted
        await new Promise(r => setTimeout(r, 350));
        token = await getToken();
      }
      setAuthToken(token);
      
      const data = await api.getIntakes();
      setIntakes(data);
      setError(null);
    } catch (err) {
      console.warn('Initial load intakes attempt failed, retrying once...', err);
      try {
        await new Promise(r => setTimeout(r, 600));
        const retryToken = await getToken();
        setAuthToken(retryToken);
        const data = await api.getIntakes();
        setIntakes(data);
        setError(null);
      } catch (retryErr) {
        console.error('Failed to load intakes after retry:', retryErr);
        setError('Failed to load document sessions');
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateWithTitle(e) {
    if (e) e.preventDefault();
    const finalTitle = newTitle.trim() || 'Personal Wishes Directive';
    setCreating(true);
    setError(null);
    try {
      let token = await getToken();
      if (!token) {
        // Wait briefly for Clerk auth state to settle on cold restart
        await new Promise(r => setTimeout(r, 400));
        token = await getToken();
      }
      setAuthToken(token);
      
      const intake = await api.createIntake(finalTitle);
      setIsModalOpen(false);
      setNewTitle('');
      navigate(`/app/intake/${intake.id}`);
    } catch (err) {
      console.warn('Initial intake creation attempt encountered cold-start, retrying once...', err);
      try {
        await new Promise(r => setTimeout(r, 700));
        const retryToken = await getToken();
        setAuthToken(retryToken);
        const intake = await api.createIntake(finalTitle);
        setIsModalOpen(false);
        setNewTitle('');
        navigate(`/app/intake/${intake.id}`);
      } catch (retryErr) {
        console.error('Failed to create intake after retry:', retryErr);
        setError('Failed to create intake session');
        setCreating(false);
      }
    }
  }

  async function handleDeleteIntake(id, e) {
    e.stopPropagation();
    
    if (!confirm('Are you sure you want to delete this document session?')) {
      return;
    }

    try {
      const token = await getToken();
      setAuthToken(token);
      
      await api.deleteIntake(id);
      setIntakes(intakes.filter(intake => intake.id !== id));
    } catch (err) {
      console.error('Failed to delete intake:', err);
      setError('Failed to delete document session');
    }
  }

  const filteredIntakes = intakes.filter(intake =>
    intake.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 rounded-xl bg-primary text-paper flex items-center justify-center border border-white/10 shadow-md">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M6 4.5V18.5H19" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10 8.5V14.5H16" stroke="#B8860B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.9"/>
          </svg>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs text-stone-500">
          <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" />
          <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
          <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
          <span className="ml-1">Loading Lexora Workspace...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Premium Navbar with Unified Lexora Branding */}
      <header className="bg-paper/90 border-b border-stone-200/80 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Left Nav Elements */}
            <div className="flex items-center gap-4">
              <button 
                onClick={() => {
                  if (window.history.state && window.history.state.idx > 0) {
                    navigate(-1);
                  } else {
                    navigate('/');
                  }
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200/90 bg-stone-50/80 hover:bg-white text-xs font-mono font-medium text-stone-700 hover:text-ink transition-all shadow-2xs"
                title="Back to Landing Page"
              >
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
                <span>Home</span>
              </button>

              <div className="h-6 w-px bg-stone-200"></div>

              {/* Updated Brand Title & Emblem */}
              <button 
                onClick={() => navigate('/')}
                className="flex items-center gap-3 group cursor-pointer text-left focus:outline-none"
              >
                {/* Official Lexora Monogram */}
                <div className="w-9 h-9 rounded-lg bg-primary text-paper flex items-center justify-center border border-white/10 shadow-sm group-hover:scale-105 transition-transform">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M6 4.5V18.5H19" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M10 8.5V14.5H16" stroke="#B8860B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-primary font-serif tracking-tight group-hover:text-indigo-950 transition-colors">
                      Lexora Workspace
                    </span>
                    <span className="hidden sm:inline-block text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-stone-100 text-stone-600 border border-stone-200/80">
                      Vault
                    </span>
                  </div>
                  <p className="text-xs text-secondary font-sans">
                    Personal Legal Directives & Intake Sessions
                  </p>
                </div>
              </button>
            </div>

            {/* Right Nav Elements */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsModalOpen(true)}
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-light active:scale-98 text-paper rounded-xl text-xs font-semibold shadow-sm transition-all"
              >
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                <span>New Session</span>
              </button>
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Workspace View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {error && (
          <div className="bg-red-50/80 border border-red-200 p-4 rounded-xl text-xs font-mono text-red-800 flex items-center justify-between animate-fadeIn">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-red-600" />
              <span>{error}</span>
            </div>
            <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700">✕</button>
          </div>
        )}

        {/* Workspace Overview & Metrics Banner */}
        <div className="bg-white rounded-2xl border border-stone-200/90 p-6 sm:p-8 shadow-[0_4px_20px_-4px_rgba(15,20,25,0.04)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-600 text-[11px] font-mono uppercase tracking-wider border border-stone-200/70">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Deterministic Repository
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-ink tracking-tight">
                Document Directives Vault
              </h2>
              <p className="text-sm text-secondary max-w-xl font-sans leading-relaxed">
                Access your ongoing conversational intakes. Each session is compiled into verified structured states, ready for immediate document export.
              </p>
            </div>

            {/* Quick Metrics Bar */}
            <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
              <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80 min-w-[130px]">
                <span className="text-[10px] font-mono uppercase text-stone-500 block">Total Directives</span>
                <span className="text-xl font-serif font-bold text-ink">{intakes.length}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80 min-w-[130px]">
                <span className="text-[10px] font-mono uppercase text-stone-500 block">Engine Policy</span>
                <span className="text-xs font-mono font-semibold text-emerald-700 block mt-1">Zero Assumption</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls & Search Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </div>
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter by directive title..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-stone-200 text-sm font-sans placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all shadow-2xs"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs font-mono text-stone-400 hover:text-ink"
              >
                Clear
              </button>
            )}
          </div>

          {/* New Document Session Trigger Button */}
          <button 
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center gap-2.5 px-6 py-2.5 bg-primary text-paper rounded-xl text-sm font-semibold hover:bg-primary-light active:scale-98 transition-all shadow-sm hover:shadow-md cursor-pointer"
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <span>New Document Session</span>
          </button>
        </div>

        {/* Document Sessions Grid / Empty States */}
        {intakes.length === 0 ? (
          /* Zero Intakes State */
          <div className="bg-white rounded-2xl border border-stone-200/90 p-12 sm:p-16 text-center shadow-sm">
            <div className="w-14 h-14 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-5 text-indigo-600 shadow-xs">
              <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <h3 className="text-2xl font-serif font-bold text-ink mb-2">
              No Document Directives Yet
            </h3>
            <p className="text-secondary text-sm max-w-md mx-auto mb-6 font-sans leading-relaxed">
              Start your first guided conversational intake session to organize and structure your personal wishes.
            </p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-paper rounded-xl text-sm font-semibold hover:bg-primary-light transition-all shadow-md active:scale-98"
            >
              <span>Create First Directive</span>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </button>
          </div>
        ) : filteredIntakes.length === 0 ? (
          /* Search Empty State */
          <div className="bg-white rounded-2xl border border-stone-200/90 p-12 text-center shadow-sm">
            <p className="text-sm font-mono text-stone-500 mb-3">
              No document sessions match "{searchTerm}"
            </p>
            <button
              onClick={() => setSearchTerm('')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 underline font-mono"
            >
              Clear Search Query
            </button>
          </div>
        ) : (
          /* Sessions Cards Grid */
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-mono text-stone-500 px-1">
              <span>ACTIVE DIRECTIVES ({filteredIntakes.length})</span>
              <span>ORGANIZED CHRONOLOGICALLY</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredIntakes.map((intake, idx) => (
                <div 
                  key={intake.id} 
                  onClick={() => navigate(`/app/intake/${intake.id}`)}
                  className="bg-white rounded-2xl border border-stone-200/90 p-6 hover:border-indigo-400/50 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer flex flex-col justify-between group relative overflow-hidden shadow-2xs"
                >
                  <div>
                    {/* Top Row: Tag & Status */}
                    <div className="flex items-center justify-between mb-3 text-[11px] font-mono">
                      <span className="text-stone-400 group-hover:text-indigo-600 transition-colors">
                        DIR-0{idx + 1}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/70 font-medium flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Active Draft
                      </span>
                    </div>

                    {/* Session Title */}
                    <h3 className="text-lg font-serif font-bold text-ink mb-4 group-hover:text-indigo-950 transition-colors line-clamp-2">
                      {intake.title}
                    </h3>

                    {/* Metadata details */}
                    <div className="space-y-2 mb-6 text-xs text-stone-500 font-sans">
                      <div className="flex items-center gap-2">
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-stone-400">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                        </svg>
                        <span>{intake.messageCount || 0} conversation turns</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-stone-400">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Updated {new Date(intake.updatedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-4 border-t border-stone-100 flex items-center gap-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/app/intake/${intake.id}`);
                      }}
                      className="flex-1 py-2 px-3 bg-stone-100 group-hover:bg-primary group-hover:text-paper text-ink rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>Open Directive</span>
                      <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </button>
                    <button 
                      onClick={(e) => handleDeleteIntake(intake.id, e)}
                      className="p-2 border border-stone-200 text-stone-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete session"
                    >
                      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Creation Modal: Take Intake Title From User */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div 
            className="bg-white rounded-2xl border border-stone-200 shadow-2xl max-w-lg w-full overflow-hidden transform animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Top Console Bar */}
            <div className="bg-[#FAF9F5] px-6 py-3.5 border-b border-stone-200/80 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2 text-stone-600">
                <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
                <span className="font-semibold text-ink">lexora.engine</span>
                <span className="text-stone-400">/</span>
                <span>new_directive_session</span>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-ink text-sm font-semibold p-1"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleCreateWithTitle} className="p-6 sm:p-7 space-y-5">
              <div className="space-y-1.5">
                <h3 className="text-xl font-serif font-bold text-ink">
                  Name Your Document Session
                </h3>
                <p className="text-xs text-stone-500 font-sans leading-relaxed">
                  Provide a title for this intake directive to identify it in your records.
                </p>
              </div>

              {/* Title Input Field */}
              <div className="space-y-2">
                <label className="text-xs font-mono font-semibold text-stone-700 uppercase tracking-wide block">
                  Directive Title
                </label>
                <input
                  ref={inputRef}
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., Personal Wishes Directive - 2026"
                  className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all text-ink"
                  disabled={creating}
                />
              </div>

              {/* Suggested Preset Chips */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-mono text-stone-400 block uppercase">
                  Quick Suggestions:
                </span>
                <div className="flex flex-wrap gap-2">
                  {titleSuggestions.map((suggestion) => (
                    <button
                      type="button"
                      key={suggestion}
                      onClick={() => setNewTitle(suggestion)}
                      className="text-xs font-sans px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200/80 text-stone-700 border border-stone-200/80 transition-colors"
                    >
                      + {suggestion}
                    </button>
                  ))}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={creating}
                  className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-600 hover:text-ink text-xs font-semibold hover:bg-stone-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-5 py-2.5 bg-primary hover:bg-primary-light active:scale-98 text-paper rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-wait"
                >
                  {creating ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-paper border-t-transparent rounded-full animate-spin" />
                      <span>Creating Directive...</span>
                    </>
                  ) : (
                    <>
                      <span>Create & Begin Session</span>
                      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
