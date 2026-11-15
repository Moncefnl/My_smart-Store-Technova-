# دليل تشغيل وربط منصة تكنوفا بقاعدة بيانات XAMPP MySQL

هذا المجلد يحتوي على ملفات اتصال قاعدة البيانات ونقاط النهاية (REST API) المبرمجة بلغة **PHP (PDO)** المتوافقة تماماً مع بيئة **XAMPP** المحلية في نظام Windows أو Linux أو macOS.

---

## 1. متطلبات التشغيل
- برنامج **XAMPP** مثبت على جهازك (موصى به: PHP 7.4 فما فوق أو PHP 8.x).
- تشغيل **Apache** و **MySQL** من لوحة `XAMPP Control Panel`.

---

## 2. خطوات التثبيت السريع في 3 دقائق

### الخطوة الأولى: نسخ ملفات الباك إند إلى XAMPP
قم بنسخ كامل مجلد `backend` وألصقه داخل مجلد `htdocs` في مسار تثبيت XAMPP:
- في ويندوز: `C:\xampp\htdocs\technova\`
بحيث يصبح هيكل المجلد كالتالي:
```
C:\xampp\htdocs\technova\
   ├── config\
   │    └── db.php
   ├── database\
   │    └── technova_schema.sql
   └── api\
        ├── cors.php
        ├── health.php
        ├── merchants.php
        ├── products.php
        ├── orders.php
        └── subscriptions.php
```

### الخطوة الثانية: استيراد قاعدة البيانات عبر phpMyAdmin
1. افتح المتصفح وانتقل إلى الرابط: `http://localhost/phpmyadmin/`
2. اضغط على زر **استيراد (Import)** من القائمة العلوية.
3. اختر ملف `technova_schema.sql` الموجود في المجلد:
   `C:\xampp\htdocs\technova\database\technova_schema.sql`
4. اضغط على زر **انطلق (Go)** أسفل الصفحة.
5. سيتم تلقائياً إنشاء قاعدة البيانات `technova_db` مع الجداول:
   - `merchants`: حسابات التجار وتسجيل الدخول.
   - `subscriptions`: إدارة فترة التجربة 24 ساعة والباقة المبتدئة.
   - `stores`: بيانات المتاجر.
   - `products`: المنتجات والأسعار والمخزون.
   - `orders`: طلبيات الزبائن والتوصيل.
   - `subscription_invoices`: فواتير الدفع اليدوي (CCP و BaridiMob).

---

## 3. اختبار الاتصال
افتح الرابط التالي في المتصفح للتأكد من نجاح الاتصال:
`http://localhost/technova/api/health.php`

إذا ظهرت النتيجة التالية، فالاتصال يعمل بنجاح 100%:
```json
{
  "success": true,
  "status": "connected",
  "database": "technova_db",
  "message": "اتصال قاعدة بيانات MySQL يعمل بنجاح وبكفاءة عالية! 🚀"
}
```

---

## 4. بيانات الاتصال الافتراضية المعتمدة
- **المضيف (Host):** `localhost`
- **اسم المستخدم (User):** `root`
- **كلمة المرور (Password):** فارغة `""`
- **اسم قاعدة البيانات (Database):** `technova_db`
- **الترميز:** `utf8mb4` (دعم كامل للعربية والرموز التعبيرية)
