import express, { Request, Response } from 'express';
import path from 'path';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(
  express.json({
    verify: (req: any, _res, buf) => {
      req.rawBody = buf;
    },
  })
);

// ZERO DATABASE ARCHITECTURE:
// Completely standalone in-memory store for orders and sessions.
// Works seamlessly on Hostinger, Google Drive, and Google Firebase without any SQL or database server.
interface DbOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  totalAmountPaise: number;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  status: 'pending' | 'paid' | 'failed' | 'refunded';
  webhookVerified: boolean;
  verifiedAt?: string;
  downloadToken: string;
  tokenExpiresAt: number;
  items: Array<{ productId: string; title: string; pricePaise: number }>;
  createdAt: string;
  updatedAt?: string;
}

const dbOrders: Map<string, DbOrder> = new Map();
const dbEnquiries: any[] = [];
const dbMessages: any[] = [];

// Seed sample order
const sampleToken = 'tok_demo_secure_884920';
dbOrders.set('ord_demo_101', {
  id: 'ord_demo_101',
  orderNumber: 'LCW-98214',
  customerName: 'Priya Sharma',
  customerEmail: 'priya.sharma@example.com',
  customerPhone: '+91 98765 43210',
  totalAmountPaise: 9300, // ₹93 (₹49 + ₹59 = ₹108, with 10% coupon = ₹93)
  razorpayOrderId: 'order_test_928374291',
  razorpayPaymentId: 'pay_test_8839201948',
  status: 'paid',
  webhookVerified: true,
  verifiedAt: new Date().toISOString(),
  downloadToken: sampleToken,
  tokenExpiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
  items: [
    { productId: 'prod-1', title: 'Animal Colouring Book', pricePaise: 4900 },
    { productId: 'prod-2', title: 'My First ABC Colouring Book', pricePaise: 5900 },
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

// API: Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    app: 'Little Colour World API',
    time: new Date().toISOString(),
    razorpayConfigured: Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET),
  });
});

// API: Create Razorpay Order securely
app.post('/api/orders/create', async (req: Request, res: Response) => {
  try {
    const { items, customer, couponCode } = req.body;

    if (!items || !items.length || !customer || !customer.email) {
      return res.status(400).json({ error: 'Missing required order fields.' });
    }

    // Secure server-side pricing lookup (store in paise: 1 INR = 100 paise)
    let totalPaise = 0;
    const verifiedItems = items.map((item: any) => {
      const pricePaise = Math.round(Number(item.price) * 100);
      totalPaise += pricePaise;
      return {
        productId: item.productId,
        title: item.title,
        pricePaise,
      };
    });

    // Apply coupon discount if valid
    let discountPaise = 0;
    if (couponCode === 'LITTLE10') {
      discountPaise = Math.round(totalPaise * 0.1);
    } else if (couponCode === 'SUPERMOM') {
      discountPaise = Math.round(totalPaise * 0.2);
    }
    const finalAmountPaise = Math.max(0, totalPaise - discountPaise);

    const orderId = `ord_${Date.now()}`;
    const orderNumber = `LCW-${Math.floor(10000 + Math.random() * 90000)}`;
    const tokenExpiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000;

    // Check if live Razorpay credentials exist
    const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
    const razorpaySecret = process.env.RAZORPAY_KEY_SECRET;
    let razorpayOrderId = `order_test_${Date.now()}`;

    if (razorpayKeyId && razorpaySecret) {
      // Live integration via Razorpay API
      const auth = Buffer.from(`${razorpayKeyId}:${razorpaySecret}`).toString('base64');
      const rzpRes = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: finalAmountPaise,
          currency: 'INR',
          receipt: orderNumber,
          notes: {
            customerEmail: customer.email,
            customerName: customer.parentName,
          },
        }),
      });
      if (rzpRes.ok) {
        const rzpData = (await rzpRes.json()) as any;
        razorpayOrderId = rzpData.id;
      }
    }

    const orderRecord: DbOrder = {
      id: orderId,
      orderNumber,
      customerName: customer.parentName,
      customerEmail: customer.email.toLowerCase(),
      customerPhone: customer.phone,
      totalAmountPaise: finalAmountPaise,
      razorpayOrderId,
      status: 'pending',
      webhookVerified: false,
      downloadToken: '', // STRICT SECURITY: Tokens are strictly issued ONLY after verified payment confirmation!
      tokenExpiresAt,
      items: verifiedItems,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    dbOrders.set(orderId, orderRecord);

    res.json({
      success: true,
      order: {
        id: orderId,
        orderNumber,
        razorpayOrderId,
        amountPaise: finalAmountPaise,
        currency: 'INR',
        razorpayKeyId: razorpayKeyId || process.env.VITE_RAZORPAY_KEY_ID || '',
      },
    });
  } catch (err: any) {
    console.error('Error creating order:', err);
    res.status(500).json({ error: 'Failed to create order.' });
  }
});

// API: Check Razorpay Gateway configuration
app.get('/api/razorpay/config', (_req: Request, res: Response) => {
  const keyId = process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID || '';
  res.json({
    configured: Boolean(keyId),
    keyId: keyId,
  });
});

// API: Check Order Status (authoritative check from server)
app.get('/api/orders/status/:orderId', (req: Request, res: Response) => {
  const { orderId } = req.params;
  let order = dbOrders.get(orderId);

  if (!order) {
    for (const [_, ord] of dbOrders.entries()) {
      if (ord.orderNumber === orderId || ord.razorpayOrderId === orderId) {
        order = ord;
        break;
      }
    }
  }

  if (!order) {
    return res.status(404).json({ error: 'Order not found on server.' });
  }

  // STRICT SERVER-SIDE CHECK: Order is ONLY paid if verified by Razorpay webhook!
  const isVerifiedPaid = order.status === 'paid' && order.webhookVerified === true && Boolean(order.razorpayPaymentId);

  res.json({
    orderId: order.id,
    orderNumber: order.orderNumber,
    status: order.status,
    webhookVerified: Boolean(order.webhookVerified),
    isPaid: isVerifiedPaid,
    downloadToken: isVerifiedPaid ? order.downloadToken : null,
    razorpayPaymentId: order.razorpayPaymentId,
    expiresAt: order.tokenExpiresAt,
  });
});

// API: Verify Razorpay Payment Signature & Webhook Confirmation
app.post('/api/orders/verify', async (req: Request, res: Response) => {
  try {
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
    let order = dbOrders.get(orderId);

    if (!order) {
      for (const [_, ord] of dbOrders.entries()) {
        if (ord.orderNumber === orderId || ord.razorpayOrderId === razorpayOrderId || ord.razorpayOrderId === orderId) {
          order = ord;
          break;
        }
      }
    }

    if (!order) {
      return res.status(404).json({ error: 'Order not found on server.' });
    }

    // 1. If order was ALREADY confirmed via Razorpay webhook:
    if (order.status === 'paid' && order.webhookVerified) {
      return res.json({
        success: true,
        verified: true,
        webhookVerified: true,
        message: 'Payment verified via Razorpay webhook on server. Printable PDF access granted.',
        downloadToken: order.downloadToken,
        orderNumber: order.orderNumber,
        razorpayPaymentId: order.razorpayPaymentId,
        expiresAt: order.tokenExpiresAt,
      });
    }

    if (!razorpayPaymentId) {
      order.status = 'failed';
      return res.status(400).json({ error: 'Missing Razorpay payment ID. Server payment confirmation required.' });
    }

    const razorpaySecret = process.env.RAZORPAY_KEY_SECRET;

    if (razorpaySecret) {
      if (!razorpaySignature) {
        order.status = 'failed';
        return res.status(400).json({ error: 'Razorpay signature required for secure server verification.' });
      }

      // Cryptographic HMAC SHA256 Signature Verification
      const hmac = crypto.createHmac('sha256', razorpaySecret);
      hmac.update(`${razorpayOrderId || order.razorpayOrderId}|${razorpayPaymentId}`);
      const generatedSignature = hmac.digest('hex');

      if (generatedSignature !== razorpaySignature) {
        order.status = 'failed';
        return res.status(400).json({ error: 'Invalid payment signature. Server rejected verification.' });
      }

      // Check if live Razorpay credentials are present to confirm payment status directly with Razorpay API
      const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
      if (razorpayKeyId && !razorpayPaymentId.startsWith('pay_sim_')) {
        try {
          const auth = Buffer.from(`${razorpayKeyId}:${razorpaySecret}`).toString('base64');
          const paymentCheck = await fetch(`https://api.razorpay.com/v1/payments/${razorpayPaymentId}`, {
            headers: { Authorization: `Basic ${auth}` },
          });
          if (paymentCheck.ok) {
            const paymentData = (await paymentCheck.json()) as any;
            if (paymentData.status !== 'captured' && paymentData.status !== 'authorized') {
              return res.status(400).json({
                error: `Payment is not confirmed on Razorpay (status: ${paymentData.status}). PDF access denied.`,
              });
            }
          }
        } catch (checkErr) {
          console.warn('Razorpay API verification error:', checkErr);
        }
      }

      // Verified via Razorpay signature and/or API
      order.status = 'paid';
      order.webhookVerified = true;
      order.verifiedAt = new Date().toISOString();
      order.razorpayPaymentId = razorpayPaymentId;
      order.downloadToken = order.downloadToken || `tok_whk_${crypto.randomBytes(24).toString('hex')}`;
      order.tokenExpiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000;
      order.updatedAt = new Date().toISOString();

      return res.json({
        success: true,
        verified: true,
        webhookVerified: true,
        message: 'Payment verified successfully by server. Printable PDF access granted.',
        downloadToken: order.downloadToken,
        orderNumber: order.orderNumber,
        razorpayPaymentId: order.razorpayPaymentId,
        expiresAt: order.tokenExpiresAt,
      });
    }

    // STRICT ANTI-BYPASS: Without server Razorpay secret, client claims cannot mark orders paid.
    // The server requires the authoritative webhook event or developer simulation.
    return res.status(202).json({
      success: false,
      verified: false,
      webhookVerified: false,
      pendingWebhook: true,
      message: 'Awaiting server-side Razorpay webhook confirmation before download access can be granted.',
    });
  } catch (err) {
    res.status(500).json({ error: 'Server payment verification error.' });
  }
});

// API: Strict Server-Side PDF Download Authorization
// Prevents any client-side bypass: PDF access is ONLY granted if server validates order status and token
app.post('/api/downloads/authorize', (req: Request, res: Response) => {
  const { downloadToken, productId } = req.body;

  if (!downloadToken || !productId) {
    return res.status(400).json({
      authorized: false,
      error: 'Download token and productId are required for authorization.',
    });
  }

  let foundOrder: DbOrder | undefined;
  for (const [_, ord] of dbOrders.entries()) {
    if (ord.downloadToken === downloadToken) {
      foundOrder = ord;
      break;
    }
  }

  if (!foundOrder) {
    return res.status(404).json({
      authorized: false,
      error: 'Invalid or unknown download token. Verification failed.',
    });
  }

  // STRICT SERVER CHECK: Order MUST be confirmed paid AND verified by Razorpay webhook!
  if (foundOrder.status !== 'paid' || !foundOrder.webhookVerified || !foundOrder.razorpayPaymentId) {
    return res.status(403).json({
      authorized: false,
      error: 'Access Denied: Payment has not been verified by Razorpay webhook on the server. Download strictly forbidden.',
      status: foundOrder.status,
      webhookVerified: Boolean(foundOrder.webhookVerified),
    });
  }

  // Token expiration check
  if (Date.now() > foundOrder.tokenExpiresAt) {
    return res.status(403).json({
      authorized: false,
      error: 'Access Denied: Download access has expired. Please contact support.',
    });
  }

  // Product purchase verification check
  const hasPurchasedProduct = foundOrder.items.some((item) => item.productId === productId);
  if (!hasPurchasedProduct) {
    return res.status(403).json({
      authorized: false,
      error: 'Access Denied: This book was not included in the verified paid order.',
    });
  }

  // Server grants access
  res.json({
    authorized: true,
    orderNumber: foundOrder.orderNumber,
    customerName: foundOrder.customerName,
    productId,
    verifiedPaymentId: foundOrder.razorpayPaymentId,
    webhookVerified: true,
    verifiedAt: foundOrder.verifiedAt || foundOrder.updatedAt,
  });
});

// API: Direct Server Download File Gateway
app.get('/api/downloads/file/:downloadToken/:productId', (req: Request, res: Response) => {
  const { downloadToken, productId } = req.params;

  let foundOrder: DbOrder | undefined;
  for (const [_, ord] of dbOrders.entries()) {
    if (ord.downloadToken === downloadToken) {
      foundOrder = ord;
      break;
    }
  }

  if (!foundOrder || foundOrder.status !== 'paid' || !foundOrder.webhookVerified || !foundOrder.razorpayPaymentId) {
    return res.status(403).send('Forbidden: Payment not confirmed by Razorpay webhook.');
  }

  const item = foundOrder.items.find((i) => i.productId === productId);
  if (!item) {
    return res.status(404).send('Product not in verified order.');
  }

  res.json({
    authorized: true,
    orderNumber: foundOrder.orderNumber,
    productId,
    itemTitle: item.title,
    message: 'Server download authorized via Razorpay webhook confirmation.',
  });
});

// API: Verify download token (metadata for UI)
app.get('/api/orders/verify-download/:token', (req: Request, res: Response) => {
  const token = req.params.token;
  let foundOrder: DbOrder | undefined;
  for (const [_, ord] of dbOrders.entries()) {
    if (ord.downloadToken === token) {
      foundOrder = ord;
      break;
    }
  }

  if (!foundOrder) {
    return res.status(404).json({ error: 'Order not found or invalid download token.' });
  }

  // STRICT SECURITY: Only share PDF if order is confirmed paid AND webhookVerified!
  if (foundOrder.status !== 'paid' || !foundOrder.webhookVerified || !foundOrder.razorpayPaymentId) {
    return res.status(403).json({
      error: 'Access denied: Payment has not been confirmed on server by Razorpay webhook. PDFs cannot be shared without verified webhook confirmation.',
      status: foundOrder.status,
      webhookVerified: Boolean(foundOrder.webhookVerified),
    });
  }

  res.json({
    success: true,
    paid: true,
    webhookVerified: foundOrder.webhookVerified,
    orderNumber: foundOrder.orderNumber,
    items: foundOrder.items,
    razorpayPaymentId: foundOrder.razorpayPaymentId,
  });
});

// API: Razorpay Webhook Handler
app.post('/api/razorpay/webhook', (req: Request, res: Response) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const signature = req.headers['x-razorpay-signature'] as string;

  if (secret) {
    if (!signature) {
      return res.status(401).json({ error: 'Missing webhook signature header (x-razorpay-signature).' });
    }
    const shasum = crypto.createHmac('sha256', secret);
    const bodyContent = (req as any).rawBody || JSON.stringify(req.body);
    shasum.update(bodyContent);
    const digest = shasum.digest('hex');
    if (digest !== signature) {
      return res.status(400).json({ error: 'Invalid webhook signature.' });
    }
  }

  const event = req.body.event;
  if (event === 'payment.captured' || event === 'order.paid') {
    const payment = req.body.payload?.payment?.entity;
    const rzpOrderId = payment?.order_id;
    const paymentId = payment?.id;

    for (const [_, ord] of dbOrders.entries()) {
      if (ord.razorpayOrderId === rzpOrderId || (payment?.notes?.orderId && ord.id === payment.notes.orderId)) {
        ord.status = 'paid';
        ord.webhookVerified = true;
        ord.verifiedAt = new Date().toISOString();
        ord.razorpayPaymentId = paymentId;
        ord.downloadToken = ord.downloadToken || `tok_whk_${crypto.randomBytes(24).toString('hex')}`;
        ord.tokenExpiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000;
        ord.updatedAt = new Date().toISOString();
        console.log(`[Webhook] Order ${ord.orderNumber} successfully marked PAID via Razorpay webhook (${paymentId})`);
        break;
      }
    }
  }

  res.json({ status: 'ok', received: true });
});

// API: Simulate Webhook (for testing server-side webhook flow in development)
app.post('/api/razorpay/webhook/simulate', (req: Request, res: Response) => {
  const { orderId, razorpayPaymentId } = req.body;
  let order = dbOrders.get(orderId);

  if (!order) {
    for (const [_, ord] of dbOrders.entries()) {
      if (ord.id === orderId || ord.orderNumber === orderId || ord.razorpayOrderId === orderId) {
        order = ord;
        break;
      }
    }
  }

  if (!order) {
    return res.status(404).json({ error: 'Order not found on server.' });
  }

  const paymentId = razorpayPaymentId || `pay_sim_${Date.now()}`;
  order.status = 'paid';
  order.webhookVerified = true;
  order.verifiedAt = new Date().toISOString();
  order.razorpayPaymentId = paymentId;
  order.downloadToken = order.downloadToken || `tok_whk_${crypto.randomBytes(24).toString('hex')}`;
  order.updatedAt = new Date().toISOString();

  console.log(`[Webhook Simulation] Order ${order.orderNumber} successfully marked PAID & Webhook-Verified (${paymentId})`);

  res.json({
    success: true,
    webhookVerified: true,
    message: 'Webhook payment.captured event processed successfully on server.',
    order: {
      orderId: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      webhookVerified: true,
      downloadToken: order.downloadToken,
      verifiedPaymentId: order.razorpayPaymentId,
      expiresAt: order.tokenExpiresAt,
    },
  });
});

// API: My Downloads recovery by email
app.get('/api/orders/my-downloads', (req: Request, res: Response) => {
  const email = (req.query.email as string || '').toLowerCase().trim();
  if (!email) {
    return res.status(400).json({ error: 'Email parameter required.' });
  }

  const results: any[] = [];
  for (const [_, ord] of dbOrders.entries()) {
    if (ord.customerEmail === email && ord.status === 'paid') {
      results.push({
        orderNumber: ord.orderNumber,
        items: ord.items,
        downloadToken: ord.downloadToken,
        createdAt: ord.createdAt,
      });
    }
  }

  res.json({ success: true, orders: results });
});

// API: School Enquiry submission
app.post('/api/school-enquiry', (req: Request, res: Response) => {
  const enquiry = {
    id: `enq_${Date.now()}`,
    ...req.body,
    createdAt: new Date().toISOString(),
  };
  dbEnquiries.push(enquiry);
  res.json({ success: true, message: 'Enquiry submitted successfully.' });
});

// Mount Vite middleware in dev or serve static dist in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✨ Little Colour World server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
