import React, { useState } from 'react';
import {
  Database,
  Server,
  Download,
  Copy,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  FileCode,
  Table,
  Terminal,
  ExternalLink,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface XamppHealthResponse {
  success: boolean;
  status: string;
  server?: string;
  database?: string;
  host?: string;
  user?: string;
  timestamp?: string;
  table_counts?: Record<string, number | string>;
  message?: string;
  error?: string;
  hint?: string;
}

export const XamppDatabaseManager: React.FC = () => {
  const { products, orders, currentUser, subscription, showNotification } = useStore();

  const [activeTab, setActiveTab] = useState<'sql' | 'pdo' | 'endpoints' | 'export'>('sql');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Connection testing state
  const [apiUrl, setApiUrl] = useState('http://localhost/technova/api/health.php');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<XamppHealthResponse | null>(null);
  const [testError, setTestError] = useState<string | null>(null);

  // Connection Mode State
  const [connectionMode, setConnectionMode] = useState<'hybrid' | 'live_mysql'>('hybrid');

  const copyToClipboard = (text: string, key: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    showNotification(`تم نسخ ${label} إلى الحافظة بنجاح 📋`, 'success');
    setTimeout(() => {
      setCopiedKey(null);
    }, 2500);
  };

  const downloadFile = (filename: string, content: string, contentType: string) => {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showNotification(`تم بدء تنزيل ملف ${filename} بنجاح 💾`, 'success');
  };

  const runConnectionTest = async () => {
    setIsTesting(true);
    setTestResult(null);
    setTestError(null);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: { Accept: 'application/json' },
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      const data = await response.json();
      setTestResult(data);
      if (data.success) {
        showNotification('تم الاتصال بنجاح بخادم XAMPP وقاعدة بيانات MySQL! 🚀', 'success');
      } else {
        setTestError(data.error || 'فشل الاتصال بقاعدة البيانات.');
      }
    } catch (err: unknown) {
      const error = err as Error;
      setTestError(
        error.name === 'AbortError'
          ? 'انتهت مهلة الاتصال (Timeout). تأكد من تشغيل Apache و MySQL في لوحة XAMPP.'
          : 'تعذر الوصول إلى الخادم المحلي. تأكد من تشغيل Apache و MySQL ونسخ ملفات الـ backend إلى C:/xampp/htdocs/technova.'
      );
    } finally {
      setIsTesting(false);
    }
  };

  // SQL Schema Definition
  const sqlSchemaCode = `-- ============================================================
-- منصة تكنوفا للتجارة الإلكترونية - Technova Platform
-- استعلامات إنشاء وتجهيز قاعدة البيانات لبيئة XAMPP (MySQL)
-- الترميز: UTF8MB4 لدعم اللغة العربية
-- ============================================================

CREATE DATABASE IF NOT EXISTS \`technova_db\`
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE \`technova_db\`;

-- 1. جدول التجار وحسابات المنصة
CREATE TABLE IF NOT EXISTS \`merchants\` (
  \`id\` VARCHAR(64) NOT NULL,
  \`name\` VARCHAR(150) NOT NULL,
  \`email\` VARCHAR(190) DEFAULT NULL,
  \`phone\` VARCHAR(30) DEFAULT NULL,
  \`password_hash\` VARCHAR(255) NOT NULL,
  \`role\` ENUM('super_admin', 'orders_manager', 'inventory_manager', 'marketer', 'support') NOT NULL DEFAULT 'super_admin',
  \`account_type\` ENUM('merchant', 'customer') NOT NULL DEFAULT 'merchant',
  \`store_name\` VARCHAR(150) DEFAULT 'متجري الذكي',
  \`wilaya\` VARCHAR(80) DEFAULT 'الجزائر العاصمة',
  \`is_verified\` TINYINT(1) NOT NULL DEFAULT 1,
  \`verification_method\` VARCHAR(20) NOT NULL DEFAULT 'phone',
  \`status\` ENUM('active', 'suspended', 'pending') NOT NULL DEFAULT 'active',
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`idx_merchant_email\` (\`email\`),
  UNIQUE KEY \`idx_merchant_phone\` (\`phone\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. جدول المتاجر
CREATE TABLE IF NOT EXISTS \`stores\` (
  \`id\` VARCHAR(64) NOT NULL,
  \`merchant_id\` VARCHAR(64) NOT NULL,
  \`name\` VARCHAR(150) NOT NULL,
  \`slug\` VARCHAR(100) NOT NULL,
  \`domain\` VARCHAR(190) DEFAULT NULL,
  \`category\` VARCHAR(80) NOT NULL DEFAULT 'general',
  \`currency\` VARCHAR(20) NOT NULL DEFAULT 'د.ج',
  \`slogan\` VARCHAR(255) DEFAULT 'متجرك الإلكتروني المتكامل',
  \`primary_color\` VARCHAR(30) NOT NULL DEFAULT '#10b981',
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`idx_store_slug\` (\`slug\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. جدول الاشتراكات وفترات التجربة المجانية (24 ساعة)
CREATE TABLE IF NOT EXISTS \`subscriptions\` (
  \`id\` VARCHAR(64) NOT NULL,
  \`merchant_id\` VARCHAR(64) NOT NULL,
  \`plan_id\` ENUM('starter', 'pro', 'enterprise') NOT NULL DEFAULT 'starter',
  \`billing_cycle\` ENUM('monthly', 'yearly') NOT NULL DEFAULT 'monthly',
  \`status\` ENUM('trial', 'active', 'expired', 'cancelled', 'pending_payment') NOT NULL DEFAULT 'trial',
  \`start_date\` DATE NOT NULL,
  \`expiry_date\` DATE NOT NULL,
  \`is_trial\` TINYINT(1) NOT NULL DEFAULT 1,
  \`trial_started_at\` DATETIME NOT NULL,
  \`trial_expires_at\` DATETIME NOT NULL,
  \`payment_method\` VARCHAR(50) DEFAULT NULL,
  \`auto_renew\` TINYINT(1) NOT NULL DEFAULT 0,
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  KEY \`idx_sub_merchant\` (\`merchant_id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. جدول المنتجات
CREATE TABLE IF NOT EXISTS \`products\` (
  \`id\` VARCHAR(64) NOT NULL,
  \`store_id\` VARCHAR(64) NOT NULL DEFAULT 'store-technova',
  \`name\` VARCHAR(255) NOT NULL,
  \`name_ar\` VARCHAR(255) DEFAULT NULL,
  \`price\` DECIMAL(10,2) NOT NULL,
  \`original_price\` DECIMAL(10,2) DEFAULT NULL,
  \`cost_price\` DECIMAL(10,2) DEFAULT NULL,
  \`stock\` INT NOT NULL DEFAULT 0,
  \`sku\` VARCHAR(60) DEFAULT NULL,
  \`category\` VARCHAR(100) NOT NULL DEFAULT 'عام',
  \`image_url\` TEXT DEFAULT NULL,
  \`description\` TEXT DEFAULT NULL,
  \`is_active\` TINYINT(1) NOT NULL DEFAULT 1,
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  KEY \`idx_product_store\` (\`store_id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. جدول الطلبات والمبيعات
CREATE TABLE IF NOT EXISTS \`orders\` (
  \`id\` VARCHAR(64) NOT NULL,
  \`store_id\` VARCHAR(64) NOT NULL DEFAULT 'store-technova',
  \`order_number\` VARCHAR(50) NOT NULL,
  \`customer_name\` VARCHAR(150) NOT NULL,
  \`customer_phone\` VARCHAR(30) NOT NULL,
  \`wilaya_code\` VARCHAR(10) NOT NULL,
  \`wilaya_name\` VARCHAR(80) NOT NULL,
  \`commune\` VARCHAR(100) NOT NULL,
  \`address\` TEXT DEFAULT NULL,
  \`subtotal\` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  \`shipping_fee\` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  \`total_amount\` DECIMAL(10,2) NOT NULL,
  \`status\` ENUM('pending', 'confirmed', 'shipped', 'delivered', 'cancelled', 'returned') NOT NULL DEFAULT 'pending',
  \`payment_method\` VARCHAR(50) NOT NULL DEFAULT 'cod',
  \`items_json\` JSON NOT NULL,
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`idx_order_number\` (\`order_number\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`;

  // PHP PDO Connection Script
  const phpPdoCode = `<?php
/**
 * Technova E-Commerce Platform - XAMPP MySQL PDO Connection
 * منصة تكنوفا - كود الاتصال بقاعدة البيانات عبر PDO
 * 
 * المضيف: localhost | المستخدم: root | كلمة المرور: فارغة | القاعدة: technova_db
 */

define('DB_HOST', 'localhost');
define('DB_NAME', 'technova_db');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_CHARSET', 'utf8mb4');

function getDBConnection(): PDO {
    static $pdoInstance = null;

    if ($pdoInstance !== null) {
        return $pdoInstance;
    }

    $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
    
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
        PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci"
    ];

    try {
        $pdoInstance = new PDO($dsn, DB_USER, DB_PASS, $options);
        return $pdoInstance;
    } catch (PDOException $e) {
        http_response_code(500);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode([
            'success' => false,
            'error'   => 'فشل الاتصال بقاعدة بيانات MySQL عبر XAMPP',
            'details' => $e->getMessage(),
            'hint'    => 'تأكد من تشغيل Apache و MySQL في XAMPP Control Panel واستيراد technova_schema.sql.'
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }
}

// إنشاء الاتصال العام
$pdo = getDBConnection();
`;

  // Generate Live SQL Inserts from current app state
  const generateLiveSqlDump = () => {
    let sql = `-- ====================================================\n`;
    sql += `-- نسخة احتياطية فورية لبيانات متجر تكنوفا\n`;
    sql += `-- تاريخ التصدير: ${new Date().toLocaleString('ar-DZ')}\n`;
    sql += `-- ====================================================\n\n`;
    sql += `USE \`technova_db\`;\n\n`;

    // Merchants
    sql += `-- بيانات التاجر الحالي\n`;
    sql += `INSERT INTO \`merchants\` (\`id\`, \`name\`, \`email\`, \`phone\`, \`password_hash\`, \`role\`, \`store_name\`, \`wilaya\`) VALUES (\n`;
    sql += `  '${currentUser?.id || 'merchant-admin-1'}',\n`;
    sql += `  '${currentUser?.name || 'مراد العلواني'}',\n`;
    sql += `  '${currentUser?.email || 'admin@matjari.dz'}',\n`;
    sql += `  '${currentUser?.phone || '0550112233'}',\n`;
    sql += `  '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',\n`;
    sql += `  '${currentUser?.role || 'super_admin'}',\n`;
    sql += `  '${currentUser?.storeName || 'متجر تكنوفا'}',\n`;
    sql += `  'الجزائر العاصمة'\n`;
    sql += `) ON DUPLICATE KEY UPDATE \`name\` = VALUES(\`name\`);\n\n`;

    // Products
    sql += `-- قائمة المنتجات الحالية (${products.length} منتج)\n`;
    products.forEach((p) => {
      const cleanName = (p.name || '').replace(/'/g, "''");
      const cleanDesc = (p.description || '').replace(/'/g, "''");
      const cleanCat = (p.category || 'عام').replace(/'/g, "''");
      sql += `INSERT INTO \`products\` (\`id\`, \`store_id\`, \`name\`, \`price\`, \`cost_price\`, \`stock\`, \`sku\`, \`category\`, \`image_url\`, \`description\`, \`is_active\`) VALUES (\n`;
      sql += `  '${p.id}', 'store-technova', '${cleanName}', ${p.price || 0}, ${p.costPrice || 0}, ${p.stock || 0}, '${p.sku || ''}', '${cleanCat}', '${p.images?.[0] || ''}', '${cleanDesc}', ${p.isPublished ? 1 : 0}\n`;
      sql += `) ON DUPLICATE KEY UPDATE \`name\` = VALUES(\`name\`), \`price\` = VALUES(\`price\`);\n`;
    });
    sql += `\n`;

    // Orders
    sql += `-- قائمة الطلبيات الأخيرة (${orders.length} طلبية)\n`;
    orders.forEach((o) => {
      const cleanCustomer = (o.customerName || '').replace(/'/g, "''");
      const cleanCommune = (o.commune || '').replace(/'/g, "''");
      const cleanAddress = (o.address || '').replace(/'/g, "''");
      const itemsStr = JSON.stringify(o.items || []).replace(/'/g, "''");
      sql += `INSERT INTO \`orders\` (\`id\`, \`store_id\`, \`order_number\`, \`customer_name\`, \`customer_phone\`, \`wilaya_code\`, \`wilaya_name\`, \`commune\`, \`address\`, \`total_amount\`, \`status\`, \`items_json\`) VALUES (\n`;
      sql += `  '${o.id}', 'store-technova', '${o.orderNumber || o.id}', '${cleanCustomer}', '${o.customerPhone || ''}', '${o.wilayaCode || '16'}', '${o.wilaya || 'الجزائر'}', '${cleanCommune}', '${cleanAddress}', ${o.totalAmount || 0}, '${o.status || 'pending'}', '${itemsStr}'\n`;
      sql += `) ON DUPLICATE KEY UPDATE \`status\` = VALUES(\`status\`);\n`;
    });

    return sql;
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 shrink-0">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-slate-900">ربط وتجهيز قاعدة البيانات (XAMPP / MySQL)</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  PDO Ready
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                إعدادات اتصال PDO واستعلامات SQL متكاملة متوافقة 100% مع بيئة XAMPP المحلية على منفذ MySQL الافتراضي (3306).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                downloadFile('technova_schema.sql', sqlSchemaCode, 'application/sql');
              }}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm shadow-emerald-600/20 shrink-0"
            >
              <Download className="w-4 h-4" />
              <span>تحميل technova_schema.sql</span>
            </button>
            <button
              onClick={() => {
                downloadFile('db.php', phpPdoCode, 'application/x-php');
              }}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0"
            >
              <Download className="w-4 h-4" />
              <span>تحميل db.php</span>
            </button>
          </div>
        </div>

        {/* Live Health Checker */}
        <div className="mt-6 pt-5 border-t border-slate-100 bg-slate-50/80 rounded-xl p-4 border border-slate-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-slate-500" />
                <span>رابط فحص صحة الاتصال المحلي (XAMPP Health Endpoint):</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={apiUrl}
                  onChange={(e) => setApiUrl(e.target.value)}
                  className="flex-1 px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  placeholder="http://localhost/technova/api/health.php"
                />
                <button
                  onClick={runConnectionTest}
                  disabled={isTesting}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
                  <span>{isTesting ? 'جاري الفحص...' : 'فحص الاتصال المباشر'}</span>
                </button>
              </div>
            </div>

            {/* Mode Switcher */}
            <div className="border-r border-slate-200 pr-4 shrink-0">
              <span className="block text-xs font-bold text-slate-700 mb-1.5">وضع تشغيل البيانات:</span>
              <div className="flex items-center gap-1 bg-slate-200/70 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => {
                    setConnectionMode('hybrid');
                    showNotification('تم تعيين وضع التشغيل: الوضع الهجين (عرض فوري + تصدير SQL) ⚡', 'info');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    connectionMode === 'hybrid'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  هجين (Hybrid)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setConnectionMode('live_mysql');
                    showNotification('تم تعيين وضع التشغيل: الاتصال المباشر بـ XAMPP MySQL 🔌', 'info');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    connectionMode === 'live_mysql'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  مباشر (XAMPP Live)
                </button>
              </div>
            </div>
          </div>

          {/* Test Feedback Result */}
          {testResult && testResult.success && (
            <div className="mt-3.5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="space-y-1 flex-1">
                <p className="font-bold">{testResult.message}</p>
                <div className="flex flex-wrap items-center gap-3 text-[11px] text-emerald-700 font-mono">
                  <span>السيرفر: {testResult.server}</span>
                  <span>•</span>
                  <span>قاعدة البيانات: {testResult.database}</span>
                  <span>•</span>
                  <span>المضيف: {testResult.host} ({testResult.user})</span>
                </div>
              </div>
            </div>
          )}

          {testError && (
            <div className="mt-3.5 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5 animate-in fade-in">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1 flex-1">
                <p className="font-bold">{testError}</p>
                <p className="text-[11px] text-amber-800">
                  تأكد من فتح برنامج XAMPP والضغط على Start أمام Apache و MySQL، ثم نسخ ملفات مجلد <code>backend</code> إلى <code>C:/xampp/htdocs/technova/</code>.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('sql')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'sql'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Table className="w-3.5 h-3.5" />
          <span>استعلامات الجداول (technova_schema.sql)</span>
        </button>

        <button
          onClick={() => setActiveTab('pdo')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'pdo'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <FileCode className="w-3.5 h-3.5" />
          <span>كود اتصال PDO (db.php)</span>
        </button>

        <button
          onClick={() => setActiveTab('endpoints')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'endpoints'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>نقاط نهاية الـ API الجاهزة</span>
        </button>

        <button
          onClick={() => setActiveTab('export')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'export'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>تصدير البيانات الحالية إلى SQL</span>
        </button>
      </div>

      {/* Tab 1: SQL Schema */}
      {activeTab === 'sql' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">استعلامات إنشاء الجداول (CREATE TABLE)</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                تنشئ قاعدة البيانات <code>technova_db</code> وجداول: <code>merchants</code>، <code>subscriptions</code> (مع عداد الـ 24 ساعة التجريبي)، <code>products</code>، <code>orders</code>، و<code>stores</code>.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => copyToClipboard(sqlSchemaCode, 'sql_schema', 'استعلامات SQL')}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition flex items-center gap-1.5"
              >
                {copiedKey === 'sql_schema' ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                <span>{copiedKey === 'sql_schema' ? 'تم النسخ!' : 'نسخ الكود'}</span>
              </button>
              <button
                onClick={() => downloadFile('technova_schema.sql', sqlSchemaCode, 'application/sql')}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>تنزيل الملف</span>
              </button>
            </div>
          </div>

          <div className="relative">
            <pre className="p-4 bg-slate-950 text-slate-200 rounded-xl text-xs font-mono overflow-x-auto max-h-[460px] leading-relaxed dir-ltr text-left selection:bg-emerald-500 selection:text-white">
              {sqlSchemaCode}
            </pre>
          </div>
        </div>
      )}

      {/* Tab 2: PHP PDO Connection */}
      {activeTab === 'pdo' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">ملف اتصال قاعدة البيانات عبر PDO (db.php)</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                معد مسبقاً لبيانات XAMPP الافتراضية: <code>localhost</code>، المستخدم <code>root</code>، كلمة مرور فارغة <code>""</code>، ودعم كامل للترميز العربي <code>utf8mb4</code>.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => copyToClipboard(phpPdoCode, 'pdo_code', 'كود اتصال PDO')}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition flex items-center gap-1.5"
              >
                {copiedKey === 'pdo_code' ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                <span>{copiedKey === 'pdo_code' ? 'تم النسخ!' : 'نسخ الكود'}</span>
              </button>
              <button
                onClick={() => downloadFile('db.php', phpPdoCode, 'application/x-php')}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>تنزيل db.php</span>
              </button>
            </div>
          </div>

          <div className="relative">
            <pre className="p-4 bg-slate-950 text-slate-200 rounded-xl text-xs font-mono overflow-x-auto max-h-[460px] leading-relaxed dir-ltr text-left selection:bg-emerald-500 selection:text-white">
              {phpPdoCode}
            </pre>
          </div>
        </div>
      )}

      {/* Tab 3: Endpoints & Directory Mapping */}
      {activeTab === 'endpoints' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">نقاط نهاية الـ REST API في مجلد XAMPP htdocs</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              الملفات التالية تم إنشاؤها في مجلد <code>backend/api/</code> وتعمل مباشرة عند نقلها لمجلد <code>C:/xampp/htdocs/technova/</code>:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-emerald-700">api/merchants.php</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">POST / GET</span>
              </div>
              <p className="text-xs text-slate-600">
                تسجيل التجار، تسجيل الدخول، فحص الصلاحيات، وتفعيل الفترة التجريبية 24 ساعة فور التسجيل.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-indigo-700">api/subscriptions.php</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800">GET / POST</span>
              </div>
              <p className="text-xs text-slate-600">
                حساب الوقت المتبقي لانتهاء الـ 24 ساعة، تقييد الباقة المبتدئة، واستقبال إيصالات CCP وبريدي موب.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-blue-700">api/products.php</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">CRUD API</span>
              </div>
              <p className="text-xs text-slate-600">
                جلب المنتجات، إضافة منتجات جديدة مع فحص حد الـ 25 منتج للباقة المبتدئة، والتحديث والحذف.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-purple-700">api/orders.php</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800">GET / POST / PUT</span>
              </div>
              <p className="text-xs text-slate-600">
                استقبال وحفظ طلبات الشراء من صفحة الهبوط أو المتجر، وتحديث حالة الطلبية والتوصيل للـ 58 ولاية.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 text-white space-y-3">
            <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>طريقة تشغيل الملفات في XAMPP بضغطة زر:</span>
            </h4>
            <ol className="text-xs text-slate-300 space-y-1.5 list-decimal list-inside leading-relaxed">
              <li>انسخ مجلد <code>backend</code> الموجود في المشروع إلى مسار <code>C:\xampp\htdocs\technova</code>.</li>
              <li>شغل <strong>Apache</strong> و <strong>MySQL</strong> من واجهة XAMPP Control Panel.</li>
              <li>افتح <code>http://localhost/phpmyadmin/</code> واستورد ملف <code>technova_schema.sql</code>.</li>
              <li>أصبح متجرك جاهزاً ومتصلاً بقاعدة البيانات المحلية بالكامل! 🚀</li>
            </ol>
          </div>
        </div>
      )}

      {/* Tab 4: Live Data Exporter */}
      {activeTab === 'export' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">تصدير بيانات متجرك الحالية كاستعلامات SQL</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                توليد استعلامات <code>INSERT INTO</code> فورية تحتوي على منتجاتك وطلبياتك وبيانات حسابك الحالي لاستيرادها فوراً في phpMyAdmin.
              </p>
            </div>
            <button
              onClick={() => {
                const dump = generateLiveSqlDump();
                downloadFile('technova_live_data.sql', dump, 'application/sql');
              }}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm shadow-emerald-600/20"
            >
              <Download className="w-4 h-4" />
              <span>تحميل نسخة SQL الاحتياطية</span>
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
              <span className="block text-[11px] text-slate-500 font-bold">المنتجات الجاهزة للتصدير</span>
              <span className="text-lg font-black text-slate-900 font-mono">{products.length}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
              <span className="block text-[11px] text-slate-500 font-bold">الطلبيات الجاهزة للتصدير</span>
              <span className="text-lg font-black text-slate-900 font-mono">{orders.length}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
              <span className="block text-[11px] text-slate-500 font-bold">حالة الاشتراك التجريبي</span>
              <span className="text-xs font-black text-emerald-600">{subscription.planId.toUpperCase()} (24h)</span>
            </div>
          </div>

          <div className="relative">
            <pre className="p-4 bg-slate-950 text-slate-200 rounded-xl text-xs font-mono overflow-x-auto max-h-[380px] leading-relaxed dir-ltr text-left selection:bg-emerald-500 selection:text-white">
              {generateLiveSqlDump()}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
