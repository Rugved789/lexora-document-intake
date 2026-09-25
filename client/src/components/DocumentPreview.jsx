import React, { useEffect, useRef } from 'react';

/**
 * Professional Fullscreen PDF Document Preview Modal
 * 
 * Features:
 * - Real PDF rendering via browser object/iframe with native zoom and print
 * - Single source of truth with the downloaded PDF binary
 * - Dedicated toolbar with Download and Close controls
 * - Escape key & backdrop click dismissal
 * - Smooth entrance animations and loading/error states
 */
function DocumentPreview({
  isOpen,
  onClose,
  pdfUrl,
  loading = false,
  loadingStep = 'Generating document...',
  error = null,
  onRetry,
  onDownload,
  downloading = false,
  title = 'Personal Wishes Document'
}) {
  const closeButtonRef = useRef(null);

  // Keyboard navigation: Escape key closes modal & lock body scroll
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Focus close button on open for accessibility
    setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const sanitizedFilename = (title || 'Personal_Wishes_Document')
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .replace(/_+/g, '_');

  return (
    <div 
      className="fixed inset-0 z-50 bg-primary/80 backdrop-blur-md flex flex-col justify-between overflow-hidden animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="document-preview-title"
      onClick={handleBackdropClick}
    >
      {/* Top Professional Toolbar */}
      <header className="bg-paper border-b border-primary/10 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-sm z-20 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary/5 border border-primary/10 flex items-center justify-center text-primary">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
              <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 id="document-preview-title" className="text-base sm:text-lg font-bold text-primary font-serif">
                Lexora Document Preview
              </h2>
              <span className="px-2 py-0.5 text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full">
                PDF • Draft
              </span>
            </div>
            <p className="text-xs text-secondary hidden sm:block">
              {title} • Real generated PDF document
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {pdfUrl && (
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 sm:px-3.5 sm:py-2 border border-primary/20 text-primary hover:bg-background-subtle hover:border-primary/40 text-xs sm:text-sm font-semibold rounded-lg transition-all hidden md:flex items-center gap-1.5"
              title="Open PDF in new tab"
            >
              <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/>
              </svg>
              <span>Full View</span>
            </a>
          )}

          <button
            onClick={onDownload}
            disabled={loading || downloading || !!error}
            className="px-3.5 py-1.5 sm:px-4 sm:py-2 bg-primary text-white hover:bg-primary-light text-xs sm:text-sm font-semibold rounded-lg shadow-sm hover:shadow transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Download document as PDF"
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
            </svg>
            <span>{downloading ? 'Downloading...' : 'Download PDF'}</span>
          </button>

          <button
            ref={closeButtonRef}
            onClick={onClose}
            aria-label="Close document preview"
            className="px-2.5 py-1.5 sm:px-3 sm:py-2 text-secondary hover:text-primary hover:bg-primary/5 text-xs sm:text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5"
            title="Close preview (Esc)"
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 18L18 6M6 6l12 12"/>
            </svg>
            <span className="hidden sm:inline">Close</span>
          </button>
        </div>
      </header>

      {/* Main Document Viewer Canvas */}
      <div 
        className="flex-1 w-full p-2 sm:p-6 md:p-8 flex justify-center items-center overflow-hidden"
        onClick={handleBackdropClick}
      >
        {/* Loading State */}
        {loading && (
          <div className="bg-white p-8 rounded-2xl shadow-2xl border border-primary/10 max-w-md w-full text-center my-auto animate-modal-enter">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-primary/5 flex items-center justify-center text-primary">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin text-accent">
                <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                <path d="M12 2a10 10 0 0110 10" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-primary font-serif">
              {loadingStep || 'Generating document...'}
            </h3>
            <p className="text-xs text-secondary mt-1 max-w-xs mx-auto">
              Compiling verified intake state into a high-assurance legal-tech PDF document.
            </p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="bg-white p-8 rounded-2xl shadow-2xl border border-red-200 max-w-md w-full text-center my-auto animate-modal-enter">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center text-red-600">
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
              </svg>
            </div>
            <h3 className="text-base font-bold text-primary font-serif">
              Document Generation Failed
            </h3>
            <p className="text-sm text-secondary mt-1.5 mb-5">
              {error}
            </p>
            <div className="flex gap-2 justify-center">
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="px-4 py-2 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary-light transition-colors"
                >
                  Try Again
                </button>
              )}
              <button
                onClick={onClose}
                className="px-4 py-2 border border-primary/20 text-primary text-xs font-semibold rounded-lg hover:bg-background-subtle transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Real PDF Viewer Canvas */}
        {!loading && !error && pdfUrl && (
          <div className="w-full max-w-5xl h-[82vh] sm:h-[85vh] flex flex-col bg-white rounded-xl shadow-2xl border border-primary/10 overflow-hidden animate-modal-enter">
            <object
              data={`${pdfUrl}#toolbar=1&navpanes=0`}
              type="application/pdf"
              className="w-full h-full flex-1 border-0"
              aria-label="Personal Wishes Document PDF Viewer"
            >
              <iframe
                src={`${pdfUrl}#toolbar=1&navpanes=0`}
                className="w-full h-full flex-1 border-0"
                title="Personal Wishes Document PDF"
              >
                <div className="p-8 text-center bg-white flex flex-col items-center justify-center h-full">
                  <p className="text-primary font-semibold mb-2">
                    Preview is ready
                  </p>
                  <p className="text-xs text-secondary mb-4 max-w-sm">
                    Your browser does not support inline PDF rendering. You can download or view the PDF directly.
                  </p>
                  <a
                    href={pdfUrl}
                    download={`${sanitizedFilename}.pdf`}
                    className="px-4 py-2 bg-primary text-white text-xs font-semibold rounded-lg shadow inline-flex items-center gap-2"
                  >
                    Download PDF
                  </a>
                </div>
              </iframe>
            </object>
          </div>
        )}
      </div>
    </div>
  );
}

export default DocumentPreview;
