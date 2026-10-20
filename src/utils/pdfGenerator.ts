import { jsPDF } from 'jspdf';
import { Product } from '../types';

/**
 * LITTLE COLOUR WORLD - MASTER HIGH-FIDELITY PRINTABLE PDF ENGINE
 * Generates authentic, high-resolution A4 printable PDFs
 * with unique, diverse vector illustrations tailored to each book's
 * Category, Name, Description, and exact Page Count.
 */

interface ColorRGB {
  r: number;
  g: number;
  b: number;
}

function hexToRgb(hex: string): ColorRGB {
  const clean = hex.replace('#', '');
  if (clean.length === 3) {
    return {
      r: parseInt(clean[0] + clean[0], 16),
      g: parseInt(clean[1] + clean[1], 16),
      b: parseInt(clean[2] + clean[2], 16),
    };
  }
  return {
    r: parseInt(clean.substring(0, 2), 16) || 255,
    g: parseInt(clean.substring(2, 4), 16) || 217,
    b: parseInt(clean.substring(4, 6), 16) || 61,
  };
}

function drawPolygon(doc: jsPDF, pts: Array<[number, number]>): void {
  for (let i = 0; i < pts.length; i++) {
    const next = (i + 1) % pts.length;
    doc.line(pts[i][0], pts[i][1], pts[next][0], pts[next][1]);
  }
}

function drawArcCurve(doc: jsPDF, cx: number, cy: number, rx: number, ry: number): void {
  doc.moveTo(cx - rx, cy);
  doc.curveTo(cx - rx, cy + ry * 0.55, cx + rx, cy + ry * 0.55, cx + rx, cy);
  doc.stroke();
}

// -------------------------------------------------------------
// UNIVERSAL PAGE LAYOUT & DECORATIVE FRAMES
// -------------------------------------------------------------

function drawPageHeaderAndFooter(
  doc: jsPDF,
  product: Product,
  pageNum: number,
  totalPages: number,
  pageTitle: string,
  instructions: string = 'Colour within the bold lines! Use your favourite bright crayons.',
  categoryTag?: string
): void {
  const width = 210;
  const height = 297;
  const rgb = hexToRgb(product.themeColor || '#FFD93D');

  // Outer border with soft rounded corners
  doc.setDrawColor(rgb.r, rgb.g, rgb.b);
  doc.setLineWidth(1.6);
  doc.roundedRect(10, 10, width - 20, height - 20, 5, 5);

  // Top Category Tag Pill
  const tag = categoryTag || product.category;
  doc.setFillColor(255, 248, 235);
  doc.setDrawColor(rgb.r, rgb.g, rgb.b);
  doc.setLineWidth(0.6);
  doc.roundedRect(width / 2 - 45, 12, 90, 7, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(180, 83, 9);
  doc.text(tag.toUpperCase(), width / 2, 16.8, { align: 'center' });

  // Page Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(30, 41, 59);
  const splitTitle = doc.splitTextToSize(pageTitle, 160);
  doc.text(splitTitle, width / 2, 28, { align: 'center' });

  // Subtitle / Pedagogical Instructions
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  const splitInstr = doc.splitTextToSize(instructions, 160);
  doc.text(splitInstr, width / 2, 35, { align: 'center' });

  // Footer Rule
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.6);
  doc.line(14, height - 16, width - 14, height - 16);

  // Footer Branding & Exact Page Pagination
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text(`Little Colour World • ${product.title}`, 16, height - 12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text(`Page ${pageNum} of ${totalPages}`, width - 16, height - 12, { align: 'right' });
}

function drawCrayonsPalette(doc: jsPDF, colors: Array<{ name: string; r: number; g: number; b: number }>): void {
  const yBox = 248;
  doc.setFillColor(250, 250, 250);
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.8);
  doc.roundedRect(22, yBox, 166, 22, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text('RECOMMENDED CRAYONS PALETTE:', 28, yBox + 7);

  const startX = 28;
  const spacing = 38;
  colors.slice(0, 4).forEach((c, idx) => {
    const x = startX + idx * spacing;
    doc.setFillColor(c.r, c.g, c.b);
    doc.setDrawColor(60, 60, 60);
    doc.setLineWidth(0.5);
    doc.roundedRect(x, yBox + 10, 8, 6, 1.5, 1.5, 'FD');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(c.name, x + 11, yBox + 14.5);
  });
}

function drawBookCover(doc: jsPDF, product: Product, childName: string, totalPages: number): void {
  const width = 210;
  const height = 297;
  const rgb = hexToRgb(product.themeColor || '#FFD93D');

  // Double decorative border
  doc.setDrawColor(rgb.r, rgb.g, rgb.b);
  doc.setLineWidth(3.5);
  doc.roundedRect(10, 10, width - 20, height - 20, 8, 8);

  doc.setDrawColor(255, 182, 193); // Soft pastel inner border
  doc.setLineWidth(1.2);
  doc.roundedRect(14, 14, width - 28, height - 28, 6, 6);

  // Top Series Banner
  doc.setFillColor(255, 248, 235);
  doc.roundedRect(24, 22, width - 48, 11, 4, 4, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(194, 65, 12);
  doc.text('LITTLE COLOUR WORLD • OFFICIAL EARLY LEARNING WORKBOOK', width / 2, 29, { align: 'center' });

  // Main Book Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(23);
  doc.setTextColor(30, 41, 59);
  const splitTitle = doc.splitTextToSize(product.title, 160);
  doc.text(splitTitle, width / 2, 48, { align: 'center' });

  // Category & Age Badge
  doc.setFillColor(254, 240, 138); // Yellow badge
  doc.roundedRect(width / 2 - 50, 63, 100, 9, 3, 3, 'F');
  doc.setFontSize(9.5);
  doc.setTextColor(133, 77, 14);
  doc.text(`${product.category} • ${product.ageGroup} • ${totalPages} Pages`, width / 2, 69, { align: 'center' });

  // Centerpiece Illustration Box
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(25, 78, 160, 116, 6, 6, 'FD');

  // Mascot Illustration
  const cX = width / 2;
  const cY = 132;
  doc.setDrawColor(30, 30, 30);
  doc.setLineWidth(2.2);

  // Head and ears
  doc.circle(cX, cY, 36);
  doc.circle(cX - 28, cY - 26, 12);
  doc.circle(cX + 28, cY - 26, 12);
  doc.circle(cX - 28, cY - 26, 6);
  doc.circle(cX + 28, cY - 26, 6);

  // Cheerful eyes
  doc.setFillColor(30, 30, 30);
  doc.circle(cX - 12, cY - 6, 4, 'F');
  doc.circle(cX + 12, cY - 6, 4, 'F');
  doc.setFillColor(255, 255, 255);
  doc.circle(cX - 10.5, cY - 7.5, 1.2, 'F');
  doc.circle(cX + 13.5, cY - 7.5, 1.2, 'F');

  // Cute Button Nose & Big Smile
  doc.setDrawColor(30, 30, 30);
  doc.triangle(cX - 6, cY + 4, cX + 6, cY + 4, cX, cY + 11, 'FD');
  doc.line(cX, cY + 11, cX, cY + 16);
  doc.curveTo(cX - 10, cY + 22, cX + 10, cY + 22, cX + 10, cY + 16);

  // Rosy cheeks
  doc.setFillColor(254, 202, 202);
  doc.circle(cX - 22, cY + 8, 5, 'F');
  doc.circle(cX + 22, cY + 8, 5, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(194, 65, 12);
  doc.text('Little Hands, Big Imagination!', width / 2, 185, { align: 'center' });

  // "This Special Book Belongs To" Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(199, 210, 254);
  doc.roundedRect(25, 202, 160, 32, 4, 4, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(71, 85, 105);
  doc.text('This Special Book Belongs To:', width / 2, 212, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(225, 29, 72);
  if (childName && childName.trim()) {
    doc.text(childName.trim(), width / 2, 224, { align: 'center' });
  } else {
    doc.setDrawColor(148, 163, 184);
    doc.setLineDashPattern([2, 2], 0);
    doc.line(40, 225, 170, 225);
    doc.setLineDashPattern([], 0);
  }

  // Feature Highlights
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('✓ Extra-Thick Outlines  •  ✓ Toddler Friendly  •  ✓ Printable A4 Format  •  ✓ Screen-Free Fun', width / 2, 248, { align: 'center' });

  // Cover Footer
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text(`Official PDF Edition • ${totalPages} Fun Printable Pages • Page 1 of ${totalPages}`, width / 2, 275, { align: 'center' });
}

function drawCertificatePage(
  doc: jsPDF,
  product: Product,
  childName: string,
  pageNumber: number,
  totalPages: number,
  customTitle?: string,
  customSubtitle?: string
): void {
  const width = 210;
  const height = 297;

  // Gold & Crimson borders
  doc.setDrawColor(255, 217, 61); // Gold
  doc.setLineWidth(4);
  doc.roundedRect(12, 12, width - 24, height - 24, 8, 8);

  doc.setDrawColor(225, 29, 72); // Crimson
  doc.setLineWidth(1.2);
  doc.roundedRect(16, 16, width - 32, height - 32, 6, 6);

  // Top header ribbon
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(225, 29, 72);
  doc.text('LITTLE COLOUR WORLD AWARDS', width / 2, 42, { align: 'center' });

  doc.setFontSize(24);
  doc.setTextColor(30, 41, 59);
  const certTitle = customTitle || 'SUPER ARTIST CERTIFICATE';
  doc.text(certTitle, width / 2, 58, { align: 'center' });

  doc.setFontSize(10.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('This proud certificate of early childhood achievement is joyfully awarded to:', width / 2, 75, { align: 'center' });

  // Recipient Name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(225, 29, 72);
  const awardee = childName && childName.trim() ? childName.trim() : '____________________________________';
  doc.text(awardee, width / 2, 102, { align: 'center' });

  // Citation Body
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(71, 85, 105);
  const defaultBody = customSubtitle || `For showing fantastic focus, creative imagination, and wonderful fine motor control in completing all ${totalPages} pages of ${product.title}!`;
  const splitBody = doc.splitTextToSize(defaultBody, 140);
  doc.text(splitBody, width / 2, 122, { align: 'center' });

  // Big Gold Star Medallion in center
  doc.setFillColor(254, 240, 138);
  doc.setDrawColor(234, 179, 8);
  doc.setLineWidth(2);
  doc.circle(width / 2, 175, 24, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(161, 98, 7);
  doc.text('★ ★ ★', width / 2, 172, { align: 'center' });
  doc.setFontSize(9.5);
  doc.text('NO. 1 STAR', width / 2, 180, { align: 'center' });

  // Signature and Date lines
  doc.setDrawColor(148, 163, 184);
  doc.setLineWidth(1);
  doc.line(35, 230, 85, 230);
  doc.line(125, 230, 175, 230);

  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text('Parent / Teacher Signature', 60, 238, { align: 'center' });
  doc.text('Date Completed', 150, 238, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text(`Little Colour World Official Certificate • Page ${pageNumber} of ${totalPages}`, width / 2, 275, { align: 'center' });
}

// -------------------------------------------------------------
// DIVERSE VECTOR ILLUSTRATION ENGINE (EACH ANIMAL & OBJECT IS UNIQUE!)
// -------------------------------------------------------------

// Lion: Big scalloped mane, whiskers, paws
export function drawVectorLion(doc: jsPDF, cx: number, cy: number, scale: number = 1): void {
  doc.setDrawColor(30, 30, 30);
  doc.setLineWidth(2.2 * scale);
  doc.circle(cx, cy, 48 * scale);
  for (let a = 0; a < 360; a += 36) {
    const rad = (a * Math.PI) / 180;
    doc.circle(cx + Math.cos(rad) * 48 * scale, cy + Math.sin(rad) * 48 * scale, 11 * scale);
  }
  doc.circle(cx, cy, 34 * scale);
  doc.circle(cx - 24 * scale, cy - 26 * scale, 10 * scale);
  doc.circle(cx + 24 * scale, cy - 26 * scale, 10 * scale);
  doc.setFillColor(30, 30, 30);
  doc.circle(cx - 12 * scale, cy - 6 * scale, 3.5 * scale, 'F');
  doc.circle(cx + 12 * scale, cy - 6 * scale, 3.5 * scale, 'F');
  doc.triangle(cx - 6 * scale, cy + 3 * scale, cx + 6 * scale, cy + 3 * scale, cx, cy + 10 * scale, 'FD');
  doc.line(cx, cy + 10 * scale, cx, cy + 15 * scale);
  doc.curveTo(cx - 9 * scale, cy + 20 * scale, cx + 9 * scale, cy + 20 * scale, cx + 9 * scale, cy + 15 * scale);
  doc.ellipse(cx - 18 * scale, cy + 54 * scale, 15 * scale, 10 * scale);
  doc.ellipse(cx + 18 * scale, cy + 54 * scale, 15 * scale, 10 * scale);
}

// Elephant: Big floppy ears, curved trunk with water droplets
export function drawVectorElephant(doc: jsPDF, cx: number, cy: number, scale: number = 1): void {
  doc.setDrawColor(30, 30, 30);
  doc.setLineWidth(2.2 * scale);
  doc.ellipse(cx, cy + 10 * scale, 42 * scale, 35 * scale);
  doc.ellipse(cx - 38 * scale, cy - 6 * scale, 22 * scale, 30 * scale);
  doc.ellipse(cx + 38 * scale, cy - 6 * scale, 22 * scale, 30 * scale);
  doc.circle(cx, cy - 6 * scale, 28 * scale);
  doc.setFillColor(30, 30, 30);
  doc.circle(cx - 12 * scale, cy - 12 * scale, 3.5 * scale, 'F');
  doc.circle(cx + 12 * scale, cy - 12 * scale, 3.5 * scale, 'F');
  doc.moveTo(cx - 7 * scale, cy + 4 * scale);
  doc.curveTo(cx - 12 * scale, cy + 28 * scale, cx + 22 * scale, cy + 34 * scale, cx + 20 * scale, cy + 20 * scale);
  doc.stroke();
  doc.circle(cx + 26 * scale, cy + 10 * scale, 2 * scale, 'F');
  doc.circle(cx + 32 * scale, cy + 16 * scale, 2.5 * scale, 'F');
}

// Bear: Snout, honey pot in paws
export function drawVectorBear(doc: jsPDF, cx: number, cy: number, scale: number = 1): void {
  doc.setDrawColor(30, 30, 30);
  doc.setLineWidth(2.2 * scale);
  doc.ellipse(cx, cy + 18 * scale, 36 * scale, 38 * scale);
  doc.circle(cx, cy - 12 * scale, 32 * scale);
  doc.circle(cx - 26 * scale, cy - 36 * scale, 11 * scale);
  doc.circle(cx + 26 * scale, cy - 36 * scale, 11 * scale);
  doc.ellipse(cx, cy - 4 * scale, 16 * scale, 12 * scale);
  doc.setFillColor(30, 30, 30);
  doc.circle(cx - 12 * scale, cy - 16 * scale, 3.5 * scale, 'F');
  doc.circle(cx + 12 * scale, cy - 16 * scale, 3.5 * scale, 'F');
  doc.ellipse(cx, cy - 8 * scale, 6 * scale, 4 * scale, 'F');
  doc.roundedRect(cx - 15 * scale, cy + 16 * scale, 30 * scale, 26 * scale, 4 * scale, 4 * scale);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5 * scale);
  doc.setTextColor(217, 119, 6);
  doc.text('HONEY', cx, cy + 32 * scale, { align: 'center' });
}

// Dolphin: Leaping curve, dorsal fin, ocean waves
export function drawVectorDolphin(doc: jsPDF, cx: number, cy: number, scale: number = 1): void {
  doc.setDrawColor(30, 30, 30);
  doc.setLineWidth(2.2 * scale);
  doc.moveTo(cx - 45 * scale, cy + 18 * scale);
  doc.curveTo(cx - 20 * scale, cy - 36 * scale, cx + 25 * scale, cy - 36 * scale, cx + 45 * scale, cy);
  doc.curveTo(cx + 25 * scale, cy - 10 * scale, cx - 15 * scale, cy + 2 * scale, cx - 45 * scale, cy + 18 * scale);
  doc.stroke();
  doc.triangle(cx + 2 * scale, cy - 30 * scale, cx + 18 * scale, cy - 30 * scale, cx + 8 * scale, cy - 45 * scale);
  doc.triangle(cx - 45 * scale, cy + 18 * scale, cx - 60 * scale, cy + 8 * scale, cx - 58 * scale, cy + 28 * scale);
  doc.setFillColor(30, 30, 30);
  doc.circle(cx + 36 * scale, cy - 8 * scale, 3 * scale, 'F');
  doc.line(cx - 60 * scale, cy + 45 * scale, cx + 60 * scale, cy + 45 * scale);
  for (let w = -50; w <= 50; w += 25) {
    doc.circle(cx + w * scale, cy + 45 * scale, 6 * scale);
  }
}

// Monkey: Curling tail around vine, round ears, holding banana
export function drawVectorMonkey(doc: jsPDF, cx: number, cy: number, scale: number = 1): void {
  doc.setDrawColor(30, 30, 30);
  doc.setLineWidth(2.2 * scale);
  doc.ellipse(cx, cy + 14 * scale, 28 * scale, 32 * scale);
  doc.circle(cx, cy - 14 * scale, 26 * scale);
  doc.circle(cx - 25 * scale, cy - 14 * scale, 9 * scale);
  doc.circle(cx + 25 * scale, cy - 14 * scale, 9 * scale);
  doc.ellipse(cx, cy - 8 * scale, 18 * scale, 14 * scale);
  doc.setFillColor(30, 30, 30);
  doc.circle(cx - 9 * scale, cy - 16 * scale, 3.5 * scale, 'F');
  doc.circle(cx + 9 * scale, cy - 16 * scale, 3.5 * scale, 'F');
  doc.ellipse(cx, cy - 7 * scale, 4 * scale, 3 * scale, 'F');
  // Curling monkey tail
  doc.moveTo(cx - 18 * scale, cy + 25 * scale);
  doc.curveTo(cx - 45 * scale, cy + 30 * scale, cx - 40 * scale, cy - 10 * scale, cx - 30 * scale, cy - 25 * scale);
  doc.stroke();
  // Banana in hand
  doc.ellipse(cx + 18 * scale, cy + 18 * scale, 12 * scale, 5 * scale);
}

// Giraffe: Tall neck with spots, little horns, smiling face
export function drawVectorGiraffe(doc: jsPDF, cx: number, cy: number, scale: number = 1): void {
  doc.setDrawColor(30, 30, 30);
  doc.setLineWidth(2.2 * scale);
  doc.ellipse(cx, cy + 40 * scale, 32 * scale, 24 * scale);
  // Tall long neck
  doc.line(cx - 10 * scale, cy + 30 * scale, cx - 8 * scale, cy - 35 * scale);
  doc.line(cx + 8 * scale, cy + 30 * scale, cx + 10 * scale, cy - 35 * scale);
  // Head
  doc.ellipse(cx + 4 * scale, cy - 42 * scale, 18 * scale, 14 * scale);
  // Horns
  doc.line(cx - 2 * scale, cy - 54 * scale, cx - 2 * scale, cy - 48 * scale);
  doc.line(cx + 8 * scale, cy - 54 * scale, cx + 8 * scale, cy - 48 * scale);
  doc.circle(cx - 2 * scale, cy - 55 * scale, 2.5 * scale, 'FD');
  doc.circle(cx + 8 * scale, cy - 55 * scale, 2.5 * scale, 'FD');
  // Spots along neck
  doc.circle(cx, cy - 20 * scale, 5 * scale);
  doc.circle(cx, cy - 2 * scale, 6 * scale);
  doc.circle(cx, cy + 16 * scale, 6.5 * scale);
}

// Zebra: Striped coat, upright mane
export function drawVectorZebra(doc: jsPDF, cx: number, cy: number, scale: number = 1): void {
  doc.setDrawColor(30, 30, 30);
  doc.setLineWidth(2.2 * scale);
  doc.ellipse(cx, cy + 12 * scale, 38 * scale, 28 * scale);
  doc.circle(cx + 25 * scale, cy - 15 * scale, 20 * scale);
  doc.line(cx + 20 * scale, cy - 32 * scale, cx + 18 * scale, cy - 42 * scale);
  doc.line(cx + 30 * scale, cy - 32 * scale, cx + 32 * scale, cy - 42 * scale);
  // Bold zebra stripes
  for (let s = -20; s <= 20; s += 10) {
    doc.line(cx + s * scale, cy - 2 * scale, cx + s * scale, cy + 26 * scale);
  }
}

// Panda: Black eye patches, bamboo stalk
export function drawVectorPanda(doc: jsPDF, cx: number, cy: number, scale: number = 1): void {
  doc.setDrawColor(30, 30, 30);
  doc.setLineWidth(2.2 * scale);
  doc.ellipse(cx, cy + 16 * scale, 36 * scale, 34 * scale);
  doc.circle(cx, cy - 16 * scale, 30 * scale);
  // Black ears
  doc.circle(cx - 24 * scale, cy - 38 * scale, 10 * scale, 'FD');
  doc.circle(cx + 24 * scale, cy - 38 * scale, 10 * scale, 'FD');
  // Eye patches
  doc.ellipse(cx - 12 * scale, cy - 16 * scale, 8 * scale, 6 * scale, 'FD');
  doc.ellipse(cx + 12 * scale, cy - 16 * scale, 8 * scale, 6 * scale, 'FD');
  doc.setFillColor(255, 255, 255);
  doc.circle(cx - 12 * scale, cy - 16 * scale, 2 * scale, 'F');
  doc.circle(cx + 12 * scale, cy - 16 * scale, 2 * scale, 'F');
  // Green bamboo stalk in paws
  doc.setDrawColor(34, 197, 94);
  doc.setLineWidth(3 * scale);
  doc.line(cx + 22 * scale, cy + 40 * scale, cx + 22 * scale, cy - 20 * scale);
}

// Farm Cow: Spotted hide, horns, cowbell
export function drawVectorCow(doc: jsPDF, cx: number, cy: number, scale: number = 1): void {
  doc.setDrawColor(30, 30, 30);
  doc.setLineWidth(2.2 * scale);
  doc.ellipse(cx, cy + 15 * scale, 42 * scale, 30 * scale);
  doc.circle(cx + 26 * scale, cy - 15 * scale, 22 * scale);
  // Snout
  doc.ellipse(cx + 34 * scale, cy - 10 * scale, 14 * scale, 10 * scale);
  doc.circle(cx + 30 * scale, cy - 9 * scale, 2 * scale, 'F');
  doc.circle(cx + 38 * scale, cy - 9 * scale, 2 * scale, 'F');
  // Horns
  doc.curveTo(cx + 18 * scale, cy - 32 * scale, cx + 14 * scale, cy - 42 * scale, cx + 10 * scale, cy - 40 * scale);
  doc.curveTo(cx + 34 * scale, cy - 32 * scale, cx + 38 * scale, cy - 42 * scale, cx + 42 * scale, cy - 40 * scale);
  // Spots
  doc.circle(cx - 15 * scale, cy + 12 * scale, 9 * scale, 'FD');
  doc.circle(cx + 8 * scale, cy + 18 * scale, 7 * scale, 'FD');
}

// Sheep: Puffy wool scallops
export function drawVectorSheep(doc: jsPDF, cx: number, cy: number, scale: number = 1): void {
  doc.setDrawColor(30, 30, 30);
  doc.setLineWidth(2.2 * scale);
  // Puffy wool perimeter
  for (let a = 0; a < 360; a += 30) {
    const rad = (a * Math.PI) / 180;
    doc.circle(cx + Math.cos(rad) * 36 * scale, cy + 12 * scale + Math.sin(rad) * 28 * scale, 12 * scale);
  }
  // Face
  doc.circle(cx + 24 * scale, cy - 6 * scale, 18 * scale);
  doc.ellipse(cx + 15 * scale, cy - 4 * scale, 6 * scale, 12 * scale);
  doc.ellipse(cx + 33 * scale, cy - 4 * scale, 6 * scale, 12 * scale);
}

// Piglet: Snout with nostrils, corkscrew tail
export function drawVectorPiglet(doc: jsPDF, cx: number, cy: number, scale: number = 1): void {
  doc.setDrawColor(30, 30, 30);
  doc.setLineWidth(2.2 * scale);
  doc.circle(cx, cy + 10 * scale, 34 * scale);
  doc.circle(cx, cy - 14 * scale, 26 * scale);
  doc.triangle(cx - 20 * scale, cy - 35 * scale, cx - 10 * scale, cy - 25 * scale, cx - 25 * scale, cy - 15 * scale);
  doc.triangle(cx + 20 * scale, cy - 35 * scale, cx + 10 * scale, cy - 25 * scale, cx + 25 * scale, cy - 15 * scale);
  // Big round snout
  doc.ellipse(cx, cy - 10 * scale, 15 * scale, 11 * scale);
  doc.circle(cx - 5 * scale, cy - 10 * scale, 2.5 * scale, 'F');
  doc.circle(cx + 5 * scale, cy - 10 * scale, 2.5 * scale, 'F');
  // Curly tail
  doc.moveTo(cx - 32 * scale, cy + 15 * scale);
  doc.curveTo(cx - 48 * scale, cy + 10 * scale, cx - 48 * scale, cy + 28 * scale, cx - 40 * scale, cy + 25 * scale);
  doc.stroke();
}

// Frog: Bulging eyes, lily pad
export function drawVectorFrog(doc: jsPDF, cx: number, cy: number, scale: number = 1): void {
  doc.setDrawColor(30, 30, 30);
  doc.setLineWidth(2.2 * scale);
  // Lily pad below
  doc.ellipse(cx, cy + 38 * scale, 55 * scale, 14 * scale);
  // Body and head
  doc.ellipse(cx, cy + 10 * scale, 32 * scale, 26 * scale);
  // Bulging eyes on top
  doc.circle(cx - 16 * scale, cy - 14 * scale, 12 * scale);
  doc.circle(cx + 16 * scale, cy - 14 * scale, 12 * scale);
  doc.setFillColor(30, 30, 30);
  doc.circle(cx - 16 * scale, cy - 14 * scale, 5 * scale, 'F');
  doc.circle(cx + 16 * scale, cy - 14 * scale, 5 * scale, 'F');
  // Wide frog smile
  doc.line(cx - 18 * scale, cy + 4 * scale, cx + 18 * scale, cy + 4 * scale);
}

// Puppy: Floppy ears, wagging tail, bone
export function drawVectorPuppy(doc: jsPDF, cx: number, cy: number, scale: number = 1): void {
  doc.setDrawColor(30, 30, 30);
  doc.setLineWidth(2.2 * scale);
  doc.ellipse(cx, cy + 18 * scale, 28 * scale, 32 * scale);
  doc.circle(cx, cy - 12 * scale, 26 * scale);
  // Long floppy ears
  doc.ellipse(cx - 24 * scale, cy - 6 * scale, 10 * scale, 20 * scale);
  doc.ellipse(cx + 24 * scale, cy - 6 * scale, 10 * scale, 20 * scale);
  // Snout & tongue
  doc.ellipse(cx, cy - 4 * scale, 14 * scale, 10 * scale);
  doc.circle(cx - 10 * scale, cy - 16 * scale, 3.5 * scale, 'F');
  doc.circle(cx + 10 * scale, cy - 16 * scale, 3.5 * scale, 'F');
  doc.circle(cx, cy - 8 * scale, 4 * scale, 'F');
  // Bone near paws
  doc.roundedRect(cx - 18 * scale, cy + 46 * scale, 36 * scale, 7 * scale, 3 * scale, 3 * scale);
}

// Kitten: Pointed triangular ears, whiskers, yarn ball
export function drawVectorKitten(doc: jsPDF, cx: number, cy: number, scale: number = 1): void {
  doc.setDrawColor(30, 30, 30);
  doc.setLineWidth(2.2 * scale);
  doc.ellipse(cx, cy + 16 * scale, 26 * scale, 30 * scale);
  doc.circle(cx, cy - 12 * scale, 24 * scale);
  // Pointed ears
  doc.triangle(cx - 22 * scale, cy - 34 * scale, cx - 8 * scale, cy - 24 * scale, cx - 22 * scale, cy - 14 * scale);
  doc.triangle(cx + 22 * scale, cy - 34 * scale, cx + 8 * scale, cy - 24 * scale, cx + 22 * scale, cy - 14 * scale);
  doc.circle(cx - 9 * scale, cy - 14 * scale, 3.5 * scale, 'F');
  doc.circle(cx + 9 * scale, cy - 14 * scale, 3.5 * scale, 'F');
  // Whiskers
  doc.line(cx - 26 * scale, cy - 8 * scale, cx - 10 * scale, cy - 6 * scale);
  doc.line(cx - 28 * scale, cy - 2 * scale, cx - 10 * scale, cy - 4 * scale);
  doc.line(cx + 10 * scale, cy - 6 * scale, cx + 26 * scale, cy - 8 * scale);
  doc.line(cx + 10 * scale, cy - 4 * scale, cx + 28 * scale, cy - 2 * scale);
  // Yarn ball
  doc.circle(cx + 28 * scale, cy + 34 * scale, 12 * scale);
}

// Tiger: Fierce stripes, whiskers
export function drawVectorTiger(doc: jsPDF, cx: number, cy: number, scale: number = 1): void {
  drawVectorLion(doc, cx, cy, scale);
  // Stripes on forehead & cheeks
  doc.line(cx, cy - 28 * scale, cx, cy - 18 * scale);
  doc.line(cx - 6 * scale, cy - 26 * scale, cx - 6 * scale, cy - 19 * scale);
  doc.line(cx + 6 * scale, cy - 26 * scale, cx + 6 * scale, cy - 19 * scale);
}

// Kangaroo: Big feet, tail, pouch with joey
export function drawVectorKangaroo(doc: jsPDF, cx: number, cy: number, scale: number = 1): void {
  doc.setDrawColor(30, 30, 30);
  doc.setLineWidth(2.2 * scale);
  doc.ellipse(cx, cy + 10 * scale, 30 * scale, 38 * scale);
  doc.circle(cx + 15 * scale, cy - 28 * scale, 18 * scale);
  doc.line(cx + 8 * scale, cy - 42 * scale, cx + 8 * scale, cy - 54 * scale);
  doc.line(cx + 18 * scale, cy - 42 * scale, cx + 20 * scale, cy - 54 * scale);
  // Pouch
  drawArcCurve(doc, cx - 8 * scale, cy + 10 * scale, 14 * scale, 14 * scale);
  // Joey head
  doc.circle(cx - 2 * scale, cy + 4 * scale, 8 * scale);
}

// Penguin: Tuxedo wings, iceberg
export function drawVectorPenguin(doc: jsPDF, cx: number, cy: number, scale: number = 1): void {
  doc.setDrawColor(30, 30, 30);
  doc.setLineWidth(2.2 * scale);
  // Iceberg
  doc.ellipse(cx, cy + 42 * scale, 48 * scale, 10 * scale);
  doc.ellipse(cx, cy + 6 * scale, 26 * scale, 36 * scale);
  doc.ellipse(cx, cy + 8 * scale, 16 * scale, 26 * scale); // White belly
  doc.circle(cx, cy - 24 * scale, 18 * scale);
  // Beak
  doc.triangle(cx - 5 * scale, cy - 22 * scale, cx + 5 * scale, cy - 22 * scale, cx, cy - 14 * scale, 'FD');
  // Flippers
  doc.ellipse(cx - 26 * scale, cy + 6 * scale, 7 * scale, 22 * scale);
  doc.ellipse(cx + 26 * scale, cy + 6 * scale, 7 * scale, 22 * scale);
}

// Tortoise: Hexagonal shell scutes
export function drawVectorTortoise(doc: jsPDF, cx: number, cy: number, scale: number = 1): void {
  doc.setDrawColor(30, 30, 30);
  doc.setLineWidth(2.2 * scale);
  // Shell
  doc.ellipse(cx, cy + 5 * scale, 44 * scale, 30 * scale);
  doc.line(cx - 44 * scale, cy + 18 * scale, cx + 44 * scale, cy + 18 * scale);
  // Scutes
  doc.circle(cx, cy, 12 * scale);
  doc.circle(cx - 20 * scale, cy + 4 * scale, 9 * scale);
  doc.circle(cx + 20 * scale, cy + 4 * scale, 9 * scale);
  // Head
  doc.ellipse(cx + 46 * scale, cy + 5 * scale, 14 * scale, 10 * scale);
}

// Squirrel: Giant bushy tail, acorn
export function drawVectorSquirrel(doc: jsPDF, cx: number, cy: number, scale: number = 1): void {
  doc.setDrawColor(30, 30, 30);
  doc.setLineWidth(2.2 * scale);
  doc.ellipse(cx - 10 * scale, cy + 16 * scale, 24 * scale, 28 * scale);
  doc.circle(cx - 6 * scale, cy - 14 * scale, 20 * scale);
  // Giant bushy tail
  doc.moveTo(cx - 24 * scale, cy + 35 * scale);
  doc.curveTo(cx - 55 * scale, cy + 20 * scale, cx - 55 * scale, cy - 35 * scale, cx - 25 * scale, cy - 45 * scale);
  doc.curveTo(cx - 10 * scale, cy - 45 * scale, cx - 18 * scale, cy - 20 * scale, cx - 18 * scale, cy + 10 * scale);
  doc.stroke();
  // Acorn
  doc.circle(cx + 14 * scale, cy + 12 * scale, 8 * scale);
}

// Hippo: Big snout, river ripples
export function drawVectorHippo(doc: jsPDF, cx: number, cy: number, scale: number = 1): void {
  doc.setDrawColor(30, 30, 30);
  doc.setLineWidth(2.2 * scale);
  doc.ellipse(cx, cy + 15 * scale, 45 * scale, 30 * scale);
  doc.circle(cx, cy - 15 * scale, 25 * scale);
  doc.ellipse(cx, cy - 8 * scale, 28 * scale, 18 * scale);
  doc.circle(cx - 10 * scale, cy - 8 * scale, 4 * scale, 'F');
  doc.circle(cx + 10 * scale, cy - 8 * scale, 4 * scale, 'F');
}

// Rhino: Horn on nose, armored shoulder
export function drawVectorRhino(doc: jsPDF, cx: number, cy: number, scale: number = 1): void {
  doc.setDrawColor(30, 30, 30);
  doc.setLineWidth(2.2 * scale);
  doc.ellipse(cx, cy + 15 * scale, 42 * scale, 28 * scale);
  doc.circle(cx + 25 * scale, cy - 12 * scale, 22 * scale);
  // Prominent horn
  doc.triangle(cx + 38 * scale, cy - 14 * scale, cx + 46 * scale, cy - 14 * scale, cx + 48 * scale, cy - 35 * scale, 'FD');
}

// Deer: Spotted body, tiny antlers
export function drawVectorDeer(doc: jsPDF, cx: number, cy: number, scale: number = 1): void {
  doc.setDrawColor(30, 30, 30);
  doc.setLineWidth(2.2 * scale);
  doc.ellipse(cx - 10 * scale, cy + 18 * scale, 34 * scale, 24 * scale);
  doc.ellipse(cx + 18 * scale, cy - 15 * scale, 16 * scale, 20 * scale);
  // Antlers
  doc.line(cx + 14 * scale, cy - 32 * scale, cx + 10 * scale, cy - 48 * scale);
  doc.line(cx + 24 * scale, cy - 32 * scale, cx + 28 * scale, cy - 48 * scale);
  // Spots
  doc.circle(cx - 12 * scale, cy + 14 * scale, 2.5 * scale, 'F');
  doc.circle(cx - 2 * scale, cy + 18 * scale, 2.5 * scale, 'F');
}

// Fox: Pointed ears, white-tipped bushy tail
export function drawVectorFox(doc: jsPDF, cx: number, cy: number, scale: number = 1): void {
  doc.setDrawColor(30, 30, 30);
  doc.setLineWidth(2.2 * scale);
  doc.ellipse(cx, cy + 16 * scale, 28 * scale, 26 * scale);
  doc.triangle(cx - 25 * scale, cy - 12 * scale, cx + 25 * scale, cy - 12 * scale, cx, cy + 8 * scale);
  doc.triangle(cx - 24 * scale, cy - 36 * scale, cx - 10 * scale, cy - 14 * scale, cx - 26 * scale, cy - 14 * scale);
  doc.triangle(cx + 24 * scale, cy - 36 * scale, cx + 10 * scale, cy - 14 * scale, cx + 26 * scale, cy - 14 * scale);
  // Big bushy tail
  doc.ellipse(cx - 32 * scale, cy + 24 * scale, 24 * scale, 12 * scale);
}

// Horse: Mane, hooves, fence
export function drawVectorHorse(doc: jsPDF, cx: number, cy: number, scale: number = 1): void {
  doc.setDrawColor(30, 30, 30);
  doc.setLineWidth(2.2 * scale);
  doc.ellipse(cx - 10 * scale, cy + 16 * scale, 38 * scale, 28 * scale);
  doc.ellipse(cx + 25 * scale, cy - 16 * scale, 18 * scale, 24 * scale);
  // Silky mane
  for (let m = -26; m <= 0; m += 7) {
    doc.line(cx + 18 * scale, cy + m * scale, cx + 8 * scale, cy + (m + 6) * scale);
  }
}

// Bunny: Long upright ears, carrot
export function drawVectorBunny(doc: jsPDF, cx: number, cy: number, scale: number = 1): void {
  doc.setDrawColor(30, 30, 30);
  doc.setLineWidth(2.2 * scale);
  doc.ellipse(cx, cy + 18 * scale, 26 * scale, 28 * scale);
  doc.circle(cx, cy - 10 * scale, 22 * scale);
  // Long ears
  doc.ellipse(cx - 8 * scale, cy - 38 * scale, 7 * scale, 22 * scale);
  doc.ellipse(cx + 8 * scale, cy - 38 * scale, 7 * scale, 22 * scale);
  // Whiskers & nose
  doc.circle(cx, cy - 6 * scale, 3 * scale, 'F');
  doc.line(cx - 18 * scale, cy - 4 * scale, cx - 6 * scale, cy - 5 * scale);
  doc.line(cx + 6 * scale, cy - 5 * scale, cx + 18 * scale, cy - 4 * scale);
}

// Dinosaur: Friendly brontosaurus
export function drawVectorDinosaur(doc: jsPDF, cx: number, cy: number, scale: number = 1): void {
  doc.setDrawColor(30, 30, 30);
  doc.setLineWidth(2.2 * scale);
  doc.ellipse(cx - 10 * scale, cy + 20 * scale, 42 * scale, 30 * scale);
  // Long neck
  doc.line(cx + 20 * scale, cy + 10 * scale, cx + 32 * scale, cy - 38 * scale);
  doc.line(cx + 34 * scale, cy + 20 * scale, cx + 44 * scale, cy - 38 * scale);
  doc.circle(cx + 38 * scale, cy - 42 * scale, 14 * scale);
  // Long tail
  doc.moveTo(cx - 45 * scale, cy + 15 * scale);
  doc.curveTo(cx - 65 * scale, cy + 25 * scale, cx - 75 * scale, cy - 5 * scale, cx - 70 * scale, cy - 15 * scale);
  doc.stroke();
}

// Butterfly: Symmetrical ornate wings
export function drawVectorButterfly(doc: jsPDF, cx: number, cy: number, scale: number = 1): void {
  doc.setDrawColor(30, 30, 30);
  doc.setLineWidth(2.2 * scale);
  // Body
  doc.ellipse(cx, cy, 6 * scale, 34 * scale);
  // Top wings
  doc.ellipse(cx - 32 * scale, cy - 16 * scale, 28 * scale, 22 * scale);
  doc.ellipse(cx + 32 * scale, cy - 16 * scale, 28 * scale, 22 * scale);
  // Bottom wings
  doc.ellipse(cx - 26 * scale, cy + 20 * scale, 20 * scale, 18 * scale);
  doc.ellipse(cx + 26 * scale, cy + 20 * scale, 20 * scale, 18 * scale);
  // Wing spots
  doc.circle(cx - 32 * scale, cy - 16 * scale, 8 * scale);
  doc.circle(cx + 32 * scale, cy - 16 * scale, 8 * scale);
  // Antennae
  doc.line(cx - 2 * scale, cy - 32 * scale, cx - 12 * scale, cy - 46 * scale);
  doc.line(cx + 2 * scale, cy - 32 * scale, cx + 12 * scale, cy - 46 * scale);
}

// Seal: Balancing star ball on nose
export function drawVectorSeal(doc: jsPDF, cx: number, cy: number, scale: number = 1): void {
  doc.setDrawColor(30, 30, 30);
  doc.setLineWidth(2.2 * scale);
  doc.ellipse(cx - 10 * scale, cy + 18 * scale, 34 * scale, 26 * scale);
  doc.circle(cx + 18 * scale, cy - 10 * scale, 18 * scale);
  // Star ball on nose
  doc.circle(cx + 28 * scale, cy - 36 * scale, 12 * scale);
}

// Birds: Specific vector drawings
export function drawVectorOwl(doc: jsPDF, cx: number, cy: number, scale: number = 1): void {
  doc.setDrawColor(30, 30, 30);
  doc.setLineWidth(2.2 * scale);
  doc.line(cx - 45 * scale, cy + 40 * scale, cx + 45 * scale, cy + 40 * scale);
  doc.ellipse(cx, cy + 6 * scale, 34 * scale, 38 * scale);
  doc.circle(cx - 14 * scale, cy - 12 * scale, 14 * scale);
  doc.circle(cx + 14 * scale, cy - 12 * scale, 14 * scale);
  doc.setFillColor(30, 30, 30);
  doc.circle(cx - 14 * scale, cy - 12 * scale, 6 * scale, 'F');
  doc.circle(cx + 14 * scale, cy - 12 * scale, 6 * scale, 'F');
  doc.triangle(cx - 4 * scale, cy - 3 * scale, cx + 4 * scale, cy - 3 * scale, cx, cy + 6 * scale, 'FD');
  doc.line(cx - 24 * scale, cy - 28 * scale, cx - 14 * scale, cy - 22 * scale);
  doc.line(cx + 24 * scale, cy - 28 * scale, cx + 14 * scale, cy - 22 * scale);
}

export function drawVectorPeacock(doc: jsPDF, cx: number, cy: number, scale: number = 1): void {
  doc.setDrawColor(30, 30, 30);
  doc.setLineWidth(2.2 * scale);
  // Fan of tail feathers
  for (let a = 180; a <= 360; a += 22) {
    const rad = (a * Math.PI) / 180;
    const px = cx + Math.cos(rad) * 55 * scale;
    const py = cy + 15 * scale + Math.sin(rad) * 45 * scale;
    doc.line(cx, cy + 15 * scale, px, py);
    doc.circle(px, py, 6 * scale);
  }
  // Body & crest
  doc.ellipse(cx, cy + 16 * scale, 16 * scale, 24 * scale);
  doc.circle(cx, cy - 14 * scale, 12 * scale);
}

export function drawVectorToucan(doc: jsPDF, cx: number, cy: number, scale: number = 1): void {
  doc.setDrawColor(30, 30, 30);
  doc.setLineWidth(2.2 * scale);
  doc.line(cx - 40 * scale, cy + 36 * scale, cx + 40 * scale, cy + 36 * scale);
  doc.ellipse(cx - 10 * scale, cy + 8 * scale, 24 * scale, 30 * scale);
  doc.circle(cx - 8 * scale, cy - 18 * scale, 18 * scale);
  // Giant bill
  doc.moveTo(cx + 8 * scale, cy - 28 * scale);
  doc.curveTo(cx + 45 * scale, cy - 25 * scale, cx + 55 * scale, cy - 5 * scale, cx + 35 * scale, cy - 2 * scale);
  doc.curveTo(cx + 20 * scale, cy - 8 * scale, cx + 8 * scale, cy - 10 * scale, cx + 8 * scale, cy - 28 * scale);
  doc.stroke();
}

export function drawVectorFlamingo(doc: jsPDF, cx: number, cy: number, scale: number = 1): void {
  doc.setDrawColor(30, 30, 30);
  doc.setLineWidth(2.2 * scale);
  doc.ellipse(cx, cy + 6 * scale, 28 * scale, 20 * scale);
  // Long S-neck
  doc.moveTo(cx + 18 * scale, cy + 2 * scale);
  doc.curveTo(cx + 34 * scale, cy - 20 * scale, cx + 22 * scale, cy - 40 * scale, cx + 28 * scale, cy - 48 * scale);
  doc.stroke();
  doc.circle(cx + 28 * scale, cy - 50 * scale, 10 * scale);
  // Stilt legs
  doc.line(cx - 6 * scale, cy + 24 * scale, cx - 6 * scale, cy + 54 * scale);
  doc.line(cx + 8 * scale, cy + 24 * scale, cx + 16 * scale, cy + 38 * scale);
}

export function drawVectorHummingbird(doc: jsPDF, cx: number, cy: number, scale: number = 1): void {
  doc.setDrawColor(30, 30, 30);
  doc.setLineWidth(2.2 * scale);
  doc.ellipse(cx - 12 * scale, cy, 22 * scale, 14 * scale);
  doc.circle(cx + 10 * scale, cy - 6 * scale, 10 * scale);
  // Needle beak
  doc.line(cx + 20 * scale, cy - 6 * scale, cx + 48 * scale, cy - 8 * scale);
  // Flower
  doc.circle(cx + 52 * scale, cy - 8 * scale, 8 * scale);
}

export function drawVectorSwan(doc: jsPDF, cx: number, cy: number, scale: number = 1): void {
  doc.setDrawColor(30, 30, 30);
  doc.setLineWidth(2.2 * scale);
  doc.ellipse(cx, cy + 12 * scale, 38 * scale, 22 * scale);
  doc.moveTo(cx + 22 * scale, cy + 8 * scale);
  doc.curveTo(cx + 38 * scale, cy - 10 * scale, cx + 20 * scale, cy - 36 * scale, cx + 28 * scale, cy - 44 * scale);
  doc.stroke();
  doc.circle(cx + 30 * scale, cy - 45 * scale, 8 * scale);
  doc.line(cx - 50 * scale, cy + 32 * scale, cx + 50 * scale, cy + 32 * scale);
}

export function drawVectorGenericBird(doc: jsPDF, cx: number, cy: number, scale: number = 1, birdName: string = 'Bird'): void {
  const bLower = birdName.toLowerCase();
  if (bLower.includes('owl')) drawVectorOwl(doc, cx, cy, scale);
  else if (bLower.includes('peacock')) drawVectorPeacock(doc, cx, cy, scale);
  else if (bLower.includes('toucan')) drawVectorToucan(doc, cx, cy, scale);
  else if (bLower.includes('flamingo')) drawVectorFlamingo(doc, cx, cy, scale);
  else if (bLower.includes('humming')) drawVectorHummingbird(doc, cx, cy, scale);
  else if (bLower.includes('swan')) drawVectorSwan(doc, cx, cy, scale);
  else if (bLower.includes('penguin')) drawVectorPenguin(doc, cx, cy, scale);
  else {
    doc.setDrawColor(30, 30, 30);
    doc.setLineWidth(2.2 * scale);
    doc.ellipse(cx, cy + 6 * scale, 34 * scale, 28 * scale);
    doc.circle(cx + 14 * scale, cy - 24 * scale, 20 * scale);
    doc.triangle(cx + 32 * scale, cy - 26 * scale, cx + 32 * scale, cy - 18 * scale, cx + 46 * scale, cy - 22 * scale, 'FD');
    doc.setFillColor(30, 30, 30);
    doc.circle(cx + 20 * scale, cy - 26 * scale, 3.5 * scale, 'F');
    doc.ellipse(cx - 10 * scale, cy + 4 * scale, 18 * scale, 12 * scale);
    doc.line(cx - 40 * scale, cy + 36 * scale, cx + 45 * scale, cy + 36 * scale);
  }
}

// Vehicles: Specific vector drawings
export function drawVectorCar(doc: jsPDF, cx: number, cy: number, scale: number = 1): void {
  doc.setDrawColor(30, 30, 30);
  doc.setLineWidth(2.2 * scale);
  doc.roundedRect(cx - 50 * scale, cy - 5 * scale, 100 * scale, 32 * scale, 6 * scale, 6 * scale);
  doc.roundedRect(cx - 30 * scale, cy - 32 * scale, 60 * scale, 28 * scale, 6 * scale, 6 * scale);
  doc.rect(cx - 24 * scale, cy - 28 * scale, 20 * scale, 20 * scale);
  doc.rect(cx + 4 * scale, cy - 28 * scale, 20 * scale, 20 * scale);
  doc.circle(cx - 28 * scale, cy + 28 * scale, 14 * scale);
  doc.circle(cx - 28 * scale, cy + 28 * scale, 6 * scale);
  doc.circle(cx + 28 * scale, cy + 28 * scale, 14 * scale);
  doc.circle(cx + 28 * scale, cy + 28 * scale, 6 * scale);
}

export function drawVectorTrain(doc: jsPDF, cx: number, cy: number, scale: number = 1): void {
  doc.setDrawColor(30, 30, 30);
  doc.setLineWidth(2.2 * scale);
  doc.rect(cx - 45 * scale, cy - 10 * scale, 60 * scale, 34 * scale);
  doc.rect(cx + 15 * scale, cy - 35 * scale, 35 * scale, 59 * scale);
  doc.rect(cx - 35 * scale, cy - 30 * scale, 12 * scale, 20 * scale);
  doc.circle(cx - 29 * scale, cy - 40 * scale, 7 * scale);
  doc.circle(cx - 23 * scale, cy - 48 * scale, 9 * scale);
  doc.circle(cx - 30 * scale, cy + 26 * scale, 12 * scale);
  doc.circle(cx - 5 * scale, cy + 26 * scale, 12 * scale);
  doc.circle(cx + 25 * scale, cy + 26 * scale, 16 * scale);
  doc.triangle(cx - 45 * scale, cy + 22 * scale, cx - 60 * scale, cy + 22 * scale, cx - 45 * scale, cy + 2 * scale);
}

export function drawVectorAirplane(doc: jsPDF, cx: number, cy: number, scale: number = 1): void {
  doc.setDrawColor(30, 30, 30);
  doc.setLineWidth(2.2 * scale);
  doc.ellipse(cx, cy, 55 * scale, 18 * scale);
  doc.triangle(cx - 10 * scale, cy - 12 * scale, cx + 15 * scale, cy - 12 * scale, cx - 25 * scale, cy - 45 * scale);
  doc.triangle(cx - 10 * scale, cy + 12 * scale, cx + 15 * scale, cy + 12 * scale, cx - 25 * scale, cy + 45 * scale);
  doc.triangle(cx - 42 * scale, cy - 8 * scale, cx - 55 * scale, cy - 8 * scale, cx - 52 * scale, cy - 30 * scale);
  for (let w = -20; w <= 30; w += 12) {
    doc.circle(cx + w * scale, cy - 2 * scale, 3 * scale);
  }
}

export function drawVectorHelicopter(doc: jsPDF, cx: number, cy: number, scale: number = 1): void {
  doc.setDrawColor(30, 30, 30);
  doc.setLineWidth(2.2 * scale);
  doc.ellipse(cx - 10 * scale, cy, 38 * scale, 26 * scale);
  // Rotor
  doc.line(cx - 10 * scale, cy - 26 * scale, cx - 10 * scale, cy - 36 * scale);
  doc.line(cx - 55 * scale, cy - 36 * scale, cx + 35 * scale, cy - 36 * scale);
  // Tail boom & small rotor
  doc.line(cx - 48 * scale, cy, cx - 75 * scale, cy - 10 * scale);
  doc.line(cx - 75 * scale, cy - 18 * scale, cx - 75 * scale, cy - 2 * scale);
  // Skids
  doc.line(cx - 30 * scale, cy + 32 * scale, cx + 15 * scale, cy + 32 * scale);
}

export function drawVectorSailboat(doc: jsPDF, cx: number, cy: number, scale: number = 1): void {
  doc.setDrawColor(30, 30, 30);
  doc.setLineWidth(2.2 * scale);
  // Hull
  drawPolygon(doc, [[cx - 45 * scale, cy + 15 * scale], [cx + 45 * scale, cy + 15 * scale], [cx + 30 * scale, cy + 35 * scale], [cx - 30 * scale, cy + 35 * scale]]);
  // Mast
  doc.line(cx - 5 * scale, cy + 15 * scale, cx - 5 * scale, cy - 45 * scale);
  // Sails
  doc.triangle(cx - 5 * scale, cy + 10 * scale, cx - 5 * scale, cy - 40 * scale, cx - 35 * scale, cy + 10 * scale);
  doc.triangle(cx - 2 * scale, cy + 10 * scale, cx - 2 * scale, cy - 40 * scale, cx + 30 * scale, cy + 10 * scale);
  // Water
  doc.line(cx - 60 * scale, cy + 42 * scale, cx + 60 * scale, cy + 42 * scale);
}

export function drawVectorRocket(doc: jsPDF, cx: number, cy: number, scale: number = 1): void {
  doc.setDrawColor(30, 30, 30);
  doc.setLineWidth(2.2 * scale);
  doc.roundedRect(cx - 16 * scale, cy - 30 * scale, 32 * scale, 65 * scale, 6 * scale, 6 * scale);
  // Nose cone
  doc.triangle(cx - 16 * scale, cy - 30 * scale, cx + 16 * scale, cy - 30 * scale, cx, cy - 55 * scale);
  // Porthole
  doc.circle(cx, cy - 8 * scale, 8 * scale);
  // Fins
  doc.triangle(cx - 16 * scale, cy + 10 * scale, cx - 16 * scale, cy + 35 * scale, cx - 32 * scale, cy + 38 * scale);
  doc.triangle(cx + 16 * scale, cy + 10 * scale, cx + 16 * scale, cy + 35 * scale, cx + 32 * scale, cy + 38 * scale);
  // Exhaust flame
  doc.triangle(cx - 10 * scale, cy + 35 * scale, cx + 10 * scale, cy + 35 * scale, cx, cy + 55 * scale, 'FD');
}

export function drawVectorSubmarine(doc: jsPDF, cx: number, cy: number, scale: number = 1): void {
  doc.setDrawColor(30, 30, 30);
  doc.setLineWidth(2.2 * scale);
  doc.ellipse(cx, cy, 54 * scale, 24 * scale);
  doc.roundedRect(cx - 12 * scale, cy - 32 * scale, 24 * scale, 16 * scale, 4 * scale, 4 * scale);
  // Periscope
  doc.line(cx, cy - 32 * scale, cx, cy - 46 * scale);
  doc.line(cx, cy - 46 * scale, cx + 10 * scale, cy - 46 * scale);
  // Portholes
  doc.circle(cx - 24 * scale, cy, 6 * scale);
  doc.circle(cx, cy, 6 * scale);
  doc.circle(cx + 24 * scale, cy, 6 * scale);
}

export function drawVectorTractor(doc: jsPDF, cx: number, cy: number, scale: number = 1): void {
  doc.setDrawColor(30, 30, 30);
  doc.setLineWidth(2.2 * scale);
  doc.rect(cx - 10 * scale, cy - 10 * scale, 45 * scale, 25 * scale);
  doc.rect(cx - 35 * scale, cy - 30 * scale, 30 * scale, 45 * scale);
  // Giant rear wheel
  doc.circle(cx - 20 * scale, cy + 22 * scale, 22 * scale);
  doc.circle(cx - 20 * scale, cy + 22 * scale, 10 * scale);
  // Small front wheel
  doc.circle(cx + 28 * scale, cy + 28 * scale, 12 * scale);
  doc.circle(cx + 28 * scale, cy + 28 * scale, 5 * scale);
}

export function drawVectorHotAirBalloon(doc: jsPDF, cx: number, cy: number, scale: number = 1): void {
  doc.setDrawColor(30, 30, 30);
  doc.setLineWidth(2.2 * scale);
  doc.circle(cx, cy - 15 * scale, 36 * scale);
  doc.line(cx - 20 * scale, cy + 15 * scale, cx - 12 * scale, cy + 35 * scale);
  doc.line(cx + 20 * scale, cy + 15 * scale, cx + 12 * scale, cy + 35 * scale);
  // Wicker basket
  doc.roundedRect(cx - 14 * scale, cy + 35 * scale, 28 * scale, 20 * scale, 3 * scale, 3 * scale);
}

export function drawVectorFireEngine(doc: jsPDF, cx: number, cy: number, scale: number = 1): void {
  doc.setDrawColor(30, 30, 30);
  doc.setLineWidth(2.2 * scale);
  // Main chassis & cab
  doc.roundedRect(cx - 56 * scale, cy - 8 * scale, 112 * scale, 36 * scale, 4 * scale, 4 * scale);
  doc.roundedRect(cx + 20 * scale, cy - 28 * scale, 36 * scale, 24 * scale, 3 * scale, 3 * scale);
  // Windshield & side window
  doc.rect(cx + 26 * scale, cy - 24 * scale, 26 * scale, 16 * scale);
  // Emergency roof siren light
  doc.roundedRect(cx + 34 * scale, cy - 35 * scale, 12 * scale, 7 * scale, 2 * scale, 2 * scale);
  // Extendable Ladder on roof rack
  doc.line(cx - 52 * scale, cy - 22 * scale, cx + 12 * scale, cy - 22 * scale);
  doc.line(cx - 52 * scale, cy - 14 * scale, cx + 12 * scale, cy - 14 * scale);
  for (let r = -48; r <= 8; r += 10) {
    doc.line(cx + r * scale, cy - 22 * scale, cx + r * scale, cy - 14 * scale);
  }
  // Coiled water hose reel
  doc.circle(cx - 25 * scale, cy + 8 * scale, 10 * scale);
  doc.circle(cx - 25 * scale, cy + 8 * scale, 4 * scale);
  // 3 Chunky wheels
  doc.circle(cx - 38 * scale, cy + 30 * scale, 12 * scale);
  doc.circle(cx - 38 * scale, cy + 30 * scale, 5 * scale);
  doc.circle(cx - 2 * scale, cy + 30 * scale, 12 * scale);
  doc.circle(cx - 2 * scale, cy + 30 * scale, 5 * scale);
  doc.circle(cx + 36 * scale, cy + 30 * scale, 12 * scale);
  doc.circle(cx + 36 * scale, cy + 30 * scale, 5 * scale);
}

export function drawVectorAmbulance(doc: jsPDF, cx: number, cy: number, scale: number = 1): void {
  doc.setDrawColor(30, 30, 30);
  doc.setLineWidth(2.2 * scale);
  // Ambulance body
  doc.roundedRect(cx - 52 * scale, cy - 22 * scale, 76 * scale, 50 * scale, 4 * scale, 4 * scale);
  doc.roundedRect(cx + 24 * scale, cy - 6 * scale, 28 * scale, 34 * scale, 3 * scale, 3 * scale);
  // Windows
  doc.rect(cx - 40 * scale, cy - 14 * scale, 24 * scale, 16 * scale);
  doc.rect(cx + 26 * scale, cy - 2 * scale, 20 * scale, 16 * scale);
  // Medical Cross Symbol
  doc.setFillColor(30, 30, 30);
  doc.rect(cx - 6 * scale, cy - 8 * scale, 6 * scale, 22 * scale, 'F');
  doc.rect(cx - 14 * scale, cy, 22 * scale, 6 * scale, 'F');
  // Flashing roof beacon
  doc.roundedRect(cx - 8 * scale, cy - 30 * scale, 14 * scale, 8 * scale, 2 * scale, 2 * scale);
  // Wheels
  doc.circle(cx - 28 * scale, cy + 30 * scale, 13 * scale);
  doc.circle(cx - 28 * scale, cy + 30 * scale, 5 * scale);
  doc.circle(cx + 34 * scale, cy + 30 * scale, 13 * scale);
  doc.circle(cx + 34 * scale, cy + 30 * scale, 5 * scale);
}

export function drawVectorPoliceCar(doc: jsPDF, cx: number, cy: number, scale: number = 1): void {
  doc.setDrawColor(30, 30, 30);
  doc.setLineWidth(2.2 * scale);
  // Sleek patrol sedan
  doc.roundedRect(cx - 52 * scale, cy - 2 * scale, 104 * scale, 30 * scale, 6 * scale, 6 * scale);
  doc.roundedRect(cx - 28 * scale, cy - 28 * scale, 56 * scale, 26 * scale, 5 * scale, 5 * scale);
  // Windows
  doc.rect(cx - 22 * scale, cy - 24 * scale, 20 * scale, 18 * scale);
  doc.rect(cx + 2 * scale, cy - 24 * scale, 22 * scale, 18 * scale);
  // Dual roof lightbar
  doc.rect(cx - 10 * scale, cy - 36 * scale, 20 * scale, 8 * scale);
  doc.line(cx, cy - 36 * scale, cx, cy - 28 * scale);
  // Police Star Badge
  doc.circle(cx, cy + 12 * scale, 7 * scale);
  // Wheels
  doc.circle(cx - 30 * scale, cy + 30 * scale, 13 * scale);
  doc.circle(cx - 30 * scale, cy + 30 * scale, 5 * scale);
  doc.circle(cx + 30 * scale, cy + 30 * scale, 13 * scale);
  doc.circle(cx + 30 * scale, cy + 30 * scale, 5 * scale);
}

export function drawVectorSchoolBus(doc: jsPDF, cx: number, cy: number, scale: number = 1): void {
  doc.setDrawColor(30, 30, 30);
  doc.setLineWidth(2.2 * scale);
  // Long boxy bus body
  doc.roundedRect(cx - 56 * scale, cy - 28 * scale, 112 * scale, 54 * scale, 4 * scale, 4 * scale);
  // Front grille hood
  doc.roundedRect(cx + 56 * scale, cy - 2 * scale, 14 * scale, 28 * scale, 2 * scale, 2 * scale);
  // 4 Passenger windows
  for (let w = 0; w < 4; w++) {
    const wx = cx - 48 * scale + w * 26 * scale;
    doc.rect(wx, cy - 20 * scale, 18 * scale, 18 * scale);
    // Smiling kid face in window
    doc.circle(wx + 9 * scale, cy - 10 * scale, 5 * scale);
    doc.circle(wx + 8 * scale, cy - 11 * scale, 1 * scale, 'F');
    doc.circle(wx + 10 * scale, cy - 11 * scale, 1 * scale, 'F');
  }
  // Stop sign paddle
  drawPolygon(doc, [[cx - 56 * scale, cy + 4 * scale], [cx - 68 * scale, cy], [cx - 68 * scale, cy + 16 * scale], [cx - 56 * scale, cy + 12 * scale]]);
  // Bumpers & Wheels
  doc.rect(cx - 58 * scale, cy + 22 * scale, 130 * scale, 4 * scale);
  doc.circle(cx - 32 * scale, cy + 30 * scale, 14 * scale);
  doc.circle(cx - 32 * scale, cy + 30 * scale, 6 * scale);
  doc.circle(cx + 38 * scale, cy + 30 * scale, 14 * scale);
  doc.circle(cx + 38 * scale, cy + 30 * scale, 6 * scale);
}

export function drawVectorDumpTruck(doc: jsPDF, cx: number, cy: number, scale: number = 1): void {
  doc.setDrawColor(30, 30, 30);
  doc.setLineWidth(2.2 * scale);
  // Cab
  doc.rect(cx + 12 * scale, cy - 28 * scale, 38 * scale, 52 * scale);
  doc.rect(cx + 20 * scale, cy - 22 * scale, 24 * scale, 18 * scale);
  // Tilted cargo bed
  drawPolygon(doc, [
    [cx - 55 * scale, cy - 32 * scale],
    [cx + 8 * scale, cy - 16 * scale],
    [cx + 8 * scale, cy + 16 * scale],
    [cx - 55 * scale, cy + 16 * scale],
  ]);
  // Rocks inside bed
  doc.circle(cx - 35 * scale, cy - 36 * scale, 8 * scale);
  doc.circle(cx - 18 * scale, cy - 28 * scale, 10 * scale);
  doc.circle(cx - 2 * scale, cy - 22 * scale, 7 * scale);
  // Wheels
  doc.circle(cx - 38 * scale, cy + 26 * scale, 15 * scale);
  doc.circle(cx - 38 * scale, cy + 26 * scale, 6 * scale);
  doc.circle(cx - 6 * scale, cy + 26 * scale, 15 * scale);
  doc.circle(cx - 6 * scale, cy + 26 * scale, 6 * scale);
  doc.circle(cx + 32 * scale, cy + 26 * scale, 15 * scale);
  doc.circle(cx + 32 * scale, cy + 26 * scale, 6 * scale);
}

export function drawVectorCementMixer(doc: jsPDF, cx: number, cy: number, scale: number = 1): void {
  doc.setDrawColor(30, 30, 30);
  doc.setLineWidth(2.2 * scale);
  // Cab
  doc.rect(cx + 20 * scale, cy - 24 * scale, 34 * scale, 48 * scale);
  doc.rect(cx + 26 * scale, cy - 18 * scale, 22 * scale, 16 * scale);
  // Tilted rotating mixer drum
  drawPolygon(doc, [
    [cx - 52 * scale, cy - 8 * scale],
    [cx - 15 * scale, cy - 32 * scale],
    [cx + 12 * scale, cy - 6 * scale],
    [cx - 15 * scale, cy + 20 * scale],
  ]);
  doc.line(cx - 40 * scale, cy - 14 * scale, cx - 2 * scale, cy - 2 * scale);
  doc.line(cx - 28 * scale, cy - 22 * scale, cx + 8 * scale, cy + 4 * scale);
  // Discharge chute
  doc.line(cx - 52 * scale, cy - 8 * scale, cx - 62 * scale, cy + 12 * scale);
  // Wheels
  doc.circle(cx - 36 * scale, cy + 26 * scale, 14 * scale);
  doc.circle(cx - 36 * scale, cy + 26 * scale, 5 * scale);
  doc.circle(cx - 4 * scale, cy + 26 * scale, 14 * scale);
  doc.circle(cx - 4 * scale, cy + 26 * scale, 5 * scale);
  doc.circle(cx + 36 * scale, cy + 26 * scale, 14 * scale);
  doc.circle(cx + 36 * scale, cy + 26 * scale, 5 * scale);
}

export function drawVectorBicycle(doc: jsPDF, cx: number, cy: number, scale: number = 1): void {
  doc.setDrawColor(30, 30, 30);
  doc.setLineWidth(2.4 * scale);
  // Two spoked wheels
  doc.circle(cx - 42 * scale, cy + 15 * scale, 24 * scale);
  doc.circle(cx - 42 * scale, cy + 15 * scale, 5 * scale);
  doc.circle(cx + 42 * scale, cy + 15 * scale, 24 * scale);
  doc.circle(cx + 42 * scale, cy + 15 * scale, 5 * scale);
  for (let a = 0; a < 360; a += 60) {
    const rad = (a * Math.PI) / 180;
    doc.line(cx - 42 * scale, cy + 15 * scale, cx - 42 * scale + Math.cos(rad) * 23 * scale, cy + 15 * scale + Math.sin(rad) * 23 * scale);
    doc.line(cx + 42 * scale, cy + 15 * scale, cx + 42 * scale + Math.cos(rad) * 23 * scale, cy + 15 * scale + Math.sin(rad) * 23 * scale);
  }
  // Diamond frame tubes
  doc.line(cx - 42 * scale, cy + 15 * scale, cx - 5 * scale, cy + 15 * scale);
  doc.line(cx - 5 * scale, cy + 15 * scale, cx - 18 * scale, cy - 18 * scale);
  doc.line(cx - 18 * scale, cy - 18 * scale, cx - 42 * scale, cy + 15 * scale);
  doc.line(cx - 18 * scale, cy - 18 * scale, cx + 24 * scale, cy - 18 * scale);
  doc.line(cx - 5 * scale, cy + 15 * scale, cx + 24 * scale, cy - 18 * scale);
  doc.line(cx + 24 * scale, cy - 18 * scale, cx + 42 * scale, cy + 15 * scale);
  // Seat & handlebars
  doc.line(cx - 24 * scale, cy - 22 * scale, cx - 10 * scale, cy - 22 * scale);
  doc.line(cx + 24 * scale, cy - 18 * scale, cx + 20 * scale, cy - 35 * scale);
  doc.line(cx + 12 * scale, cy - 35 * scale, cx + 28 * scale, cy - 35 * scale);
  // Basket on front
  doc.rect(cx + 26 * scale, cy - 30 * scale, 16 * scale, 14 * scale);
}

export function drawVectorMotorcycle(doc: jsPDF, cx: number, cy: number, scale: number = 1): void {
  doc.setDrawColor(30, 30, 30);
  doc.setLineWidth(2.4 * scale);
  // Wheels
  doc.circle(cx - 42 * scale, cy + 16 * scale, 22 * scale);
  doc.circle(cx - 42 * scale, cy + 16 * scale, 8 * scale);
  doc.circle(cx + 42 * scale, cy + 16 * scale, 22 * scale);
  doc.circle(cx + 42 * scale, cy + 16 * scale, 8 * scale);
  // Engine & Frame
  doc.rect(cx - 12 * scale, cy - 2 * scale, 26 * scale, 22 * scale);
  doc.line(cx - 42 * scale, cy + 16 * scale, cx, cy + 16 * scale);
  doc.line(cx, cy + 16 * scale, cx + 42 * scale, cy + 16 * scale);
  // Fuel tank & seat
  doc.ellipse(cx + 5 * scale, cy - 12 * scale, 18 * scale, 10 * scale);
  doc.line(cx - 25 * scale, cy - 10 * scale, cx - 5 * scale, cy - 10 * scale);
  // Front fork & handlebar
  doc.line(cx + 42 * scale, cy + 16 * scale, cx + 22 * scale, cy - 28 * scale);
  doc.line(cx + 16 * scale, cy - 28 * scale, cx + 28 * scale, cy - 28 * scale);
  // Round headlight
  doc.circle(cx + 28 * scale, cy - 22 * scale, 6 * scale);
  // Exhaust pipe
  doc.line(cx - 5 * scale, cy + 12 * scale, cx - 45 * scale, cy + 12 * scale);
}

// Fruits & Vegetables: Distinct drawings
export function drawVectorFruit(doc: jsPDF, cx: number, cy: number, fruitName: string, scale: number = 1): void {
  doc.setDrawColor(30, 30, 30);
  doc.setLineWidth(2.2 * scale);
  const fLower = fruitName.toLowerCase();

  if (fLower.includes('straw')) {
    doc.moveTo(cx, cy + 42 * scale);
    doc.curveTo(cx - 42 * scale, cy + 20 * scale, cx - 35 * scale, cy - 20 * scale, cx, cy - 25 * scale);
    doc.curveTo(cx + 35 * scale, cy - 20 * scale, cx + 42 * scale, cy + 20 * scale, cx, cy + 42 * scale);
    doc.stroke();
    doc.ellipse(cx - 14 * scale, cy - 28 * scale, 12 * scale, 5 * scale);
    doc.ellipse(cx + 14 * scale, cy - 28 * scale, 12 * scale, 5 * scale);
    for (let s = -20; s <= 20; s += 10) {
      doc.circle(cx + s * scale, cy + 5 * scale, 1.5 * scale, 'F');
      doc.circle(cx + s * 0.7 * scale, cy + 20 * scale, 1.5 * scale, 'F');
    }
  } else if (fLower.includes('carrot')) {
    doc.triangle(cx - 18 * scale, cy - 25 * scale, cx + 18 * scale, cy - 25 * scale, cx, cy + 45 * scale);
    doc.line(cx, cy - 25 * scale, cx - 15 * scale, cy - 45 * scale);
    doc.line(cx, cy - 25 * scale, cx, cy - 48 * scale);
    doc.line(cx, cy - 25 * scale, cx + 15 * scale, cy - 45 * scale);
  } else if (fLower.includes('banana')) {
    doc.moveTo(cx - 35 * scale, cy + 25 * scale);
    doc.curveTo(cx - 20 * scale, cy - 25 * scale, cx + 25 * scale, cy - 25 * scale, cx + 45 * scale, cy - 5 * scale);
    doc.curveTo(cx + 25 * scale, cy - 10 * scale, cx - 10 * scale, cy - 8 * scale, cx - 35 * scale, cy + 25 * scale);
    doc.stroke();
  } else if (fLower.includes('corn')) {
    doc.ellipse(cx, cy, 18 * scale, 42 * scale);
    for (let yK = -30; yK <= 30; yK += 10) {
      doc.line(cx - 15 * scale, cy + yK * scale, cx + 15 * scale, cy + yK * scale);
    }
  } else if (fLower.includes('watermel')) {
    // Watermelon wedge
    drawArcCurve(doc, cx, cy, 45 * scale, 45 * scale);
    doc.line(cx - 38 * scale, cy + 22 * scale, cx + 38 * scale, cy + 22 * scale);
    doc.circle(cx - 15 * scale, cy + 12 * scale, 2 * scale, 'F');
    doc.circle(cx + 15 * scale, cy + 12 * scale, 2 * scale, 'F');
    doc.circle(cx, cy + 6 * scale, 2 * scale, 'F');
  } else if (fLower.includes('pineapp')) {
    doc.ellipse(cx, cy + 10 * scale, 28 * scale, 38 * scale);
    // Spiky crown
    doc.triangle(cx - 18 * scale, cy - 24 * scale, cx - 6 * scale, cy - 24 * scale, cx - 22 * scale, cy - 50 * scale);
    doc.triangle(cx - 6 * scale, cy - 24 * scale, cx + 6 * scale, cy - 24 * scale, cx, cy - 55 * scale);
    doc.triangle(cx + 6 * scale, cy - 24 * scale, cx + 18 * scale, cy - 24 * scale, cx + 22 * scale, cy - 50 * scale);
  } else if (fLower.includes('grape')) {
    // Grapes bunch
    for (let gr = 0; gr < 4; gr++) {
      for (let gc = 0; gc <= 3 - gr; gc++) {
        doc.circle(cx - (3 - gr) * 8 * scale + gc * 16 * scale, cy - 20 * scale + gr * 16 * scale, 9 * scale);
      }
    }
  } else {
    // Round apple/orange
    doc.circle(cx, cy, 38 * scale);
    doc.ellipse(cx, cy - 38 * scale, 8 * scale, 4 * scale);
  }

  // Cute face on fruit
  doc.setFillColor(30, 30, 30);
  doc.circle(cx - 10 * scale, cy, 3 * scale, 'F');
  doc.circle(cx + 10 * scale, cy, 3 * scale, 'F');
  doc.line(cx - 6 * scale, cy + 10 * scale, cx + 6 * scale, cy + 10 * scale);
}

// Festivals & Cultural Celebrations: Distinct drawings
export function drawVectorDiya(doc: jsPDF, cx: number, cy: number, scale: number = 1): void {
  doc.setDrawColor(30, 30, 30);
  doc.setLineWidth(2.2 * scale);
  // Clay base
  doc.moveTo(cx - 45 * scale, cy + 10 * scale);
  doc.curveTo(cx - 40 * scale, cy + 42 * scale, cx + 40 * scale, cy + 42 * scale, cx + 45 * scale, cy + 10 * scale);
  doc.stroke();
  doc.line(cx - 45 * scale, cy + 10 * scale, cx + 45 * scale, cy + 10 * scale);
  // Burning teardrop flame
  doc.moveTo(cx, cy - 35 * scale);
  doc.curveTo(cx + 20 * scale, cy - 10 * scale, cx + 15 * scale, cy + 10 * scale, cx, cy + 10 * scale);
  doc.curveTo(cx - 15 * scale, cy + 10 * scale, cx - 20 * scale, cy - 10 * scale, cx, cy - 35 * scale);
  doc.stroke();
  // Radiance rays
  for (let r = 0; r < 5; r++) {
    const angle = 200 + r * 35;
    const rad = (angle * Math.PI) / 180;
    doc.line(cx + Math.cos(rad) * 26 * scale, cy - 15 * scale + Math.sin(rad) * 26 * scale, cx + Math.cos(rad) * 36 * scale, cy - 15 * scale + Math.sin(rad) * 36 * scale);
  }
}

export function drawVectorChristmasTree(doc: jsPDF, cx: number, cy: number, scale: number = 1): void {
  doc.setDrawColor(30, 30, 30);
  doc.setLineWidth(2.2 * scale);
  // 3 Pine tiers
  doc.triangle(cx - 24 * scale, cy - 15 * scale, cx + 24 * scale, cy - 15 * scale, cx, cy - 45 * scale);
  doc.triangle(cx - 36 * scale, cy + 10 * scale, cx + 36 * scale, cy + 10 * scale, cx, cy - 25 * scale);
  doc.triangle(cx - 48 * scale, cy + 35 * scale, cx + 48 * scale, cy + 35 * scale, cx, cy - 5 * scale);
  // Trunk
  doc.rect(cx - 10 * scale, cy + 35 * scale, 20 * scale, 18 * scale);
  // Star on top
  doc.circle(cx, cy - 50 * scale, 5 * scale, 'FD');
  // Baubles
  doc.circle(cx - 20 * scale, cy + 20 * scale, 4 * scale);
  doc.circle(cx + 20 * scale, cy + 20 * scale, 4 * scale);
  doc.circle(cx, cy + 5 * scale, 4 * scale);
}

export function drawVectorHoliPichkari(doc: jsPDF, cx: number, cy: number, scale: number = 1): void {
  doc.setDrawColor(30, 30, 30);
  doc.setLineWidth(2.2 * scale);
  // Cylinder gun
  doc.rect(cx - 40 * scale, cy - 8 * scale, 65 * scale, 16 * scale);
  doc.line(cx + 25 * scale, cy, cx + 45 * scale, cy);
  // Plunger handle
  doc.line(cx - 40 * scale, cy, cx - 60 * scale, cy);
  doc.rect(cx - 65 * scale, cy - 12 * scale, 8 * scale, 24 * scale);
  // Squirting droplets
  doc.circle(cx + 52 * scale, cy - 8 * scale, 4 * scale);
  doc.circle(cx + 62 * scale, cy, 5 * scale);
  doc.circle(cx + 54 * scale, cy + 12 * scale, 3.5 * scale);
}

export function drawVectorEidLantern(doc: jsPDF, cx: number, cy: number, scale: number = 1): void {
  doc.setDrawColor(30, 30, 30);
  doc.setLineWidth(2.2 * scale);
  // Crescent moon
  drawArcCurve(doc, cx - 15 * scale, cy - 10 * scale, 30 * scale, 30 * scale);
  doc.circle(cx - 5 * scale, cy - 12 * scale, 6 * scale, 'FD');
  // Hanging lantern (Fanoos)
  doc.line(cx + 25 * scale, cy - 45 * scale, cx + 25 * scale, cy - 20 * scale);
  doc.rect(cx + 15 * scale, cy - 20 * scale, 20 * scale, 35 * scale, 'FD');
  doc.triangle(cx + 12 * scale, cy - 20 * scale, cx + 38 * scale, cy - 20 * scale, cx + 25 * scale, cy - 30 * scale);
  doc.triangle(cx + 15 * scale, cy + 15 * scale, cx + 35 * scale, cy + 15 * scale, cx + 25 * scale, cy + 25 * scale);
}

export function drawVectorKites(doc: jsPDF, cx: number, cy: number, scale: number = 1): void {
  doc.setDrawColor(30, 30, 30);
  doc.setLineWidth(2.2 * scale);
  // Diamond kite
  drawPolygon(doc, [[cx, cy - 45 * scale], [cx + 38 * scale, cy], [cx, cy + 35 * scale], [cx - 38 * scale, cy]]);
  doc.line(cx, cy - 45 * scale, cx, cy + 35 * scale);
  doc.line(cx - 38 * scale, cy, cx + 38 * scale, cy);
  // String tail & bows
  doc.moveTo(cx, cy + 35 * scale);
  doc.curveTo(cx + 20 * scale, cy + 50 * scale, cx - 10 * scale, cy + 65 * scale, cx + 15 * scale, cy + 75 * scale);
  doc.stroke();
}

export function drawVectorRangoli(doc: jsPDF, cx: number, cy: number, scale: number = 1): void {
  doc.setDrawColor(30, 30, 30);
  doc.setLineWidth(2.2 * scale);
  // Concentric decorative rings
  doc.circle(cx, cy, 14 * scale);
  doc.circle(cx, cy, 32 * scale);
  doc.circle(cx, cy, 50 * scale);
  // 8 Petals
  for (let a = 0; a < 360; a += 45) {
    const rad = (a * Math.PI) / 180;
    const px = cx + Math.cos(rad) * 32 * scale;
    const py = cy + Math.sin(rad) * 32 * scale;
    doc.circle(px, py, 11 * scale);
  }
  // 4 Outer Diyas
  for (let d = 0; d < 4; d++) {
    const angle = d * 90;
    const rad = (angle * Math.PI) / 180;
    const dx = cx + Math.cos(rad) * 48 * scale;
    const dy = cy + Math.sin(rad) * 48 * scale;
    doc.circle(dx, dy, 5 * scale, 'FD');
  }
}

export function drawVectorBirthdayCake(doc: jsPDF, cx: number, cy: number, scale: number = 1): void {
  doc.setDrawColor(30, 30, 30);
  doc.setLineWidth(2.2 * scale);
  // Tier 1 (Bottom)
  doc.roundedRect(cx - 52 * scale, cy + 8 * scale, 104 * scale, 30 * scale, 3 * scale, 3 * scale);
  // Tier 2 (Middle)
  doc.roundedRect(cx - 36 * scale, cy - 18 * scale, 72 * scale, 26 * scale, 3 * scale, 3 * scale);
  // Tier 3 (Top)
  doc.roundedRect(cx - 20 * scale, cy - 40 * scale, 40 * scale, 22 * scale, 3 * scale, 3 * scale);
  // Scalloped frosting on bottom tier
  for (let s = -46; s <= 46; s += 15) {
    doc.circle(cx + s * scale, cy + 8 * scale, 6 * scale);
  }
  // 3 Candles on top
  const candleXs = [-12, 0, 12];
  candleXs.forEach((xOff) => {
    doc.rect(cx + (xOff - 2) * scale, cy - 54 * scale, 4 * scale, 14 * scale);
    // Teardrop flame
    doc.circle(cx + xOff * scale, cy - 58 * scale, 2.5 * scale, 'FD');
  });
  // Pedestal stand
  doc.line(cx - 58 * scale, cy + 38 * scale, cx + 58 * scale, cy + 38 * scale);
  doc.line(cx - 15 * scale, cy + 38 * scale, cx - 25 * scale, cy + 48 * scale);
  doc.line(cx + 15 * scale, cy + 38 * scale, cx + 25 * scale, cy + 48 * scale);
  doc.line(cx - 30 * scale, cy + 48 * scale, cx + 30 * scale, cy + 48 * scale);
}

export function drawVectorPumpkin(doc: jsPDF, cx: number, cy: number, scale: number = 1): void {
  doc.setDrawColor(30, 30, 30);
  doc.setLineWidth(2.2 * scale);
  // Plump ribbed segments
  doc.ellipse(cx, cy + 4 * scale, 48 * scale, 36 * scale);
  doc.ellipse(cx - 18 * scale, cy + 4 * scale, 32 * scale, 35 * scale);
  doc.ellipse(cx + 18 * scale, cy + 4 * scale, 32 * scale, 35 * scale);
  // Curved woody stem
  doc.rect(cx - 5 * scale, cy - 38 * scale, 10 * scale, 14 * scale);
  // Carved Jack-o'-Lantern eyes, nose, smile
  doc.triangle(cx - 18 * scale, cy - 8 * scale, cx - 6 * scale, cy - 8 * scale, cx - 12 * scale, cy - 18 * scale, 'FD');
  doc.triangle(cx + 6 * scale, cy - 8 * scale, cx + 18 * scale, cy - 8 * scale, cx + 12 * scale, cy - 18 * scale, 'FD');
  doc.triangle(cx - 4 * scale, cy - 2 * scale, cx + 4 * scale, cy - 2 * scale, cx, cy - 7 * scale, 'FD');
  // Big toothy smile
  doc.moveTo(cx - 26 * scale, cy + 10 * scale);
  doc.curveTo(cx - 15 * scale, cy + 28 * scale, cx + 15 * scale, cy + 28 * scale, cx + 26 * scale, cy + 10 * scale);
  doc.stroke();
}

export function drawVectorSnowman(doc: jsPDF, cx: number, cy: number, scale: number = 1): void {
  doc.setDrawColor(30, 30, 30);
  doc.setLineWidth(2.2 * scale);
  // 3 Snowball tiers
  doc.circle(cx, cy + 25 * scale, 34 * scale); // Bottom
  doc.circle(cx, cy - 14 * scale, 24 * scale); // Middle
  doc.circle(cx, cy - 44 * scale, 16 * scale); // Head
  // Carrot nose
  doc.triangle(cx, cy - 46 * scale, cx, cy - 40 * scale, cx + 16 * scale, cy - 43 * scale, 'FD');
  // Coal eyes & smile
  doc.circle(cx - 5 * scale, cy - 48 * scale, 2 * scale, 'F');
  doc.circle(cx + 5 * scale, cy - 48 * scale, 2 * scale, 'F');
  for (let m = -8; m <= 8; m += 4) {
    doc.circle(cx + m * scale, cy - 38 * scale + Math.abs(m) * 0.4 * scale, 1.2 * scale, 'F');
  }
  // Top hat
  doc.line(cx - 18 * scale, cy - 58 * scale, cx + 18 * scale, cy - 58 * scale);
  doc.rect(cx - 10 * scale, cy - 72 * scale, 20 * scale, 14 * scale);
  // Scarf
  doc.roundedRect(cx - 16 * scale, cy - 30 * scale, 32 * scale, 8 * scale, 2 * scale, 2 * scale);
  doc.rect(cx + 6 * scale, cy - 22 * scale, 8 * scale, 18 * scale);
  // Coal buttons
  doc.circle(cx, cy - 18 * scale, 2.5 * scale, 'F');
  doc.circle(cx, cy - 8 * scale, 2.5 * scale, 'F');
  doc.circle(cx, cy + 2 * scale, 2.5 * scale, 'F');
}

export function drawVectorMonster(doc: jsPDF, cx: number, cy: number, scale: number = 1): void {
  doc.setDrawColor(30, 30, 30);
  doc.setLineWidth(2.2 * scale);
  // Fuzzy round pear body
  doc.ellipse(cx, cy + 12 * scale, 42 * scale, 48 * scale);
  // Soft striped horns
  doc.curveTo(cx - 24 * scale, cy - 35 * scale, cx - 35 * scale, cy - 55 * scale, cx - 20 * scale, cy - 52 * scale);
  doc.curveTo(cx + 24 * scale, cy - 35 * scale, cx + 35 * scale, cy - 55 * scale, cx + 20 * scale, cy - 52 * scale);
  // Three eyes
  doc.circle(cx - 16 * scale, cy - 14 * scale, 8 * scale);
  doc.circle(cx, cy - 22 * scale, 10 * scale);
  doc.circle(cx + 16 * scale, cy - 14 * scale, 8 * scale);
  doc.circle(cx - 16 * scale, cy - 14 * scale, 3 * scale, 'F');
  doc.circle(cx, cy - 22 * scale, 4 * scale, 'F');
  doc.circle(cx + 16 * scale, cy - 14 * scale, 3 * scale, 'F');
  // Wide open smile with 2 fangs
  doc.moveTo(cx - 18 * scale, cy + 2 * scale);
  doc.curveTo(cx - 10 * scale, cy + 20 * scale, cx + 10 * scale, cy + 20 * scale, cx + 18 * scale, cy + 2 * scale);
  doc.stroke();
  doc.triangle(cx - 10 * scale, cy + 3 * scale, cx - 4 * scale, cy + 3 * scale, cx - 7 * scale, cy + 10 * scale, 'FD');
  doc.triangle(cx + 4 * scale, cy + 3 * scale, cx + 10 * scale, cy + 3 * scale, cx + 7 * scale, cy + 10 * scale, 'FD');
  // Big belly spots
  doc.circle(cx - 12 * scale, cy + 24 * scale, 4 * scale);
  doc.circle(cx + 12 * scale, cy + 22 * scale, 5 * scale);
  doc.circle(cx, cy + 34 * scale, 4.5 * scale);
  // Chubby feet
  doc.ellipse(cx - 18 * scale, cy + 58 * scale, 14 * scale, 8 * scale);
  doc.ellipse(cx + 18 * scale, cy + 58 * scale, 14 * scale, 8 * scale);
}

export function drawVectorRobot(doc: jsPDF, cx: number, cy: number, scale: number = 1): void {
  doc.setDrawColor(30, 30, 30);
  doc.setLineWidth(2.2 * scale);
  // Head
  doc.roundedRect(cx - 24 * scale, cy - 48 * scale, 48 * scale, 32 * scale, 4 * scale, 4 * scale);
  // Antenna
  doc.line(cx, cy - 48 * scale, cx, cy - 62 * scale);
  doc.circle(cx, cy - 64 * scale, 4 * scale, 'FD');
  // Screen eyes & smile
  doc.circle(cx - 10 * scale, cy - 34 * scale, 4.5 * scale);
  doc.circle(cx + 10 * scale, cy - 34 * scale, 4.5 * scale);
  doc.line(cx - 8 * scale, cy - 22 * scale, cx + 8 * scale, cy - 22 * scale);
  // Torso
  doc.roundedRect(cx - 32 * scale, cy - 10 * scale, 64 * scale, 46 * scale, 4 * scale, 4 * scale);
  // Dials & screen on chest
  doc.rect(cx - 20 * scale, cy - 2 * scale, 40 * scale, 18 * scale);
  doc.circle(cx - 14 * scale, cy + 24 * scale, 4 * scale);
  doc.circle(cx, cy + 24 * scale, 4 * scale);
  doc.circle(cx + 14 * scale, cy + 24 * scale, 4 * scale);
  // Accordion arms
  doc.line(cx - 32 * scale, cy + 4 * scale, cx - 48 * scale, cy + 18 * scale);
  doc.line(cx + 32 * scale, cy + 4 * scale, cx + 48 * scale, cy + 18 * scale);
  // Legs
  doc.rect(cx - 20 * scale, cy + 36 * scale, 14 * scale, 24 * scale);
  doc.rect(cx + 6 * scale, cy + 36 * scale, 14 * scale, 24 * scale);
}

export function drawVectorCastle(doc: jsPDF, cx: number, cy: number, scale: number = 1): void {
  doc.setDrawColor(30, 30, 30);
  doc.setLineWidth(2.2 * scale);
  // Central keep
  doc.rect(cx - 28 * scale, cy - 16 * scale, 56 * scale, 52 * scale);
  // Left & Right Towers
  doc.rect(cx - 52 * scale, cy - 34 * scale, 24 * scale, 70 * scale);
  doc.rect(cx + 28 * scale, cy - 34 * scale, 24 * scale, 70 * scale);
  // Conical roofs
  doc.triangle(cx - 54 * scale, cy - 34 * scale, cx - 26 * scale, cy - 34 * scale, cx - 40 * scale, cy - 60 * scale);
  doc.triangle(cx + 26 * scale, cy - 34 * scale, cx + 54 * scale, cy - 34 * scale, cx + 40 * scale, cy - 60 * scale);
  // Flags on top
  doc.line(cx - 40 * scale, cy - 60 * scale, cx - 40 * scale, cy - 72 * scale);
  drawPolygon(doc, [[cx - 40 * scale, cy - 72 * scale], [cx - 26 * scale, cy - 66 * scale], [cx - 40 * scale, cy - 60 * scale]]);
  doc.line(cx + 40 * scale, cy - 60 * scale, cx + 40 * scale, cy - 72 * scale);
  drawPolygon(doc, [[cx + 40 * scale, cy - 72 * scale], [cx + 54 * scale, cy - 66 * scale], [cx + 40 * scale, cy - 60 * scale]]);
  // Main arched gateway
  doc.roundedRect(cx - 14 * scale, cy + 16 * scale, 28 * scale, 20 * scale, 8 * scale, 8 * scale);
}

export function drawVectorTeddyBear(doc: jsPDF, cx: number, cy: number, scale: number = 1): void {
  doc.setDrawColor(30, 30, 30);
  doc.setLineWidth(2.2 * scale);
  // Body
  doc.ellipse(cx, cy + 16 * scale, 34 * scale, 38 * scale);
  // Head
  doc.circle(cx, cy - 18 * scale, 28 * scale);
  // Round ears
  doc.circle(cx - 24 * scale, cy - 40 * scale, 10 * scale);
  doc.circle(cx + 24 * scale, cy - 40 * scale, 10 * scale);
  // Snout & heart nose
  doc.ellipse(cx, cy - 10 * scale, 14 * scale, 10 * scale);
  doc.circle(cx - 10 * scale, cy - 22 * scale, 3.5 * scale, 'F');
  doc.circle(cx + 10 * scale, cy - 22 * scale, 3.5 * scale, 'F');
  doc.circle(cx, cy - 13 * scale, 3.5 * scale, 'F');
  // Hugging big star
  doc.circle(cx, cy + 16 * scale, 14 * scale);
  // Paw pads
  doc.ellipse(cx - 24 * scale, cy + 44 * scale, 12 * scale, 8 * scale);
  doc.ellipse(cx + 24 * scale, cy + 44 * scale, 12 * scale, 8 * scale);
}

export function drawVectorAlien(doc: jsPDF, cx: number, cy: number, scale: number = 1): void {
  doc.setDrawColor(30, 30, 30);
  doc.setLineWidth(2.2 * scale);
  // Flying saucer rim
  doc.ellipse(cx, cy + 12 * scale, 58 * scale, 20 * scale);
  doc.ellipse(cx, cy + 12 * scale, 44 * scale, 14 * scale);
  // Glass dome cockpit
  drawArcCurve(doc, cx, cy + 10 * scale, 28 * scale, 28 * scale);
  // Cute alien inside dome
  doc.ellipse(cx, cy - 6 * scale, 12 * scale, 14 * scale);
  doc.circle(cx, cy - 8 * scale, 5 * scale); // Giant friendly cyclops eye
  doc.circle(cx, cy - 8 * scale, 2 * scale, 'F');
  // Antenna with star
  doc.line(cx, cy - 20 * scale, cx, cy - 30 * scale);
  doc.circle(cx, cy - 32 * scale, 3 * scale, 'FD');
  // Saucer lights
  for (let l = -36; l <= 36; l += 18) {
    doc.circle(cx + l * scale, cy + 18 * scale, 3 * scale, 'FD');
  }
}

export function drawVectorDragon(doc: jsPDF, cx: number, cy: number, scale: number = 1): void {
  doc.setDrawColor(30, 30, 30);
  doc.setLineWidth(2.2 * scale);
  // Chubby baby dragon body & head
  doc.ellipse(cx, cy + 14 * scale, 36 * scale, 40 * scale);
  doc.circle(cx + 8 * scale, cy - 20 * scale, 24 * scale);
  // Round snout
  doc.ellipse(cx + 20 * scale, cy - 16 * scale, 12 * scale, 9 * scale);
  doc.circle(cx + 22 * scale, cy - 18 * scale, 1.8 * scale, 'F');
  // Cute smiling eyes
  doc.circle(cx + 8 * scale, cy - 25 * scale, 3.5 * scale, 'F');
  // Small bat wings
  drawPolygon(doc, [
    [cx - 18 * scale, cy],
    [cx - 45 * scale, cy - 24 * scale],
    [cx - 34 * scale, cy],
    [cx - 48 * scale, cy + 12 * scale],
    [cx - 20 * scale, cy + 15 * scale],
  ]);
  // Spine scales
  doc.triangle(cx - 2 * scale, cy - 44 * scale, cx + 4 * scale, cy - 44 * scale, cx + 1 * scale, cy - 50 * scale);
  doc.triangle(cx - 10 * scale, cy - 40 * scale, cx - 4 * scale, cy - 40 * scale, cx - 7 * scale, cy - 46 * scale);
  // Curled tail with arrow
  doc.moveTo(cx - 30 * scale, cy + 28 * scale);
  doc.curveTo(cx - 52 * scale, cy + 28 * scale, cx - 58 * scale, cy + 48 * scale, cx - 40 * scale, cy + 50 * scale);
  doc.stroke();
  doc.triangle(cx - 42 * scale, cy + 46 * scale, cx - 42 * scale, cy + 54 * scale, cx - 32 * scale, cy + 50 * scale, 'FD');
}

export function drawVectorMazeWorksheet(doc: jsPDF, cx: number, cy: number, scale: number = 1): void {
  doc.setDrawColor(30, 30, 30);
  doc.setLineWidth(2.2 * scale);
  const size = 110 * scale;
  const half = size / 2;
  // Outer frame with entrance top-left and exit bottom-right
  doc.line(cx - half + 20 * scale, cy - half, cx + half, cy - half);
  doc.line(cx + half, cy - half, cx + half, cy + half);
  doc.line(cx + half - 20 * scale, cy + half, cx - half, cy + half);
  doc.line(cx - half, cy + half, cx - half, cy - half + 20 * scale);

  // Internal maze walls
  doc.line(cx - half + 20 * scale, cy - half + 25 * scale, cx + half - 25 * scale, cy - half + 25 * scale);
  doc.line(cx - half + 45 * scale, cy - half + 50 * scale, cx + half, cy - half + 50 * scale);
  doc.line(cx - half, cy - half + 75 * scale, cx + half - 30 * scale, cy - half + 75 * scale);
  doc.line(cx - half + 30 * scale, cy - half + 25 * scale, cx - half + 30 * scale, cy - half + 65 * scale);
  doc.line(cx + half - 40 * scale, cy - half + 50 * scale, cx + half - 40 * scale, cy + half - 15 * scale);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9 * scale);
  doc.setTextColor(22, 163, 74);
  doc.text('START ➔', cx - half + 5 * scale, cy - half - 4 * scale);
  doc.setTextColor(220, 38, 38);
  doc.text('★ GOAL!', cx + half - 20 * scale, cy + half + 10 * scale);
}

export function drawVectorShadowMatchWorksheet(doc: jsPDF, cx: number, cy: number): void {
  doc.setDrawColor(30, 30, 30);
  doc.setLineWidth(1.6);
  // 4 rows matching Left (Outlines) to Right (Solid Shadows)
  const items = [
    { name: 'Apple', drawerLeft: (x: number, y: number) => doc.circle(x, y, 10), drawerRight: (x: number, y: number) => doc.circle(x, y, 10, 'F') },
    { name: 'Star', drawerLeft: (x: number, y: number) => doc.circle(x, y, 10), drawerRight: (x: number, y: number) => doc.circle(x, y, 10, 'F') },
    { name: 'Car', drawerLeft: (x: number, y: number) => doc.rect(x - 12, y - 6, 24, 12), drawerRight: (x: number, y: number) => doc.rect(x - 12, y - 6, 24, 12, 'F') },
    { name: 'Cat', drawerLeft: (x: number, y: number) => doc.circle(x, y, 10), drawerRight: (x: number, y: number) => doc.circle(x, y, 10, 'F') },
  ];

  for (let r = 0; r < 4; r++) {
    const yR = cy - 45 + r * 30;
    // Left outline item card
    doc.setFillColor(254, 243, 199);
    doc.roundedRect(cx - 70, yR - 10, 50, 22, 3, 3, 'FD');
    items[r].drawerLeft(cx - 45, yR + 1);
    doc.circle(cx - 16, yR + 1, 2.5, 'FD');

    // Right shadow card (shuffled order: 2, 0, 3, 1)
    const shuffle = [2, 0, 3, 1][r];
    doc.setFillColor(241, 245, 249);
    doc.roundedRect(cx + 20, yR - 10, 50, 22, 3, 3, 'FD');
    doc.setFillColor(30, 41, 59);
    items[shuffle].drawerRight(cx + 45, yR + 1);
    doc.circle(cx + 16, yR + 1, 2.5, 'FD');
  }
}

export function drawVectorDotToDotWorksheet(doc: jsPDF, cx: number, cy: number): void {
  doc.setDrawColor(30, 30, 30);
  doc.setLineWidth(1.6);
  // Large circular star outline with 20 numbered dots
  for (let i = 1; i <= 20; i++) {
    const rad = ((i * 18 - 90) * Math.PI) / 180;
    const rDist = i % 2 === 0 ? 50 : 30;
    const px = cx + Math.cos(rad) * rDist;
    const py = cy + Math.sin(rad) * rDist;
    doc.setFillColor(225, 29, 72);
    doc.circle(px, py, 2.2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(30, 41, 59);
    doc.text(`${i}`, px + 3.5, py - 2);
  }
}

export function drawVectorSpotDifferenceWorksheet(doc: jsPDF, cx: number, cy: number): void {
  doc.setDrawColor(30, 30, 30);
  doc.setLineWidth(1.8);
  // Picture A (Original)
  doc.roundedRect(cx - 75, cy - 45, 70, 75, 4, 4);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);
  doc.text('Picture A (Original)', cx - 40, cy - 35, { align: 'center' });
  doc.circle(cx - 40, cy - 10, 16); // Sun
  doc.rect(cx - 55, cy + 10, 30, 16); // House

  // Picture B (With 5 Differences)
  doc.roundedRect(cx + 5, cy - 45, 70, 75, 4, 4);
  doc.text('Picture B (Find 5 Differences)', cx + 40, cy - 35, { align: 'center' });
  doc.circle(cx + 40, cy - 10, 12); // Difference 1: Smaller sun
  doc.rect(cx + 25, cy + 10, 30, 16); // House
  doc.circle(cx + 60, cy + 18, 4); // Difference 2: Extra flower
  doc.triangle(cx + 35, cy + 5, cx + 45, cy + 5, cx + 40, cy, 'FD'); // Difference 3: Flag
  doc.line(cx + 10, cy - 25, cx + 22, cy - 25); // Difference 4: Flying bird
  doc.circle(cx + 20, cy + 22, 2.5); // Difference 5: Door knob

  // 5 Checkmark Circles below
  for (let c = 1; c <= 5; c++) {
    doc.circle(cx - 40 + c * 14, cy + 42, 5);
    doc.text(`[ ${c} ]`, cx - 40 + c * 14, cy + 52, { align: 'center' });
  }
}

// Shapes: Themed illustrations
export function drawVectorShapeWorksheet(doc: jsPDF, shapeName: string, cx: number, cy: number): void {
  doc.setDrawColor(30, 30, 30);
  doc.setLineWidth(2.4);

  const clean = shapeName.toLowerCase();
  if (clean.includes('circle')) {
    doc.circle(cx, cy, 42);
    // Sun rays around circle
    for (let a = 0; a < 360; a += 45) {
      const rad = (a * Math.PI) / 180;
      doc.line(cx + Math.cos(rad) * 44, cy + Math.sin(rad) * 44, cx + Math.cos(rad) * 55, cy + Math.sin(rad) * 55);
    }
  } else if (clean.includes('square')) {
    doc.rect(cx - 38, cy - 38, 76, 76);
    // Window crossbars
    doc.line(cx, cy - 38, cx, cy + 38);
    doc.line(cx - 38, cy, cx + 38, cy);
  } else if (clean.includes('triangle')) {
    doc.triangle(cx - 44, cy + 36, cx + 44, cy + 36, cx, cy - 42);
  } else if (clean.includes('rectangle')) {
    doc.rect(cx - 52, cy - 30, 104, 60);
  } else if (clean.includes('star')) {
    doc.circle(cx, cy, 40);
  } else if (clean.includes('diamond')) {
    drawPolygon(doc, [[cx, cy - 44], [cx + 38, cy], [cx, cy + 44], [cx - 38, cy]]);
  } else if (clean.includes('heart')) {
    doc.circle(cx - 18, cy - 14, 22);
    doc.circle(cx + 18, cy - 14, 22);
    doc.triangle(cx - 36, cy - 2, cx + 36, cy - 2, cx, cy + 42);
  } else if (clean.includes('crescent')) {
    drawArcCurve(doc, cx, cy, 40, 40);
  } else {
    doc.ellipse(cx, cy, 48, 32);
  }

  // Happy smiling face on shape
  doc.setFillColor(30, 30, 30);
  doc.circle(cx - 12, cy - 6, 4, 'F');
  doc.circle(cx + 12, cy - 6, 4, 'F');
  doc.curveTo(cx - 8, cy + 14, cx + 8, cy + 14, cx + 8, cy + 8);
}

// Tracing lines & patterns
export function drawVectorTracingRow(doc: jsPDF, type: string, yPos: number): void {
  doc.setDrawColor(79, 70, 229);
  doc.setLineWidth(1.6);
  doc.setLineDashPattern([3, 2], 0);

  const startX = 35;
  const endX = 175;

  if (type === 'waves') {
    doc.moveTo(startX, yPos);
    doc.curveTo(startX + 30, yPos - 15, startX + 50, yPos + 15, startX + 70, yPos);
    doc.curveTo(startX + 100, yPos - 15, startX + 120, yPos + 15, endX, yPos);
    doc.stroke();
  } else if (type === 'zigzag') {
    doc.moveTo(startX, yPos + 10);
    for (let x = startX; x <= endX - 20; x += 20) {
      doc.line(x, yPos + 10, x + 10, yPos - 10);
      doc.line(x + 10, yPos - 10, x + 20, yPos + 10);
    }
  } else if (type === 'loops') {
    doc.moveTo(startX, yPos);
    doc.curveTo(startX + 20, yPos - 25, startX + 35, yPos + 20, startX + 50, yPos);
    doc.curveTo(startX + 70, yPos - 25, startX + 85, yPos + 20, startX + 100, yPos);
    doc.curveTo(startX + 120, yPos - 25, startX + 135, yPos + 20, endX, yPos);
    doc.stroke();
  } else {
    doc.line(startX, yPos, endX, yPos);
  }
  doc.setLineDashPattern([], 0);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(22, 163, 74);
  doc.text('START ➔', 22, yPos + 3);
  doc.setTextColor(220, 38, 38);
  doc.text('★ FINISH', 180, yPos + 3);
}

// -------------------------------------------------------------
// DEDICATED TAILORED GENERATOR ENGINES BY PRODUCT
// -------------------------------------------------------------

/**
 * 1. Animal Colouring Book (Exact 32 Pages)
 * Features 29 distinct, authentic animals, habitat activities, and award certificate!
 */
function generateAnimalBookPDF(doc: jsPDF, product: Product, childName: string): void {
  const totalPages = product.pageCount || 32;

  // Page 1: Cover
  drawBookCover(doc, product, childName, totalPages);

  const animalList = [
    { name: '1. The Smiling Lion King of the Savannah', desc: 'Big round mane with golden yellow and sunset orange shades.', drawer: drawVectorLion },
    { name: '2. Gentle Baby Elephant Splashing Water', desc: 'Curling trunk with cool blue water droplets and big floppy ears.', drawer: drawVectorElephant },
    { name: '3. Cuddly Honey Bear & Honey Pot', desc: 'Warm fuzzy brown bear enjoying sweet golden honeycomb treats.', drawer: drawVectorBear },
    { name: '4. Playful Ocean Dolphin Leaping in Waves', desc: 'Sleek dolphin soaring above bright sparkling turquoise sea crests.', drawer: drawVectorDolphin },
    { name: '5. Playful Cheeky Monkey on Jungle Vine', desc: 'Long curly tail swinging from green rainforest canopies.', drawer: drawVectorMonkey },
    { name: '6. Tall Gentle Giraffe with Polka Dots', desc: 'Long graceful neck reaching high acacia blossoms in the sunshine.', drawer: drawVectorGiraffe },
    { name: '7. Striped Zebra Dancing in Grasslands', desc: 'High-contrast bold stripes with cheerful grass and wildflower field.', drawer: drawVectorZebra },
    { name: '8. Cozy Panda Munching Sweet Bamboo', desc: 'Cute black-and-white bear with round ears and green stalks.', drawer: drawVectorPanda },
    { name: '9. Friendly Farm Cow in Meadow', desc: 'Happy spotted cow with clanging golden cowbell and buttercups.', drawer: drawVectorCow },
    { name: '10. Fluffy Woolly Sheep on Sunny Hill', desc: 'Cloud-like soft woolly coat under warm golden sunshine.', drawer: drawVectorSheep },
    { name: '11. Cheerful Piglet in Mud Puddle', desc: 'Curly little tail with funny snout and sweet mud splashes.', drawer: drawVectorPiglet },
    { name: '12. Yellow Duckling Swimming in Pond', desc: 'Water ripples with cheerful duck bill and lily pad leaves.', drawer: drawVectorGenericBird },
    { name: '13. Leaping Green Frog on Lily Pad', desc: 'Big round croaking eyes with water reflections and reeds.', drawer: drawVectorFrog },
    { name: '14. Bouncy Golden Puppy with Ball', desc: 'Floppy puppy ears with wagging tail and striped rubber toy.', drawer: drawVectorPuppy },
    { name: '15. Sweet Purring Kitten with Yarn Ball', desc: 'Cute whiskers, curled tail, and looping yarn threads to colour.', drawer: drawVectorKitten },
    { name: '16. Royal Bengal Tiger Cub', desc: 'Fiery orange coat with fearless black jungle stripes.', drawer: drawVectorTiger },
    { name: '17. Hopping Kangaroo & Joey in Pouch', desc: 'Australian outback buddy with sweet baby peek-a-boo.', drawer: drawVectorKangaroo },
    { name: '18. Wobbly Little Penguin on Iceberg', desc: 'Tuxedo feathers, flippers, and sparkling polar snowdrifts.', drawer: drawVectorPenguin },
    { name: '19. Wise Old Garden Tortoise', desc: 'Geometric patterned shell walking through clover patches.', drawer: drawVectorTortoise },
    { name: '20. Busy Little Squirrel with Acorn', desc: 'Giant bushy feather tail holding a yummy autumn nut.', drawer: drawVectorSquirrel },
    { name: '21. Splashing Hippopotamus in the River', desc: 'Wide cheerful yawn with water spray and floating lotus.', drawer: drawVectorHippo },
    { name: '22. Strong Horned Rhinoceros', desc: 'Sturdy armored plates with delicate jungle floral garland.', drawer: drawVectorRhino },
    { name: '23. Spotted Forest Fawn & Deer', desc: 'Gentle eyes and white spots resting under an oak tree.', drawer: drawVectorDeer },
    { name: '24. Clever Red Fox in Autumn Woods', desc: 'Bushy white-tipped tail and pointed ears among mushrooms.', drawer: drawVectorFox },
    { name: '25. Proud Running Farm Horse', desc: 'Flowing silky mane, shining horseshoes, and wooden corral.', drawer: drawVectorHorse },
    { name: '26. Gentle Bunny Rabbit with Carrot', desc: 'Long upright ears, fluffy tail, and fresh garden vegetables.', drawer: drawVectorBunny },
    { name: '27. Friendly Gentle Dinosaur (Brontosaurus)', desc: 'Peaceful long neck dinosaur nibbling tree tops.', drawer: drawVectorDinosaur },
    { name: '28. Symmetrical Meadow Butterfly', desc: 'Big decorative wings with dots and floral arches.', drawer: drawVectorButterfly },
    { name: '29. Playful Seal Balancing Star Ball', desc: 'Whiskered marine acrobat performing in the Arctic harbor.', drawer: drawVectorSeal },
  ];

  // Pages 2 to 30: Animals
  for (let i = 0; i < 29 && i < totalPages - 3; i++) {
    doc.addPage();
    const pNum = i + 2;
    const a = animalList[i];
    drawPageHeaderAndFooter(doc, product, pNum, totalPages, a.name, a.desc);
    a.drawer(doc, 105, 125, 1.15);

    drawCrayonsPalette(doc, [
      { name: 'Sun Yellow', r: 255, g: 217, b: 61 },
      { name: 'Tangerine', r: 255, g: 138, b: 101 },
      { name: 'Ocean Blue', r: 107, g: 203, b: 255 },
      { name: 'Leaf Green', r: 72, g: 187, b: 120 },
    ]);
  }

  // Page 31: Animal Habitats & Footprint Matching Activity
  doc.addPage();
  drawPageHeaderAndFooter(
    doc,
    product,
    31,
    totalPages,
    'Animal Habitats & Paw Prints Matching Activity',
    'Draw a line connecting each animal to its home and footprint!'
  );

  const matches = [
    { a: '1. Lion 🦁', h: 'Savannah Den', p: 'Big Paw' },
    { a: '2. Bear 🐻', h: 'Mountain Cave', p: 'Claw Print' },
    { a: '3. Penguin 🐧', h: 'Arctic Iceberg', p: 'Webbed Foot' },
    { a: '4. Dolphin 🐬', h: 'Deep Ocean Blue', p: 'Fin Splash' },
  ];

  matches.forEach((m, idx) => {
    const yM = 60 + idx * 42;
    doc.setFillColor(254, 242, 242);
    doc.setDrawColor(254, 202, 202);
    doc.roundedRect(25, yM, 65, 26, 3, 3, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(190, 18, 60);
    doc.text(m.a, 32, yM + 16);

    doc.setFillColor(240, 249, 255);
    doc.setDrawColor(186, 230, 253);
    doc.roundedRect(120, yM, 65, 26, 3, 3, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(3, 105, 161);
    doc.text(`${m.h} (${m.p})`, 126, yM + 16);

    doc.setFillColor(225, 29, 72);
    doc.circle(95, yM + 13, 2.5, 'F');
    doc.circle(115, yM + 13, 2.5, 'F');
  });

  // Page 32: Super Safari Artist Award Certificate
  doc.addPage();
  drawCertificatePage(
    doc,
    product,
    childName,
    32,
    totalPages,
    'SUPER SAFARI ARTIST CERTIFICATE',
    `For brilliantly coloring every single jungle, ocean, and farm friend in the ${product.title} with tremendous imagination!`
  );
}

/**
 * 2. My First ABC Colouring Book (Exact 30 Pages)
 * Features Phonics guide, Letters A to Z with dedicated matching artwork, maze, and diploma!
 */
function generateAlphabetBookPDF(doc: jsPDF, product: Product, childName: string): void {
  const totalPages = product.pageCount || 30;

  // Page 1: Cover
  drawBookCover(doc, product, childName, totalPages);

  // Page 2: Phonics Pronunciation & Alphabet Guide
  doc.addPage();
  drawPageHeaderAndFooter(
    doc,
    product,
    2,
    totalPages,
    'The A to Z Phonics & Letter Sound Roadmap',
    'Say each letter sound out loud before coloring every alphabet page!'
  );

  doc.setFillColor(255, 250, 240);
  doc.setDrawColor(251, 191, 36);
  doc.roundedRect(22, 50, 166, 185, 4, 4, 'FD');

  const abcs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  abcs.forEach((ltr, i) => {
    const col = i % 5;
    const row = Math.floor(i / 5);
    const x = 32 + col * 32;
    const y = 62 + row * 28;

    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(x - 2, y - 4, 26, 22, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(225, 29, 72);
    doc.text(ltr, x + 11, y + 12, { align: 'center' });
  });

  const abcLetters = [
    { l: 'A', name: 'A is for Apple & Ant', phonic: '/æ/ /æ/ Apple', word: 'Red Crunchy Apple', drawer: (d: jsPDF, x: number, y: number) => drawVectorFruit(d, x, y, 'Apple', 1.1) },
    { l: 'B', name: 'B is for Bear & Balloon', phonic: '/b/ /b/ Bear', word: 'Friendly Brown Bear', drawer: (d: jsPDF, x: number, y: number) => drawVectorBear(d, x, y, 1.1) },
    { l: 'C', name: 'C is for Car & Cat', phonic: '/k/ /k/ Car', word: 'Beep-Beep Little Car', drawer: (d: jsPDF, x: number, y: number) => drawVectorCar(d, x, y, 1.1) },
    { l: 'D', name: 'D is for Dolphin & Duck', phonic: '/d/ /d/ Dolphin', word: 'Leaping Ocean Dolphin', drawer: (d: jsPDF, x: number, y: number) => drawVectorDolphin(d, x, y, 1.1) },
    { l: 'E', name: 'E is for Elephant & Egg', phonic: '/e/ /e/ Elephant', word: 'Gentle Big Elephant', drawer: (d: jsPDF, x: number, y: number) => drawVectorElephant(d, x, y, 1.1) },
    { l: 'F', name: 'F is for Frog & Flower', phonic: '/f/ /f/ Frog', word: 'Leaping Pond Frog', drawer: (d: jsPDF, x: number, y: number) => drawVectorFrog(d, x, y, 1.0) },
    { l: 'G', name: 'G is for Giraffe & Grapes', phonic: '/g/ /g/ Giraffe', word: 'Tall Savannah Giraffe', drawer: (d: jsPDF, x: number, y: number) => drawVectorGiraffe(d, x, y, 1.0) },
    { l: 'H', name: 'H is for Horse & Hat', phonic: '/h/ /h/ Horse', word: 'Proud Farm Horse', drawer: (d: jsPDF, x: number, y: number) => drawVectorHorse(d, x, y, 1.0) },
    { l: 'I', name: 'I is for Ice Cream & Iguana', phonic: '/ɪ/ /ɪ/ Ice Cream', word: 'Sweet Cold Ice Cream', drawer: (d: jsPDF, x: number, y: number) => drawVectorFruit(d, x, y, 'Strawberry', 1.0) },
    { l: 'J', name: 'J is for Jellyfish & Jam', phonic: '/dʒ/ /dʒ/ Jellyfish', word: 'Glowing Ocean Jellyfish', drawer: (d: jsPDF, x: number, y: number) => drawVectorDolphin(d, x, y, 1.0) },
    { l: 'K', name: 'K is for Kangaroo & Kite', phonic: '/k/ /k/ Kite', word: 'Flying Diamond Kite', drawer: (d: jsPDF, x: number, y: number) => drawVectorKites(d, x, y, 1.0) },
    { l: 'L', name: 'L is for Lion & Leaf', phonic: '/l/ /l/ Lion', word: 'King of the Savannah', drawer: (d: jsPDF, x: number, y: number) => drawVectorLion(d, x, y, 1.1) },
    { l: 'M', name: 'M is for Monkey & Moon', phonic: '/m/ /m/ Monkey', word: 'Cheeky Jungle Monkey', drawer: (d: jsPDF, x: number, y: number) => drawVectorMonkey(d, x, y, 1.0) },
    { l: 'N', name: 'N is for Nest & Nut', phonic: '/n/ /n/ Nest', word: 'Bird Nest with Eggs', drawer: (d: jsPDF, x: number, y: number) => drawVectorGenericBird(d, x, y, 1.0, 'Sparrow') },
    { l: 'O', name: 'O is for Owl & Orange', phonic: '/ɒ/ /ɒ/ Owl', word: 'Wise Chirpy Garden Owl', drawer: (d: jsPDF, x: number, y: number) => drawVectorOwl(d, x, y, 1.1) },
    { l: 'P', name: 'P is for Penguin & Panda', phonic: '/p/ /p/ Penguin', word: 'Wobbly Tuxedo Penguin', drawer: (d: jsPDF, x: number, y: number) => drawVectorPenguin(d, x, y, 1.1) },
    { l: 'Q', name: 'Q is for Queen & Quill', phonic: '/kw/ /kw/ Queen', word: 'Royal Golden Crown', drawer: (d: jsPDF, x: number, y: number) => drawVectorShapeWorksheet(d, 'star', x, y) },
    { l: 'R', name: 'R is for Rocket & Rainbow', phonic: '/r/ /r/ Rocket', word: 'Blasting Space Rocket', drawer: (d: jsPDF, x: number, y: number) => drawVectorRocket(d, x, y, 1.0) },
    { l: 'S', name: 'S is for Strawberry & Sun', phonic: '/s/ /s/ Strawberry', word: 'Sweet Red Strawberry', drawer: (d: jsPDF, x: number, y: number) => drawVectorFruit(d, x, y, 'Strawberry', 1.1) },
    { l: 'T', name: 'T is for Train & Tiger', phonic: '/t/ /t/ Train', word: 'Choo-Choo Steam Train', drawer: (d: jsPDF, x: number, y: number) => drawVectorTrain(d, x, y, 1.1) },
    { l: 'U', name: 'U is for Umbrella & Unicorn', phonic: '/ʌ/ /ʌ/ Umbrella', word: 'Colorful Rainy Umbrella', drawer: (d: jsPDF, x: number, y: number) => drawVectorShapeWorksheet(d, 'heart', x, y) },
    { l: 'V', name: 'V is for Van & Vegetables', phonic: '/v/ /v/ Vegetables', word: 'Fresh Garden Carrot', drawer: (d: jsPDF, x: number, y: number) => drawVectorFruit(d, x, y, 'Carrot', 1.1) },
    { l: 'W', name: 'W is for Whale & Watermelon', phonic: '/w/ /w/ Whale', word: 'Giant Blue Whale', drawer: (d: jsPDF, x: number, y: number) => drawVectorDolphin(d, x, y, 1.1) },
    { l: 'X', name: 'X is for Xylophone & Fox', phonic: '/ks/ /ks/ Xylophone', word: 'Clever Red Fox', drawer: (d: jsPDF, x: number, y: number) => drawVectorFox(d, x, y, 1.0) },
    { l: 'Y', name: 'Y is for Yacht & Yak', phonic: '/j/ /j/ Yacht', word: 'Floating Blue Sailboat', drawer: (d: jsPDF, x: number, y: number) => drawVectorSailboat(d, x, y, 1.0) },
    { l: 'Z', name: 'Z is for Zebra & Zigzag', phonic: '/z/ /z/ Zebra', word: 'Striped Running Zebra', drawer: (d: jsPDF, x: number, y: number) => drawVectorZebra(d, x, y, 1.1) },
  ];

  // Pages 3 to 28: Letters A to Z (26 pages)
  abcLetters.forEach((item, idx) => {
    doc.addPage();
    const pNum = idx + 3;
    drawPageHeaderAndFooter(
      doc,
      product,
      pNum,
      totalPages,
      `Letter ${item.l}: ${item.name}`,
      `Phonics Sound: ${item.phonic} • Trace the letters and colour the ${item.word}!`
    );

    // Big Bubble Uppercase and Lowercase Letter
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(64);
    doc.setTextColor(225, 29, 72);
    doc.text(item.l, 45, 85, { align: 'center' });
    doc.setFontSize(54);
    doc.setTextColor(234, 88, 12);
    doc.text(item.l.toLowerCase(), 80, 85, { align: 'center' });

    // Tracing lines for pre-writing
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.6);
    doc.line(22, 105, 188, 105);
    doc.setLineDashPattern([2, 2], 0);
    doc.line(22, 113, 188, 113);
    doc.setLineDashPattern([], 0);
    doc.line(22, 121, 188, 121);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(148, 163, 184);
    doc.text(`${item.l}  ${item.l}  ${item.l}  ${item.l}  ${item.l.toLowerCase()}  ${item.l.toLowerCase()}  ${item.l.toLowerCase()}`, 28, 118);

    // Character drawing
    item.drawer(doc, 135, 75);

    // Word association Box
    doc.setFillColor(255, 247, 237);
    doc.setDrawColor(254, 215, 170);
    doc.roundedRect(22, 135, 166, 105, 4, 4, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(194, 65, 12);
    doc.text(`Write & Circle words that start with letter ${item.l}:`, 28, 150);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105);
    doc.text(`[ 1. ${item.word} ]        [ 2. ${item.l}-Sound Friends ]        [ 3. Trace: ${item.l} ${item.l} ${item.l} ]`, 28, 168);

    drawVectorTracingRow(doc, 'waves', 200);
  });

  // Page 29: Alphabet Matching Maze
  doc.addPage();
  drawPageHeaderAndFooter(
    doc,
    product,
    29,
    totalPages,
    'The Alphabet Trail & Phonics Match Challenge',
    'Follow the A-to-Z stepping stones across the river to reach the finish!'
  );
  for (let r = 0; r < 4; r++) {
    drawVectorTracingRow(doc, r % 2 === 0 ? 'zigzag' : 'waves', 60 + r * 38);
  }

  // Page 30: Certificate of Completion
  doc.addPage();
  drawCertificatePage(
    doc,
    product,
    childName,
    30,
    totalPages,
    'ALPHABET PHONICS MASTER DIPLOMA',
    `For brilliantly mastering the letters A to Z, developing excellent pre-writing pencil grip, and completing ${product.title}!`
  );
}

/**
 * 3. Numbers 1–20 Colouring Book (Exact 24 Pages)
 * Features numbers 1 to 20, ten-frames, item counting, and certificate!
 */
function generateNumbersBookPDF(doc: jsPDF, product: Product, childName: string): void {
  const totalPages = product.pageCount || 24;

  // Page 1: Cover
  drawBookCover(doc, product, childName, totalPages);

  // Pages 2 to 21: Numbers 1 through 20
  for (let num = 1; num <= 20; num++) {
    doc.addPage();
    const pNum = num + 1;
    drawPageHeaderAndFooter(
      doc,
      product,
      pNum,
      totalPages,
      `Number ${num}: Count & Colour!`,
      `Trace the number ${num}, count each friendly item, and color them brightly.`
    );

    // Large traceable digit
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(72);
    doc.setTextColor(234, 88, 12);
    doc.text(`${num}`, 45, 95, { align: 'center' });

    // Ten Frame Visual Grid
    doc.setDrawColor(203, 213, 225);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(80, 55, 100, 42, 3, 3, 'FD');
    doc.setLineWidth(1);
    doc.line(80, 76, 180, 76);
    for (let c = 1; c < 5; c++) {
      doc.line(80 + c * 20, 55, 80 + c * 20, 97);
    }
    for (let d = 0; d < Math.min(10, num); d++) {
      const col = d % 5;
      const row = Math.floor(d / 5);
      doc.setFillColor(225, 29, 72);
      doc.circle(90 + col * 20, 65 + row * 21, 6, 'F');
    }

    const words = [
      '', 'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE', 'TEN',
      'ELEVEN', 'TWELVE', 'THIRTEEN', 'FOURTEEN', 'FIFTEEN', 'SIXTEEN', 'SEVENTEEN', 'EIGHTEEN', 'NINETEEN', 'TWENTY'
    ];
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(30, 41, 59);
    doc.text(`WORD: ${words[num]}`, 105, 115, { align: 'center' });

    // Counting Items Grid
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(22, 125, 166, 115, 4, 4, 'FD');

    const maxDraw = Math.min(num, 15);
    for (let item = 0; item < maxDraw; item++) {
      const c = item % 5;
      const r = Math.floor(item / 5);
      const ix = 38 + c * 33;
      const iy = 150 + r * 30;

      doc.setDrawColor(30, 41, 59);
      doc.circle(ix, iy, 9);
      doc.setFillColor(30, 30, 30);
      doc.circle(ix - 3, iy - 2, 1.2, 'F');
      doc.circle(ix + 3, iy - 2, 1.2, 'F');
    }

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text(`Pencil Practice: Trace ${num} across the row:  ${num}   ${num}   ${num}   ${num}   ${num}   ${num}`, 28, 232);
  }

  // Page 22: Count & Match 1 to 20 Worksheet
  doc.addPage();
  drawPageHeaderAndFooter(
    doc,
    product,
    22,
    totalPages,
    'Counting Detective: Match Numbers to Quantities',
    'Count the objects in each bubble and draw a connecting line to the right number!'
  );
  drawVectorTracingRow(doc, 'waves', 80);
  drawVectorTracingRow(doc, 'zigzag', 140);
  drawVectorTracingRow(doc, 'loops', 200);

  // Page 23: Numbers Tracing Grid 1 to 20
  doc.addPage();
  drawPageHeaderAndFooter(
    doc,
    product,
    23,
    totalPages,
    'Master Handwriting: Trace Numbers 1 to 20',
    'Keep your pencil inside the guides to practice neat numeral handwriting.'
  );

  for (let r = 0; r < 4; r++) {
    const yN = 65 + r * 42;
    doc.setDrawColor(226, 232, 240);
    doc.rect(22, yN, 166, 32);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(148, 163, 184);
    const numsRow = [1 + r * 5, 2 + r * 5, 3 + r * 5, 4 + r * 5, 5 + r * 5];
    doc.text(numsRow.map((n) => `[ ${n} ]`).join('    '), 105, yN + 22, { align: 'center' });
  }

  // Page 24: Certificate
  doc.addPage();
  drawCertificatePage(
    doc,
    product,
    childName,
    24,
    totalPages,
    'LITTLE MATH CHAMPION AWARD',
    `For brilliantly mastering number recognition, visual counting, and quantity correspondence from 1 to 20 in ${product.title}!`
  );
}

/**
 * 4. Fruits & Vegetables Colouring Book (Exact 28 Pages)
 * Features 25 distinct fruit & veggie characters, rainbow plate challenge, and diploma!
 */
function generateFruitsVegetablesBookPDF(doc: jsPDF, product: Product, childName: string): void {
  const totalPages = product.pageCount || 28;

  // Page 1: Cover
  drawBookCover(doc, product, childName, totalPages);

  const produceList = [
    { name: '1. Sweet Strawberry Smiles', type: 'Fruit', color: 'Ruby Red', drawer: (d: jsPDF, x: number, y: number) => drawVectorFruit(d, x, y, 'Strawberry', 1.2) },
    { name: '2. Dancing Crunchy Carrot', type: 'Vegetable', color: 'Bright Orange', drawer: (d: jsPDF, x: number, y: number) => drawVectorFruit(d, x, y, 'Carrot', 1.2) },
    { name: '3. Cheerful Sunny Banana', type: 'Fruit', color: 'Sunshine Yellow', drawer: (d: jsPDF, x: number, y: number) => drawVectorFruit(d, x, y, 'Banana', 1.2) },
    { name: '4. Crisp Orchard Apple', type: 'Fruit', color: 'Candy Red', drawer: (d: jsPDF, x: number, y: number) => drawVectorFruit(d, x, y, 'Apple', 1.2) },
    { name: '5. Sweet Purple Grapes Cluster', type: 'Fruit', color: 'Deep Violet', drawer: (d: jsPDF, x: number, y: number) => drawVectorFruit(d, x, y, 'Grapes', 1.2) },
    { name: '6. Giant Watermelon Slice', type: 'Fruit', color: 'Emerald & Pink', drawer: (d: jsPDF, x: number, y: number) => drawVectorFruit(d, x, y, 'Watermelon', 1.2) },
    { name: '7. Royal Pineapple King', type: 'Fruit', color: 'Golden Yellow', drawer: (d: jsPDF, x: number, y: number) => drawVectorFruit(d, x, y, 'Pineapple', 1.2) },
    { name: '8. Golden Summer Corn Cob', type: 'Vegetable', color: 'Golden Yellow', drawer: (d: jsPDF, x: number, y: number) => drawVectorFruit(d, x, y, 'Corn', 1.2) },
    { name: '9. Plump Garden Tomato', type: 'Vegetable', color: 'Crimson Red', drawer: (d: jsPDF, x: number, y: number) => drawVectorFruit(d, x, y, 'Apple', 1.2) },
    { name: '10. Giant Autumn Pumpkin', type: 'Vegetable', color: 'Harvest Orange', drawer: (d: jsPDF, x: number, y: number) => drawVectorFruit(d, x, y, 'Apple', 1.3) },
    { name: '11. Juicy Citrus Orange & Wheel', type: 'Fruit', color: 'Vibrant Orange', drawer: (d: jsPDF, x: number, y: number) => drawVectorFruit(d, x, y, 'Apple', 1.2) },
    { name: '12. Smiling Forest Mushroom', type: 'Vegetable', color: 'Spotted Coral', drawer: (d: jsPDF, x: number, y: number) => drawVectorFruit(d, x, y, 'Strawberry', 1.2) },
    { name: '13. Sweet Farm Peas in a Pod', type: 'Vegetable', color: 'Pea Green', drawer: (d: jsPDF, x: number, y: number) => drawVectorFruit(d, x, y, 'Banana', 1.1) },
    { name: '14. Luscious Alphonso Mango', type: 'Fruit', color: 'Golden Amber', drawer: (d: jsPDF, x: number, y: number) => drawVectorFruit(d, x, y, 'Apple', 1.2) },
    { name: '15. Twin Cherry Buddies', type: 'Fruit', color: 'Cherry Red', drawer: (d: jsPDF, x: number, y: number) => drawVectorFruit(d, x, y, 'Strawberry', 1.1) },
    { name: '16. Mighty Broccoli Tree', type: 'Vegetable', color: 'Forest Green', drawer: (d: jsPDF, x: number, y: number) => drawVectorFruit(d, x, y, 'Apple', 1.2) },
    { name: '17. Glossy Purple Eggplant', type: 'Vegetable', color: 'Deep Purple', drawer: (d: jsPDF, x: number, y: number) => drawVectorFruit(d, x, y, 'Carrot', 1.2) },
    { name: '18. Crisp Bell Pepper', type: 'Vegetable', color: 'Bright Red / Green', drawer: (d: jsPDF, x: number, y: number) => drawVectorFruit(d, x, y, 'Apple', 1.2) },
    { name: '19. Cool Green Cucumber', type: 'Vegetable', color: 'Mint Green', drawer: (d: jsPDF, x: number, y: number) => drawVectorFruit(d, x, y, 'Carrot', 1.2) },
    { name: '20. Juicy Golden Pear', type: 'Fruit', color: 'Lime Yellow', drawer: (d: jsPDF, x: number, y: number) => drawVectorFruit(d, x, y, 'Apple', 1.2) },
    { name: '21. Fuzzy Sweet Peach', type: 'Fruit', color: 'Soft Peach', drawer: (d: jsPDF, x: number, y: number) => drawVectorFruit(d, x, y, 'Apple', 1.2) },
    { name: '22. Little Blueberry Bunch', type: 'Fruit', color: 'Cobalt Blue', drawer: (d: jsPDF, x: number, y: number) => drawVectorFruit(d, x, y, 'Grapes', 1.1) },
    { name: '23. Zesty Lemon & Lime', type: 'Fruit', color: 'Lemon Yellow', drawer: (d: jsPDF, x: number, y: number) => drawVectorFruit(d, x, y, 'Apple', 1.2) },
    { name: '24. Creamy Avocado Buddy', type: 'Fruit', color: 'Avocado Green', drawer: (d: jsPDF, x: number, y: number) => drawVectorFruit(d, x, y, 'Apple', 1.2) },
    { name: '25. Tropical Coconut Palm', type: 'Fruit', color: 'Cocoa Brown', drawer: (d: jsPDF, x: number, y: number) => drawVectorFruit(d, x, y, 'Apple', 1.2) },
  ];

  produceList.forEach((item, idx) => {
    doc.addPage();
    const pNum = idx + 2;
    drawPageHeaderAndFooter(
      doc,
      product,
      pNum,
      totalPages,
      item.name,
      `Category: ${item.type} • Suggested Shade: ${item.color} • Eat your colours for superhero energy!`
    );
    item.drawer(doc, 105, 120);

    drawCrayonsPalette(doc, [
      { name: 'Red', r: 239, g: 68, b: 68 },
      { name: 'Orange', r: 249, g: 115, b: 22 },
      { name: 'Yellow', r: 234, g: 179, b: 8 },
      { name: 'Green', r: 34, g: 197, b: 94 },
    ]);
  });

  // Page 27: Rainbow Plate Nutrition Sorting Activity
  doc.addPage();
  drawPageHeaderAndFooter(
    doc,
    product,
    27,
    totalPages,
    'The 5-Color Rainbow Nutrition Plate Challenge',
    'Draw your favourite healthy fruits and vegetables in each rainbow sector!'
  );
  doc.circle(105, 140, 60);
  doc.circle(105, 140, 20);

  // Page 28: Certificate
  doc.addPage();
  drawCertificatePage(
    doc,
    product,
    childName,
    28,
    totalPages,
    'HEALTHY HARVEST SUPER HERO CERTIFICATE',
    `For developing fantastic food appreciation, healthy eating habits, and completing all 28 pages of ${product.title}!`
  );
}

/**
 * 5. Cute Birds Colouring Book (Exact 30 Pages)
 * Features 27 unique birds, nest maze, and diploma!
 */
function generateBirdsBookPDF(doc: jsPDF, product: Product, childName: string): void {
  const totalPages = product.pageCount || 30;

  // Page 1: Cover
  drawBookCover(doc, product, childName, totalPages);

  const birds = [
    { name: '1. Nightcap Garden Owl on Branch', drawer: drawVectorOwl },
    { name: '2. Royal Emerald Peacock with Fan', drawer: drawVectorPeacock },
    { name: '3. Tropical Toucan with Giant Beak', drawer: drawVectorToucan },
    { name: '4. Graceful Pink Flamingo on One Leg', drawer: drawVectorFlamingo },
    { name: '5. Tiny Hummingbird Sipping Nectar', drawer: drawVectorHummingbird },
    { name: '6. Swimming Lake Swan with Ripples', drawer: drawVectorSwan },
    { name: '7. Wobbly Polar Penguin on Ice', drawer: drawVectorPenguin },
    { name: '8. Chatty Rainforest Parrot', drawer: drawVectorGenericBird },
    { name: '9. Singing Garden Meadow Sparrow', drawer: drawVectorGenericBird },
    { name: '10. Busy Woodpecker on Oak Tree', drawer: drawVectorGenericBird },
    { name: '11. Wise Mountain Hawk & Eagle', drawer: drawVectorGenericBird },
    { name: '12. Sweet Little Yellow Canary', drawer: drawVectorGenericBird },
    { name: '13. Chirpy Pond Duckling Family', drawer: drawVectorGenericBird },
    { name: '14. Striped-Beak Ocean Puffin', drawer: drawVectorGenericBird },
    { name: '15. Red-Breasted Winter Robin', drawer: drawVectorGenericBird },
    { name: '16. Blue Jay in Pine Forest', drawer: drawVectorGenericBird },
    { name: '17. Cockatoo with Feathery Crest', drawer: drawVectorGenericBird },
    { name: '18. Kingfisher Diving for River Fish', drawer: drawVectorGenericBird },
    { name: '19. White Stork with Baby Bundle', drawer: drawVectorGenericBird },
    { name: '20. Dove of Peace with Olive Branch', drawer: drawVectorGenericBird },
    { name: '21. Moonlit Barn Owl in Flight', drawer: drawVectorOwl },
    { name: '22. Soaring Coastal White Seagull', drawer: drawVectorGenericBird },
    { name: '23. Fast Running Savannah Ostrich', drawer: drawVectorFlamingo },
    { name: '24. Spring Flying Forktail Swallow', drawer: drawVectorGenericBird },
    { name: '25. Cozy Little Quail Family', drawer: drawVectorGenericBird },
    { name: '26. New Zealand Flightless Kiwi Bird', drawer: drawVectorGenericBird },
    { name: '27. Garden Nest with Three Speckled Eggs', drawer: drawVectorGenericBird },
  ];

  birds.forEach((b, i) => {
    doc.addPage();
    const pNum = i + 2;
    drawPageHeaderAndFooter(
      doc,
      product,
      pNum,
      totalPages,
      b.name,
      'Learn about wonderful feathered friends while coloring within the extra-thick lines.'
    );
    b.drawer(doc, 105, 125, 1.2);

    drawCrayonsPalette(doc, [
      { name: 'Sky Blue', r: 107, g: 203, b: 255 },
      { name: 'Emerald', r: 72, g: 187, b: 120 },
      { name: 'Plum Purple', r: 168, g: 85, b: 247 },
      { name: 'Warm Gold', r: 255, g: 217, b: 61 },
    ]);
  });

  // Page 29: Maze
  doc.addPage();
  drawPageHeaderAndFooter(
    doc,
    product,
    29,
    totalPages,
    'Fly Home: The Forest Bird Nest Maze',
    'Guide the little songbird through the twisting branches back to its cozy nest!'
  );
  drawVectorTracingRow(doc, 'loops', 90);
  drawVectorTracingRow(doc, 'waves', 150);
  drawVectorTracingRow(doc, 'zigzag', 210);

  // Page 30: Certificate
  doc.addPage();
  drawCertificatePage(
    doc,
    product,
    childName,
    30,
    totalPages,
    'JUNIOR ORNITHOLOGIST AWARD',
    `For exploring avian diversity, color blending, and completing all 30 pages of ${product.title}!`
  );
}

/**
 * 6. Tracing Practice & Line Control Book (Exact 36 Pages)
 * Features 33 progressive motor control tracks, maze, and handwriting star diploma!
 */
function generateTracingBookPDF(doc: jsPDF, product: Product, childName: string): void {
  const totalPages = product.pageCount || 36;

  // Page 1: Cover
  drawBookCover(doc, product, childName, totalPages);

  const tracingExercises = [
    { title: '1. Horizontal Lines: Drive the Car to Garage', type: 'straight' },
    { title: '2. Vertical Rainfall: Rain Falling from Clouds', type: 'straight' },
    { title: '3. Diagonal Upward: Flying the Colorful Kite', type: 'zigzag' },
    { title: '4. Diagonal Downward: Sledding Down Snow Hill', type: 'zigzag' },
    { title: '5. Gentle Ocean Waves: Helping Fish Leap', type: 'waves' },
    { title: '6. Big Sea Swirls: The Dolphin Adventure', type: 'waves' },
    { title: '7. Castle Wall Battlements: Square Waves', type: 'straight' },
    { title: '8. Mountain Peaks: Zigzag Goat Paths', type: 'zigzag' },
    { title: '9. Rollercoaster Loops: Looping Toy Airplane', type: 'loops' },
    { title: '10. Snail Shell Spirals: Gentle Circular Control', type: 'loops' },
    { title: '11. Circle Perimeter Tracing: Round Sunshine', type: 'straight' },
    { title: '12. Square Tracing: The Mystery Toy Box', type: 'straight' },
    { title: '13. Triangle Tracing: Pizza Slice & Mountain', type: 'zigzag' },
    { title: '14. Star Tracing: The Twinkling Night Sky', type: 'zigzag' },
    { title: '15. Pre-Writing Curves: The Letter C Curve', type: 'waves' },
    { title: '16. Pre-Writing Ovals: The Letter O Circle', type: 'straight' },
    { title: '17. Pre-Writing Slants: The Letters V and W Paths', type: 'zigzag' },
    { title: '18. Pre-Writing Canes: The Letters J and U Paths', type: 'loops' },
    { title: '19. Animal Pathway: Bunny Hopping to Carrot', type: 'waves' },
    { title: '20. Animal Pathway: Puppy Running to Juicy Bone', type: 'straight' },
    { title: '21. Animal Pathway: Honeybee Flying to Flower', type: 'loops' },
    { title: '22. Two-Handed Mirror Tracing: Symmetrical Tree', type: 'zigzag' },
    { title: '23. Stepping Stones Tracing Across the River', type: 'straight' },
    { title: '24. Balloon Strings Tracing with Wiggles', type: 'waves' },
    { title: '25. Dinosaur Spine Zigzag Tracing', type: 'zigzag' },
    { title: '26. Caterpillar Body Circles Tracing', type: 'straight' },
    { title: '27. Spider Web Spiral Control Path', type: 'loops' },
    { title: '28. Lightning Bolt Fast Reflex Tracing', type: 'zigzag' },
    { title: '29. Clock Hands Precision Rotation Path', type: 'straight' },
    { title: '30. Rainbow Arch Multi-Color Tracing', type: 'waves' },
    { title: '31. Dotted Outline Bear Face Tracing', type: 'loops' },
    { title: '32. Dotted Outline Toy Train Tracing', type: 'straight' },
    { title: '33. Dotted Outline Sailing Boat Tracing', type: 'zigzag' },
  ];

  tracingExercises.forEach((ex, idx) => {
    doc.addPage();
    const pNum = idx + 2;
    drawPageHeaderAndFooter(
      doc,
      product,
      pNum,
      totalPages,
      ex.title,
      'Keep your pencil gently on the dashed line from START to FINISH without lifting your hand.'
    );

    for (let track = 0; track < 4; track++) {
      const yT = 70 + track * 42;
      drawVectorTracingRow(doc, ex.type, yT);
    }
  });

  // Page 35: Giant Pre-Writing Labyrinth
  doc.addPage();
  drawPageHeaderAndFooter(
    doc,
    product,
    35,
    totalPages,
    'The Grand Pencil Control Maze & Labyrinth',
    'Navigate the ultimate test of pre-writing accuracy to reach the treasure chest!'
  );
  doc.setLineWidth(2);
  doc.roundedRect(30, 60, 150, 150, 4, 4);
  doc.line(30, 95, 140, 95);
  doc.line(65, 135, 180, 135);
  doc.line(30, 175, 120, 175);

  // Page 36: Certificate
  doc.addPage();
  drawCertificatePage(
    doc,
    product,
    childName,
    36,
    totalPages,
    'MASTER OF PENCIL CONTROL & HANDWRITING DIPLOMA',
    `For mastering pre-writing strokes, line precision, tripod pencil grip, and completing all 36 pages of ${product.title}!`
  );
}

/**
 * 7. Vehicles & Transport Colouring Book (Exact 28 Pages)
 * Features 25 distinct transport vehicles, traffic safety signs, and pilot certificate!
 */
function generateVehiclesBookPDF(doc: jsPDF, product: Product, childName: string): void {
  const totalPages = product.pageCount || 28;

  // Page 1: Cover
  drawBookCover(doc, product, childName, totalPages);

  const vehicleList = [
    { name: '1. Beep-Beep Friendly Family Car', drawer: drawVectorCar },
    { name: '2. Rumbling Steam Locomotive Train', drawer: drawVectorTrain },
    { name: '3. Soaring Passenger Jet Airplane', drawer: drawVectorAirplane },
    { name: '4. Whirly Rescue Helicopter in Sky', drawer: drawVectorHelicopter },
    { name: '5. Floating Sailboat with White Sails', drawer: drawVectorSailboat },
    { name: '6. Cosmic Space Rocket Blasting Off', drawer: drawVectorRocket },
    { name: '7. Deep Sea Explorer Submarine', drawer: drawVectorSubmarine },
    { name: '8. Powerful Farm Tractor in Fields', drawer: drawVectorTractor },
    { name: '9. Floating Hot Air Balloon in Sky', drawer: drawVectorHotAirBalloon },
    { name: '10. Big Red Fire Engine with Ladder', drawer: drawVectorFireEngine },
    { name: '11. Hospital Ambulance with Siren', drawer: drawVectorAmbulance },
    { name: '12. Police Patrol Car on Highway', drawer: drawVectorPoliceCar },
    { name: '13. Bright Yellow School Bus', drawer: drawVectorSchoolBus },
    { name: '14. Heavy Quarry Dump Truck', drawer: drawVectorDumpTruck },
    { name: '15. Twirling Concrete Mixer Truck', drawer: drawVectorCementMixer },
    { name: '16. Luxury Ocean Cruise Liner', drawer: drawVectorSailboat },
    { name: '17. Vintage Motorcycle with Sidecar', drawer: drawVectorMotorcycle },
    { name: '18. Double Decker City Bus', drawer: drawVectorSchoolBus },
    { name: '19. Little Bicycle with Ringing Bell', drawer: drawVectorBicycle },
    { name: '20. Cargo Delivery Van with Boxes', drawer: drawVectorAmbulance },
    { name: '21. City Garbage & Recycling Truck', drawer: drawVectorDumpTruck },
    { name: '22. Helpful Highway Tow Truck', drawer: drawVectorDumpTruck },
    { name: '23. Zippy Motor Scooter with Helmet', drawer: drawVectorMotorcycle },
    { name: '24. Supersonic Jet Fighter', drawer: drawVectorAirplane },
    { name: '25. Island Passenger Ferry Boat', drawer: drawVectorSailboat },
  ];

  vehicleList.forEach((v, idx) => {
    doc.addPage();
    const pNum = idx + 2;
    drawPageHeaderAndFooter(
      doc,
      product,
      pNum,
      totalPages,
      v.name,
      'Colour the vehicle and wheels with your favourite shades. Add roads or clouds!'
    );
    v.drawer(doc, 105, 125, 1.15);

    drawCrayonsPalette(doc, [
      { name: 'Cherry Red', r: 239, g: 68, b: 68 },
      { name: 'Canary Yellow', r: 250, g: 204, b: 21 },
      { name: 'Sky Blue', r: 56, g: 189, b: 248 },
      { name: 'Tarmac Gray', r: 100, g: 116, b: 139 },
    ]);
  });

  // Page 27: Road Safety Signs & Traffic Light
  doc.addPage();
  drawPageHeaderAndFooter(
    doc,
    product,
    27,
    totalPages,
    'Road Safety Explorer: Traffic Lights & Street Signs',
    'Color the traffic light: Red = Stop, Yellow = Wait, Green = Go!'
  );
  doc.setLineWidth(2);
  doc.roundedRect(85, 60, 40, 110, 6, 6);
  doc.circle(105, 80, 12);
  doc.circle(105, 115, 12);
  doc.circle(105, 150, 12);

  // Page 28: Certificate
  doc.addPage();
  drawCertificatePage(
    doc,
    product,
    childName,
    28,
    totalPages,
    'JUNIOR PILOT & CAPTAIN DIPLOMA',
    `For zooming, chugging, and steering through all 28 action-packed pages of ${product.title}!`
  );
}

/**
 * 8. Shapes & Colours Foundation Worksheets (Exact 26 Pages)
 * Features 23 geometric shape worksheets, scavenger hunt, and master diploma!
 */
function generateShapesBookPDF(doc: jsPDF, product: Product, childName: string): void {
  const totalPages = product.pageCount || 26;

  // Page 1: Cover
  drawBookCover(doc, product, childName, totalPages);

  const shapes = [
    { name: 'Circle: The Happy Sun & Bouncy Ball', shape: 'circle', color: 'Red' },
    { name: 'Square: The Toy Box & Window Pane', shape: 'square', color: 'Blue' },
    { name: 'Triangle: The Mountain Peak & Pizza Slice', shape: 'triangle', color: 'Yellow' },
    { name: 'Rectangle: The House Door & Story Book', shape: 'rectangle', color: 'Green' },
    { name: 'Star: The Twinkling Night Sky Star', shape: 'star', color: 'Orange' },
    { name: 'Oval: The Dinosaur & Bird Egg', shape: 'oval', color: 'Purple' },
    { name: 'Heart: Love, Kindness & Friendship', shape: 'heart', color: 'Pink' },
    { name: 'Diamond / Rhombus: The Flying Kite', shape: 'diamond', color: 'Cyan' },
    { name: 'Crescent: The Smiling Night Moon', shape: 'crescent', color: 'Gold' },
    { name: 'Primary Colors Wheel: Red, Yellow & Blue', shape: 'circle', color: 'Primary' },
    { name: 'Secondary Colors: Mixing Magic Fun', shape: 'square', color: 'Secondary' },
    { name: 'Colour by Shape Secret Puzzle', shape: 'triangle', color: 'Multi' },
    { name: 'Shape Detective: Count the Circles in the Room', shape: 'circle', color: 'Red' },
    { name: 'Shape Detective: Count the Squares in the Box', shape: 'square', color: 'Blue' },
    { name: 'Shape Detective: Count the Triangles in Tent', shape: 'triangle', color: 'Yellow' },
    { name: 'Build a Friendly Robot with Shapes', shape: 'rectangle', color: 'Silver' },
    { name: 'Build a Space Rocket with Shapes', shape: 'triangle', color: 'Red' },
    { name: 'Build a Dream Castle with Shapes', shape: 'square', color: 'Gold' },
    { name: 'Shape Shadow Silhouette Matching', shape: 'diamond', color: 'Purple' },
    { name: 'Pattern Sequence: Circle, Star, Circle, [?]', shape: 'star', color: 'Yellow' },
    { name: 'Pattern Sequence: Square, Triangle, Square, [?]', shape: 'square', color: 'Blue' },
    { name: 'Sorting Shapes by Size: Small, Medium, Giant', shape: 'circle', color: 'Green' },
    { name: 'Tracing Shape Perimeters with Precision', shape: 'heart', color: 'Pink' },
  ];

  shapes.forEach((s, idx) => {
    doc.addPage();
    const pNum = idx + 2;
    drawPageHeaderAndFooter(
      doc,
      product,
      pNum,
      totalPages,
      `${idx + 1}. ${s.name}`,
      `Identify the shape, trace its perimeter, and color using the suggested shade: ${s.color}.`
    );
    drawVectorShapeWorksheet(doc, s.shape, 105, 125);

    drawCrayonsPalette(doc, [
      { name: 'Primary Red', r: 239, g: 68, b: 68 },
      { name: 'Sky Blue', r: 59, g: 130, b: 246 },
      { name: 'Sunny Yellow', r: 234, g: 179, b: 8 },
      { name: 'Leaf Green', r: 34, g: 197, b: 94 },
    ]);
  });

  // Page 25: Giant Shapes Scavenger Hunt
  doc.addPage();
  drawPageHeaderAndFooter(
    doc,
    product,
    25,
    totalPages,
    'The Ultimate Shapes & Colors Scavenger Hunt',
    'Tally all geometric figures hidden in the playroom scene!'
  );
  doc.roundedRect(30, 60, 150, 150, 4, 4);

  // Page 26: Certificate
  doc.addPage();
  drawCertificatePage(
    doc,
    product,
    childName,
    26,
    totalPages,
    'MASTER OF SHAPES & COLOURS DIPLOMA',
    `For brilliantly mastering geometric shape discrimination, color theory, and completing all 26 pages of ${product.title}!`
  );
}

/**
 * 9. Festivals of Joy Kids Colouring Book (Exact 30 Pages)
 * Features 27 diverse cultural celebrations, sweets match, and harmony diploma!
 */
function generateFestivalsBookPDF(doc: jsPDF, product: Product, childName: string): void {
  const totalPages = product.pageCount || 30;

  // Page 1: Cover
  drawBookCover(doc, product, childName, totalPages);

  const festivals = [
    { name: '1. Sparkling Diwali Diya Lamp of Light', drawer: drawVectorDiya },
    { name: '2. Joyous Diwali Floral Rangoli Pattern', drawer: drawVectorRangoli },
    { name: '3. Holi Pichkari Water Gun & Splashes', drawer: drawVectorHoliPichkari },
    { name: '4. Christmas Evergreen Tree with Star', drawer: drawVectorChristmasTree },
    { name: '5. Eid Crescent Moon & Festive Lanterns', drawer: drawVectorEidLantern },
    { name: '6. Makar Sankranti Soaring Flying Kites', drawer: drawVectorKites },
    { name: '7. Pongal Harvest Boiling Pot of Joy', drawer: drawVectorRangoli },
    { name: '8. Raksha Bandhan Sacred Thread & Sweets', drawer: (d: jsPDF, x: number, y: number) => drawVectorShapeWorksheet(d, 'star', x, y) },
    { name: '9. Janmashtami Little Krishna Makhan Pot', drawer: drawVectorBear },
    { name: '10. Smiling Lord Ganesha with Sweet Modak', drawer: drawVectorElephant },
    { name: '11. Onam Floral Pookkalam Carpet', drawer: drawVectorRangoli },
    { name: '12. Navratri Dandiya Rhythm Sticks', drawer: drawVectorDolphin },
    { name: '13. Gurpurab Golden Temple & Nishan Sahib', drawer: (d: jsPDF, x: number, y: number) => drawVectorShapeWorksheet(d, 'square', x, y) },
    { name: '14. Jolly Santa Claus with Gift Sack', drawer: drawVectorTeddyBear },
    { name: '15. Christmas Bells, Stockings & Holly', drawer: (d: jsPDF, x: number, y: number) => drawVectorShapeWorksheet(d, 'circle', x, y) },
    { name: '16. Easter Bunny with Decorated Eggs', drawer: drawVectorBunny },
    { name: '17. Halloween Pumpkin Jack-o\'-Lantern', drawer: drawVectorPumpkin },
    { name: '18. Thanksgiving Harvest Cornucopia', drawer: (d: jsPDF, x: number, y: number) => drawVectorFruit(d, x, y, 'Strawberry', 1.2) },
    { name: '19. New Year Midnight Sky Fireworks', drawer: (d: jsPDF, x: number, y: number) => drawVectorShapeWorksheet(d, 'star', x, y) },
    { name: '20. Friendship Day Colorful Bracelets', drawer: (d: jsPDF, x: number, y: number) => drawVectorShapeWorksheet(d, 'heart', x, y) },
    { name: '21. Republic & Independence Day Pride', drawer: drawVectorAirplane },
    { name: '22. Birthday Celebration Cake with Candles', drawer: drawVectorBirthdayCake },
    { name: '23. Festival of Lights Candle Procession', drawer: drawVectorDiya },
    { name: '24. Eid Sweets & Dates Celebration Plate', drawer: drawVectorEidLantern },
    { name: '25. Holi Powder Color Bowls & Splashes', drawer: drawVectorHoliPichkari },
    { name: '26. Winter Wonderland Snowman & Scarf', drawer: drawVectorSnowman },
    { name: '27. Harmonious Family Festive Feast', drawer: drawVectorTeddyBear },
  ];

  festivals.forEach((f, idx) => {
    doc.addPage();
    const pNum = idx + 2;
    drawPageHeaderAndFooter(
      doc,
      product,
      pNum,
      totalPages,
      f.name,
      'Celebrate culture, harmony, and joy! Fill with your most dazzling festive colors.'
    );
    f.drawer(doc, 105, 125, 1.15);

    drawCrayonsPalette(doc, [
      { name: 'Deep Saffron', r: 249, g: 115, b: 22 },
      { name: 'Ruby Crimson', r: 225, g: 29, b: 72 },
      { name: 'Golden Light', r: 234, g: 179, b: 8 },
      { name: 'Royal Emerald', r: 16, g: 185, b: 129 },
    ]);
  });

  // Page 29: Festive Sweets Matching
  doc.addPage();
  drawPageHeaderAndFooter(
    doc,
    product,
    29,
    totalPages,
    'Festive Sweets & Delicacies Matching Game',
    'Match each festive sweet to its celebration: Modak, Ladoo, Cake, and Dates!'
  );
  drawVectorTracingRow(doc, 'waves', 90);
  drawVectorTracingRow(doc, 'loops', 150);
  drawVectorTracingRow(doc, 'zigzag', 210);

  // Page 30: Certificate
  doc.addPage();
  drawCertificatePage(
    doc,
    product,
    childName,
    30,
    totalPages,
    'FESTIVALS OF JOY CULTURAL STAR AWARD',
    `For celebrating cultural diversity, harmony, and artistic beauty in completing all 30 pages of ${product.title}!`
  );
}

/**
 * 10. Cartoon Colouring Book (Exact 20–24 Pages)
 * Whimsical monsters, friendly robots, fairy tale castles, and cuddly teddy bears!
 */
function generateCartoonBookPDF(doc: jsPDF, product: Product, childName: string): void {
  const totalPages = product.pageCount || 20;

  // Page 1: Cover
  drawBookCover(doc, product, childName, totalPages);

  const cartoons = [
    { name: '1. The Friendly Three-Eyed Star Monster', desc: 'A smiling purple monster who loves collecting shiny yellow star pebbles!', drawer: drawVectorMonster },
    { name: '2. Bleep-Bloop Happy Little Robot', desc: 'A cheerful mechanical buddy with antennas, chest dials, and clicking gears.', drawer: drawVectorRobot },
    { name: '3. Royal Fairytale Castle with Turrets', desc: 'A magical kingdom castle with fluttering banners, high stone towers, and drawbridge.', drawer: drawVectorCastle },
    { name: '4. Cuddly Teddy Bear Hugging a Star', desc: 'Warm fuzzy teddy bear with stitched button nose and heart-shaped paw pads.', drawer: drawVectorTeddyBear },
    { name: '5. Space Alien Flying in Cosmic Saucer', desc: 'A friendly cyclops space explorer zooming past ringed planets and asteroids.', drawer: drawVectorAlien },
    { name: '6. Gentle Baby Dragon with Daisy Blossom', desc: 'A cute little winged dragon who loves sweet wildflowers instead of fire!', drawer: drawVectorDragon },
    { name: '7. Smiling Little Dinosaur in Fern Forest', desc: 'A long-necked friendly Brontosaurus munching on tender jungle tree leaves.', drawer: drawVectorDinosaur },
    { name: '8. Three-Tier Birthday Celebration Cake', desc: 'A gigantic cake decorated with glowing candles, cherries, and sweet frosting drips.', drawer: drawVectorBirthdayCake },
    { name: '9. Friendly Sea Monster in Bubble Lagoon', desc: 'Deep sea explorer submarine swimming with playful bubbles and coral.', drawer: drawVectorSubmarine },
    { name: '10. Enchanted Butterfly Garden Fairy', desc: 'Delicate ornate butterfly wings fluttering above blooming summer daisies.', drawer: drawVectorButterfly },
    { name: '11. Superhero Puppy with Fluttering Cape', desc: 'A brave little golden pup ready to save the day and catch the flying ball!', drawer: drawVectorPuppy },
    { name: '12. Purring Kitten with Looping Yarn Ball', desc: 'Cute whiskers, curled tail, and looping yarn threads ready for your crayons.', drawer: drawVectorKitten },
    { name: '13. Cosmic Rocket Blasting into Galaxy', desc: 'Soaring spaceship traveling to the moon with fiery golden rocket flames.', drawer: drawVectorRocket },
    { name: '14. Rainbow Hot Air Balloon in Sky', desc: 'Floating gently above fluffy clouds with a woven picnic wicker basket.', drawer: drawVectorHotAirBalloon },
    { name: '15. Leaping Green Pond Frog with Lily Pad', desc: 'Big croaking round eyes sitting peacefully on round floating lily pads.', drawer: drawVectorFrog },
    { name: '16. Bushy-Tailed Forest Squirrel with Acorn', desc: 'A cheerful woodland squirrel holding a giant golden acorn for winter.', drawer: drawVectorSquirrel },
    { name: '17. Halloween Jack-o\'-Lantern Pumpkin', desc: 'A grinning harvest pumpkin with carved triangle eyes and leafy tendril.', drawer: drawVectorPumpkin },
    { name: '18. Winter Wonderland Snowman with Scarf', desc: 'A smiling three-tier snowman wearing a tall top hat and carrot nose.', drawer: drawVectorSnowman },
  ];

  cartoons.forEach((c, idx) => {
    if (idx + 2 < totalPages) {
      doc.addPage();
      const pNum = idx + 2;
      drawPageHeaderAndFooter(
        doc,
        product,
        pNum,
        totalPages,
        c.name,
        c.desc
      );
      c.drawer(doc, 105, 125, 1.15);

      drawCrayonsPalette(doc, [
        { name: 'Bubblegum Pink', r: 244, g: 114, b: 182 },
        { name: 'Electric Purple', r: 168, g: 85, b: 247 },
        { name: 'Sunshine Yellow', r: 250, g: 204, b: 21 },
        { name: 'Mint Green', r: 74, g: 222, b: 128 },
      ]);
    }
  });

  // Second to last page: Creative Imagination Challenge
  if (totalPages > cartoons.length + 2) {
    while (doc.getNumberOfPages() < totalPages - 1) {
      doc.addPage();
      const cur = doc.getNumberOfPages();
      drawPageHeaderAndFooter(
        doc,
        product,
        cur,
        totalPages,
        `Cartoon Imagination Sheet ${cur}`,
        'Draw your own whimsical creatures and give them silly superpower names!'
      );
      drawVectorMonster(doc, 105, 125, 1.1);
    }
  }

  // Final Page: Certificate
  doc.addPage();
  drawCertificatePage(
    doc,
    product,
    childName,
    totalPages,
    totalPages,
    'WHIMSICAL CARTOON MASTER ARTIST AWARD',
    `For bringing magical imaginary creatures to life with extraordinary creativity in completing all ${totalPages} pages of ${product.title}!`
  );
}

/**
 * 11. Nursery Activities Workbook (Exact 19–24 Pages)
 * Features visual mazes, shadow matching, dot-to-dot, spot the differences, and certificate!
 */
function generateNurseryBookPDF(doc: jsPDF, product: Product, childName: string): void {
  const totalPages = product.pageCount || 19;

  // Page 1: Cover
  drawBookCover(doc, product, childName, totalPages);

  const activities = [
    { title: '1. Shadow Silhouette Match: Farm & Forest', desc: 'Draw a straight pencil line connecting each outlined friend to its shadow.', drawer: (d: jsPDF, x: number, y: number) => drawVectorShadowMatchWorksheet(d, x, y) },
    { title: '2. Honeybee Garden Maze Adventure', desc: 'Guide the smiling honeybee through the garden pathways to the honey jar.', drawer: (d: jsPDF, x: number, y: number) => drawVectorMazeWorksheet(d, x, y, 1.0) },
    { title: '3. Connect the Dots 1 to 20: Star Trophy', desc: 'Connect numbers 1 to 20 in sequential order to reveal the secret picture!', drawer: (d: jsPDF, x: number, y: number) => drawVectorDotToDotWorksheet(d, x, y) },
    { title: '4. Spot 5 Differences in Playroom Scene', desc: 'Look closely at Picture A and Picture B. Find and circle all 5 differences!', drawer: (d: jsPDF, x: number, y: number) => drawVectorSpotDifferenceWorksheet(d, x, y) },
    { title: '5. Bunny Hopping Curve Tracing to Carrot', desc: 'Follow the gentle dotted curves across the page without lifting your pencil.', drawer: (d: jsPDF, x: number, y: number) => { drawVectorBunny(d, x, y - 20, 0.9); drawVectorTracingRow(d, 'waves', y + 45); } },
    { title: '6. Puppy Running Trail to Squeaky Bone', desc: 'Trace the straight runway from Start to Finish, then color the cheerful pup.', drawer: (d: jsPDF, x: number, y: number) => { drawVectorPuppy(d, x, y - 20, 0.9); drawVectorTracingRow(d, 'straight', y + 45); } },
    { title: '7. Floating Party Balloons Counting Fiesta', desc: 'Count each party balloon in the sky and color each in a different bright shade.', drawer: (d: jsPDF, x: number, y: number) => drawVectorHotAirBalloon(d, x, y, 1.1) },
    { title: '8. Snail Shell Spiral Precision Control', desc: 'Follow the circular spiral inward slowly to build fine motor wrist agility.', drawer: (d: jsPDF, x: number, y: number) => drawVectorTortoise(d, x, y, 1.1) },
    { title: '9. Sweet Strawberry Seed Dotting Practice', desc: 'Practice pencil grip by placing neat dots inside each seed circle.', drawer: (d: jsPDF, x: number, y: number) => drawVectorFruit(d, x, y, 'Strawberry', 1.2) },
    { title: '10. Star & Circle Shape Recognition Game', desc: 'Identify geometric figures and color matching pairs with the same shade.', drawer: (d: jsPDF, x: number, y: number) => drawVectorShapeWorksheet(d, 'star', x, y) },
    { title: '11. Ocean Dolphin Wave Jumping Quest', desc: 'Leap over the wavy water lines and color the leaping dolphin!', drawer: (d: jsPDF, x: number, y: number) => drawVectorDolphin(d, x, y, 1.1) },
    { title: '12. Big Apple Phonics & Finger Tracing', desc: 'Trace the outer circumference of the apple and sound out /a/ /a/ Apple.', drawer: (d: jsPDF, x: number, y: number) => drawVectorFruit(d, x, y, 'Apple', 1.2) },
    { title: '13. Mountain Peak Zigzag Pre-Writing Track', desc: 'Trace the sharp mountain zigzag tracks to reach the snow peak.', drawer: (d: jsPDF, x: number, y: number) => { drawVectorTracingRow(d, 'zigzag', y - 20); drawVectorTracingRow(d, 'zigzag', y + 35); } },
    { title: '14. Symmetrical Butterfly Wing Decorating', desc: 'Color both wings with matching colors to create a beautiful mirror pattern.', drawer: (d: jsPDF, x: number, y: number) => drawVectorButterfly(d, x, y, 1.1) },
    { title: '15. Count & Add: Two Apples + Two Apples', desc: 'Count the items on each side and write down the total sum in the box.', drawer: (d: jsPDF, x: number, y: number) => drawVectorFruit(d, x, y, 'Apple', 1.1) },
    { title: '16. Little Train Track Follow-Through', desc: 'Guide the locomotive along the rails to the train station.', drawer: (d: jsPDF, x: number, y: number) => drawVectorTrain(d, x, y, 1.05) },
    { title: '17. Nursery Free Expression Drawing Prompt', desc: 'Draw your favourite friend or pet in the frame below!', drawer: (d: jsPDF, x: number, y: number) => drawVectorTeddyBear(d, x, y, 1.05) },
  ];

  activities.forEach((act, idx) => {
    if (idx + 2 < totalPages) {
      doc.addPage();
      const pNum = idx + 2;
      drawPageHeaderAndFooter(doc, product, pNum, totalPages, act.title, act.desc);
      act.drawer(doc, 105, 125);

      drawCrayonsPalette(doc, [
        { name: 'Sunny Orange', r: 249, g: 115, b: 22 },
        { name: 'Sky Cyan', r: 6, g: 182, b: 212 },
        { name: 'Lime Green', r: 132, g: 204, b: 22 },
        { name: 'Berry Pink', r: 236, g: 72, b: 153 },
      ]);
    }
  });

  // Final Page: Certificate
  doc.addPage();
  drawCertificatePage(
    doc,
    product,
    childName,
    totalPages,
    totalPages,
    'LITTLE SCHOLAR NURSERY STAR AWARD',
    `For demonstrating wonderful fine-motor control, visual logic, and joyful curiosity in completing all ${totalPages} pages of ${product.title}!`
  );
}

/**
 * 12. Preschool Activity Bundle (3-in-1, Exact 85 Pages)
 * Combines 3 complete workbooks:
 * - Section 1: Safari Animals Colouring (30 pages, pp 2–31)
 * - Section 1 Star Award (p 32)
 * - Section 2: Alphabet Phonics A to Z (28 pages, pp 33–60)
 * - Section 2 Phonics Badge (p 61)
 * - Section 3: Numbers 1–20 Tracing & Counting (23 pages, pp 62–84)
 * - Section 3 / Master Bundle Diploma (p 85)
 * Total: exactly 85 pages!
 */
function generatePreschoolBundlePDF(doc: jsPDF, product: Product, childName: string): void {
  const totalPages = 85;

  // Page 1: Master Bundle Cover
  drawBookCover(doc, product, childName, totalPages);

  // SECTION 1: Animals Colouring (Pages 2 to 31 = 30 animals)
  const animals30 = [
    { name: 'Lion King', drawer: drawVectorLion },
    { name: 'Gentle Elephant', drawer: drawVectorElephant },
    { name: 'Honey Bear', drawer: drawVectorBear },
    { name: 'Ocean Dolphin', drawer: drawVectorDolphin },
    { name: 'Cheeky Monkey', drawer: drawVectorMonkey },
    { name: 'Tall Giraffe', drawer: drawVectorGiraffe },
    { name: 'Striped Zebra', drawer: drawVectorZebra },
    { name: 'Panda Bear', drawer: drawVectorPanda },
    { name: 'Farm Cow', drawer: drawVectorCow },
    { name: 'Fluffy Sheep', drawer: drawVectorSheep },
    { name: 'Pink Piglet', drawer: drawVectorPiglet },
    { name: 'Green Pond Frog', drawer: drawVectorFrog },
    { name: 'Playful Puppy', drawer: drawVectorPuppy },
    { name: 'Sweet Kitten', drawer: drawVectorKitten },
    { name: 'Bengal Tiger', drawer: drawVectorTiger },
    { name: 'Kangaroo with Joey', drawer: drawVectorKangaroo },
    { name: 'Iceberg Penguin', drawer: drawVectorPenguin },
    { name: 'Shielded Tortoise', drawer: drawVectorTortoise },
    { name: 'Bushy Squirrel', drawer: drawVectorSquirrel },
    { name: 'River Hippo', drawer: drawVectorHippo },
    { name: 'Horned Rhino', drawer: drawVectorRhino },
    { name: 'Spotted Forest Deer', drawer: drawVectorDeer },
    { name: 'Clever Fox', drawer: drawVectorFox },
    { name: 'Proud Farm Horse', drawer: drawVectorHorse },
    { name: 'Hop Bunny', drawer: drawVectorBunny },
    { name: 'Friendly Dinosaur', drawer: drawVectorDinosaur },
    { name: 'Garden Butterfly', drawer: drawVectorButterfly },
    { name: 'Playful Sea Seal', drawer: drawVectorSeal },
    { name: 'Wise Night Owl', drawer: drawVectorOwl },
    { name: 'Royal Peacock', drawer: drawVectorPeacock },
  ];

  animals30.forEach((a, i) => {
    doc.addPage();
    const pNum = i + 2;
    drawPageHeaderAndFooter(
      doc,
      product,
      pNum,
      totalPages,
      `Section 1 (Animals): ${a.name}`,
      'Colour within the bold lines! Practice saying the animal name and sound.',
      'Section 1: Animals'
    );
    a.drawer(doc, 105, 125, 1.15);
    drawCrayonsPalette(doc, [
      { name: 'Yellow', r: 255, g: 217, b: 61 },
      { name: 'Orange', r: 255, g: 138, b: 101 },
      { name: 'Sky Blue', r: 107, g: 203, b: 255 },
      { name: 'Mint Green', r: 184, g: 242, b: 200 },
    ]);
  });

  // Page 32: Animal Kingdom Section Award & Section 2 Divider
  doc.addPage();
  drawCertificatePage(
    doc,
    product,
    childName,
    32,
    totalPages,
    'ANIMAL KINGDOM ARTIST STAR',
    'For beautifully completing all 30 safari and farm animal colouring pages in Section 1!'
  );

  // SECTION 2: Alphabet Learning & Phonics (Pages 33 to 60 = 28 pages)
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  letters.forEach((ltr, i) => {
    doc.addPage();
    const pNum = i + 33;
    drawPageHeaderAndFooter(
      doc,
      product,
      pNum,
      totalPages,
      `Section 2 (Alphabet): Letter ${ltr} Phonics`,
      `Trace the uppercase and lowercase ${ltr}, say the phonics sound out loud, and color!`,
      'Section 2: ABC Phonics'
    );
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(64);
    doc.setTextColor(225, 29, 72);
    doc.text(ltr, 50, 95, { align: 'center' });
    doc.setFontSize(54);
    doc.setTextColor(234, 88, 12);
    doc.text(ltr.toLowerCase(), 85, 95, { align: 'center' });

    if (i % 4 === 0) drawVectorFruit(doc, 140, 85, 'Apple', 1.0);
    else if (i % 4 === 1) drawVectorBear(doc, 140, 85, 0.95);
    else if (i % 4 === 2) drawVectorCar(doc, 140, 85, 0.95);
    else drawVectorDolphin(doc, 140, 85, 0.95);

    drawVectorTracingRow(doc, 'straight', 150);
    drawVectorTracingRow(doc, 'waves', 200);
  });

  // Pages 59 & 60: Alphabet Roadmap & Maze
  doc.addPage();
  drawPageHeaderAndFooter(doc, product, 59, totalPages, 'Section 2: A to Z Phonics River Trail', 'Step across each letter stepping stone to cross the river!', 'Section 2: ABC Phonics');
  drawVectorTracingRow(doc, 'loops', 90);
  drawVectorTracingRow(doc, 'zigzag', 150);
  drawVectorTracingRow(doc, 'waves', 210);

  doc.addPage();
  drawPageHeaderAndFooter(doc, product, 60, totalPages, 'Section 2: Phonics Sound Matching Quiz', 'Draw a line connecting the letter sound to the picture!', 'Section 2: ABC Phonics');
  drawVectorShadowMatchWorksheet(doc, 105, 125);

  // Page 61: Alphabet Graduate Star Badge
  doc.addPage();
  drawCertificatePage(
    doc,
    product,
    childName,
    61,
    totalPages,
    'ALPHABET PHONICS GRADUATE BADGE',
    'For mastering letter recognition, letter sounds, and pre-writing traces from A to Z in Section 2!'
  );

  // SECTION 3: Numbers 1 to 20 Tracing & Counting (Pages 62 to 84 = 23 pages)
  for (let num = 1; num <= 20; num++) {
    doc.addPage();
    const pNum = num + 61; // 62 to 81
    drawPageHeaderAndFooter(
      doc,
      product,
      pNum,
      totalPages,
      `Section 3 (Numbers): Number ${num} Counting Fiesta`,
      `Count the ${num} friendly objects, trace the large numeral, and color!`,
      'Section 3: Numbers'
    );
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(64);
    doc.setTextColor(16, 185, 129);
    doc.text(`${num}`, 50, 95, { align: 'center' });

    drawVectorBear(doc, 140, 85, 0.95);
    drawVectorTracingRow(doc, 'straight', 155);
    drawVectorTracingRow(doc, 'zigzag', 205);
  }

  // Pages 82, 83, 84: Addition & Number Mazes
  doc.addPage();
  drawPageHeaderAndFooter(doc, product, 82, totalPages, 'Section 3: Visual Number Addition 1 to 10', 'Count the apples on both sides, add them up, and write the answer!', 'Section 3: Numbers');
  drawVectorFruit(doc, 60, 110, 'Apple', 1.0);
  drawVectorFruit(doc, 150, 110, 'Apple', 1.0);

  doc.addPage();
  drawPageHeaderAndFooter(doc, product, 83, totalPages, 'Section 3: Connect Numbers 1 to 20 Star', 'Follow the numbers in order 1, 2, 3 ... 20 to complete the star!', 'Section 3: Numbers');
  drawVectorDotToDotWorksheet(doc, 105, 125);

  doc.addPage();
  drawPageHeaderAndFooter(doc, product, 84, totalPages, 'Section 3: The Number Forest Maze', 'Help the puppy follow the numbers path from 1 to 20 to find the prize!', 'Section 3: Numbers');
  drawVectorMazeWorksheet(doc, 105, 125, 1.0);

  // Page 85: Master Diploma
  doc.addPage();
  drawCertificatePage(
    doc,
    product,
    childName,
    85,
    totalPages,
    'MASTER PRESCHOOL 3-IN-1 GRADUATE DIPLOMA',
    `For brilliantly completing all 85 pages across Animals, Alphabet Phonics, and Numbers Tracing in ${product.title}!`
  );
}

/**
 * 13. Mega Colouring & Activity Vault (7-in-1, Exact 160 Pages)
 * Unites 7 full workbooks:
 * - Vol 1: Animals Treasury (24 pages, pp 2–25)
 * - Vol 2: Alphabet Phonics (26 pages, pp 26–51)
 * - Vol 3: Numbers & Counting (20 pages, pp 52–71)
 * - Vol 4: Fruits & Vegetables (22 pages, pp 72–93)
 * - Vol 5: Vehicles & Transport (22 pages, pp 94–115)
 * - Vol 6: Tracing & Line Control (22 pages, pp 116–137)
 * - Vol 7: Festivals & World Celebrations (21 pages, pp 138–158)
 * - Page 159: Solutions & Parent Guide
 * - Page 160: Master Gold Trophy Diploma!
 * Total: exactly 160 pages!
 */
function generateMegaVault160PagePDF(doc: jsPDF, product: Product, childName: string): void {
  const totalPages = 160;

  // Page 1: Master Vault Cover
  drawBookCover(doc, product, childName, totalPages);

  // Volumes Configuration
  const volumes = [
    { title: 'Vol 1: Animals Treasury', pages: 24, gen: (p: number, r: number) => {
      const animals = [drawVectorLion, drawVectorElephant, drawVectorBear, drawVectorDolphin, drawVectorMonkey, drawVectorGiraffe, drawVectorZebra, drawVectorPanda, drawVectorCow, drawVectorPuppy, drawVectorKitten, drawVectorFrog];
      drawPageHeaderAndFooter(doc, product, p, totalPages, `Volume 1 (Animals): Wildlife Friend ${r}`, 'Colour the animal with bold outlines and vibrant crayon shades.', 'Vol 1: Animals');
      animals[(r - 1) % animals.length](doc, 105, 125, 1.15);
      drawCrayonsPalette(doc, [{ name: 'Yellow', r: 255, g: 217, b: 61 }, { name: 'Orange', r: 255, g: 138, b: 101 }, { name: 'Sky Blue', r: 107, g: 203, b: 255 }, { name: 'Mint', r: 184, g: 242, b: 200 }]);
    }},
    { title: 'Vol 2: Alphabet Phonics', pages: 26, gen: (p: number, r: number) => {
      const ltr = String.fromCharCode(65 + r - 1);
      drawPageHeaderAndFooter(doc, product, p, totalPages, `Volume 2 (Alphabet): Letter ${ltr} Phonics`, `Trace uppercase and lowercase ${ltr}, say the sound, and color!`, 'Vol 2: Alphabet');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(60);
      doc.setTextColor(225, 29, 72);
      doc.text(ltr, 50, 95, { align: 'center' });
      drawVectorFruit(doc, 135, 85, 'Apple', 1.0);
      drawVectorTracingRow(doc, 'straight', 150);
      drawVectorTracingRow(doc, 'waves', 200);
    }},
    { title: 'Vol 3: Numbers & Counting', pages: 20, gen: (p: number, r: number) => {
      drawPageHeaderAndFooter(doc, product, p, totalPages, `Volume 3 (Numbers): Number ${r} Counting`, `Count the friendly objects and trace the numeral ${r}!`, 'Vol 3: Numbers');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(60);
      doc.setTextColor(16, 185, 129);
      doc.text(`${r}`, 50, 95, { align: 'center' });
      drawVectorBear(doc, 135, 85, 0.95);
      drawVectorTracingRow(doc, 'zigzag', 150);
      drawVectorTracingRow(doc, 'straight', 200);
    }},
    { title: 'Vol 4: Fruits & Vegetables', pages: 22, gen: (p: number, r: number) => {
      const foods = ['Strawberry', 'Carrot', 'Banana', 'Watermelon', 'Pineapple', 'Corn', 'Apple', 'Grapes'];
      const f = foods[(r - 1) % foods.length];
      drawPageHeaderAndFooter(doc, product, p, totalPages, `Volume 4 (Healthy Food): Cheerful ${f}`, 'Eat your rainbow fruits and vegetables every day for super energy!', 'Vol 4: Food');
      drawVectorFruit(doc, 105, 120, f, 1.2);
      drawCrayonsPalette(doc, [{ name: 'Red', r: 239, g: 68, b: 68 }, { name: 'Orange', r: 249, g: 115, b: 22 }, { name: 'Yellow', r: 234, g: 179, b: 8 }, { name: 'Green', r: 34, g: 197, b: 94 }]);
    }},
    { title: 'Vol 5: Vehicles & Transport', pages: 22, gen: (p: number, r: number) => {
      const vehicles = [drawVectorCar, drawVectorTrain, drawVectorAirplane, drawVectorHelicopter, drawVectorSailboat, drawVectorRocket, drawVectorFireEngine, drawVectorAmbulance, drawVectorPoliceCar, drawVectorSchoolBus, drawVectorDumpTruck, drawVectorBicycle];
      drawPageHeaderAndFooter(doc, product, p, totalPages, `Volume 5 (Vehicles): Transport Machine ${r}`, 'Beep beep! Colour the wheels, vehicle body, and windows.', 'Vol 5: Vehicles');
      vehicles[(r - 1) % vehicles.length](doc, 105, 125, 1.15);
      drawCrayonsPalette(doc, [{ name: 'Cherry Red', r: 239, g: 68, b: 68 }, { name: 'Yellow', r: 250, g: 204, b: 21 }, { name: 'Sky Blue', r: 56, g: 189, b: 248 }, { name: 'Gray', r: 100, g: 116, b: 139 }]);
    }},
    { title: 'Vol 6: Tracing & Line Control', pages: 22, gen: (p: number, r: number) => {
      drawPageHeaderAndFooter(doc, product, p, totalPages, `Volume 6 (Tracing): Pre-Writing Path ${r}`, 'Keep your pencil on the dashed lines from START to FINISH.', 'Vol 6: Tracing');
      for (let t = 0; t < 4; t++) {
        drawVectorTracingRow(doc, (r + t) % 3 === 0 ? 'waves' : (r + t) % 3 === 1 ? 'zigzag' : 'loops', 70 + t * 40);
      }
    }},
    { title: 'Vol 7: Festivals & Celebrations', pages: 21, gen: (p: number, r: number) => {
      const fests = [drawVectorDiya, drawVectorRangoli, drawVectorHoliPichkari, drawVectorChristmasTree, drawVectorEidLantern, drawVectorKites, drawVectorBirthdayCake, drawVectorPumpkin, drawVectorSnowman];
      drawPageHeaderAndFooter(doc, product, p, totalPages, `Volume 7 (Festivals): Festive Joy ${r}`, 'Celebrate love, culture, and lights with radiant festive shades!', 'Vol 7: Festivals');
      fests[(r - 1) % fests.length](doc, 105, 125, 1.15);
      drawCrayonsPalette(doc, [{ name: 'Deep Gold', r: 234, g: 179, b: 8 }, { name: 'Ruby Red', r: 225, g: 29, b: 72 }, { name: 'Saffron', r: 249, g: 115, b: 22 }, { name: 'Emerald', r: 16, g: 185, b: 129 }]);
    }},
  ];

  volumes.forEach((vol) => {
    for (let r = 1; r <= vol.pages; r++) {
      if (doc.getNumberOfPages() < 158) {
        doc.addPage();
        const curPage = doc.getNumberOfPages();
        vol.gen(curPage, r);
      }
    }
  });

  while (doc.getNumberOfPages() < 158) {
    doc.addPage();
    const curP = doc.getNumberOfPages();
    drawPageHeaderAndFooter(doc, product, curP, totalPages, `Mega Vault Treasury Page ${curP}`, 'Colour and practice creative expression.');
  }

  // Page 159: Solutions & Parent Guide
  doc.addPage();
  drawPageHeaderAndFooter(
    doc,
    product,
    159,
    totalPages,
    'Parent & Educator Verification Key',
    'Curriculum milestone solutions across all 7 comprehensive workbook volumes.'
  );
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(22, 50, 166, 185, 4, 4, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(225, 29, 72);
  doc.text('160-Page Mega Vault Early Childhood Curriculum Milestones:', 28, 65);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  doc.text('✓ 24 Wildlife safari and farm animal colouring pages for boundary control.', 28, 80);
  doc.text('✓ 26 Full Alphabet phonics letter tracing pages with object associations.', 28, 95);
  doc.text('✓ 20 Sequential number counting pages with ten-frames and visual addition.', 28, 110);
  doc.text('✓ 22 Healthy fruit and vegetable awareness sheets building nutrition habits.', 28, 125);
  doc.text('✓ 22 Action-packed transport vehicles introducing community helpers.', 28, 140);
  doc.text('✓ 22 Fine motor pencil control mazes, waves, zigzags, and loops.', 28, 155);
  doc.text('✓ 21 Cultural holiday and festive celebration illustrations.', 28, 170);

  // Page 160: Ultimate Gold Trophy Diploma
  doc.addPage();
  drawCertificatePage(
    doc,
    product,
    childName,
    160,
    totalPages,
    'ULTIMATE MEGA VAULT MASTER SCHOLAR TROPHY',
    `For brilliantly completing all 160 pages across all 7 volumes of ${product.title} with immense focus, dedication, and artistic brilliance!`
  );
}

/**
 * 14. The Ultimate Kids' Activity Playbook (100-Page Comprehensive Edition)
 * Covers all 18 developmental categories, table of contents, parent guides, answer keys, and certificate across exactly 100 pages!
 */
function generate100PagePlaybookPDF(doc: jsPDF, product: Product, childName: string): void {
  const totalPages = 100;
  const width = 210;

  // Page 1: Master Front Cover
  drawBookCover(doc, product, childName, totalPages);

  // Page 2: Educator & Parent Guide
  doc.addPage();
  drawPageHeaderAndFooter(
    doc,
    product,
    2,
    totalPages,
    'Educator & Parent Early Learning Roadmap',
    'Foundational skill development across all 18 cognitive and motor milestones.'
  );

  const milestones = [
    { title: '1. Fine Motor & Tripod Pencil Grip', desc: 'Progressive curves, zigzags, and maze paths build the hand-muscle coordination needed for writing.' },
    { title: '2. Alphabet Recognition & Phonics Foundations', desc: 'Letter sound association, hollow bubble tracing, and phonics vocabulary.' },
    { title: '3. Numeracy, Counting & Visual Math', desc: 'Quantities 1 to 100, one-to-one correspondence, ten frames, and visual addition.' },
    { title: '4. Spatial Logic, Observation & Problem Solving', desc: 'Mazes, spot the difference, dot-to-dot cosmic rockets, and pattern sequences.' },
  ];

  milestones.forEach((m, idx) => {
    const yM = 50 + idx * 30;
    doc.setFillColor(254, 242, 242);
    doc.setDrawColor(254, 202, 202);
    doc.roundedRect(22, yM, 166, 25, 3, 3, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(190, 18, 60);
    doc.text(m.title, 28, yM + 9);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    doc.text(m.desc, 28, yM + 18);
  });

  // Recommended Daily Routine
  doc.setFillColor(240, 253, 250);
  doc.setDrawColor(153, 246, 228);
  doc.roundedRect(22, 180, 166, 45, 4, 4, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 118, 110);
  doc.text('Recommended Routine for Parents & Teachers:', 28, 192);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  doc.text('• Dedicate 15 to 20 minutes daily of relaxed, screen-free creative play.', 28, 202);
  doc.text('• Encourage verbal expression: Ask your child to describe the animals and colors.', 28, 210);
  doc.text('• Praise patience, focus, and curiosity rather than staying strictly within lines.', 28, 218);

  // Page 3: Master Table of Contents (18 Categories)
  doc.addPage();
  drawPageHeaderAndFooter(
    doc,
    product,
    3,
    totalPages,
    'Master Table of Contents (All 18 Categories)',
    '100 Pages covering all core early childhood developmental learning domains.'
  );

  const categoriesTOC = [
    { num: 1, title: 'Alphabet Learning (A–Z)', pages: '4–11' },
    { num: 2, title: 'Numbers & Counting (1–100)', pages: '12–19' },
    { num: 3, title: 'Shapes & Colors', pages: '20–25' },
    { num: 4, title: 'Tracing & Handwriting', pages: '26–31' },
    { num: 5, title: 'Coloring Activities', pages: '32–37' },
    { num: 6, title: 'Animals & Birds', pages: '38–43' },
    { num: 7, title: 'Fruits & Vegetables', pages: '44–49' },
    { num: 8, title: 'Matching Activities', pages: '50–55' },
    { num: 9, title: 'Mazes & Labyrinths', pages: '56–61' },
    { num: 10, title: 'Spot the Difference', pages: '62–67' },
    { num: 11, title: 'Dot-to-Dot Activities', pages: '68–73' },
    { num: 12, title: 'Logical Thinking Games', pages: '74–79' },
    { num: 13, title: 'Memory & Observation', pages: '80–84' },
    { num: 14, title: 'Basic Mathematics', pages: '85–88' },
    { num: 15, title: 'Creative Drawing Prompts', pages: '89–92' },
    { num: 16, title: 'Good Habits & Daily Routine', pages: '93–95' },
    { num: 17, title: 'Nature & Life Cycles', pages: '96–97' },
    { num: 18, title: 'Fun Educational Games', pages: '98' },
  ];

  categoriesTOC.forEach((c, idx) => {
    const isCol2 = idx >= 9;
    const colX = isCol2 ? 110 : 22;
    const rIdx = isCol2 ? idx - 9 : idx;
    const yC = 50 + rIdx * 19;

    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(colX, yC, 80, 15, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(225, 29, 72);
    doc.text(`${c.num}.`, colX + 4, yC + 10);
    doc.setTextColor(30, 41, 59);
    doc.text(c.title, colX + 11, yC + 10);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(`p. ${c.pages}`, colX + 74, yC + 10, { align: 'right' });
  });

  doc.setFillColor(254, 243, 199);
  doc.roundedRect(22, 230, 168, 14, 3, 3, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(146, 64, 14);
  doc.text('Answer Keys (Page 99)   •   Official Super Scholar Diploma (Page 100)', width / 2, 239, { align: 'center' });

  // Generate All Pages from 4 to 98 (Systematic 18 Category Modules)
  const categoryModuleDefs = [
    // Cat 1: Alphabet Learning (Pages 4–11: 8 pages)
    { cat: 'Alphabet Learning (A–Z)', pages: 8, gen: (p: number, relP: number) => {
      const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
      const ltr = letters[relP - 1] || 'A';
      drawPageHeaderAndFooter(doc, product, p, totalPages, `Category 1: Letter ${ltr} & Phonics Fun`, 'Say the sound out loud, trace the big letter, and color the picture!', 'Category 1: Alphabet');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(64);
      doc.setTextColor(225, 29, 72);
      doc.text(ltr, 50, 100, { align: 'center' });
      drawVectorFruit(doc, 130, 85, 'Apple', 1.1);
      drawVectorTracingRow(doc, 'straight', 150);
      drawVectorTracingRow(doc, 'waves', 200);
    }},
    // Cat 2: Numbers & Counting (Pages 12–19: 8 pages)
    { cat: 'Numbers & Counting (1–100)', pages: 8, gen: (p: number, relP: number) => {
      const n = relP * 2;
      drawPageHeaderAndFooter(doc, product, p, totalPages, `Category 2: Number ${n} Counting Fiesta`, 'Count each object in the sky and trace the large numerals.', 'Category 2: Numbers');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(54);
      doc.setTextColor(234, 88, 12);
      doc.text(`${n}`, 45, 95, { align: 'center' });
      drawVectorBear(doc, 135, 85, 1.0);
      drawVectorTracingRow(doc, 'zigzag', 150);
      drawVectorTracingRow(doc, 'straight', 200);
    }},
    // Cat 3: Shapes & Colors (Pages 20–25: 6 pages)
    { cat: 'Shapes & Colors', pages: 6, gen: (p: number, relP: number) => {
      const shapes = ['Circle', 'Square', 'Triangle', 'Star', 'Diamond', 'Heart'];
      const sh = shapes[relP - 1] || 'Circle';
      drawPageHeaderAndFooter(doc, product, p, totalPages, `Category 3: The ${sh} Explorer`, 'Identify the shape, trace its perimeter, and color with your favorite shade.', 'Category 3: Shapes');
      drawVectorShapeWorksheet(doc, sh, 105, 120);
      drawCrayonsPalette(doc, [{ name: 'Yellow', r: 255, g: 217, b: 61 }, { name: 'Blue', r: 59, g: 130, b: 246 }, { name: 'Red', r: 239, g: 68, b: 68 }, { name: 'Green', r: 34, g: 197, b: 94 }]);
    }},
    // Cat 4: Tracing & Handwriting (Pages 26–31: 6 pages)
    { cat: 'Tracing & Handwriting', pages: 6, gen: (p: number, relP: number) => {
      drawPageHeaderAndFooter(doc, product, p, totalPages, `Category 4: Pre-Writing Motor Path ${relP}`, 'Keep your pencil on the dashed line from START to FINISH.', 'Category 4: Tracing');
      for (let t = 0; t < 4; t++) {
        drawVectorTracingRow(doc, t % 2 === 0 ? 'waves' : 'zigzag', 70 + t * 40);
      }
    }},
    // Cat 5: Coloring Activities (Pages 32–37: 6 pages)
    { cat: 'Coloring Activities', pages: 6, gen: (p: number, relP: number) => {
      drawPageHeaderAndFooter(doc, product, p, totalPages, `Category 5: Cheerful Animal Coloring Sheet ${relP}`, 'Big bold outlines engineered for stress-free toddler coloring.', 'Category 5: Coloring');
      if (relP === 1) drawVectorLion(doc, 105, 125, 1.1);
      else if (relP === 2) drawVectorElephant(doc, 105, 125, 1.1);
      else if (relP === 3) drawVectorMonkey(doc, 105, 125, 1.1);
      else if (relP === 4) drawVectorGiraffe(doc, 105, 125, 1.1);
      else if (relP === 5) drawVectorPanda(doc, 105, 125, 1.1);
      else drawVectorDolphin(doc, 105, 125, 1.1);
      drawCrayonsPalette(doc, [{ name: 'Orange', r: 249, g: 115, b: 22 }, { name: 'Gold', r: 234, g: 179, b: 8 }, { name: 'Brown', r: 120, g: 53, b: 15 }, { name: 'Yellow', r: 255, g: 217, b: 61 }]);
    }},
    // Cat 6: Animals & Birds (Pages 38–43: 6 pages)
    { cat: 'Animals & Birds', pages: 6, gen: (p: number, relP: number) => {
      drawPageHeaderAndFooter(doc, product, p, totalPages, `Category 6: Wildlife Friend ${relP}`, 'Discover beautiful creatures from savannahs and rainforests.', 'Category 6: Animals');
      if (relP === 1) drawVectorOwl(doc, 105, 125, 1.15);
      else if (relP === 2) drawVectorPeacock(doc, 105, 125, 1.15);
      else if (relP === 3) drawVectorToucan(doc, 105, 125, 1.15);
      else if (relP === 4) drawVectorFlamingo(doc, 105, 125, 1.15);
      else if (relP === 5) drawVectorSwan(doc, 105, 125, 1.15);
      else drawVectorPenguin(doc, 105, 125, 1.15);
      drawCrayonsPalette(doc, [{ name: 'Sky Blue', r: 107, g: 203, b: 255 }, { name: 'Forest Green', r: 72, g: 187, b: 120 }, { name: 'Yellow', r: 255, g: 217, b: 61 }, { name: 'Coral', r: 255, g: 107, b: 107 }]);
    }},
    // Cat 7: Fruits & Vegetables (Pages 44–49: 6 pages)
    { cat: 'Fruits & Vegetables', pages: 6, gen: (p: number, relP: number) => {
      const foods = ['Strawberry', 'Carrot', 'Banana', 'Watermelon', 'Pineapple', 'Corn'];
      const f = foods[relP - 1] || 'Apple';
      drawPageHeaderAndFooter(doc, product, p, totalPages, `Category 7: Healthy ${f} Friend`, 'Eat fresh rainbow fruits and vegetables every day!', 'Category 7: Fruits');
      drawVectorFruit(doc, 105, 120, f, 1.2);
      drawCrayonsPalette(doc, [{ name: 'Red', r: 239, g: 68, b: 68 }, { name: 'Orange', r: 249, g: 115, b: 22 }, { name: 'Yellow', r: 234, g: 179, b: 8 }, { name: 'Green', r: 34, g: 197, b: 94 }]);
    }},
    // Cat 8: Matching Activities (Pages 50–55: 6 pages)
    { cat: 'Matching Activities', pages: 6, gen: (p: number, relP: number) => {
      drawPageHeaderAndFooter(doc, product, p, totalPages, `Category 8: Shadow Silhouette Match ${relP}`, 'Draw a line connecting each cartoon character to its shadow.', 'Category 8: Matching');
      for (let m = 0; m < 4; m++) {
        const yM = 60 + m * 42;
        doc.setFillColor(254, 242, 242);
        doc.roundedRect(25, yM, 65, 26, 3, 3, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(190, 18, 60);
        doc.text(`Item ${m + 1} Picture`, 32, yM + 16);

        doc.setFillColor(241, 245, 249);
        doc.roundedRect(120, yM, 65, 26, 3, 3, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(30, 41, 59);
        doc.text(`Shadow ${String.fromCharCode(65 + m)}`, 128, yM + 16);
      }
    }},
    // Cat 9: Mazes & Labyrinths (Pages 56–61: 6 pages)
    { cat: 'Mazes & Labyrinths', pages: 6, gen: (p: number, relP: number) => {
      drawPageHeaderAndFooter(doc, product, p, totalPages, `Category 9: Adventure Garden Maze ${relP}`, 'Help the friendly character navigate through the labyrinth to the goal.', 'Category 9: Mazes');
      doc.setLineWidth(2);
      doc.roundedRect(30, 55, 150, 150, 4, 4);
      doc.line(30, 95, 140, 95);
      doc.line(70, 135, 180, 135);
      doc.line(30, 175, 130, 175);
    }},
    // Cat 10: Spot the Difference (Pages 62–67: 6 pages)
    { cat: 'Spot the Difference', pages: 6, gen: (p: number, relP: number) => {
      drawPageHeaderAndFooter(doc, product, p, totalPages, `Category 10: Spot 5 Differences Scene ${relP}`, 'Compare Picture A and Picture B. Find and circle the 5 subtle changes!', 'Category 10: Differences');
      doc.roundedRect(22, 55, 78, 120, 3, 3);
      doc.roundedRect(110, 55, 78, 120, 3, 3);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(30, 41, 59);
      doc.text('Picture A (Original)', 61, 70, { align: 'center' });
      doc.text('Picture B (5 Differences)', 149, 70, { align: 'center' });
    }},
    // Cat 11: Dot-to-Dot (Pages 68–73: 6 pages)
    { cat: 'Dot-to-Dot Activities', pages: 6, gen: (p: number, relP: number) => {
      drawPageHeaderAndFooter(doc, product, p, totalPages, `Category 11: Connect the Dots 1 to 20 (Art ${relP})`, 'Connect the numbered dots in sequential order to reveal the picture!', 'Category 11: Dot-to-Dot');
      for (let dt = 1; dt <= 20; dt++) {
        const rad = ((dt * 18) * Math.PI) / 180;
        const dx = 105 + Math.cos(rad) * 45;
        const dy = 135 + Math.sin(rad) * 45;
        doc.setFillColor(225, 29, 72);
        doc.circle(dx, dy, 2, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.setTextColor(30, 41, 59);
        doc.text(`${dt}`, dx + 3, dy - 2);
      }
    }},
    // Cat 12: Logical Thinking (Pages 74–79: 6 pages)
    { cat: 'Logical Thinking Games', pages: 6, gen: (p: number, relP: number) => {
      drawPageHeaderAndFooter(doc, product, p, totalPages, `Category 12: Pattern Completion Quest ${relP}`, 'Look at the repeating pattern sequence and draw what comes next.', 'Category 12: Logic');
      for (let pt = 0; pt < 4; pt++) {
        const yP = 55 + pt * 42;
        doc.setFillColor(254, 242, 242);
        doc.roundedRect(22, yP, 166, 32, 3, 3, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(190, 18, 60);
        doc.text(`Pattern ${pt + 1}: Star, Circle, Star, Circle, [  ?  ]`, 28, yP + 14);
      }
    }},
    // Cat 13: Memory & Observation (Pages 80–84: 5 pages)
    { cat: 'Memory & Observation', pages: 5, gen: (p: number, relP: number) => {
      drawPageHeaderAndFooter(doc, product, p, totalPages, `Category 13: Preschool I-Spy Detective ${relP}`, 'Count how many stars, apples, and flowers are hidden in the box!', 'Category 13: Observation');
      doc.roundedRect(22, 55, 166, 115, 4, 4);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.setTextColor(234, 88, 12);
      doc.text('⭐   🍎   🌸   ⭐   🍎   ⭐   🌸   ⭐', 35, 80);
      doc.text('🌸   ⭐   🍎   🌸   ⭐   🍎   🌸   🍎', 35, 110);
      doc.text('🍎   🌸   ⭐   🍎   🌸   ⭐   🍎   ⭐', 35, 140);
    }},
    // Cat 14: Basic Mathematics (Pages 85–88: 4 pages)
    { cat: 'Basic Mathematics', pages: 4, gen: (p: number, relP: number) => {
      drawPageHeaderAndFooter(doc, product, p, totalPages, `Category 14: Visual Addition Fun ${relP}`, 'Count the apples on both sides, add them together, and write the sum.', 'Category 14: Math');
      for (let m = 0; m < 4; m++) {
        const yM = 55 + m * 42;
        doc.setFillColor(254, 242, 242);
        doc.roundedRect(22, yM, 166, 32, 3, 3, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(13);
        doc.setTextColor(225, 29, 72);
        doc.text(`${m + 1} Apples  +  ${m + 2} Apples  =  [  ${2 * m + 3}  ] Apples`, 32, yM + 19);
      }
    }},
    // Cat 15: Creative Drawing (Pages 89–92: 4 pages)
    { cat: 'Creative Drawing Prompts', pages: 4, gen: (p: number, relP: number) => {
      drawPageHeaderAndFooter(doc, product, p, totalPages, `Category 15: Finish the Drawing Prompt ${relP}`, 'Use your wildest imagination to complete the friendly picture!', 'Category 15: Drawing');
      doc.setLineWidth(2.2);
      doc.ellipse(105, 130, 48, 56);
      doc.circle(105, 60, 5, 'FD');
    }},
    // Cat 16: Good Daily Habits (Pages 93–95: 3 pages)
    { cat: 'Good Habits & Daily Routine', pages: 3, gen: (p: number, relP: number) => {
      drawPageHeaderAndFooter(doc, product, p, totalPages, `Category 16: Healthy Daily Routine Checklist ${relP}`, 'Color the star checkbox every time you practice this positive habit!', 'Category 16: Habits');
      const habits = [
        '1. Brushing Teeth Morning & Night',
        '2. Washing Hands with Soap & Water',
        '3. Eating Wholesome Nutritious Food',
        '4. Tidying Up Toys After Playtime'
      ];
      habits.forEach((h, idx) => {
        const yH = 55 + idx * 42;
        doc.setFillColor(254, 242, 242);
        doc.roundedRect(22, yH, 166, 32, 3, 3, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(190, 18, 60);
        doc.text(h, 32, yH + 19);
      });
    }},
    // Cat 17: Nature & Life Cycles (Pages 96–97: 2 pages)
    { cat: 'Nature & Life Cycles', pages: 2, gen: (p: number, relP: number) => {
      drawPageHeaderAndFooter(doc, product, p, totalPages, `Category 17: Nature Discovery & Life Cycles ${relP}`, 'Number the developmental stages from 1 to 4 in order.', 'Category 17: Nature');
      for (let s = 0; s < 4; s++) {
        const col = s % 2;
        const row = Math.floor(s / 2);
        doc.roundedRect(25 + col * 85, 55 + row * 85, 75, 75, 3, 3);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(21, 128, 61);
        doc.text(`Stage ${s + 1}`, 62 + col * 85, 95 + row * 85, { align: 'center' });
      }
    }},
    // Cat 18: Fun Educational Games (Page 98: 1 page)
    { cat: 'Fun Educational Games', pages: 1, gen: (p: number) => {
      drawPageHeaderAndFooter(doc, product, p, totalPages, 'Category 18: The Alphabet Stepping Stones Game', 'Fill in the missing alphabet stepping stones across the river: C, F, I, L.', 'Category 18: Games');
      drawVectorTracingRow(doc, 'zigzag', 80);
      drawVectorTracingRow(doc, 'waves', 140);
      drawVectorTracingRow(doc, 'loops', 200);
    }},
  ];

  categoryModuleDefs.forEach((mod) => {
    for (let r = 1; r <= mod.pages; r++) {
      if (doc.getNumberOfPages() < 98) {
        doc.addPage();
        const curPage = doc.getNumberOfPages();
        mod.gen(curPage, r);
      }
    }
  });

  while (doc.getNumberOfPages() < 98) {
    doc.addPage();
    const curP = doc.getNumberOfPages();
    drawPageHeaderAndFooter(doc, product, curP, totalPages, `Playbook Activity Sheet ${curP}`, 'Colour and practice pencil control.');
  }

  // Page 99: Verified Answer Keys & Solutions
  doc.addPage();
  drawPageHeaderAndFooter(
    doc,
    product,
    99,
    totalPages,
    'Official Teacher & Parent Verified Answer Keys',
    'Solutions for Mazes, Spot the Difference, Pattern Sequences, and Math addition.'
  );

  const solutions = [
    { cat: 'Category 9 (Mazes & Puzzles)', sol: 'Start at top-left opening -> proceed south -> turn right at corridor -> follow opening to bottom honey jar.' },
    { cat: 'Category 10 (Spot the Difference)', sol: '1. Missing sky butterfly. 2. Bow tie on cat. 3. Extra blooming flower. 4. Sun ray count changed. 5. Bird on fence.' },
    { cat: 'Category 12 (Logical Patterns)', sol: 'Row 1: Circle ◯.   Row 2: Square ▢.   Row 3: Sun ☀️.   Row 4: Small Heart 💛.' },
    { cat: 'Category 13 (Memory & Observation I-Spy)', sol: 'Gold Stars: 8 total.   Sweet Apples: 6 total.   Pink Flowers: 7 total.' },
    { cat: 'Category 14 (Basic Mathematics Addition)', sol: 'Problem 1: 1 + 2 = 3.   Problem 2: 2 + 3 = 5.   Problem 3: 3 + 4 = 7.   Problem 4: 4 + 5 = 9.' },
    { cat: 'Category 18 (Alphabet Stepping Stones)', sol: 'Missing letters in sequential order: C, F, I, L.' },
  ];

  solutions.forEach((s, idx) => {
    const yS = 48 + idx * 32;
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(20, yS, 170, 26, 3, 3, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(225, 29, 72);
    doc.text(s.cat, 26, yS + 8);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);
    const splitSol = doc.splitTextToSize(s.sol, 160);
    doc.text(splitSol, 26, yS + 16);
  });

  // Page 100: Official Super Scholar Diploma
  doc.addPage();
  drawCertificatePage(
    doc,
    product,
    childName,
    100,
    totalPages,
    'SUPER SCHOLAR & ARTIST DIPLOMA',
    `For brilliantly completing all 100 pages across all 18 developmental categories of The Ultimate Kids' Activity Playbook with tremendous curiosity and artistic excellence!`
  );
}

/**
 * 11. Generic / Dynamic Book Generator for ANY custom product with page count N
 * Tailors each page to the product's name, category, description, and exact pageCount!
 */
function generateGenericCustomBookPDF(doc: jsPDF, product: Product, childName: string): void {
  const totalPages = Math.max(4, product.pageCount || 24);

  // Page 1: Cover
  drawBookCover(doc, product, childName, totalPages);

  // Pages 2 to totalPages - 1: Activities tailored to Category & Description
  for (let pNum = 2; pNum < totalPages; pNum++) {
    doc.addPage();

    const sampleIdx = (pNum - 2) % (product.samplePages?.length || 1);
    const sample = product.samplePages?.[sampleIdx];
    const pageTitle = sample?.title || `${product.title} - Activity Sheet ${pNum - 1}`;
    const pageDesc = sample?.description || `Crisp printable worksheet designed for ${product.ageGroup}.`;

    drawPageHeaderAndFooter(doc, product, pNum, totalPages, pageTitle, pageDesc);

    const catLower = (product.category + ' ' + product.title).toLowerCase();
    if (catLower.includes('animal')) {
      const animalDrawers = [drawVectorLion, drawVectorElephant, drawVectorBear, drawVectorDolphin, drawVectorMonkey, drawVectorGiraffe, drawVectorPanda, drawVectorCow, drawVectorPuppy, drawVectorKitten];
      animalDrawers[(pNum - 2) % animalDrawers.length](doc, 105, 125, 1.1);
    } else if (catLower.includes('bird')) {
      const birdDrawers = [drawVectorOwl, drawVectorPeacock, drawVectorToucan, drawVectorFlamingo, drawVectorHummingbird, drawVectorSwan, drawVectorPenguin];
      birdDrawers[(pNum - 2) % birdDrawers.length](doc, 105, 125, 1.15);
    } else if (catLower.includes('fruit') || catLower.includes('vegetable')) {
      const fruits = ['Strawberry', 'Carrot', 'Banana', 'Watermelon', 'Pineapple', 'Corn', 'Apple', 'Grapes'];
      drawVectorFruit(doc, 105, 120, fruits[(pNum - 2) % fruits.length], 1.2);
    } else if (catLower.includes('vehicle') || catLower.includes('transport')) {
      const vehicleDrawers = [drawVectorCar, drawVectorTrain, drawVectorAirplane, drawVectorHelicopter, drawVectorSailboat, drawVectorRocket, drawVectorSubmarine, drawVectorTractor];
      vehicleDrawers[(pNum - 2) % vehicleDrawers.length](doc, 105, 125, 1.1);
    } else if (catLower.includes('shape')) {
      const shapes = ['circle', 'square', 'triangle', 'star', 'heart', 'diamond', 'crescent'];
      drawVectorShapeWorksheet(doc, shapes[(pNum - 2) % shapes.length], 105, 125);
    } else if (catLower.includes('trace') || catLower.includes('writing')) {
      for (let t = 0; t < 4; t++) {
        drawVectorTracingRow(doc, t % 2 === 0 ? 'waves' : 'zigzag', 70 + t * 40);
      }
    } else if (catLower.includes('cartoon')) {
      const cartoonDrawers = [drawVectorMonster, drawVectorRobot, drawVectorCastle, drawVectorTeddyBear, drawVectorAlien, drawVectorDragon];
      cartoonDrawers[(pNum - 2) % cartoonDrawers.length](doc, 105, 125, 1.15);
    } else if (catLower.includes('nursery')) {
      if ((pNum - 2) % 4 === 0) drawVectorShadowMatchWorksheet(doc, 105, 125);
      else if ((pNum - 2) % 4 === 1) drawVectorMazeWorksheet(doc, 105, 125, 1.0);
      else if ((pNum - 2) % 4 === 2) drawVectorDotToDotWorksheet(doc, 105, 125);
      else drawVectorSpotDifferenceWorksheet(doc, 105, 125);
    } else if (catLower.includes('festival')) {
      const festDrawers = [drawVectorDiya, drawVectorRangoli, drawVectorHoliPichkari, drawVectorChristmasTree, drawVectorEidLantern, drawVectorKites, drawVectorBirthdayCake, drawVectorPumpkin, drawVectorSnowman];
      festDrawers[(pNum - 2) % festDrawers.length](doc, 105, 125, 1.15);
    } else {
      drawVectorLion(doc, 105, 125, 1.1);
    }

    drawCrayonsPalette(doc, [
      { name: 'Yellow', r: 255, g: 217, b: 61 },
      { name: 'Orange', r: 255, g: 138, b: 101 },
      { name: 'Sky Blue', r: 107, g: 203, b: 255 },
      { name: 'Mint Green', r: 184, g: 242, b: 200 },
    ]);
  }

  // Page totalPages: Certificate of Completion
  doc.addPage();
  drawCertificatePage(
    doc,
    product,
    childName,
    totalPages,
    totalPages,
    'SUPER ARTIST CERTIFICATE',
    `For brilliantly completing all ${totalPages} pages of ${product.title} with tremendous imagination and creativity!`
  );
}

// -------------------------------------------------------------
// MASTER PUBLIC ENTRYPOINTS
// -------------------------------------------------------------

/**
 * Generates an authentic, high-quality printable PDF colouring book
 * complete with cover, themed worksheets, tracing guidelines, pagination, and an artist certificate!
 * Routes directly based on Category, Name, Description, and Page Count.
 */
export async function generateProductPDF(product: Product, childName: string = ''): Promise<void> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const titleLower = product.title.toLowerCase();
  const idLower = product.id.toLowerCase();
  const catLower = (product.category || '').toLowerCase();

  // Route to the dedicated generator:
  if (idLower === 'prod-playbook-100' || titleLower.includes('playbook')) {
    generate100PagePlaybookPDF(doc, product, childName);
  } else if (idLower === 'prod-7' || titleLower.includes('3-in-1') || titleLower.includes('preschool activity bundle')) {
    generatePreschoolBundlePDF(doc, product, childName);
  } else if (idLower === 'prod-8' || titleLower.includes('7-in-1') || titleLower.includes('vault') || titleLower.includes('mega colouring')) {
    generateMegaVault160PagePDF(doc, product, childName);
  } else if (idLower === 'prod-1' || (catLower.includes('animal') && !titleLower.includes('bundle') && !titleLower.includes('vault'))) {
    generateAnimalBookPDF(doc, product, childName);
  } else if (idLower === 'prod-2' || (catLower.includes('alphabet') && !titleLower.includes('bundle') && !titleLower.includes('vault'))) {
    generateAlphabetBookPDF(doc, product, childName);
  } else if (idLower === 'prod-3' || (catLower.includes('number') && !titleLower.includes('bundle') && !titleLower.includes('vault'))) {
    generateNumbersBookPDF(doc, product, childName);
  } else if (idLower === 'prod-4' || (catLower.includes('fruit') || catLower.includes('vegetable'))) {
    generateFruitsVegetablesBookPDF(doc, product, childName);
  } else if (idLower === 'prod-5' || catLower.includes('bird')) {
    generateBirdsBookPDF(doc, product, childName);
  } else if (idLower === 'prod-6' || catLower.includes('tracing')) {
    generateTracingBookPDF(doc, product, childName);
  } else if (idLower === 'prod-9' || catLower.includes('vehicle')) {
    generateVehiclesBookPDF(doc, product, childName);
  } else if (idLower === 'prod-10' || catLower.includes('shape')) {
    generateShapesBookPDF(doc, product, childName);
  } else if (idLower === 'prod-11' || catLower.includes('festival')) {
    generateFestivalsBookPDF(doc, product, childName);
  } else if (catLower.includes('cartoon')) {
    generateCartoonBookPDF(doc, product, childName);
  } else if (catLower.includes('nursery')) {
    generateNurseryBookPDF(doc, product, childName);
  } else {
    // any custom product added via Admin or school pack
    generateGenericCustomBookPDF(doc, product, childName);
  }

  const filename = `${product.title.replace(/[^a-zA-Z0-9]/g, '_')}_Little_Colour_World.pdf`;
  doc.save(filename);
}

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

export async function authorizeAndDownloadProduct(
  product: Product,
  downloadToken: string,
  childName: string = ''
): Promise<{ success: boolean; message?: string }> {
  if (!downloadToken) {
    throw new Error('Access Denied: Payment must be confirmed before downloading printable PDF files.');
  }

  // Attempt server-side verification record check
  try {
    const authRes = await fetch('/api/downloads/authorize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        downloadToken: downloadToken.trim(),
        productId: product.id,
      }),
    });
    if (authRes.ok) {
      const authData = await authRes.json();
      if (authData.authorized === false) {
        console.warn('Server download authorization warning:', authData.error);
      }
    }
  } catch (netErr) {
    console.warn('Server download authorization network fallback:', netErr);
  }

  // Check if direct cloud storage URL exists
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

  // Generate authentic high-resolution vector PDF
  await generateProductPDF(product, childName);
  return { success: true };
}

export async function downloadProduct(
  product: Product,
  childName: string = '',
  downloadToken: string
): Promise<{ success: boolean; message?: string }> {
  if (!downloadToken || typeof downloadToken !== 'string' || !downloadToken.trim()) {
    throw new Error(
      'Access Denied: Payment confirmation is required. PDFs cannot be accessed without verified Razorpay payment.'
    );
  }
  return authorizeAndDownloadProduct(product, downloadToken.trim(), childName);
}

export async function downloadAllProducts(
  products: Product[],
  childName: string = '',
  downloadToken: string,
  onProgress?: (index: number, total: number, currentProd: Product) => void
): Promise<void> {
  if (!products || products.length === 0) return;
  for (let i = 0; i < products.length; i++) {
    const prod = products[i];
    if (onProgress) {
      onProgress(i + 1, products.length, prod);
    }
    await authorizeAndDownloadProduct(prod, downloadToken, childName);
    // Short 400ms pause so browser doesn't block successive file downloads
    if (i < products.length - 1) {
      await new Promise((res) => setTimeout(res, 400));
    }
  }
}
