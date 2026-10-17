-- ============================================================
-- Little Colour World - MySQL Production Database Schema
-- Little Hands, Big Imagination! 🌈
-- Version: 1.0.0
-- Charset: utf8mb4 / utf8mb4_unicode_ci
-- Note: All monetary amounts are stored as INTEGER PAISE (1 INR = 100 paise)
-- ============================================================

CREATE DATABASE IF NOT EXISTS `little_colour_world`
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE `little_colour_world`;

-- Disable foreign key checks during setup
SET FOREIGN_KEY_CHECKS = 0;

-- 1. USERS (Registered Parents or Customer Profiles)
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `uuid` VARCHAR(36) NOT NULL UNIQUE,
  `full_name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(191) NOT NULL UNIQUE,
  `phone` VARCHAR(30) NULL,
  `password_hash` VARCHAR(255) NULL,
  `is_verified` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_users_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. ADMINS
DROP TABLE IF EXISTS `admins`;
CREATE TABLE `admins` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `email` VARCHAR(191) NOT NULL UNIQUE,
  `pin_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('super_admin', 'editor', 'support') NOT NULL DEFAULT 'super_admin',
  `last_login_at` DATETIME NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. CATEGORIES
DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `slug` VARCHAR(100) NOT NULL UNIQUE,
  `name` VARCHAR(100) NOT NULL,
  `description` TEXT NULL,
  `icon_svg` VARCHAR(50) NOT NULL DEFAULT 'lion',
  `pastel_bg_color` VARCHAR(20) NOT NULL DEFAULT '#FFF9D2',
  `accent_color` VARCHAR(20) NOT NULL DEFAULT '#FF8A65',
  `sort_order` INT NOT NULL DEFAULT 0,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_categories_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. PRODUCTS
DROP TABLE IF EXISTS `products`;
CREATE TABLE `products` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `category_id` INT UNSIGNED NOT NULL,
  `slug` VARCHAR(150) NOT NULL UNIQUE,
  `title` VARCHAR(200) NOT NULL,
  `short_description` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `age_group` VARCHAR(50) NOT NULL DEFAULT 'Ages 2–6',
  `page_count` INT NOT NULL DEFAULT 30,
  `file_format` VARCHAR(50) NOT NULL DEFAULT 'Printable PDF (A4)',
  `file_size_mb` DECIMAL(6,2) NOT NULL DEFAULT 5.00,
  `original_price_paise` INT UNSIGNED NOT NULL DEFAULT 12900,  -- ₹129.00
  `selling_price_paise` INT UNSIGNED NOT NULL DEFAULT 4900,   -- ₹49.00
  `is_featured` TINYINT(1) NOT NULL DEFAULT 0,
  `is_free` TINYINT(1) NOT NULL DEFAULT 0,
  `is_bestseller` TINYINT(1) NOT NULL DEFAULT 0,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `theme_color` VARCHAR(20) NOT NULL DEFAULT '#FFD93D',
  `total_downloads` INT UNSIGNED NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_products_category` (`category_id`),
  INDEX `idx_products_is_active` (`is_active`),
  INDEX `idx_products_is_free` (`is_free`),
  CONSTRAINT `fk_products_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. PRODUCT_FILES (Secure Private Storage references)
DROP TABLE IF EXISTS `product_files`;
CREATE TABLE `product_files` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `product_id` BIGINT UNSIGNED NOT NULL,
  `file_key` VARCHAR(255) NOT NULL UNIQUE,
  `storage_driver` ENUM('local', 's3', 'hostinger') NOT NULL DEFAULT 'local',
  `storage_path` VARCHAR(500) NOT NULL,
  `file_checksum_sha256` VARCHAR(64) NULL,
  `version` INT NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_product_files_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. PRODUCT_IMAGES (Sample page previews and covers)
DROP TABLE IF EXISTS `product_images`;
CREATE TABLE `product_images` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `product_id` BIGINT UNSIGNED NOT NULL,
  `image_url` VARCHAR(500) NOT NULL,
  `alt_text` VARCHAR(200) NOT NULL,
  `is_cover` TINYINT(1) NOT NULL DEFAULT 0,
  `display_order` INT NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_product_images_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. ORDERS
DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `order_number` VARCHAR(30) NOT NULL UNIQUE,
  `user_id` BIGINT UNSIGNED NULL,
  `parent_name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `phone` VARCHAR(30) NOT NULL,
  `subtotal_paise` INT UNSIGNED NOT NULL,
  `discount_paise` INT UNSIGNED NOT NULL DEFAULT 0,
  `total_paise` INT UNSIGNED NOT NULL,
  `coupon_code` VARCHAR(50) NULL,
  `razorpay_order_id` VARCHAR(100) NOT NULL UNIQUE,
  `status` ENUM('pending', 'paid', 'failed', 'refunded') NOT NULL DEFAULT 'pending',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_orders_email` (`email`),
  INDEX `idx_orders_status` (`status`),
  INDEX `idx_orders_rzp_order` (`razorpay_order_id`),
  CONSTRAINT `fk_orders_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. ORDER_ITEMS
DROP TABLE IF EXISTS `order_items`;
CREATE TABLE `order_items` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `order_id` BIGINT UNSIGNED NOT NULL,
  `product_id` BIGINT UNSIGNED NOT NULL,
  `title` VARCHAR(200) NOT NULL,
  `price_paise` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `idx_order_items_order` (`order_id`),
  CONSTRAINT `fk_order_items_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_order_items_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. PAYMENTS (Razorpay transaction log)
DROP TABLE IF EXISTS `payments`;
CREATE TABLE `payments` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `order_id` BIGINT UNSIGNED NOT NULL,
  `gateway` VARCHAR(50) NOT NULL DEFAULT 'razorpay',
  `razorpay_payment_id` VARCHAR(100) NOT NULL UNIQUE,
  `razorpay_order_id` VARCHAR(100) NOT NULL,
  `razorpay_signature` VARCHAR(255) NULL,
  `amount_paise` INT UNSIGNED NOT NULL,
  `payment_method` VARCHAR(50) NULL, -- 'upi', 'card', 'netbanking'
  `status` ENUM('captured', 'authorized', 'failed', 'refunded') NOT NULL DEFAULT 'captured',
  `gateway_payload` JSON NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_payments_order` (`order_id`),
  INDEX `idx_payments_rzp_pay_id` (`razorpay_payment_id`),
  CONSTRAINT `fk_payments_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. DOWNLOAD_TOKENS (Expiring secure links for purchased PDFs)
DROP TABLE IF EXISTS `download_tokens`;
CREATE TABLE `download_tokens` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `order_id` BIGINT UNSIGNED NOT NULL,
  `product_id` BIGINT UNSIGNED NOT NULL,
  `token` VARCHAR(64) NOT NULL UNIQUE,
  `download_count` INT UNSIGNED NOT NULL DEFAULT 0,
  `max_downloads` INT UNSIGNED NOT NULL DEFAULT 50,
  `expires_at` DATETIME NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_download_tokens_token` (`token`),
  CONSTRAINT `fk_download_tokens_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_download_tokens_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. COUPONS
DROP TABLE IF EXISTS `coupons`;
CREATE TABLE `coupons` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `code` VARCHAR(50) NOT NULL UNIQUE,
  `discount_percentage` TINYINT UNSIGNED NOT NULL,
  `min_order_paise` INT UNSIGNED NOT NULL DEFAULT 0,
  `max_discount_paise` INT UNSIGNED NOT NULL DEFAULT 10000,
  `description` VARCHAR(200) NOT NULL,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `usage_limit` INT NULL,
  `used_count` INT NOT NULL DEFAULT 0,
  `expires_at` DATETIME NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. COUPON_REDEMPTIONS
DROP TABLE IF EXISTS `coupon_redemptions`;
CREATE TABLE `coupon_redemptions` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `coupon_id` INT UNSIGNED NOT NULL,
  `order_id` BIGINT UNSIGNED NOT NULL,
  `discount_paise` INT UNSIGNED NOT NULL,
  `redeemed_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_coupon_redemptions_coupon` FOREIGN KEY (`coupon_id`) REFERENCES `coupons` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_coupon_redemptions_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 13. SCHOOL_ENQUIRIES
DROP TABLE IF EXISTS `school_enquiries`;
CREATE TABLE `school_enquiries` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `school_name` VARCHAR(200) NOT NULL,
  `contact_person` VARCHAR(150) NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `phone` VARCHAR(30) NOT NULL,
  `student_count` VARCHAR(50) NOT NULL,
  `grade_level` VARCHAR(100) NOT NULL,
  `message` TEXT NULL,
  `status` ENUM('new', 'contacted', 'fulfilled') NOT NULL DEFAULT 'new',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_school_enquiries_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 14. CONTACT_MESSAGES
DROP TABLE IF EXISTS `contact_messages`;
CREATE TABLE `contact_messages` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `phone` VARCHAR(30) NULL,
  `subject` VARCHAR(200) NOT NULL DEFAULT 'General Inquiry',
  `message` TEXT NOT NULL,
  `status` ENUM('unread', 'replied') NOT NULL DEFAULT 'unread',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 15. SITE_SETTINGS (Key-value store)
DROP TABLE IF EXISTS `site_settings`;
CREATE TABLE `site_settings` (
  `key_name` VARCHAR(100) NOT NULL PRIMARY KEY,
  `value_json` JSON NOT NULL,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 16. WEBHOOK_EVENTS (Razorpay idempotency & audit)
DROP TABLE IF EXISTS `webhook_events`;
CREATE TABLE `webhook_events` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `event_id` VARCHAR(100) NOT NULL UNIQUE,
  `event_type` VARCHAR(100) NOT NULL,
  `payload` JSON NOT NULL,
  `is_processed` TINYINT(1) NOT NULL DEFAULT 0,
  `received_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_webhook_events_id` (`event_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- SEED INITIAL DATA
-- ============================================================

INSERT INTO `categories` (`slug`, `name`, `icon_svg`, `pastel_bg_color`, `accent_color`, `sort_order`) VALUES
('animals-colouring', 'Animals Colouring', 'lion', '#FFF9D2', '#FF8A65', 1),
('alphabet-colouring', 'Alphabet Colouring', 'alphabet', '#E3F6FF', '#6BCBFF', 2),
('numbers-colouring', 'Numbers Colouring', 'numbers', '#EBFCEE', '#48BB78', 3),
('fruits-vegetables', 'Fruits & Vegetables', 'fruits', '#FFE8EC', '#F87171', 4),
('birds-colouring', 'Birds Colouring', 'birds', '#F3E8FF', '#A855F7', 5),
('vehicles-colouring', 'Vehicles Colouring', 'vehicle', '#E0F2FE', '#0EA5E9', 6),
('cartoon-colouring', 'Cartoon Colouring', 'cartoon', '#FEF3C7', '#D97706', 7),
('shapes-colours', 'Shapes & Colours', 'shapes', '#EDE9FE', '#8B5CF6', 8),
('tracing-worksheets', 'Tracing Worksheets', 'tracing', '#DCFCE7', '#16A34A', 9),
('nursery-activities', 'Nursery Activities', 'nursery', '#FFF1F2', '#E11D48', 10),
('festivals-celebrations', 'Festivals & Celebrations', 'festivals', '#FFEDD5', '#EA580C', 11),
('school-activity-packs', 'School Activity Packs', 'school', '#E0E7FF', '#4F46E5', 12);

INSERT INTO `coupons` (`code`, `discount_percentage`, `min_order_paise`, `max_discount_paise`, `description`, `is_active`) VALUES
('LITTLE10', 10, 4000, 6000, '10% off on any colouring book or worksheet', 1),
('SUPERMOM', 20, 8000, 12000, '20% off on all activity bundles for great moms', 1),
('SCHOOLPACK', 25, 12000, 25000, '25% educator bulk discount', 1);

INSERT INTO `site_settings` (`key_name`, `value_json`) VALUES
('brand_info', JSON_OBJECT(
  'name', 'Little Colour World',
  'tagline', 'Little Hands, Big Imagination!',
  'support_email', 'support@littlecolourworld.com',
  'support_phone', '+91 98765 43210',
  'currency', 'INR'
));
