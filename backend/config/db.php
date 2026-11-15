<?php
/**
 * Technova E-Commerce Platform - XAMPP MySQL PDO Connection
 * منصة تكنوفا للتجارة الإلكترونية - ملف اتصال قاعدة البيانات عبر PDO
 * 
 * المتطلبات: خادم XAMPP (Apache + MySQL)
 * الإعدادات الافتراضية: localhost | root | كلمة مرور فارغة | قاعدة technova_db
 */

// إعدادات الاتصال الافتراضية لبيئة XAMPP
define('DB_HOST', 'localhost');
define('DB_NAME', 'technova_db');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_CHARSET', 'utf8mb4');

/**
 * إنشاء وإرجاع اتصال PDO موحد بقاعدة البيانات
 * 
 * @return PDO
 * @throws PDOException
 */
function getDBConnection(): PDO {
    static $pdoInstance = null;

    if ($pdoInstance !== null) {
        return $pdoInstance;
    }

    $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
    
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION, // رمي استثناءات عند الأخطاء البرمجية
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,       // إرجاع النتائج كمصفوفات ترابطية
        PDO::ATTR_EMULATE_PREPARES   => false,                  // استخدام الاستعلامات المحضرة الحقيقية لحماية ضد حقن SQL
        PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci"
    ];

    try {
        $pdoInstance = new PDO($dsn, DB_USER, DB_PASS, $options);
        return $pdoInstance;
    } catch (PDOException $e) {
        // التحقق مما إذا كان الطلب عبارة عن استدعاء API (إرجاع JSON)
        $isApi = (!empty($_SERVER['HTTP_ACCEPT']) && strpos($_SERVER['HTTP_ACCEPT'], 'application/json') !== false) ||
                 (!empty($_SERVER['CONTENT_TYPE']) && strpos($_SERVER['CONTENT_TYPE'], 'application/json') !== false) ||
                 (strpos($_SERVER['REQUEST_URI'] ?? '', '/api/') !== false);

        if ($isApi) {
            http_response_code(500);
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'success' => false,
                'error'   => 'فشل الاتصال بقاعدة بيانات MySQL عبر XAMPP',
                'details' => $e->getMessage(),
                'hint'    => 'يرجى التأكد من تشغيل Apache و MySQL في لوحة تحكم XAMPP واستيراد ملف technova_schema.sql في phpMyAdmin.'
            ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
            exit;
        }

        // في حال العرض في المتصفح المباشر
        die("<h3>❌ خطأ في الاتصال بقاعدة بيانات تكنوفا (XAMPP MySQL)</h3>" .
            "<p><strong>السبب:</strong> " . htmlspecialchars($e->getMessage()) . "</p>" .
            "<p><strong>الحل:</strong> افتح لوحة XAMPP Control Panel، وتأكد من تشغيل <em>Apache</em> و <em>MySQL</em>، " .
            "ثم أنشئ قاعدة البيانات <code>technova_db</code> واستورد ملف <code>technova_schema.sql</code>.</p>");
    }
}

// متغير عام جاهز للاستخدام المباشر
$pdo = getDBConnection();
