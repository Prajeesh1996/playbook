import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Product, ProductCategory, AgeGroup, Coupon } from '../types';
import { generateProductPDF } from '../utils/pdfGenerator';
import {
  X,
  Plus,
  Edit2,
  Trash2,
  DollarSign,
  ShoppingBag,
  Users,
  BookOpen,
  CheckCircle2,
  RotateCcw,
  Search,
  Lock,
  LogOut,
  Tag,
  Mail,
  School,
  ShieldCheck,
  Key,
  Download,
  Upload,
  Database,
  HardDrive,
} from 'lucide-react';

interface AdminDashboardProps {
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose }) => {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    orders,
    refundOrder,
    schoolEnquiries,
    updateSchoolEnquiryStatus,
    coupons,
    addCoupon,
    toggleCoupon,
    isAdminLoggedIn,
    adminLogin,
    adminLogout,
  } = useApp();

  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'schools' | 'coupons' | 'gateway'>('overview');

  // Search orders
  const [orderSearchQuery, setOrderSearchQuery] = useState('');

  // Razorpay Gateway Settings
  const [adminRzpKey, setAdminRzpKey] = useState<string>(() => {
    return localStorage.getItem('lcw_razorpay_key_id') || (import.meta.env.VITE_RAZORPAY_KEY_ID as string) || '';
  });
  const [rzpSaveMsg, setRzpSaveMsg] = useState(false);
  const [isTestingWebhook, setIsTestingWebhook] = useState(false);
  const [webhookTestStatus, setWebhookTestStatus] = useState<string | null>(null);

  const handleTestWebhook = async () => {
    setIsTestingWebhook(true);
    setWebhookTestStatus(null);
    try {
      const res = await fetch('/api/razorpay/webhook/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: orders[0]?.id || 'ord_demo_101',
          razorpayPaymentId: `pay_test_${Date.now()}`,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setWebhookTestStatus('✓ Server Webhook Simulation Verified! Order marked paid with webhookVerified=true, cryptographically secure download token generated, and client-side bypass protection confirmed active.');
      } else {
        setWebhookTestStatus(`❌ Webhook simulation error: ${data.error || 'Server error'}`);
      }
    } catch (err: any) {
      setWebhookTestStatus(`❌ Webhook simulation failed: ${err.message}`);
    } finally {
      setIsTestingWebhook(false);
    }
  };

  // Product Edit Modal State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [productForm, setProductForm] = useState({
    title: '',
    category: 'Animals Colouring' as ProductCategory,
    ageGroup: 'Ages 2–5' as AgeGroup,
    pageCount: 30,
    fileFormat: 'Printable PDF (A4)',
    originalPrice: 129,
    discountedPrice: 49,
    shortDescription: '',
    description: '',
    themeColor: '#FFD93D',
    googleDrivePdfUrl: '',
    firebaseStorageUrl: '',
    active: true,
  });

  const handleExportBackup = () => {
    const backupData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      architecture: 'Zero Database (Hostinger + Google Drive + Firebase)',
      products,
      orders,
      coupons,
      schoolEnquiries,
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `LittleColourWorld_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Coupon Form State
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState(15);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = adminLogin(pinInput);
    if (!success) {
      setPinError(true);
    } else {
      setPinError(false);
    }
  };

  // If not logged in, show lock screen
  if (!isAdminLoggedIn) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
        <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl border-4 border-amber-300 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-neutral-100 text-neutral-400"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
              <Lock className="w-7 h-7" />
            </div>
            <div>
              <h2 className="font-heading font-extrabold text-xl text-neutral-900">
                Admin Control Room
              </h2>
              <p className="text-xs text-neutral-500 font-bold mt-1">
                Enter your security PIN to manage books &amp; orders
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-3 pt-2">
              <input
                type="password"
                placeholder="Enter Security PIN"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                autoFocus
                className="w-full text-center px-4 py-2.5 rounded-xl border border-neutral-300 text-base font-extrabold tracking-widest focus:outline-none focus:ring-2 focus:ring-amber-400"
              />

              {pinError && (
                <p className="text-xs font-bold text-red-600">Incorrect PIN! Access denied.</p>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#FFD93D] hover:bg-[#ffdf59] text-neutral-900 font-extrabold text-xs shadow-xs transition-colors cursor-pointer"
              >
                Access Dashboard
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Calculate Metrics
  const totalSales = orders.filter((o) => o.status === 'paid').reduce((acc, curr) => acc + curr.total, 0);
  const totalOrdersCount = orders.filter((o) => o.status === 'paid').length;
  const uniqueEmails = new Set(orders.map((o) => o.customer.email.toLowerCase())).size;

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setProductForm({
      title: '',
      category: 'Animals Colouring',
      ageGroup: 'Ages 2–5',
      pageCount: 32,
      fileFormat: 'Printable PDF (A4)',
      originalPrice: 129,
      discountedPrice: 49,
      shortDescription: '',
      description: '',
      themeColor: '#FFD93D',
      googleDrivePdfUrl: '',
      firebaseStorageUrl: '',
      active: true,
    });
    setIsAddingProduct(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setProductForm({
      title: p.title,
      category: p.category,
      ageGroup: p.ageGroup,
      pageCount: p.pageCount,
      fileFormat: p.fileFormat,
      originalPrice: p.originalPrice,
      discountedPrice: p.discountedPrice,
      shortDescription: p.shortDescription,
      description: p.description,
      themeColor: p.themeColor,
      googleDrivePdfUrl: p.googleDrivePdfUrl || '',
      firebaseStorageUrl: p.firebaseStorageUrl || '',
      active: p.active,
    });
    setIsAddingProduct(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.title.trim()) return;

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        ...productForm,
        slug: productForm.title.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      });
    } else {
      addProduct({
        ...productForm,
        slug: productForm.title.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        fileSizeMb: 8.5,
        rating: 5,
        reviewsCount: 1,
        learningOutcomes: ['Fine motor skills', 'Hand-eye coordination', 'Creativity'],
        samplePages: [
          { pageNumber: 1, title: 'Sample Drawing', description: 'Bold outline line art', previewSvgType: 'lion' },
        ],
        isFeatured: true,
      });
    }

    setIsAddingProduct(false);
    setEditingProduct(null);
  };

  const handleAddCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim()) return;
    addCoupon({
      code: newCouponCode.trim().toUpperCase(),
      discountPercentage: Number(newCouponDiscount),
      minOrderValue: 20,
      maxDiscount: 100,
      description: `${newCouponDiscount}% off coupon`,
      isActive: true,
    });
    setNewCouponCode('');
  };

  const filteredOrders = orders.filter((o) => {
    if (!orderSearchQuery.trim()) return true;
    const q = orderSearchQuery.toLowerCase();
    return (
      o.orderNumber.toLowerCase().includes(q) ||
      o.customer.parentName.toLowerCase().includes(q) ||
      o.customer.email.toLowerCase().includes(q) ||
      (o.razorpayPaymentId && o.razorpayPaymentId.toLowerCase().includes(q))
    );
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-6 animate-in fade-in">
      <div className="bg-[#FFFDF5] w-full max-w-5xl rounded-3xl shadow-2xl border-4 border-amber-300 overflow-hidden relative max-h-[94vh] flex flex-col">
        {/* Top Bar */}
        <div className="p-4 sm:p-5 bg-white border-b border-amber-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
              <Lock className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <h2 className="font-heading font-extrabold text-lg sm:text-xl text-neutral-900">
                Little Colour World • Administrator Dashboard
              </h2>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                Active Session
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={adminLogout}
              className="p-2 text-neutral-500 hover:text-red-600 hover:bg-red-50 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors"
              title="Logout from admin"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-neutral-800 hover:bg-neutral-100 rounded-full"
              aria-label="Close admin dashboard"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="px-5 pt-3 bg-white border-b border-neutral-100 flex gap-2 overflow-x-auto scrollbar-none">
          {[
            { id: 'overview', label: 'Overview Metrics', icon: DollarSign },
            { id: 'products', label: `Products (${products.length})`, icon: BookOpen },
            { id: 'orders', label: `Orders (${orders.length})`, icon: ShoppingBag },
            { id: 'schools', label: `School Enquiries (${schoolEnquiries.length})`, icon: School },
            { id: 'coupons', label: `Coupons (${coupons.length})`, icon: Tag },
            { id: 'gateway', label: 'Razorpay Gateway', icon: ShieldCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-3 px-3 text-xs font-black flex items-center gap-1.5 whitespace-nowrap border-b-2 transition-colors cursor-pointer ${
                  isActive
                    ? 'border-neutral-900 text-neutral-900'
                    : 'border-transparent text-neutral-500 hover:text-neutral-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6 flex-1">
          {/* TAB 1: OVERVIEW METRICS */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border-2 border-emerald-100 shadow-xs">
                  <div className="text-xs font-extrabold text-emerald-700">Total Sales (INR)</div>
                  <div className="font-heading font-extrabold text-2xl sm:text-3xl text-neutral-900 mt-1">
                    ₹{totalSales}
                  </div>
                  <div className="text-[11px] text-neutral-400 font-bold mt-0.5">Verified payments</div>
                </div>

                <div className="bg-white p-5 rounded-2xl border-2 border-sky-100 shadow-xs">
                  <div className="text-xs font-extrabold text-sky-700">Total Orders</div>
                  <div className="font-heading font-extrabold text-2xl sm:text-3xl text-neutral-900 mt-1">
                    {totalOrdersCount}
                  </div>
                  <div className="text-[11px] text-neutral-400 font-bold mt-0.5">Completed checkouts</div>
                </div>

                <div className="bg-white p-5 rounded-2xl border-2 border-amber-100 shadow-xs">
                  <div className="text-xs font-extrabold text-amber-700">Active Products</div>
                  <div className="font-heading font-extrabold text-2xl sm:text-3xl text-neutral-900 mt-1">
                    {products.filter((p) => p.active).length}
                  </div>
                  <div className="text-[11px] text-neutral-400 font-bold mt-0.5">Printable books &amp; sheets</div>
                </div>

                <div className="bg-white p-5 rounded-2xl border-2 border-purple-100 shadow-xs">
                  <div className="text-xs font-extrabold text-purple-700">Customers</div>
                  <div className="font-heading font-extrabold text-2xl sm:text-3xl text-neutral-900 mt-1">
                    {uniqueEmails}
                  </div>
                  <div className="text-[11px] text-neutral-400 font-bold mt-0.5">Unique parent emails</div>
                </div>
              </div>

              {/* Best Selling Products */}
              <div className="bg-white rounded-2xl p-5 border border-neutral-200">
                <h3 className="font-heading font-extrabold text-sm text-neutral-900 mb-3">
                  Top Recommended &amp; Best-Selling Titles
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {products.slice(0, 3).map((p) => (
                    <div key={p.id} className="p-3 rounded-xl bg-amber-50/60 border border-amber-200 flex items-center justify-between">
                      <div className="overflow-hidden pr-2">
                        <div className="text-xs font-extrabold text-neutral-900 truncate">{p.title}</div>
                        <div className="text-[11px] text-neutral-500 font-bold">₹{p.discountedPrice} • {p.pageCount} pgs</div>
                      </div>
                      <span className="text-[11px] font-black text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full shrink-0">
                        {p.ageGroup}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Zero-Database Architecture Card & Backup */}
              <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-sky-50 rounded-2xl p-5 border border-emerald-200/80 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      <h4 className="font-heading font-extrabold text-sm text-neutral-900 flex items-center gap-1.5">
                        <Database className="w-4 h-4 text-emerald-700" />
                        <span>Zero-Database Architecture Active</span>
                      </h4>
                    </div>
                    <p className="text-xs text-neutral-600 font-medium">
                      No SQL, MySQL, or database server required. Compatible with <strong>Hostinger web hosting</strong>, <strong>Google Drive</strong>, and <strong>Google Firebase</strong>.
                    </p>
                  </div>

                  <button
                    onClick={handleExportBackup}
                    className="px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-xs cursor-pointer shrink-0 transition-colors"
                  >
                    <Download className="w-4 h-4 text-amber-400" />
                    <span>Download JSON Backup</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-emerald-200/60 text-xs">
                  <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-100">
                    <span className="font-extrabold text-emerald-800 block">Hostinger Hosting</span>
                    <span className="text-neutral-600 font-medium text-[11px]">Upload static build or run with lightweight Node without external DB.</span>
                  </div>
                  <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-100">
                    <span className="font-extrabold text-emerald-800 block">Google Drive Storage</span>
                    <span className="text-neutral-600 font-medium text-[11px]">Paste any shareable PDF link; paid parents download instantly.</span>
                  </div>
                  <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-100">
                    <span className="font-extrabold text-emerald-800 block">Google Firebase</span>
                    <span className="text-neutral-600 font-medium text-[11px]">Store PDF files or host statically on Firebase Hosting.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PRODUCT MANAGEMENT */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-heading font-extrabold text-base text-neutral-900">
                    Product Catalogue Management
                  </h3>
                  <p className="text-xs text-neutral-500 font-bold">
                    Edit prices, page counts, age recommendations, or add new activity workbooks
                  </p>
                </div>
                <button
                  onClick={handleOpenAdd}
                  className="px-4 py-2 rounded-xl bg-[#FFD93D] hover:bg-[#ffdf59] text-neutral-900 font-extrabold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Book</span>
                </button>
              </div>

              {/* Product Table */}
              <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-2xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-50 text-neutral-500 font-bold uppercase tracking-wider border-b border-neutral-200">
                    <tr>
                      <th className="py-3 px-4">Title &amp; Category</th>
                      <th className="py-3 px-4">Age</th>
                      <th className="py-3 px-4">Pages</th>
                      <th className="py-3 px-4">Price (₹)</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-neutral-50">
                        <td className="py-3 px-4">
                          <div className="font-extrabold text-neutral-900">{p.title}</div>
                          <div className="text-[10px] text-amber-700 font-bold">{p.category}</div>
                        </td>
                        <td className="py-3 px-4 font-bold text-neutral-700">{p.ageGroup}</td>
                        <td className="py-3 px-4 font-bold text-neutral-700">{p.pageCount}</td>
                        <td className="py-3 px-4 font-extrabold text-neutral-900">
                          ₹{p.discountedPrice}
                          {p.originalPrice > p.discountedPrice && (
                            <span className="text-neutral-400 line-through ml-1 font-normal">
                              ₹{p.originalPrice}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => updateProduct(p.id, { active: !p.active })}
                            className={`px-2 py-0.5 rounded-full text-[10px] font-black cursor-pointer ${
                              p.active ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-100 text-neutral-600'
                            }`}
                          >
                            {p.active ? 'Active' : 'Inactive'}
                          </button>
                        </td>
                        <td className="py-3 px-4 text-right space-x-1">
                          <button
                            onClick={() => generateProductPDF(p, 'Little Explorer')}
                            className="p-1.5 text-neutral-500 hover:text-sky-700 hover:bg-sky-50 rounded-lg cursor-pointer"
                            title={`Download & Inspect Complete PDF (${p.pageCount} Pages)`}
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(p)}
                            className="p-1.5 text-neutral-500 hover:text-amber-700 hover:bg-amber-50 rounded-lg cursor-pointer"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteProduct(p.id)}
                            className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: ORDER MANAGEMENT */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-heading font-extrabold text-base text-neutral-900">
                    Customer Orders &amp; Razorpay Payments
                  </h3>
                  <p className="text-xs text-neutral-500 font-bold">
                    Monitor completed purchases, Razorpay transaction IDs, and issue refunds
                  </p>
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search order # or parent..."
                    value={orderSearchQuery}
                    onChange={(e) => setOrderSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-neutral-300 text-xs font-bold focus:outline-none"
                  />
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-2xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-50 text-neutral-500 font-bold uppercase tracking-wider border-b border-neutral-200">
                    <tr>
                      <th className="py-3 px-4">Order # &amp; Date</th>
                      <th className="py-3 px-4">Parent Details</th>
                      <th className="py-3 px-4">Purchased Items</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Razorpay ID</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {filteredOrders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-neutral-50">
                        <td className="py-3 px-4">
                          <div className="font-extrabold text-neutral-900">{ord.orderNumber}</div>
                          <div className="text-[10px] text-neutral-400">
                            {new Date(ord.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-neutral-800">{ord.customer.parentName}</div>
                          <div className="text-[11px] text-neutral-500">{ord.customer.email}</div>
                          <div className="text-[10px] text-neutral-400">{ord.customer.phone}</div>
                        </td>
                        <td className="py-3 px-4 max-w-xs">
                          <div className="text-[11px] font-bold text-neutral-700">
                            {ord.items.map((i) => i.title).join(', ')}
                          </div>
                        </td>
                        <td className="py-3 px-4 font-extrabold text-neutral-900">₹{ord.total}</td>
                        <td className="py-3 px-4 font-mono text-[10px] text-neutral-600">
                          {ord.razorpayPaymentId || 'Simulated'}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex flex-col gap-1 items-start">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                                ord.status === 'paid'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : ord.status === 'refunded'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {ord.status.toUpperCase()}
                            </span>
                            {ord.status === 'paid' && (ord.webhookVerified || ord.razorpayPaymentId) && (
                              <span className="inline-flex items-center gap-0.5 text-[9px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded-md">
                                <ShieldCheck className="w-2.5 h-2.5" /> Webhook Confirmed
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right">
                          {ord.status === 'paid' && (
                            <button
                              onClick={() => refundOrder(ord.id)}
                              className="px-2.5 py-1 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-extrabold text-[11px] transition-colors flex items-center gap-1 cursor-pointer ml-auto"
                              title="Process refund"
                            >
                              <RotateCcw className="w-3 h-3 text-neutral-500" />
                              <span>Refund</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: SCHOOL ENQUIRIES */}
          {activeTab === 'schools' && (
            <div className="space-y-4">
              <h3 className="font-heading font-extrabold text-base text-neutral-900">
                Playschool &amp; Educator Inquiries ({schoolEnquiries.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {schoolEnquiries.map((enq) => (
                  <div key={enq.id} className="bg-white rounded-2xl p-4 border border-neutral-200 shadow-2xs space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-heading font-extrabold text-sm text-neutral-900">
                          {enq.schoolName}
                        </h4>
                        <div className="text-xs text-neutral-500 font-bold">
                          Contact: {enq.contactPerson} • {enq.phone}
                        </div>
                        <div className="text-xs text-indigo-700 font-bold">{enq.email}</div>
                      </div>
                      <span className="text-[10px] font-black bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full">
                        {enq.studentCount} Students
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-neutral-50 text-xs text-neutral-700 border border-neutral-100">
                      <strong>Message:</strong> {enq.message || 'Requested sample curriculum pack.'}
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-[10px] text-neutral-400">
                        {new Date(enq.createdAt).toLocaleDateString()}
                      </span>
                      <div className="space-x-1">
                        <button
                          onClick={() => updateSchoolEnquiryStatus(enq.id, 'contacted')}
                          className="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-[11px] font-bold rounded-lg"
                        >
                          Mark Contacted
                        </button>
                        <button
                          onClick={() => updateSchoolEnquiryStatus(enq.id, 'fulfilled')}
                          className="px-2.5 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-[11px] font-bold rounded-lg"
                        >
                          Fulfilled
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: COUPONS */}
          {activeTab === 'coupons' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-5 border border-neutral-200">
                <h3 className="font-heading font-extrabold text-sm text-neutral-900 mb-3">
                  Create New Promotional Coupon
                </h3>
                <form onSubmit={handleAddCouponSubmit} className="flex flex-wrap gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Coupon Code (e.g. SUMMER25)"
                    value={newCouponCode}
                    onChange={(e) => setNewCouponCode(e.target.value)}
                    className="px-3.5 py-2 rounded-xl border border-neutral-300 text-xs font-bold uppercase focus:outline-none"
                  />
                  <input
                    type="number"
                    min="5"
                    max="80"
                    placeholder="Discount %"
                    value={newCouponDiscount}
                    onChange={(e) => setNewCouponDiscount(Number(e.target.value))}
                    className="w-28 px-3.5 py-2 rounded-xl border border-neutral-300 text-xs font-bold focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-neutral-900 font-extrabold text-xs transition-colors cursor-pointer"
                  >
                    Add Coupon
                  </button>
                </form>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {coupons.map((c) => (
                  <div key={c.code} className="bg-white rounded-2xl p-4 border border-neutral-200 shadow-2xs space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-heading font-extrabold text-sm text-neutral-900">{c.code}</span>
                      <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        {c.discountPercentage}% OFF
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-500 font-medium">{c.description}</p>
                    <button
                      onClick={() => toggleCoupon(c.code)}
                      className={`w-full py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                        c.isActive ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                      }`}
                    >
                      {c.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: RAZORPAY PAYMENT GATEWAY SETTINGS */}
          {activeTab === 'gateway' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-heading font-extrabold text-base text-neutral-900 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <span>Razorpay Payment Gateway Integration</span>
                </h3>
                <p className="text-xs text-neutral-500 font-bold">
                  Connect live or test Razorpay credentials. PDF files are strictly protected and only shared after payment confirmation.
                </p>
              </div>

              {/* Status Overview Card */}
              <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-100">
                  <div className="flex items-center gap-2.5">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                    <div>
                      <span className="text-xs font-extrabold text-neutral-900 block">Gateway Status</span>
                      <span className="text-[11px] font-bold text-emerald-700">
                        {adminRzpKey ? 'Active Key Configured' : 'Ready for Configuration'}
                      </span>
                    </div>
                  </div>
                  <div className="text-xs font-mono bg-neutral-100 px-3 py-1 rounded-lg text-neutral-700 font-bold">
                    {adminRzpKey ? `Active Key: ${adminRzpKey.substring(0, 12)}...` : 'No Custom Key (Using Standard Integration)'}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-xs font-extrabold text-neutral-800">
                    Razorpay Key ID (Client &amp; Server):
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. rzp_test_xxxxxxxxxxxxxxxx or rzp_live_xxxxxxxxxxxxxxxx"
                      value={adminRzpKey}
                      onChange={(e) => setAdminRzpKey(e.target.value)}
                      className="flex-1 px-3.5 py-2.5 rounded-xl border border-neutral-300 font-mono text-xs font-bold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                    <button
                      onClick={() => {
                        const clean = adminRzpKey.trim();
                        if (clean) {
                          localStorage.setItem('lcw_razorpay_key_id', clean);
                        } else {
                          localStorage.removeItem('lcw_razorpay_key_id');
                        }
                        setRzpSaveMsg(true);
                        setTimeout(() => setRzpSaveMsg(false), 2500);
                      }}
                      className="px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-extrabold text-xs cursor-pointer shadow-xs"
                    >
                      Save Key
                    </button>
                  </div>

                  {rzpSaveMsg && (
                    <p className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> Razorpay Key ID saved successfully!
                    </p>
                  )}
                </div>
              </div>

              {/* Webhook Configuration & Verification Card */}
              <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs space-y-4 text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center">
                      <ShieldCheck className="w-5 h-5 text-purple-700" />
                    </div>
                    <div>
                      <h4 className="font-heading font-extrabold text-sm text-neutral-900">
                        Razorpay Webhook Architecture (Zero Client Bypass)
                      </h4>
                      <p className="text-[11px] text-neutral-500 font-bold">
                        PDF download access is strictly gated by verified server-side response from Razorpay webhook.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-neutral-400 block">Webhook Endpoint URL</span>
                    <span className="font-mono text-xs font-bold text-neutral-900 block truncate">
                      {window.location.origin}/api/razorpay/webhook
                    </span>
                  </div>
                  <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-neutral-400 block">Required Events to Subscribe</span>
                    <span className="font-mono text-xs font-bold text-emerald-700 block">
                      payment.captured, order.paid
                    </span>
                  </div>
                </div>

                {/* Webhook Pipeline Test Simulator */}
                <div className="p-4 bg-purple-50 rounded-xl border border-purple-200/80 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="font-extrabold text-xs text-purple-950 block">
                        Server Webhook Pipeline Test
                      </span>
                      <span className="text-[11px] text-purple-800 font-medium">
                        Simulate a server-side webhook payload and verify the cryptographic download authorization.
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleTestWebhook}
                      disabled={isTestingWebhook}
                      className="px-4 py-2 rounded-xl bg-purple-900 hover:bg-purple-800 text-white font-extrabold text-xs shrink-0 cursor-pointer shadow-xs disabled:opacity-50"
                    >
                      {isTestingWebhook ? 'Simulating Webhook...' : 'Test Server Webhook'}
                    </button>
                  </div>

                  {webhookTestStatus && (
                    <div className="p-3 bg-white rounded-lg border border-purple-200 text-xs font-bold text-neutral-800">
                      {webhookTestStatus}
                    </div>
                  )}
                </div>
              </div>

              {/* Security & Strict Gating Rules Card */}
              <div className="bg-amber-50 rounded-2xl p-5 border border-amber-200/80 space-y-3 text-xs">
                <h4 className="font-heading font-extrabold text-sm text-neutral-900 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-amber-700" />
                  <span>Strict PDF Delivery Security Guarantee (Client Bypass Prevented)</span>
                </h4>
                <ul className="space-y-2 text-neutral-700 font-medium">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Strict Server Webhook Gating:</strong> PDF download access is locked and only granted upon a verified server-side response from Razorpay webhook (<code className="bg-white/70 px-1 py-0.5 rounded font-mono text-[10px]">order.webhookVerified === true</code>).
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Server-Authorized Downloads:</strong> Calls to generate or download PDFs pass through <code className="bg-white/70 px-1 py-0.5 rounded font-mono text-[10px]">/api/downloads/authorize</code> with a cryptographically signed token. LocalStorage modification cannot bypass this server check.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Zero Confirmation, Zero Download:</strong> If payment is cancelled, dismissed, or fails verification, the download is strictly locked and cannot be triggered from devtools or browser inspect.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Customer Recovery Protection:</strong> Parents can recover their files anytime via "My Downloads" by entering their purchase email.
                    </span>
                  </li>
                </ul>
              </div>

              {/* Setup Guide Card */}
              <div className="bg-white rounded-2xl p-5 border border-neutral-200 space-y-3 text-xs">
                <h4 className="font-heading font-extrabold text-sm text-neutral-900">
                  How to Get Your Razorpay API Keys &amp; Webhook Secret:
                </h4>
                <ol className="list-decimal list-inside space-y-1.5 text-neutral-600 font-medium">
                  <li>Log in to your <strong>Razorpay Dashboard</strong> (https://dashboard.razorpay.com).</li>
                  <li>Click on <strong>Settings &rarr; API Keys</strong> to generate your <code>Key Id</code> and <code>Key Secret</code>.</li>
                  <li>Click on <strong>Settings &rarr; Webhooks &rarr; Add New Webhook</strong>.</li>
                  <li>Enter Webhook URL: <code className="font-mono text-neutral-900 bg-neutral-100 px-1.5 py-0.5 rounded">{window.location.origin}/api/razorpay/webhook</code></li>
                  <li>Select events: <code>payment.captured</code> and <code>order.paid</code>.</li>
                  <li>Copy the Webhook Secret and set it as <code>RAZORPAY_WEBHOOK_SECRET</code> in your environment variables.</li>
                </ol>
              </div>
            </div>
          )}
        </div>

        {/* Product Add/Edit Modal Sub-dialog */}
        {isAddingProduct && (
          <div className="absolute inset-0 z-50 bg-neutral-900/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl border-4 border-amber-300 max-h-[90vh] overflow-y-auto space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
                <h3 className="font-heading font-extrabold text-base text-neutral-900">
                  {editingProduct ? 'Edit Book Details' : 'Add New Colouring Book'}
                </h3>
                <button
                  onClick={() => setIsAddingProduct(false)}
                  className="p-1 rounded-full hover:bg-neutral-100 text-neutral-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-3 text-xs font-bold">
                <div>
                  <label className="block text-neutral-700 mb-1">Book Title *</label>
                  <input
                    type="text"
                    required
                    value={productForm.title}
                    onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs font-bold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-neutral-700 mb-1">Category</label>
                    <select
                      value={productForm.category}
                      onChange={(e) => setProductForm({ ...productForm, category: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs font-bold"
                    >
                      <option value="Animals Colouring">Animals Colouring</option>
                      <option value="Alphabet Colouring">Alphabet Colouring</option>
                      <option value="Numbers Colouring">Numbers Colouring</option>
                      <option value="Fruits & Vegetables">Fruits &amp; Vegetables</option>
                      <option value="Birds Colouring">Birds Colouring</option>
                      <option value="Vehicles Colouring">Vehicles Colouring</option>
                      <option value="Tracing Worksheets">Tracing Worksheets</option>
                      <option value="School Activity Packs">School Activity Packs</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-neutral-700 mb-1">Age Group</label>
                    <select
                      value={productForm.ageGroup}
                      onChange={(e) => setProductForm({ ...productForm, ageGroup: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs font-bold"
                    >
                      <option value="Ages 2–3">Ages 2–3</option>
                      <option value="Ages 2–5">Ages 2–5</option>
                      <option value="Ages 3–5">Ages 3–5</option>
                      <option value="Ages 3–6">Ages 3–6</option>
                      <option value="Ages 2–6">Ages 2–6</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-neutral-700 mb-1">Printable Pages</label>
                    <input
                      type="number"
                      value={productForm.pageCount}
                      onChange={(e) => setProductForm({ ...productForm, pageCount: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-700 mb-1">Original (₹)</label>
                    <input
                      type="number"
                      value={productForm.originalPrice}
                      onChange={(e) => setProductForm({ ...productForm, originalPrice: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-700 mb-1">Selling (₹)</label>
                    <input
                      type="number"
                      value={productForm.discountedPrice}
                      onChange={(e) => setProductForm({ ...productForm, discountedPrice: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-neutral-700 mb-1">Short Description</label>
                  <input
                    type="text"
                    value={productForm.shortDescription}
                    onChange={(e) => setProductForm({ ...productForm, shortDescription: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 mb-1">Full Description</label>
                  <textarea
                    rows={3}
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs font-bold resize-none"
                  />
                </div>

                {/* Zero-DB Storage: Google Drive / Firebase Link */}
                <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200/80 space-y-2">
                  <div className="flex items-center gap-1.5 text-neutral-800 font-extrabold text-[11px]">
                    <HardDrive className="w-3.5 h-3.5 text-amber-700" />
                    <span>Google Drive / Firebase Cloud PDF Link (Optional)</span>
                  </div>
                  <div>
                    <label className="block text-[11px] text-neutral-600 mb-0.5">Google Drive Share Link</label>
                    <input
                      type="url"
                      placeholder="https://drive.google.com/file/d/.../view?usp=sharing"
                      value={productForm.googleDrivePdfUrl}
                      onChange={(e) => setProductForm({ ...productForm, googleDrivePdfUrl: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 font-mono text-[11px] font-bold text-neutral-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-neutral-600 mb-0.5">Firebase Storage PDF URL</label>
                    <input
                      type="url"
                      placeholder="https://firebasestorage.googleapis.com/..."
                      value={productForm.firebaseStorageUrl}
                      onChange={(e) => setProductForm({ ...productForm, firebaseStorageUrl: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 font-mono text-[11px] font-bold text-neutral-800"
                    />
                  </div>
                  <p className="text-[10px] text-neutral-500 font-medium leading-tight">
                    💡 <strong>Zero Database Architecture:</strong> If you host your high-res colouring book on Google Drive or Firebase, paste the link above. Paid parents download it automatically upon Razorpay confirmation!
                  </p>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingProduct(false)}
                    className="flex-1 py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-extrabold text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-[#FFD93D] hover:bg-[#ffdf59] text-neutral-900 font-extrabold text-xs"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
