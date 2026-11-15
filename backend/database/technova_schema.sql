-- ============================================================
-- منصة تكنوفا للتجارة الإلكترونية - Technova Platform
-- استعلامات إنشاء وتجهيز قاعدة البيانات لبيئة XAMPP (MySQL)
-- الترميز الافتراضي: UTF8MB4 لدعم اللغة العربية والرموز التعبيرية
-- ============================================================

-- 1. إنشاء قاعدة البيانات
CREATE DATABASE IF NOT EXISTS `technova_db`
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE `technova_db`;

-- تعطيل فحص المفاتيح الخارجية مؤقتاً لتفادي تعارض الترتيب
SET FOREIGN_KEY_CHECKS = 0;

-- ------------------------------------------------------------
-- 2. جدول التجار وحسابات المنصة (merchants)
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `merchants`;
CREATE TABLE `merchants` (
  `id` VARCHAR(64) NOT NULL,
  `name` VARCHAR(150) NOT NULL COMMENT 'الاسم الكامل للتاجر',
  `email` VARCHAR(190) DEFAULT NULL COMMENT 'البريد الإلكتروني',
  `phone` VARCHAR(30) DEFAULT NULL COMMENT 'رقم الهاتف (الجزائر)',
  `password_hash` VARCHAR(255) NOT NULL COMMENT 'كلمة المرور المشفرة',
  `role` ENUM('super_admin', 'orders_manager', 'inventory_manager', 'marketer', 'support') NOT NULL DEFAULT 'super_admin' COMMENT 'الدور الوظيفي',
  `account_type` ENUM('merchant', 'customer') NOT NULL DEFAULT 'merchant' COMMENT 'نوع الحساب',
  `store_name` VARCHAR(150) DEFAULT 'متجري الذكي' COMMENT 'اسم المتجر الافتراضي',
  `wilaya` VARCHAR(80) DEFAULT 'الجزائر العاصمة' COMMENT 'الولاية',
  `avatar_url` TEXT DEFAULT NULL COMMENT 'رابط الصورة الشخصية',
  `is_verified` TINYINT(1) NOT NULL DEFAULT 1 COMMENT 'هل تم التحقق من الحساب بالرمز OTP',
  `verification_method` VARCHAR(20) NOT NULL DEFAULT 'phone' COMMENT 'طريقة التحقق (phone أو email)',
  `status` ENUM('active', 'suspended', 'pending') NOT NULL DEFAULT 'active' COMMENT 'حالة الحساب',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_merchant_email` (`email`),
  UNIQUE KEY `idx_merchant_phone` (`phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='جدول بيانات التجار وحسابات تسجيل الدخول';

-- ------------------------------------------------------------
-- 3. جدول المتاجر (stores)
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `stores`;
CREATE TABLE `stores` (
  `id` VARCHAR(64) NOT NULL,
  `merchant_id` VARCHAR(64) NOT NULL COMMENT 'معرف التاجر المالك',
  `name` VARCHAR(150) NOT NULL COMMENT 'اسم المتجر',
  `slug` VARCHAR(100) NOT NULL COMMENT 'المسار الدلالي (Slug)',
  `domain` VARCHAR(190) DEFAULT NULL COMMENT 'النطاق أو الرابط المخصص',
  `category` VARCHAR(80) NOT NULL DEFAULT 'general' COMMENT 'تصنيف المتجر',
  `currency` VARCHAR(20) NOT NULL DEFAULT 'د.ج' COMMENT 'عملة المتجر',
  `slogan` VARCHAR(255) DEFAULT 'متجرك الإلكتروني المتكامل للبيع والتوصيل السريع' COMMENT 'شعار المتجر',
  `logo_url` TEXT DEFAULT NULL COMMENT 'رابط الشعار',
  `primary_color` VARCHAR(30) NOT NULL DEFAULT '#10b981' COMMENT 'اللون الرئيسي للمتجر',
  `theme_style` ENUM('modern', 'minimal', 'bold', 'classic') NOT NULL DEFAULT 'modern',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_store_slug` (`slug`),
  KEY `idx_store_merchant` (`merchant_id`),
  CONSTRAINT `fk_stores_merchant` FOREIGN KEY (`merchant_id`) REFERENCES `merchants` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='جدول بيانات المتاجر الإلكترونية للتجار';

-- ------------------------------------------------------------
-- 4. جدول الاشتراكات والباقات مع إدارة الـ 24 ساعة التجريبية (subscriptions)
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `subscriptions`;
CREATE TABLE `subscriptions` (
  `id` VARCHAR(64) NOT NULL,
  `merchant_id` VARCHAR(64) NOT NULL COMMENT 'معرف التاجر',
  `plan_id` ENUM('starter', 'pro', 'enterprise') NOT NULL DEFAULT 'starter' COMMENT 'معرف الباقة',
  `billing_cycle` ENUM('monthly', 'yearly') NOT NULL DEFAULT 'monthly' COMMENT 'دورة الفوترة',
  `status` ENUM('trial', 'active', 'expired', 'cancelled', 'pending_payment') NOT NULL DEFAULT 'trial' COMMENT 'حالة الاشتراك',
  `start_date` DATE NOT NULL COMMENT 'تاريخ بدء الاشتراك',
  `expiry_date` DATE NOT NULL COMMENT 'تاريخ انتهاء الاشتراك',
  `is_trial` TINYINT(1) NOT NULL DEFAULT 1 COMMENT 'هل هو اشتراك تجريبي مجاني',
  `trial_started_at` DATETIME NOT NULL COMMENT 'وقت انطلاق الـ 24 ساعة التجريبية',
  `trial_expires_at` DATETIME NOT NULL COMMENT 'وقت انتهاء مهلة الـ 24 ساعة التجريبية بدقة',
  `payment_method` VARCHAR(50) DEFAULT NULL COMMENT 'طريقة الدفع (baridimob أو ccp)',
  `auto_renew` TINYINT(1) NOT NULL DEFAULT 0 COMMENT 'التجديد التلقائي',
  `last_amount_paid` DECIMAL(10,2) DEFAULT 0.00,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_sub_merchant` (`merchant_id`),
  KEY `idx_sub_status` (`status`),
  KEY `idx_sub_trial_exp` (`trial_expires_at`),
  CONSTRAINT `fk_sub_merchant` FOREIGN KEY (`merchant_id`) REFERENCES `merchants` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='جدول الاشتراكات وفترات التجربة المجانية 24 ساعة';

-- ------------------------------------------------------------
-- 5. جدول المنتجات (products)
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `products`;
CREATE TABLE `products` (
  `id` VARCHAR(64) NOT NULL,
  `store_id` VARCHAR(64) NOT NULL DEFAULT 'store-technova' COMMENT 'المتجر التابع له',
  `name` VARCHAR(255) NOT NULL COMMENT 'اسم المنتج',
  `name_ar` VARCHAR(255) DEFAULT NULL COMMENT 'الاسم بالعربية',
  `price` DECIMAL(10,2) NOT NULL COMMENT 'سعر البيع الحالي (د.ج)',
  `original_price` DECIMAL(10,2) DEFAULT NULL COMMENT 'السعر قبل الخصم (د.ج)',
  `cost_price` DECIMAL(10,2) DEFAULT NULL COMMENT 'سعر التكلفة للمنتج (د.ج)',
  `stock` INT NOT NULL DEFAULT 0 COMMENT 'الكمية المتوفرة في المخزن',
  `sku` VARCHAR(60) DEFAULT NULL COMMENT 'رمز التتبع الفريد (SKU)',
  `category` VARCHAR(100) NOT NULL DEFAULT 'عام' COMMENT 'قسم أو تصنيف المنتج',
  `image_url` TEXT DEFAULT NULL COMMENT 'رابط الصورة الرئيسية',
  `description` TEXT DEFAULT NULL COMMENT 'وصف المنتج ومميزاته',
  `is_active` TINYINT(1) NOT NULL DEFAULT 1 COMMENT 'هل المنتج معروض للبيع',
  `rating` DECIMAL(3,2) NOT NULL DEFAULT 5.00 COMMENT 'تقييم المنتج من 5',
  `reviews_count` INT NOT NULL DEFAULT 0 COMMENT 'عدد التقييمات',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_product_store` (`store_id`),
  KEY `idx_product_category` (`category`),
  KEY `idx_product_price` (`price`),
  CONSTRAINT `fk_products_store` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='جدول المنتجات والأسعار والمخزون';

-- ------------------------------------------------------------
-- 6. جدول الطلبات والمبيعات (orders)
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders` (
  `id` VARCHAR(64) NOT NULL,
  `store_id` VARCHAR(64) NOT NULL DEFAULT 'store-technova' COMMENT 'المتجر المستقبل للطلب',
  `order_number` VARCHAR(50) NOT NULL COMMENT 'رقم الطلب (مثال: ORD-2026-1001)',
  `customer_name` VARCHAR(150) NOT NULL COMMENT 'اسم الزبون الكامل',
  `customer_phone` VARCHAR(30) NOT NULL COMMENT 'رقم هاتف الزبون للتأكيد',
  `wilaya_code` VARCHAR(10) NOT NULL COMMENT 'رقم الولاية (01 إلى 58)',
  `wilaya_name` VARCHAR(80) NOT NULL COMMENT 'اسم الولاية الجزائرية',
  `commune` VARCHAR(100) NOT NULL COMMENT 'البلدية',
  `address` TEXT DEFAULT NULL COMMENT 'العنوان التفصيلي للتوصيل',
  `subtotal` DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT 'مجموع ثمن المنتجات',
  `shipping_fee` DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT 'تكلفة الشحن والتوصيل',
  `total_amount` DECIMAL(10,2) NOT NULL COMMENT 'المجموع الكلي المطلوب تحصيله (د.ج)',
  `status` ENUM('pending', 'confirmed', 'shipped', 'delivered', 'cancelled', 'returned') NOT NULL DEFAULT 'pending' COMMENT 'حالة الطلبية',
  `payment_method` VARCHAR(50) NOT NULL DEFAULT 'cod' COMMENT 'طريقة الدفع (الدفع عند الاستلام COD)',
  `notes` TEXT DEFAULT NULL COMMENT 'ملاحظات الزبون أو فريق التأكيد',
  `items_json` JSON NOT NULL COMMENT 'مصفوفة المنتجات المطلوبة وتفاصيلها بصيغة JSON',
  `call_attempts` INT NOT NULL DEFAULT 0 COMMENT 'عدد محاولات الاتصال بالزبون',
  `tracking_number` VARCHAR(80) DEFAULT NULL COMMENT 'رقم التتبع مع شركة التوصيل (Yalidine/ZR...)',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_order_number` (`order_number`),
  KEY `idx_order_store` (`store_id`),
  KEY `idx_order_phone` (`customer_phone`),
  KEY `idx_order_status` (`status`),
  KEY `idx_order_wilaya` (`wilaya_code`),
  CONSTRAINT `fk_orders_store` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='جدول الطلبيات والزبائن وتوصيل الـ 58 ولاية';

-- ------------------------------------------------------------
-- 7. جدول فواتير الاشتراكات والتحويلات اليدوية (subscription_invoices)
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `subscription_invoices`;
CREATE TABLE `subscription_invoices` (
  `id` VARCHAR(64) NOT NULL,
  `merchant_id` VARCHAR(64) DEFAULT NULL COMMENT 'معرف التاجر',
  `plan_id` VARCHAR(30) NOT NULL COMMENT 'معرف الباقة',
  `plan_name` VARCHAR(120) NOT NULL COMMENT 'اسم الباقة الكامل',
  `amount` DECIMAL(10,2) NOT NULL COMMENT 'المبلغ المدفوع (د.ج)',
  `currency` VARCHAR(20) NOT NULL DEFAULT 'د.ج',
  `billing_cycle` ENUM('monthly', 'yearly') NOT NULL DEFAULT 'monthly',
  `status` ENUM('paid', 'pending', 'failed') NOT NULL DEFAULT 'paid' COMMENT 'حالة الفاتورة',
  `payment_method` VARCHAR(80) NOT NULL COMMENT 'طريقة الدفع: بريدي موب (BaridiMob RIP) أو CCP',
  `receipt_url` TEXT DEFAULT NULL COMMENT 'رابط أو صورة وصل الدفع المرفق',
  `transaction_id` VARCHAR(100) DEFAULT NULL COMMENT 'رقم المعاملة أو المرجع',
  `invoice_date` DATE NOT NULL COMMENT 'تاريخ الفاتورة',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_inv_merchant` (`merchant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='سجلات فواتير الترقية وإيصالات الدفع اليدوي';

-- تمكين فحص المفاتيح الخارجية مجدداً
SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- 8. إدراج بيانات تجريبية أولية للاختبار المباشر (Seed Data)
-- ============================================================

-- إضافة التاجر الافتراضي (المدير العام)
INSERT INTO `merchants` (
  `id`, `name`, `email`, `phone`, `password_hash`, `role`, `account_type`,
  `store_name`, `wilaya`, `is_verified`, `verification_method`, `status`
) VALUES (
  'merchant-admin-1',
  'مراد العلواني',
  'admin@matjari.dz',
  '0550112233',
  '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- كلمة المرور الافتراضية: password123
  'super_admin',
  'merchant',
  'متجر تكنوفا الذكي',
  'الجزائر العاصمة',
  1,
  'phone',
  'active'
) ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- إضافة المتجر الأساسي
INSERT INTO `stores` (
  `id`, `merchant_id`, `name`, `slug`, `domain`, `category`, `currency`, `slogan`, `primary_color`
) VALUES (
  'store-technova',
  'merchant-admin-1',
  'متجر تكنوفا الذكي',
  'technova-store',
  'technova.shop.dz',
  'electronics',
  'د.ج',
  'أفضل المنتجات التقنية والإلكترونية في الجزائر بضمان التوصيل السريع والدفع عند الاستلام',
  '#10b981'
) ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- إضافة اشتراك تجريبي لمدة 24 ساعة (Starter Plan) يبدأ من اللحظة
INSERT INTO `subscriptions` (
  `id`, `merchant_id`, `plan_id`, `billing_cycle`, `status`, `start_date`, `expiry_date`,
  `is_trial`, `trial_started_at`, `trial_expires_at`, `payment_method`
) VALUES (
  'sub-trial-1',
  'merchant-admin-1',
  'starter',
  'monthly',
  'trial',
  CURRENT_DATE(),
  DATE_ADD(CURRENT_DATE(), INTERVAL 1 DAY),
  1,
  NOW(),
  DATE_ADD(NOW(), INTERVAL 24 HOUR),
  'baridimob'
) ON DUPLICATE KEY UPDATE `status` = VALUES(`status`);

-- إضافة عينة منتجات جاهزة (منتجات رابحة في السوق الجزائري)
INSERT INTO `products` (
  `id`, `store_id`, `name`, `name_ar`, `price`, `original_price`, `cost_price`, `stock`, `sku`, `category`, `image_url`, `description`, `is_active`
) VALUES 
(
  'prod-101',
  'store-technova',
  'ساعة ذكية Ultra Smart Watch T900',
  'ساعة ذكية مقاومة للماء مع شاشة AMOLED وتتبع النبض',
  4800.00,
  6500.00,
  2600.00,
  45,
  'WATCH-T900-BLK',
  'إلكترونيات',
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80',
  'ساعة ذكية فاخرة تدعم استقبال المكالمات ومراقبة نبضات القلب والنشاط الرياضي، متوافقة مع جميع هواتف Android و iPhone.',
  1
),
(
  'prod-102',
  'store-technova',
  'سماعات لاسلكية Pro Wireless ANC',
  'سماعات بلوتوث عازلة للضوضاء مع علبة شحن سريعة',
  3900.00,
  5200.00,
  1950.00,
  60,
  'EAR-PRO-WHT',
  'إلكترونيات',
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80',
  'سماعات بلوتوث متميزة بنظام عزل الضجيج الخارجي الفعال وبطارية تدوم حتى 28 ساعة من الاستماع المتواصل.',
  1
),
(
  'prod-103',
  'store-technova',
  'حقيبة ظهر أصلية مضادة للسرقة مع منفذ USB',
  'حقيبة سفر وحاسوب مقاومة للماء مع قفل أمان',
  3400.00,
  4500.00,
  1700.00,
  32,
  'BAG-USB-GRY',
  'حقائب وإكسسوارات',
  'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=80',
  'حقيبة عملية ومريحة جداً مناسبة للعمل والدراسة والسفر مع منفذ شحن USB خارجي وجيوب سرية للأغراض الثمينة.',
  1
)
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- إضافة عينة طلبيات مؤكدة للتجربة
INSERT INTO `orders` (
  `id`, `store_id`, `order_number`, `customer_name`, `customer_phone`, `wilaya_code`,
  `wilaya_name`, `commune`, `address`, `subtotal`, `shipping_fee`, `total_amount`,
  `status`, `payment_method`, `items_json`
) VALUES 
(
  'ord-1001',
  'store-technova',
  'ORD-2026-1001',
  'محمد بلحاج',
  '0661998877',
  '16',
  'الجزائر العاصمة',
  'باب الزوار',
  'حي زرهوني مختار عمارة 12 رقم 4',
  4800.00,
  400.00,
  5200.00,
  'confirmed',
  'cod',
  '[{"id":"prod-101","name":"ساعة ذكية Ultra Smart Watch T900","quantity":1,"price":4800}]'
),
(
  'ord-1002',
  'store-technova',
  'ORD-2026-1002',
  'سارة عماري',
  '0550443322',
  '31',
  'وهران',
  'السانية',
  'شارع الأمير عبد القادر بجانب المسجد',
  3900.00,
  600.00,
  4500.00,
  'shipped',
  'cod',
  '[{"id":"prod-102","name":"سماعات لاسلكية Pro Wireless ANC","quantity":1,"price":3900}]'
)
ON DUPLICATE KEY UPDATE `order_number` = VALUES(`order_number`);
