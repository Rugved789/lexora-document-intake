import { generatePersonalWishesPDF } from './pdfGenerator.js';
import { generatePersonalWishesDocument, getCompletionStatus } from './documentGenerator.js';

/**
 * Document Service Facade
 * Single source of truth for document generation (PDF and legacy text representation).
 */
class DocumentService {
  /**
   * Generate an authentic, professionally styled PDF buffer from structured state.
   * 
   * @param {object} state - Validated structured state
   * @param {object} options - Generation options (title, sessionCreatedAt)
   * @returns {Promise<Buffer>}
   */
  async generatePDF(state, options = {}) {
    return generatePersonalWishesPDF(state, options);
  }

  /**
   * Legacy text generator for backwards compatibility and automated testing.
   * 
   * @param {object} state - Validated structured state
   * @returns {string}
   */
  getTextDocument(state) {
    return generatePersonalWishesDocument(state);
  }

  /**
   * Get completion status for an intake state.
   * 
   * @param {object} state
   * @returns {object}
   */
  getCompletionStatus(state) {
    return getCompletionStatus(state);
  }
}

export const documentService = new DocumentService();
export default documentService;
