/**
 * Professional PDF Document Styling Tokens for Lexora
 * Premium Legal-Tech Aesthetic: Deep Midnight Navy + Rich Slate + Warm Gold Accent + Crisp A4 Geometry
 */
export const PDF_STYLES = {
  PAGE: {
    SIZE: 'A4', // 595.28 x 841.89 points
    WIDTH: 595.28,
    HEIGHT: 841.89,
    MARGINS: {
      top: 40,
      bottom: 48,
      left: 48,
      right: 48
    },
    get CONTENT_WIDTH() {
      return this.WIDTH - (this.MARGINS.left + this.MARGINS.right); // ~499.28 pt
    }
  },
  COLORS: {
    BRAND_NAVY: '#0B132B',       // Deep midnight navy
    BRAND_NAVY_LIGHT: '#1C2541', // Dark slate navy
    PRIMARY: '#0F172A',          // Deep charcoal / ink
    SECONDARY: '#334155',        // Slate 700 (body & emphasis)
    TERTIARY: '#64748B',         // Slate 500 (metadata labels)
    MUTED: '#94A3B8',            // Light slate / inactive
    BORDER: '#E2E8F0',           // Crisp table/card border
    BORDER_STRONG: '#CBD5E1',    // Distinct section border
    ACCENT_GOLD: '#B8860B',      // Refined dark gold
    ACCENT_GOLD_LIGHT: '#D97706',// Warm amber gold
    BG_CARD: '#F8FAFC',          // Crisp slate card fill
    BG_MUTED: '#F1F5F9',         // Subtle table header fill
    BG_NOTICE: '#FFFDF7',        // Amber disclaimer background
    BORDER_NOTICE: '#FDE68A',    // Amber notice border
    TEXT_NOTICE_TITLE: '#92400E',
    TEXT_NOTICE_BODY: '#78350F'
  },
  FONTS: {
    REGULAR: 'Helvetica',
    BOLD: 'Helvetica-Bold',
    OBLIQUE: 'Helvetica-Oblique',
    BOLD_OBLIQUE: 'Helvetica-BoldOblique',
    SERIF_BOLD: 'Times-Bold',
    SERIF_REGULAR: 'Times-Roman',
    SERIF_ITALIC: 'Times-Italic'
  }
};

