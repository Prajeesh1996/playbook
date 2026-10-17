export type AgeGroup =
  | 'Ages 2–3'
  | 'Ages 3–4'
  | 'Ages 4–5'
  | 'Ages 5–6'
  | 'Ages 2–4'
  | 'Ages 2–5'
  | 'Ages 3–5'
  | 'Ages 3–6'
  | 'Ages 2–6'
  | 'All Ages';

export type ProductCategory =
  | 'Animals Colouring'
  | 'Alphabet Colouring'
  | 'Numbers Colouring'
  | 'Fruits & Vegetables'
  | 'Birds Colouring'
  | 'Vehicles Colouring'
  | 'Cartoon Colouring'
  | 'Shapes & Colours'
  | 'Tracing Worksheets'
  | 'Nursery Activities'
  | 'Festivals & Celebrations'
  | 'School Activity Packs';

export interface SamplePage {
  pageNumber: number;
  title: string;
  description: string;
  previewSvgType: 'lion' | 'elephant' | 'alphabet' | 'numbers' | 'fruits' | 'shapes' | 'vehicle' | 'mandala' | 'dino' | 'butterfly';
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  category: ProductCategory;
  ageGroup: AgeGroup;
  pageCount: number;
  fileFormat: string; // 'Printable PDF (A4 / Letter)'
  fileSizeMb: number;
  originalPrice: number; // in ₹ (INR)
  discountedPrice: number; // in ₹ (INR)
  rating: number;
  reviewsCount: number;
  description: string;
  shortDescription: string;
  learningOutcomes: string[];
  samplePages: SamplePage[];
  isFeatured: boolean;
  isFree?: boolean;
  isBestSeller?: boolean;
  themeColor: string; // Hex color for card accent
  badgeText?: string;
  googleDrivePdfUrl?: string; // Optional Google Drive shareable link for printable PDF
  firebaseStorageUrl?: string; // Optional Google Firebase storage link
  active: boolean;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  addedAt: number;
}

export interface CustomerDetails {
  parentName: string;
  email: string;
  phone: string;
}

export interface OrderItem {
  productId: string;
  title: string;
  price: number; // in ₹
  originalPrice: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: CustomerDetails;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  total: number;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  status: 'pending' | 'paid' | 'failed' | 'refunded';
  webhookVerified?: boolean;
  verifiedAt?: string;
  downloadToken: string;
  tokenExpiresAt: string;
  createdAt: string;
}

export interface SchoolEnquiry {
  id: string;
  schoolName: string;
  contactPerson: string;
  email: string;
  phone: string;
  studentCount: string;
  gradeLevel: string;
  message: string;
  status: 'new' | 'contacted' | 'fulfilled';
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: string;
}

export interface Coupon {
  code: string;
  discountPercentage: number;
  minOrderValue: number; // in ₹
  maxDiscount: number; // in ₹
  description: string;
  isActive: boolean;
}
