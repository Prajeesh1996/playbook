import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const distPath = path.join(__dirname, 'dist');

app.use(express.json());

// In-memory orders store
const dbOrders = new Map();
const dbEnquiries = [];

// Seed demo order
dbOrders.set('ord_demo_101', {
  id: 'ord_demo_101',
  orderNumber: 'LCW-98214',
  customerName: 'Priya Sharma',
  customerEmail: 'priya.sharma@example.com',
  customerPhone: '+91 98765 43210',
  totalAmountPaise: 9300,
  razorpayOrderId: 'order_test_928374291',
  razorpayPaymentId: 'pay_test_8839201948',
  status: 'paid',
  downloadToken: 'tok_demo_secure_884920',
  tokenExpiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
  items: [
    { productId: 'prod-1', title: 'Animal Colouring Book', pricePaise: 4900 },
    { productId: 'prod-2', title: 'My First ABC Colouring Book', pricePaise: 5900 },
  ],
  createdAt: new Date().toISOString(),
});

// API: Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    app: 'Little Colour World API',
    time: new Date().toISOString(),
    razorpayConfigured: Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET),
  });
});

// API: Create Razorpay Order
app.post('/api/orders/create', async (req, res) => {
  try {
    const { items, customer, couponCode } = req.body;

    if (!items || !items.length || !customer || !customer.email) {
      return res.status(400).json({ error: 'Missing required order fields.' });
    }

    let totalPaise = 0;
    const verifiedItems = items.map((item) => {
      const pricePaise = Math.round(Number(item.price) * 100);
      totalPaise += pricePaise;
      return {
        productId: item.productId,
        title: item.title,
        pricePaise,
      };
    });

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

    const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
    const razorpaySecret = process.env.RAZORPAY_KEY_SECRET;
    let razorpayOrderId = `order_test_${Date.now()}`;

    if (razorpayKeyId && razorpaySecret) {
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
        const rzpData = await rzpRes.json();
        razorpayOrderId = rzpData.id;
      }
    }

    const orderRecord = {
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
        razorpayKeyId: razorpayKeyId || process.env.VITE_RAZORPAY_KEY_ID || '',
      },
    });
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).json({ error: 'Failed to create order.' });
  }
});

// API: Check Razorpay Gateway configuration
app.get('/api/razorpay/config', (_req, res) => {
  const keyId = process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID || '';
  res.json({
    configured: Boolean(keyId),
    keyId: keyId,
  });
});

// API: Verify Razorpay Payment Signature
app.post('/api/orders/verify', (req, res) => {
  try {
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
    const order = dbOrders.get(orderId);

    if (!order) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    if (!razorpayPaymentId) {
      order.status = 'failed';
      return res.status(400).json({ error: 'Missing Razorpay payment ID. Payment confirmation required.' });
    }

    const razorpaySecret = process.env.RAZORPAY_KEY_SECRET;

    if (razorpaySecret) {
      if (!razorpaySignature) {
        order.status = 'failed';
        return res.status(400).json({ error: 'Razorpay signature is required for payment verification.' });
      }

      // Cryptographic HMAC SHA256 Signature Verification
      const hmac = crypto.createHmac('sha256', razorpaySecret);
      hmac.update(`${razorpayOrderId}|${razorpayPaymentId}`);
      const generatedSignature = hmac.digest('hex');

      if (generatedSignature !== razorpaySignature) {
        order.status = 'failed';
        return res.status(400).json({ error: 'Invalid payment signature. Verification failed.' });
      }
    }

    // Mark paid with verified payment ID
    order.status = 'paid';
    order.razorpayPaymentId = razorpayPaymentId;

    res.json({
      success: true,
      message: 'Payment verified successfully! Your printable PDF downloads are unlocked.',
      downloadToken: order.downloadToken,
      expiresAt: order.tokenExpiresAt,
    });
  } catch (err) {
    res.status(500).json({ error: 'Payment verification failed.' });
  }
});

// API: Verify download token before giving access to PDF (only share when paid)
app.get('/api/orders/verify-download/:token', (req, res) => {
  const token = req.params.token;
  let foundOrder;
  for (const [_, ord] of dbOrders.entries()) {
    if (ord.downloadToken === token) {
      foundOrder = ord;
      break;
    }
  }

  if (!foundOrder) {
    return res.status(404).json({ error: 'Order not found or invalid download token.' });
  }

  // STRICT SECURITY: Only share PDF if order is confirmed paid!
  if (foundOrder.status !== 'paid' || !foundOrder.razorpayPaymentId) {
    return res.status(403).json({
      error: 'Access denied: Payment has not been confirmed. PDFs cannot be shared without payment confirmation.',
      status: foundOrder.status,
    });
  }

  res.json({
    success: true,
    paid: true,
    orderNumber: foundOrder.orderNumber,
    items: foundOrder.items,
    razorpayPaymentId: foundOrder.razorpayPaymentId,
  });
});

// API: Razorpay Webhook Handler
app.post('/api/razorpay/webhook', (req, res) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const signature = req.headers['x-razorpay-signature'];

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
app.get('/api/orders/my-downloads', (req, res) => {
  const email = (req.query.email || '').toLowerCase().trim();
  if (!email) {
    return res.status(400).json({ error: 'Email parameter required.' });
  }

  const results = [];
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
app.post('/api/school-enquiry', (req, res) => {
  const enquiry = {
    id: `enq_${Date.now()}`,
    ...req.body,
    createdAt: new Date().toISOString(),
  };
  dbEnquiries.push(enquiry);
  res.json({ success: true, message: 'Enquiry submitted successfully.' });
});

// Serve frontend static build files from dist/
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));

  app.get('*', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  app.get('*', (_req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html>
        <head><title>Little Colour World</title></head>
        <body style="font-family: sans-serif; text-align: center; padding: 50px;">
          <h2>Little Colour World Server</h2>
          <p>The backend is active. Please run <code>npm run build</code> to generate the frontend assets in <code>dist/</code>.</p>
        </body>
      </html>
    `);
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
