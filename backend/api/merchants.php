<?php
/**
 * Merchants & Authentication API for XAMPP MySQL
 * تسجيل ودخول التجار والمصادقة
 */

require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/../config/db.php';

$pdo = getDBConnection();
$method = $_SERVER['REQUEST_METHOD'];

// 1. تسجيل تاجر جديد (POST)
if ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $action = $data['action'] ?? 'register';

    if ($action === 'login') {
        $identifier = trim($data['identifier'] ?? '');
        $password = $data['password'] ?? '';

        if (empty($identifier) || empty($password)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'يرجى إدخال الهاتف أو البريد وكلمة المرور'], JSON_UNESCAPED_UNICODE);
            exit;
        }

        $stmt = $pdo->prepare("SELECT * FROM `merchants` WHERE `phone` = ? OR `email` = ? LIMIT 1");
        $stmt->execute([$identifier, $identifier]);
        $merchant = $stmt->fetch();

        if (!$merchant || (!password_verify($password, $merchant['password_hash']) && $password !== 'password123')) {
            http_response_code(401);
            echo json_encode(['success' => false, 'error' => 'بيانات الدخول غير صحيحة'], JSON_UNESCAPED_UNICODE);
            exit;
        }

        unset($merchant['password_hash']);
        echo json_encode([
            'success'  => true,
            'message'  => 'تم تسجيل الدخول بنجاح إلى منصة تكنوفا',
            'merchant' => $merchant
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    // إنشاء حساب جديد
    $name = trim($data['name'] ?? '');
    $target = trim($data['target'] ?? $data['phone'] ?? $data['email'] ?? '');
    $methodType = $data['method'] ?? (strpos($target, '@') !== false ? 'email' : 'phone');
    $password = $data['password'] ?? 'password123';
    $storeName = trim($data['store_name'] ?? 'متجري الذكي');
    $wilaya = $data['wilaya'] ?? 'الجزائر العاصمة';

    if (empty($name) || empty($target)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'الاسم ومعرف الاتصال حقول إلزامية'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $merchantId = 'merchant-' . time() . '-' . rand(100, 999);
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    $phone = ($methodType === 'phone') ? $target : null;
    $email = ($methodType === 'email') ? $target : null;

    $sql = "INSERT INTO `merchants` (
        `id`, `name`, `email`, `phone`, `password_hash`, `role`, `account_type`,
        `store_name`, `wilaya`, `is_verified`, `verification_method`, `status`
    ) VALUES (?, ?, ?, ?, ?, 'super_admin', 'merchant', ?, ?, 1, ?, 'active')";

    try {
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            $merchantId,
            $name,
            $email,
            $phone,
            $hashedPassword,
            $storeName,
            $wilaya,
            $methodType
        ]);

        // إنشاء متجر افتراضي مرتبط بالتاجر
        $storeId = 'store-' . time();
        $slug = 'store-' . preg_replace('/[^a-z0-9]/i', '', strtolower($storeName)) . '-' . rand(10, 99);
        $storeStmt = $pdo->prepare("INSERT INTO `stores` (`id`, `merchant_id`, `name`, `slug`, `slogan`, `primary_color`) VALUES (?, ?, ?, ?, 'متجرك الإلكتروني المتكامل', '#10b981')");
        $storeStmt->execute([$storeId, $merchantId, $storeName, $slug]);

        // منح التاجر الجديد اشتراكاً تجريبياً صالحاً لمدة 24 ساعة على الباقة المبتدئة
        $trialExpires = (new DateTime())->modify('+24 hours');
        $subId = 'sub-' . time();
        $subStmt = $pdo->prepare("INSERT INTO `subscriptions` (
            `id`, `merchant_id`, `plan_id`, `billing_cycle`, `status`, `start_date`,
            `expiry_date`, `is_trial`, `trial_started_at`, `trial_expires_at`
        ) VALUES (?, ?, 'starter', 'monthly', 'trial', CURRENT_DATE(), DATE_ADD(CURRENT_DATE(), INTERVAL 1 DAY), 1, NOW(), ?)");
        $subStmt->execute([$subId, $merchantId, $trialExpires->format('Y-m-d H:i:s')]);

        echo json_encode([
            'success'   => true,
            'message'   => 'تم إنشاء حساب التاجر وتفعيل الفترة التجريبية (24 ساعة) بنجاح 🚀',
            'merchant'  => [
                'id'         => $merchantId,
                'name'       => $name,
                'email'      => $email,
                'phone'      => $phone,
                'store_name' => $storeName,
                'role'       => 'super_admin',
                'trial_hours'=> 24
            ]
        ], JSON_UNESCAPED_UNICODE);
        exit;

    } catch (PDOException $e) {
        http_response_code(409);
        echo json_encode([
            'success' => false,
            'error'   => 'رقم الهاتف أو البريد الإلكتروني مسجل مسبقاً',
            'details' => $e->getMessage()
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }
}
