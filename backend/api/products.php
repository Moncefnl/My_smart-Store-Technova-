<?php
/**
 * Products REST API for XAMPP MySQL
 * جلب وإضافة وتحديث وحذف المنتجات عبر PDO
 */

require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/../config/db.php';

$pdo = getDBConnection();
$method = $_SERVER['REQUEST_METHOD'];

// 1. جلب المنتجات (GET)
if ($method === 'GET') {
    $storeId = $_GET['store_id'] ?? 'store-technova';
    $stmt = $pdo->prepare("SELECT * FROM `products` WHERE `store_id` = ? ORDER BY `created_at` DESC");
    $stmt->execute([$storeId]);
    $products = $stmt->fetchAll();

    echo json_encode([
        'success'  => true,
        'count'    => count($products),
        'products' => $products
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// 2. إضافة منتج جديد (POST)
if ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (empty($data['name']) || !isset($data['price'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'اسم المنتج وسعر البيع حقول مطلوبة'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $id = !empty($data['id']) ? $data['id'] : 'prod-' . time() . '-' . rand(100, 999);
    $storeId = $data['store_id'] ?? 'store-technova';

    // فحص حدود الباقة والاشتراك (Starter Plan limit 25 products)
    $subStmt = $pdo->prepare("SELECT * FROM `subscriptions` WHERE `status` IN ('active', 'trial') ORDER BY `created_at` DESC LIMIT 1");
    $subStmt->execute();
    $sub = $subStmt->fetch();

    if ($sub && ($sub['plan_id'] === 'starter' || $sub['is_trial'] == 1)) {
        // فحص مهلة الـ 24 ساعة إذا كان في فترة التجربة
        if ($sub['is_trial'] == 1 && strtotime($sub['trial_expires_at']) <= time()) {
            http_response_code(403);
            echo json_encode([
                'success' => false,
                'error'   => 'انتهت الفترة التجريبية (24 ساعة). يرجى الترقية وسداد الاشتراك عبر بريدي موب أو CCP لمواصلة إضافة المنتجات.'
            ], JSON_UNESCAPED_UNICODE);
            exit;
        }

        $countStmt = $pdo->prepare("SELECT COUNT(*) as cnt FROM `products` WHERE `store_id` = ?");
        $countStmt->execute([$storeId]);
        $prodCount = (int) $countStmt->fetch()['cnt'];

        if ($prodCount >= 25) {
            http_response_code(403);
            echo json_encode([
                'success' => false,
                'error'   => 'لقد بلغت الحد الأقصى للمنتجات في الباقة المبتدئة (25 منتج). يرجى الترقية للباقة الاحترافية لمنتجات غير محدودة.'
            ], JSON_UNESCAPED_UNICODE);
            exit;
        }
    }

    $sql = "INSERT INTO `products` (
        `id`, `store_id`, `name`, `name_ar`, `price`, `original_price`, `cost_price`,
        `stock`, `sku`, `category`, `image_url`, `description`, `is_active`
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        $id,
        $storeId,
        $data['name'],
        $data['name_ar'] ?? $data['name'],
        (float) $data['price'],
        isset($data['original_price']) ? (float) $data['original_price'] : null,
        isset($data['cost_price']) ? (float) $data['cost_price'] : null,
        (int) ($data['stock'] ?? 0),
        $data['sku'] ?? null,
        $data['category'] ?? 'عام',
        $data['image_url'] ?? null,
        $data['description'] ?? null,
        isset($data['is_active']) ? (int) $data['is_active'] : 1
    ]);

    echo json_encode([
        'success' => true,
        'message' => 'تمت إضافة المنتج بنجاح إلى قاعدة بيانات MySQL 🚀',
        'product' => array_merge(['id' => $id], $data)
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// 3. حذف منتج (DELETE)
if ($method === 'DELETE') {
    $id = $_GET['id'] ?? null;
    if (!$id) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'معرف المنتج id مطلوب'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $stmt = $pdo->prepare("DELETE FROM `products` WHERE `id` = ?");
    $stmt->execute([$id]);

    echo json_encode(['success' => true, 'message' => 'تم حذف المنتج بنجاح'], JSON_UNESCAPED_UNICODE);
    exit;
}
