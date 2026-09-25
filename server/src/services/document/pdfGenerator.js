import PDFDocument from 'pdfkit';
import { PDF_STYLES } from './documentStyles.js';

/**
 * Professional PDF Document Generator for Lexora
 * Compiles validated structured intake state into an executive, editorial legal document.
 * 
 * Aesthetic Direction: Notarized Legal Document + Editorial Letterhead + Restrained Modern Print
 * Typography: Serif-dominant body/headers with crisp sans metadata labels
 * 
 * @param {object} state - Validated structured intake state
 * @param {object} options - Generation options (title, sessionCreatedAt, etc.)
 * @returns {Promise<Buffer>} - Resolved PDF binary buffer
 */
export function generatePersonalWishesPDF(state = {}, options = {}) {
   return new Promise((resolve, reject) => {
      try {
         const { PAGE, COLORS, FONTS } = PDF_STYLES;

         const doc = new PDFDocument({
            size: PAGE.SIZE,
            margins: PAGE.MARGINS,
            bufferPages: true,
            info: {
               Title: options.title || 'Personal Wishes Declaration',
               Author: 'Lexora Legal Directives',
               Subject: 'Personal Wishes Declaration Specimen',
               Creator: 'Lexora Platform'
            }
         });

         const chunks = [];
         doc.on('data', chunk => chunks.push(chunk));
         doc.on('end', () => resolve(Buffer.concat(chunks)));
         doc.on('error', err => reject(err));

         const contentWidth = PAGE.CONTENT_WIDTH;
         const leftMargin = PAGE.MARGINS.left;


         // PAGE 1 TOP EDGE STRIPE (EXECUTIVE ACCENT)
         doc.rect(0, 0, PAGE.WIDTH, 3).fillColor(COLORS.BRAND_NAVY).fill();
         doc.rect(leftMargin, 0, 48, 3).fillColor(COLORS.ACCENT_GOLD).fill();


         // EDITORIAL LETTERHEAD & MASTHEAD
         const headerTopY = 28;

         // Distinctive Lexora Monogram Box: Deep Navy with Crisp Serif Monogram
         doc.roundedRect(leftMargin, headerTopY, 19, 19, 3)
            .fillColor(COLORS.BRAND_NAVY).fill();
         doc.fillColor('#FFFFFF').fontSize(11).font(FONTS.SERIF_BOLD)
            .text('L', leftMargin + 5.5, headerTopY + 3.5, { lineBreak: false });

         // Brand Wordmark & Tagline (Serif + Sans contrast)
         doc.fillColor(COLORS.BRAND_NAVY).fontSize(13).font(FONTS.SERIF_BOLD)
            .text('LEXORA', leftMargin + 26, headerTopY + 1, { characterSpacing: 2, lineBreak: false });
         doc.fillColor(COLORS.TERTIARY).fontSize(6.8).font(FONTS.BOLD)
            .text('LEGAL DIRECTIVES PLATFORM', leftMargin + 26, headerTopY + 14, { characterSpacing: 1.2, lineBreak: false });

         // Right Header Classification Stack
         const badgeW = 122;
         const badgeX = leftMargin + contentWidth - badgeW;

         doc.roundedRect(badgeX, headerTopY + 1, badgeW, 14, 2.5)
            .fillColor(COLORS.BG_CARD).fill()
            .strokeColor(COLORS.BORDER_STRONG).lineWidth(0.5).stroke();

         doc.fillColor(COLORS.SECONDARY).fontSize(6.5).font(FONTS.BOLD)
            .text('INTAKE SPECIMEN DRAFT', badgeX, headerTopY + 4, { width: badgeW, align: 'center', characterSpacing: 0.8, lineBreak: false });

         doc.fillColor(COLORS.TERTIARY).fontSize(6.5).font(FONTS.BOLD)
            .text('PRIVILEGED & CONFIDENTIAL', badgeX - 60, headerTopY + 18, { width: badgeW + 60, align: 'right', characterSpacing: 0.8, lineBreak: false });

         // Editorial Double Rule
         doc.moveTo(leftMargin, 54).lineTo(leftMargin + contentWidth, 54)
            .strokeColor(COLORS.BRAND_NAVY).lineWidth(0.75).stroke();
         doc.moveTo(leftMargin, 56.5).lineTo(leftMargin + contentWidth, 56.5)
            .strokeColor(COLORS.ACCENT_GOLD).lineWidth(0.4).stroke();


         // DOCUMENT TITLE BLOCK (EDITORIAL SERIF HIERARCHY)
         doc.y = 66;
         doc.fillColor(COLORS.BRAND_NAVY).fontSize(16.5).font(FONTS.SERIF_BOLD)
            .text('PERSONAL WISHES DECLARATION', leftMargin, doc.y, { characterSpacing: 0.3 });

         doc.moveDown(0.2);
         doc.fillColor(COLORS.SECONDARY).fontSize(8.5).font(FONTS.SERIF_ITALIC)
            .text('A formalized record of declarant identification, testamentary wishes, and asset directives.');


         // DECLARANT SUMMARY CARD (DOSSIER HEADER BLOCK)
         doc.moveDown(0.4);
         const metaY = doc.y;
         const metaHeight = 42;

         doc.roundedRect(leftMargin, metaY, contentWidth, metaHeight, 3)
            .fillColor(COLORS.BG_CARD).fill()
            .strokeColor(COLORS.BORDER_STRONG).lineWidth(0.75).stroke();

         // Left vertical brass accent bar
         doc.roundedRect(leftMargin, metaY, 2.5, metaHeight, 1.25)
            .fillColor(COLORS.ACCENT_GOLD).fill();

         const fullNameDisplay = state?.full_name || 'Not provided at this stage';
         const addressDisplay = state?.home_address || 'Not provided at this stage';
         const genDate = options.sessionCreatedAt
            ? new Date(options.sessionCreatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
            : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

         // Column 1: Declarant
         doc.fillColor(COLORS.TERTIARY).fontSize(6.5).font(FONTS.BOLD)
            .text('DECLARANT / PRINCIPAL', leftMargin + 12, metaY + 6.5, { characterSpacing: 0.8, lineBreak: false });
         doc.fillColor(COLORS.PRIMARY).fontSize(9.5).font(FONTS.SERIF_BOLD)
            .text(fullNameDisplay, leftMargin + 12, metaY + 17.5, { width: 145, ellipsis: true, lineBreak: false });

         // Column 2: Legal Residence
         doc.fillColor(COLORS.TERTIARY).fontSize(6.5).font(FONTS.BOLD)
            .text('RECORDED RESIDENCE', leftMargin + 168, metaY + 6.5, { characterSpacing: 0.8, lineBreak: false });
         doc.fillColor(COLORS.SECONDARY).fontSize(8.2).font(FONTS.SERIF_REGULAR)
            .text(addressDisplay, leftMargin + 168, metaY + 16.5, { width: 195, height: 23, lineGap: 1.2 });

         // Column 3: Generated Date
         doc.fillColor(COLORS.TERTIARY).fontSize(6.5).font(FONTS.BOLD)
            .text('INTAKE RECORD DATE', leftMargin + 370, metaY + 6.5, { characterSpacing: 0.8, lineBreak: false });
         doc.fillColor(COLORS.SECONDARY).fontSize(8.5).font(FONTS.SERIF_REGULAR)
            .text(genDate, leftMargin + 370, metaY + 17.5, { width: 120, lineBreak: false });

         doc.y = metaY + metaHeight + 8;


         // SECTION RENDERER HELPERS
         function checkPageBreak(neededHeight = 40) {
            if (doc.y + neededHeight > 740) {
               doc.addPage();
               doc.y = 48;
            }
         }

         function renderSectionHeader(numStr, title, neededHeight = 50) {
            checkPageBreak(neededHeight);
            const startY = doc.y;

            // Numeral styling: Distinct brass serif numeral set apart from heading
            doc.fillColor(COLORS.ACCENT_GOLD).fontSize(10.5).font(FONTS.SERIF_BOLD)
               .text(numStr, leftMargin + 2, startY + 1, { lineBreak: false });

            doc.fillColor(COLORS.BORDER_STRONG).fontSize(9).font(FONTS.REGULAR)
               .text('|', leftMargin + 19, startY + 1, { lineBreak: false });

            // Section Title: Formal Serif Heading
            doc.fillColor(COLORS.BRAND_NAVY).fontSize(9.8).font(FONTS.SERIF_BOLD)
               .text(title.toUpperCase(), leftMargin + 28, startY + 1.5, { characterSpacing: 0.5, lineBreak: false });

            // Hairline divider rule extending to right
            const textWidth = doc.widthOfString(title.toUpperCase(), { font: FONTS.SERIF_BOLD, size: 9.8, characterSpacing: 0.5 }) + 32;
            doc.moveTo(leftMargin + textWidth + 8, startY + 7)
               .lineTo(leftMargin + contentWidth, startY + 7)
               .strokeColor(COLORS.BORDER)
               .lineWidth(0.5)
               .stroke();

            doc.y = startY + 16;
         }

         function renderKeyValueRow(label, value, isMissing = false, isValueBold = false) {
            checkPageBreak(20);
            const rowY = doc.y;

            // Left Column (Label): Small, restrained graphite label
            doc.fillColor(COLORS.TERTIARY).fontSize(7).font(FONTS.BOLD)
               .text(label.toUpperCase(), leftMargin + 4, rowY + 1, { characterSpacing: 0.5, lineBreak: false });

            // Right Column (Value): Visually dominant serif value
            if (isMissing || !value) {
               doc.fillColor(COLORS.MUTED).fontSize(8.8).font(FONTS.SERIF_ITALIC)
                  .text(value || 'Not provided at this stage.', leftMargin + 125, rowY, { width: contentWidth - 128 });
            } else {
               doc.fillColor(COLORS.PRIMARY).fontSize(9).font(isValueBold ? FONTS.SERIF_BOLD : FONTS.SERIF_REGULAR)
                  .text(value, leftMargin + 125, rowY, { width: contentWidth - 128, lineGap: 1.5 });
            }

            doc.y = Math.max(doc.y, rowY + 13) + 1.5;
         }

         // SECTION 01: PERSONAL INFORMATION
         renderSectionHeader('01', 'Personal Identification & Residence');
         renderKeyValueRow('Full Name', state?.full_name, !state?.full_name, true);
         renderKeyValueRow('Home Address', state?.home_address, !state?.home_address);
         doc.y += 2;

         // SECTION 02: SCOPE OF THIS DOCUMENT
         renderSectionHeader('02', 'Scope of Testamentary Directives');
         let scopeText = 'Not specified at this stage.';
         let isScopeMissing = true;
         if (state?.covers_worldwide_assets === true) {
            scopeText = 'Worldwide Assets — This declaration is intended to encompass assets across all jurisdictions.';
            isScopeMissing = false;
         } else if (state?.covers_worldwide_assets === false) {
            scopeText = 'Domestic / Local Assets Only — Limited strictly to the declarant\'s primary jurisdiction.';
            isScopeMissing = false;
         }
         renderKeyValueRow('Territorial Scope', scopeText, isScopeMissing);
         doc.y += 2;


         // SECTION 03: CHILDREN & DESCENDANTS
         renderSectionHeader('03', 'Descendants & Family Structure');
         let hasChildrenText = 'Not specified at this stage.';
         let isChildrenMissing = true;
         if (state?.has_children === true) {
            hasChildrenText = 'Yes (Descendants declared)';
            isChildrenMissing = false;
         } else if (state?.has_children === false) {
            hasChildrenText = 'No (No descendants or children declared)';
            isChildrenMissing = false;
         }
         renderKeyValueRow('Children Status', hasChildrenText, isChildrenMissing);

         if (state?.has_children === true) {
            if (Array.isArray(state?.children) && state.children.length > 0) {
               checkPageBreak(18 + state.children.length * 14);
               const childrenY = doc.y;
               doc.fillColor(COLORS.TERTIARY).fontSize(7).font(FONTS.BOLD)
                  .text('DECLARED CHILDREN', leftMargin + 4, childrenY + 1, { characterSpacing: 0.5, lineBreak: false });

               let curChildY = childrenY;
               state.children.forEach((child, idx) => {
                  const childName = child.name || `Child ${idx + 1}`;
                  doc.fillColor(COLORS.ACCENT_GOLD).fontSize(8).font(FONTS.BOLD)
                     .text('•', leftMargin + 125, curChildY + 0.5, { lineBreak: false });
                  doc.fillColor(COLORS.PRIMARY).fontSize(9).font(FONTS.SERIF_BOLD)
                     .text(childName, leftMargin + 135, curChildY, { continued: true });
                  doc.fillColor(COLORS.TERTIARY).fontSize(8.5).font(FONTS.SERIF_ITALIC)
                     .text('  —  Primary Descendant');
                  curChildY = doc.y + 1.5;
               });
               doc.y = curChildY;
            } else {
               renderKeyValueRow('Declared Children', 'Children indicated; individual names not yet recorded.', true);
            }
         }
         doc.y += 2;


         // SECTION 04: EXECUTOR (FIDUCIARY APPOINTMENT)
         renderSectionHeader('04', 'Fiduciary Appointment (Executor)');
         renderKeyValueRow('Nominated Executor', state?.executor?.name, !state?.executor?.name, true);
         renderKeyValueRow('Relationship', state?.executor?.relationship, !state?.executor?.relationship);
         renderKeyValueRow('Fiduciary Role', state?.executor?.name ? 'Primary Estate Administrator' : null, !state?.executor?.name);
         doc.y += 2;


         // SECTION 05: SPECIFIC ASSET GIFTS & BEQUESTS (STYLED TABLE)
         renderSectionHeader('05', 'Specific Asset Gifts & Bequests');

         const hasGifts = Array.isArray(state?.specific_gifts) && state.specific_gifts.length > 0;
         if (hasGifts) {
            checkPageBreak(22 + (state.specific_gifts.length * 20));

            const tblHeaderY = doc.y;

            // Top table rule
            doc.moveTo(leftMargin, tblHeaderY).lineTo(leftMargin + contentWidth, tblHeaderY)
               .strokeColor(COLORS.BRAND_NAVY).lineWidth(0.75).stroke();

            // Table Header Fill
            doc.rect(leftMargin, tblHeaderY + 0.75, contentWidth, 16.5)
               .fillColor(COLORS.BG_MUTED).fill();

            doc.fillColor(COLORS.SECONDARY).fontSize(6.5).font(FONTS.BOLD)
               .text('ITEM #', leftMargin + 8, tblHeaderY + 5, { characterSpacing: 0.5, lineBreak: false });
            doc.fillColor(COLORS.SECONDARY).fontSize(6.5).font(FONTS.BOLD)
               .text('DESIGNATED BENEFICIARY', leftMargin + 65, tblHeaderY + 5, { characterSpacing: 0.5, lineBreak: false });
            doc.fillColor(COLORS.SECONDARY).fontSize(6.5).font(FONTS.BOLD)
               .text('ALLOCATED ASSET / BEQUEST', leftMargin + 225, tblHeaderY + 5, { characterSpacing: 0.5, lineBreak: false });

            // Bottom header rule
            doc.moveTo(leftMargin, tblHeaderY + 17.25).lineTo(leftMargin + contentWidth, tblHeaderY + 17.25)
               .strokeColor(COLORS.BORDER_STRONG).lineWidth(0.5).stroke();

            let currentGiftY = tblHeaderY + 17.25;

            state.specific_gifts.forEach((gift, idx) => {
               checkPageBreak(20);
               const rowHeight = 19;

               // Subtle alternating row fill
               if (idx % 2 === 1) {
                  doc.rect(leftMargin, currentGiftY, contentWidth, rowHeight)
                     .fillColor(COLORS.BG_CARD).fill();
               }

               // Hairline bottom border
               doc.moveTo(leftMargin, currentGiftY + rowHeight)
                  .lineTo(leftMargin + contentWidth, currentGiftY + rowHeight)
                  .strokeColor(COLORS.BORDER).lineWidth(0.5).stroke();

               // Gift Index
               doc.fillColor(COLORS.TERTIARY).fontSize(7.2).font(FONTS.BOLD)
                  .text(`GIFT ${String(idx + 1).padStart(2, '0')}`, leftMargin + 8, currentGiftY + 5, { lineBreak: false });

               // Beneficiary Name (Serif Bold)
               doc.fillColor(COLORS.PRIMARY).fontSize(9).font(FONTS.SERIF_BOLD)
                  .text(gift.recipient || 'Named Recipient', leftMargin + 65, currentGiftY + 4.5, { width: 150, lineBreak: false, ellipsis: true });

               // Asset Item (Serif Regular)
               doc.fillColor(COLORS.SECONDARY).fontSize(9).font(FONTS.SERIF_REGULAR)
                  .text(gift.item || 'Specified Asset', leftMargin + 225, currentGiftY + 4.5, { width: contentWidth - 230, lineBreak: false, ellipsis: true });

               currentGiftY += rowHeight;
               doc.y = currentGiftY;
            });

            // Bottom table rule
            doc.moveTo(leftMargin, currentGiftY).lineTo(leftMargin + contentWidth, currentGiftY)
               .strokeColor(COLORS.BRAND_NAVY).lineWidth(0.75).stroke();

            doc.y += 6;
         } else {
            renderKeyValueRow('Specific Gifts', 'No specific individual gifts or bequests declared.', true);
            doc.y += 2;
         }

         // SECTION 06: RESIDUAL DIRECTIVES (QUOTED FREE TEXT)
         const wishesText = state?.additional_wishes;
         renderSectionHeader('06', 'Residual & Additional Directives', wishesText ? 65 : 45);

         if (wishesText) {
            doc.font(FONTS.SERIF_ITALIC).fontSize(9);
            const textHeight = doc.heightOfString(wishesText, { width: contentWidth - 32, lineGap: 2.2 });
            const cardHeight = Math.max(textHeight + 16, 30);

            checkPageBreak(cardHeight + 8);
            const actualCardY = doc.y;

            doc.roundedRect(leftMargin, actualCardY, contentWidth, cardHeight, 3)
               .fillColor(COLORS.BG_CARD).fill()
               .strokeColor(COLORS.BORDER).lineWidth(0.75).stroke();

            // Left vertical brass accent bar
            doc.roundedRect(leftMargin, actualCardY, 2.5, cardHeight, 1.25)
               .fillColor(COLORS.ACCENT_GOLD).fill();

            doc.fillColor(COLORS.PRIMARY).fontSize(9).font(FONTS.SERIF_ITALIC)
               .text(`"${wishesText}"`, leftMargin + 16, actualCardY + 8, {
                  width: contentWidth - 32,
                  lineGap: 2.2
               });

            doc.y = actualCardY + cardHeight + 8;
         } else {
            renderKeyValueRow('Directives', 'No additional residual directives specified.', true);
            doc.y += 2;
         }


         // STATUTORY DISCLAIMER NOTICE BOX

         if (doc.y > 730) {
            doc.addPage();
            doc.y = 48;
         } else {
            doc.y += 4;
         }

         const disY = doc.y;
         const disHeight = 42;
         doc.roundedRect(leftMargin, disY, contentWidth, disHeight, 3)
            .fillColor(COLORS.BG_NOTICE).fill()
            .strokeColor(COLORS.BORDER_NOTICE).lineWidth(0.75).stroke();

         // Left amber indicator bar
         doc.roundedRect(leftMargin, disY, 2.5, disHeight, 1.25)
            .fillColor(COLORS.ACCENT_GOLD_LIGHT).fill();

         doc.fillColor(COLORS.TEXT_NOTICE_TITLE).fontSize(7).font(FONTS.BOLD)
            .text('IMPORTANT STATUTORY NOTICE — FICTIONAL DEMONSTRATION SPECIMEN', leftMargin + 12, disY + 6.5, { characterSpacing: 0.6, lineBreak: false });

         doc.fillColor(COLORS.TEXT_NOTICE_BODY).fontSize(7).font(FONTS.SERIF_REGULAR)
            .text(
               'This document is a demonstration draft compiled by the Lexora platform for demonstration purposes only. It does not constitute legal advice and is not legally binding. For formal testamentary directives, wills, or estate administration, please consult a qualified legal professional in your jurisdiction.',
               leftMargin + 12,
               disY + 17,
               { width: contentWidth - 24, lineGap: 1.5 }
            );


         // RUNNING HEADERS & FOOTERS (Multi-page pass)

         const range = doc.bufferedPageRange();
         const totalPages = range.count;

         for (let i = range.start; i < range.start + totalPages; i++) {
            doc.switchToPage(i);

            // Temporarily zero margins during stamping to prevent auto-pagebreak
            const originalMargins = { ...doc.page.margins };
            doc.page.margins = { top: 0, bottom: 0, left: 0, right: 0 };

            // Running Header on page 2+
            if (i > 0) {
               doc.rect(0, 0, PAGE.WIDTH, 2.5).fillColor(COLORS.BRAND_NAVY).fill();
               doc.rect(leftMargin, 0, 40, 2.5).fillColor(COLORS.ACCENT_GOLD).fill();

               doc.fillColor(COLORS.BRAND_NAVY).circle(leftMargin + 4, 25, 2.5).fill();
               doc.fillColor(COLORS.BRAND_NAVY).fontSize(8).font(FONTS.SERIF_BOLD)
                  .text('LEXORA', leftMargin + 10, 21.5, { characterSpacing: 1.5, lineBreak: false });
               doc.fillColor(COLORS.TERTIARY).fontSize(7.5).font(FONTS.SERIF_ITALIC)
                  .text('Personal Wishes Declaration • Specimen Draft', leftMargin + 65, 22, { lineBreak: false });
               doc.fillColor(COLORS.MUTED).fontSize(7).font(FONTS.BOLD)
                  .text('CONFIDENTIAL', leftMargin, 22, { width: contentWidth, align: 'right', characterSpacing: 0.5, lineBreak: false });

               doc.moveTo(leftMargin, 34).lineTo(leftMargin + contentWidth, 34)
                  .strokeColor(COLORS.BORDER).lineWidth(0.5).stroke();
            }

            // Running Footer on EVERY page (at y = 805, rule at y = 798)
            const footerRuleY = 798;
            const footerTextY = 805;

            doc.moveTo(leftMargin, footerRuleY).lineTo(leftMargin + contentWidth, footerRuleY)
               .strokeColor(COLORS.BORDER).lineWidth(0.5).stroke();

            doc.fillColor(COLORS.TERTIARY).fontSize(7).font(FONTS.REGULAR)
               .text('Lexora™ Legal Directives Platform • Private & Confidential Intake Specimen — Not Legal Advice', leftMargin, footerTextY, { lineBreak: false });

            doc.fillColor(COLORS.TERTIARY).fontSize(7).font(FONTS.BOLD)
               .text(`Page ${i + 1} of ${totalPages}`, leftMargin, footerTextY, { width: contentWidth, align: 'right', lineBreak: false });

            // Restore original margins
            doc.page.margins = originalMargins;
         }

         doc.end();
      } catch (err) {
         reject(err);
      }
   });
}
