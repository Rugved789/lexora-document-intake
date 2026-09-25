import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { api, setAuthToken } from '../services/api';

const FIELD_LABELS = {
  full_name: 'Full Name',
  home_address: 'Home Address',
  covers_worldwide_assets: 'Worldwide Scope',
  has_children: 'Has Children',
  children: 'Children',
  executor: 'Executor',
  'executor.name': 'Executor Name',
  'executor.relationship': 'Executor Relation',
  has_specific_gifts: 'Specific Gifts',
  specific_gifts: 'Specific Gifts',
  has_additional_wishes: 'Additional Wishes',
  additional_wishes: 'Additional Wishes'
};

function StateHistoryViewer({ intakeId, currentVersion = 1, onVersionChange }) {
  const { getToken } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState(null);
  const containerRef = useRef(null);

  // Load history on initial mount and whenever currentVersion or intakeId updates
  useEffect(() => {
    if (intakeId) {
      loadHistory();
    }
  }, [intakeId, currentVersion]);

  // Refresh history whenever user opens the popover
  useEffect(() => {
    if (isOpen) {
      loadHistory();
    }
  }, [isOpen]);

  // Click outside to close & Escape key
  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  async function loadHistory() {
    setLoading(true);
    setError(null);
    try {
      if (getToken) {
        const token = await getToken();
        if (token) setAuthToken(token);
      }
      const data = await api.getStateHistory(intakeId);
      const historyList = Array.isArray(data) ? data : [];
      setHistory(historyList);

      if (historyList.length > 0 && typeof historyList[0].version === 'number') {
        const latestRecorded = historyList[0].version;
        if (onVersionChange && latestRecorded > currentVersion) {
          onVersionChange(latestRecorded);
        }
      }
    } catch (err) {
      console.error('Failed to load state history:', err);
      setError('Unable to load state version history. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  function getChangedFields(current = {}, previous = {}) {
    if (!previous) return [];
    const changes = [];
    const allKeys = new Set([...Object.keys(current), ...Object.keys(previous)]);

    allKeys.forEach((key) => {
      if (JSON.stringify(current[key]) !== JSON.stringify(previous[key])) {
        changes.push(key);
      }
    });

    return changes;
  }

  // Derive the active latest version (highest between DB snapshot and current prop)
  const latestHistoryVersion = history.length > 0 && typeof history[0].version === 'number'
    ? history[0].version
    : 1;
  const activeVersion = Math.max(latestHistoryVersion, currentVersion || 1);

  return (
    <div className="relative" ref={containerRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg border border-primary/15 bg-paper hover:bg-background-subtle text-primary text-xs sm:text-sm font-semibold transition-all shadow-2xs hover:border-primary/30"
        title="View state version audit log"
      >
        <svg
          className="w-4 h-4 text-accent flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span className="hidden md:inline">History</span>
        <span className="px-1.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10.5px] font-mono font-bold">
          v{activeVersion}
        </span>
      </button>

      {/* Dropdown Popover */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-80 sm:w-96 bg-paper rounded-xl shadow-2xl border border-primary/10 z-50 max-h-[460px] overflow-hidden flex flex-col animate-modal-enter">
          {/* Header */}
          <div className="px-4 py-3 bg-background-subtle border-b border-primary/10 flex justify-between items-center flex-shrink-0">
            <div>
              <h3 className="text-sm font-bold text-primary font-serif">
                State Version History
              </h3>
              <p className="text-[11px] text-secondary">
                Immutable record of structured state mutations
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-secondary hover:text-primary p-1 rounded-md hover:bg-primary/5 transition-colors"
              aria-label="Close history"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content Area */}
          <div className="overflow-y-auto flex-1 p-2 space-y-2 divide-y divide-primary/5">
            {loading && (
              <div className="p-6 text-center text-secondary text-xs flex flex-col items-center gap-2">
                <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                <span>Loading state snapshots...</span>
              </div>
            )}

            {!loading && error && (
              <div className="p-4 text-center">
                <p className="text-xs text-red-600 mb-2">{error}</p>
                <button
                  onClick={loadHistory}
                  className="px-3 py-1 bg-primary text-white text-xs font-semibold rounded hover:bg-primary-light transition-colors"
                >
                  Retry
                </button>
              </div>
            )}

            {!loading && !error && history.length === 0 && (
              <div className="p-6 text-center text-secondary text-xs">
                <p className="font-semibold text-primary mb-1">Initial Draft State</p>
                <p className="text-[11px] text-secondary-light">
                  Version 1 initialized. State updates will appear here as you chat.
                </p>
              </div>
            )}

            {!loading && !error && history.map((versionItem, index) => {
              const isSelected = selectedVersion === versionItem.version;
              const isCurrent = versionItem.version === activeVersion;
              // Compare with previous chronological version (next in desc array)
              const previousVersion = index < history.length - 1 ? history[index + 1].state : null;
              const changedFields = previousVersion ? getChangedFields(versionItem.state, previousVersion) : [];

              return (
                <div
                  key={versionItem.version}
                  className={`p-3 rounded-lg border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-primary/5 border-primary/20 shadow-xs'
                      : 'border-primary/5 hover:bg-background-subtle hover:border-primary/15'
                  }`}
                  onClick={() => setSelectedVersion(isSelected ? null : versionItem.version)}
                >
                  <div className="flex justify-between items-center mb-1.5">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 text-xs font-bold font-mono rounded ${
                          isCurrent
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-primary/5 text-primary border border-primary/10'
                        }`}
                      >
                        v{versionItem.version}
                      </span>
                      {isCurrent && (
                        <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Current State
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] font-mono text-secondary-light">
                      {formatDate(versionItem.createdAt)}
                    </span>
                  </div>

                  {/* Changed Fields Tags */}
                  {changedFields.length > 0 ? (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {changedFields.map((field) => (
                        <span
                          key={field}
                          className="text-[10px] font-medium bg-accent/10 text-accent-dark px-1.5 py-0.5 rounded border border-accent/20"
                        >
                          + {FIELD_LABELS[field] || field}
                        </span>
                      ))}
                    </div>
                  ) : index === history.length - 1 ? (
                    <p className="text-[10.5px] text-secondary-light italic mt-1">
                      Initial intake initialization
                    </p>
                  ) : null}

                  {/* Expandable State Preview */}
                  {isSelected && (
                    <div 
                      className="mt-3 pt-3 border-t border-primary/10"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[10.5px] font-bold text-primary font-serif uppercase tracking-wider">
                          State Snapshot Summary
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedVersion(null)}
                            className="text-[10px] text-secondary hover:text-primary hover:underline"
                          >
                            Collapse
                          </button>
                        </div>
                      </div>

                      {/* User-Friendly Readable Legal Card */}
                      <div className="bg-background-subtle/80 rounded-xl p-3 border border-primary/10 text-xs space-y-2.5">
                        {/* 1. Declarant Details */}
                        <div className="grid grid-cols-2 gap-2 pb-2 border-b border-primary/5">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-secondary-light block">
                              Declarant Name
                            </span>
                            <span className="font-semibold text-primary">
                              {versionItem.state?.full_name || (
                                <span className="text-secondary-light font-normal italic">Not provided</span>
                              )}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-secondary-light block">
                              Home Address
                            </span>
                            <span className="text-secondary break-words">
                              {versionItem.state?.home_address || (
                                <span className="text-secondary-light italic">Not provided</span>
                              )}
                            </span>
                          </div>
                        </div>

                        {/* 2. Scope & Children */}
                        <div className="grid grid-cols-2 gap-2 pb-2 border-b border-primary/5">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-secondary-light block">
                              Worldwide Scope
                            </span>
                            <span className="text-secondary">
                              {versionItem.state?.covers_worldwide_assets === true
                                ? 'Covered (Worldwide)'
                                : versionItem.state?.covers_worldwide_assets === false
                                ? 'Local Jurisdiction Only'
                                : <span className="text-secondary-light italic">Not specified</span>}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-secondary-light block">
                              Children
                            </span>
                            <span className="text-secondary">
                              {versionItem.state?.has_children === false
                                ? 'None declared'
                                : Array.isArray(versionItem.state?.children) && versionItem.state.children.length > 0
                                ? versionItem.state.children.map(c => c.name).filter(Boolean).join(', ')
                                : versionItem.state?.has_children === true
                                ? 'Declared (Names pending)'
                                : <span className="text-secondary-light italic">Not specified</span>}
                            </span>
                          </div>
                        </div>

                        {/* 3. Nominated Executor */}
                        <div className="pb-2 border-b border-primary/5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-secondary-light block">
                            Nominated Executor
                          </span>
                          {versionItem.state?.executor?.name ? (
                            <span className="font-semibold text-primary">
                              {versionItem.state.executor.name}
                              {versionItem.state.executor.relationship && (
                                <span className="text-secondary font-normal ml-1">
                                  ({versionItem.state.executor.relationship})
                                </span>
                              )}
                            </span>
                          ) : (
                            <span className="text-secondary-light italic">Not specified</span>
                          )}
                        </div>

                        {/* 4. Specific Gifts */}
                        <div className="pb-2 border-b border-primary/5">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-secondary-light">
                              Specific Gifts & Bequests
                            </span>
                            <span className="text-[10px] font-medium text-secondary-light">
                              {Array.isArray(versionItem.state?.specific_gifts) && versionItem.state.specific_gifts.length > 0
                                ? `${versionItem.state.specific_gifts.length} gift${versionItem.state.specific_gifts.length > 1 ? 's' : ''}`
                                : 'None'}
                            </span>
                          </div>
                          {Array.isArray(versionItem.state?.specific_gifts) && versionItem.state.specific_gifts.length > 0 ? (
                            <div className="space-y-1 mt-1">
                              {versionItem.state.specific_gifts.map((g, gi) => (
                                <div 
                                  key={gi} 
                                  className="bg-paper p-1.5 rounded-lg border border-primary/5 flex items-center justify-between text-[11px]"
                                >
                                  <span className="font-semibold text-primary">
                                    {g.recipient || 'Named Recipient'}
                                  </span>
                                  <span className="text-secondary font-medium">
                                    ↳ {g.item || 'Asset Item'}
                                  </span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-[11px] text-secondary-light italic">
                              {versionItem.state?.has_specific_gifts === false
                                ? 'No specific individual gifts declared'
                                : 'None specified'}
                            </p>
                          )}
                        </div>

                        {/* 5. Additional Wishes */}
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-secondary-light block mb-1">
                            Additional Directives & Wishes
                          </span>
                          {versionItem.state?.additional_wishes ? (
                            <p className="text-[11px] italic bg-paper p-2 rounded-lg border border-primary/5 text-primary leading-relaxed">
                              "{versionItem.state.additional_wishes}"
                            </p>
                          ) : (
                            <p className="text-[11px] text-secondary-light italic">
                              {versionItem.state?.has_additional_wishes === false
                                ? 'No additional residual directives'
                                : 'None specified'}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default StateHistoryViewer;
