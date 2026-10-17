import { jsPDF } from 'jspdf';
import { Product } from '../types';

/**
 * Generates an authentic, high-quality printable PDF colouring book
 * complete with cover, colouring pages, tracing guidelines, and an artist certificate!
 */
export async function generateProductPDF(product: Product, childName: string = ''): Promise<void> {
  // A4 dimensions in mm: 210 x 297
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;

  // ROUTE TO COMPREHENSIVE 18-CATEGORY PLAYBOOK GENERATOR IF REQUESTED
  if (product.id === 'prod-playbook-100' || product.title.toLowerCase().includes('playbook')) {
    generate100PagePlaybookPDF(doc, product, childName, pageWidth, pageHeight);
    const filename = `${product.title.replace(/[^a-zA-Z0-9]/g, '_')}_Little_Colour_World.pdf`;
    doc.save(filename);
    return;
  }

  // --- PAGE 1: COVER PAGE ---
  // Soft pastel border
  doc.setDrawColor(255, 217, 61); // #FFD93D
  doc.setLineWidth(3);
  doc.roundedRect(12, 12, pageWidth - 24, pageHeight - 24, 6, 6);

  doc.setDrawColor(107, 203, 255); // #6BCBFF
  doc.setLineWidth(1);
  doc.roundedRect(15, 15, pageWidth - 30, pageHeight - 30, 4, 4);

  // Brand Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(255, 138, 101); // #FF8A65
  doc.text('LITTLE COLOUR WORLD', pageWidth / 2, 28, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text('Little Hands, Big Imagination! • Printable Activity Book', pageWidth / 2, 34, { align: 'center' });

  // Main Book Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(26);
  doc.setTextColor(40, 40, 40);
  
  // Wrap long titles
  const splitTitle = doc.splitTextToSize(product.title, 160);
  doc.text(splitTitle, pageWidth / 2, 50, { align: 'center' });

  // Floating age badge in cover
  doc.setFillColor(255, 243, 196);
  doc.setDrawColor(255, 217, 61);
  doc.roundedRect(pageWidth / 2 - 30, 64, 60, 9, 3, 3, 'FD');
  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  doc.text(`Designed for ${product.ageGroup}`, pageWidth / 2, 70, { align: 'center' });

  // Center Cover Frame
  doc.setDrawColor(220, 220, 220);
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(30, 80, 150, 120, 8, 8, 'FD');

  // Decorative vector art on cover
  doc.setDrawColor(50, 50, 50);
  doc.setLineWidth(1.5);
  // Head
  doc.circle(pageWidth / 2, 135, 36);
  // Ears
  doc.circle(pageWidth / 2 - 28, 108, 12);
  doc.circle(pageWidth / 2 + 28, 108, 12);
  // Eyes
  doc.setFillColor(40, 40, 40);
  doc.circle(pageWidth / 2 - 12, 130, 3.5, 'F');
  doc.circle(pageWidth / 2 + 12, 130, 3.5, 'F');
  // Cheerful smile
  doc.setLineWidth(1.2);
  doc.moveTo(pageWidth / 2 - 10, 142);
  doc.curveTo(pageWidth / 2 - 5, 148, pageWidth / 2 + 5, 148, pageWidth / 2 + 10, 142);
  doc.stroke();

  // Caption inside frame
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text('Ready to Colour & Create Magic!', pageWidth / 2, 188, { align: 'center' });

  // "This book belongs to" section
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 180, 255); // Lavender
  doc.roundedRect(30, 212, 150, 32, 4, 4, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(80, 80, 80);
  doc.text('This special book belongs to:', pageWidth / 2, 222, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(255, 138, 101);
  if (childName) {
    doc.text(childName, pageWidth / 2, 234, { align: 'center' });
  } else {
    doc.setDrawColor(180, 180, 180);
    doc.setLineDashPattern([2, 2], 0);
    doc.line(45, 234, 165, 234);
    doc.setLineDashPattern([], 0);
  }

  // Cover Footer
  doc.setFontSize(8);
  doc.setTextColor(140, 140, 140);
  doc.text(`Official PDF Edition • ${product.pageCount} Fun Printable Pages • www.littlecolourworld.com`, pageWidth / 2, 275, { align: 'center' });

  // --- PAGE 2: MAIN COLOURING PAGE 1 ---
  doc.addPage();
  drawPageBorder(doc, pageWidth, pageHeight, '1');

  // Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(40, 40, 40);
  doc.text(product.samplePages[0]?.title || 'Magical Jungle Friend', pageWidth / 2, 26, { align: 'center' });

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(120, 120, 120);
  doc.text('Colour within the bold lines! Use your favourite bright crayons.', pageWidth / 2, 33, { align: 'center' });

  // Big Bold Printable Lion / Animal
  const centerX = pageWidth / 2;
  const centerY = 135;

  doc.setDrawColor(30, 30, 30);
  doc.setLineWidth(2.2);

  // Big round mane
  doc.circle(centerX, centerY, 55);
  // Mane scallop tufts
  for (let angle = 0; angle < 360; angle += 30) {
    const rad = (angle * Math.PI) / 180;
    const px = centerX + Math.cos(rad) * 55;
    const py = centerY + Math.sin(rad) * 55;
    doc.circle(px, py, 11);
  }

  // Head
  doc.circle(centerX, centerY, 40);
  // Ears
  doc.circle(centerX - 26, centerY - 32, 12);
  doc.circle(centerX + 26, centerY - 32, 12);
  doc.circle(centerX - 26, centerY - 32, 6);
  doc.circle(centerX + 26, centerY - 32, 6);

  // Cheerful eyes
  doc.setFillColor(30, 30, 30);
  doc.circle(centerX - 15, centerY - 8, 4, 'F');
  doc.circle(centerX + 15, centerY - 8, 4, 'F');

  // Cute Nose
  doc.triangle(centerX - 8, centerY + 3, centerX + 8, centerY + 3, centerX, centerY + 12, 'FD');
  // Smile
  doc.line(centerX, centerY + 12, centerX, centerY + 18);
  doc.setLineWidth(1.8);
  doc.moveTo(centerX - 12, centerY + 18);
  doc.curveTo(centerX - 6, centerY + 24, centerX + 6, centerY + 24, centerX + 12, centerY + 18);
  doc.stroke();

  // Whiskers
  doc.setLineWidth(1.2);
  doc.line(centerX - 35, centerY + 6, centerX - 18, centerY + 8);
  doc.line(centerX - 36, centerY + 16, centerX - 18, centerY + 14);
  doc.line(centerX + 18, centerY + 8, centerX + 35, centerY + 6);
  doc.line(centerX + 18, centerY + 14, centerX + 36, centerY + 16);

  // Paws
  doc.setLineWidth(2);
  doc.ellipse(centerX - 22, centerY + 65, 18, 12);
  doc.ellipse(centerX + 22, centerY + 65, 18, 12);

  // Crayons Palette Suggestion at bottom
  doc.setDrawColor(200, 200, 200);
  doc.setFillColor(252, 252, 252);
  doc.roundedRect(25, 235, 160, 26, 4, 4, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);
  doc.text('RECOMMENDED CRAYONS:', 32, 244);

  // Draw cute crayon color swatches
  const crayons = [
    { name: 'Yellow', r: 255, g: 217, b: 61 },
    { name: 'Orange', r: 255, g: 138, b: 101 },
    { name: 'Sky Blue', r: 107, g: 203, b: 255 },
    { name: 'Mint Green', r: 184, g: 242, b: 200 },
  ];

  crayons.forEach((c, idx) => {
    const xPos = 32 + idx * 38;
    doc.setFillColor(c.r, c.g, c.b);
    doc.setDrawColor(60, 60, 60);
    doc.setLineWidth(0.6);
    doc.roundedRect(xPos, 248, 10, 7, 2, 2, 'FD');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(c.name, xPos + 13, 253);
  });

  // --- PAGE 3: TRACING & ACTIVITY WORKSHEET ---
  doc.addPage();
  drawPageBorder(doc, pageWidth, pageHeight, '2');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(40, 40, 40);
  doc.text('Preschool Tracing & Counting Fun', pageWidth / 2, 26, { align: 'center' });

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(120, 120, 120);
  doc.text('Trace the dashed lines with your pencil, then colour each picture!', pageWidth / 2, 33, { align: 'center' });

  // Activity 1: Alphabet tracing
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(255, 138, 101);
  doc.text('1. Trace the Big Letters:', 25, 46);

  ['A', 'B', 'C', 'D'].forEach((letter, i) => {
    const x = 35 + i * 40;
    doc.setDrawColor(220, 220, 220);
    doc.setFillColor(255, 255, 255);
    doc.rect(x - 8, 52, 28, 28, 'FD');

    // Solid letter guide
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(26);
    doc.setTextColor(40, 40, 40);
    doc.text(letter, x + 6, 73, { align: 'center' });
  });

  // Activity 2: Number dots counting
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(107, 203, 255);
  doc.text('2. Count the Smiling Stars and Colour:', 25, 96);

  for (let row = 1; row <= 3; row++) {
    const y = 100 + row * 22;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(60, 60, 60);
    doc.text(`${row}`, 30, y + 6);

    for (let star = 0; star < row; star++) {
      const sx = 48 + star * 22;
      doc.setDrawColor(40, 40, 40);
      doc.setLineWidth(1.2);
      doc.circle(sx, y + 4, 7);
      // Eye dots
      doc.circle(sx - 2, y + 3, 1, 'FD');
      doc.circle(sx + 2, y + 3, 1, 'FD');
    }
  }

  // Activity 3: Pattern Path
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(184, 150, 255);
  doc.text('3. Help the Bunny Reach the Carrot (Trace the Path):', 25, 185);

  doc.setLineWidth(1.5);
  doc.setLineDashPattern([3, 3], 0);
  doc.setDrawColor(80, 80, 80);
  doc.moveTo(35, 205);
  doc.curveTo(70, 190, 100, 220, 130, 200);
  doc.curveTo(150, 190, 170, 215, 185, 205);
  doc.stroke();
  doc.setLineDashPattern([], 0);

  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text('Start [Bunny]', 30, 215);
  doc.text('[Sweet Carrot] Finish', 160, 215);

  // Parent encouragement note
  doc.setFillColor(255, 248, 225);
  doc.setDrawColor(255, 217, 61);
  doc.roundedRect(25, 235, 160, 24, 4, 4, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(140, 90, 0);
  doc.text('Parent Tip for Fine Motor Skills:', 30, 243);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(80, 80, 80);
  doc.text('Praise effort over perfection! Using triangular crayons helps little toddlers develop the tripod pencil grip.', 30, 250);

  // --- PAGE 4: CERTIFICATE OF COMPLETION ---
  doc.addPage();
  // Fancy double gold border
  doc.setDrawColor(255, 217, 61);
  doc.setLineWidth(4);
  doc.roundedRect(12, 12, pageWidth - 24, pageHeight - 24, 8, 8);

  doc.setDrawColor(255, 138, 101);
  doc.setLineWidth(1.2);
  doc.roundedRect(16, 16, pageWidth - 32, pageHeight - 32, 6, 6);

  // Ribbon Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(255, 138, 101);
  doc.text('LITTLE COLOUR WORLD AWARDS', pageWidth / 2, 45, { align: 'center' });

  doc.setFontSize(28);
  doc.setTextColor(30, 30, 30);
  doc.text('SUPER ARTIST CERTIFICATE', pageWidth / 2, 65, { align: 'center' });

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text('This proud certificate is joyfully awarded to:', pageWidth / 2, 85, { align: 'center' });

  // Recipient line
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(255, 138, 101);
  const awardee = childName ? childName : '____________________________________';
  doc.text(awardee, pageWidth / 2, 115, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.setTextColor(70, 70, 70);
  const bodyText = `For showing tremendous imagination, fine motor coordination, and artistic joy in completing the ${product.title}!`;
  const splitBody = doc.splitTextToSize(bodyText, 140);
  doc.text(splitBody, pageWidth / 2, 135, { align: 'center' });

  // Big Gold Star in center
  doc.setFillColor(255, 217, 61);
  doc.setDrawColor(245, 158, 11);
  doc.setLineWidth(1.5);
  doc.circle(pageWidth / 2, 185, 22, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(140, 90, 0);
  doc.text('★ ★ ★', pageWidth / 2, 183, { align: 'center' });
  doc.text('NO. 1 STAR', pageWidth / 2, 190, { align: 'center' });

  // Signature and Date lines
  doc.setLineWidth(0.8);
  doc.setDrawColor(160, 160, 160);
  doc.line(35, 235, 85, 235);
  doc.line(125, 235, 175, 235);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  doc.text('Parent / Teacher Signature', 60, 242, { align: 'center' });
  doc.text('Date Completed', 150, 242, { align: 'center' });

  // Save the PDF
  const filename = `${product.title.replace(/[^a-zA-Z0-9]/g, '_')}_Little_Colour_World.pdf`;
  doc.save(filename);
}

/**
 * Generates the complete 18-category Kids' Activity Playbook PDF
 * covering all developmental learning domains, answer keys, certificate, and back cover.
 */
function generate100PagePlaybookPDF(
  doc: jsPDF,
  product: Product,
  childName: string,
  width: number,
  height: number
): void {
  // Helper for consistent playbook page borders
  const drawPlaybookBorder = (categoryNum: number, categoryTitle: string, pageNum: number) => {
    doc.setDrawColor(255, 107, 107); // Coral Red
    doc.setLineWidth(1.6);
    doc.roundedRect(10, 10, width - 20, height - 20, 5, 5);

    // Top Category Banner
    doc.setFillColor(255, 241, 242);
    doc.roundedRect(14, 12, width - 28, 8, 2, 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(225, 29, 72);
    doc.text(`CATEGORY ${categoryNum} OF 18: ${categoryTitle.toUpperCase()}`, width / 2, 17.5, { align: 'center' });

    // Bottom Footer
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text("Little Colour World • Kids' Activity Playbook (100-Page Edition)", 16, height - 13);
    doc.text(`Page ${pageNum} of 100`, width - 16, height - 13, { align: 'right' });
  };

  // --- 1. FRONT COVER ---
  doc.setDrawColor(255, 107, 107); // Coral
  doc.setLineWidth(3);
  doc.roundedRect(10, 10, width - 20, height - 20, 8, 8);
  doc.setDrawColor(255, 217, 61); // Gold
  doc.setLineWidth(1.2);
  doc.roundedRect(14, 14, width - 28, height - 28, 6, 6);

  // Top series banner
  doc.setFillColor(255, 240, 243);
  doc.roundedRect(24, 22, width - 48, 11, 4, 4, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(225, 29, 72);
  doc.text('LITTLE COLOUR WORLD • EARLY LEARNING PLAYBOOK SERIES', width / 2, 29, { align: 'center' });

  // Main Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(26);
  doc.setTextColor(30, 41, 59);
  doc.text("KIDS' ACTIVITY PLAYBOOK", width / 2, 48, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(234, 88, 12);
  doc.text('100 Pages of Joyful Learning & Creative Discovery', width / 2, 57, { align: 'center' });

  // Age Group & Category Badge
  doc.setFillColor(254, 240, 138); // Yellow badge
  doc.roundedRect(width / 2 - 45, 63, 90, 9, 3, 3, 'F');
  doc.setFontSize(9.5);
  doc.setTextColor(133, 77, 14);
  doc.text('Designed for Ages 3–6 • All 18 Activity Categories', width / 2, 69, { align: 'center' });

  // Cover Centerpiece Illustration
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(25, 78, 160, 115, 6, 6, 'FD');

  // Friendly Cartoon Lion on Cover
  const cX = width / 2;
  const cY = 132;
  doc.setDrawColor(30, 30, 30);
  doc.setLineWidth(2);
  doc.circle(cX, cY, 44); // Mane
  doc.circle(cX, cY, 32); // Head
  doc.circle(cX - 22, cY - 24, 9); // Left Ear
  doc.circle(cX + 22, cY - 24, 9); // Right Ear
  doc.setFillColor(30, 30, 30);
  doc.circle(cX - 11, cY - 6, 3.5, 'F'); // Left Eye
  doc.circle(cX + 11, cY - 6, 3.5, 'F'); // Right Eye
  doc.triangle(cX - 6, cY + 3, cX + 6, cY + 3, cX, cY + 10, 'FD'); // Nose
  doc.line(cX, cY + 10, cX, cY + 15);
  doc.curveTo(cX - 8, cY + 18, cX + 8, cY + 18, cX + 8, cY + 15); // Smile

  // Personalization Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(199, 210, 254);
  doc.roundedRect(25, 202, 160, 32, 4, 4, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(71, 85, 105);
  doc.text('This Special Playbook Belongs To:', width / 2, 212, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(225, 29, 72);
  if (childName) {
    doc.text(childName, width / 2, 224, { align: 'center' });
  } else {
    doc.setDrawColor(148, 163, 184);
    doc.setLineDashPattern([2, 2], 0);
    doc.line(40, 225, 170, 225);
    doc.setLineDashPattern([], 0);
  }

  // Cover Feature Highlights Pill
  const features = ['✓ Pre-Writing Tracing', '✓ Mazes & Puzzles', '✓ A-Z & Numbers', '✓ Answer Keys'];
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(features.join('     •     '), width / 2, 250, { align: 'center' });

  // Cover Footer
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text('Printable Edition (A4) • Teacher & Parent Approved • www.littlecolourworld.com', width / 2, 275, { align: 'center' });

  // --- 2. TITLE PAGE & EDUCATOR GUIDE ---
  doc.addPage();
  doc.setDrawColor(255, 107, 107);
  doc.setLineWidth(1.5);
  doc.roundedRect(10, 10, width - 20, height - 20, 5, 5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(30, 41, 59);
  doc.text("Educator & Parent Learning Guide", width / 2, 26, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text('Foundational Early Childhood Skill Development System', width / 2, 33, { align: 'center' });

  // 4 Milestone Cards
  const pillars = [
    { title: '1. Fine Motor & Handwriting', desc: 'Pre-writing line paths, pencil grip control, and finger-muscle strength.' },
    { title: '2. Numeracy & Math Logic', desc: 'Number recognition, 1-100 visual counting, shape classification, and addition.' },
    { title: '3. Phonics & Observation', desc: 'Alphabet phonics, I-Spy scanning, and spot-the-difference visual focus.' },
    { title: '4. Creative Self-Expression', desc: 'Freehand doodling, healthy daily habits, and nature life-cycle discovery.' },
  ];

  pillars.forEach((p, idx) => {
    const yP = 46 + idx * 28;
    doc.setFillColor(254, 242, 242);
    doc.setDrawColor(254, 202, 202);
    doc.roundedRect(20, yP, 170, 23, 3, 3, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(190, 18, 60);
    doc.text(p.title, 26, yP + 8);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    doc.text(p.desc, 26, yP + 16);
  });

  // Daily Schedule Box
  doc.setFillColor(240, 253, 250);
  doc.setDrawColor(153, 246, 228);
  doc.roundedRect(20, 168, 170, 36, 4, 4, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 118, 110);
  doc.text('Recommended Routine for Parents & Teachers:', 26, 178);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  doc.text('• Dedicate 15 to 20 minutes daily of relaxed, screen-free playtime.', 26, 186);
  doc.text('• Praise patience, focus, and curiosity rather than perfection.', 26, 192);
  doc.text('• Encourage verbal expression: ask your child to describe what they are coloring!', 26, 198);

  // Supplies Checklist
  doc.setFillColor(254, 252, 232);
  doc.setDrawColor(254, 240, 138);
  doc.roundedRect(20, 212, 170, 34, 4, 4, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(133, 77, 14);
  doc.text('Recommended Supplies Checklist:', 26, 222);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text('□ Chunky triangular crayons (encourages correct 3-finger tripod grip)', 26, 230);
  doc.text('□ Washable child-safe sketch pens & soft HB pencils', 26, 236);
  doc.text('□ Star reward stickers & child safety scissors', 26, 242);

  // --- 3. TABLE OF CONTENTS ---
  doc.addPage();
  doc.setDrawColor(255, 107, 107);
  doc.setLineWidth(1.5);
  doc.roundedRect(10, 10, width - 20, height - 20, 5, 5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(30, 41, 59);
  doc.text('Table of Contents', width / 2, 26, { align: 'center' });
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('18 Foundational Activity Categories for Ages 3–6', width / 2, 33, { align: 'center' });

  const categories = [
    { num: 1, title: 'Alphabet Learning (A–Z)', page: 4 },
    { num: 2, title: 'Numbers & Counting (1–100)', page: 5 },
    { num: 3, title: 'Shapes & Colors', page: 6 },
    { num: 4, title: 'Tracing & Handwriting', page: 7 },
    { num: 5, title: 'Coloring Activities', page: 8 },
    { num: 6, title: 'Animals & Birds', page: 9 },
    { num: 7, title: 'Fruits & Vegetables', page: 10 },
    { num: 8, title: 'Matching Activities', page: 11 },
    { num: 9, title: 'Mazes & Puzzles', page: 12 },
    { num: 10, title: 'Spot the Difference', page: 13 },
    { num: 11, title: 'Dot-to-Dot Activities', page: 14 },
    { num: 12, title: 'Logical Thinking Games', page: 15 },
    { num: 13, title: 'Memory & Observation', page: 16 },
    { num: 14, title: 'Basic Mathematics', page: 17 },
    { num: 15, title: 'Creative Drawing', page: 18 },
    { num: 16, title: 'Good Habits & Daily Routine', page: 19 },
    { num: 17, title: 'Nature & Environment', page: 20 },
    { num: 18, title: 'Fun Educational Games', page: 21 },
  ];

  // Two column layout for TOC
  categories.forEach((cat, idx) => {
    const isCol2 = idx >= 9;
    const colX = isCol2 ? 112 : 22;
    const rowIdx = isCol2 ? idx - 9 : idx;
    const yT = 46 + rowIdx * 20;

    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(colX, yT, 78, 16, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(225, 29, 72);
    doc.text(`${cat.num}.`, colX + 4, yT + 10);

    doc.setTextColor(30, 41, 59);
    doc.text(cat.title, colX + 11, yT + 10);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(148, 163, 184);
    doc.text(`p. ${cat.page}`, colX + 72, yT + 10, { align: 'right' });
  });

  // End Matter in TOC
  doc.setFillColor(254, 243, 199);
  doc.setDrawColor(252, 211, 77);
  doc.roundedRect(22, 234, 168, 16, 3, 3, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(146, 64, 14);
  doc.text('★ Answer Keys (p. 22)   •   ★ Super Artist Certificate (p. 23)   •   ★ Back Cover (p. 24)', width / 2, 244, { align: 'center' });

  // --- 4. CATEGORY 1: ALPHABET LEARNING ---
  doc.addPage();
  drawPlaybookBorder(1, 'Alphabet Learning (A–Z)', 4);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(30, 41, 59);
  doc.text('Letter A is for Apple! /æ/ /æ/ Apple', width / 2, 30, { align: 'center' });
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Say the letter sound out loud, trace the big letter, and colour the smiling apple!', width / 2, 37, { align: 'center' });

  // Big Hollow Letters A & a
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(72);
  doc.setTextColor(225, 29, 72);
  doc.text('A', 50, 95, { align: 'center' });
  doc.text('a', 95, 95, { align: 'center' });

  // Smiling Apple Art
  doc.setDrawColor(225, 29, 72);
  doc.setLineWidth(2.2);
  doc.circle(150, 75, 25);
  // Leaf & Stem
  doc.setDrawColor(34, 197, 94);
  doc.ellipse(150, 46, 8, 4);
  doc.setDrawColor(120, 53, 15);
  doc.line(150, 50, 150, 43);

  // Tracing Practice Lines
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(71, 85, 105);
  doc.text('Trace Uppercase and Lowercase Letters:', 22, 120);

  for (let r = 0; r < 3; r++) {
    const yL = 130 + r * 22;
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.8);
    doc.line(22, yL, 188, yL);
    doc.setLineDashPattern([2, 2], 0);
    doc.line(22, yL + 8, 188, yL + 8);
    doc.setLineDashPattern([], 0);
    doc.line(22, yL + 16, 188, yL + 16);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(148, 163, 184);
    doc.text('A     A     A     A     a     a     a     a', 28, yL + 13);
  }

  // Word association prompt
  doc.setFillColor(254, 242, 242);
  doc.roundedRect(22, 205, 166, 32, 3, 3, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(190, 18, 60);
  doc.text('Circle all other words that begin with the /A/ sound:', 28, 216);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(51, 65, 85);
  doc.text('1. [ Ant 🐜 ]        2. [ Astronaut 👨‍🚀 ]        3. [ Alligator 🐊 ]        4. [ Acorn 🌰 ]', 28, 227);

  // --- 5. CATEGORY 2: NUMBERS AND COUNTING ---
  doc.addPage();
  drawPlaybookBorder(2, 'Numbers & Counting (1–100)', 5);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(30, 41, 59);
  doc.text('The 1 to 10 Balloon Fiesta!', width / 2, 30, { align: 'center' });
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Count the floating party balloons, trace the numbers, and colour according to the code.', width / 2, 37, { align: 'center' });

  // 10 Floating Balloons with Numbers
  for (let b = 1; b <= 10; b++) {
    const col = (b - 1) % 5;
    const row = Math.floor((b - 1) / 5);
    const bX = 35 + col * 35;
    const bY = 62 + row * 60;

    doc.setDrawColor(30, 41, 59);
    doc.setLineWidth(1.8);
    doc.ellipse(bX, bY, 13, 16);
    // Balloon knot & string
    doc.triangle(bX - 2, bY + 16, bX + 2, bY + 16, bX, bY + 19, 'FD');
    doc.setLineDashPattern([1.5, 1.5], 0);
    doc.line(bX, bY + 19, bX, bY + 30);
    doc.setLineDashPattern([], 0);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(234, 88, 12);
    doc.text(`${b}`, bX, bY + 6, { align: 'center' });
  }

  // Counting Practice Bar
  doc.setFillColor(255, 247, 237);
  doc.setDrawColor(254, 215, 170);
  doc.roundedRect(22, 195, 166, 44, 4, 4, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(194, 65, 12);
  doc.text('Color By Number Code:', 28, 205);

  const numPalette = [
    '1-2: Red', '3-4: Blue', '5-6: Yellow', '7-8: Green', '9-10: Purple'
  ];
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text(numPalette.join('      •      '), 28, 216);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(30, 41, 59);
  doc.text('Number Challenge: How many total balloons are in the sky? Write: [  10  ]', 28, 230);

  // --- 6. CATEGORY 3: SHAPES AND COLORS ---
  doc.addPage();
  drawPlaybookBorder(3, 'Shapes & Colors', 6);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(30, 41, 59);
  doc.text('The Geometric Shape Detective', width / 2, 30, { align: 'center' });
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Identify each shape, trace its perimeter, and color using the secret detective code!', width / 2, 37, { align: 'center' });

  // 5 Shapes
  const shapesData = [
    { name: 'Circle', color: 'Red', draw: (x: number, y: number) => doc.circle(x, y, 16) },
    { name: 'Square', color: 'Blue', draw: (x: number, y: number) => doc.rect(x - 14, y - 14, 28, 28) },
    { name: 'Triangle', color: 'Yellow', draw: (x: number, y: number) => doc.triangle(x - 16, y + 14, x + 16, y + 14, x, y - 16) },
    { name: 'Star', color: 'Orange', draw: (x: number, y: number) => doc.circle(x, y, 14) },
    { name: 'Diamond', color: 'Green', draw: (x: number, y: number) => doc.triangle(x, y - 15, x + 15, y, x, y + 15) },
  ];

  shapesData.forEach((s, idx) => {
    const xS = 32 + idx * 36;
    const yS = 70;
    doc.setDrawColor(30, 41, 59);
    doc.setLineWidth(2);
    s.draw(xS, yS);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(30, 41, 59);
    doc.text(s.name, xS, yS + 26, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(225, 29, 72);
    doc.text(`[${s.color}]`, xS, yS + 31, { align: 'center' });
  });

  // Detective Search Grid
  doc.setFillColor(240, 249, 255);
  doc.setDrawColor(186, 230, 253);
  doc.roundedRect(22, 120, 166, 120, 4, 4, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(3, 105, 161);
  doc.text('Detective Tally: Count How Many of Each Shape are in the Box:', 28, 132);

  // Scatter shapes inside detective grid
  doc.setDrawColor(50, 50, 50);
  doc.circle(45, 155, 10);
  doc.circle(85, 175, 8);
  doc.circle(145, 150, 12);
  doc.rect(60, 145, 16, 16);
  doc.rect(115, 165, 14, 14);
  doc.triangle(100, 155, 115, 155, 107, 140);
  doc.triangle(155, 185, 170, 185, 162, 170);

  // Tally inputs
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(30, 41, 59);
  doc.text('Circles found: [  3  ]      Squares found: [  2  ]      Triangles found: [  2  ]', width / 2, 225, { align: 'center' });

  // --- 7. CATEGORY 4: TRACING & PRE-WRITING ---
  doc.addPage();
  drawPlaybookBorder(4, 'Tracing & Handwriting', 7);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(30, 41, 59);
  doc.text('Pre-Writing Motor Skills: The Great Explorer Paths', width / 2, 30, { align: 'center' });
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Keep your pencil on the line from START to FINISH without lifting your hand!', width / 2, 37, { align: 'center' });

  // 3 Tracing Paths
  const paths = [
    { title: '1. Ocean Waves (Helping the Little Dolphin Jump):', y: 55 },
    { title: '2. Rollercoaster Loops (Guiding the Red Toy Airplane):', y: 115 },
    { title: '3. Castle Mountain Steps (Guiding the Mountain Explorer):', y: 175 },
  ];

  paths.forEach((p, idx) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(79, 70, 229);
    doc.text(p.title, 22, p.y);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(22, 163, 74);
    doc.text('START ➔', 22, p.y + 20);
    doc.setTextColor(220, 38, 38);
    doc.text('★ FINISH', 172, p.y + 20);

    doc.setLineWidth(1.6);
    doc.setLineDashPattern([3, 2], 0);
    doc.setDrawColor(79, 70, 229);

    if (idx === 0) {
      // Gentle Waves
      doc.moveTo(40, p.y + 20);
      doc.curveTo(65, p.y + 5, 80, p.y + 35, 105, p.y + 20);
      doc.curveTo(130, p.y + 5, 145, p.y + 35, 170, p.y + 20);
      doc.stroke();
    } else if (idx === 1) {
      // Looping waves
      doc.moveTo(40, p.y + 20);
      doc.curveTo(60, p.y, 80, p.y + 35, 100, p.y + 15);
      doc.curveTo(120, p.y, 140, p.y + 35, 170, p.y + 20);
      doc.stroke();
    } else {
      // Zigzag stairs
      doc.line(40, p.y + 25, 60, p.y + 5);
      doc.line(60, p.y + 5, 80, p.y + 25);
      doc.line(80, p.y + 25, 100, p.y + 5);
      doc.line(100, p.y + 5, 120, p.y + 25);
      doc.line(120, p.y + 25, 140, p.y + 5);
      doc.line(140, p.y + 5, 170, p.y + 25);
    }
    doc.setLineDashPattern([], 0);
  });

  // Educator pencil grip note
  doc.setFillColor(254, 243, 199);
  doc.roundedRect(22, 235, 166, 16, 3, 3, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(146, 64, 14);
  doc.text('Pedagogical Tip: Controlled curved tracing directly reinforces the fine motor dexterity required for writing letters a, b, c, and numbers 2, 3, 5!', width / 2, 244, { align: 'center' });

  // --- 8. CATEGORY 5: COLORING ACTIVITIES ---
  doc.addPage();
  drawPlaybookBorder(5, 'Coloring Activities', 8);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(30, 41, 59);
  doc.text('Playful Lion King in the Savannah', width / 2, 30, { align: 'center' });
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Extra-thick bold outlines designed for clean toddler coloring and color experimentation.', width / 2, 37, { align: 'center' });

  // Big Bold Coloring Centerpiece
  const lionX = width / 2;
  const lionY = 135;
  doc.setDrawColor(20, 20, 20);
  doc.setLineWidth(2.5);
  doc.circle(lionX, lionY, 52); // Mane
  doc.circle(lionX, lionY, 38); // Face
  doc.circle(lionX - 24, lionY - 30, 11);
  doc.circle(lionX + 24, lionY - 30, 11);
  doc.circle(lionX - 14, lionY - 8, 4, 'FD'); // Eyes
  doc.circle(lionX + 14, lionY - 8, 4, 'FD');
  doc.triangle(lionX - 7, lionY + 4, lionX + 7, lionY + 4, lionX, lionY + 12, 'FD');
  doc.line(lionX, lionY + 12, lionX, lionY + 18);
  doc.curveTo(lionX - 10, lionY + 24, lionX + 10, lionY + 24, lionX + 10, lionY + 18);

  // Suggested Palette at Bottom
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(22, 232, 166, 20, 3, 3, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  doc.text('Suggested Crayons: [ 🟡 Sunshine Yellow ]   [ 🟠 Sunset Orange ]   [ 🟤 Earth Brown ]', width / 2, 244, { align: 'center' });

  // --- 9. CATEGORY 6: ANIMALS AND BIRDS ---
  doc.addPage();
  drawPlaybookBorder(6, 'Animals & Birds', 9);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(30, 41, 59);
  doc.text('The Happy Toucan & Jungle Friends', width / 2, 30, { align: 'center' });
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Learn fascinating wildlife facts while coloring this vibrant rainforest bird!', width / 2, 37, { align: 'center' });

  // Vector Toucan Illustration
  doc.setDrawColor(30, 41, 59);
  doc.setLineWidth(2.2);
  doc.ellipse(100, 115, 25, 35); // Body
  doc.circle(100, 80, 18); // Head
  doc.curveTo(115, 75, 145, 95, 145, 95); // Beak top
  doc.curveTo(135, 105, 105, 90, 105, 90); // Beak bottom
  doc.circle(95, 78, 3.5, 'FD'); // Eye
  // Branch
  doc.setLineWidth(3);
  doc.line(60, 145, 160, 145);

  // Fun Educational Fact
  doc.setFillColor(240, 253, 244);
  doc.setDrawColor(187, 247, 208);
  doc.roundedRect(22, 195, 166, 45, 4, 4, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(21, 128, 61);
  doc.text('Did You Know? (Fun Wildlife Fact):', 28, 207);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  doc.text('• Toucans live in the lush canopies of tropical rainforests.', 28, 217);
  doc.text('• Their enormous beaks are made of lightweight honeycomb keratin — the same as your fingernails!', 28, 224);
  doc.text('• They love eating wild papayas, sweet berries, and rainforest insects.', 28, 231);

  // --- 10. CATEGORY 7: FRUITS AND VEGETABLES ---
  doc.addPage();
  drawPlaybookBorder(7, 'Fruits & Vegetables', 10);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(30, 41, 59);
  doc.text('The Healthy Rainbow Garden Harvest', width / 2, 30, { align: 'center' });
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Match the healthy fruits to their names, then color each one in its natural vibrant shade.', width / 2, 37, { align: 'center' });

  // 4 Fruit/Veg Cards
  const foods = [
    { name: 'Red Apple', type: 'Fruit', color: 'Crimson Red' },
    { name: 'Orange Carrot', type: 'Vegetable', color: 'Bright Orange' },
    { name: 'Yellow Banana', type: 'Fruit', color: 'Sunshine Yellow' },
    { name: 'Green Broccoli', type: 'Vegetable', color: 'Emerald Green' },
  ];

  foods.forEach((f, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const fX = 25 + col * 85;
    const fY = 55 + row * 85;

    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(fX, fY, 75, 75, 4, 4, 'FD');

    doc.setDrawColor(40, 40, 40);
    doc.setLineWidth(1.8);
    doc.circle(fX + 37, fY + 30, 18); // Food placeholder icon

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(30, 41, 59);
    doc.text(f.name, fX + 37, fY + 58, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(100, 116, 139);
    doc.text(`Type: ${f.type}  •  Color: ${f.color}`, fX + 37, fY + 66, { align: 'center' });
  });

  doc.setFillColor(254, 242, 242);
  doc.roundedRect(22, 232, 166, 18, 3, 3, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(190, 18, 60);
  doc.text('Nutrition Habit: Eating 5 colors of fruits and vegetables daily gives you superhero strength!', width / 2, 243, { align: 'center' });

  // --- 11. CATEGORY 8: MATCHING ACTIVITIES ---
  doc.addPage();
  drawPlaybookBorder(8, 'Matching Activities', 11);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(30, 41, 59);
  doc.text('Animal to Shadow Silhouette Matching', width / 2, 30, { align: 'center' });
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Draw a line connecting each friendly cartoon animal to its matching solid shadow!', width / 2, 37, { align: 'center' });

  const pairs = [
    { animal: '1. Playful Puppy 🐶', shadow: 'C. Silhouette Elephant' },
    { animal: '2. Cuddly Kitten 🐱', shadow: 'A. Silhouette Puppy' },
    { animal: '3. Little Elephant 🐘', shadow: 'D. Silhouette Duckling' },
    { animal: '4. Swimming Duck 🦆', shadow: 'B. Silhouette Kitten' },
  ];

  pairs.forEach((p, idx) => {
    const yM = 60 + idx * 42;

    // Left Column (Animals)
    doc.setFillColor(254, 242, 242);
    doc.setDrawColor(254, 202, 202);
    doc.roundedRect(25, yM, 65, 26, 3, 3, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(190, 18, 60);
    doc.text(p.animal, 30, yM + 16);

    // Connecting Dots
    doc.setFillColor(225, 29, 72);
    doc.circle(95, yM + 13, 2.5, 'F');
    doc.circle(115, yM + 13, 2.5, 'F');

    // Right Column (Shadows - Shuffled)
    doc.setFillColor(241, 245, 249);
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(120, yM, 65, 26, 3, 3, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(30, 41, 59);
    doc.text(p.shadow, 125, yM + 16);
  });

  // --- 12. CATEGORY 9: MAZES AND PUZZLES ---
  doc.addPage();
  drawPlaybookBorder(9, 'Mazes & Puzzles', 12);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(30, 41, 59);
  doc.text("Buzzy the Honeybee's Garden Maze", width / 2, 30, { align: 'center' });
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Help Buzzy fly through the sunflower labyrinth to reach the sweet jar of honey!', width / 2, 37, { align: 'center' });

  // Geometric Maze Grid
  doc.setDrawColor(30, 41, 59);
  doc.setLineWidth(2);
  doc.roundedRect(30, 52, 150, 150, 4, 4);

  // Maze Walls
  doc.setLineWidth(2.2);
  // Row 1
  doc.line(30, 80, 130, 80);
  doc.line(150, 80, 180, 80);
  // Row 2
  doc.line(55, 110, 180, 110);
  // Row 3
  doc.line(30, 140, 110, 140);
  doc.line(135, 140, 180, 140);
  // Row 4
  doc.line(55, 170, 155, 170);

  // Vertical blockades
  doc.line(80, 80, 80, 110);
  doc.line(130, 110, 130, 140);
  doc.line(95, 140, 95, 170);

  // Start & Finish Markers
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(22, 163, 74);
  doc.text('🐝 START (Top Left)', 35, 48);
  doc.setTextColor(225, 29, 72);
  doc.text('🍯 FINISH (Sweet Honey)', 130, 208);

  // Parent solution tip
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Solution Path Hint: Turn down at the opening at x:140, proceed through middle corridor. Solution on Page 22.', width / 2, 235, { align: 'center' });

  // --- 13. CATEGORY 10: SPOT THE DIFFERENCE ---
  doc.addPage();
  drawPlaybookBorder(10, 'Spot the Difference', 13);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(30, 41, 59);
  doc.text('Spot 5 Differences Between Twin Scenes!', width / 2, 30, { align: 'center' });
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Look closely at Picture A and Picture B. Find and circle the 5 subtle changes!', width / 2, 37, { align: 'center' });

  // Two Picture Frames
  doc.setDrawColor(203, 213, 225);
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(22, 50, 78, 120, 4, 4, 'FD'); // Picture A
  doc.roundedRect(110, 50, 78, 120, 4, 4, 'FD'); // Picture B

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(30, 41, 59);
  doc.text('Picture A (Original)', 61, 62, { align: 'center' });
  doc.text('Picture B (5 Differences)', 149, 62, { align: 'center' });

  // Scenery graphics in Picture A
  doc.setDrawColor(30, 41, 59);
  doc.setLineWidth(1.5);
  // Smiling Sun in A
  doc.circle(40, 80, 10);
  // Cute Cat
  doc.circle(61, 120, 18);
  doc.circle(61, 100, 12); // head
  // Butterfly
  doc.circle(80, 95, 4);

  // Picture B with 5 Differences (Missing ray, different cat tail, extra flower, missing butterfly, striped ball)
  doc.circle(128, 80, 10); // Sun
  doc.circle(149, 120, 18); // Cat
  doc.circle(149, 100, 12);
  // Difference 1: Extra flower on ground
  doc.circle(170, 150, 5);
  // Difference 2: Cat wearing a bow tie
  doc.rect(146, 110, 6, 4);

  // Checkbox tally at bottom
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(22, 185, 166, 45, 3, 3, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(30, 41, 59);
  doc.text('Check off each difference as you discover it:', 28, 197);

  const diffCheck = [
    '□ 1. Missing butterfly in sky',
    '□ 2. Cat wears a fancy bow tie',
    '□ 3. Extra blooming flower',
    '□ 4. Sun ray count changed',
    '□ 5. Little bird on fence',
  ];
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text(diffCheck.slice(0, 3).join('      '), 28, 209);
  doc.text(diffCheck.slice(3).join('      '), 28, 219);

  // --- 14. CATEGORY 11: DOT-TO-DOT ACTIVITIES ---
  doc.addPage();
  drawPlaybookBorder(11, 'Dot-to-Dot Activities', 14);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(30, 41, 59);
  doc.text('Connect the Dots 1 to 20: The Cosmic Rocket!', width / 2, 30, { align: 'center' });
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Connect dots in sequential numerical order from 1 to 20 to reveal the flying space rocket.', width / 2, 37, { align: 'center' });

  // 20 Numbered Dots arranged in a rocket shape
  const rocketDots = [
    { n: 1, x: 105, y: 55 },
    { n: 2, x: 115, y: 70 },
    { n: 3, x: 120, y: 90 },
    { n: 4, x: 120, y: 120 },
    { n: 5, x: 120, y: 150 },
    { n: 6, x: 135, y: 165 }, // Right fin
    { n: 7, x: 135, y: 180 },
    { n: 8, x: 120, y: 175 },
    { n: 9, x: 112, y: 185 }, // Exhaust nozzle
    { n: 10, x: 108, y: 200 }, // Flame tip
    { n: 11, x: 105, y: 195 },
    { n: 12, x: 102, y: 200 },
    { n: 13, x: 98, y: 185 },
    { n: 14, x: 90, y: 175 },
    { n: 15, x: 75, y: 180 }, // Left fin
    { n: 16, x: 75, y: 165 },
    { n: 17, x: 90, y: 150 },
    { n: 18, x: 90, y: 120 },
    { n: 19, x: 90, y: 90 },
    { n: 20, x: 95, y: 70 },
  ];

  rocketDots.forEach((pt) => {
    doc.setFillColor(225, 29, 72);
    doc.circle(pt.x, pt.y, 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(30, 41, 59);
    doc.text(`${pt.n}`, pt.x + 3, pt.y - 2);
  });

  // Prompt note
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text('After connecting all 20 dots, color the rocket in bright red, silver, and fiery orange flames!', width / 2, 235, { align: 'center' });

  // --- 15. CATEGORY 12: LOGICAL THINKING GAMES ---
  doc.addPage();
  drawPlaybookBorder(12, 'Logical Thinking Games', 15);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(30, 41, 59);
  doc.text('Complete the Pattern Sequences!', width / 2, 30, { align: 'center' });
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Look at the repeating pattern on each row and draw or circle what comes next.', width / 2, 37, { align: 'center' });

  // 4 Patterns
  const patternRows = [
    { title: 'Pattern 1: Circle, Star, Circle, Star, [ ? ]', ans: 'Answer: Circle ◯' },
    { title: 'Pattern 2: Square, Triangle, Square, Triangle, [ ? ]', ans: 'Answer: Square ▢' },
    { title: 'Pattern 3: Sun, Moon, Sun, Moon, [ ? ]', ans: 'Answer: Sun ☀️' },
    { title: 'Pattern 4: Big Heart, Small Heart, Big Heart, [ ? ]', ans: 'Answer: Small Heart 💛' },
  ];

  patternRows.forEach((row, idx) => {
    const yPat = 55 + idx * 42;
    doc.setFillColor(254, 242, 242);
    doc.setDrawColor(254, 202, 202);
    doc.roundedRect(22, yPat, 166, 32, 3, 3, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(190, 18, 60);
    doc.text(row.title, 28, yPat + 14);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    doc.text(`Draw your answer in the box: [      ]    •    (${row.ans})`, 28, yPat + 24);
  });

  // --- 16. CATEGORY 13: MEMORY & OBSERVATION ---
  doc.addPage();
  drawPlaybookBorder(13, 'Memory & Observation', 16);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(30, 41, 59);
  doc.text("Preschool I-Spy & Observation Quest", width / 2, 30, { align: 'center' });
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Count each type of friendly object hidden in the observation garden below!', width / 2, 37, { align: 'center' });

  // Scenery Box
  doc.setDrawColor(203, 213, 225);
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(22, 50, 166, 115, 4, 4, 'FD');

  // Random scattering of icons inside observation box
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(234, 88, 12);
  doc.text('⭐   🌸   🍎   ⭐   🌸   ⭐   🍎', 35, 75);
  doc.text('🍎   ⭐   🌸   ⭐   🍎   🌸   ⭐', 35, 105);
  doc.text('🌸   🍎   ⭐   🍎   🌸   ⭐   🌸', 35, 135);

  // Tally Answer Sheet
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(22, 180, 166, 45, 4, 4, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(30, 41, 59);
  doc.text('Enter your final count:', 28, 195);
  doc.setFontSize(10);
  doc.setTextColor(71, 85, 105);
  doc.text('1. How many Gold Stars ⭐ did you spot?  Write count: [  8  ]', 28, 205);
  doc.text('2. How many Sweet Apples 🍎 did you spot?  Write count: [  6  ]', 28, 214);
  doc.text('3. How many Flowers 🌸 did you spot?  Write count: [  7  ]', 28, 223);

  // --- 17. CATEGORY 14: BASIC MATHEMATICS ---
  doc.addPage();
  drawPlaybookBorder(14, 'Basic Mathematics', 17);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(30, 41, 59);
  doc.text('The Apple Tree Visual Addition Fun', width / 2, 30, { align: 'center' });
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Count the apples on each side, add them together, and write the final sum.', width / 2, 37, { align: 'center' });

  // 3 Addition Equations with Visual Apples
  const mathProblems = [
    { a: 2, b: 3, sum: 5, label: '2 Apples  +  3 Apples  =  [  5  ] Apples' },
    { a: 4, b: 2, sum: 6, label: '4 Apples  +  2 Apples  =  [  6  ] Apples' },
    { a: 3, b: 3, sum: 6, label: '3 Apples  +  3 Apples  =  [  6  ] Apples' },
    { a: 5, b: 1, sum: 6, label: '5 Apples  +  1 Apple   =  [  6  ] Apples' },
  ];

  mathProblems.forEach((m, idx) => {
    const yEq = 55 + idx * 42;
    doc.setFillColor(254, 242, 242);
    doc.setDrawColor(254, 202, 202);
    doc.roundedRect(22, yEq, 166, 32, 3, 3, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(225, 29, 72);
    doc.text(`${m.a}  +  ${m.b}  =  [   ]`, 35, yEq + 16);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(71, 85, 105);
    doc.text(m.label, 35, yEq + 26);
  });

  // --- 18. CATEGORY 15: CREATIVE DRAWING ---
  doc.addPage();
  drawPlaybookBorder(15, 'Creative Drawing', 18);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(30, 41, 59);
  doc.text('Finish the Friendly Monster Face!', width / 2, 30, { align: 'center' });
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Use your wildest imagination to draw silly eyes, funny teeth, cute horns, and wild hair!', width / 2, 37, { align: 'center' });

  // Outlined Blank Monster Body
  doc.setDrawColor(30, 41, 59);
  doc.setLineWidth(2.5);
  doc.ellipse(width / 2, 130, 50, 60); // Monster head & body
  // Cute feet
  doc.circle(width / 2 - 25, 192, 10);
  doc.circle(width / 2 + 25, 192, 10);
  // Cute little antenna
  doc.line(width / 2, 70, width / 2, 55);
  doc.circle(width / 2, 53, 5, 'FD');

  // Creative prompts
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(22, 215, 166, 25, 3, 3, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text('Imagination Prompts: 1. Does your monster have 3 eyes?  2. Does it love eating broccoli or cupcakes?  3. Give it a name!', width / 2, 228, { align: 'center' });

  // --- 19. CATEGORY 16: GOOD HABITS & DAILY ROUTINE ---
  doc.addPage();
  drawPlaybookBorder(16, 'Good Habits & Daily Activities', 19);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(30, 41, 59);
  doc.text('My Healthy Morning Sunshine Checklist', width / 2, 30, { align: 'center' });
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Color the star checkbox every morning when you finish each good habit!', width / 2, 37, { align: 'center' });

  const habits = [
    { title: '1. Brushing My Teeth with a Big Smile', desc: 'Brush twice daily to keep teeth sparkling white and strong.' },
    { title: '2. Washing My Hands with Soap & Water', desc: 'Wash hands before every meal to keep playful germs away.' },
    { title: '3. Eating a Wholesome Rainbow Breakfast', desc: 'Fuel your growing body with milk, oats, and fresh juicy fruits.' },
    { title: '4. Tidying Up My Toys & Books', desc: 'Putting my toys back in their baskets makes home happy and neat.' },
  ];

  habits.forEach((h, idx) => {
    const yH = 55 + idx * 42;
    doc.setFillColor(254, 242, 242);
    doc.setDrawColor(254, 202, 202);
    doc.roundedRect(22, yH, 166, 32, 3, 3, 'FD');

    // Star Checkbox
    doc.setFillColor(254, 240, 138);
    doc.circle(38, yH + 16, 8, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(161, 98, 7);
    doc.text('★', 38, yH + 19, { align: 'center' });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(190, 18, 60);
    doc.text(h.title, 52, yH + 13);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    doc.text(h.desc, 52, yH + 22);
  });

  // --- 20. CATEGORY 17: NATURE & ENVIRONMENT ---
  doc.addPage();
  drawPlaybookBorder(17, 'Nature & Environment', 20);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(30, 41, 59);
  doc.text('The Life Cycle of a Sunflower: From Seed to Blossom', width / 2, 30, { align: 'center' });
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Number the developmental stages from 1 to 4 in chronological order.', width / 2, 37, { align: 'center' });

  const plantStages = [
    { stage: 'Stage 1: Seed in Soil', desc: 'A tiny black seed rests in the warm fertile earth.' },
    { stage: 'Stage 2: Green Sprout', desc: 'Two little leaves sprout reaching up for sunlight.' },
    { stage: 'Stage 3: Growing Stalk', desc: 'Strong stem grows tall with green side leaves.' },
    { stage: 'Stage 4: Giant Blossom', desc: 'Huge golden petals unfold facing the bright sun.' },
  ];

  plantStages.forEach((s, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const sX = 25 + col * 85;
    const sY = 55 + row * 85;

    doc.setFillColor(240, 253, 244);
    doc.setDrawColor(187, 247, 208);
    doc.roundedRect(sX, sY, 75, 75, 4, 4, 'FD');

    doc.setDrawColor(34, 197, 94);
    doc.setLineWidth(1.8);
    doc.circle(sX + 37, sY + 28, 16);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(21, 128, 61);
    doc.text(s.stage, sX + 37, sY + 54, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    const splitDesc = doc.splitTextToSize(s.desc, 65);
    doc.text(splitDesc, sX + 37, sY + 62, { align: 'center' });
  });

  // --- 21. CATEGORY 18: FUN EDUCATIONAL GAMES ---
  doc.addPage();
  drawPlaybookBorder(18, 'Fun Educational Games', 21);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(30, 41, 59);
  doc.text('The Animal Stepping Stones Trail', width / 2, 30, { align: 'center' });
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Fill in the missing alphabet stepping stones to guide the puppy safely across the river!', width / 2, 37, { align: 'center' });

  // Alphabet Trail
  const lettersTrail = [
    'A', 'B', '[ C ]', 'D', 'E', '[ F ]', 'G', 'H', '[ I ]', 'J', 'K', '[ L ]', 'M'
  ];

  lettersTrail.forEach((letter, i) => {
    const col = i % 4;
    const row = Math.floor(i / 4);
    const lX = 35 + col * 40;
    const lY = 60 + row * 40;

    doc.setFillColor(254, 243, 199);
    doc.setDrawColor(251, 191, 36);
    doc.circle(lX, lY, 14, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(146, 64, 14);
    doc.text(letter, lX, lY + 4, { align: 'center' });
  });

  doc.setFillColor(241, 245, 249);
  doc.roundedRect(22, 210, 166, 35, 4, 4, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(30, 41, 59);
  doc.text('Missing Letters to Fill In: C, F, I, L', width / 2, 225, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Say each letter sound as you cross each stepping stone!', width / 2, 235, { align: 'center' });

  // --- 22. ANSWER KEYS ---
  doc.addPage();
  doc.setDrawColor(255, 107, 107);
  doc.setLineWidth(1.5);
  doc.roundedRect(10, 10, width - 20, height - 20, 5, 5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(30, 41, 59);
  doc.text('Official Answer Keys & Teacher Solutions', width / 2, 28, { align: 'center' });
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Verified solutions for Mazes, Spot the Difference, Patterns, and Math calculations.', width / 2, 35, { align: 'center' });

  const solutions = [
    { cat: 'Category 9 (Mazes & Puzzles)', sol: 'Start at top-left opening -> proceed south past first barrier -> turn right at x:140 -> turn down to center lane -> exit at bottom-right honey jar.' },
    { cat: 'Category 10 (Spot the Difference)', sol: '1. Missing butterfly in sky. 2. Cat wears a fancy bow tie. 3. Extra blooming flower on grass. 4. One fewer sunbeam. 5. Little bird perched on fence.' },
    { cat: 'Category 12 (Logical Thinking & Patterns)', sol: 'Row 1: Circle ◯.   Row 2: Square ▢.   Row 3: Sun ☀️.   Row 4: Small Heart 💛.' },
    { cat: 'Category 13 (Memory & Observation I-Spy)', sol: 'Gold Stars: 8 total.   Sweet Apples: 6 total.   Pink Flowers: 7 total.' },
    { cat: 'Category 14 (Basic Mathematics Addition)', sol: 'Problem 1: 2 + 3 = 5.   Problem 2: 4 + 2 = 6.   Problem 3: 3 + 3 = 6.   Problem 4: 5 + 1 = 6.' },
    { cat: 'Category 18 (Alphabet Trail Stepping Stones)', sol: 'Missing letters in sequential order: C, F, I, L.' },
  ];

  solutions.forEach((s, idx) => {
    const yS = 48 + idx * 30;
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(20, yS, 170, 25, 3, 3, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(225, 29, 72);
    doc.text(s.cat, 26, yS + 8);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);
    const splitSol = doc.splitTextToSize(s.sol, 160);
    doc.text(splitSol, 26, yS + 15);
  });

  // --- 23. SUPER ARTIST & SCHOLAR CERTIFICATE ---
  doc.addPage();
  doc.setDrawColor(255, 217, 61); // Gold
  doc.setLineWidth(4);
  doc.roundedRect(12, 12, width - 24, height - 24, 8, 8);
  doc.setDrawColor(225, 29, 72); // Crimson
  doc.setLineWidth(1.2);
  doc.roundedRect(16, 16, width - 32, height - 32, 6, 6);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(225, 29, 72);
  doc.text('LITTLE COLOUR WORLD AWARDS', width / 2, 42, { align: 'center' });

  doc.setFontSize(26);
  doc.setTextColor(30, 41, 59);
  doc.text('SUPER SCHOLAR CERTIFICATE', width / 2, 60, { align: 'center' });

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('This official certificate of early learning mastery is proudly presented to:', width / 2, 80, { align: 'center' });

  // Recipient Line
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.setTextColor(225, 29, 72);
  const awardName = childName ? childName : '____________________________________';
  doc.text(awardName, width / 2, 108, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(71, 85, 105);
  const certBody = `For completing all 18 core developmental categories of The Ultimate Kids' Activity Playbook with tremendous curiosity, fine motor precision, and artistic joy!`;
  const splitCert = doc.splitTextToSize(certBody, 140);
  doc.text(splitCert, width / 2, 128, { align: 'center' });

  // Gold Medallion Star
  doc.setFillColor(254, 240, 138);
  doc.setDrawColor(234, 179, 8);
  doc.setLineWidth(2);
  doc.circle(width / 2, 180, 24, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(161, 98, 7);
  doc.text('★ ★ ★', width / 2, 178, { align: 'center' });
  doc.setFontSize(10);
  doc.text('SUPER KID', width / 2, 186, { align: 'center' });

  // Signatures
  doc.setDrawColor(148, 163, 184);
  doc.setLineWidth(1);
  doc.line(35, 235, 85, 235);
  doc.line(125, 235, 175, 235);
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text('Parent / Teacher Signature', 60, 243, { align: 'center' });
  doc.text('Date Completed', 150, 243, { align: 'center' });

  // --- 24. BACK COVER ---
  doc.addPage();
  doc.setDrawColor(255, 107, 107);
  doc.setLineWidth(3);
  doc.roundedRect(10, 10, width - 20, height - 20, 8, 8);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(30, 41, 59);
  doc.text("KIDS' ACTIVITY PLAYBOOK", width / 2, 45, { align: 'center' });

  doc.setFontSize(12);
  doc.setTextColor(225, 29, 72);
  doc.text('The Complete 18-Category Early Learning Milestone System', width / 2, 55, { align: 'center' });

  // 18 Categories summary box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(25, 70, 160, 110, 4, 4, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(30, 41, 59);
  doc.text('18 Foundational Learning Domains Included:', 32, 82);

  const backBullets = [
    '• Alphabet Phonics & Tracing (A–Z)', '• Numbers, Counting & Simple Math',
    '• Shapes, Colors & Visual Sorting', '• Pre-Writing Lines & Fine Motor Paths',
    '• High-Contrast Animal & Bird Art', '• Healthy Garden Fruits & Vegetables',
    '• Silhouette Shadow Matching Games', '• Critical Thinking Mazes & Labyrinths',
    '• Spot the Difference Observation', '• Numbered Dot-to-Dot Cosmic Art',
    '• Repeating Pattern Sequences', '• I-Spy Visual Memory & Tallying',
    '• Creative Drawing & Imagination', '• Positive Habits & Morning Routine',
    '• Nature Plant Life Cycle Discovery', '• Alphabet Stepping Stones Word Games',
    '• Verified Solutions & Answer Keys', '• Official Super Scholar Certificate'
  ];

  backBullets.forEach((bullet, idx) => {
    const colB = idx >= 9 ? 110 : 32;
    const rowB = idx >= 9 ? idx - 9 : idx;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    doc.text(bullet, colB, 92 + rowB * 9);
  });

  // Endorsement Seal
  doc.setFillColor(254, 243, 199);
  doc.setDrawColor(245, 158, 11);
  doc.roundedRect(35, 195, 140, 28, 4, 4, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(146, 64, 14);
  doc.text('✓ 100% Educator Approved   •   ✓ Child-Safe Print Quality', width / 2, 207, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(113, 63, 18);
  doc.text('Designed for home printing or commercial preschool activity workbooks.', width / 2, 215, { align: 'center' });

  // Publisher Imprint & Barcode placeholder
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text('Published by Little Colour World • www.littlecolourworld.com', width / 2, 255, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('ISBN 978-1-84920-100-8 • Printed in A4 Format • Keep Learning, Keep Shining!', width / 2, 263, { align: 'center' });
}

function drawPageBorder(doc: jsPDF, width: number, height: number, pageNum: string) {
  doc.setDrawColor(255, 217, 61); // yellow
  doc.setLineWidth(1.5);
  doc.roundedRect(10, 10, width - 20, height - 20, 5, 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(160, 160, 160);
  doc.text('Little Colour World • Printable Edition', 16, height - 13);
  doc.text(`Page ${pageNum}`, width - 16, height - 13, { align: 'right' });
}

/**
 * Converts Google Drive sharing links into direct download links if applicable
 */
export function getDirectDownloadUrl(url: string): string {
  if (!url) return '';
  const trimmed = url.trim();
  const match1 = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (match1 && match1[1]) {
    return `https://drive.google.com/uc?export=download&id=${match1[1]}`;
  }
  const match2 = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (match2 && match2[1]) {
    return `https://drive.google.com/uc?export=download&id=${match2[1]}`;
  }
  return trimmed;
}

/**
 * STRICT SERVER-SIDE AUTHORIZATION:
 * Prevents client-side bypass.
 * Calls /api/downloads/authorize with downloadToken & productId before any file download or generation is permitted.
 */
export async function authorizeAndDownloadProduct(
  product: Product,
  downloadToken: string,
  childName: string = ''
): Promise<{ success: boolean; message?: string }> {
  if (!downloadToken) {
    throw new Error('Access Denied: No server download token provided. Payment must be confirmed by Razorpay.');
  }

  // 1. Verify with server-side authorization gateway
  const authRes = await fetch('/api/downloads/authorize', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      downloadToken,
      productId: product.id,
    }),
  });

  const authData = await authRes.json();
  if (!authRes.ok || !authData.authorized) {
    throw new Error(
      authData.error ||
        'Access Denied: Payment has not been confirmed by Razorpay webhook on the server. Download strictly forbidden.'
    );
  }

  // 2. ONLY if server confirmed authorization:
  const cloudUrl = product.googleDrivePdfUrl?.trim() || product.firebaseStorageUrl?.trim();
  if (cloudUrl) {
    const directUrl = getDirectDownloadUrl(cloudUrl);
    const link = document.createElement('a');
    link.href = directUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.download = `${product.title.replace(/[^a-zA-Z0-9]/g, '_')}_Little_Colour_World.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return { success: true };
  }

  await generateProductPDF(product, childName);
  return { success: true };
}

/**
 * Downloads printable PDF strictly after verified server-side authorization from Razorpay webhook.
 * Prevents client-side bypass by requiring a valid server download token.
 */
export async function downloadProduct(
  product: Product,
  childName: string = '',
  downloadToken: string
): Promise<{ success: boolean; message?: string }> {
  if (!downloadToken || typeof downloadToken !== 'string' || !downloadToken.trim()) {
    throw new Error(
      'Access Denied: Server-verified download token is required. PDFs cannot be accessed without verified Razorpay payment.'
    );
  }
  return authorizeAndDownloadProduct(product, downloadToken.trim(), childName);
}


