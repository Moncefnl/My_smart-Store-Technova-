<?php
/**
 * Subscriptions & 1-Day Trial API
 * إدارة الاشتراكات التجريبية 24 ساعة والترقية اليدوية عبر CCP / BaridiMob
 */

require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/../config/db.php';

$pdo = getDBConnection();
$method = $_SERVER['REQUEST_METHOD'];

// 1. جلب تفاصيل الاشتراك وحساب المهلة المتبقية للـ 24 ساعة (GET)
if ($method === 'GET') {
    $merchantId = $_GET['merchant_id'] ?? 'merchant-admin-1';

    $stmt = $pdo->prepare("SELECT * FROM `subscriptions` WHERE `merchant_id` = ? ORDER BY `created_at` DESC LIMIT 1");
    $stmt->execute([$merchantId]);
    $sub = $stmt->fetch();

    if (!$sub) {
        // إنشاء اشتراك تجريبي 24 ساعة تلقائي إذا لم يوجد
        $now = new DateTime();
        $trialExpires = (clone $now)->modify('+24 hours');
        $subId = 'sub-' . time();

        $ins = $pdo->prepare("INSERT INTO `subscriptions` (
            `id`, `merchant_id`, `plan_id`, `billing_cycle`, `status`, `start_date`,
            `expiry_date`, `is_trial`, `trial_started_at`, `trial_expires_at`
        ) VALUES (?, ?, 'starter', 'monthly', 'trial', ?, ?, 1, ?, ?)");

        $ins->execute([
            $subId,
            $merchantId,
            $now->format('Y-m-d'),
            $trialExpires->format('Y-m-d'),
            $now->format('Y-m-d H:i:s'),
            $trialExpires->format('Y-m-d H:i:s')
        ]);

        $sub = [
            'id'               => $subId,
            'merchant_id'      => $merchantId,
            'plan_id'          => 'starter',
            'billing_cycle'    => 'monthly',
            'status'           => 'trial',
            'start_date'       => $now->format('Y-m-d'),
            'expiry_date'      => $trialExpires->format('Y-m-d'),
            'is_trial'         => 1,
            'trial_started_at' => $now->format('Y-m-d H:i:s'),
            'trial_expires_at' => $trialExpires->format('Y-m-d H:i:s')
        ];
    }

    $trialExpiresTimestamp = strtotime($sub['trial_expires_at']);
    $nowTimestamp = time();
    $remainingSeconds = max(0, $trialExpiresTimestamp - $nowTimestamp);
    $isTrialExpired = ($sub['is_trial'] == 1 && $remainingSeconds <= 0);

    // تحديث الحالة في قاعدة البيانات إلى expired إذا انتهت المهلة
    if ($isTrialExpired && $sub['status'] === 'trial') {
        $upd = $pdo->prepare("UPDATE `subscriptions` SET `status` = 'expired' WHERE `id` = ?");
        $upd->execute([$sub['id']]);
        $sub['status'] = 'expired';
    }

    $hours = floor($remainingSeconds / 3600);
    $minutes = floor(($remainingSeconds % 3600) / 60);
    $seconds = $remainingSeconds % 60;

    echo json_encode([
        'success'           => true,
        'subscription'      => $sub,
        'is_trial_active'   => ($sub['is_trial'] == 1 && !$isTrialExpired),
        'is_trial_expired'  => $isTrialExpired,
        'remaining_seconds' => $remainingSeconds,
        'countdown'         => sprintf('%02d:%02d:%02d', $hours, $minutes, $seconds),
        'starter_limits'    => [
            'max_stores'        => 1,
            'max_products'      => 25,
            'max_staff'         => 1,
            'max_landing_pages' => 2,
            'custom_domain'     => false,
            'fraud_shield'      => false
        ]
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// 2. ترقية الاشتراك عبر إرفاق وصل دفع (BaridiMob RIP / CCP) (POST)
if ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (empty($data['plan_id']) || empty($data['payment_method'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'الباقة وطريقة الدفع حقول مطلوبة'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $merchantId = $data['merchant_id'] ?? 'merchant-admin-1';
    $planId = $data['plan_id'];
    $cycle = $data['billing_cycle'] ?? 'monthly';
    $paymentMethod = $data['payment_method']; // 'baridimob' أو 'ccp'
    $receiptUrl = $data['receipt_url'] ?? null;
    $amount = (float) ($data['amount'] ?? 0);

    // تسجيل فاتورة جديدة
    $invId = 'INV-' . date('Y') . '-' . rand(1000, 9999);
    $invStmt = $pdo->prepare("INSERT INTO `subscription_invoices` (
        `id`, `merchant_id`, `plan_id`, `plan_name`, `amount`, `currency`,
        `billing_cycle`, `status`, `payment_method`, `receipt_url`, `transaction_id`, `invoice_date`
    ) VALUES (?, ?, ?, ?, ?, 'د.ج', ?, 'paid', ?, ?, ?, CURRENT_DATE())");

    $invStmt->execute([
        $invId,
        $merchantId,
        $planId,
        'ترقية باقة ' . strtoupper($planId),
        $amount,
        $cycle,
        $paymentMethod === 'baridimob' ? 'بريدي موب (BaridiMob RIP)' : 'حساب بريدي جاري (CCP)',
        $receiptUrl,
        'TXN-' . strtoupper(substr(md5(uniqid()), 0, 10))
    ]);

    // تفعيل الاشتراك الجديد
    $expiryMonths = ($cycle === 'yearly') ? 12 : 1;
    $newSubId = 'sub-' . time();
    $subIns = $pdo->prepare("INSERT INTO `subscriptions` (
        `id`, `merchant_id`, `plan_id`, `billing_cycle`, `status`, `start_date`,
        `expiry_date`, `is_trial`, `trial_started_at`, `trial_expires_at`, `payment_method`, `last_amount_paid`
    ) VALUES (?, ?, ?, ?, 'active', CURRENT_DATE(), DATE_ADD(CURRENT_DATE(), INTERVAL ? MONTH), 0, NOW(), NOW(), ?, ?)");

    $subIns->execute([
        $newSubId,
        $merchantId,
        $planId,
        $cycle,
        $expiryMonths,
        $paymentMethod,
        $amount
    ]);

    echo json_encode([
        'success'    => true,
        'message'    => 'تمت معالجة الترقية وتفعيل الاشتراك بنجاح في قاعدة بيانات MySQL 🎉',
        'invoice_id' => $invId,
        'plan_id'    => $planId
    ], JSON_UNESCAPED_UNICODE);
    exit;
}
