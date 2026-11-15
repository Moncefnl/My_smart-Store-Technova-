<?php
/**
 * Healthcheck & Diagnostic API
 * فحص حالة اتصال MySQL وسيرفر XAMPP
 */

require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/../config/db.php';

try {
    $pdo = getDBConnection();
    
    // فحص الجداول الأساسية
    $tables = ['merchants', 'stores', 'subscriptions', 'products', 'orders'];
    $tableCounts = [];
    
    foreach ($tables as $table) {
        try {
            $stmt = $pdo->query("SELECT COUNT(*) as cnt FROM `{$table}`");
            $tableCounts[$table] = (int) $stmt->fetch()['cnt'];
        } catch (Exception $ex) {
            $tableCounts[$table] = 'غير موجود (يرجى استيراد ملف SQL)';
        }
    }

    echo json_encode([
        'success'      => true,
        'status'       => 'connected',
        'server'       => 'XAMPP (Apache + PHP ' . phpversion() . ')',
        'database'     => DB_NAME,
        'host'         => DB_HOST,
        'user'         => DB_USER,
        'timestamp'    => date('Y-m-d H:i:s'),
        'table_counts' => $tableCounts,
        'message'      => 'اتصال قاعدة بيانات MySQL يعمل بنجاح وبكفاءة عالية! 🚀'
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'status'  => 'error',
        'error'   => $e->getMessage(),
        'hint'    => 'يرجى التأكد من تشغيل وحدة MySQL في لوحة تحكم XAMPP واستيراد ملف technova_schema.sql في phpMyAdmin.'
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
}
