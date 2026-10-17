# Little Colour World – Hostinger Production Deployment Guide 🚀
*Little Hands, Big Imagination! 🌈*

This guide walks you step-by-step through setting up, testing locally, and deploying **Little Colour World** to **Hostinger** (hPanel Node.js Application Manager, Hostinger Cloud, or Hostinger VPS) with **MySQL** and **Razorpay**.

---

## 1. Local Prerequisites & Testing

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Configure Environment Variables
Copy the `.env.example` file to `.env`:
```bash
cp .env.example .env
```
Fill in your Razorpay test credentials from your [Razorpay Dashboard](https://dashboard.razorpay.com/):
```env
PORT=3000
APP_URL=http://localhost:3000

# Razorpay Test Credentials
RAZORPAY_KEY_ID="rzp_test_YourTestKeyHere"
RAZORPAY_KEY_SECRET="YourTestSecretHere"
RAZORPAY_WEBHOOK_SECRET="YourWebhookSecretHere"

# MySQL Database (For Production or Local MySQL)
DB_HOST="localhost"
DB_PORT=3306
DB_USER="root"
DB_PASSWORD=""
DB_NAME="little_colour_world"
```

### Step 3: Setting Up MySQL Database Locally
1. Open your MySQL client (e.g. phpMyAdmin, MySQL Workbench, or CLI).
2. Execute the schema script located at:
   ```bash
   mysql -u root -p < database/schema.sql
   ```
3. This creates all 16 required tables:
   `users`, `admins`, `categories`, `products`, `product_files`, `product_images`, `orders`, `order_items`, `payments`, `download_tokens`, `coupons`, `coupon_redemptions`, `school_enquiries`, `contact_messages`, `site_settings`, `webhook_events`.

### Step 4: Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to browse and test.

---

## 2. Testing Razorpay in Test Mode

1. In `src/components/CheckoutModal.tsx` and `server.ts`, the app is configured to seamlessly run in test mode when test keys (`rzp_test_*`) are present, or in full simulation mode if keys are blank.
2. Select any colouring book (e.g., *Animal Colouring Book* for ₹29).
3. Proceed to checkout, enter Parent Name, Email, and Phone number.
4. Click **Pay & Unlock Instant Downloads**.
5. The payment confirmation will trigger:
   - Server registers order as `paid`.
   - Confetti celebration launches.
   - You can download your test PDF immediately with the child's name on the cover and the Super Artist Certificate!
   - Recover the purchase anytime using the **My Downloads** button with your email.

---

## 3. Deploying to Hostinger

Hostinger supports Node.js applications on:
1. **Hostinger Business Web Hosting / Cloud Hosting** (via **Setup Node.js App** in hPanel).
2. **Hostinger VPS** (using PM2 + Nginx reverse proxy).

### Option A: Hostinger hPanel (Business & Cloud Shared Plans)

#### 1. Build the Frontend Production Bundle
On your local machine or CI/CD:
```bash
npm run build
```
This outputs compiled production assets into the `dist/` directory.

#### 2. Create the MySQL Database in Hostinger
1. Log in to your **Hostinger hPanel**.
2. Go to **Databases** → **MySQL Databases**.
3. Create a new database:
   - Database Name: `u123456789_lcw`
   - Database User: `u123456789_admin`
   - Database Password: `YourStrongPassword!`
4. Click **Enter phpMyAdmin**.
5. Click **Import** and upload `/database/schema.sql`.

#### 3. Upload Project Files
1. Go to **File Manager** in hPanel.
2. Upload the project files into your application folder (e.g., `/home/u123456789/domains/yourdomain.com/public_html` or a dedicated app folder):
   - `dist/` (compiled build)
   - `server.ts` or compiled `server.js`
   - `package.json`
   - `.env`
   - `database/`
3. Exclude `node_modules` (they will be installed on the server).

#### 4. Configure Node.js in Hostinger hPanel
1. Navigate to **Advanced** → **Node.js** in hPanel.
2. Click **Create Application**:
   - **Node.js version**: 20.x or 22.x LTS
   - **Application mode**: `Production`
   - **Application root**: `public_html` (or your folder)
   - **Application startup file**: `server.ts` (using tsx) or `server.js`
   - **Application URL**: `yourdomain.com`
3. Click **Run NPM Install** to install dependencies.
4. Set Environment Variables in the Node.js settings panel:
   - `PORT`: (configured automatically by Hostinger passenger port or set to 3000)
   - `NODE_ENV`: `production`
   - `RAZORPAY_KEY_ID`: `rzp_live_...`
   - `RAZORPAY_KEY_SECRET`: `...`
   - `DB_HOST`: `localhost`
   - `DB_USER`: `u123456789_admin`
   - `DB_PASSWORD`: `YourStrongPassword!`
   - `DB_NAME`: `u123456789_lcw`

#### 5. Apache Reverse Proxy Configuration (`.htaccess`)
In `public_html/.htaccess`:
```apache
RewriteEngine On
RewriteCond %{HTTPS} !=on
RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

RewriteRule ^$ http://127.0.0.1:3000/ [P,L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ http://127.0.0.1:3000/$1 [P,L]
```

---

### Option B: Hostinger VPS (Ubuntu 22.04 / 24.04 with Nginx & PM2)

If using Hostinger VPS:
```bash
# 1. Update and install Node.js & MySQL
sudo apt update && sudo apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs nginx mysql-server

# 2. Setup project folder
sudo mkdir -p /var/www/littlecolourworld
sudo chown -R $USER:$USER /var/www/littlecolourworld
cd /var/www/littlecolourworld

# 3. Clone or upload your files, then install & build
npm install
npm run build

# 4. Start with PM2
npm install -g pm2
pm2 start server.ts --name "littlecolourworld" --interpreter tsx
pm2 startup
pm2 save

# 5. Configure Nginx Reverse Proxy
sudo nano /etc/nginx/sites-available/littlecolourworld
```
Nginx config:
```nginx
server {
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```
Enable and get free SSL with Certbot:
```bash
sudo ln -s /etc/nginx/sites-available/littlecolourworld /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## 4. Configuring Razorpay Webhook in Live Mode

1. Log in to your [Razorpay Dashboard](https://dashboard.razorpay.com/).
2. Go to **Settings** → **Webhooks**.
3. Click **Add New Webhook**.
4. Set Webhook URL to:
   `https://yourdomain.com/api/razorpay/webhook`
5. Secret: Enter a strong random secret and paste it as `RAZORPAY_WEBHOOK_SECRET` in your `.env`.
6. Select Active Events:
   - `order.paid`
   - `payment.captured`
   - `payment.failed`
7. Click **Save Webhook**.

---

## 5. Switching to Live Payments

1. Complete KYC verification on Razorpay.
2. In Razorpay Dashboard, toggle from **Test Mode** to **Live Mode**.
3. Go to **API Keys** and generate **Key ID** (`rzp_live_...`) and **Key Secret**.
4. In your Hostinger `.env` file, replace:
   ```env
   RAZORPAY_KEY_ID="rzp_live_xxxxxxxxxxxx"
   RAZORPAY_KEY_SECRET="xxxxxxxxxxxxxxxxxxxxxxxx"
   ```
5. Restart your Node.js application (`pm2 restart littlecolourworld` or restart in hPanel).
6. Perform a live test purchase of ₹29 using your real UPI / Google Pay to verify end-to-end receipt generation and immediate PDF delivery!
