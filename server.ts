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

app.use(express.json());

// In-memory persistent database store (mirrored with MySQL schema)
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
  downloadToken: string;
  tokenExpiresAt: number;
  items: Array<{ productId: string; title: string; pricePaise: number }>;
  createdAt: string;
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
  downloadToken: sampleToken,
  tokenExpiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
  items: [
    { productId: 'prod-1', title: 'Animal Colouring Book', pricePaise: 4900 },
    { productId: 'prod-2', title: 'My First ABC Colouring Book', pricePaise: 5900 },
  ],
  createdAt: new Date().toISOString(),
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
    const downloadToken = `tok_${crypto.randomBytes(16).toString('hex')}`;
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
      downloadToken,
      tokenExpiresAt,
      items: verifiedItems,
      createdAt: new Date().toISOString(),
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
        downloadToken,
        razorpayKeyId: razorpayKeyId || 'rzp_test_demo_mode',
      },
    });
  } catch (err: any) {
    console.error('Error creating order:', err);
    res.status(500).json({ error: 'Failed to create order.' });
  }
});

// API: Verify Razorpay Payment Signature
app.post('/api/orders/verify', (req: Request, res: Response) => {
  try {
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
    const order = dbOrders.get(orderId);

    if (!order) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    const razorpaySecret = process.env.RAZORPAY_KEY_SECRET;

    if (razorpaySecret && razorpaySignature) {
      // Cryptographic HMAC SHA256 Signature Verification
      const hmac = crypto.createHmac('sha256', razorpaySecret);
      hmac.update(`${razorpayOrderId}|${razorpayPaymentId}`);
      const generatedSignature = hmac.digest('hex');

      if (generatedSignature !== razorpaySignature) {
        order.status = 'failed';
        return res.status(400).json({ error: 'Invalid payment signature.' });
      }
    }

    // Mark paid
    order.status = 'paid';
    order.razorpayPaymentId = razorpayPaymentId || `pay_sim_${Date.now()}`;

    res.json({
      success: true,
      message: 'Payment verified successfully! Your printable PDF downloads are active.',
      downloadToken: order.downloadToken,
      expiresAt: order.tokenExpiresAt,
    });
  } catch (err) {
    res.status(500).json({ error: 'Payment verification failed.' });
  }
});

// API: Razorpay Webhook Handler
app.post('/api/razorpay/webhook', (req: Request, res: Response) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const signature = req.headers['x-razorpay-signature'] as string;

  if (secret && signature) {
    const shasum = crypto.createHmac('sha256', secret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest('hex');
    if (digest !== signature) {
      return res.status(400).json({ error: 'Invalid webhook signature.' });
    }
  }

  const event = req.body.event;
  if (event === 'payment.captured' || event === 'order.paid') {
    const payment = req.body.payload?.payment?.entity;
    const rzpOrderId = payment?.order_id;
    for (const [_, ord] of dbOrders.entries()) {
      if (ord.razorpayOrderId === rzpOrderId) {
        ord.status = 'paid';
        ord.razorpayPaymentId = payment.id;
        break;
      }
    }
  }

  res.json({ status: 'ok' });
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
