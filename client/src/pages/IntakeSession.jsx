import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth, UserButton } from '@clerk/clerk-react';
import { api, setAuthToken } from '../services/api';
import ConversationPanel from '../components/ConversationPanel';
import StructuredStatePanel from '../components/StructuredStatePanel';
import DocumentPreview from '../components/DocumentPreview';
import StateHistoryViewer from '../components/StateHistoryViewer';

function IntakeSession() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getToken } = useAuth();
  
  const [intake, setIntake] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sending, setSending] = useState(false);
  const [fieldsNeedingClarification, setFieldsNeedingClarification] = useState([]);
  const [currentVersion, setCurrentVersion] = useState(1);

  // PDF Preview & Download state
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [pdfBlob, setPdfBlob] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfLoadingStep, setPdfLoadingStep] = useState('Generating document...');
  const [pdfError, setPdfError] = useState(null);
  const [downloading, setDownloading] = useState(false);

  const handleBackToDashboard = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate('/app');
    }
  };

  useEffect(() => {
    loadIntake();
  }, [id]);

  // Clean up object URLs on unmount or URL replacement
  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  async function loadIntake() {
    try {
      let token = await getToken();
      if (!token) {
        await new Promise(r => setTimeout(r, 350));
        token = await getToken();
      }
      setAuthToken(token);
      
      const data = await api.getIntake(id);
      setIntake(data);
      setCurrentVersion(data.version || 1);
      setError(null);
    } catch (err) {
      console.warn('Initial load intake attempt failed, retrying once...', err);
      try {
        await new Promise(r => setTimeout(r, 600));
        const retryToken = await getToken();
        setAuthToken(retryToken);
        const data = await api.getIntake(id);
        setIntake(data);
        setCurrentVersion(data.version || 1);
        setError(null);
      } catch (retryErr) {
        console.error('Failed to load intake after retry:', retryErr);
        setError('Failed to load intake session');
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleSendMessage(content) {
    if (!content.trim() || sending) return;

    setSending(true);
    setError(null);

    try {
      const token = await getToken();
      setAuthToken(token);
      
      const response = await api.sendMessage(id, content);
      
      // Track fields needing clarification
      if (response.clarificationRequired && response.fieldsNeedingClarification) {
        setFieldsNeedingClarification(response.fieldsNeedingClarification);
      } else {
        setFieldsNeedingClarification([]);
      }
      
      // Invalidate cached PDF because structured state changed
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
        setPdfUrl(null);
      }
      setPdfBlob(null);

      // Update local state with new message, structured state, and completion
      setIntake(prev => ({
        ...prev,
        messages: response.messages,
        state: response.state,
        document: response.document,
        completion: response.completion
      }));
      
      // Update version if returned
      if (response.version) {
        setCurrentVersion(response.version);
      }
    } catch (err) {
      console.error('Failed to send message:', err);
      setError('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  }

  // Open Preview Modal & fetch fresh PDF Blob
  async function handleOpenPreview() {
    setIsPreviewOpen(true);
    setPdfError(null);

    // If PDF is already loaded and valid for current state, display immediately
    if (pdfUrl && pdfBlob) {
      return;
    }

    setPdfLoading(true);
    setPdfLoadingStep('Generating document...');

    try {
      let token = await getToken();
      setAuthToken(token);

      const blob = await api.getDocumentPDF(id);

      setPdfLoadingStep('Opening document...');
      await new Promise(r => setTimeout(r, 120));

      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }

      const url = URL.createObjectURL(blob);
      setPdfBlob(blob);
      setPdfUrl(url);
      setPdfError(null);
    } catch (err) {
      console.error('Failed to generate PDF document:', err);
      setPdfError('Unable to generate the document. Please try again.');
    } finally {
      setPdfLoading(false);
    }
  }

  // Download the exact same PDF binary
  async function handleDownloadDocument() {
    if (downloading) return;
    setDownloading(true);

    try {
      let currentBlob = pdfBlob;

      if (!currentBlob) {
        let token = await getToken();
        setAuthToken(token);
        currentBlob = await api.getDocumentPDF(id, true);

        // Cache the blob
        setPdfBlob(currentBlob);
        if (!pdfUrl) {
          setPdfUrl(URL.createObjectURL(currentBlob));
        }
      }

      const sanitizedTitle = (intake?.title || 'Personal_Wishes_Document')
        .replace(/[^a-zA-Z0-9_-]/g, '_')
        .replace(/_+/g, '_') || 'Personal_Wishes_Document';
      const filename = `${sanitizedTitle}.pdf`;

      const downloadUrl = URL.createObjectURL(currentBlob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error('Failed to download document PDF:', err);
      setError('Unable to download the document. Please try again.');
    } finally {
      setDownloading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-accent rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    );
  }

  if (!intake) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="bg-red-50 border-l-4 border-red-500 text-red-800 px-6 py-4 rounded-r-lg shadow-md">
          <div className="flex items-center gap-3">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
            <span className="font-semibold">Intake session not found</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Premium Header with Top Document Actions */}
      <header className="bg-paper border-b border-primary/10 sticky top-0 z-40 backdrop-blur-sm">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3 justify-between items-center py-3.5">
            {/* Left: Back & Document Metadata */}
            <div className="flex items-center gap-3 sm:gap-4 min-w-0">
              <button 
                onClick={handleBackToDashboard}
                className="flex items-center gap-1.5 text-secondary hover:text-primary transition-colors px-2.5 py-1.5 rounded-lg hover:bg-background-subtle text-sm font-medium"
                title="Back to dashboard"
              >
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 19l-7-7 7-7"/>
                </svg>
                <span>Back</span>
              </button>
              
              <div className="h-6 w-px bg-primary/10"></div>
              
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h1 className="text-base sm:text-lg font-bold text-primary font-serif truncate">
                    {intake.title}
                  </h1>
                  <span className="px-2 py-0.5 text-[11px] font-semibold bg-primary/5 text-primary/80 border border-primary/10 rounded-full">
                    PDF • Draft
                  </span>
                </div>
                <p className="text-xs text-secondary truncate">
                  Personal Wishes Document
                </p>
              </div>
            </div>

            {/* Right: Top Document Actions & Controls */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* PRIMARY ACTION: Preview */}
              <button
                onClick={handleOpenPreview}
                className="px-3.5 py-1.5 sm:px-4 sm:py-2 bg-primary text-white hover:bg-primary-light text-xs sm:text-sm font-semibold rounded-lg shadow-sm hover:shadow transition-all flex items-center gap-2"
                title="Preview real PDF document"
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
                <span>Preview</span>
              </button>

              {/* SECONDARY ACTION: Download PDF */}
              <button
                onClick={handleDownloadDocument}
                disabled={downloading}
                className="px-3 py-1.5 sm:px-3.5 sm:py-2 border border-primary/20 text-primary hover:bg-background-subtle hover:border-primary/40 text-xs sm:text-sm font-semibold rounded-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Download real PDF document"
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                </svg>
                <span>{downloading ? 'Downloading...' : 'Download PDF'}</span>
              </button>

              <div className="h-6 w-px bg-primary/10 hidden sm:block"></div>

              {/* Version History Modal Trigger */}
              <StateHistoryViewer 
                intakeId={id} 
                currentVersion={currentVersion} 
                onVersionChange={setCurrentVersion} 
              />

              {/* Clerk User Button */}
              <UserButton />
            </div>
          </div>
        </div>
      </header>

      {/* Global Error Banner if any */}
      {error && (
        <div className="max-w-[1600px] mx-auto w-full px-4 sm:px-6 lg:px-8 pt-4">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
            <div className="flex items-center gap-3">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-600 flex-shrink-0">
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
              </svg>
              <span className="text-red-800 text-sm font-medium">{error}</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Workspace Layout (Conversation + Structured Information ONLY) */}
      <main className="max-w-[1600px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 items-start">
        {/* Left: Conversation (2/3 width) */}
        <section className="lg:col-span-2 h-full" aria-label="Conversation with Wenup">
          <ConversationPanel 
            messages={intake.messages}
            onSendMessage={handleSendMessage}
            sending={sending}
          />
        </section>

        {/* Right: Structured Information (1/3 width) */}
        <aside className="lg:col-span-1" aria-label="Structured Intake Information">
          <StructuredStatePanel 
            state={intake.state}
            completion={intake.completion}
            needsClarification={fieldsNeedingClarification}
          />
        </aside>
      </main>

      {/* Professional Fullscreen PDF Document Preview Modal */}
      <DocumentPreview 
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        pdfUrl={pdfUrl}
        loading={pdfLoading}
        loadingStep={pdfLoadingStep}
        error={pdfError}
        onRetry={handleOpenPreview}
        onDownload={handleDownloadDocument}
        downloading={downloading}
        title={intake.title}
      />
    </div>
  );
}

export default IntakeSession;
