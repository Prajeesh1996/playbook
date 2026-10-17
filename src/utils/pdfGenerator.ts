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
 * Downloads printable PDF from Google Drive / Firebase if configured,
 * or generates the customized high-resolution vector PDF in-browser.
 */
export async function downloadProduct(product: Product, childName: string = ''): Promise<void> {
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
    return;
  }
  return generateProductPDF(product, childName);
}

